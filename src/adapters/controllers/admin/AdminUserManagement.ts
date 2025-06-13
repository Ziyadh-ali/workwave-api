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
        try {
            const response = await this.employeeManagementUseCase.addEmployee(userData);

            res.status(HTTP_STATUS_CODES.CREATED).json({ response, message: MESSAGES.SUCCESS.USER_CREATED });
        } catch (error) {
            console.log("error adding user", error);
            res.status(HTTP_STATUS_CODES.BAD_REQUEST).json({
                message: error instanceof Error ? error.message : "An unknown error occurred"
            });
        }
    }

    async getUsers(req: Request, res: Response): Promise<void> {
        try {
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
        } catch (error) {
            console.log("Failed to fetch users", error);
            res.status(500).json({
                success: false,
                message: "Failed to fetch users",
            });
        }
    }

    async getUserDetails(req: Request, res: Response): Promise<void> {
        try {
            const { employeeId } = req.params;

            const userDetails = await this.employeeProfileUseCase.getEmployeeDetails(employeeId);

            res.status(HTTP_STATUS_CODES.OK).json({ user: userDetails });
        } catch (error) {
            res.status(HTTP_STATUS_CODES.BAD_REQUEST).json({ message: "Error fetching details" });
        }
    }

    async deleteUser(req: Request, res: Response): Promise<void> {
        try {
            const { employeeId } = req.params;
            await this.employeeManagementUseCase.deleteEmployee(employeeId);
            res.status(HTTP_STATUS_CODES.OK).json({ message: MESSAGES.SUCCESS.USER_DELETED });
        } catch (error) {
            res.status(HTTP_STATUS_CODES.BAD_REQUEST).json({ message: "Error deleting user" });
        }
    }

    async getManagers(req: Request, res: Response): Promise<void> {
        try {
            const response = await this.employeeManagementUseCase.getManagers();
            res.status(HTTP_STATUS_CODES.OK).json({
                success: true,
                message: "Managers found",
                managers: response,
            })
        } catch (error) {
            console.log(error);
            res.status(HTTP_STATUS_CODES.BAD_REQUEST).json({
                message: error instanceof Error ? error.message : "An unknown error occurred"
            });
        }
    }

    async updateprofile(req: Request, res: Response): Promise<void> {
        const { employeeId } = req.params;
        const userData = req.body;


        if (userData.email) {
            const isEmployee = await this.employeeRepository.findByEmail(userData.email);
            if (isEmployee) {
                res.status(HTTP_STATUS_CODES.BAD_REQUEST).json({
                    success: false,
                    message: "Employee exists with the same email",
                })
            }
        }
        try {
            if (!employeeId) {
                res.status(HTTP_STATUS_CODES.BAD_REQUEST).json({
                    success: false,
                    message: "User id not provided",
                })
            }

            if (!userData) {
                res.status(HTTP_STATUS_CODES.BAD_REQUEST).json({
                    success: false,
                    message: "User data not provided",
                });
            }

            const user = await this.employeeProfileUseCase.updateEmployee(employeeId, userData);
            if (user) {
                res.status(HTTP_STATUS_CODES.OK).json({
                    success: true,
                    message: "User details updated",
                    newData: user,
                });
            }
        } catch (error) {
            console.log(error);
            if (error instanceof Error) {
                res.status(HTTP_STATUS_CODES.NOT_FOUND).json({
                    success: false,
                    message: error.message,
                });
            } else {
                res.status(HTTP_STATUS_CODES.INTERNAL_SERVER_ERROR).json({
                    success: false,
                    message: "Error in updating",
                });
            }
        }
    }

    async getEmployeesForChat(req: Request, res: Response): Promise<void> {
        try {
            const employees = await this.employeeManagementUseCase.getEmployeesForChat();
            res.status(HTTP_STATUS_CODES.OK).json({
                employees
            })
        } catch (error) {
            console.log(error)
            res.status(HTTP_STATUS_CODES.NOT_FOUND).json({
                message: (error instanceof Error) ? error.message : "error getting user",
            });
        }
    }

    async getDevelopers(req: Request, res: Response): Promise<void> {
        try {
            const developers = await this.employeeManagementUseCase.getDevelopers();
            res.status(HTTP_STATUS_CODES.OK).json({
                developers
            });
        } catch (error) {
            console.log(error)
            res.status(HTTP_STATUS_CODES.NOT_FOUND).json({
                message: (error instanceof Error) ? error.message : "error getting Develoeprs",
            });
        }
    }
}