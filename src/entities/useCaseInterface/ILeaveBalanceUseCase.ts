import { LeaveBalance } from "../models/LeaveBalance.entity";

export interface ILeaveBalanceUseCase {
    initializeLeaveBalance(employeeId: string, leaveBalances: { leaveTypeId: string; totalDays: number }[]): Promise<void>;
    getLeaveBalanceByEmployeeId(employeeId: string): Promise<LeaveBalance | null>;
    deductLeave(employeeId: string, leaveTypeId: string, usedDays: number): Promise<boolean>;
    restoreLeave(employeeId: string, leaveTypeId: string, restoredDays: number): Promise<boolean>;
    resetLeaveBalance(employeeId: string): Promise<void>;
    updateLeaveType(employeeId: string, leaveTypeId: string, newTotalDays: number): Promise<boolean>;
    addLeaveTypeToAllEmployees(leaveTypeId: string, totalDays: number): Promise<void>;
    deleteLeaveBalance(employeeId: string): Promise<void>;
}