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

    async getAllLeaveTypes(options: {
        page: number;
        limit: number;
        isPaid?: boolean;
    }): Promise<{ leaveTypes: LeaveType[]; totalPages: number }> {
        const { page, limit, isPaid } = options;

        const query: {
            isPaid?: boolean;
        } = {};
        if (isPaid !== undefined) {
            query.isPaid = isPaid;
        }

        const totalCount = await LeaveTypeModel.countDocuments(query);

        const leaveTypes = await LeaveTypeModel.find(query)
            .skip((page - 1) * limit)
            .limit(limit)
            .sort({ createdAt: -1 })
            .lean();

        const totalPages = Math.ceil(totalCount / limit);

        return {
            leaveTypes,
            totalPages,
        };
    }

    async updateLeaveType(id: string, data: Partial<LeaveTypeDTO>): Promise<LeaveType | null> {
        return await LeaveTypeModel.findByIdAndUpdate(id, data, { new: true });
    }

    async deleteLeaveType(id: string): Promise<boolean> {
        const deleted = await LeaveTypeModel.findByIdAndDelete(id);
        return !!deleted;
    }

    async getEveryLeaveType(): Promise<LeaveType[]> {
        return await LeaveTypeModel.find({});
    }
}