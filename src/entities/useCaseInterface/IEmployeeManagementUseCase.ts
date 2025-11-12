import { CreateEmployeeRequestDTO } from "../dtos/RequestDTOs/EmployeeDTO";
import { EmployeeResponseDTO } from "../dtos/ResponseDTOs/EmployeeDTO";
import { EmployeeFilter } from "../models/employeeEntities/EmployeeEnitity";


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

    findById(employeeId : string) : Promise<EmployeeResponseDTO | null>;

    deleteEmployee(employeeId : string) : Promise<void>;

    getManagers() : Promise<EmployeeResponseDTO[]>;

    getEmployeesForChat () : Promise<Partial<EmployeeResponseDTO[]>>;
    getDevelopers () : Promise<EmployeeResponseDTO[]>;
}