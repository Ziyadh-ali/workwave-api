import { ObjectId } from "mongoose";
import { IGroup } from "../models/IGroup.entities";

export interface IGroupUseCase {
  createGroup(data: IGroup): Promise<IGroup>;
  getGroupsByUser(userId: ObjectId | string): Promise<IGroup[]>;
  addMembers(groupId: string, userIds: string[]): Promise<{ members: string[]; createdBy: string }>
  getGroupDetails(groupId: string): Promise<{members: string[], createdBy: string } | null>;
}