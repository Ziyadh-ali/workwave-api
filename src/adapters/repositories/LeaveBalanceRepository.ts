import { injectable  } from "tsyringe";
import { ILeaveBalanceRepository } from "../../entities/repositoryInterfaces/ILeaveBalance.repository";
import { LeaveBalanceModel } from "../../frameworks/database/models/LeaveBalanceModel";
import { LeaveBalance } from "../../entities/models/LeaveBalance.entity";

@injectable()
export class LeaveBalanceRepository implements ILeaveBalanceRepository {
    async initializeLeaveBalance(employeeId: string, leaveBalances: { leaveTypeId: string;totalDays : number; availableDays: number; }[]): Promise<void> {
        const newLeaveBalances = new LeaveBalanceModel({employeeId , leaveBalances});
        await newLeaveBalances.save();
    }

    async getLeaveBalanceByEmployeeId(employeeId: string): Promise<LeaveBalance | null> {
        return await LeaveBalanceModel.findOne({employeeId}).lean();
    }

    async deductLeave(employeeId: string, leaveTypeId: string, usedDays: number): Promise<boolean> {
        const leaveBalance = await LeaveBalanceModel.findOne({employeeId});
        if(!leaveBalance) return false;

        const leaveType = leaveBalance.leaveBalances.find(lb => lb.leaveTypeId === leaveTypeId);
        if(!leaveType || leaveType.availableDays < usedDays) return false;

        leaveType.availableDays -= usedDays;
        await leaveBalance.save();
        return true;
    }

    async restoreLeave(employeeId: string, leaveTypeId: string, restoredDays: number): Promise<boolean> {
        const leaveBalance = await LeaveBalanceModel.findOne({ employeeId });
        if (!leaveBalance) return false;
        
        const leaveType = leaveBalance.leaveBalances.find(lb => lb.leaveTypeId === leaveTypeId);
        if (!leaveType) return false;
        
        leaveType.availableDays += restoredDays;
        await leaveBalance.save();
        return true;
    }

    async resetLeaveBalance(employeeId: string): Promise<void> {
        const leaveBalances = await LeaveBalanceModel.find({ employeeId });

        if (!leaveBalances || leaveBalances.length === 0) {
            throw new Error("No leave balance records found for the user.");
        }

        for (const balance of leaveBalances) {
            for (const leave of balance.leaveBalances) {
                leave.usedDays = 0;
                leave.availableDays = leave.totalDays;
            }
            await balance.save();
        }
    }

    async updateLeaveType(employeeId: string, leaveTypeId: string, newTotalDays: number): Promise<boolean> {
        const leaveBalance = await LeaveBalanceModel.findOne({ employeeId });
        if (!leaveBalance) return false;
    
        const leaveType = leaveBalance.leaveBalances.find(lb => lb.leaveTypeId === leaveTypeId);
        if (!leaveType) return false;
    
        const usedDays = leaveType.totalDays - leaveType.availableDays;
        leaveType.totalDays = newTotalDays;
        leaveType.availableDays = Math.max(0, newTotalDays - usedDays);
    
        await leaveBalance.save();
        return true;
    }

    async updateLeaveBalance(employeeId: string, leaveBalances: LeaveBalance["leaveBalances"]): Promise<void> {
        await LeaveBalanceModel.updateOne(
            { employeeId },
            { $set: { leaveBalances } }
        );
    }

    async getAllLeaveBalances(): Promise<LeaveBalance[]> {
        return await LeaveBalanceModel.find();
    }

    async deleteLeaveBalanceByEmployeeId(employeeId: string): Promise<void> {
        await LeaveBalanceModel.deleteOne({ employeeId });
    }

    async getLeaveBalance(employeeId: string, leaveTypeId: string): Promise<{availableDays : number , totalDays : number} | null> {
        const leaveBalance = await LeaveBalanceModel.findOne(
            { employeeId, "leaveBalances.leaveTypeId": leaveTypeId },
            { "leaveBalances.$": 1 }
        );

        if (!leaveBalance || leaveBalance.leaveBalances.length === 0) {
            return null;
        }

        return {
            availableDays: leaveBalance.leaveBalances[0].availableDays,
            totalDays: leaveBalance.leaveBalances[0].totalDays
        };
    }
}