import { inject, injectable } from "tsyringe";
import { IMessageRepository } from "../entities/repositoryInterfaces/IMessage.respository";
import { IMessage } from "../entities/models/IMessage.enities";
import { IMessageUseCase } from "../entities/useCaseInterface/IMessageUseCase";

@injectable()
export class MessageUseCase implements IMessageUseCase {
  constructor(
    @inject("IMessageRepository") private _messageRepository: IMessageRepository,
  ) { }

  async createMessage(data: IMessage): Promise<IMessage> {
    const savedMessage = await this._messageRepository.createMessage(data)
    return savedMessage;
  }

  async getPrivateMessages(user1: string, user2: string): Promise<IMessage[]> {
    return await this._messageRepository.getPrivateMessages(user1, user2);
  }

  async getGroupMessages(roomId: string): Promise<IMessage[]> {
    return await this._messageRepository.getMessagesByRoomId(roomId);
  }
  async createMessageWithMedia(data: IMessage): Promise<IMessage> {

    const savedMessage = await this._messageRepository.createMessage({
      content: data.content,
      sender: data.sender,
      recipient: data.recipient,
      roomId: data.roomId,
      media: data.media
    });

    return savedMessage;
  }
};