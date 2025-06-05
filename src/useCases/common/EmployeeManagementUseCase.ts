import { inject, injectable } from "tsyringe";
import { IEmployeeRepository } from "../../entities/repositoryInterfaces/employee/employee.repository";
import { Employee } from "../../entities/models/employeeEntities/employee.enitity";
import { PasswordBcrypt } from "../../frameworks/security/password.bcrypt";
import { IEmployeeManagementUseCase } from "../../entities/useCaseInterface/IEmployeeManagementUseCase";
import { MESSAGES } from "../../shared/constants";
import { eventHandler } from "../../shared/eventHandler";
import { IBcrypt } from "../../frameworks/security/bcrypt.interface";

@injectable()
export class EmployeeManagementUseCase implements IEmployeeManagementUseCase {
    constructor(
        @inject("IEmployeeRepository") private employeeRepository: IEmployeeRepository,
        @inject("IBcrypt") private passwordBcrypt: IBcrypt,
    ) { }

    async addEmployee(data: Employee): Promise<Employee> {
        const existingEmployee = await this.employeeRepository.findByEmail(data.email);

        if (existingEmployee) {
            throw new Error(MESSAGES.ERROR.USER.USER_ALREADY_EXISTS);
        }

        const hashedPassword = await this.passwordBcrypt.hash(data.password);
        const newEmployee: Employee = { ...data, password: hashedPassword };

        const createEmployee = await this.employeeRepository.save(newEmployee);

        console.log(createEmployee);
        eventHandler.emit("EMPLOYEE_CREATED", createEmployee._id?.toString());

        return createEmployee;
    }

    async getEmployees(filter: any, page: number, pageSize: number): Promise<{ employees: Employee[] | []; total: number, active: number, inactive: number }> {
        const skip = (page - 1) * pageSize;
        const limit = pageSize;
        return await this.employeeRepository.find(filter, skip, limit);
    }

    async deleteEmployee(id: string): Promise<void> {
        try {
            eventHandler.emit("EMPLOYEE_DELETED",id); 
            await this.employeeRepository.findByIdAndDelete(id);
        } catch (error) {
            throw new Error("Error in deleting user")
        }
    }

    async getManagers(): Promise<Employee[] | []> {
        try {
            const managers = await this.employeeRepository.findManagers();
            return managers;
        } catch (error) {
            console.log(error);
            throw new Error("Error in finding managers");
        }
    }

    async getEmployeesForChat(): Promise<Partial<Employee[]>> {
        return await this.employeeRepository.getEmployeesForChat();
    }

    async getDevelopers(): Promise<Employee[]> {
        return await this.employeeRepository.getDevelopers();
    }
} 