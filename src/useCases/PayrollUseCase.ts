import { injectable, inject } from "tsyringe";
import { IPayrollUseCase } from "../entities/useCaseInterface/IPayrollUseCase";
import { IPayrollRepository } from "../entities/repositoryInterfaces/IPayrollRepository";
import { IPayrollModel } from "../frameworks/database/models/PayrollModel";
import { IMonthlyAttendanceSummary } from "../entities/models/IMonthlyAttendanceSummary";
import { EmployeeModel } from "../frameworks/database/models/employee/EmployeeModel";
import { IPayroll } from "../entities/models/IPayroll";


@injectable()
export class PayrollUseCase implements IPayrollUseCase {
    constructor(
        @inject("IPayrollRepository") private payrollRepository: IPayrollRepository,
    ) { }

    async generatePayroll(
        summary: IMonthlyAttendanceSummary,
        employeeSalary: number,
        taxPercentage: number,
    ): Promise<IPayrollModel> {
        if (summary.status !== "Approved") {
            throw new Error("Cannot generate payroll for unapproved summary");
        }
        if (employeeSalary <= 0) {
            throw new Error("Employee salary must be positive");
        }

        if (summary.presentDays > summary.workingDays) {
            throw new Error("Present days cannot exceed working days");
        }

        return this.payrollRepository.generatePayroll(summary, employeeSalary, taxPercentage);
    }

    async generateBulkPayroll(summaries: IMonthlyAttendanceSummary[], taxPercentage: number): Promise<IPayrollModel[]> {
        const approvedSummaries = summaries.filter(s => s.status === "Approved");

        if (approvedSummaries.length === 0) {
            throw new Error("No approved summaries provided");
        }

        return Promise.all(
            approvedSummaries.map(async summary => {
                const employee = await EmployeeModel.findById(summary.employeeId);
                if (!employee) {
                    throw new Error(`Employee not found for ID: ${summary.employeeId}`);
                }
                return this.generatePayroll(summary, employee.salary, taxPercentage);
            })
        );
    }

    async getPayrollRecords(filter: {
        employeeId?: string;
        month?: number;
        year?: number;
        status?: "Pending" | "Paid";
    }): Promise<IPayrollModel[]> {
        
        return this.payrollRepository.getPayrollRecords(filter);
    }

    async updatePayrollStatus(payrollId: string, status: "Paid"): Promise<IPayrollModel> {
        if (status !== "Paid") {
            throw new Error("Can only update status to 'Paid'");
        }

        return this.payrollRepository.updatePayrollStatus(payrollId, status);
    }
    async getPayrollByEmployeeId(employeeId: string): Promise<IPayrollModel[] | []> {
        return await this.payrollRepository.getPayrollByEmployeeId(employeeId)
    }

    async getPayrollByMonthAndEmployeeId(employeeId: string, month: number, year: number): Promise<IPayrollModel | null> {
        return await this.payrollRepository.getPayrollByMonthAndEmployeeId(employeeId , month , year);
    }

    async getAllPayroll(): Promise<IPayroll[] | []> {
        return await this.payrollRepository.getAllPayroll();
    }
}