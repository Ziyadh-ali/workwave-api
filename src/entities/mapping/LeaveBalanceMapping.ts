import { CreateLeaveBalanceRequestDTO } from "../dtos/RequestDTOs/LeaveBalanceDTO";
import { LeaveBalanceResponseDTO, } from "../dtos/ResponseDTOs/LeaveBalanceDTO";
import { LeaveBalance } from "../models/LeaveBalance.entity";

export class LeaveBalanceMapper {
  static toEntity(dto: CreateLeaveBalanceRequestDTO): LeaveBalance {
    return {
      _id: undefined as any,
      employeeId: dto.employeeId,
      leaveBalances: dto.leaveBalances.map((lb) => ({
        leaveTypeId: lb.leaveTypeId,
        availableDays: lb.availableDays,
        usedDays: lb.usedDays,
        totalDays: lb.totalDays,
      })),
    };
  }

  static toResponseDTO(entity: LeaveBalance): LeaveBalanceResponseDTO {
    return {
      _id: entity._id?.toString() ?? "",
      employeeId: entity.employeeId.toString(),
      leaveBalances: entity.leaveBalances.map((lb) => ({
        leaveTypeId: lb.leaveTypeId,
        availableDays: lb.availableDays,
        usedDays: lb.usedDays,
        totalDays: lb.totalDays,
      })),
    };
  }
}