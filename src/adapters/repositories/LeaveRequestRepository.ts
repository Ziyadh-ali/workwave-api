import { inject, injectable } from "tsyringe";
import { LeaveRequest, LeaveRequestFilter } from "../../entities/models/LeaveRequest.entity";
import { ILeaveRequestRepository } from "../../entities/repositoryInterfaces/ILeaveRequest.repository";
import { LeaveRequestModel } from "../../frameworks/database/models/LeaveRequestModel";
import { EmployeeModel } from "../../frameworks/database/models/employee/EmployeeModel";

@injectable()
export class LeaveRequestRepository implements ILeaveRequestRepository {
    async createLeaveRequest(leaveRequest: LeaveRequest): Promise<LeaveRequest> {
        return await LeaveRequestModel.create(leaveRequest);
    }

    async getLeaveRequestForApproval(managerId: string): Promise<LeaveRequest[]> {
        return await LeaveRequestModel.find({ assignedManager: managerId, status: "Pending" }).lean();
    }

    async getLeaveRequestByEmployee(options: {
        employeeId: string;
        page: number;
        limit: number;
        search: string;
        status: string;
    }): Promise<{ leaveRequests: LeaveRequest[]; totalPages: number }> {
        const { employeeId, page, limit, search, status } = options;

        const query: {
            employeeId: string,
            status?: string,
        } = { employeeId };

        if (status) {
            query.status = status;
        }

        const totalCount = await LeaveRequestModel.countDocuments(query);

        const leaveRequests = await LeaveRequestModel.find(query)
            .populate({ path: "leaveTypeId", select: "name" })
            .sort({ createdAt: -1 })
            .skip((page - 1) * limit)
            .limit(limit)
            .lean();

        const totalPages = Math.ceil(totalCount / limit);

        return {
            leaveRequests,
            totalPages
        }
    }

    async updateLeaveRequestStatus(leaveRequestId: string, status: "Approved" | "Rejected"): Promise<boolean> {
        const result = await LeaveRequestModel.updateOne({ _id: leaveRequestId }, { $set: { status } }, { new: true });
        return result.modifiedCount > 0;
    }

    async editLeaveRequest(leaveRequestId: string, updates: Partial<LeaveRequest>): Promise<boolean> {
        const leaveRequest = await LeaveRequestModel.findById(leaveRequestId);

        if (!leaveRequest || leaveRequest.status !== "Pending") return false;

        Object.assign(leaveRequest, updates);
        await leaveRequest.save();
        return true;
    }

    async cancelLeaveRequest(leaveRequestId: string): Promise<boolean> {
        await LeaveRequestModel.findByIdAndUpdate(leaveRequestId, { status: "Cancelled" });
        return true;
    }

    async getAllLeaveRequests(options: {
        page: number;
        limit: number;
        status: string;
    }): Promise<{ leaveRequests: LeaveRequest[]; totalPages: number }> {
        const { page, limit, status } = options;

        const query: {
            status?: string,
        } = {}

        if(status){
            query.status = status;
        }

        const totalCount = await LeaveRequestModel.countDocuments(query);
        const leaveRequests =  await LeaveRequestModel.find(query)
            .populate({
                path: "leaveTypeId",
                select: "name",
            })
            .populate({
                path: "employeeId",
                select: "fullName role",
            })
            .sort({createdAt: -1})
            .skip((page - 1) * limit)
            .limit(limit)
            .lean()

        const totalPages = Math.ceil(totalCount / limit);

        return {
            leaveRequests,
            totalPages
        }

    }

    async getFilteredLeaveRequests(filters: LeaveRequestFilter): Promise<LeaveRequest[]> {
        const query: any = {};

        if (filters.status) query.status = filters.status;
        if (filters.userRole) query.userRole = filters.userRole;

        if (filters.startDate && filters.endDate) {
            query.startDate = { $gte: filters.startDate };
            query.endDate = { $lte: filters.endDate };
        }

        let leaveRequestsQuery = LeaveRequestModel.find(query)
            .populate({
                path: "leaveTypeId",
                select: "name",
            })
            .populate({
                path: "employeeId",
                select: "fullName role",
            });

        // If searching by employee name
        if (filters.search) {
            // First, find matching employees by name
            const matchingEmployees = await EmployeeModel.find({
                fullName: { $regex: filters.search, $options: "i" },
            }).select("_id");

            const employeeIds = matchingEmployees.map((emp) => emp._id);
            query.employeeId = { $in: employeeIds };

            leaveRequestsQuery = LeaveRequestModel.find(query)
                .populate({
                    path: "leaveTypeId",
                    select: "name",
                })
                .populate({
                    path: "employeeId",
                    select: "fullName role",
                });
        }

        return await leaveRequestsQuery.exec();
    }

    async getLeaveRequestById(leaveRequestId: string): Promise<LeaveRequest | null> {
        return await LeaveRequestModel.findById(leaveRequestId).lean();
    }

    async setRejectionReason(leaveRequestId: string, reason: string): Promise<void> {
        await LeaveRequestModel.findByIdAndUpdate(leaveRequestId, {
            rejectionReason: reason,
        });
    }

    async getLeaveRequestForDate(employeeId: string, date: Date): Promise<LeaveRequest | null> {

        const startOfDay = new Date(date);
        startOfDay.setHours(0, 0, 0, 0);

        const endOfDay = new Date(date);
        endOfDay.setHours(23, 59, 59, 999);

        return await LeaveRequestModel.findOne({
            employeeId,
            startDate: { $lte: endOfDay },
            endDate: { $gte: startOfDay }
        });
    }

    async getLeaveRequestsOfEmployee(employeeId: string): Promise<LeaveRequest[] | null> {
        return await LeaveRequestModel.findById(employeeId);
    }
}