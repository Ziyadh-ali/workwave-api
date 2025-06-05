import { Schema } from "mongoose";
import { IEmployeeModel } from "../../models/employee/EmployeeModel";

export const EmployeeSchema = new Schema<IEmployeeModel>(
    {
        fullName: { type: String, required: true },
        email: { type: String, required: true, unique: true, },
        password: { type: String, required: true },
        role: { type: String, enum: ["hr", "projectManager", "developer"] },
        department: { type: String, required: true },
        status: { type: String, default: "active" },
        profilePic: { type: String, default: "" },
        phone: { type: Number, default: 1234567890 },
        address: { type: String, default: "" },
        manager: { type: Schema.Types.ObjectId, ref: "Employee", default: "67d3fb40609f7c890f6eb579" },
        joinedAt: { type: Date, default: Date.now() },
        salary: { type: Number, required: true, default: 30000 },
        salaryType: { type: String, enum: ["monthly", "hourly"], default: "monthly" },
    },
    {
        timestamps: true
    }
);