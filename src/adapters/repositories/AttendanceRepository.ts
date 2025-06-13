import { injectable, inject } from "tsyringe";
import { IAttendanceRepository } from "../../entities/repositoryInterfaces/IAttendance.repository";
import { Attendance } from "../../entities/models/Attendance.entities";
import { attendanceModel } from "../../frameworks/database/models/AttendanceModel";

@injectable()
export class AttendanceRepository implements IAttendanceRepository {
    async createAttendance(employeeId: string, date: Date): Promise<Attendance> {
        return await attendanceModel.create({
            employeeId,
            date,
        });
    }

    async getAttendanceByDate(employeeId: string, date: Date): Promise<Attendance | null> {
        const startOfDay = new Date(date);
        startOfDay.setHours(0, 0, 0, 0);

        const endOfDay = new Date(date);
        endOfDay.setHours(23, 59, 59, 999);

        return await attendanceModel.findOne({
            employeeId,
            date: { $gte: startOfDay, $lte: endOfDay }
        });
    }

    async getAttendanceByMonth(employeeId: string, year: number, month: number): Promise<Attendance[] | []> {
        const startOfMonth = new Date(year, month - 1, 1);
        const endOfMonth = new Date(year, month, 0, 23, 59, 59, 999);

        if (isNaN(startOfMonth.getTime()) || isNaN(endOfMonth.getTime())) {
            throw new Error("Invalid start or end date");
        }

        return await attendanceModel.find({
            employeeId,
            date: {
                $gte: startOfMonth,
                $lte: endOfMonth,
            },
        }).sort({ date: 1 });
    }

    async markCheckIn(employeeId: string, time: Date, startOfDay: Date, endOfDay: Date): Promise<Attendance> {
        let attendance = await attendanceModel.findOne({
            employeeId,
            date: {
                $gte: startOfDay,
                $lte: endOfDay,
            }
        });

        if (!attendance) {
            attendance = await attendanceModel.create({ employeeId, date: new Date() })
        }

        attendance.checkInTime = time
        return await attendance.save();
    }

    async markCheckOut(
        employeeId: string,
        time: Date,
        startOfDay: Date,
        endOfDay: Date,
    ): Promise<Attendance> {
        let attendance = await attendanceModel.findOne({
            employeeId,
            date: {
                $gte: startOfDay,
                $lte: endOfDay,
            }
        });

        if (!attendance) {
            throw new Error("Attendance not found");
        }

        attendance.checkOutTime = time;

        return await attendance.save();
    }

    async updateStatus(id: string, status: "Present" | "Absent" | "Weekend" | "Holiday" | "Pending" | "Late"): Promise<Attendance | null> {
        return await attendanceModel.findByIdAndUpdate(id, { status });
    }

    async updateAttendance(
        id: string,
        data: {
            status?: "Present" | "Absent" | "Weekend" | "Holiday" | "Pending" | "Late";
            checkInTime?: Date;
            checkOutTime?: Date;
        }
    ): Promise<Attendance | null> {
        const updateData: any = {};

        if (data.status) updateData.status = data.status;
        if (data.checkInTime) updateData.checkInTime = data.checkInTime;
        if (data.checkOutTime) updateData.checkOutTime = data.checkOutTime;

        console.log("Updated one",updateData)

        return await attendanceModel.findByIdAndUpdate(id, updateData, { new: true });
    }

    async getAllAttendanceByDate(date: Date | null, page: number, pageSize: number): Promise<{ data: Attendance[] | [], total: number }> {
        const query: any = {};
        if (date) {
            const start = new Date(date);
            start.setHours(0, 0, 0, 0);
            const end = new Date(date);
            end.setHours(23, 59, 59, 999);
            query.date = { $gte: start, $lte: end };
        }

        const skip = (page - 1) * pageSize;

        const [data, total] = await Promise.all([
            attendanceModel.find(query).skip(skip).limit(pageSize).populate("employeeId", "fullName").lean(),
            attendanceModel.countDocuments(query),
        ]);

        return { data, total };
    }

    async requestRegularization(
        attendanceId: string,
        requestedBy: string,
        reason: string,
    ): Promise<Attendance | null> {
        return await attendanceModel.findByIdAndUpdate(
            attendanceId,
            {
                regularizationRequest: {
                    requestedBy,
                    reason,
                    status: "Pending",
                },
                isRegularizable: true,
            },
            { new: true }
        );
    }

    async respondToRegularizationRequest(
        attendanceId: string,
        action: "Approved" | "Rejected",
        adminRemarks?: string
    ): Promise<Attendance | null> {
        const update: any = {
            "regularizationRequest.status": action,
            "regularizationRequest.adminRemarks": adminRemarks || "",
            isRegularized: true
        };
        return await attendanceModel.findByIdAndUpdate(attendanceId, update, { new: true });
    }

    async getAllPendingRegularizationRequests(): Promise<Attendance[]> {
        return await attendanceModel.find({ "regularization.status": "Pending" });
    }
}