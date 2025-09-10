import { ObjectId, Types } from "mongoose";

export interface IMonthlyAttendanceSummary {
  _id?: string | ObjectId;
  employeeId: ObjectId | string;
  month: number;
  year: number;
  workingDays: number;
  presentDays: number;
  leaveDays: number;
  nonPaidLeaves: number;
  status?: "Pending" | "Approved" | "Rejected";
  remarks?: string;
  rejectionReason?: string;
  generatedAt?: Date;
  generatedBy: string | ObjectId;
}

export interface IMonthlyAttendanceSummaryRes {
  _id?: string | ObjectId;
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
  generatedAt?: Date;
  generatedBy: string | ObjectId;
}
