import { LeaveTypeDTO } from "../dtos/LeaveTypeDTO";
import { LeaveType } from "../models/LeaveType.entity";

export interface ILeaveTypeRepository {
    createLeaveType(data: LeaveTypeDTO): Promise<LeaveType>;
    getLeaveTypeById(id: string): Promise<LeaveType | null>;
    getAllLeaveTypes(options: {
        page: number;
        limit: number;
        isPaid?: boolean;
    }): Promise<{ leaveTypes: LeaveType[]; totalPages: number }>;
    getEveryLeaveType(): Promise<LeaveType[]>;
    updateLeaveType(id: string, data: Partial<LeaveTypeDTO>): Promise<LeaveType | null>;
    deleteLeaveType(id: string): Promise<boolean>;
}