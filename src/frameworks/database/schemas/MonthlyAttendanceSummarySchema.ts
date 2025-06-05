import { Schema } from "mongoose";
import { IMonthlyAttendanceSummaryModel } from "../models/MonthlyAttendanceSummaryModel";

export const MonthlyAttendanceSummarySchema = new Schema<IMonthlyAttendanceSummaryModel>(
    {
        employeeId: { type: Schema.Types.ObjectId, ref: "Employee", required: true },
        month: { type: Number, required: true },
        year: { type: Number, required: true },
        workingDays: { type: Number, required: true },
        presentDays: { type: Number, required: true },
        leaveDays: { type: Number, required: true },
        nonPaidLeaves : { type: Number, required: true },
        status: {
            type: String,
            enum: ["Pending", "Approved", "Rejected"],
            default: "Pending"
        },
        remarks: { type: String, default: "" },
        rejectionReason: { type: String, default: "" },
        generatedAt: { type: Date, default: Date.now }
    }
);