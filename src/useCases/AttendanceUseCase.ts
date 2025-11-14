import { injectable, inject } from "tsyringe";
import { IAttendanceRepository } from "../entities/repositoryInterfaces/IAttendance.repository";
import { IAttendanceUseCase } from "../entities/useCaseInterface/IAttendanceUseCase";
import { HTTP_STATUS_CODES, MESSAGES } from "../shared/constants";
import { ILeaveRequestRepository } from "../entities/repositoryInterfaces/ILeaveRequest.repository";
import { fromIST, getDayRange, toIST } from "../shared/utils/dateUtils";
import { CustomError } from "../shared/errors/CustomError";
import { AttendanceResponseDTO } from "../entities/dtos/ResponseDTOs/AttendanceDTO";
import { AttendanceMapper } from "../entities/mapping/AttendanceMapper";
import { RegularizationRequestDTO } from "../entities/dtos/RequestDTOs/AttendanceDTO";

@injectable()
export class AttendanceUseCase implements IAttendanceUseCase {
    constructor(
        @inject("IAttendanceRepository") private _attendanceRepository: IAttendanceRepository,
        @inject("ILeaveRequestRepository") private _leaveRequestRepository: ILeaveRequestRepository,
    ) { }

    async checkIn(employeeId: string): Promise<void> {
        const nowUTC = new Date();
        const nowIST = toIST(nowUTC);

        const { startOfDay, endOfDay } = getDayRange(nowIST);

        const day = nowIST.getDay();
        if (day === 0 || day === 6) {
            throw new CustomError(MESSAGES.ERROR.ATTENDANCE.ON_WEEKEND, HTTP_STATUS_CODES.BAD_REQUEST);
        }

        const leave = await this._leaveRequestRepository.getLeaveRequestForDate(employeeId, nowIST);

        const existingAttendance = await this._attendanceRepository.getAttendanceByDate(employeeId, nowIST);
        if (existingAttendance?.checkInTime) {
            throw new CustomError(MESSAGES.ERROR.ATTENDANCE.ALREADY_CHECKED, HTTP_STATUS_CODES.BAD_REQUEST);
        }

        const attendance = await this._attendanceRepository.createAttendance(employeeId, fromIST(nowIST));

        const checkInCutOff = new Date(nowIST);
        checkInCutOff.setHours(10, 0, 0, 0);

        if (nowIST > checkInCutOff) {
            const isHalfDay = leave?.duration === "morning";
            if (!isHalfDay) {
                await this._attendanceRepository.updateStatus(attendance._id?.toString() || "", "Absent");
                throw new CustomError(MESSAGES.ERROR.ATTENDANCE.CUT_OFF_TIME, HTTP_STATUS_CODES.BAD_REQUEST);
            }
        }

        await this._attendanceRepository.markCheckIn(employeeId, fromIST(nowIST), startOfDay, endOfDay);
        await this._attendanceRepository.updateStatus(attendance._id?.toString() || "", "Pending");
    }


    async checkOut(employeeId: string): Promise<void> {
        const nowUTC = new Date();
        const nowIST = toIST(nowUTC);

        const { startOfDay, endOfDay } = getDayRange(nowIST);

        const attendance = await this._attendanceRepository.getAttendanceByDate(employeeId, nowIST);

        if (!attendance) {
            throw new CustomError("No attendance record found for today.", HTTP_STATUS_CODES.BAD_REQUEST);
        }

        if (attendance.checkOutTime) {
            throw new CustomError("You have already checked out.", HTTP_STATUS_CODES.BAD_REQUEST);
        }

        await this._attendanceRepository.markCheckOut(employeeId, fromIST(nowIST), startOfDay, endOfDay);

        if (!attendance.checkInTime) {
            await this._attendanceRepository.updateStatus(attendance._id?.toString() || "", "Absent");
            return;
        }

        const fivePM = new Date(nowIST);
        fivePM.setHours(17, 0, 0, 0);

        if (nowIST < fivePM) {
            await this._attendanceRepository.updateStatus(attendance._id?.toString() || "", "Absent");
        } else {
            await this._attendanceRepository.updateStatus(attendance._id?.toString() || "", "Present");
        }
    }
    async getTodayAttendance(employeeId: string): Promise<AttendanceResponseDTO | null> {
        const attendance = await this._attendanceRepository.getAttendanceByDate(employeeId, new Date());
        return attendance ? AttendanceMapper.toResponseDTO(attendance) : null;
    }

    async getAttendanceByMonth(employeeId: string, year: number, month: number): Promise<AttendanceResponseDTO[] | []> {
        const attendancesOfMonth = await this._attendanceRepository.getAttendanceByMonth(
            employeeId,
            year,
            month
        );

        return attendancesOfMonth ? AttendanceMapper.toResponseDTOs(attendancesOfMonth) : [];
    }

    async getAllAttendanceByDate(date: Date | null, page: number, pageSize: number): Promise<{ data: AttendanceResponseDTO[] | [], total: number }> {
        const attendances = await this._attendanceRepository.getAllAttendanceByDate(date, page, pageSize);
        return {
            data: AttendanceMapper.toResponseDTOs(attendances.data),
            total: attendances.total
        };
    }

    async updateStatus(id: string, status: "Present" | "Absent" | "Weekend" | "Holiday" | "Pending"): Promise<AttendanceResponseDTO | null> {
        const attendance = await this._attendanceRepository.updateStatus(id, status);
        return attendance ? AttendanceMapper.toResponseDTO(attendance) : null;
    }

    async updateAttendance(
        id: string,
        data: {
            status?: "Present" | "Absent" | "Weekend" | "Holiday" | "Pending" | "Late";
            checkInTime?: string;
            checkOutTime?: string;
        }
    ): Promise<AttendanceResponseDTO | null> {
        // NEW: Fetch existing to get the original date
        const existingAttendance = await this._attendanceRepository.findById(id);  // Assumes repo has findById; add if missing (see note below)
        if (!existingAttendance) {
            throw new CustomError("Attendance record not found", HTTP_STATUS_CODES.NOT_FOUND);
        }
        const baseDate = existingAttendance.date || new Date();  // Fallback to now if no date

        const updateData: {
            status?: "Present" | "Absent" | "Weekend" | "Holiday" | "Pending" | "Late";
            checkInTime?: Date;
            checkOutTime?: Date;
        } = {};

        if (data.status) updateData.status = data.status;

        if (data.checkInTime) {
            // parse "HH:MM"
            const timeParts = data.checkInTime.split(":").map(Number);
            if (timeParts.length !== 2 || isNaN(timeParts[0]) || isNaN(timeParts[1])) {
                throw new CustomError("Invalid check-in time format (use HH:MM)", HTTP_STATUS_CODES.BAD_REQUEST);
            }
            const [hours, minutes] = timeParts;

            // 1) convert baseDate (which is in UTC) -> IST local time Date object
            const baseIST = toIST(new Date(baseDate)); // baseDate is UTC moment, baseIST is local IST moment

            // 2) set the IST local time hours/minutes (mutates baseIST)
            baseIST.setHours(hours, minutes, 0, 0);

            // 3) convert that IST-local Date back to UTC instant for storage
            updateData.checkInTime = fromIST(baseIST);
        }

        if (data.checkOutTime) {
            const timeParts = data.checkOutTime.split(":").map(Number);
            if (timeParts.length !== 2 || isNaN(timeParts[0]) || isNaN(timeParts[1])) {
                throw new CustomError("Invalid check-out time format (use HH:MM)", HTTP_STATUS_CODES.BAD_REQUEST);
            }
            const [hours, minutes] = timeParts;
            const baseIST = toIST(new Date(baseDate));
            baseIST.setHours(hours, minutes, 0, 0);
            updateData.checkOutTime = fromIST(baseIST);
        }

        const attendance = await this._attendanceRepository.updateAttendance(id, updateData);
        return attendance ? AttendanceMapper.toResponseDTO(attendance) : null;
    }

    async getAllPendingRegularizationRequests(): Promise<AttendanceResponseDTO[]> {
        const attendances = await this._attendanceRepository.getAllPendingRegularizationRequests();
        return AttendanceMapper.toResponseDTOs(attendances);
    }

    async requestRegularization(attendanceId: string, request: Omit<RegularizationRequestDTO, "status">): Promise<AttendanceResponseDTO | null> {
        const regularizationRequest = await this._attendanceRepository.requestRegularization(attendanceId, request.requestedBy.toString(), request.reason);
        return regularizationRequest ? AttendanceMapper.toResponseDTO(regularizationRequest) : null;
    }

    async respondToRegularizationRequest(attendanceId: string, action: "Approved" | "Rejected", adminRemarks?: string): Promise<AttendanceResponseDTO | null> {
        const regularizationRequest = await this._attendanceRepository.respondToRegularizationRequest(attendanceId, action, adminRemarks);
        return regularizationRequest ? AttendanceMapper.toResponseDTO(regularizationRequest) : null;
    }
}