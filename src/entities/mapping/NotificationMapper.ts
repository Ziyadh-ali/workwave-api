import { CreateNotificationRequestDTO } from "../dtos/RequestDTOs/NotificationDTO";
import { NotificationResponseDTO, NotificationWithUsersResponseDTO } from "../dtos/ResponseDTOs/NotificationDTO";
import { INotification } from "../models/INotification";

export class NotificationMapper {
  static toEntity(dto: CreateNotificationRequestDTO): INotification {
    return {
      _id: undefined as any,
      recipient: dto.recipient,
      sender: dto.sender,
      type: dto.type,
      content: dto.content,
      read: false,
      createdAt: new Date(),
      updatedAt: new Date(),
      metadata: dto.metadata,
    };
  }

  static toResponseDTO(entity: INotification): NotificationResponseDTO {
    return {
      _id: entity._id.toString(),
      recipient: entity.recipient.toString(),
      sender: entity.sender?.toString(),
      type: entity.type,
      content: entity.content,
      read: entity.read ?? false,
      createdAt: entity.createdAt,
      updatedAt: entity.updatedAt,
      metadata: entity.metadata,
    };
  }

  static toResponseWithUsersDTO(
    entity: any
  ): NotificationWithUsersResponseDTO {
    return {
      _id: entity._id.toString(),
      recipient: {
        _id: entity.recipient._id.toString(),
        fullName: entity.recipient.fullName,
        role: entity.recipient.role,
      },
      sender: entity.sender
        ? {
            _id: entity.sender._id.toString(),
            fullName: entity.sender.fullName,
            role: entity.sender.role,
          }
        : undefined,
      type: entity.type,
      content: entity.content,
      read: entity.read ?? false,
      createdAt: entity.createdAt,
      updatedAt: entity.updatedAt,
      metadata: entity.metadata,
    };
  }
}