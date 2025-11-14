import { injectable, inject } from "tsyringe";
import { IGroupUseCase } from "../entities/useCaseInterface/IGroupUseCase";
import { IGroup } from "../entities/models/IGroup.entities";
import { IGroupRepository } from "../entities/repositoryInterfaces/IGroup.repository";
import { ObjectId } from "mongoose";
import { CustomError } from "../shared/errors/CustomError";
import { HTTP_STATUS_CODES } from "../shared/constants";


@injectable()
export class GroupUseCase implements IGroupUseCase {
  constructor(
    @inject("IGroupRepository") private _groupRepository: IGroupRepository,
  ) { }


  async createGroup(data: IGroup): Promise<IGroup> {
    const group = await this._groupRepository.create(data);
    return group;
  }

  async getGroupsByUser(userId: ObjectId | string): Promise<IGroup[]> {
    return await this._groupRepository.getGroupsByUser(userId);
  }

  async addMembers(groupId: string, userIds: string[]) : Promise<{ members: string[]; createdBy: string }> {
    const success = await this._groupRepository.addMembers(groupId, userIds);
    if (!success) throw new CustomError('Failed to add members' , HTTP_STATUS_CODES.BAD_REQUEST);

    const group = await this._groupRepository.getGroupDetails(groupId);
    if (!group) throw new CustomError('Group not found' , HTTP_STATUS_CODES.BAD_REQUEST);

    return group;
  }

  async getGroupDetails(groupId: string): Promise<{ members: string[]; createdBy: string; } | null> {
    return await this._groupRepository.getGroupDetails(groupId);
  }
}