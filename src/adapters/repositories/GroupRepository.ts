import { injectable } from "tsyringe";
import { IGroupRepository } from "../../entities/repositoryInterfaces/IGroup.repository";
import { IGroup } from "../../entities/models/IGroup.entities";
import { GroupModel } from "../../frameworks/database/models/GroupModel";
import { ObjectId } from "mongoose";
import { CustomError } from "../../shared/errors/CustomError";
import { HTTP_STATUS_CODES } from "../../shared/constants";

@injectable()
export class GroupRepository implements IGroupRepository {
    async createGroup(group: IGroup): Promise<IGroup> {
        return await GroupModel.create(group);
    }

    async getGroupsByUser(userId: string | ObjectId): Promise<IGroup[]> {
        return await GroupModel.find({ members: userId });
    }

    async deleteGroup(groupId: string | ObjectId): Promise<void> {
        await GroupModel.findByIdAndDelete(groupId)
    }

    async removeMember(roomId: string | ObjectId, memberId: string | ObjectId): Promise<void> {
        await GroupModel.updateOne(
            { _id: roomId },
            { $pull: { members: memberId } }
        );
    }

    async isUserAdmin(groupId: string, userId: string): Promise<boolean> {
        const group = await GroupModel.findOne(
            { _id: groupId, admin: userId },
            { _id: 1 }
        );
        return !!group;
    }

    async addMembers(groupId: string, userIds: string[]): Promise<boolean> {
        try {
            const result = await GroupModel.updateOne(
                { _id: groupId },
                { $addToSet: { members: { $each: userIds } } }
            );
            return result.modifiedCount === 1;
        } catch (error) {
            console.error('Error adding members:', error);
            throw new CustomError('Failed to add members to group' , HTTP_STATUS_CODES.BAD_REQUEST);
        }
    }

    async getGroupDetails(groupId: string): Promise<{  name : string , members: string[], createdBy: string } | null> {
        const group = await GroupModel.findOne(
            { _id: groupId },
            { members: 1, createdBy: 1 }
          ).lean();
        
          if (!group) return null;
        
          return {
            members: group.members.map((m: any) => m.toString()),
            createdBy: group.createdBy.toString(),
            name : group.name
          };
    }
}