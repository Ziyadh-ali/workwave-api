import { Document , model , ObjectId } from "mongoose";
import { Admin } from "../../../../entities/models/adminEntities/admin.enitity";
import { AdminSchema } from "../../schemas/admin/AdminSchema";


export interface IAdminModel extends Omit<Admin , "_id">,Document {
    _id : ObjectId;
}

export const AdminModel = model<IAdminModel>("Admin",AdminSchema)