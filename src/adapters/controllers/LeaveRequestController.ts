import { injectable, inject } from "tsyringe";
import { ILeaveRequestUseCase } from "../../entities/useCaseInterface/ILeaveRequestUseCase";
import { Request, Response } from "express";
import { MESSAGES } from "../../shared/constants";
import { HTTP_STATUS_CODES } from "../../shared/constants";
import { IEmployeeProfileUseCase } from "../../entities/useCaseInterface/IEmployeeProfileUseCase";
import { leaveRequestSchema } from "../../shared/validation/validator";
import { CustomError } from "../../shared/errors/CustomError";

@injectable()
export class LeaveRequestController {
  constructor(
    @inject("ILeaveRequestUseCase")
    private leaveRequestUseCase: ILeaveRequestUseCase,
    @inject("IEmployeeProfileUseCase")
    private employeeProfileUseCase: IEmployeeProfileUseCase
  ) {}

  async createLeaveRequest(req: Request, res: Response): Promise<void> {
    const { data } = req.body;

    const validation = leaveRequestSchema.safeParse(data);
    if (!validation.success) {
      res.status(HTTP_STATUS_CODES.BAD_REQUEST).json({
        success: false,
        message: "Validation failed",
        errors: validation.error.errors.map((err) => ({
          field: err.path.join("."),
          message: err.message,
        })),
      });
    }

    const user = await this.employeeProfileUseCase.getEmployeeDetails(
      data?.employeeId
    );
    const newData = {
      ...data,
      assignedManager: user?.manager,
      employeeRole: user?.role,
    };
    const leaveRequest = await this.leaveRequestUseCase.createLeaveRequest(
      newData
    );

    if (!leaveRequest) {
      res.status(HTTP_STATUS_CODES.BAD_REQUEST).json({
        success: false,
        message: MESSAGES.ERROR.LEAVE.LEAVE_REQUEST_FAILED,
      });
    }

    res.status(HTTP_STATUS_CODES.CREATED).json({
      success: true,
      message: MESSAGES.SUCCESS.LEAVE_REQUEST_SUBMITTED,
      leaveRequest,
    });
  }

  async getLeaveRequestsByEmployee(req: Request, res: Response): Promise<void> {
    const { employeeId } = req.params;
    const { page = "1", limit = "5", search = "", status = "" } = req.query;

    const pageNum = parseInt(page as string, 10);
    const limitNum = parseInt(limit as string, 10);

    const result = await this.leaveRequestUseCase.getLeaveRequestByEmployee({
      employeeId,
      page: pageNum,
      limit: limitNum,
      search: search as string,
      status: status as string,
    });
    res.status(200).json({ success: true, ...result });
  }

  async updateLeaveRequestStatus(req: Request, res: Response): Promise<void> {
    const { leaveRequestId } = req.params;
    const { status, reason } = req.body;

    if (!["Approved", "Rejected"].includes(status)) {
      throw new CustomError(
        MESSAGES.ERROR.LEAVE.INVALID_STATUS,
        HTTP_STATUS_CODES.BAD_REQUEST
      );
    }

    const leaveRequest = await this.leaveRequestUseCase.getLeaveRequestById(
      leaveRequestId
    );

    if (leaveRequest?.status !== "Pending") {
      throw new CustomError(
        "Request already approved or rejected",
        HTTP_STATUS_CODES.BAD_REQUEST
      );
    }

    if (status === "Rejected") {
      await this.leaveRequestUseCase.setRejectionReason(leaveRequestId, reason);
    }

    await this.leaveRequestUseCase.updateLeaveRequestStatus(
      leaveRequestId,
      status
    );

    res.status(HTTP_STATUS_CODES.OK).json({
      success: true,
      message: MESSAGES.SUCCESS.OPERATION_SUCCESSFUL,
    });
    return;
  }

  async cancelLeaveRequest(req: Request, res: Response): Promise<void> {
    const { leaveRequestId } = req.params;

    const cancelled = await this.leaveRequestUseCase.cancelLeaveRequest(
      leaveRequestId
    );
    if (!cancelled) {
      res.status(HTTP_STATUS_CODES.BAD_REQUEST).json({
        success: false,
        message: MESSAGES.ERROR.LEAVE.CANCEL_FAILED,
      });
    }

    res.status(HTTP_STATUS_CODES.OK).json({
      success: true,
      message: MESSAGES.SUCCESS.OPERATION_SUCCESSFUL,
    });
  }

  async getAllLeaveRequests(req: Request, res: Response): Promise<void> {
    const { page = "1", limit = "5", status = "" } = req.query;

    const pageNum = parseInt(page as string, 10);
    const limitNum = parseInt(limit as string, 10);

    const result = await this.leaveRequestUseCase.getAllLeaveRequests({
      page: pageNum,
      limit: limitNum,
      status: status as string,
    });
    res.status(HTTP_STATUS_CODES.OK).json({
      success: true,
      ...result,
    });
  }
}
