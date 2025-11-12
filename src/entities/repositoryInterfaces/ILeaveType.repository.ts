import { ILeaveType } from "../../adapters/database/models/LeaveTypeModel";
import { LeaveType } from "../models/LeaveType.entity";
import { IBaseRepository } from "./IBase.repository";

export interface ILeaveTypeRepository extends IBaseRepository<ILeaveType> {
    getAllLeaveTypes(options: {
        page: number;
        limit: number;
        isPaid?: boolean;
    }): Promise<{ leaveTypes: LeaveType[]; totalPages: number }>;
    deleteLeaveType(id: string): Promise<boolean>;
}