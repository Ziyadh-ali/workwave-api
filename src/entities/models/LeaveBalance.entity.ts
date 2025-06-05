import { ObjectId } from "mongoose";

export interface LeaveBalance {
    _id ?: ObjectId | string;
    employeeId: ObjectId | string;
    leaveBalances: {
        leaveTypeId: string;
        availableDays: number;
        usedDays: number;
        totalDays : number;
    }[];
}