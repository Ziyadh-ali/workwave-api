import { Document , model , ObjectId } from "mongoose";
import { Attendance } from "../../../entities/models/Attendance.entities";
import { AttendanceSchema } from "../schemas/AttendanceSchema";

export interface IAttendanceModel extends Omit<Attendance , "_id">,Document {
    _id : ObjectId;
}

export const attendanceModel = model<IAttendanceModel>("Attendance",AttendanceSchema);