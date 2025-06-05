import { Request, Response } from "express";
import { inject, injectable } from "tsyringe";
import { setAuthCookies, clearAuthCookies } from "../../../shared/utils/cookieHelper";
import { HTTP_STATUS_CODES, MESSAGES } from "../../../shared/constants";
import { IAdminAuthUseCase } from "../../../entities/useCaseInterface/IAdaminAuthUseCase";

@injectable()
export class AdminController {
    constructor(
        @inject("IAdminAuthUseCase") private adminAuthUseCase: IAdminAuthUseCase,
    ) {
    }


    async login(req: Request, res: Response): Promise<void> {
        const { email, password } = req.body;
        try {
            const response = await this.adminAuthUseCase.login(email, password);

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
        } catch (error) {
            if (error instanceof Error) {
                res.status(HTTP_STATUS_CODES.BAD_REQUEST).json({ message: error.message });
            } else {
                console.error("An unknown error occurred");
            }
        }
    }

    async logout(req: Request, res: Response) {
        try {
            clearAuthCookies(res, "admin_access_token", "admin_refresh_token");
            res.status(200).json({
                success: true,
                message: MESSAGES.SUCCESS.LOGOUT_SUCCESS,
            });
        } catch (error) {
            res.status(HTTP_STATUS_CODES.INTERNAL_SERVER_ERROR).json({ message: 'Failed to logout' });
        }
    }

    async save(req: Request, res: Response) {
        const { email, password } = req.body;
        try {
            const response = await this.adminAuthUseCase.createAdmin(email, password);
            res.status(HTTP_STATUS_CODES.CREATED).json(response);
        } catch (error) {
            throw new Error("not saved");
        }
    }
}