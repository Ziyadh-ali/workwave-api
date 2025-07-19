import { Request, Response } from "express";
import { injectable, inject } from "tsyringe";
import { IResetPasswordUseCase } from "../../../entities/useCaseInterface/IResetPasswordUseCase";
import { MESSAGES } from "../../../shared/constants";

@injectable()
export class ResetPasswordController {
    constructor(
        @inject("IResetPasswordUseCase") private resetPasswordUseCase: IResetPasswordUseCase
    ) { }

    async execute(req: Request, res: Response): Promise<void> {
            const { token, newPassword } = req.body;

            if (!token || !newPassword) {
                res.status(400).json({
                    success: false,
                    message: "Token Required"
                });
            }

            await this.resetPasswordUseCase.resetPassword(token, newPassword);

            res.status(200).json({
                success: true,
                message: MESSAGES.SUCCESS.PASSWORD_CHANGED,
            });
    }
}