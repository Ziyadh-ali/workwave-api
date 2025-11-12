import { Document , model , ObjectId } from "mongoose";
import { LeaveRequest } from "../../../entities/models/LeaveRequest.entity";
import { LeaveRequestSchema } from "../schemas/LeaveRequestSchema";


export interface ILeaveRequest extends Omit<LeaveRequest , "_id">,Document {
    _id : ObjectId;
}

export const LeaveRequestModel = model<ILeaveRequest>("LeaveRequest",LeaveRequestSchema);