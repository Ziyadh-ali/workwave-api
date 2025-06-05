import { Request, Response } from "express";
import { inject, injectable } from "tsyringe";
import { ILeaveTypeUseCase } from "../../entities/useCaseInterface/ILeaveTypeUseCase";
import { LeaveTypeDTO } from "../../entities/dtos/LeaveTypeDTO";
import { HTTP_STATUS_CODES, MESSAGES } from "../../shared/constants";
import { ILeaveTypeController } from "../../entities/controllerInterface/ILeaveTypeController";

@injectable()
export class LeaveTypeController implements ILeaveTypeController {
    constructor(
        @inject("ILeaveTypeUseCase") private leaveTypeUseCase: ILeaveTypeUseCase,
    ) { }

    async createLeaveType(req: Request, res: Response): Promise<void> {
        try {
            const leaveTypeData: LeaveTypeDTO = req.body;
            const leaveType = await this.leaveTypeUseCase.createLeaveType(leaveTypeData);
            res.status(HTTP_STATUS_CODES.CREATED).json({
                success: true,
                message: MESSAGES.SUCCESS.LEAVE_TYPE_CREATED,
                data: leaveType,
            });
        } catch (error) {
            console.error("Error in createLeaveType:", error);
            res.status(HTTP_STATUS_CODES.BAD_REQUEST).json({
                success: false,
                message: error instanceof Error ? error.message : MESSAGES.ERROR.GENERIC,
            });
        }
    }

    async getLeaveTypeById(req : Request , res : Response) : Promise<void> {
        try {
            const {id} = req.body;
            const leaveType = await this.leaveTypeUseCase.getLeaveTypeById(id);
            res.status(HTTP_STATUS_CODES.OK).json({
                success: true,
                data: leaveType,
            });
        } catch (error) {
            console.error("Error in getLeaveTypeById:", error);
            res.status(HTTP_STATUS_CODES.NOT_FOUND).json({
                success: false,
                message: error instanceof Error ? error.message : MESSAGES.ERROR.GENERIC,
            });
        }
    }

    async getAllLeaveTypes(req : Request , res :Response) : Promise<void> {
        try {
            const leaveTypes = await this.leaveTypeUseCase.getAllLeaveTypes();
            res.status(HTTP_STATUS_CODES.OK).json({
                success: true,
                data: leaveTypes,
            });
        } catch (error) {
            console.error("Error in getAllLeaveTypes:", error);
            res.status(HTTP_STATUS_CODES.INTERNAL_SERVER_ERROR).json({
                success: false,
                message: MESSAGES.ERROR.GENERIC,
            });
        }
    }

    async updateLeaveType(req: Request, res: Response): Promise<void> {
        try {
            const { id } = req.params;
            const updateData: Partial<LeaveTypeDTO> = req.body;
            const updatedLeaveType = await this.leaveTypeUseCase.updateLeaveType(id, updateData);
            res.status(HTTP_STATUS_CODES.OK).json({
                success: true,
                message: MESSAGES.SUCCESS.LEAVE_TYPE_UPDATED,
                data: updatedLeaveType,
            });
        } catch (error) {
            console.error("Error in updateLeaveType:", error);
            res.status(HTTP_STATUS_CODES.BAD_REQUEST).json({
                success: false,
                message: error instanceof Error ? error.message : MESSAGES.ERROR.GENERIC,
            });
        }
    }

    async deleteLeaveType(req: Request, res: Response): Promise<void> {
        try {
            const { id } = req.params;
            await this.leaveTypeUseCase.deleteLeaveType(id);
            res.status(HTTP_STATUS_CODES.OK).json({
                success: true,
                message: MESSAGES.SUCCESS.LEAVE_TYPE_DELETED,
            });
        } catch (error) {
            console.error("Error in deleteLeaveType:", error);
            res.status(HTTP_STATUS_CODES.BAD_REQUEST).json({
                success: false,
                message: error instanceof Error ? error.message : MESSAGES.ERROR.GENERIC,
            });
        }
    }
}