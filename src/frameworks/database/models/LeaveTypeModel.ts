import { Document , model , ObjectId } from "mongoose";
import { LeaveType } from "../../../entities/models/LeaveType.entity";
import { LeaveTypeSchema } from "../schemas/LeaveTypeSchema";


export interface ILeaveType extends Omit<LeaveType , "_id">,Document {
    _id : ObjectId;
}

export const LeaveTypeModel = model<ILeaveType>("LeaveType",LeaveTypeSchema);