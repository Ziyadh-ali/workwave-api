export interface LeaveTypeResponseDTO {
  _id: string;
  name: string;
  description?: string;
  maxDaysAllowed: number;
  isPaid: boolean;
  requiresApproval?: boolean;
}
