import { CreateEmployeeRequestDTO, UpdateEmployeeRequestDTO } from "../../dtos/RequestDTOs";
import { Employee, EmployeeFilter } from "../../models/employeeEntities/EmployeeEnitity";
export interface IEmployeeRepository {
    save(data: CreateEmployeeRequestDTO): Promise<Employee>
    findByEmail(email: string): Promise<Employee | null>;
    find(
        filter: EmployeeFilter,
        skip: number,
        limit: number,
    ): Promise<{ employees: Employee[] | []; total: number, active: number; inactive: number }>;
    findByIdAndDelete(id: string): Promise<void>;
    updateEmployeeById(
        id: string,
        data: UpdateEmployeeRequestDTO,
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