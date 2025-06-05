import { Admin } from "../../models/adminEntities/admin.enitity";
export interface IAdminRepository {
    findByEmail(email : string) : Promise<Admin | null>;
    save(admin : Admin) : Promise<void>;
    // update(id:string , updates : Partial<Admin>) : Promise<Admin | null>;
}