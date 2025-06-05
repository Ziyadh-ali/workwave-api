import { ObjectId } from "mongoose";

export interface LeaveRequest {
    _id?: ObjectId | string;
    employeeId: ObjectId | string;
    leaveTypeId: ObjectId | string;
    startDate: Date;
    endDate: Date;
    reason?: string;
    duration?: "full" | "morning" | "afternoon";
    status?: "Pending" | "Approved" | "Rejected" | "Cancelled";
    rejectionReason?: string;
    assignedManager?: ObjectId | string;
    userRole: string
}

export interface LeaveRequestFilter {
    status?: "Pending" | "Approved" | "Rejected";
    userRole?: string;
    startDate?: Date;
    endDate?: Date;
    search?: string;
}