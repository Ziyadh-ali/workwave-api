import { Request, Response } from "express";
import { inject, injectable } from "tsyringe";
import { setAuthCookies, clearAuthCookies } from "../../../shared/utils/cookieHelper";
import { HTTP_STATUS_CODES, MESSAGES } from "../../../shared/constants";
import { IAdminAuthUseCase } from "../../../entities/useCaseInterface/IAdaminAuthUseCase";

@injectable()
export class AdminController {
    constructor(
        @inject("IAdminAuthUseCase") private _adminAuthUseCase: IAdminAuthUseCase,
    ) {
    }


    async login(req: Request, res: Response): Promise<void> {
        const { email, password } = req.body;
        const response = await this._adminAuthUseCase.login(email, password);

        if (response) {
            setAuthCookies(
                res,
                response.accessToken,
                response.refreshToken,
                "_access_token",
                "_refresh_token",
            );

            res.status(HTTP_STATUS_CODES.OK).json({
                success: true,
                message: MESSAGES.SUCCESS.LOGIN_SUCCESS,
                loginData: response.admin,
            });
        }
    }

    async logout(req: Request, res: Response) {
        clearAuthCookies(res, "admin_access_token", "admin_refresh_token");
        res.status(HTTP_STATUS_CODES.OK).json({
            success: true,
            message: MESSAGES.SUCCESS.LOGOUT_SUCCESS,
        });
    }

    async save(req: Request, res: Response) {
        const { email, password } = req.body;
        const response = await this._adminAuthUseCase.createAdmin(email, password);
        res.status(HTTP_STATUS_CODES.CREATED).json(response);
    }
}