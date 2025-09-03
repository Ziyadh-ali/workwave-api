import { Request, Response } from "express";
import { inject, injectable } from "tsyringe";
import { IEmployeeProfile } from "../../../entities/controllerInterface/EmployeeController";
import { HTTP_STATUS_CODES, MESSAGES } from "../../../shared/constants";
import { IEmployeeProfileUseCase } from "../../../entities/useCaseInterface/IEmployeeProfileUseCase";
import { EmployeeDTO } from "../../../entities/dtos/EmployeeDtoTmp";

@injectable()
export class EmployeeProfile implements IEmployeeProfile {
    constructor(
        @inject("IEmployeeProfileUseCase") private employeeProfileUseCase: IEmployeeProfileUseCase,
    ) { }
    async getProfileDetails(req: Request, res: Response): Promise<void> {
        const { employeeId } = req.params;
            if (!employeeId) {
                res.status(HTTP_STATUS_CODES.BAD_REQUEST).json({
                    success: false,
                    message: MESSAGES.ERROR.USER.NO_USER_ID,
                });
            }

            const details = await this.employeeProfileUseCase.getEmployeeDetails(employeeId);

            if (details) {
                const newEmployee = EmployeeDTO(details);

                res.status(HTTP_STATUS_CODES.OK).json({
                    success: true,
                    details : newEmployee,
                })
            }
    }

    async updateprofile(req: Request, res: Response): Promise<void> {
        const { employeeId } = req.params;
        const userData = req.body;
        const cloudinaryFile = req.file;
            if (!employeeId) {
                res.status(HTTP_STATUS_CODES.BAD_REQUEST).json({
                    success: false,
                    message: "User ID not provided",
                });
                return;
            }

            if (cloudinaryFile) {
                const versionMatch = cloudinaryFile.path.match(/\/v(\d+)\//);
                if (versionMatch && versionMatch[1]) {
                    const version = versionMatch[1];
                    userData.profilePic = version;
                }
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


    async changePassword(req: Request, res: Response): Promise<void> {
        const { employeeId } = req.params;
        const { currentPassword, newPassword } = req.body;
            if (!employeeId) {
                res.status(HTTP_STATUS_CODES.BAD_REQUEST).json({
                    success: false,
                    message: MESSAGES.ERROR.USER.NO_USER_ID,
                })
            }

            if (!currentPassword || !newPassword) {
                res.status(HTTP_STATUS_CODES.BAD_REQUEST).json({
                    success: false,
                    message: MESSAGES.ERROR.USER.PASSWORD_REQUIRED,
                });
            }

            const data = {
                currentPassword,
                newPassword,
            }

            await this.employeeProfileUseCase.changePassword(employeeId, data);
            res.status(HTTP_STATUS_CODES.OK).json({
                success: true,
                message: MESSAGES.SUCCESS.PASSWORD_CHANGED,
            })
    }
}
