import { IEmployeeRepository } from '../../entities/repositoryInterfaces/employee/employee.repository';
import { IAttendanceRepository } from '../../entities/repositoryInterfaces/IAttendance.repository';
import cron from "node-cron";
import { inject, injectable } from "tsyringe";
import { cronService } from '../../frameworks/di/resolver';

@injectable()
export class CronService {
    constructor(
        @inject("IEmployeeRepository") private employeeRepository: IEmployeeRepository,
        @inject("IAttendanceRepository") private attendanceRepository: IAttendanceRepository,
    ) { }

    async markAbsentees() {
        const today = new Date();
        const employees = await this.employeeRepository.getAllEmployees();
        const attendances = await this.attendanceRepository.getEveryAttendanceByDate(today);

        const presentedEmployeeIds = new Set(attendances?.map(a => a.employeeId));

        if (employees) {
            for (const employee of employees) {
                if (employee._id !== undefined && !presentedEmployeeIds.has(employee._id!)) {
                    const attendance = await this.attendanceRepository.createAttendance(employee._id.toString(), today);
                    if (attendance && attendance._id !== undefined) {
                        await this.attendanceRepository.updateStatus(attendance._id.toString(), "Absent");
                    }
                }
            }
        }

        console.log("Absentees marked successfully");
    }
}

cron.schedule("50 23 * * *", () => cronService.markAbsentees());

console.log("Scheduler running...");