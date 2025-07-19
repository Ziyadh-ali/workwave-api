import { Request, Response } from "express";
import { injectable, inject } from "tsyringe";
import { HTTP_STATUS_CODES, MESSAGES } from "../../../shared/constants";
import { IEmployeeProfileUseCase } from "../../../entities/useCaseInterface/IEmployeeProfileUseCase";
import { IEmployeeManagementUseCase } from "../../../entities/useCaseInterface/IEmployeeManagementUseCase";
import { IEmployeeRepository } from "../../../entities/repositoryInterfaces/employee/employee.repository";

@injectable()
export class AdminUserManagement {
    constructor(
        @inject("IEmployeeManagementUseCase") private employeeManagementUseCase: IEmployeeManagementUseCase,
        @inject("IEmployeeProfileUseCase") private employeeProfileUseCase: IEmployeeProfileUseCase,
        @inject("IEmployeeRepository") private employeeRepository: IEmployeeRepository,
    ) { }

    async addUser(req: Request, res: Response): Promise<void> {
        const { userData } = req.body;
        const response = await this.employeeManagementUseCase.addEmployee(userData);

        res.status(HTTP_STATUS_CODES.CREATED).json({ response, message: MESSAGES.SUCCESS.USER_CREATED });
    }

    async getUsers(req: Request, res: Response): Promise<void> {
        const { page = 1, pageSize = 10, role, status, department, search } = req.query;
        const filter = {
            role: role !== "all" ? role : undefined,
            status: status !== "all" ? status : undefined,
            department: department !== "all" ? department : undefined,
            fullName: search ? { $regex: search, $options: "i" } : undefined,
        };


        const result = await this.employeeManagementUseCase.getEmployees(
            filter,
            Number(page),
            Number(pageSize),
        );

        res
            .status(HTTP_STATUS_CODES.OK)
            .json({
                success: true,
                data: result.employees,
                total: result.total,
                active: result.active,
                inactive: result.inactive,
                page: Number(page),
                pageSize: Number(pageSize)
            });
    }

    async getUserDetails(req: Request, res: Response): Promise<void> {
        const { employeeId } = req.params;

        const userDetails = await this.employeeProfileUseCase.getEmployeeDetails(employeeId);

        res.status(HTTP_STATUS_CODES.OK).json({ user: userDetails });
    }

    async deleteUser(req: Request, res: Response): Promise<void> {
        const { employeeId } = req.params;
        await this.employeeManagementUseCase.deleteEmployee(employeeId);
        res.status(HTTP_STATUS_CODES.OK).json({ message: MESSAGES.SUCCESS.USER_DELETED });
    }

    async getManagers(req: Request, res: Response): Promise<void> {
        const response = await this.employeeManagementUseCase.getManagers();
        res.status(HTTP_STATUS_CODES.OK).json({
            success: true,
            message: "Managers found",
            managers: response,
        });
    }

    async updateprofile(req: Request, res: Response): Promise<void> {
        const { employeeId } = req.params;
        const userData = req.body;
        if (!employeeId) {
            res.status(HTTP_STATUS_CODES.BAD_REQUEST).json({
                success: false,
                message: "User ID not provided",
            });
            return;
        }

        if (!userData || Object.keys(userData).length === 0) {
            res.status(HTTP_STATUS_CODES.BAD_REQUEST).json({
                success: false,
                message: "No data provided for update",
            });
            return;
        }

        const user = await this.employeeProfileUseCase.updateEmployee(employeeId, userData);

        if (user) {
            res.status(HTTP_STATUS_CODES.OK).json({
                success: true,
                message: "User details updated",
                newData: user,
            });
            return;
        }

        res.status(HTTP_STATUS_CODES.NOT_FOUND).json({
            success: false,
            message: "User not found or update failed",
        });
        return;
    }

    async getEmployeesForChat(req: Request, res: Response): Promise<void> {
        const employees = await this.employeeManagementUseCase.getEmployeesForChat();
        res.status(HTTP_STATUS_CODES.OK).json({
            employees
        });
    }

    async getDevelopers(req: Request, res: Response): Promise<void> {
        const developers = await this.employeeManagementUseCase.getDevelopers();
        res.status(HTTP_STATUS_CODES.OK).json({
            developers
        });
    }
}