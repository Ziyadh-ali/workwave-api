import { LeaveTypeDTO } from "../dtos/LeaveTypeDTO";
import { LeaveType } from "../models/LeaveType.entity";

export interface ILeaveTypeUseCase {
    createLeaveType(data: LeaveTypeDTO): Promise<LeaveType>;
    getLeaveTypeById(id: string): Promise<LeaveType | null>;
    getAllLeaveTypes(): Promise<LeaveType[]>;
    updateLeaveType(id: string, data: Partial<LeaveTypeDTO>): Promise<LeaveType | null>;
    deleteLeaveType(id: string): Promise<boolean>;
}