import { IPayrollModel } from "../../adapters/database/models/PayrollModel";
import { IMonthlyAttendanceSummary } from "../models/IMonthlyAttendanceSummary";
import { IPayroll } from "../models/IPayroll";

export interface IPayrollRepository {
    generatePayroll(summary: IMonthlyAttendanceSummary, employeeSalary: number,taxPercentage : number): Promise<IPayrollModel>;
    generateBulkPayroll(summaries: IMonthlyAttendanceSummary[],taxPercentage : number): Promise<IPayrollModel[]>;
    getPayrollRecords(filter: {
      employeeId?: string;
      month?: number;
      year?: number;
      status?: "Pending" | "Paid";
    }): Promise<IPayrollModel[]>;
    updatePayrollStatus(payrollId: string, status: "Paid"): Promise<IPayrollModel>;
    getPayrollByEmployeeId(employeeId: string): Promise<IPayrollModel[] | []>;
    getPayrollByMonthAndEmployeeId(employeeId: string , month : number, year : number): Promise<IPayrollModel | null>;
    getAllPayroll() : Promise<IPayroll[] | []>
  }