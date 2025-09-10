import { CreateLeaveTypeDTO, UpdateLeaveTypeDTO } from "../dtos/RequestDTOs/LeaveTypeDTO";
import { LeaveTypeResponseDTO } from "../dtos/ResponseDTOs/LeaveTypeDTO";
import { LeaveType } from "../models/LeaveType.entity";

export interface ILeaveTypeUseCase {
    createLeaveType(data: CreateLeaveTypeDTO): Promise<LeaveTypeResponseDTO>;
    getLeaveTypeById(id: string): Promise<LeaveTypeResponseDTO | null>;
    getAllLeaveTypes(options: {
        page: number;
        limit: number;
        isPaid?: boolean;
    }): Promise<{ leaveTypes: LeaveTypeResponseDTO[]; totalPages: number }>
    updateLeaveType(id: string, data: UpdateLeaveTypeDTO): Promise<LeaveTypeResponseDTO | null>;
    deleteLeaveType(id: string): Promise<boolean>;
    getEveryLeaveType(): Promise<LeaveTypeResponseDTO[]>;
}