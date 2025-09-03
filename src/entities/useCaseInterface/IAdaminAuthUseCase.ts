import { AdminLoginResponse } from "../adminInterface/AdminLoginInterface";
import { Admin } from "../models/adminEntities/AdminEnitity";

export interface IAdminAuthUseCase {
    login(email : string , password : string) : Promise<AdminLoginResponse | null>;
    createAdmin(email : string , password : string) : Promise<Admin>
}