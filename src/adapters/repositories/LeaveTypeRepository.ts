import { ILeaveTypeRepository } from "../../entities/repositoryInterfaces/ILeaveType.repository";
import { LeaveType } from "../../entities/models/LeaveType.entity";
import { ILeaveType, LeaveTypeModel } from "../database/models/LeaveTypeModel";
import { injectable } from "tsyringe";
import { BaseRepository } from "./BaseRepository";

@injectable()
export class LeaveTypeRepository extends BaseRepository<ILeaveType> implements ILeaveTypeRepository {
    constructor(){
        super(LeaveTypeModel);
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

    async deleteLeaveType(id: string): Promise<boolean> {
        const deleted = await LeaveTypeModel.findByIdAndDelete(id);
        return !!deleted;
    }
}