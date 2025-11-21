import { IAdminRepository } from "../../../entities/repositoryInterfaces/admin/AdminRepository";
import { Admin } from "../../../entities/models/adminEntities/AdminEnitity";
import { injectable } from "tsyringe";
import { AdminModel } from "../../database/models/admin/AdminModel";
import { AdminRequestDTO } from "../../../entities/dtos/RequestDTOs/AdminDTO";

@injectable()
export class AdminRepository implements IAdminRepository {
    async findByEmail(email: string): Promise<Admin | null> {
        return await AdminModel.findOne({ email: email });
    }

    async save(admin: AdminRequestDTO): Promise<Admin> {
        return await AdminModel.create(admin);
    }
}