import { Document, model, ObjectId } from "mongoose";
import { IPayroll } from "../../../entities/models/IPayroll";
import { PayrollSchema } from "../schemas/PayrollSchema";


export interface IPayrollModel extends Omit<IPayroll , "_id">, Document {
    _id : ObjectId;
}

export const PayrollModel = model<IPayrollModel>("Payroll",PayrollSchema);