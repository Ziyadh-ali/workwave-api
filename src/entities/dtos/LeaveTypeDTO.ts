export interface LeaveTypeDTO {
    name: string;
    description?: string;
    maxDaysAllowed: number;
    isPaidLeave: boolean;
    requiresApproval?: boolean;
}