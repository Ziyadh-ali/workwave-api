import { inject, injectable } from "tsyringe";
import { ILeaveTypeUseCase } from "../entities/useCaseInterface/ILeaveTypeUseCase";
import { ILeaveTypeRepository } from "../entities/repositoryInterfaces/ILeaveType.repository";
import { HTTP_STATUS_CODES, MESSAGES } from "../shared/constants";
import { eventHandler } from "../shared/eventHandler";
import { CustomError } from "../shared/errors/CustomError";
import { CreateLeaveTypeDTO, UpdateLeaveTypeDTO } from "../entities/dtos/RequestDTOs/LeaveTypeDTO";
import { LeaveTypeResponseDTO } from "../entities/dtos/ResponseDTOs/LeaveTypeDTO";
import { LeaveTypeMapper } from "../entities/mapping/LeaveTypeMapper";

@injectable()
export class LeaveTypeUseCase implements ILeaveTypeUseCase {
    constructor(
        @inject("ILeaveTypeRepository") private _leaveTypeRepository: ILeaveTypeRepository,
    ) { }

    async createLeaveType(data: CreateLeaveTypeDTO): Promise<LeaveTypeResponseDTO> {
        const newLeaveType = await this._leaveTypeRepository.create(data);

        eventHandler.emit("LEAVE_TYPE_ADDED", newLeaveType._id, newLeaveType.maxDaysAllowed);

        return LeaveTypeMapper.toResponseDTO(newLeaveType);
    }

    async getLeaveTypeById(id: string): Promise<LeaveTypeResponseDTO | null> {
        const leaveType = await this._leaveTypeRepository.findById(id);
        if (!leaveType) {
            throw new CustomError(MESSAGES.ERROR.LEAVE_TYPE.NOT_FOUND , HTTP_STATUS_CODES.NOT_FOUND);
        }
        return LeaveTypeMapper.toResponseDTO(leaveType);
    }

    async getAllLeaveTypes(options: {
        page: number;
        limit: number;
        isPaid?: boolean;
    }): Promise<{ leaveTypes: LeaveTypeResponseDTO[]; totalPages: number }> {
        const leaveTypes =  await this._leaveTypeRepository.getAllLeaveTypes(options);
        return {
            leaveTypes : leaveTypes.leaveTypes.map(LeaveTypeMapper.toResponseDTO),
            totalPages : leaveTypes.totalPages
        }
    }

    async updateLeaveType(id: string, data: UpdateLeaveTypeDTO): Promise<LeaveTypeResponseDTO | null> {
        const updatedLeaveType = await this._leaveTypeRepository.update(id, data);
        if (!updatedLeaveType) {
            throw new CustomError(MESSAGES.ERROR.LEAVE_TYPE.UPDATE_FAILED , HTTP_STATUS_CODES.BAD_REQUEST);
        }
        return LeaveTypeMapper.toResponseDTO(updatedLeaveType);
    }

    async deleteLeaveType(id: string): Promise<boolean> {
        const isDeleted = await this._leaveTypeRepository.deleteLeaveType(id);
        if (!isDeleted) {
            throw new CustomError(MESSAGES.ERROR.LEAVE_TYPE.DELETE_FAILED , HTTP_STATUS_CODES.BAD_REQUEST);
        }
        return isDeleted;
    }

    async getEveryLeaveType(): Promise<LeaveTypeResponseDTO[]> {
        return (await this._leaveTypeRepository.getAll()).map(LeaveTypeMapper.toResponseDTO);
    }
}