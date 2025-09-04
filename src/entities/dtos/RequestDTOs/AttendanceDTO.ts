export interface CreateAttendanceRequestDTO {
  employeeId: string;
  date: string;
  checkInTime?: string | null;
  checkOutTime?: string | null;
  status: "Present" | "Absent" | "Weekend" | "Holiday" | "Pending" | "Late";
}

export interface UpdateAttendanceRequestDTO {
  checkInTime?: string | null;
  checkOutTime?: string | null;
  status?: "Present" | "Absent" | "Weekend" | "Holiday" | "Pending" | "Late";
  isRegularized?: boolean;
  isRegularizable?: boolean;
}
export interface RegularizationRequestDTO {
  requestedBy: string;
  reason: string;
  requestedStatus: "Present" | "Absent" | "Late" | "Leave";
  status: "Pending" | "Approved" | "Rejected";
  adminRemarks?: string;
}