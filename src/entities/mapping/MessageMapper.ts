import { MessageRequestDTO } from "../dtos/RequestDTOs/MessageDTO";
import { IMessage } from "../models/IMessage.enities";
import { MessageResponseDTO } from "../dtos/ResponseDTOs/MessageDTO";

export class MessageMapper {
  
  static toEntity(dto: MessageRequestDTO): Partial<MessageRequestDTO> {
    return {
      content: dto.content ?? "",
      sender: dto.sender,
      roomId: dto.roomId,
      recipient: dto.recipient,
      media: dto.media ? {
        url: dto.media.url,
        type: dto.media.type,
        public_id: dto.media.public_id
      } : undefined
    };
  }

  static toResponseDTO(message: IMessage): MessageResponseDTO {
    return {
      _id: message._id?.toString() || "",
      content: message.content ?? null,
      sender: {
        _id: message.sender._id,
        fullName: message.sender.fullName,
        email: message.sender.email,
        profilePic: message.sender.profilePic
      },
      roomId: message.roomId?.toString() ?? null,
      recipient: message.recipient?.toString() ?? null,
      media: message.media
        ? {
            url: message.media.url,
            type: message.media.type,
            public_id: message.media.public_id
          }
        : null,
      createdAt: message.createdAt || new Date()
    };
  }
}
