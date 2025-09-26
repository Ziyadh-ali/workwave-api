import { ILeaveBalance } from "../../frameworks/database/models/LeaveBalanceModel";
import { LeaveBalance } from "../models/LeaveBalance.entity";
import { IBaseRepository } from "./IBase.repository";


export interface ILeaveBalanceRepository extends IBaseRepository<ILeaveBalance> {
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

