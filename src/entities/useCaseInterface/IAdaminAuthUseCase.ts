import { AdminLoginResponse } from "../adminInterface/adminLogin.interface";
import { Admin } from "../models/adminEntities/admin.enitity";

export interface IAdminAuthUseCase {
    login(email : string , password : string) : Promise<AdminLoginResponse | null>;
    createAdmin(email : string , password : string) : Promise<Admin>
}