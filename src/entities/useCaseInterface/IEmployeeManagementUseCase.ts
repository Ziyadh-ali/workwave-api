import { CreateEmployeeRequestDTO } from "../dtos/RequestDTOs";
import { EmployeeResponseDTO } from "../dtos/ResponseDTOs";
import { Employee, EmployeeFilter } from "../models/employeeEntities/EmployeeEnitity";


export interface IEmployeeManagementUseCase {
    addEmployee(data: CreateEmployeeRequestDTO): Promise<EmployeeResponseDTO>;

    getEmployees(
        filter: EmployeeFilter,
        page: number,
        pageSize: number
    ): Promise<{
        employees: EmployeeResponseDTO[] | [];
        total: number;
        active: number;
        inactive: number,
    }>;

    deleteEmployee(employeeId : string) : Promise<void>;

    getManagers() : Promise<EmployeeResponseDTO[]>;

    getEmployeesForChat () : Promise<Partial<EmployeeResponseDTO[]>>;
    getDevelopers () : Promise<EmployeeResponseDTO[]>;
}