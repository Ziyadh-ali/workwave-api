import { injectable, inject } from "tsyringe";
import { IGroupUseCase } from "../entities/useCaseInterface/IGroupUseCase";
import { IGroup } from "../entities/models/IGroup.entities";
import { IGroupRepository } from "../entities/repositoryInterfaces/IGroup.repository";
import { ObjectId } from "mongoose";
// import { socketManager } from "../frameworks/di/resolver";


@injectable()
export class GroupUseCase implements IGroupUseCase {
  constructor(
    @inject("IGroupRepository") private groupRepository: IGroupRepository,
  ) { }


  async createGroup(data: IGroup): Promise<IGroup> {
    const group = await this.groupRepository.createGroup(data);
    // socketManager.emitGroupCreated(group);
    return group;
  }

  async getGroupsByUser(userId: ObjectId | string): Promise<IGroup[]> {
    return await this.groupRepository.getGroupsByUser(userId);
  }

  async addMembers(groupId: string, userIds: string[]) : Promise<{ members: string[]; createdBy: string }> {
    const success = await this.groupRepository.addMembers(groupId, userIds);
    if (!success) throw new Error('Failed to add members');

    const group = await this.groupRepository.getGroupDetails(groupId);
    if (!group) throw new Error('Group not found');

    // socketManager.emitMembersAdded(
    //   groupId,
    //   userIds,
    //   group.members
    // );

    return group;
  }

  async getGroupDetails(groupId: string): Promise<{ members: string[]; createdBy: string; } | null> {
    return await this.groupRepository.getGroupDetails(groupId);
  }
}