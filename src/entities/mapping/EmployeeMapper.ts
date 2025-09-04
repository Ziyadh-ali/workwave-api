import { Employee } from "../models/employeeEntities/EmployeeEnitity";
import { EmployeeResponseDTO } from "../dtos/ResponseDTOs";
import { CreateEmployeeRequestDTO } from "../dtos/RequestDTOs";

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
}
