import { ObjectId } from "mongoose";
import { CreateLeaveBalanceRequestDTO } from "../dtos/RequestDTOs/LeaveBalanceDTO";
import { LeaveBalanceResponseDTO, } from "../dtos/ResponseDTOs/LeaveBalanceDTO";
import { LeaveBalance } from "../models/LeaveBalance.entity";

export class LeaveBalanceMapper {
  static toEntity(dto: CreateLeaveBalanceRequestDTO): LeaveBalance {
    return {
      _id: undefined,
      employeeId: dto.employeeId,
      leaveBalances: dto.leaveBalances.map((lb) => ({
        leaveTypeId: lb.leaveTypeId,
        availableDays: lb.availableDays,
        usedDays: lb.usedDays,
        totalDays: lb.totalDays,
      })),
    };
  }

  static toResponseDTO(entity: any): LeaveBalanceResponseDTO {
    return {
      _id: entity._id?.toString() ?? "",
      employeeId: entity.employeeId.toString(),
      leaveBalances: entity.leaveBalances.map((lb : {
        leaveTypeId : {
          _id : string | ObjectId,
          name : string
        },
        availableDays : number,
        usedDays : number,
        totalDays : number
      }) => ({
        leaveTypeId: {
          _id : lb.leaveTypeId._id,
          name : lb.leaveTypeId.name
        },
        availableDays: lb.availableDays,
        usedDays: lb.usedDays,
        totalDays: lb.totalDays,
      })),
    };
  }
}