import { injectable, inject } from "tsyringe";
import { IPayrollUseCase } from "../entities/useCaseInterface/IPayrollUseCase";
import { IPayrollRepository } from "../entities/repositoryInterfaces/IPayrollRepository";
import { IMonthlyAttendanceSummary } from "../entities/models/IMonthlyAttendanceSummary";
import { CustomError } from "../shared/errors/CustomError";
import { HTTP_STATUS_CODES } from "../shared/constants";
import { PayrollResponseDTO, PayrollResponseWithEmployeeDTO } from "../entities/dtos/ResponseDTOs/PayrollDTO";
import { PayrollMapper } from "../entities/mapping/PayrollMapper";
import { IEmployeeRepository } from "../entities/repositoryInterfaces/employee/EmployeeRepository";


@injectable()
export class PayrollUseCase implements IPayrollUseCase {
    constructor(
        @inject("IPayrollRepository") private _payrollRepository: IPayrollRepository,
        @inject("IEmployeeRepository") private _employeeRepository: IEmployeeRepository,
    ) { }

    async generatePayroll(
        summary: IMonthlyAttendanceSummary,
        employeeSalary: number,
        taxPercentage: number,
    ): Promise<PayrollResponseDTO> {
        if (summary.status !== "Approved") {
            throw new CustomError("Cannot generate payroll for unapproved summary" , HTTP_STATUS_CODES.BAD_REQUEST);
        }
        if (employeeSalary <= 0) {
            throw new CustomError("Employee salary must be positive" ,HTTP_STATUS_CODES.BAD_REQUEST);
        }

        if (summary.presentDays > summary.workingDays) {
            throw new CustomError("Present days cannot exceed working days" , HTTP_STATUS_CODES.BAD_REQUEST);
        }

        const payroll = await this._payrollRepository.generatePayroll(summary, employeeSalary, taxPercentage);
        return PayrollMapper.toResponseDTO(payroll);
    }

    async generateBulkPayroll(summaries: IMonthlyAttendanceSummary[], taxPercentage: number): Promise<PayrollResponseDTO[]> {
        const approvedSummaries = summaries.filter(s => s.status === "Approved");

        if (approvedSummaries.length === 0) {
            throw new CustomError("No approved summaries provided" , HTTP_STATUS_CODES.BAD_REQUEST);
        }

        return Promise.all(
            approvedSummaries.map(async summary => {
                const employee = await this._employeeRepository.findById(summary.employeeId.toString());
                if (!employee) {
                    throw new CustomError(`Employee not found for ID: ${summary.employeeId}` , HTTP_STATUS_CODES.BAD_REQUEST);
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
    }): Promise<PayrollResponseWithEmployeeDTO[]> {
        
        const payrolls = await this._payrollRepository.getPayrollRecords(filter);
        return payrolls.map(PayrollMapper.toResponseWithEmployeeDTO);
    }

    async updatePayrollStatus(payrollId: string, status: "Paid"): Promise<PayrollResponseDTO> {
        if (status !== "Paid") {
            throw new CustomError("Can only update status to 'Paid'" , HTTP_STATUS_CODES.BAD_REQUEST);
        }

        const payroll = await this._payrollRepository.updatePayrollStatus(payrollId, status);
        return PayrollMapper.toResponseDTO(payroll);
    }
    async getPayrollByEmployeeId(employeeId: string): Promise<PayrollResponseWithEmployeeDTO[] | []> {
        const payrolls =  await this._payrollRepository.getPayrollByEmployeeId(employeeId);
        return payrolls.map(PayrollMapper.toResponseWithEmployeeDTO);
    }

    async getPayrollByMonthAndEmployeeId(employeeId: string, month: number, year: number): Promise<PayrollResponseDTO | null> {
        const payroll =  await this._payrollRepository.getPayrollByMonthAndEmployeeId(employeeId , month , year);
        return payroll ? PayrollMapper.toResponseDTO(payroll) : null;
    }

    async getAllPayroll(): Promise<PayrollResponseDTO[] | []> {
        const payrolls =  await this._payrollRepository.getAllPayroll();
        return PayrollMapper.toResponseList(payrolls);
    }
}