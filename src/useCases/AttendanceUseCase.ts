import { injectable, inject } from "tsyringe";
import { IAttendanceRepository } from "../entities/repositoryInterfaces/IAttendance.repository";
import { IAttendanceUseCase } from "../entities/useCaseInterface/IAttendanceUseCase";
import { MESSAGES } from "../shared/constants";
import { ILeaveRequestRepository } from "../entities/repositoryInterfaces/ILeaveRequest.repository";
import { Attendance } from "../entities/models/Attendance.entities";
import { getDayRange } from "../shared/utils/dateUtils";

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
            throw new Error(MESSAGES.ERROR.ATTENDANCE.ON_WEEKEND);
        }
    
        const leave = await this.leaveRequestRepository.getLeaveRequestForDate(employeeId, now);
        
        if (leave && leave.duration === "full" && leave.status === "Approved") {
            throw new Error(MESSAGES.ERROR.ATTENDANCE.ON_FULLDAY_LEAVE);
        }
    
        const existingAttendance = await this.attendanceRepository.getAttendanceByDate(employeeId, now);
        if (existingAttendance?.checkInTime) {
            throw new Error(MESSAGES.ERROR.ATTENDANCE.ALREADY_CHECKED);
        }
    
        const attendance = await this.attendanceRepository.createAttendance(employeeId, now);
    
        const checkInCutOff = new Date(now);
        checkInCutOff.setHours(10, 0, 0, 0);
    
        if (now > checkInCutOff) {
            const isHalfDay = leave?.duration === "morning";
            if (!isHalfDay) {
                await this.attendanceRepository.updateStatus(attendance._id?.toString() || "", "Absent");
                throw new Error(MESSAGES.ERROR.ATTENDANCE.CUT_OFF_TIME);
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
            throw new Error("No attendance record found for today.");
        }

        if (attendance.checkOutTime) {
            throw new Error("You have already checked out.");
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

        // ✅ Duration Calculation (Optional but useful)
        const durationMs = now.getTime() - new Date(attendance.checkInTime).getTime();
        const durationHours = (durationMs / (1000 * 60 * 60)).toFixed(2);
        console.log(`✅ Work duration: ${durationHours} hours`);
    }

    async getTodayAttendance(employeeId: string): Promise<Attendance | null> {
        const attendace = await this.attendanceRepository.getAttendanceByDate(employeeId, new Date());
        return attendace
    }

    async getAttendanceByMonth(employeeId: string, year: number, month: number): Promise<Attendance[] | []> {
        const attendancesOfMonth = await this.attendanceRepository.getAttendanceByMonth(
            employeeId,
            year,
            month
        );

        return attendancesOfMonth;
    }

    async getAllAttendanceByDate(date: Date | null, page: number, pageSize: number): Promise<{ data: Attendance[]|[] , total: number }> {
        console.log(pageSize)
        return await this.attendanceRepository.getAllAttendanceByDate(date , page , pageSize);
    }

    async updateStatus(id: string, status: "Present" | "Absent" | "Weekend" | "Holiday" | "Pending"): Promise<Attendance | null> {
        return await this.attendanceRepository.updateStatus(id , status);
    }

    async getAllPendingRegularizationRequests(): Promise<Attendance[]> {
        return await this.attendanceRepository.getAllPendingRegularizationRequests();
    }

    async requestRegularization(attendanceId: string, requestedBy: string, reason: string): Promise<Attendance | null> {
        return await this.attendanceRepository.requestRegularization(attendanceId , requestedBy,reason );
    }

    async respondToRegularizationRequest(attendanceId: string, action: "Approved" | "Rejected", adminRemarks?: string): Promise<Attendance | null> {
        return await this.attendanceRepository.respondToRegularizationRequest(attendanceId,action,adminRemarks);
    }
}