import { Employee, EmployeeFilter } from "../../models/employeeEntities/employee.enitity";
export interface IEmployeeRepository {
    save(data: Partial<Employee>): Promise<Employee>
    findByEmail(email: string): Promise<Employee | null>;
    find(
        filter: EmployeeFilter,
        skip: number,
        limit: number,
    ): Promise<{ employees: Employee[] | []; total: number, active: number; inactive: number }>;
    findByIdAndDelete(id: string): Promise<void>;
    updateEmployeeById(
        id: string,
        data: Partial<Employee>,
    ): Promise<Employee | null>;
    findById(id: string): Promise<Employee | null>;
    findManagers(): Promise<Employee[] | []>;
    getParticipantsByFilter(filter: {
        role?: string,
        department?: string,
    }): Promise<string[]>;
    getEmployeesForChat(): Promise<Partial<Employee[]>>;
    getDevelopers(): Promise<Employee[]>;
    getAllEmployees(): Promise<Employee[] | null>;
}