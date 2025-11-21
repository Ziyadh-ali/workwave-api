import { RegularizationRequestDTO, UpdateAttendanceRequestDTO } from "../dtos/RequestDTOs/AttendanceDTO";
import { AttendanceResponseDTO } from "../dtos/ResponseDTOs/AttendanceDTO";

export interface IAttendanceUseCase {
    checkIn(employeeId: string): Promise<void>;
    checkOut(employeeId: string): Promise<void>;
    getTodayAttendance(employeeId: string): Promise<AttendanceResponseDTO | null>;
    getAttendanceByMonth(employeeId: string, year: number, month: number): Promise<AttendanceResponseDTO[] | []>;
    getAllAttendanceByDate(date: Date | null, page: number, pageSize: number): Promise<{ data: AttendanceResponseDTO[] | [], total: number }>;
    updateStatus(id: string, status: "Present" | "Absent" | "Weekend" | "Holiday" | "Pending" | "Late"): Promise<AttendanceResponseDTO | null>;
    requestRegularization(
        attendanceId: string,
        request: Omit<RegularizationRequestDTO, "status"> 
    ): Promise<AttendanceResponseDTO | null>;

    respondToRegularizationRequest(
        attendanceId: string,
        action: "Approved" | "Rejected",
        adminRemarks?: string
    ): Promise<AttendanceResponseDTO | null>;

    getAllPendingRegularizationRequests(): Promise<AttendanceResponseDTO[]>;

    updateAttendance(
        id: string,
        data: UpdateAttendanceRequestDTO
    ): Promise<AttendanceResponseDTO | null>;
}