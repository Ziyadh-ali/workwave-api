import { CreateLeaveTypeDTO } from "../dtos/RequestDTOs/LeaveTypeDTO";
import { LeaveType } from "../models/LeaveType.entity";

export interface ILeaveTypeRepository {
    createLeaveType(data: CreateLeaveTypeDTO): Promise<LeaveType>;
    getLeaveTypeById(id: string): Promise<LeaveType | null>;
    getAllLeaveTypes(options: {
        page: number;
        limit: number;
        isPaid?: boolean;
    }): Promise<{ leaveTypes: LeaveType[]; totalPages: number }>;
    getEveryLeaveType(): Promise<LeaveType[]>;
    updateLeaveType(id: string, data: Partial<LeaveType>): Promise<LeaveType | null>;
    deleteLeaveType(id: string): Promise<boolean>;
}