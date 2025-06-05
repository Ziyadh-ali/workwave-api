import { Request, Response } from "express";
import { inject, injectable } from "tsyringe";
import { IEmployeeProfile } from "../../../entities/controllerInterface/employeeController";
import { CustomRequest } from "../../middlewares/authMiddleware";
import { HTTP_STATUS_CODES, MESSAGES } from "../../../shared/constants";
import { IEmployeeProfileUseCase } from "../../../entities/useCaseInterface/IEmployeeProfileUseCase";

@injectable()
export class EmployeeProfile implements IEmployeeProfile {
    constructor(
        @inject("IEmployeeProfileUseCase") private employeeProfileUseCase: IEmployeeProfileUseCase,
    ) { }
    async getProfileDetails(req: Request, res: Response): Promise<void> {
        const { employeeId } = req.params;
        try {
            if (!employeeId) {
                res.status(HTTP_STATUS_CODES.BAD_REQUEST).json({
                    success: false,
                    message: MESSAGES.ERROR.USER.NO_USER_ID,
                });
            }

            const details = await this.employeeProfileUseCase.getEmployeeDetails(employeeId);

            res.status(HTTP_STATUS_CODES.OK).json({
                success: true,
                details,
            })

        } catch (error) {
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

    async updateprofile(req: Request, res: Response): Promise<void> {
        const { employeeId } = req.params;
        const userData = req.body;
        const { role } = (req as unknown as CustomRequest).user;
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

            if (req.file) {
                userData.profilePic = req.file.path;
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

    async changePassword(req: Request, res: Response): Promise<void> {
        const { employeeId } = req.params;
        const { currentPassword, newPassword } = req.body;
        try {
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
        } catch (error) {
            if (error instanceof Error) {
                if (error.message === MESSAGES.ERROR.USER.USER_NOT_FOUND) {
                    res.status(HTTP_STATUS_CODES.NOT_FOUND).json({
                        success: false,
                        message: error.message,
                    });
                }

                if (error.message === MESSAGES.ERROR.USER.INVALID_CURRENT_PASSWORD) {
                    res.status(HTTP_STATUS_CODES.UNAUTHORIZED).json({
                        success: false,
                        message: error.message,
                    });
                }

                if (error.message === MESSAGES.ERROR.USER.PASSWORD_UPDATE_FAILED) {
                    res.status(HTTP_STATUS_CODES.INTERNAL_SERVER_ERROR).json({
                        success: false,
                        message: error.message,
                    });
                }
            }

            res.status(HTTP_STATUS_CODES.INTERNAL_SERVER_ERROR).json({
                success: false,
                message: "Something went wrong. Please try again later.",
            });
        }
    }
}
