import { inject, injectable } from "tsyringe";
import { IMessageRepository } from "../entities/repositoryInterfaces/IMessage.respository";
import { IMessageUseCase } from "../entities/useCaseInterface/IMessageUseCase";
import { MessageResponseDTO } from "../entities/dtos/ResponseDTOs/MessageDTO";
import { MessageRequestDTO } from "../entities/dtos/RequestDTOs/MessageDTO";
import { MessageMapper } from './../entities/mapping/MessageMapper';

@injectable()
export class MessageUseCase implements IMessageUseCase {
  constructor(
    @inject("IMessageRepository") private _messageRepository: IMessageRepository,
  ) { }

  async createMessage(data: MessageRequestDTO): Promise<MessageResponseDTO> {
    const savedMessage = await this._messageRepository.createMessage(data)
    return MessageMapper.toResponseDTO(savedMessage);
  }

  async getPrivateMessages(user1: string, user2: string): Promise<MessageResponseDTO[]> {
    const messages = await this._messageRepository.getPrivateMessages(user1, user2);
    return messages.map(MessageMapper.toResponseDTO);
  }

  async getGroupMessages(roomId: string): Promise<MessageResponseDTO[]> {
    const messages = await this._messageRepository.getMessagesByRoomId(roomId);
    return messages.map(MessageMapper.toResponseDTO);
  }
  async createMessageWithMedia(data: MessageRequestDTO): Promise<MessageResponseDTO> {

    const savedMessage = await this._messageRepository.createMessage({
      content: data.content,
      sender: data.sender,
      recipient: data.recipient,
      roomId: data.roomId,
      media: data.media
    });

    return MessageMapper.toResponseDTO(savedMessage);
  }

  markAsRead(messageId: string, userId: string): Promise<void> {
    return this._messageRepository.markAsRead(messageId, userId);
  }
};