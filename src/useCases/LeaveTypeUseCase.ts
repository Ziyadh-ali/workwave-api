import { inject, injectable } from "tsyringe";
import { ILeaveTypeUseCase } from "../entities/useCaseInterface/ILeaveTypeUseCase";
import { ILeaveTypeRepository } from "../entities/repositoryInterfaces/ILeaveType.repository";
import { LeaveType } from "../entities/models/LeaveType.entity";
import { LeaveTypeDTO } from "../entities/dtos/LeaveTypeDTO";
import { HTTP_STATUS_CODES, MESSAGES } from "../shared/constants";
import { eventHandler } from "../shared/eventHandler";
import { CustomError } from "../shared/errors/CustomError";

@injectable()
export class LeaveTypeUseCase implements ILeaveTypeUseCase {
    constructor(
        @inject("ILeaveTypeRepository") private leaveTypeRepository: ILeaveTypeRepository,
    ) { }

    async createLeaveType(data: LeaveTypeDTO): Promise<LeaveType> {
        const newLeaveType = await this.leaveTypeRepository.createLeaveType(data);

        eventHandler.emit("LEAVE_TYPE_ADDED", newLeaveType._id, newLeaveType.maxDaysAllowed);

        return newLeaveType;
    }

    async getLeaveTypeById(id: string): Promise<LeaveType | null> {
        const leaveType = await this.leaveTypeRepository.getLeaveTypeById(id);
        if (!leaveType) {
            throw new CustomError(MESSAGES.ERROR.LEAVE_TYPE.NOT_FOUND , HTTP_STATUS_CODES.NOT_FOUND);
        }
        return leaveType;
    }

    async getAllLeaveTypes(options: {
        page: number;
        limit: number;
        isPaid?: boolean;
    }): Promise<{ leaveTypes: LeaveType[]; totalPages: number }> {
        return await this.leaveTypeRepository.getAllLeaveTypes(options);
    }

    async updateLeaveType(id: string, data: Partial<LeaveTypeDTO>): Promise<LeaveType | null> {
        const updatedLeaveType = await this.leaveTypeRepository.updateLeaveType(id, data);
        if (!updatedLeaveType) {
            throw new CustomError(MESSAGES.ERROR.LEAVE_TYPE.UPDATE_FAILED , HTTP_STATUS_CODES.BAD_REQUEST);
        }
        return updatedLeaveType;
    }

    async deleteLeaveType(id: string): Promise<boolean> {
        const isDeleted = await this.leaveTypeRepository.deleteLeaveType(id);
        if (!isDeleted) {
            throw new CustomError(MESSAGES.ERROR.LEAVE_TYPE.DELETE_FAILED , HTTP_STATUS_CODES.BAD_REQUEST);
        }
        return isDeleted;
    }

    async getEveryLeaveType(): Promise<LeaveType[]> {
        return await this.leaveTypeRepository.getEveryLeaveType();
    }
}