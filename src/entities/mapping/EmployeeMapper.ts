import { Employee } from "../models/employeeEntities/EmployeeEnitity";
import { EmployeeResponseDTO } from "../dtos/ResponseDTOs/EmployeeDTO";
import { CreateEmployeeRequestDTO, UpdateEmployeeRequestDTO } from "../dtos/RequestDTOs/EmployeeDTO";

export class EmployeeMapper {
  static toResponseDTO(employee: Employee): EmployeeResponseDTO {
    return {
      _id: employee._id ?? "",
      fullName: employee.fullName,
      email: employee.email,
      department: employee.department,
      role: employee.role,
      manager: employee.manager,
      phone: employee.phone,
      profilePic: employee.profilePic,
      address: employee.address,
      status: employee.status,
      salary: employee.salary,
      salaryType: employee.salaryType,
      joinedAt: employee.joinedAt?.toDateString(),
      createdAt: employee.createdAt?.toDateString(),
    };
  }

  static toResponseDTOs(employees: Employee[]): EmployeeResponseDTO[] {
    return employees.map(this.toResponseDTO);
  }

  static toEntity(dto: CreateEmployeeRequestDTO): Employee {
    return {
      fullName: dto.fullName,
      email: dto.email,
      department: dto.department,
      role: dto.role,
      phone: dto.phone,
      address: dto.address,
      joinedAt: dto.joinedAt ? new Date(dto.joinedAt) : undefined,
      manager: dto.manager,
      profilePic: dto.profilePic,
      salary: dto.salary,
      salaryType: dto.salaryType,
      password: dto.password,
      status: "active",
    };
  }

  static toUpdateEntity(dto: UpdateEmployeeRequestDTO): Partial<Employee> {
    const entity: Partial<Employee> = {};

    if (dto.fullName) entity.fullName = dto.fullName;
    if (dto.email) entity.email = dto.email;
    if (dto.department) entity.department = dto.department;
    if (dto.role) entity.role = dto.role;
    if (dto.phone) entity.phone = dto.phone;
    if (dto.address) entity.address = dto.address;
    if (dto.manager) entity.manager = dto.manager;
    if (dto.profilePic) entity.profilePic = dto.profilePic;
    if (dto.salary !== undefined) entity.salary = dto.salary;
    if (dto.salaryType) entity.salaryType = dto.salaryType;
    if (dto.status) entity.status = dto.status;

    return entity;
  }
}
