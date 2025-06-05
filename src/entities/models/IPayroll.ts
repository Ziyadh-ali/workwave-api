import { ObjectId } from "mongoose";

export interface IPayroll {
  _id?: ObjectId | string;
  employeeId: ObjectId | string;
  month: number;
  year: number;
  presentDays: number;
  workingDays: number;
  baseSalary: number;
  taxDeduction: number;
  pfDeduction: number;
  totalDeduction: number;
  lossOfPayDeduction: number;
  netSalary: number;
  status?: "Pending" | "Paid";
  generatedAt?: Date;
}
