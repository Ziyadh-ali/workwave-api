import { injectable } from "tsyringe";
import { IPayrollRepository } from "../../entities/repositoryInterfaces/IPayrollRepository";
import { IMonthlyAttendanceSummary } from "../../entities/models/IMonthlyAttendanceSummary";
import { IPayrollModel, PayrollModel } from "../../frameworks/database/models/PayrollModel";
import { EmployeeModel } from "../../frameworks/database/models/employee/EmployeeModel";
import { IPayroll } from "../../entities/models/IPayroll";

@injectable()
export class PayrollRepository implements IPayrollRepository {
    async generatePayroll(
        summary: IMonthlyAttendanceSummary,
        employeeSalary: number,
        taxPercentage: number = 5,
    ): Promise<IPayrollModel> {
        const existingPayroll = await PayrollModel.findOne({
            employeeId: summary.employeeId,
            month: summary.month,
            year: summary.year,
        });

        const lossOfPayDeduction = (employeeSalary / summary.workingDays) * summary.nonPaidLeaves;

        let taxDeduction = 0

        if (employeeSalary > 60000) {
            taxDeduction = employeeSalary * (taxPercentage / 100);
        }

        const pfDeduction = employeeSalary * 0.12;

        const totalDeduction = taxDeduction + lossOfPayDeduction + pfDeduction;

        const netSalary = employeeSalary - totalDeduction;

        if (existingPayroll) {
            existingPayroll.presentDays = summary.presentDays;
            existingPayroll.workingDays = summary.workingDays;
            existingPayroll.netSalary = netSalary;
            existingPayroll.taxDeduction = taxDeduction || 0;
            existingPayroll.totalDeduction = totalDeduction;
            existingPayroll.pfDeduction = pfDeduction;
            existingPayroll.lossOfPayDeduction = lossOfPayDeduction;
            return await existingPayroll.save();
        }

        const payroll = ({
            employeeId: summary.employeeId,
            month: summary.month,
            year: summary.year,
            presentDays: summary.presentDays,
            workingDays: summary.workingDays,
            baseSalary: employeeSalary,
            netSalary: netSalary,
            status: "Pending",
            taxDeduction: taxDeduction || 0,
            lossOfPayDeduction,
            pfDeduction,
            totalDeduction
        });

        return await PayrollModel.create(payroll);
    }

    async generateBulkPayroll(summaries: IMonthlyAttendanceSummary[], taxPercentage: number): Promise<IPayrollModel[]> {
        const payrolls = await Promise.all(
            summaries.map(async summary => {
                const employee = await EmployeeModel.findById(summary.employeeId);
                if (!employee) {
                    throw new Error(`Employee not found for ID: ${summary.employeeId}`);
                }
                return this.generatePayroll(summary, employee.salary, taxPercentage);
            })
        );
        return payrolls;
    }

    async getPayrollRecords(filter: {
        employeeId?: string;
        month?: number;
        year?: number;
        status?: "Pending" | "Paid";
    }): Promise<IPayrollModel[]> {
        return PayrollModel.find(filter)
            .populate("employeeId", "fullName role")
            .exec();
    }

    async updatePayrollStatus(payrollId: string, status: "Paid"): Promise<IPayrollModel> {
        const payroll = await PayrollModel.findByIdAndUpdate(
            payrollId,
            { status },
            { new: true }
        ).populate("employeeId", "fullName role");

        if (!payroll) {
            throw new Error("Payroll not found");
        }

        return payroll;
    }

    async getPayrollByEmployeeId(employeeId: string): Promise<IPayrollModel[] | []> {
        return await PayrollModel.find({
            employeeId,
        }).populate("employeeId", "fullName role");
    }

    async getPayrollByMonthAndEmployeeId(employeeId: string, month: number, year: number): Promise<IPayrollModel | null> {
        return await PayrollModel.findOne({
            employeeId,
            month,
            year
        }).exec();
    }

    async getAllPayroll(): Promise<IPayroll[] | []> {
        return await PayrollModel.find({})
    }
}