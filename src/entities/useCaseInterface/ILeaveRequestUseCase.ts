import { LeaveRequest, LeaveRequestFilter } from "../models/LeaveRequest.entity";

export interface ILeaveRequestUseCase {
    createLeaveRequest(leaveRequest: LeaveRequest): Promise<LeaveRequest>;
    // getLeaveRequestForApproval(managerId: string): Promise<LeaveRequest[]>;
    getLeaveRequestByEmployee(employeeId: string): Promise<LeaveRequest[]>;
    updateLeaveRequestStatus(leaveRequestId: string, status: "Approved" | "Rejected" , rejectionReason ?: string): Promise<boolean>;
    // editLeaveRequest(leaveRequestId: string, updates: Partial<LeaveRequest>): Promise<boolean>;
    cancelLeaveRequest(leaveRequestId: string): Promise<boolean>;
    getAllLeaveRequests() : Promise<LeaveRequest[] >;
    setRejectionReason(leaveRequestId: string, reason: string): Promise<void>;
    getFilteredLeaveRequests(filters: LeaveRequestFilter): Promise<LeaveRequest[]>
}