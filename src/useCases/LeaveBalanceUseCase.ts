import { injectable, inject } from "tsyringe";
import { ILeaveBalanceRepository } from "../entities/repositoryInterfaces/ILeaveBalance.repository";
import { ILeaveBalanceUseCase } from "../entities/useCaseInterface/ILeaveBalanceUseCase";
import { ILeaveTypeRepository } from "../entities/repositoryInterfaces/ILeaveType.repository";
import { LeaveBalanceResponseDTO, } from "../entities/dtos/ResponseDTOs/LeaveBalanceDTO";
import { LeaveBalanceMapper } from "../entities/mapping/LeaveBalanceMapping";

@injectable()
export class LeaveBalanceUseCase implements ILeaveBalanceUseCase {
    constructor(
        @inject("ILeaveBalanceRepository") private leaveBalanceRepository: ILeaveBalanceRepository,
        @inject("ILeaveTypeRepository") private leaveTypeRepository: ILeaveTypeRepository,
    ) { }

    async initializeLeaveBalance(employeeId: string, leaveTypes: { leaveTypeId: string; totalDays: number }[]): Promise<void> {
        const leaveBalances = leaveTypes.map(leaveType => ({
            leaveTypeId: leaveType.leaveTypeId,
            totalDays: leaveType.totalDays,
            availableDays: leaveType.totalDays,
            usedDays: 0,
        }));

        await this.leaveBalanceRepository.initializeLeaveBalance(employeeId, leaveBalances);
    }

    async getLeaveBalanceByEmployeeId(employeeId: string): Promise<LeaveBalanceResponseDTO | null> {
        const leaveBalances = await this.leaveBalanceRepository.getLeaveBalanceByEmployeeId(employeeId);
        if (!leaveBalances) return null;
        
        return LeaveBalanceMapper.toResponseDTO(leaveBalances);
    }

    async deductLeave(employeeId: string, leaveTypeId: string, usedDays: number): Promise<boolean> {
        return await this.leaveBalanceRepository.deductLeave(employeeId, leaveTypeId, usedDays);
    }

    async restoreLeave(employeeId: string, leaveTypeId: string, restoredDays: number): Promise<boolean> {
        return await this.leaveBalanceRepository.restoreLeave(employeeId, leaveTypeId, restoredDays);
    }

    async resetLeaveBalance(employeeId: string): Promise<void> {
        await this.leaveBalanceRepository.resetLeaveBalance(employeeId);
    }

    async updateLeaveType(employeeId: string, leaveTypeId: string, newTotalDays: number): Promise<boolean> {
        const leaveBalance = await this.getLeaveBalanceByEmployeeId(employeeId);
        if (!leaveBalance) return false;

        const leaveType = leaveBalance.leaveBalances.find(lb => lb.leaveTypeId.toString() === leaveTypeId);
        if (!leaveType) return false;

        leaveType.totalDays = newTotalDays;
        leaveType.availableDays = Math.max(0, newTotalDays - leaveType.usedDays);

        return await this.leaveBalanceRepository.updateLeaveType(employeeId, leaveTypeId, leaveType.availableDays);
    }

    async addLeaveTypeToAllEmployees(leaveTypeId: string, totalDays: number): Promise<void> {
        const allUsersLeaveBalances = await this.leaveBalanceRepository.getAllLeaveBalances();

        for (const leaveBalance of allUsersLeaveBalances) {
            const leaveTypeExists = leaveBalance.leaveBalances.some(lb => lb.leaveTypeId === leaveTypeId);

            if (!leaveTypeExists) {
                leaveBalance.leaveBalances.push({
                    leaveTypeId,
                    totalDays,
                    availableDays: totalDays,
                    usedDays: 0,
                });

                await this.leaveBalanceRepository.updateLeaveBalance(leaveBalance.employeeId.toString(), leaveBalance.leaveBalances);
            }
        }
    }

    async deleteLeaveBalance(employeeId: string): Promise<void> {
        await this.leaveBalanceRepository.deleteLeaveBalanceByEmployeeId(employeeId);
    }
}
