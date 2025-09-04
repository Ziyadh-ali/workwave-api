import { ObjectId } from "mongoose";

export interface Attendance {
    _id ?: string | ObjectId,
    employeeId : ObjectId | string,
    date : Date,
    checkInTime : Date | null,
    checkOutTime : Date | null,
    status : "Present" | "Absent" | "Weekend" | "Holiday"| "Pending" | "Late",
    isRegularized?: boolean;
    isRegularizable?: boolean;
    regularizationRequest?: {
      requestedBy: string;
      reason: string;
      requestedStatus: "Present" | "Absent" | "Late" | "Leave";
      status: "Pending" | "Approved" | "Rejected";
      adminRemarks?: string;
    };  
}