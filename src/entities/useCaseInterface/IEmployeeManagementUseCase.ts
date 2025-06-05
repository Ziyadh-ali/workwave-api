import { Employee } from "../models/employeeEntities/employee.enitity";


export interface IEmployeeManagementUseCase {
    addEmployee(data: Employee): Promise<Employee>;

    getEmployees(
        filter: any,
        page: number,
        pageSize: number
    ): Promise<{
        employees: Employee[] | [];
        total: number;
        active: number;
        inactive: number,
    }>;

    deleteEmployee(employeeId : string) : Promise<void>;

    getManagers() : Promise<Employee[]>;

    getEmployeesForChat () : Promise<Partial<Employee[]>>;
    getDevelopers () : Promise<Employee[]>;
}