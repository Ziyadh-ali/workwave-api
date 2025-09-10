import { ObjectId } from "mongoose";

export interface LeaveRequestResponseDTO {
  _id: string;
  employeeId: string;
  leaveTypeId: {
    _id : string | ObjectId;
    name : string
  };
  startDate: string;
  endDate: string;
  reason?: string;
  duration?: "full" | "morning" | "afternoon";
  status: "Pending" | "Approved" | "Rejected" | "Cancelled";
  rejectionReason?: string;
  assignedManager?: string;
  userRole: string;
}

export interface LeaveRequestAdminResponseDTO {
  _id: string;
  employeeId: {
    _id : string | ObjectId,
    fullName : string,
    role : string
  };
  leaveTypeId: {
    _id : string | ObjectId;
    name : string
  };
  startDate: string;
  endDate: string;
  reason?: string;
  duration?: "full" | "morning" | "afternoon";
  status: "Pending" | "Approved" | "Rejected" | "Cancelled";
  rejectionReason?: string;
  assignedManager?: string;
  userRole: string;
}