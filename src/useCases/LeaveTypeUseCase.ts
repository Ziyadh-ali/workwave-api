import { inject , injectable } from "tsyringe";
import { ILeaveTypeUseCase } from "../entities/useCaseInterface/ILeaveTypeUseCase";
import { ILeaveTypeRepository } from "../entities/repositoryInterfaces/ILeaveType.repository";
import { LeaveType } from "../entities/models/LeaveType.entity";
import { LeaveTypeDTO } from "../entities/dtos/LeaveTypeDTO";
import { MESSAGES } from "../shared/constants";
import { eventHandler } from "../shared/eventHandler";

@injectable()
export class LeaveTypeUseCase implements ILeaveTypeUseCase {
    constructor(
        @inject("ILeaveTypeRepository") private leaveTypeRepository : ILeaveTypeRepository,
    ) {}

    async createLeaveType(data: LeaveTypeDTO): Promise<LeaveType> {
        const newLeaveType =  await this.leaveTypeRepository.createLeaveType(data);

        eventHandler.emit("LEAVE_TYPE_ADDED",newLeaveType._id , newLeaveType.maxDaysAllowed);

        return newLeaveType;
    }

    async getLeaveTypeById(id: string): Promise<LeaveType | null> {
        const leaveType = await this.leaveTypeRepository.getLeaveTypeById(id);
        if (!leaveType) {
            throw new Error(MESSAGES.ERROR.LEAVE_TYPE.NOT_FOUND);
        }
        return leaveType;
    }

    async getAllLeaveTypes(): Promise<LeaveType[]> {
        return await this.leaveTypeRepository.getAllLeaveTypes();
    }

    async updateLeaveType(id: string, data: Partial<LeaveTypeDTO>): Promise<LeaveType | null> {
        const updatedLeaveType = await this.leaveTypeRepository.updateLeaveType(id, data);
        if (!updatedLeaveType) {
            throw new Error(MESSAGES.ERROR.LEAVE_TYPE.UPDATE_FAILED);
        }
        return updatedLeaveType;
    }

    async deleteLeaveType(id: string): Promise<boolean> {
        const isDeleted = await this.leaveTypeRepository.deleteLeaveType(id);
        if (!isDeleted) {
            throw new Error(MESSAGES.ERROR.LEAVE_TYPE.DELETE_FAILED);
        }
        return isDeleted;
    }
}