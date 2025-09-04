import { IEmployeeRepository } from "../../../entities/repositoryInterfaces/employee/EmployeeRepository";
import { injectable } from "tsyringe";
import { Employee, EmployeeFilter } from "../../../entities/models/employeeEntities/EmployeeEnitity";
import { EmployeeModel } from "../../../frameworks/database/models/employee/EmployeeModel";

@injectable()
export class EmployeeRepository implements IEmployeeRepository {
    async save(data: Employee): Promise<Employee> {
        return await EmployeeModel.create(data);
    }

    async find(filter: EmployeeFilter,
        skip: number,
        limit: number
    ): Promise<{ employees: Employee[] | []; total: number; active: number; inactive: number }> {

        const query: EmployeeFilter = {};

        if (filter.role) query.role = filter.role;
        if (filter.status) query.status = filter.status;
        if (filter.department) query.department = filter.department;
        if (filter.fullName) query.fullName = filter.fullName;

        const employees = await EmployeeModel.find(query).skip(skip).limit(limit).lean();
        const total = await EmployeeModel.countDocuments(query);
        const active = await EmployeeModel.countDocuments({ ...query, status: "active" });
        const inactive = await EmployeeModel.countDocuments({ ...query, status: "inactive" });

        return {
            employees,
            total,
            active,
            inactive,
        }
    }

    async findByEmail(email: string): Promise<Employee | null> {
        return await EmployeeModel.findOne({ email });
    }

    async findByIdAndDelete(id: string): Promise<void> {
        await EmployeeModel.findByIdAndDelete(id);
    }

    async updateEmployeeById(id: string, data: Partial<Employee>): Promise<Employee | null> {
        return await EmployeeModel.findByIdAndUpdate(id, data);
    }

    async findById(id: string): Promise<Employee | null> {
        return await EmployeeModel.findById(id).populate('manager', '_id fullName');
    }

    async findManagers(): Promise<Employee[] | []> {
        return await EmployeeModel.find({ role: { $in: ["hr", "projectManager"] } });
    }

    async getParticipantsByFilter(
        filter: {
            role?: string,
            department?: string
        }
    ): Promise<string[]> {
        const employees: Employee[] = await EmployeeModel.find(filter, "_id").lean();
        return employees
            .map((emp) => emp._id?.toString())
            .filter((id): id is string => Boolean(id));
    };

    async getEmployeesForChat(): Promise<Partial<Employee[]>> {
        return await EmployeeModel.find({ status: "active" }, "_id fullName profilePic role");
    }

    async getDevelopers(): Promise<Employee[]> {
        return await EmployeeModel.find({ role: "developer" })
    }

    async getAllEmployees(): Promise<Employee[] | null> {
        return await EmployeeModel.find({status:"active"});
    }
}