import { ObjectId } from "mongoose";

export interface LeaveBalanceResponseDTO {
  _id: string | ObjectId;
  employeeId: string | ObjectId;
  leaveBalances: {
    leaveTypeId: string | ObjectId;
    availableDays: number;
    usedDays: number;
    totalDays: number;
  }[];
}