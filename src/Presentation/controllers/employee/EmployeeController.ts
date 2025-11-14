import { Request, Response } from "express";
import { IEmployeeLoginUseCase } from "../../../entities/useCaseInterface/IEmployeeLoginUseCase";
import { inject, injectable } from "tsyringe";
import { setAuthCookies } from "../../../shared/utils/cookieHelper";
import { HTTP_STATUS_CODES, MESSAGES } from "../../../shared/constants";
import { loginSchema } from "../../../shared/validation/validator";

@injectable()
export class EmployeeController {
    constructor(
        @inject("IEmployeeLoginUseCase") private _userLoginUseCase: IEmployeeLoginUseCase,
    ) { }

    async login(req: Request, res: Response): Promise<void> {
            const { email, password } = loginSchema.parse(req.body);
            const response = await this._userLoginUseCase.login(email, password);
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
            this._userLoginUseCase.logout(res);

            res.status(HTTP_STATUS_CODES.OK).json({
                success: true,
                message: MESSAGES.SUCCESS.LOGOUT_SUCCESS,
            })
    }
}