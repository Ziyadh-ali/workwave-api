import { Schema } from "mongoose";
import { ILeaveBalance } from "../models/LeaveBalanceModel";

export const LeaveBalanceSchema = new Schema<ILeaveBalance>(
    {
        employeeId: { type: Schema.Types.ObjectId, ref : "Employee" ,  required: true},
        leaveBalances: [
            {
                leaveTypeId: { type: Schema.Types.ObjectId, ref : "LeaveType",  required: true },
                availableDays: { type: Number, required: true },
                usedDays: { type: Number, default: 0 },
                totalDays : {type : Number ,  required : true}
            },
        ],
    }
);