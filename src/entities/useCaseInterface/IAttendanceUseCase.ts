import { Attendance } from "../models/Attendance.entities";

export interface IAttendanceUseCase {
    checkIn(employeeId: string): Promise<void>;
    checkOut(employeeId: string): Promise<void>;
    getTodayAttendance(employeeId: string): Promise<Attendance | null>;
    getAttendanceByMonth(employeeId: string, year: number, month: number): Promise<Attendance[] | []>;
    getAllAttendanceByDate(date: Date | null, page: number, pageSize: number): Promise<{ data: Attendance[] | [], total: number }>;
    updateStatus(id: string, status: "Present" | "Absent" | "Weekend" | "Holiday" | "Pending" | "Late"): Promise<Attendance | null>;
    requestRegularization(
        attendanceId: string,
        requestedBy: string,
        reason: string,
    ): Promise<Attendance | null>;

    respondToRegularizationRequest(
        attendanceId: string,
        action: "Approved" | "Rejected",
        adminRemarks?: string
    ): Promise<Attendance | null>;

    getAllPendingRegularizationRequests(): Promise<Attendance[]>;
}