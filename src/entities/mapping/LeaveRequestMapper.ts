import { CreateLeaveRequestDTO, UpdateLeaveRequestDTO } from "../dtos/RequestDTOs/LeaveRequestDTO";
import { LeaveRequestAdminResponseDTO, LeaveRequestResponseDTO } from "../dtos/ResponseDTOs/LeaveRequestDTO";
import {  ILeaveRequestAdmin, ILeaveRequestEmployee, LeaveRequest } from "../models/LeaveRequest.entity";

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
      userRole: dto.employeeRole,
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

  static toResponseDTO(entity: ILeaveRequestEmployee): LeaveRequestResponseDTO {
    return {
      _id: entity._id?.toString() || "",
      employeeId: entity.employeeId.toString(),
      leaveTypeId: {
        _id : entity.leaveTypeId._id.toString(),
        name : entity.leaveTypeId.name
      },
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
  static toAdminResponseDTO(entity: ILeaveRequestAdmin): LeaveRequestAdminResponseDTO {
    return {
      _id: entity._id?.toString() || "",
      employeeId: {
        _id : entity.employeeId._id.toString(),
        fullName : entity.employeeId.fullName,
         role : entity.employeeId.role
      },
      leaveTypeId: {
        _id : entity.leaveTypeId._id.toString(),
        name : entity.leaveTypeId.name
      },
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