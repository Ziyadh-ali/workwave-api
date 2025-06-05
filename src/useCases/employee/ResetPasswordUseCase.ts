import { injectable , inject } from "tsyringe";
import { IResetPasswordUseCase } from "../../entities/useCaseInterface/IResetPasswordUseCase";
import { MESSAGES } from "../../shared/constants";
import { IBcrypt } from "../../frameworks/security/bcrypt.interface";
import { IEmployeeRepository } from "../../entities/repositoryInterfaces/employee/employee.repository";
import { IJwtService } from "../../entities/services/jwt.interface";

@injectable()
export class ResetPasswordUseCase implements IResetPasswordUseCase {
    constructor(
        @inject("IBcrypt") private passwordBcrypt: IBcrypt,
        @inject("IEmployeeRepository") private employeeRepository: IEmployeeRepository,
        @inject("IJwtService") private jwtService: IJwtService,
    ){}
    async resetPassword(token: string, newPassword: string): Promise<void> {
        const payload = this.jwtService.verifyResetToken(token);
        if (!payload || !payload?.email) {
            throw new Error(MESSAGES.ERROR.AUTH.INVALID_TOKEN);
        }

        const employee = await this.employeeRepository.findByEmail(payload.email);
        if (!employee) {
            throw new Error(MESSAGES.ERROR.USER.USER_NOT_FOUND);
        }

        const isSamePassword = await this.passwordBcrypt.compare(
            newPassword,
            employee.password
        );
        if (isSamePassword) {
            throw new Error("Same pasword");
        }

        const hashedPassword = await this.passwordBcrypt.hash(newPassword);

        await this.employeeRepository.updateEmployeeById(employee._id ? employee._id.toString() : "",{password : hashedPassword})
    }
}