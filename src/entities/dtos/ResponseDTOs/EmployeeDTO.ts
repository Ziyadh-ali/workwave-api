import { ObjectId } from "mongoose";

export interface EmployeeResponseDTO {
  _id: string | ObjectId;
  fullName: string;
  email: string;
  department: string;
  role: "hr" | "developer" | "projectManager";
  status: "active" | "inactive";
  phone?: number;
  address?: string;
  joinedAt?: string;
  manager?: string;
  profilePic?: string;
  salary: number;
  salaryType: "hourly" | "monthly";
  createdAt?: string;
}

