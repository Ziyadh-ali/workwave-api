import { ObjectId } from "mongoose";

export interface CreateLeaveRequestDTO {
  employeeId: string | ObjectId;
  leaveTypeId: string | ObjectId;
  startDate: Date;
  endDate: Date;
  reason?: string;
  duration?: "full" | "morning" | "afternoon";
  assignedManager?: string;
  employeeRole: string;
}

export interface UpdateLeaveRequestDTO {
  startDate?: string;
  endDate?: string;
  reason?: string;
  duration?: "full" | "morning" | "afternoon";
  status?: "Pending" | "Approved" | "Rejected" | "Cancelled";
  rejectionReason?: string;
  assignedManager?: string;
}