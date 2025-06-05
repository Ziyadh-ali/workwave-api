import { injectable, inject } from "tsyringe";
import { IForgotPasswordUseCase } from "../../entities/useCaseInterface/IForgotPassword";
import { MESSAGES } from "../../shared/constants";
import { EmailService } from "../../adapters/service/mailer";
import { IJwtService } from "../../entities/services/jwt.interface";
import { IEmployeeRepository } from "../../entities/repositoryInterfaces/employee/employee.repository";
import { config } from "../../shared/config";
import { passwordResetTemplate , passwordResetText} from "../../shared/email-templates/password-reset"

@injectable()
export class ForgotPasswordUseCase implements IForgotPasswordUseCase {
    constructor(
        @inject("IEmailService") private emailService: EmailService,
        @inject("IEmployeeRepository") private employeeRepository: IEmployeeRepository,
        @inject("IJwtService") private jwtService: IJwtService,
    ) {}

    async confirmEmailAndSendLink(email: string): Promise<void> {
        const employee = this.employeeRepository.findByEmail(email);
        if (!employee) throw new Error(MESSAGES.ERROR.USER.USER_NOT_FOUND);

        const token = await this.generateResetToken(email);
        const resetLink = `${config.cors.ALLOWED_ORIGIN}/reset-password?token=${token}`;

        const html = `
            <h2>Password Reset</h2>
            <p>Click the link below to reset your password:</p>
            <a href="${resetLink}">${resetLink}</a>
        `;

        await this.emailService.sendEmail(
            email,
            "Reset Your Password",
            passwordResetText(resetLink),
            passwordResetTemplate(resetLink ,"WorkWave"),
        )
    }

    private async generateResetToken(email: string): Promise<string> {
        return this.jwtService.generateResetToken(email);
    }
}