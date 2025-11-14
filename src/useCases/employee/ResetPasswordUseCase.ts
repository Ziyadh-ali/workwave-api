import { injectable , inject } from "tsyringe";
import { IResetPasswordUseCase } from "../../entities/useCaseInterface/IResetPasswordUseCase";
import { HTTP_STATUS_CODES, MESSAGES } from "../../shared/constants";
import { IBcrypt } from "../../Presentation/security/bcrypt.interface";
import { IEmployeeRepository } from "../../entities/repositoryInterfaces/employee/EmployeeRepository";
import { IJwtService } from "../../entities/services/JwtInterface";
import { CustomError } from "../../shared/errors/CustomError";

@injectable()
export class ResetPasswordUseCase implements IResetPasswordUseCase {
    constructor(
        @inject("IBcrypt") private _passwordBcrypt: IBcrypt,
        @inject("IEmployeeRepository") private _employeeRepository: IEmployeeRepository,
        @inject("IJwtService") private _jwtService: IJwtService,
    ){}
    async resetPassword(token: string, newPassword: string): Promise<void> {
        const payload = this._jwtService.verifyResetToken(token);
        if (!payload || !payload?.email) {
            throw new CustomError(MESSAGES.ERROR.AUTH.INVALID_TOKEN ,HTTP_STATUS_CODES.BAD_REQUEST);
        }

        const employee = await this._employeeRepository.findByEmail(payload.email);
        if (!employee) {
            throw new CustomError(MESSAGES.ERROR.USER.USER_NOT_FOUND , HTTP_STATUS_CODES.BAD_REQUEST);
        }

        const isSamePassword = await this._passwordBcrypt.compare(
            newPassword,
            employee.password
        );
        if (isSamePassword) {
            throw new CustomError("Same pasword" , HTTP_STATUS_CODES.BAD_REQUEST);
        }

        const hashedPassword = await this._passwordBcrypt.hash(newPassword);

        await this._employeeRepository.updateEmployeeById(employee._id ? employee._id.toString() : "",{password : hashedPassword})
    }
}