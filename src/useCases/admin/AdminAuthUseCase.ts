import { injectable, inject } from "tsyringe";
import { IAdminRepository } from "../../entities/repositoryInterfaces/admin/admin.repository";
import { Admin } from "../../entities/models/adminEntities/admin.enitity";
import { AdminLoginResponse } from "../../entities/adminInterface/adminLogin.interface";
import { IAdminAuthUseCase } from "../../entities/useCaseInterface/IAdaminAuthUseCase";
import { MESSAGES } from "../../shared/constants";
import { loginSchema } from "../../shared/validation/validator";
import { IJwtService } from "../../entities/services/jwt.interface";
import { IBcrypt } from "../../frameworks/security/bcrypt.interface";


@injectable()
export class AdminAuthUseCase implements IAdminAuthUseCase {
    constructor(
        @inject("IAdminRepository") private adminRepository: IAdminRepository,
        @inject("IBcrypt") private passwordBcrypt: IBcrypt,
        @inject("IJwtService") private jwtService: IJwtService,
    ) { }

    async createAdmin(email: string, password: string): Promise<Admin> {
        try {
            const existingAdmin = await this.adminRepository.findByEmail(email);
            if (existingAdmin) {
                throw new Error("Admin already exists");
            }

            const hashedPassword = await this.passwordBcrypt.hash(password);

            const admin: Admin = {
                email,
                password: hashedPassword,
                role: "admin"
            };
            await this.adminRepository.save(admin);
            return admin;
        } catch (error) {
            throw new Error(`Failed to create admin`);
        }
    }

    async login(email: string, password: string): Promise<AdminLoginResponse | null> {
        // const validationResult = loginSchema.safeParse({ email, password });
        // if (!validationResult.success) {
        //     throw new Error(JSON.stringify(validationResult.error.format()));
        // }
        const admin = await this.adminRepository.findByEmail(email);
        if (!admin) {
            throw new Error("Admin not found");
        }

        if (password) {
            const isPasswordMatch = await this.passwordBcrypt.compare(password, admin.password);
            if (!isPasswordMatch) {
                throw new Error(MESSAGES.ERROR.AUTH.INVALID_CREDENTIALS);
            }
        }


        const accessToken = this.jwtService.generateAccessToken({
            id: admin._id || "",
            email: admin.email,
            role: admin.role,
        });

        const refreshToken = this.jwtService.generateRefreshToken({
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
            }
        }
    }
}