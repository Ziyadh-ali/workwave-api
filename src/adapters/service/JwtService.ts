import { injectable } from "tsyringe";
import { TJwtPayload, IJwtService } from "../../entities/services/JwtInterface";
import jwt, { JwtPayload, Secret } from "jsonwebtoken";
import { config } from "../../shared/config";
import ms from "ms";
import { CustomError } from "../../shared/errors/CustomError";
import { HTTP_STATUS_CODES } from "../../shared/constants";

@injectable()
export class JwtService implements IJwtService {
    private _accessSecret: Secret;
    private _accessExpiresIn: string;
    private _refreshSecret: Secret;
    private _refreshExpiresIn: string;
    private _resetTokenSecret: string;
    private _resetTokenExpiresIn: string;
    constructor() {
        this._accessSecret = config.jwt.ACCESS_SECRET_KEY,
            this._accessExpiresIn = config.jwt.ACCESS_EXPIRES_IN,

            this._refreshSecret = config.jwt.REFRESH_SECRET_KEY,
            this._refreshExpiresIn = config.jwt.REFRESH_EXPIRES_IN,

            this._resetTokenSecret = config.jwt.RESET_PASSWORD_SECRET_KEY,
            this._resetTokenExpiresIn = config.jwt.RESET_TOKEN_EXPIRES_IN
    }

    generateAccessToken(data: TJwtPayload): string {
        return jwt.sign(data, this._accessSecret, { expiresIn: this._accessExpiresIn as ms.StringValue });
    }

    generateRefreshToken(data: TJwtPayload): string {
        return jwt.sign(data, this._refreshSecret, { expiresIn: this._refreshExpiresIn as ms.StringValue });
    }

    verifyAccessToken(token: string): JwtPayload | null {
        try {
            return jwt.verify(token, this._accessSecret) as TJwtPayload
        } catch {
            throw new CustomError("Invalid or Expired Access Token", HTTP_STATUS_CODES.BAD_REQUEST);
        }
    }

    verifyRefreshToken(token: string): JwtPayload | null {
        try {
            return jwt.verify(token, this._refreshSecret) as JwtPayload;
        } catch {
            throw new CustomError("Invalid or Expired Refresh Token", HTTP_STATUS_CODES.BAD_REQUEST);
        }
    }

    decodeRefreshToken(token: string): JwtPayload | null {
        const decode = jwt.decode(token) as JwtPayload;
        return decode;
    }

    generateResetToken(email: string): string {
        return jwt.sign({ email: email }, this._resetTokenSecret, { expiresIn: this._resetTokenExpiresIn as ms.StringValue });
    }

    verifyResetToken(resetToken: string): { email: string } | null {
        try {
            const decoded = jwt.verify(resetToken, this._resetTokenSecret) as { email: string };
            return decoded;
        } catch {
            return null;
        }
    }

}