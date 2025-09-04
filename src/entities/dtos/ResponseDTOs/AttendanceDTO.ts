import { ObjectId } from "mongoose";
import { RegularizationRequestDTO } from "../RequestDTOs/AttendanceDTO";

export interface AttendanceResponseDTO {
  _id: string | ObjectId;
  employeeId: string | ObjectId;
  date: string;
  checkInTime: string | null;
  checkOutTime: string | null;
  status: "Present" | "Absent" | "Weekend" | "Holiday" | "Pending" | "Late";
  isRegularized?: boolean;
  isRegularizable?: boolean;
  regularizationRequest?: RegularizationRequestDTO;
}