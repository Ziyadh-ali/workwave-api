
export interface LeaveRequestResponseDTO {
  _id: string;
  employeeId: string;
  leaveTypeId: string;
  startDate: string;
  endDate: string;
  reason?: string;
  duration?: "full" | "morning" | "afternoon";
  status: "Pending" | "Approved" | "Rejected" | "Cancelled";
  rejectionReason?: string;
  assignedManager?: string;
  userRole: string;
}