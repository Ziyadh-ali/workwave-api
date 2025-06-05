import { IAdminRepository } from "../../../entities/repositoryInterfaces/admin/admin.repository";
import { Admin } from "../../../entities/models/adminEntities/admin.enitity";
import { injectable } from "tsyringe";
import { AdminModel } from "../../../frameworks/database/models/admin/AdminModel";

@injectable()
export class AdminRepository implements IAdminRepository {
    async findByEmail(email: string): Promise<Admin | null> {
        return await AdminModel.findOne({email : email});
    }

    async save(admin: Admin): Promise<void> {
        await AdminModel.create(admin);
    }
}