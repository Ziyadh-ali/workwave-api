import { AdminRequestDTO } from "../../dtos/RequestDTOs/AdminDTO";
import { Admin } from "../../models/adminEntities/AdminEnitity";
export interface IAdminRepository {
    findByEmail(email : string) : Promise<Admin | null>;
    save(admin : AdminRequestDTO) : Promise<Admin>;
    // update(id:string , updates : Partial<Admin>) : Promise<Admin | null>;
}