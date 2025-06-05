import { LeaveRequest, LeaveRequestFilter } from "../models/LeaveRequest.entity";

export interface ILeaveRequestRepository {
    createLeaveRequest(leaveRequest: LeaveRequest): Promise<LeaveRequest>;
    // getLeaveRequestForApproval(managerId: string): Promise<LeaveRequest[]>;
    getLeaveRequestByEmployee(employeeId: string): Promise<LeaveRequest[]>;
    updateLeaveRequestStatus(leaveRequestId: string, status: "Approved" | "Rejected"): Promise<boolean>;
    // editLeaveRequest(leaveRequestId: string, updates: Partial<LeaveRequest>): Promise<boolean>;
    cancelLeaveRequest(leaveRequestId: string): Promise<boolean>; 
    getAllLeaveRequests(): Promise<LeaveRequest[]>
    getLeaveRequestById(leaveRequestId: string): Promise<LeaveRequest | null>;
    setRejectionReason(leaveRequestId: string, reason: string): Promise<void>;
    getLeaveRequestForDate(employeeId: string, date: Date): Promise<LeaveRequest | null>;
    getFilteredLeaveRequests(filters: LeaveRequestFilter): Promise<LeaveRequest[]>;
}