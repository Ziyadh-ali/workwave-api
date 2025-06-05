import { Schema } from "mongoose";
import { IAttendanceModel } from "../models/AttendanceModel";

export const AttendanceSchema = new Schema<IAttendanceModel>({
    employeeId: { type: Schema.Types.ObjectId, ref: "Employee", required: true },
    date: { type: Date, required: true, },
    checkInTime: { type: Date, default: null },
    checkOutTime: { type: Date, default: null },
    status: {
        type: String,
        enum: ["Present", "Absent", "Weekend", "Holiday", "Pending"],
        default: "Pending",
    },
    isRegularized: {
        type: Boolean,
        default: false,
    },
    isRegularizable: {
        type: Boolean,
        default: false,
    },
    regularizationRequest: {
        requestedBy: {type : String},
        reason: { type: String },
        status: {
            type: String,
            enum: ["Pending", "Approved", "Rejected"],
            default: "Pending",
        },
        adminRemarks: { type: String, default: "" },
    },
});
