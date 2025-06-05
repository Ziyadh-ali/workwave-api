import { Response , Request } from "express";
import { inject , injectable } from "tsyringe";
import { IForgotPasswordUseCase } from "../../../entities/useCaseInterface/IForgotPassword";
import { HTTP_STATUS_CODES } from "../../../shared/constants";
import { MESSAGES } from "../../../shared/constants";

@injectable()
export class ForgotPasswordController {
    constructor(
        @inject("IForgotPasswordUseCase") private forgotPasswordUseCase : IForgotPasswordUseCase,
    ){}

    async execute(req : Request , res : Response) : Promise<void>{
        try {
            const {email} = req.body;
            await this.forgotPasswordUseCase.confirmEmailAndSendLink(email);
            res.status(HTTP_STATUS_CODES.OK).json({
                success : true,
                message : MESSAGES.SUCCESS.RESET_LINK_SENDED,
            })
        } catch (error) {
            res.status(HTTP_STATUS_CODES.BAD_REQUEST).json({
                success : false,
                message : "Error sending mail",
            })
        }
    }
}