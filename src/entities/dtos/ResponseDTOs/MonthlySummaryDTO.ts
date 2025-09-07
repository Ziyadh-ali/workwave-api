import { ObjectId } from "mongoose";

export interface MonthlyAttendanceSummaryResponseDTO {
  _id: string | ObjectId;
  employeeId: string | ObjectId;
  month: number;
  year: number;
  workingDays: number;
  presentDays: number;
  leaveDays: number;
  nonPaidLeaves: number;
  status?: "Pending" | "Approved" | "Rejected";
  remarks?: string;
  rejectionReason?: string;
  generatedAt?: string;
  generatedBy: string | ObjectId;
}

export interface MonthlyAttendanceSummaryWithEmployeeResponseDTO {
  _id: string | ObjectId;
  employeeId: {
    _id: string | ObjectId;
    fullName: string;
    role: "admin" | "employee";
  };
  month: number;
  year: number;
  workingDays: number;
  presentDays: number;
  leaveDays: number;
  nonPaidLeaves: number;
  status?: "Pending" | "Approved" | "Rejected";
  remarks?: string;
  rejectionReason?: string;
  generatedAt?: string;
  generatedBy: string | ObjectId;
}