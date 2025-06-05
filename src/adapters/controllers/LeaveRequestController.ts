import { injectable, inject } from "tsyringe";
import { ILeaveRequestUseCase } from "../../entities/useCaseInterface/ILeaveRequestUseCase";
import { Request, Response } from "express";
import { MESSAGES } from "../../shared/constants";
import { HTTP_STATUS_CODES } from "../../shared/constants";
import { IEmployeeProfileUseCase } from "../../entities/useCaseInterface/IEmployeeProfileUseCase";
import { leaveRequestSchema } from "../../shared/validation/validator";


@injectable()
export class LeaveRequestController {
    constructor(
        @inject("ILeaveRequestUseCase") private leaveRequestUseCase: ILeaveRequestUseCase,
        @inject("IEmployeeProfileUseCase") private employeeProfileUseCase: IEmployeeProfileUseCase,
    ) { }

    async createLeaveRequest(req: Request, res: Response): Promise<void> {
        try {
            const { data } = req.body;

            const validation = leaveRequestSchema.safeParse(data);
            if (!validation.success) {
                res.status(HTTP_STATUS_CODES.BAD_REQUEST).json({
                    success: false,
                    message: "Validation failed",
                    errors: validation.error.errors.map(err => ({
                        field: err.path.join("."),
                        message: err.message,
                    })),
                });
            }

            const user = await this.employeeProfileUseCase.getEmployeeDetails(data?.employeeId);
            const newData = {
                ...data,
                assignedManager: user?.manager,
                employeeRole: user?.role,
            }
            const leaveRequest = await this.leaveRequestUseCase.createLeaveRequest(newData);

            if (!leaveRequest) {
                res.status(HTTP_STATUS_CODES.BAD_REQUEST).json({
                    success: false,
                    message: MESSAGES.ERROR.LEAVE.LEAVE_REQUEST_FAILED
                });
            }

            res.status(HTTP_STATUS_CODES.CREATED).json({
                success: true,
                message: MESSAGES.SUCCESS.LEAVE_REQUEST_SUBMITTED,
                leaveRequest
            });
        } catch (error) {
            console.error(error);
            res.status(HTTP_STATUS_CODES.INTERNAL_SERVER_ERROR).json({
                success: false,
                message: (error instanceof Error) ? error.message : MESSAGES.ERROR.GENERIC
            });
        }
    }

    async getLeaveRequestsByEmployee(req: Request, res: Response): Promise<void> {
        try {
            const { employeeId } = req.params;
            const leaveRequests = await this.leaveRequestUseCase.getLeaveRequestByEmployee(employeeId);
            res.status(HTTP_STATUS_CODES.OK).json({ success: true, leaveRequests });
        } catch (error) {
            console.error(error);
            res.status(HTTP_STATUS_CODES.INTERNAL_SERVER_ERROR).json({
                success: false,
                message: MESSAGES.ERROR.GENERIC
            });
        }
    }

    async updateLeaveRequestStatus(req: Request, res: Response): Promise<void> {
        try {
            const { leaveRequestId } = req.params;
            const { status , reason } = req.body;

            console.log(reason);
            console.log(status);

            if (!["Approved", "Rejected"].includes(status)) {
                res.status(HTTP_STATUS_CODES.BAD_REQUEST).json({
                    success: false,
                    message: MESSAGES.ERROR.LEAVE.INVALID_STATUS,
                });
                return;
            }

            if(status === "Rejected"){
                await this.leaveRequestUseCase.setRejectionReason(leaveRequestId , reason);
            }

            const updated = await this.leaveRequestUseCase.updateLeaveRequestStatus(
                leaveRequestId,
                status,
            );

            res.status(HTTP_STATUS_CODES.OK).json({
                success: true,
                message: MESSAGES.SUCCESS.OPERATION_SUCCESSFUL
            });
            return
        } catch (error) {
            console.error(error);
            res.status(HTTP_STATUS_CODES.INTERNAL_SERVER_ERROR).json({
                success: false,
                message: MESSAGES.ERROR.GENERIC
            });
        }
    }


    // async editLeaveRequest(req: Request, res: Response): Promise<void> {
    //     try {
    //         const { leaveRequestId } = req.params;
    //         const updates = req.body;

    //         const updated = await this.leaveRequestUseCase.editLeaveRequest(leaveRequestId, updates);
    //         if (!updated) {
    //             res.status(HTTP_STATUS_CODES.BAD_REQUEST).json({
    //                 success: false,
    //                 message: MESSAGES.ERROR.LEAVE.EDIT_FAILED
    //             });
    //         }

    //         res.status(HTTP_STATUS_CODES.OK).json({
    //             success: true,
    //             message: MESSAGES.SUCCESS.OPERATION_SUCCESSFUL
    //         });
    //     } catch (error) {
    //         console.error(error);
    //         res.status(HTTP_STATUS_CODES.INTERNAL_SERVER_ERROR).json({
    //             success: false,
    //             message: MESSAGES.ERROR.GENERIC
    //         });
    //     }
    // }

    async cancelLeaveRequest(req: Request, res: Response): Promise<void> {
        try {
            const { leaveRequestId } = req.params;

            const cancelled = await this.leaveRequestUseCase.cancelLeaveRequest(leaveRequestId);
            if (!cancelled) {
                res.status(HTTP_STATUS_CODES.BAD_REQUEST).json({
                    success: false,
                    message: MESSAGES.ERROR.LEAVE.CANCEL_FAILED
                });
            }

            res.status(HTTP_STATUS_CODES.OK).json({
                success: true,
                message: MESSAGES.SUCCESS.OPERATION_SUCCESSFUL
            });
        } catch (error) {
            console.error(error);
            res.status(HTTP_STATUS_CODES.INTERNAL_SERVER_ERROR).json({
                success: false,
                message: MESSAGES.ERROR.GENERIC
            });
        }
    }

    async getAllLeaveRequests(req: Request, res: Response): Promise<void> {
        try {
            const leaveRequests = await this.leaveRequestUseCase.getAllLeaveRequests();
            res.status(HTTP_STATUS_CODES.OK).json({
                success: true,
                leaveRequests,
            });
        } catch (error) {
            console.error("Error fetching leave requests for approval:", error);
            res.status(HTTP_STATUS_CODES.INTERNAL_SERVER_ERROR).json({
                success: false,
                message: MESSAGES.ERROR.GENERIC,
            });
        }
    }

    // async setRegectionStatus(req: Request, res: Response): Promise<void> {
    //     try {
    //         const { leaveRequestId } = req.params;
    //         const { reason } = req.body;

    //         await this.leaveRequestUseCase.setRejectionReason(leaveRequestId, reason);

    //         await this.leaveRequestUseCase.updateLeaveRequestStatus(leaveRequestId , "Rejected");

    //         res.status(HTTP_STATUS_CODES.OK).json({
    //             message : MESSAGES.SUCCESS.LEAVE_REQUEST_REJECTED,
    //         })
    //     } catch (error) {
    //         res.status(HTTP_STATUS_CODES.INTERNAL_SERVER_ERROR).json({
    //             success: false,
    //             message: MESSAGES.ERROR.GENERIC,
    //         });
    //     }
    // }
}