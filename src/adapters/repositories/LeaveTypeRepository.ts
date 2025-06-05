import { ILeaveTypeRepository } from "../../entities/repositoryInterfaces/ILeaveType.repository";
import { LeaveType } from "../../entities/models/LeaveType.entity";
import { LeaveTypeModel } from "../../frameworks/database/models/LeaveTypeModel";
import { LeaveTypeDTO } from "../../entities/dtos/LeaveTypeDTO";
import { injectable } from "tsyringe";

@injectable()
export class LeaveTypeRepository implements ILeaveTypeRepository {
    async createLeaveType(data: LeaveTypeDTO): Promise<LeaveType> {
        return await LeaveTypeModel.create(data);
    }

    async getLeaveTypeById(id: string): Promise<LeaveType | null> {
        return await LeaveTypeModel.findById(id);
    }

    async getAllLeaveTypes(): Promise<LeaveType[]> {
        return await LeaveTypeModel.find();
    }

    async updateLeaveType(id: string, data: Partial<LeaveTypeDTO>): Promise<LeaveType | null> {
        return await LeaveTypeModel.findByIdAndUpdate(id , data , {new : true});
    }

    async deleteLeaveType(id: string): Promise<boolean> {
        const deleted = await LeaveTypeModel.findByIdAndDelete(id);
        return !!deleted;
    }
}