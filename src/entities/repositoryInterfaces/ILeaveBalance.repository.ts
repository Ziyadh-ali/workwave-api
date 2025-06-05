import { LeaveBalance } from "../models/LeaveBalance.entity";


export interface ILeaveBalanceRepository {
    initializeLeaveBalance(employeeId: string, leaveBalances: { leaveTypeId: string; totalDays: number , availableDays : number }[]): Promise<void>;
    getLeaveBalanceByEmployeeId(employeeId: string): Promise<LeaveBalance | null>;
    deductLeave(employeeId: string, leaveTypeId: string, usedDays: number): Promise<boolean>;
    restoreLeave(employeeId: string, leaveTypeId: string, restoredDays: number): Promise<boolean>;
    resetLeaveBalance(employeeId: string): Promise<void>;
    updateLeaveType(employeeId: string, leaveTypeId: string, newTotalDays: number): Promise<boolean>;
    updateLeaveBalance(employeeId: string, leaveBalances: LeaveBalance["leaveBalances"]): Promise<void>;
    getAllLeaveBalances(): Promise<LeaveBalance[]>;
    deleteLeaveBalanceByEmployeeId(employeeId: string): Promise<void>;
    getLeaveBalance(employeeId: string, leaveTypeId: string): Promise<{availableDays : number , totalDays : number}  | null>;
}

