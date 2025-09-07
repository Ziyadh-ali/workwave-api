export interface CreateMonthlyAttendanceSummaryRequestDTO {
  employeeId: string;
  month: number;
  year: number;
  workingDays: number;
  presentDays: number;
  leaveDays: number;
  nonPaidLeaves: number;
  generatedBy: string;
}

export interface UpdateMonthlyAttendanceSummaryRequestDTO {
  status?: "Pending" | "Approved" | "Rejected";
  remarks?: string;
  rejectionReason?: string;
}