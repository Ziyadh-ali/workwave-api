import { Document , model , ObjectId } from "mongoose";
import { IGroup } from "../../../entities/models/IGroup.entities";
import { GroupSchema } from "../schemas/GroupSchema";

export interface IGroupModel extends Omit<IGroup , "_id">,Document {
    _id : ObjectId;
}

export const GroupModel = model<IGroupModel>("Group",GroupSchema);