import { UpdateEmployeeRequestDTO } from "../dtos/RequestDTOs/EmployeeDTO";
import { EmployeeResponseDTO } from "../dtos/ResponseDTOs/EmployeeDTO";
import { Employee } from "../models/employeeEntities/EmployeeEnitity";


export interface IEmployeeProfileUseCase {
    getEmployeeDetails(employeeId: string): Promise<EmployeeResponseDTO | null>;

    updateEmployee(employeeId: string, data: UpdateEmployeeRequestDTO): Promise<EmployeeResponseDTO | null>;

    changePassword(
        employeeId: string,
        data: {
            currentPassword: string,
            newPassword: string,
        }): Promise<void>;
}