import { Request, Response } from "express";
import { IPayrollUseCase } from "../../entities/useCaseInterface/IPayrollUseCase";
import { injectable, inject } from "tsyringe";
import { IMonthlySummaryUseCase } from "../../entities/useCaseInterface/IMonthlySummaryUseCase";
import { HTTP_STATUS_CODES } from "../../shared/constants";
import { EmployeeModel } from "../../frameworks/database/models/employee/EmployeeModel";

@injectable()
export class PayrollController {
    constructor(
        @inject("IMonthlySummaryUseCase") private monthlySummaryUseCase: IMonthlySummaryUseCase,
        @inject("IPayrollUseCase") private payrollUseCase: IPayrollUseCase,
    ) { }

    async generatePayroll(req: Request, res: Response) {
        const { month, year, employeeId, taxPercentage } = req.body;

        if (!month || !year || !employeeId) {
            res.status(HTTP_STATUS_CODES.BAD_REQUEST).json({
                message: "Month, year, and employeeId are required",
            });
            return
        }

        const summaries = await this.monthlySummaryUseCase.getExistingSummaries(month, year);
        const summary = summaries.find(s =>
            s.employeeId._id.toString() === employeeId &&
            s.status === "Approved"
        );

        if (!summary) {
            res.status(HTTP_STATUS_CODES.BAD_REQUEST).json({
                message: "Approved monthly summary not found for this employee",
            });
            return
        }

        const employee = await EmployeeModel.findById(employeeId);
        if (!employee) {
            res.status(HTTP_STATUS_CODES.BAD_REQUEST).json({
                message: "Employee not found",
            });
            return
        }
        console.log(employee.salary)

        const payroll = await this.payrollUseCase.generatePayroll(summary, employee.salary, taxPercentage);

        res.status(HTTP_STATUS_CODES.OK).json({
            success: true,
            data: payroll
        });
    }

    async generateBulkPayroll(req: Request, res: Response) {
        const { month, year, taxPercentage } = req.body;

        if (!month || !year) {
            res.status(HTTP_STATUS_CODES.BAD_REQUEST).json({
                message: "Month and year are required",
            });
            return
        }
        console.log(month, year, taxPercentage)

        const summaries = await this.monthlySummaryUseCase.getExistingSummaries(month, year);
        const approvedSummaries = summaries.filter(s => s.status === "Approved");

        if (approvedSummaries.length === 0) {
            res.status(HTTP_STATUS_CODES.BAD_REQUEST).json({
                message: "No approved monthly summaries found for this period",
            });
            return
        }

        const payrolls = await this.payrollUseCase.generateBulkPayroll(approvedSummaries, taxPercentage);

        res.status(HTTP_STATUS_CODES.OK).json({
            success: true,
            data: payrolls,
            count: payrolls.length
        });
    }

    async getPayrollRecords(req: Request, res: Response) {
        const { month, year, status } = req.query;

        const filter: {
            month?: number;
            year?: number;
            status?: "Pending" | "Paid";
        } = {};
        if (month) filter.month = parseInt(month.toString());
        if (year) filter.year = parseInt(year.toString());
        if (status ) {
            filter.status = status as "Pending" | "Paid";
        }

        const payrolls = await this.payrollUseCase.getPayrollRecords(filter);

        res.status(HTTP_STATUS_CODES.OK).json({
            success: true,
            data: payrolls,
            count: payrolls.length
        });
    }

    async updatePayrollStatus(req: Request, res: Response) {
        const { payrollId } = req.params;
        console.log(payrollId)

        if (!payrollId) {
            res.status(HTTP_STATUS_CODES.BAD_REQUEST).json({
                message: "Payroll ID is required",
            });
            return;
        }

        const updatedPayroll = await this.payrollUseCase.updatePayrollStatus(payrollId, "Paid");

        res.status(HTTP_STATUS_CODES.OK).json({
            success: true,
            data: updatedPayroll
        });
    }

    async getPayslipByEmployeeId(req: Request, res: Response): Promise<void> {
        const { employeeId } = req.params;
        const payslip = await this.payrollUseCase.getPayrollByEmployeeId(employeeId);
        res.status(HTTP_STATUS_CODES.OK).json({
            payslip
        });
    }

    async getAllPayroll(req: Request, res: Response): Promise<void> {
        const payrolls = await this.payrollUseCase.getAllPayroll();

        res.status(HTTP_STATUS_CODES.OK).json({
            payrolls
        });
    }
}