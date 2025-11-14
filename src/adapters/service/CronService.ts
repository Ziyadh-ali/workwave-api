import { IEmployeeRepository } from '../../entities/repositoryInterfaces/employee/EmployeeRepository';
import { IAttendanceRepository } from '../../entities/repositoryInterfaces/IAttendance.repository';
import { inject, injectable } from "tsyringe";
import { fetchHolidayDates } from '../../shared/utils/fetchHolidayDates';

@injectable()
export class CronService {
    constructor(
        @inject("IEmployeeRepository") private _employeeRepository: IEmployeeRepository,
        @inject("IAttendanceRepository") private _attendanceRepository: IAttendanceRepository,
    ) { }

    async markAbsentees() {
        const today = new Date();

        const day = today.getDay(); 
        if (day === 0 || day === 6) {
            console.log("Weekend — skipping absentee marking");
            return;
        }

        const year = today.getFullYear();
        const holidays = await fetchHolidayDates(year);

        const formattedToday = today.toISOString().split("T")[0];

        if (holidays.includes(formattedToday)) {
            console.log("Holiday — skipping absentee marking");
            return;
        }

        const employees = await this._employeeRepository.getAllEmployees();
        const todaysAttendance = await this._attendanceRepository.getEveryAttendanceByDate(today);

        const presentedEmployeeIds = new Set(todaysAttendance?.map(a => a.employeeId));

        if (employees) {
            for (const employee of employees) {
                if (!employee._id) continue;

                const id = employee._id.toString();

                if (!presentedEmployeeIds.has(employee._id)) {
                    const attendance = await this._attendanceRepository.createAttendance(id, today);

                    if (attendance && attendance._id) {
                        await this._attendanceRepository.updateStatus(attendance._id.toString(), "Absent");
                    }
                }
            }
        }

        console.log("Absentees marked successfully");
    }
}

