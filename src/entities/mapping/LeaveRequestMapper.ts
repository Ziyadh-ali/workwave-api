import { CreateLeaveRequestDTO, UpdateLeaveRequestDTO } from "../dtos/RequestDTOs/LeaveRequestDTO";
import { LeaveRequestResponseDTO } from "../dtos/ResponseDTOs/LeaveRequestDTO";
import { LeaveRequest } from "../models/LeaveRequest.entity";

export class LeaveRequestMapper {
  static toEntity(dto: CreateLeaveRequestDTO): LeaveRequest {
    return {
      employeeId: dto.employeeId,
      leaveTypeId: dto.leaveTypeId,
      startDate: new Date(dto.startDate),
      endDate: new Date(dto.endDate),
      reason: dto.reason,
      duration: dto.duration,
      assignedManager: dto.assignedManager,
      userRole: dto.userRole,
      status: "Pending",
    };
  }

  static toUpdatedEntity(
    dto: UpdateLeaveRequestDTO,
    existing: LeaveRequest
  ): LeaveRequest {
    return {
      ...existing,
      startDate: dto.startDate ? new Date(dto.startDate) : existing.startDate,
      endDate: dto.endDate ? new Date(dto.endDate) : existing.endDate,
      reason: dto.reason ?? existing.reason,
      duration: dto.duration ?? existing.duration,
      status: dto.status ?? existing.status,
      rejectionReason: dto.rejectionReason ?? existing.rejectionReason,
      assignedManager: dto.assignedManager ?? existing.assignedManager,
    };
  }

  static toResponseDTO(entity: LeaveRequest): LeaveRequestResponseDTO {
    return {
      _id: entity._id?.toString() || "",
      employeeId: entity.employeeId.toString(),
      leaveTypeId: entity.leaveTypeId.toString(),
      startDate: entity.startDate.toISOString(),
      endDate: entity.endDate.toISOString(),
      reason: entity.reason,
      duration: entity.duration,
      status: entity.status || "Pending",
      rejectionReason: entity.rejectionReason,
      assignedManager: entity.assignedManager?.toString(),
      userRole: entity.userRole,
    };
  }
}