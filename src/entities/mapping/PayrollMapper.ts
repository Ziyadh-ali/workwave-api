import {
  CreatePayrollRequestDTO,
  UpdatePayrollRequestDTO,
} from "../dtos/RequestDTOs/PayrollDTO";
import { PayrollResponseDTO, PayrollResponseWithEmployeeDTO } from "../dtos/ResponseDTOs/PayrollDTO";
import { IPayroll } from "../models/IPayroll";

export class PayrollMapper {
  static toEntity(dto: CreatePayrollRequestDTO): IPayroll {
    return {
      employeeId: dto.employeeId,
      month: dto.month,
      year: dto.year,
      presentDays: dto.presentDays,
      workingDays: dto.workingDays,
      baseSalary: dto.baseSalary,
      taxDeduction: dto.taxDeduction,
      pfDeduction: dto.pfDeduction,
      totalDeduction: dto.totalDeduction,
      lossOfPayDeduction: dto.lossOfPayDeduction,
      netSalary: dto.netSalary,
      status: "Pending",
      generatedAt: new Date(),
    };
  }

  static toResponseWithEmployeeDTO(
    payroll: any
  ): PayrollResponseWithEmployeeDTO {
    if (!payroll.employeeId || typeof payroll.employeeId === "string") {
      throw new Error("Payroll must have populated employeeId for this mapper");
    }

    return {
      _id: payroll._id.toString(),
      employeeId: {
        _id: payroll.employeeId._id.toString(),
        fullName: payroll.employeeId.fullName,
        role: payroll.employeeId.role,
      },
      month: payroll.month,
      year: payroll.year,
      presentDays: payroll.presentDays,
      workingDays: payroll.workingDays,
      baseSalary: payroll.baseSalary,
      taxDeduction: payroll.taxDeduction,
      pfDeduction: payroll.pfDeduction,
      totalDeduction: payroll.totalDeduction,
      lossOfPayDeduction: payroll.lossOfPayDeduction,
      netSalary: payroll.netSalary,
      status: payroll.status ?? "Pending",
      generatedAt: payroll.generatedAt,
    };
  }

  static toUpdateEntity(dto: UpdatePayrollRequestDTO): Partial<IPayroll> {
    return {
      status: dto.status,
    };
  }

  static toResponseDTO(entity: IPayroll): PayrollResponseDTO {
    return {
      _id: entity._id?.toString() || "",
      employeeId: entity.employeeId.toString(),
      month: entity.month,
      year: entity.year,
      presentDays: entity.presentDays,
      workingDays: entity.workingDays,
      baseSalary: entity.baseSalary,
      taxDeduction: entity.taxDeduction,
      pfDeduction: entity.pfDeduction,
      totalDeduction: entity.totalDeduction,
      lossOfPayDeduction: entity.lossOfPayDeduction,
      netSalary: entity.netSalary,
      status: entity.status || "Pending",
      generatedAt: entity.generatedAt,
    };
  }

  static toResponseList(entities: IPayroll[]): PayrollResponseDTO[] {
    return entities.map(this.toResponseDTO);
  }
}
