import nodemailer from "nodemailer";
import { IEmailService } from "../../entities/services/IEmailService.interface";
import { injectable } from "tsyringe";
import { config } from "../../shared/config";
import { CustomError } from "../../shared/errors/CustomError";
import { HTTP_STATUS_CODES } from "../../shared/constants";

@injectable()
export class EmailService implements IEmailService {
    private transporter;

    constructor() {
        this.transporter = nodemailer.createTransport({
            service: "gmail",
            auth: {
                user: config.email.EMAIL_USER,
                pass: config.email.EMAIL_PASS,
            }
        });
    }

    async sendEmail(
        to: string,
        subject: string,
        text: string,
        html?: string,
    ) {
        try {
            const mailOptions = {
                from: "Work Wave",
                to,
                subject,
                text,   
                html,
            };

            const info = await this.transporter.sendMail(mailOptions);
            console.log("Email sent: " + info.response);
        } catch (error) {
            console.error("Error sending email:", error);
            throw new CustomError("Could not send email" , HTTP_STATUS_CODES.BAD_REQUEST);
        }
    }
}