import { ObjectId } from "mongoose";

export interface LeaveType {
    _id?: ObjectId|string,
    name: string,
    description?: string;
    maxDaysAllowed: number;
    isPaid: boolean;
    requiresApproval?: boolean;
}