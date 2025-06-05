import { ObjectId } from "mongoose";
import { IGroup } from "../models/IGroup.entities";

export interface IGroupRepository {
  createGroup(group: IGroup): Promise<IGroup>;
  getGroupsByUser(userId: string | ObjectId): Promise<IGroup[]>;
  deleteGroup(groupId: string | ObjectId): Promise<void>;
  removeMember(roomId: string | ObjectId, memberId: string | ObjectId): Promise<void>;
  isUserAdmin(groupId: string, userId: string): Promise<boolean>;
  addMembers(groupId: string, userIds: string[]): Promise<boolean>;
  getGroupDetails(groupId: string): Promise<{ name : string ,members: string[], createdBy: string } | null>;
}