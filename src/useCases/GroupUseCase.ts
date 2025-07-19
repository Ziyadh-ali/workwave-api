import { injectable, inject } from "tsyringe";
import { IGroupUseCase } from "../entities/useCaseInterface/IGroupUseCase";
import { IGroup } from "../entities/models/IGroup.entities";
import { IGroupRepository } from "../entities/repositoryInterfaces/IGroup.repository";
import { ObjectId } from "mongoose";
import { CustomError } from "../shared/errors/CustomError";
import { HTTP_STATUS_CODES } from "../shared/constants";
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
    if (!success) throw new CustomError('Failed to add members' , HTTP_STATUS_CODES.BAD_REQUEST);

    const group = await this.groupRepository.getGroupDetails(groupId);
    if (!group) throw new CustomError('Group not found' , HTTP_STATUS_CODES.BAD_REQUEST);

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