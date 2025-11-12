import { IPayrollModel } from "../../adapters/database/models/PayrollModel";
import { PayrollResponseDTO, PayrollResponseWithEmployeeDTO } from "../dtos/ResponseDTOs/PayrollDTO";
import { IMonthlyAttendanceSummary } from "../models/IMonthlyAttendanceSummary";
import { IPayroll } from "../models/IPayroll";

export interface IPayrollUseCase {
  generatePayroll(summary: IMonthlyAttendanceSummary, employeeSalary: number, taxPercentage: number): Promise<PayrollResponseDTO>;
  generateBulkPayroll(summaries: IMonthlyAttendanceSummary[], taxPercentage: number): Promise<PayrollResponseDTO[]>;
  getPayrollRecords(filter: {
    employeeId?: string;
    month?: number;
    year?: number;
    status?: "Pending" | "Paid";
  }): Promise<PayrollResponseWithEmployeeDTO[]>;
  updatePayrollStatus(payrollId: string, status: "Paid"): Promise<PayrollResponseDTO>;
  getPayrollByEmployeeId(employeeId: string): Promise<PayrollResponseWithEmployeeDTO[] | []>;
  getPayrollByMonthAndEmployeeId(employeeId: string , month : number, year : number): Promise<PayrollResponseDTO | null>;
  getAllPayroll(): Promise<PayrollResponseDTO[] | []>
}