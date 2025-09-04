import { Attendance } from "../models/Attendance.entities";
import { AttendanceResponseDTO } from "../dtos/ResponseDTOs/AttendanceDTO";
import {
  RegularizationRequestDTO,
  CreateAttendanceRequestDTO,
  UpdateAttendanceRequestDTO,
} from "../dtos/RequestDTOs/AttendanceDTO";

export class AttendanceMapper {
  static toResponseDTO(attendance: Attendance): AttendanceResponseDTO {
    return {
      _id: attendance._id ?? "",
      employeeId: attendance.employeeId,
      date: attendance.date?.toDateString() ?? "",
      checkInTime: attendance.checkInTime?.toDateString() ?? null,
      checkOutTime: attendance.checkOutTime?.toDateString() ?? null,
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
