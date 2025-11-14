import { Request } from "express";
import { JwtPayload } from "jsonwebtoken";
import { ObjectId } from "mongoose";

export interface TJwtPayload extends JwtPayload {
  id?: ObjectId | string;
  email : string;
  role: string;
}

export interface IJwtService {
  generateAccessToken(data: TJwtPayload): string;
  generateRefreshToken(data: TJwtPayload): string;
  verifyAccessToken(token: string): JwtPayload | null;
  verifyRefreshToken(token: string): JwtPayload | null;
  decodeRefreshToken(token: string): JwtPayload | null;
  generateResetToken(email : string) : string;
  verifyResetToken(resetToken : string) : {email : string} | null
}

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