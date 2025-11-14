import { injectable, inject } from "tsyringe";
import { IAdminRepository } from "../../entities/repositoryInterfaces/admin/AdminRepository";
import { Admin } from "../../entities/models/adminEntities/AdminEnitity";
import { AdminLoginResponse } from "../../entities/adminInterface/AdminLoginInterface";
import { IAdminAuthUseCase } from "../../entities/useCaseInterface/IAdaminAuthUseCase";
import { HTTP_STATUS_CODES, MESSAGES } from "../../shared/constants";
import { IJwtService } from "../../entities/services/JwtInterface";
import { IBcrypt } from "../../Presentation/security/bcrypt.interface";
import { CustomError } from "../../shared/errors/CustomError";

@injectable()
export class AdminAuthUseCase implements IAdminAuthUseCase {
  constructor(
    @inject("IAdminRepository") private _adminRepository: IAdminRepository,
    @inject("IBcrypt") private _passwordBcrypt: IBcrypt,
    @inject("IJwtService") private _jwtService: IJwtService
  ) {}

  async createAdmin(email: string, password: string): Promise<Admin> {
    const existingAdmin = await this._adminRepository.findByEmail(email);
    if (existingAdmin) {
      throw new CustomError(
        "Admin already exists",
        HTTP_STATUS_CODES.BAD_REQUEST
      );
    }

    const hashedPassword = await this._passwordBcrypt.hash(password);

    const admin: Admin = {
      email,
      password: hashedPassword,
      role: "admin",
    };
    await this._adminRepository.save(admin);
    return admin;
  }

  async login(
    email: string,
    password: string
  ): Promise<AdminLoginResponse | null> {
    const admin = await this._adminRepository.findByEmail(email);
    if (!admin) {
      throw new CustomError("Admin not found", HTTP_STATUS_CODES.BAD_REQUEST);
    }

    if (password) {
      const isPasswordMatch = await this._passwordBcrypt.compare(
        password,
        admin.password
      );
      if (!isPasswordMatch) {
        throw new CustomError(
          MESSAGES.ERROR.AUTH.INVALID_CREDENTIALS,
          HTTP_STATUS_CODES.BAD_REQUEST
        );
      }
    }

    const accessToken = this._jwtService.generateAccessToken({
      id: admin._id || "",
      email: admin.email,
      role: admin.role,
    });

    const refreshToken = this._jwtService.generateRefreshToken({
      id: admin._id || "",
      email: admin.email,
      role: admin.role,
    });

    return {
      refreshToken,
      accessToken,
      admin: {
        _id: admin._id || "",
        name: admin.name,
        email: admin.email,
        role: admin.role,
        createdAt: admin.createdAt,
        updatedAt: admin.updatedAt,
      },
    };
  }
}
