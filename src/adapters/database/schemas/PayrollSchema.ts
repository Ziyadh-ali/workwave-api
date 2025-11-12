import { Schema } from "mongoose";
import { IPayrollModel } from "../models/PayrollModel";

export const PayrollSchema = new Schema<IPayrollModel>(
    {
        employeeId: { type: Schema.Types.ObjectId, ref: "Employee", required: true },
        month: { type: Number, required: true },
        year: { type: Number, required: true },
        presentDays: { type: Number, required: true },
        workingDays: { type: Number, required: true },
        baseSalary: { type: Number, required: true },
        netSalary: { type: Number, required: true },
        taxDeduction: { type: Number },
        pfDeduction: { type: Number, },
        lossOfPayDeduction: { type: Number, },
        totalDeduction: { type: Number, },
        status: {
            type: String,
            enum: ["Pending", "Paid"],
            default: "Pending"
        },
        generatedAt: { type: Date, default: Date.now }
    }
);