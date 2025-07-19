import { LeaveRequest, LeaveRequestFilter } from "../models/LeaveRequest.entity";

export interface ILeaveRequestUseCase {
    createLeaveRequest(leaveRequest: LeaveRequest): Promise<LeaveRequest>;
    // getLeaveRequestForApproval(managerId: string): Promise<LeaveRequest[]>;
    getLeaveRequestByEmployee(oprions: {
        employeeId: string;
        page: number;
        limit: number;
        search: string;
        status: string;
    }): Promise<{ leaveRequests: LeaveRequest[]; totalPages: number }>;
    updateLeaveRequestStatus(leaveRequestId: string, status: "Approved" | "Rejected", rejectionReason?: string): Promise<boolean>;
    // editLeaveRequest(leaveRequestId: string, updates: Partial<LeaveRequest>): Promise<boolean>;
    cancelLeaveRequest(leaveRequestId: string): Promise<boolean>;
    getAllLeaveRequests(options: {
        page: number;
        limit: number;
        status: string;
    }): Promise<{ leaveRequests: LeaveRequest[]; totalPages: number }>;
    setRejectionReason(leaveRequestId: string, reason: string): Promise<void>;
    getFilteredLeaveRequests(filters: LeaveRequestFilter): Promise<LeaveRequest[]>
    getLeaveRequestById(leaveRequestId: string): Promise<LeaveRequest | null>;
}