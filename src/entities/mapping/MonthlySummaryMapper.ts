import { CreateMonthlyAttendanceSummaryRequestDTO, UpdateMonthlyAttendanceSummaryRequestDTO } from "../dtos/RequestDTOs/MonthlySummaryDTO";
import { MonthlyAttendanceSummaryResponseDTO, MonthlyAttendanceSummaryWithEmployeeResponseDTO } from "../dtos/ResponseDTOs/MonthlySummaryDTO";
import { IMonthlyAttendanceSummary } from "../models/IMonthlyAttendanceSummary";


export class MonthlyAttendanceSummaryMapper {
  static toEntity(dto: CreateMonthlyAttendanceSummaryRequestDTO): IMonthlyAttendanceSummary {
    return {
      employeeId: dto.employeeId as any,
      month: dto.month,
      year: dto.year,
      workingDays: dto.workingDays,
      presentDays: dto.presentDays,
      leaveDays: dto.leaveDays,
      nonPaidLeaves: dto.nonPaidLeaves,
      status: "Pending",
      generatedAt: new Date(),
      generatedBy: dto.generatedBy as any,
    };
  }

  static toUpdatedEntity(
    dto: UpdateMonthlyAttendanceSummaryRequestDTO,
    existing: IMonthlyAttendanceSummary
  ): IMonthlyAttendanceSummary {
    return {
      ...existing,
      status: dto.status ?? existing.status,
      remarks: dto.remarks ?? existing.remarks,
      rejectionReason: dto.rejectionReason ?? existing.rejectionReason,
    };
  }

  static toResponseDTO(entity: IMonthlyAttendanceSummary): MonthlyAttendanceSummaryResponseDTO {
    return {
      _id: entity._id!,
      employeeId: entity.employeeId.toString(),
      month: entity.month,
      year: entity.year,
      workingDays: entity.workingDays,
      presentDays: entity.presentDays,
      leaveDays: entity.leaveDays,
      nonPaidLeaves: entity.nonPaidLeaves,
      status: entity.status,
      remarks: entity.remarks,
      rejectionReason: entity.rejectionReason,
      generatedAt: entity.generatedAt?.toISOString(),
      generatedBy: entity.generatedBy,
    };
  }

  static toWithEmployeeResponseDTO(entity: any): MonthlyAttendanceSummaryWithEmployeeResponseDTO {
    return {
      _id: entity._id,
      employeeId: {
        _id: entity.employeeId._id,
        fullName: entity.employeeId.fullName,
        role: entity.employeeId.role,
      },
      month: entity.month,
      year: entity.year,
      workingDays: entity.workingDays,
      presentDays: entity.presentDays,
      leaveDays: entity.leaveDays,
      nonPaidLeaves: entity.nonPaidLeaves,
      status: entity.status,
      remarks: entity.remarks,
      rejectionReason: entity.rejectionReason,
      generatedAt: entity.generatedAt?.toISOString(),
      generatedBy: entity.generatedBy,
    };
  }
}