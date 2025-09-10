import { Request, Response } from "express";
import { inject, injectable } from "tsyringe";
import { ILeaveTypeUseCase } from "../../entities/useCaseInterface/ILeaveTypeUseCase";
import { HTTP_STATUS_CODES, MESSAGES } from "../../shared/constants";
import { ILeaveTypeController } from "../../entities/controllerInterface/ILeaveTypeController";
import { LeaveTypeMapper } from "../../entities/mapping/LeaveTypeMapper";

@injectable()
export class LeaveTypeController implements ILeaveTypeController {
    constructor(
        @inject("ILeaveTypeUseCase") private leaveTypeUseCase: ILeaveTypeUseCase,
    ) { }

    async createLeaveType(req: Request, res: Response): Promise<void> {
        const leaveTypeData = req.body;
        const leaveType = await this.leaveTypeUseCase.createLeaveType(LeaveTypeMapper.toEntity(leaveTypeData));
        res.status(HTTP_STATUS_CODES.CREATED).json({
            success: true,
            message: MESSAGES.SUCCESS.LEAVE_TYPE_CREATED,
            data: leaveType,
        });
    }

    async getLeaveTypeById(req: Request, res: Response): Promise<void> {
        const { id } = req.body;
        const leaveType = await this.leaveTypeUseCase.getLeaveTypeById(id);
        res.status(HTTP_STATUS_CODES.OK).json({
            success: true,
            data: leaveType,
        });
    }

    async getAllLeaveTypes(req: Request, res: Response): Promise<void> {
        const { page = "1", limit = "5", isPaid = "" } = req.query;

        const pageNum = parseInt(page as string, 10);
        const limitNum = parseInt(limit as string, 10);
        const paidFilter = isPaid === "" ? undefined : isPaid === "true";

        const result = await this.leaveTypeUseCase.getAllLeaveTypes({
            page: pageNum,
            limit: limitNum,
            isPaid: paidFilter,
        });

        res.status(200).json({
            success: true,
            ...result,
        });
    }

    async updateLeaveType(req: Request, res: Response): Promise<void> {
        const { id } = req.params;
        const updateData = req.body;
        const updatedLeaveType = await this.leaveTypeUseCase.updateLeaveType(id, LeaveTypeMapper.toEntity(updateData));
        res.status(HTTP_STATUS_CODES.OK).json({
            success: true,
            message: MESSAGES.SUCCESS.LEAVE_TYPE_UPDATED,
            data: updatedLeaveType,
        });
    }

    async deleteLeaveType(req: Request, res: Response): Promise<void> {
        const { id } = req.params;
        await this.leaveTypeUseCase.deleteLeaveType(id);
        res.status(HTTP_STATUS_CODES.OK).json({
            success: true,
            message: MESSAGES.SUCCESS.LEAVE_TYPE_DELETED,
        });
    }

    async getEveryLeaveType(req: Request, res: Response): Promise<void> {
        const leaveTypes = await this.leaveTypeUseCase.getEveryLeaveType();
        res.status(HTTP_STATUS_CODES.OK).json({
            success: true,
            leaveTypes
        });
    }
}