import { ObjectId } from "mongoose";
import { IGroup } from "../models/IGroup.entities";
import { IBaseRepository } from "./IBase.repository";
import { IGroupModel } from "../../frameworks/database/models/GroupModel";

export interface IGroupRepository extends IBaseRepository<IGroupModel> {
  getGroupsByUser(userId: string | ObjectId): Promise<IGroup[]>;
  deleteGroup(groupId: string | ObjectId): Promise<void>;
  removeMember(roomId: string | ObjectId, memberId: string | ObjectId): Promise<void>;
  isUserAdmin(groupId: string, userId: string): Promise<boolean>;
  addMembers(groupId: string, userIds: string[]): Promise<boolean>;
  getGroupDetails(groupId: string): Promise<{ name : string ,members: string[], createdBy: string } | null>;
}