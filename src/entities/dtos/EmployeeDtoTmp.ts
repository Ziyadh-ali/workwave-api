import { Employee } from "../models/employeeEntities/EmployeeEnitity";

export function EmployeeDTO(employee: Employee){
    return {
        _id: employee._id,
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
        joinedAt: employee.joinedAt,
        createdAt: employee.createdAt,
    }
}