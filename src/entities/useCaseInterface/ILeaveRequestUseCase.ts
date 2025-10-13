import { CreateLeaveRequestDTO } from "../dtos/RequestDTOs/LeaveRequestDTO";
import { LeaveRequestAdminResponseDTO, LeaveRequestResponseDTO } from "../dtos/ResponseDTOs/LeaveRequestDTO";
import { LeaveRequest, LeaveRequestFilter } from "../models/LeaveRequest.entity";

export interface ILeaveRequestUseCase {
    createLeaveRequest(leaveRequest: CreateLeaveRequestDTO): Promise<LeaveRequest>;
    getLeaveRequestByEmployee(options: {
        employeeId: string;
        page: number;
        limit: number;
        search: string;
        status: string;
    }): Promise<{ leaveRequests: LeaveRequestResponseDTO[]; totalPages: number }>;
    updateLeaveRequestStatus(leaveRequestId: string, status: "Approved" | "Rejected", rejectionReason?: string): Promise<boolean>;
    cancelLeaveRequest(leaveRequestId: string): Promise<boolean>;
    getAllLeaveRequests(options: {
        page: number;
        limit: number;
        status: string;
    }): Promise<{ leaveRequests: LeaveRequestAdminResponseDTO[]; totalPages: number }>;
    setRejectionReason(leaveRequestId: string, reason: string): Promise<void>;
    getFilteredLeaveRequests(filters: LeaveRequestFilter): Promise<LeaveRequestAdminResponseDTO[]>;
    getLeaveRequestById(leaveRequestId: string): Promise<LeaveRequestResponseDTO | null>;
    getEveryRequests(): Promise<LeaveRequestAdminResponseDTO[] | []>
}