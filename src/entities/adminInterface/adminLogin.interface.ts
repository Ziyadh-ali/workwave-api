import { Admin } from "./admin.interface";

export interface AdminLoginInterface {
    email : string;
    password : string;
}

export interface AdminLoginResponse {
    accessToken : string;
    refreshToken : string;
    admin : Omit<Admin , "password">;
}