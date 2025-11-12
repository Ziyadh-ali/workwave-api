import { injectable, inject } from "tsyringe";
import { IEmployeeRepository } from "../../entities/repositoryInterfaces/employee/EmployeeRepository";
import { EmployeeLoginResponse } from "../../entities/employeeInterface/EmployeeLoginInterface";
import { IEmployeeLoginUseCase } from "../../entities/useCaseInterface/IEmployeeLoginUseCase";
import { clearAuthCookies } from "../../shared/utils/cookieHelper";
import { Response } from "express";
import { HTTP_STATUS_CODES, MESSAGES } from "../../shared/constants";
import { loginSchema } from "../../shared/validation/validator";
import { IJwtService } from "../../entities/services/JwtInterface";
import { IBcrypt } from "../../Presentation/security/bcrypt.interface";
import { CustomError } from "../../shared/errors/CustomError";

@injectable()
export class EmployeeLoginUseCase implements IEmployeeLoginUseCase {
    constructor(
        @inject("IEmployeeRepository") private userRepository: IEmployeeRepository,
        @inject("IBcrypt") private passWordBcrypt: IBcrypt,
        @inject("IJwtService") private jwtService: IJwtService,
    ) { }

    async login(email: string, password: string): Promise<EmployeeLoginResponse | null> {
        const employee = await this.userRepository.findByEmail(email);
        if (!employee) {
            throw new CustomError(MESSAGES.ERROR.USER.USER_NOT_FOUND , HTTP_STATUS_CODES.BAD_REQUEST);
        }

        if (password) {
            const isPasswordMatch = await this.passWordBcrypt.compare(password, employee.password);
            if (!isPasswordMatch) {
                throw new CustomError(MESSAGES.ERROR.AUTH.INVALID_CREDENTIALS , HTTP_STATUS_CODES.BAD_REQUEST);
            }
        }

        const userData = {
            id: employee._id,
            email: employee.email,
            role: employee.role,
        }

        const accessToken = this.jwtService.generateAccessToken(userData);

        const refreshToken = this.jwtService.generateRefreshToken(userData);

        return {
            accessToken,
            refreshToken,
            user: {
                _id: employee._id,
                email: employee.email,
                fullName: employee.fullName,
                role: employee.role,
                profilePic: employee.profilePic,
            }
        }
    }

    async logout(res: Response): Promise<void> {
            clearAuthCookies(
                res,
                "access_token",
                "refresh_token",
            )
    }
}