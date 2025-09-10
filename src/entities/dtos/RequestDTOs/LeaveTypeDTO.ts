// DTO for creating a new LeaveType
export interface CreateLeaveTypeDTO {
  name: string;
  description?: string;
  maxDaysAllowed: number;
  isPaid: boolean;
  requiresApproval?: boolean;
}

// DTO for updating an existing LeaveType
export interface UpdateLeaveTypeDTO {
  name?: string;
  description?: string;
  maxDaysAllowed?: number;
  isPaid?: boolean;
  requiresApproval?: boolean;
}
