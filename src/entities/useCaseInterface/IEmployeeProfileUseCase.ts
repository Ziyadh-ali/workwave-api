import { Employee } from "../models/employeeEntities/EmployeeEnitity";


export interface IEmployeeProfileUseCase {
    getEmployeeDetails(employeeId: string): Promise<Employee | null>;

    updateEmployee(employeeId: string, data: Partial<Employee>): Promise<Employee | null>;

    changePassword(
        employeeId: string,
        data: {
            currentPassword: string,
            newPassword: string,
        }): Promise<void>;
}