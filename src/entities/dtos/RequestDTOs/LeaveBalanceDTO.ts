// Request DTO (when creating or updating leave balances)
export interface CreateLeaveBalanceRequestDTO {
  employeeId: string;
  leaveBalances: {
    leaveTypeId: string;
    availableDays: number;
    usedDays: number;
    totalDays: number;
  }[];
}

export interface UpdateLeaveBalanceRequestDTO {
  leaveBalances: {
    leaveTypeId: string;
    availableDays?: number;
    usedDays?: number;
    totalDays?: number;
  }[];
}
