import { Request, Response, NextFunction } from "express";
import { HTTP_STATUS_CODES } from "../../shared/constants";
import { JwtService } from "../../adapters/service/JwtService";
import { CustomJwtPayload, CustomRequest } from "../../entities/services/JwtInterface";

const tokenService = new JwtService();

const extractToken = (
    req: Request,
    role: "admin" | "employee",
): { accessToken: string; refreshToken: string } | null => {
    return {
        accessToken: req.cookies[role === "admin" ? "_access_token" : "access_token"] || null,
        refreshToken: req.cookies[role === "admin" ? "_refresh_token" : "refresh_token"] || null,
    };
};

export const verifyAuth = (
    role :"admin" | "employee"
) => {
    return (req: Request, res: Response,next : NextFunction) => {
        try {
            const token = extractToken(req,role);

            if (!token) {
                res
                    .status(HTTP_STATUS_CODES.UNAUTHORIZED)
                    .json({ message: "Unauthorized access." });
                return;
            }
            if (!token.accessToken) {
                res.status(HTTP_STATUS_CODES.UNAUTHORIZED).json({ message: "Access token not provided" });
                return;
            }

            const user = tokenService.verifyAccessToken(
                token.accessToken
            ) as CustomJwtPayload;


            if (!user || !user.id) {
                res
                    .status(HTTP_STATUS_CODES.UNAUTHORIZED)
                    .json({ message: "Unauthorized access." });
                return;
            }

            (req as CustomRequest).user = {
                ...user,
                access_token: token.accessToken,
                refresh_token: token.refreshToken,
            };

            next();

        } catch (error) {
            if (error instanceof Error && error.message === "Invalid or Expired Access Token") {
                res.status(HTTP_STATUS_CODES.FORBIDDEN).json({ message: "Forbidden: Invalid or expired access token" });
            } else {
                res.status(500).json({ message: 'Internal server error' });
            }
            return;
        }
    }
}