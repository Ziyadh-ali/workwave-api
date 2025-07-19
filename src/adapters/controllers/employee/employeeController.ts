import { Request, response, Response } from "express";
import { IEmployeeLoginUseCase } from "../../../entities/useCaseInterface/IEmployeeLoginUseCase";
import { inject, injectable } from "tsyringe";
import { setAuthCookies, clearAuthCookies } from "../../../shared/utils/cookieHelper";
import { HTTP_STATUS_CODES, MESSAGES } from "../../../shared/constants";
import { loginSchema } from "../../../shared/validation/validator";
import { ZodError } from "zod";

@injectable()
export class EmployeeController {
    constructor(
        @inject("IEmployeeLoginUseCase") private userLoginUseCase: IEmployeeLoginUseCase,
    ) { }

    async login(req: Request, res: Response): Promise<void> {
            const { email, password } = loginSchema.parse(req.body);
            const response = await this.userLoginUseCase.login(email, password);
            if (response) {
                if (response.user.status === "inactive") {
                    res.status(HTTP_STATUS_CODES.FORBIDDEN).json({
                        success: false,
                        message: "You have blocked by admin",
                    });
                }
                setAuthCookies(
                    res,
                    response.accessToken,
                    response.refreshToken,
                    "access_token",
                    "refresh_token",
                );
                res.status(HTTP_STATUS_CODES.OK).json({
                    success: true,
                    message: MESSAGES.SUCCESS.LOGIN_SUCCESS,
                    loginData: response?.user
                });
            }
    }

    async logout(req: Request, res: Response): Promise<void> {
            this.userLoginUseCase.logout(res);

            res.status(HTTP_STATUS_CODES.OK).json({
                success: true,
                message: MESSAGES.SUCCESS.LOGOUT_SUCCESS,
            })
    }
}