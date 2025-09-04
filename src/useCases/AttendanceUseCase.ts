import { injectable, inject } from "tsyringe";
import { IAttendanceRepository } from "../entities/repositoryInterfaces/IAttendance.repository";
import { IAttendanceUseCase } from "../entities/useCaseInterface/IAttendanceUseCase";
import { HTTP_STATUS_CODES, MESSAGES } from "../shared/constants";
import { ILeaveRequestRepository } from "../entities/repositoryInterfaces/ILeaveRequest.repository";
import { getDayRange } from "../shared/utils/dateUtils";
import { CustomError } from "../shared/errors/CustomError";
import { AttendanceResponseDTO } from "../entities/dtos/ResponseDTOs/AttendanceDTO";
import { AttendanceMapper } from "../entities/mapping/AttendanceMapper";
import { RegularizationRequestDTO } from "../entities/dtos/RequestDTOs/AttendanceDTO";

@injectable()
export class AttendanceUseCase implements IAttendanceUseCase {
    constructor(
        @inject("IAttendanceRepository") private attendanceRepository: IAttendanceRepository,
        @inject("ILeaveRequestRepository") private leaveRequestRepository: ILeaveRequestRepository,
    ) { }

    async checkIn(employeeId: string): Promise<void> {
        const now = new Date();
        const { startOfDay, endOfDay } = getDayRange(now);

        const day = now.getDay();
        if (day === 0 || day === 6) {
            throw new CustomError(MESSAGES.ERROR.ATTENDANCE.ON_WEEKEND , HTTP_STATUS_CODES.BAD_REQUEST);
        }

        const leave = await this.leaveRequestRepository.getLeaveRequestForDate(employeeId, now);

        if (leave && leave.duration === "full" && leave.status === "Approved") {
            throw new CustomError(MESSAGES.ERROR.ATTENDANCE.ON_FULLDAY_LEAVE , HTTP_STATUS_CODES.BAD_REQUEST);
        }

        const existingAttendance = await this.attendanceRepository.getAttendanceByDate(employeeId, now);
        if (existingAttendance?.checkInTime) {
            throw new CustomError(MESSAGES.ERROR.ATTENDANCE.ALREADY_CHECKED , HTTP_STATUS_CODES.BAD_REQUEST);
        }

        const attendance = await this.attendanceRepository.createAttendance(employeeId, now);

        const checkInCutOff = new Date(now);
        checkInCutOff.setHours(10, 0, 0, 0);

        if (now > checkInCutOff) {
            const isHalfDay = leave?.duration === "morning";
            if (!isHalfDay) {
                await this.attendanceRepository.updateStatus(attendance._id?.toString() || "", "Absent");
                throw new CustomError(MESSAGES.ERROR.ATTENDANCE.CUT_OFF_TIME , HTTP_STATUS_CODES.BAD_REQUEST);
            }
        }

        await this.attendanceRepository.markCheckIn(employeeId, now, startOfDay, endOfDay);
        await this.attendanceRepository.updateStatus(attendance._id?.toString() || "", "Pending");
    }


    async checkOut(employeeId: string): Promise<void> {
        const now = new Date();
        const { startOfDay, endOfDay } = getDayRange(now);

        const attendance = await this.attendanceRepository.getAttendanceByDate(employeeId, now);

        if (!attendance) {
            throw new CustomError("No attendance record found for today." , HTTP_STATUS_CODES.BAD_REQUEST);
        }

        if (attendance.checkOutTime) {
            throw new CustomError("You have already checked out." , HTTP_STATUS_CODES.BAD_REQUEST);
        }

        await this.attendanceRepository.markCheckOut(employeeId, now, startOfDay, endOfDay);

        if (!attendance.checkInTime) {
            await this.attendanceRepository.updateStatus(attendance._id?.toString() || "", "Absent");
            return;
        }

        const fivePM = new Date(now);
        fivePM.setHours(17, 0, 0, 0);

        if (now < fivePM) {
            await this.attendanceRepository.updateStatus(attendance._id?.toString() || "", "Absent");
        } else {
            await this.attendanceRepository.updateStatus(attendance._id?.toString() || "", "Present");
        }

        const durationMs = now.getTime() - new Date(attendance.checkInTime).getTime();
        const durationHours = (durationMs / (1000 * 60 * 60)).toFixed(2);
        console.log(`✅ Work duration: ${durationHours} hours`);
    }

    async getTodayAttendance(employeeId: string): Promise<AttendanceResponseDTO | null> {
        const attendance = await this.attendanceRepository.getAttendanceByDate(employeeId, new Date());
        return attendance ? AttendanceMapper.toResponseDTO(attendance) : null;
    }

    async getAttendanceByMonth(employeeId: string, year: number, month: number): Promise<AttendanceResponseDTO[] | []> {
        const attendancesOfMonth = await this.attendanceRepository.getAttendanceByMonth(
            employeeId,
            year,
            month
        );

        return attendancesOfMonth ? AttendanceMapper.toResponseDTOs(attendancesOfMonth) : [];
    }

    async getAllAttendanceByDate(date: Date | null, page: number, pageSize: number): Promise<{ data: AttendanceResponseDTO[] | [], total: number }> {
        const attendances =  await this.attendanceRepository.getAllAttendanceByDate(date, page, pageSize);
        return {
            data: AttendanceMapper.toResponseDTOs(attendances.data),
            total: attendances.total
        };
    }

    async updateStatus(id: string, status: "Present" | "Absent" | "Weekend" | "Holiday" | "Pending"): Promise<AttendanceResponseDTO | null> {
        const attendance =  await this.attendanceRepository.updateStatus(id, status);
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
        const updateData: {
            status?: "Present" | "Absent" | "Weekend" | "Holiday" | "Pending" | "Late";
            checkInTime?: Date;
            checkOutTime?: Date;
        } = {};

        if (data.status) updateData.status = data.status;

        if (data.checkInTime) {
            if (typeof data.checkInTime === "string") {
                const [hours, minutes] = data.checkInTime.split(":").map(Number);
                const checkInDate = new Date();
                checkInDate.setUTCHours(hours, minutes, 0, 0);
                updateData.checkInTime = checkInDate;
            } else {
                updateData.checkInTime = data.checkInTime;
            }
        }

        if (data.checkOutTime) {
            if (typeof data.checkOutTime === "string") {
                const [hours, minutes] = data.checkOutTime.split(":").map(Number);
                const checkOutDate = new Date();
                checkOutDate.setUTCHours(hours, minutes, 0, 0);
                updateData.checkOutTime = checkOutDate;
            } else {
                updateData.checkOutTime = data.checkOutTime;
            }
        }

        const attendance =  await this.attendanceRepository.updateAttendance(id, updateData);
        return attendance ? AttendanceMapper.toResponseDTO(attendance) : null;
    }

    async getAllPendingRegularizationRequests(): Promise<AttendanceResponseDTO[]> {
        const attendances =  await this.attendanceRepository.getAllPendingRegularizationRequests();
        return AttendanceMapper.toResponseDTOs(attendances);
    }

    async requestRegularization(attendanceId: string, request: Omit<RegularizationRequestDTO, "status">): Promise<AttendanceResponseDTO | null> {
        const regularizationRequest =  await this.attendanceRepository.requestRegularization(attendanceId, request.requestedBy, request.reason);
        return regularizationRequest ? AttendanceMapper.toResponseDTO(regularizationRequest) : null;
    }

    async respondToRegularizationRequest(attendanceId: string, action: "Approved" | "Rejected", adminRemarks?: string): Promise<AttendanceResponseDTO | null> {
        const regularizationRequest =  await this.attendanceRepository.respondToRegularizationRequest(attendanceId, action, adminRemarks);
        return regularizationRequest ? AttendanceMapper.toResponseDTO(regularizationRequest) : null;
    }
}