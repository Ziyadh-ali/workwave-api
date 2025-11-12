import { Document , model , ObjectId } from "mongoose";
import { LeaveBalance } from "../../../entities/models/LeaveBalance.entity";
import { LeaveBalanceSchema } from "../schemas/LeaveBalanceSchema";

export interface ILeaveBalance extends Omit<LeaveBalance , "_id">,Document {
    _id : ObjectId;
}

export const LeaveBalanceModel = model<ILeaveBalance>("LeaveBalance",LeaveBalanceSchema);