import { injectable } from "tsyringe";
import { IMonthlySummaryRepository } from "../../entities/repositoryInterfaces/IMonthlySummaryRepository";
import { IMonthlyAttendanceSummary } from "../../entities/models/IMonthlyAttendanceSummary";
import { EmployeeModel } from "../../frameworks/database/models/employee/EmployeeModel";
import { fetchHolidayDates } from "../../shared/utils/fetchHolidayDates";
import { MonthlySummaryModel } from "../../frameworks/database/models/MonthlyAttendanceSummaryModel";
import { attendanceModel } from "../../frameworks/database/models/AttendanceModel";
import { LeaveRequestModel } from "../../frameworks/database/models/LeaveRequestModel";
import { Types } from "mongoose";
import { LeaveTypeModel } from "../../frameworks/database/models/LeaveTypeModel";

@injectable()
export class MonthlySummaryRepository implements IMonthlySummaryRepository {

    async generateSummary(
        month: number,
        year: number,
        generatedBy: {
            id: string,
            role: "admin" | "employee",
        },
        employeeId?: string
    ): Promise<IMonthlyAttendanceSummary | IMonthlyAttendanceSummary[]> {

        if (month < 1 || month > 12) {
            throw new Error("Invalid month");
        }

        let generator

        if (generatedBy.role == "employee") {
            generator = await EmployeeModel.findById(generatedBy.id);
            if (!generator) {
                throw new Error("Invalid generator");
            }
        }


        let employees = [];
        if (employeeId) {

            const employee = await EmployeeModel.findById(employeeId);
            if (!employee) {
                throw new Error("Employee not found");
            }
            employees = [employee];
        } else {
            if (generatedBy.role === "employee") {
                employees = await EmployeeModel.find({
                    role: { $ne: "hr" },
                    _id: { $ne: generatedBy.id }
                });
            } else {
                employees = await EmployeeModel.find();
            }
        }

        const existingSummaries = await MonthlySummaryModel.find({
            month,
            year,
            employeeId: { $in: employees.map(e => e._id) }
        });

        const existingEmployeeIds = existingSummaries.map(s => s.employeeId.toString());

        const employeesToProcess = employees.filter(
            e => !existingEmployeeIds.includes(e._id.toString())
        );

        if (employeesToProcess.length === 0) {
            throw new Error("All requested employees already have summaries for this month");
        }

        const holidays = await fetchHolidayDates(year);

        const summaries = await Promise.all(
            employeesToProcess.map(async employee => {
                return this.generateEmployeeSummary(
                    employee._id.toString(),
                    month,
                    year,
                    generatedBy.id.toString(),
                    holidays
                );
            })
        );

        const savedSummaries = await MonthlySummaryModel.insertMany(summaries);

        return employeeId ? savedSummaries[0] : savedSummaries;
    }

    async regenerateSummary(
        month: number,
        year: number,
        generatedBy: {
            id: string,
            role: "admin" | "employee",
        },
        employeeId?: string
    ): Promise<IMonthlyAttendanceSummary | IMonthlyAttendanceSummary[]> {
        const deleteFilter: any = { month, year };
        if (employeeId) {
            deleteFilter.employeeId = employeeId;
        }

        await MonthlySummaryModel.deleteMany(deleteFilter);

        return this.generateSummary(month, year, generatedBy, employeeId);
    }

    async getExistingSummaries(
        month: number,
        year: number
    ): Promise<IMonthlyAttendanceSummary[]> {

        return MonthlySummaryModel
            .find({ month, year })
            .populate("employeeId", "fullName role")
            .exec();
    }

    private async generateEmployeeSummary(
        employeeId: string,
        month: number,
        year: number,
        generatedBy: string,
        holidays: string[]
    ): Promise<IMonthlyAttendanceSummary> {
        const employeeID = new Types.ObjectId(employeeId);
        const daysInMonth = new Date(year, month, 0).getDate();
        const monthDates = Array.from({ length: daysInMonth }, (_, i) => new Date(year, month - 1, i + 1));

        const startDate = new Date(year, month - 1, 1);
        const endDate = new Date(year, month, 0);

        const attendances = await attendanceModel.find({
            employeeId: employeeID,
            date: { $gte: startDate, $lte: endDate }
        });

        const leaveRequests = await LeaveRequestModel.find({
            employeeId: employeeID,
            status: "Approved",
            $or: [
                { startDate: { $lte: endDate }, endDate: { $gte: startDate } }
            ]
        });

        const leaveTypeIds = [...new Set(leaveRequests.map(lr => lr.leaveTypeId.toString()))];
        const leaveTypes = await LeaveTypeModel.find({ _id: { $in: leaveTypeIds } });
        const leaveTypePaidMap = new Map<string, boolean>();
        leaveTypes.forEach(lt => {
            leaveTypePaidMap.set(lt._id.toString(), lt.isPaid);
        });

        let workingDays = 0;
        let presentDays = 0;
        let leaveDays = 0;
        let nonPaidLeaves = 0;

        let attendanceCount = 0

        monthDates.forEach(date => {
            const dayOfWeek = date.getDay();
            const isWeekend = dayOfWeek === 0 || dayOfWeek === 6;
            const isoDate = date.toISOString().split('T')[0];
            const isHoliday = holidays.includes(isoDate);

            if (isWeekend || isHoliday) return;

            workingDays++;


            const attendance = attendances.find(a =>
                a.date.toISOString().split('T')[0] === isoDate,
                attendanceCount++
            );
            
            const currentDateStr = new Date(date).toISOString().split('T')[0];

            if (attendance) {
                if (attendance.status === "Present" || attendance.status === "Late") {
                    presentDays++;
                } else if (attendance.status === "Absent") {
                    const onLeave = leaveRequests.find(leave => {
                        const leaveStartStr = new Date(leave.startDate).toISOString().split('T')[0];
                        const leaveEndStr = new Date(leave.endDate).toISOString().split('T')[0];

                        return currentDateStr >= leaveStartStr && currentDateStr <= leaveEndStr;
                    });

                    if (onLeave) {
                        const isPaid = leaveTypePaidMap.get(onLeave.leaveTypeId.toString()) ?? true;
                        presentDays++;
                        if (!isPaid) {
                            nonPaidLeaves++;
                        }
                    } else {
                        leaveDays++;
                    }
                }
            } else {

                const onLeave = leaveRequests.find(leave => {
                    const leaveStartStr = new Date(leave.startDate).toISOString().split('T')[0];
                    const leaveEndStr = new Date(leave.endDate).toISOString().split('T')[0];

                    return currentDateStr >= leaveStartStr && currentDateStr <= leaveEndStr;
                });

                if (onLeave) {
                    const isPaid = leaveTypePaidMap.get(onLeave.leaveTypeId.toString()) ?? true;
                    console.log(isPaid);
                    console.log(employeeID);
                    presentDays++;
                    if (!isPaid) {
                        nonPaidLeaves++;
                    }
                } else {
                    leaveDays++;
                }
            }
        });

        return {
            employeeId: employeeID,
            month,
            year,
            workingDays,
            presentDays,
            leaveDays,
            nonPaidLeaves,
            status: "Pending",
            generatedAt: new Date(),
            generatedBy
        };
    }


    async approveSummary(summaryId: string): Promise<IMonthlyAttendanceSummary> {
        console.log(summaryId)
        const summary = await MonthlySummaryModel.findByIdAndUpdate(
            summaryId,
            {
                status: "Approved",
            },
            { new: true }
        ).populate("employeeId", "fullName role");

        console.log(summary)
        if (!summary) {
            throw new Error("Summary not found");
        }

        return summary;
    }

    async rejectSummary(
        summaryId: string,
        reason: string
    ): Promise<IMonthlyAttendanceSummary> {
        if (!reason.trim()) {
            throw new Error("Rejection reason is required");
        }

        const summary = await MonthlySummaryModel.findByIdAndUpdate(
            summaryId,
            {
                status: "Rejected",
                rejectionReason: reason,
            },
            { new: true }
        ).populate("employeeId", "fullName role");

        if (!summary) {
            throw new Error("Summary not found");
        }

        return summary;
    }

    async bulkApproveSummaries(summaryIds: string[]): Promise<IMonthlyAttendanceSummary[]> {
        const updatedSummaries = await MonthlySummaryModel.updateMany(
            { _id: { $in: summaryIds } },
            { $set: { status: "Approved" } }
        );

        if (updatedSummaries.modifiedCount === 0) {
            throw new Error("No summaries were approved");
        }

        // Return the updated summaries
        return MonthlySummaryModel.find({ _id: { $in: summaryIds } })
            .populate("employeeId", "fullName role");
    }
}