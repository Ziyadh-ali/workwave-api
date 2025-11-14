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
import { LeaveRequestResponseDTO, LeaveRequestAdminResponseDTO } from "../entities/dtos/ResponseDTOs/LeaveRequestDTO";
import { LeaveRequestMapper } from "../entities/mapping/LeaveRequestMapper";

@injectable()
export class LeaveRequestUseCase implements ILeaveRequestUseCase {
  constructor(
    @inject("ILeaveRequestRepository")
    private _leaveRequestRepository: ILeaveRequestRepository,
    @inject("ILeaveBalanceRepository")
    private _leaveBalanceRepository: ILeaveBalanceRepository
  ) { }

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


    const leaveBalance = await this._leaveBalanceRepository.getLeaveBalance(
      leaveRequest.employeeId.toString(),
      leaveRequest.leaveTypeId.toString()
    );

    if (!leaveBalance) {
      throw new CustomError(
        MESSAGES.ERROR.LEAVE.NO_LEAVE_BALANCE,
        HTTP_STATUS_CODES.BAD_REQUEST
      );
    }

    const newStart = new Date(leaveRequest.startDate);
    const newEnd = new Date(leaveRequest.endDate);

    newStart.setHours(0, 0, 0, 0);
    newEnd.setHours(0, 0, 0, 0);

    if (newEnd < newStart) {
      throw new CustomError(
        "End date cannot be before start date",
        HTTP_STATUS_CODES.BAD_REQUEST
      );
    }

    const existingLeaves =
      await this._leaveRequestRepository.getLeaveRequestsOfEmployee(
        leaveRequest.employeeId.toString()
      );

    if (existingLeaves) {
      for (const leave of existingLeaves) {
        if (leave.status === "Cancelled" || leave.status === "Rejected") continue;

        const existingStart = new Date(leave.startDate);
        const existingEnd = new Date(leave.endDate);

        existingStart.setHours(0, 0, 0, 0);
        existingEnd.setHours(0, 0, 0, 0);

        const isOverlapping =
          newStart <= existingEnd && newEnd >= existingStart;

        if (isOverlapping) {
          console.log("Overlaps")
          throw new CustomError(
            "Leave request overlaps with an existing leave.",
            HTTP_STATUS_CODES.BAD_REQUEST
          );
        }
      }
    }

    const ONE_DAY = 1000 * 60 * 60 * 24;

    let requestedDays =
      Math.ceil((newEnd.getTime() - newStart.getTime()) / ONE_DAY) + 1;

    if (
      requestedDays === 1 &&
      (leaveRequest.duration === "morning" ||
        leaveRequest.duration === "afternoon")
    ) {
      requestedDays = 0.5;
    }

    let pendingDaysUsed = 0;

    if (existingLeaves?.length) {
      for (const leave of existingLeaves) {
        if (leave.status === "Cancelled" || leave.status === "Rejected") continue;

        if (
          leave.status === "Pending" ||
          (leave.status === "Approved" &&
            new Date(leave.endDate) >= new Date())
        ) {
          const pStart = new Date(leave.startDate);
          const pEnd = new Date(leave.endDate);

          pStart.setHours(0, 0, 0, 0);
          pEnd.setHours(0, 0, 0, 0);

          let pd =
            Math.ceil((pEnd.getTime() - pStart.getTime()) / ONE_DAY) + 1;

          if (
            pd === 1 &&
            (leave.duration === "morning" || leave.duration === "afternoon")
          ) {
            pd = 0.5;
          }

          pendingDaysUsed += pd;
        }
      }
    }

    const effectiveBalance = leaveBalance.availableDays - pendingDaysUsed;

    if (requestedDays > effectiveBalance) {
      throw new CustomError(
        `You have only ${effectiveBalance} days available considering pending requests.`,
        HTTP_STATUS_CODES.BAD_REQUEST
      );
    }

    return await this._leaveRequestRepository.create(leaveRequest);
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
      await this._leaveRequestRepository.getLeaveRequestByEmployee(options);
    return {
      leaveRequests: leaveRequests.leaveRequests.map(
        LeaveRequestMapper.toResponseDTO
      ),
      totalPages: leaveRequests.totalPages,
    };
  }

  async cancelLeaveRequest(leaveRequestId: string): Promise<boolean> {
    const leaveRequest = await this._leaveRequestRepository.getLeaveRequestById(
      leaveRequestId
    );

    if (!leaveRequest || leaveRequest.status !== "Approved") {
      throw new CustomError(
        "Only approved leave requests can be cancelled.",
        HTTP_STATUS_CODES.BAD_REQUEST
      );
    }

    const updated = await this._leaveRequestRepository.cancelLeaveRequest(
      leaveRequestId
    );
    if (!updated) return false;

    const workingDays = await calculateWorkingDaysExcludingHolidays(
      leaveRequest.startDate,
      leaveRequest.endDate,
      leaveRequest.duration ? leaveRequest.duration : ""
    );
    if (workingDays > 0) {
      await this._leaveBalanceRepository.restoreLeave(
        leaveRequest.employeeId.toString(),
        leaveRequest.leaveTypeId._id.toString(),
        workingDays
      );
    }
    return true;
  }

  async updateLeaveRequestStatus(
    leaveRequestId: string,
    status: "Approved" | "Rejected"
  ): Promise<boolean> {
    const leaveRequest = await this._leaveRequestRepository.getLeaveRequestById(
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
        const success = await this._leaveBalanceRepository.deductLeave(
          employeeId.toString(),
          leaveTypeId._id.toString(),
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

    return await this._leaveRequestRepository.updateLeaveRequestStatus(
      leaveRequestId,
      status
    );
  }

  async getAllLeaveRequests(options: {
    page: number;
    limit: number;
    status: string;
  }): Promise<{ leaveRequests: LeaveRequestAdminResponseDTO[]; totalPages: number }> {
    const leaveRequests = await this._leaveRequestRepository.getAllLeaveRequests(options);
    return {
      leaveRequests: leaveRequests.leaveRequests.map(
        LeaveRequestMapper.toAdminResponseDTO
      ),
      totalPages: leaveRequests.totalPages,
    };
  }

  async setRejectionReason(
    leaveRequestId: string,
    reason: string
  ): Promise<void> {
    return await this._leaveRequestRepository.setRejectionReason(
      leaveRequestId,
      reason
    );
  }
  async getFilteredLeaveRequests(
    filters: LeaveRequestFilter
  ): Promise<LeaveRequestAdminResponseDTO[]> {
    const leaveRequests = await this._leaveRequestRepository.getFilteredLeaveRequests(filters);
    return leaveRequests.map(LeaveRequestMapper.toAdminResponseDTO);
  }

  async getLeaveRequestById(
    leaveRequestId: string
  ): Promise<LeaveRequestResponseDTO | null> {
    const leaveRequest = await this._leaveRequestRepository.getLeaveRequestById(
      leaveRequestId
    );
    if (!leaveRequest) return null;
    return LeaveRequestMapper.toResponseDTO(leaveRequest)
  }

  async getEveryRequests(): Promise<LeaveRequestAdminResponseDTO[] | []> {
    const leaveRequests = await this._leaveRequestRepository.getEveryLeaveRequests();
    return leaveRequests.map(LeaveRequestMapper.toAdminResponseDTO);
  }
}
