import { injectable, inject } from "tsyringe";
import { ILeaveRequestUseCase } from "../../entities/useCaseInterface/ILeaveRequestUseCase";
import { Request, Response } from "express";
import { MESSAGES } from "../../shared/constants";
import { HTTP_STATUS_CODES } from "../../shared/constants";
import { IEmployeeProfileUseCase } from "../../entities/useCaseInterface/IEmployeeProfileUseCase";
import { CustomError } from "../../shared/errors/CustomError";
import { CustomRequest } from "../../entities/services/JwtInterface";

@injectable()
export class LeaveRequestController {
  constructor(
    @inject("ILeaveRequestUseCase")
    private _leaveRequestUseCase: ILeaveRequestUseCase,
    @inject("IEmployeeProfileUseCase")
    private _employeeProfileUseCase: IEmployeeProfileUseCase
  ) {}

  async createLeaveRequest(req: Request, res: Response): Promise<void> {
    const { data } = req.body;

    const user = await this._employeeProfileUseCase.getEmployeeDetails(
      data?.employeeId
    );
    const newData = {
      ...data,
      assignedManager: user?.manager,
      employeeRole: user?.role,
    };
    
    const leaveRequest = await this._leaveRequestUseCase.createLeaveRequest(
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

    const result = await this._leaveRequestUseCase.getLeaveRequestByEmployee({
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

    const leaveRequest = await this._leaveRequestUseCase.getLeaveRequestById(
      leaveRequestId
    );

    if (leaveRequest?.status !== "Pending") {
      throw new CustomError(
        "Request already approved or rejected",
        HTTP_STATUS_CODES.BAD_REQUEST
      );
    }

    if (status === "Rejected") {
      await this._leaveRequestUseCase.setRejectionReason(leaveRequestId, reason);
    }

    await this._leaveRequestUseCase.updateLeaveRequestStatus(
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

    const cancelled = await this._leaveRequestUseCase.cancelLeaveRequest(
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
    const user = (req as CustomRequest).user

    const pageNum = parseInt(page as string, 10);
    const limitNum = parseInt(limit as string, 10);

    let result = await this._leaveRequestUseCase.getAllLeaveRequests({
      page: pageNum,
      limit: limitNum,
      status: status as string,
    });
    if(user.role === "hr"){
      result.leaveRequests = result.leaveRequests.filter((r) => {
        return r.employeeId._id !== user.id
      });

      result.totalPages = Math.ceil(result.leaveRequests.length / limitNum);
    }
    res.status(HTTP_STATUS_CODES.OK).json({
      success: true,
      ...result,
    });
  }

  async getEveryLeaveRequests(req: Request , res: Response): Promise<void> {
    const leaveRequests = await this._leaveRequestUseCase.getEveryRequests();
    res.status(HTTP_STATUS_CODES.OK).json({leaveRequests});
  }
}
