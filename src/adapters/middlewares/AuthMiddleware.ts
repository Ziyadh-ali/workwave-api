import { Request, Response, NextFunction } from "express";
import { JwtService } from "../service/JwtService";
import { JwtPayload } from "jsonwebtoken";
import { HTTP_STATUS_CODES } from "../../shared/constants";
import { ObjectId } from "mongoose";

const tokenService = new JwtService();


export interface CustomJwtPayload extends JwtPayload {
    id: string | ObjectId;
    email: string;
    role: string;
    access_token: string;
    refresh_token: string;
};

export interface CustomRequest extends Request {
    user: CustomJwtPayload;
}

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
                console.log("no token");
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