import { inject, injectable } from "tsyringe";
import { IRefreshTokenUseCase } from "../../entities/useCaseInterface/IRefreshTokenUseCase";
import { JwtService } from "../../adapters/service/JwtService";
import { updateCookieWithAccessToken } from "../../shared/utils/cookieHelper";
import { Response } from "express";
import { IJwtService, TJwtPayload } from "../../entities/services/JwtInterface";
import { CustomError } from "../../shared/errors/CustomError";
import { HTTP_STATUS_CODES } from "../../shared/constants";


@injectable()
export class RefreshTokenUseCase implements IRefreshTokenUseCase {
    constructor(
        @inject("IJwtService") private jwtService: IJwtService,
    ) { }
    async execute(refreshToken: string , res : Response , role : string): Promise<{ accessToken: string; }> {
        try {
            const decoded = this.jwtService.verifyRefreshToken(refreshToken) as TJwtPayload;

            const newPayload = {
                id: decoded.id,
                email: decoded.email,
                role: decoded.role,
            }

            const accessToken = this.jwtService.generateAccessToken(newPayload);

            updateCookieWithAccessToken(
                res,
                accessToken,
                role === "admin" ? "_access_token" : "access_token",
            );

            return {accessToken}
        } catch (error) {
            console.log(error);
            throw new Error("Error in refresh end point");
        }
    }
}