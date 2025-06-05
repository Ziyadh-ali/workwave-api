import { Schema } from "mongoose";
import { ILeaveRequest } from "../models/LeaveRequestModel";

export const LeaveRequestSchema = new Schema<ILeaveRequest>(
    {
        employeeId: { type: Schema.Types.ObjectId, ref: "Employee", required: true },
        leaveTypeId: { type: Schema.Types.ObjectId, ref: "LeaveType", required: true },
        startDate: { type: Date, required: true },
        endDate: { type: Date, required: true },
        reason: { type: String },
        duration : {type : String},
        status: { type: String, enum: ["Pending", "Approved", "Rejected","Cancelled"], default: "Pending" },
        assignedManager: { type: Schema.Types.ObjectId, ref: "Employee" },
        rejectionReason: { type: String},
    },{
        timestamps: { createdAt: true, updatedAt: true },
    }
);