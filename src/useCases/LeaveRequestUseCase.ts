import { inject, injectable } from "tsyringe";
import { ILeaveRequestRepository } from "../entities/repositoryInterfaces/ILeaveRequest.repository";
import { ILeaveRequestUseCase } from "../entities/useCaseInterface/ILeaveRequestUseCase";
import {
  LeaveRequest,
  LeaveRequestFilter,
} from "../entities/models/LeaveRequest.entity";
import { ILeaveBalanceRepository } from "../entities/repositoryInterfaces/ILeaveBalance.repository";
import { HTTP_STATUS_CODES, MESSAGES } from "../shared/constants";
import { calculateWorkingDaysExcludingHolidays } from "../shared/utils/calculateWorkingDaysExcludingHolidays";
import { CustomError } from "../shared/errors/CustomError";
import { CreateLeaveRequestDTO } from "../entities/dtos/RequestDTOs/LeaveRequestDTO";
import { LeaveRequestResponseDTO } from "../entities/dtos/ResponseDTOs/LeaveRequestDTO";
import { LeaveBalanceMapper } from "../entities/mapping/LeaveBalanceMapping";
import { LeaveRequestMapper } from "../entities/mapping/LeaveRequestMapper";

@injectable()
export class LeaveRequestUseCase implements ILeaveRequestUseCase {
  constructor(
    @inject("ILeaveRequestRepository")
    private leaveRequestRepository: ILeaveRequestRepository,
    @inject("ILeaveBalanceRepository")
    private leaveBalanceRepository: ILeaveBalanceRepository
  ) {}

  async createLeaveRequest(
    leaveRequest: CreateLeaveRequestDTO
  ): Promise<LeaveRequest> {
    if (
      !leaveRequest ||
      !leaveRequest.employeeId ||
      !leaveRequest.leaveTypeId
    ) {
      throw new CustomError(
        "Employee ID or Leave Type ID is missing",
        HTTP_STATUS_CODES.BAD_REQUEST
      );
    }

    if (
      !leaveRequest.assignedManager &&
      leaveRequest.userRole === "developer"
    ) {
      throw new CustomError(
        "No manager assigned",
        HTTP_STATUS_CODES.BAD_REQUEST
      );
    }

    const leaveBalance = await this.leaveBalanceRepository.getLeaveBalance(
      leaveRequest?.employeeId.toString(),
      leaveRequest.leaveTypeId.toString()
    );
    if (!leaveBalance) {
      throw new CustomError(
        MESSAGES.ERROR.LEAVE.NO_LEAVE_BALANCE,
        HTTP_STATUS_CODES.BAD_REQUEST
      );
    }

    const existingLeaves =
      await this.leaveRequestRepository.getLeaveRequestsOfEmployee(
        leaveRequest?.employeeId.toString()
      );
    if (existingLeaves) {
      for (const leave of existingLeaves) {
        if (leave.status === "Cancelled") continue;
        if (leave.status === "Rejected") continue;

        const existingStart = new Date(leave.startDate);
        const existingEnd = new Date(leave.endDate);

        const newStart = new Date(leaveRequest.startDate);
        const newEnd = new Date(leaveRequest.endDate);

        const isOverlapping =
          newStart <= existingEnd && newEnd >= existingStart;

        if (isOverlapping) {
          throw new CustomError(
            "Leave request overlaps with an existing leave.",
            HTTP_STATUS_CODES.BAD_REQUEST
          );
        }
      }
    }

    const startDate = new Date(leaveRequest.startDate);
    const endDate = new Date(leaveRequest.endDate);
    const duration = leaveRequest.duration || "full";
    let requestedDays =
      Math.ceil(
        (endDate.getTime() - startDate.getTime()) / (1000 * 60 * 60 * 24)
      ) + 1;

    if (
      requestedDays === 1 &&
      (duration === "morning" || duration === "afternoon")
    ) {
      requestedDays = 0.5;
    }

    if (requestedDays > leaveBalance.availableDays) {
      throw new CustomError(
        MESSAGES.ERROR.LEAVE.INSUFFICIENT_BALANCE,
        HTTP_STATUS_CODES.BAD_REQUEST
      );
    }
    return await this.leaveRequestRepository.createLeaveRequest(leaveRequest);
  }

  async getLeaveRequestByEmployee(options: {
    employeeId: string;
    page: number;
    limit: number;
    search: string;
    status: string;
  }): Promise<{
    leaveRequests: LeaveRequestResponseDTO[];
    totalPages: number;
  }> {
    const leaveRequests =
      await this.leaveRequestRepository.getLeaveRequestByEmployee(options);
    return {
      leaveRequests: leaveRequests.leaveRequests.map(
        LeaveRequestMapper.toResponseDTO
      ),
      totalPages: leaveRequests.totalPages,
    };
  }

  // async getLeaveRequestForApproval(managerId: string): Promise<LeaveRequest[]> {
  //     return await this.leaveRequestRepository.getLeaveRequestForApproval(managerId);
  // }

  async cancelLeaveRequest(leaveRequestId: string): Promise<boolean> {
    const leaveRequest = await this.leaveRequestRepository.getLeaveRequestById(
      leaveRequestId
    );

    if (!leaveRequest || leaveRequest.status !== "Approved") {
      throw new CustomError(
        "Only approved leave requests can be cancelled.",
        HTTP_STATUS_CODES.BAD_REQUEST
      );
    }

    const updated = await this.leaveRequestRepository.cancelLeaveRequest(
      leaveRequestId
    );
    if (!updated) return false;

    const workingDays = await calculateWorkingDaysExcludingHolidays(
      leaveRequest.startDate,
      leaveRequest.endDate,
      leaveRequest.duration ? leaveRequest.duration : ""
    );

    if (workingDays > 0) {
      await this.leaveBalanceRepository.restoreLeave(
        leaveRequest.employeeId.toString(),
        leaveRequest.leaveTypeId.toString(),
        workingDays
      );
    }

    return true;
  }

  async updateLeaveRequestStatus(
    leaveRequestId: string,
    status: "Approved" | "Rejected"
  ): Promise<boolean> {
    const leaveRequest = await this.leaveRequestRepository.getLeaveRequestById(
      leaveRequestId
    );

    if (!leaveRequest) {
      throw new CustomError(
        "Leave request not found",
        HTTP_STATUS_CODES.BAD_REQUEST
      );
    }

    if (status === "Approved") {
      const { employeeId, leaveTypeId, startDate, endDate, duration } =
        leaveRequest;

      const workingDays = await calculateWorkingDaysExcludingHolidays(
        startDate,
        endDate,
        duration ? duration : ""
      );

      if (workingDays > 0) {
        const success = await this.leaveBalanceRepository.deductLeave(
          employeeId.toString(),
          leaveTypeId.toString(),
          workingDays
        );

        if (!success) {
          throw new CustomError(
            "Failed to deduct leave balance. Possible insufficient balance.",
            HTTP_STATUS_CODES.BAD_REQUEST
          );
        }
      }
    }

    return await this.leaveRequestRepository.updateLeaveRequestStatus(
      leaveRequestId,
      status
    );
  }

  // async editLeaveRequest(leaveRequestId: string, updates: Partial<LeaveRequest>): Promise<boolean> {
  //     return await this.leaveRequestRepository.editLeaveRequest(leaveRequestId, updates);
  // }

  async getAllLeaveRequests(options: {
    page: number;
    limit: number;
    status: string;
  }): Promise<{ leaveRequests: LeaveRequestResponseDTO[]; totalPages: number }> {
    const leaveRequests =  await this.leaveRequestRepository.getAllLeaveRequests(options);
    return {
      leaveRequests: leaveRequests.leaveRequests.map(
        LeaveRequestMapper.toResponseDTO
      ),
      totalPages: leaveRequests.totalPages,
    };
  }

  async setRejectionReason(
    leaveRequestId: string,
    reason: string
  ): Promise<void> {
    return await this.leaveRequestRepository.setRejectionReason(
      leaveRequestId,
      reason
    );
  }
  async getFilteredLeaveRequests(
    filters: LeaveRequestFilter
  ): Promise<LeaveRequestResponseDTO[]> {
    const leaveRequests = await this.leaveRequestRepository.getFilteredLeaveRequests(filters);
    return leaveRequests.map(LeaveRequestMapper.toResponseDTO);
  }

  async getLeaveRequestById(
    leaveRequestId: string
  ): Promise<LeaveRequestResponseDTO | null> {
    const leaveRequest =  await this.leaveRequestRepository.getLeaveRequestById(
      leaveRequestId
    );
    if(!leaveRequest) return null;
    return LeaveRequestMapper.toResponseDTO(leaveRequest)
  }
}
