import { Attendance } from "../models/Attendance.entities";
import { AttendanceResponseDTO } from "../dtos/ResponseDTOs/AttendanceDTO";
import {
  RegularizationRequestDTO,
  CreateAttendanceRequestDTO,
  UpdateAttendanceRequestDTO,
} from "../dtos/RequestDTOs/AttendanceDTO";
import { toIST } from "../../shared/utils/dateUtils";

const pad = (n: number) => n.toString().padStart(2, "0");

function formatHHMM(date: Date) {
  // date here should be an IST Date (we call toIST first)
  return `${pad(date.getHours())}:${pad(date.getMinutes())}`;
}
function formatYYYYMMDD(date: Date) {
  return date.toISOString().slice(0, 10); // still OK for date-only
}

export class AttendanceMapper {
  static toResponseDTO(attendance: Attendance): AttendanceResponseDTO {
    return {
      _id: attendance._id ?? "",
      employeeId: attendance.employeeId,
      checkInTime: attendance.checkInTime
        ? formatHHMM(toIST(attendance.checkInTime))
        : null,

      checkOutTime: attendance.checkOutTime
        ? formatHHMM(toIST(attendance.checkOutTime))
        : null,

      date: attendance.date ? formatYYYYMMDD(toIST(attendance.date)) : null,
      status: attendance.status,
      isRegularized: attendance.isRegularized,
      isRegularizable: attendance.isRegularizable,
      regularizationRequest:
        attendance.regularizationRequest as RegularizationRequestDTO,
    };
  }

  static toResponseDTOs(attendance: Attendance[]): AttendanceResponseDTO[] {
    return attendance.map(this.toResponseDTO);
  }

  static toEntityFromCreate(dto: CreateAttendanceRequestDTO): Attendance {
    return {
      employeeId: dto.employeeId,
      date: new Date(dto.date),
      checkInTime: dto.checkInTime ? new Date(dto.checkInTime) : null,
      checkOutTime: dto.checkOutTime ? new Date(dto.checkOutTime) : null,
      status: dto.status,
    };
  }

  static toEntityFromUpdate(
    dto: UpdateAttendanceRequestDTO
  ): Partial<Attendance> {
    return {
      checkInTime: dto.checkInTime ? new Date(dto.checkInTime) : null,
      checkOutTime: dto.checkOutTime ? new Date(dto.checkOutTime) : null,
      status: dto.status,
      isRegularized: dto.isRegularized,
      isRegularizable: dto.isRegularizable,
    };
  }
}
