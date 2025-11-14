import { inject, injectable } from "tsyringe";
import { IEmployeeRepository } from "../../entities/repositoryInterfaces/employee/EmployeeRepository";
import {
  Employee,
  EmployeeFilter,
} from "../../entities/models/employeeEntities/EmployeeEnitity";
import { IEmployeeManagementUseCase } from "../../entities/useCaseInterface/IEmployeeManagementUseCase";
import { HTTP_STATUS_CODES, MESSAGES } from "../../shared/constants";
import { eventHandler } from "../../shared/eventHandler";
import { IBcrypt } from "../../Presentation/security/bcrypt.interface";
import { CustomError } from "../../shared/errors/CustomError";
import { CreateEmployeeRequestDTO } from "../../entities/dtos/RequestDTOs/EmployeeDTO";
import { EmployeeResponseDTO } from "../../entities/dtos/ResponseDTOs/EmployeeDTO";
import { EmployeeMapper } from "../../entities/mapping/EmployeeMapper";

@injectable()
export class EmployeeManagementUseCase implements IEmployeeManagementUseCase {
  constructor(
    @inject("IEmployeeRepository")
    private _employeeRepository: IEmployeeRepository,
    @inject("IBcrypt") private _passwordBcrypt: IBcrypt
  ) {}

  async addEmployee(
    data: CreateEmployeeRequestDTO
  ): Promise<EmployeeResponseDTO> {
    const existingEmployee = await this._employeeRepository.findByEmail(
      data.email
    );

    if (existingEmployee) {
      throw new CustomError(
        MESSAGES.ERROR.USER.USER_ALREADY_EXISTS,
        HTTP_STATUS_CODES.CONFLICT
      );
    }

    const hashedPassword = await this._passwordBcrypt.hash(data.password);
    const newEmployee: CreateEmployeeRequestDTO = {
      ...data,
      password: hashedPassword,
    };

    const employee = EmployeeMapper.toEntity(newEmployee);

    const createEmployee = await this._employeeRepository.save(employee);

    eventHandler.emit("EMPLOYEE_CREATED", createEmployee._id?.toString());

    return EmployeeMapper.toResponseDTO(createEmployee);
  }

  async getEmployees(
    filter: EmployeeFilter,
    page: number,
    pageSize: number
  ): Promise<{
    employees: EmployeeResponseDTO[] | [];
    total: number;
    active: number;
    inactive: number;
  }> {
    const skip = (page - 1) * pageSize;
    const limit = pageSize;
    const employees = await this._employeeRepository.find(filter, skip, limit);
    return {
      employees: EmployeeMapper.toResponseDTOs(
        employees.employees as Employee[]
      ),
      total: employees.total,
      active: employees.active,
      inactive: employees.inactive,
    };
  }

  async deleteEmployee(id: string): Promise<void> {
    eventHandler.emit("EMPLOYEE_DELETED", id);
    await this._employeeRepository.findByIdAndDelete(id);
  }

  async getManagers(): Promise<EmployeeResponseDTO[] | []> {
    const managers = await this._employeeRepository.findManagers();
    return EmployeeMapper.toResponseDTOs(managers as Employee[]);
  }

  async getEmployeesForChat(): Promise<Partial<EmployeeResponseDTO[]>> {
    const employees = await this._employeeRepository.getEmployeesForChat();
    return EmployeeMapper.toResponseDTOs(employees as Employee[]);
  }

  async getDevelopers(): Promise<EmployeeResponseDTO[]> {
    const developers = await this._employeeRepository.getDevelopers();
    return EmployeeMapper.toResponseDTOs(developers as Employee[]);
  }

  async findById(employeeId: string): Promise<EmployeeResponseDTO | null> {
    const employee = await this._employeeRepository.findById(employeeId);
    if (!employee) {
      return null;
    }
    return EmployeeMapper.toResponseDTO(employee);
  }
}
