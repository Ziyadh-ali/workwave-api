import { CreateLeaveTypeDTO, UpdateLeaveTypeDTO } from "../dtos/RequestDTOs/LeaveTypeDTO";
import { LeaveTypeResponseDTO } from "../dtos/ResponseDTOs/LeaveTypeDTO";
import { LeaveType } from "../models/LeaveType.entity";

export class LeaveTypeMapper {
  static toEntity(dto: CreateLeaveTypeDTO | UpdateLeaveTypeDTO): LeaveType {
    return {
      name: dto.name ?? "",
      description: dto.description,
      maxDaysAllowed: dto.maxDaysAllowed ?? 0,
      isPaid: dto.isPaid ?? false,
      requiresApproval: dto.requiresApproval ?? false,
    };
  }

  static toResponseDTO(entity: LeaveType): LeaveTypeResponseDTO {
    return {
      _id: entity._id ? entity._id.toString() : "",
      name: entity.name,
      description: entity.description,
      maxDaysAllowed: entity.maxDaysAllowed,
      isPaid: entity.isPaid,
      requiresApproval: entity.requiresApproval,
    };
  }
}