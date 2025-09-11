import { ObjectId } from "mongoose";

export interface LeaveBalanceResponseDTO {
  _id: string | ObjectId;
  employeeId: string | ObjectId;
  leaveBalances: {
    leaveTypeId: {
      _id: string | ObjectId;
      name: string;
    };
    availableDays: number;
    usedDays: number;
    totalDays: number;
  }[];
}