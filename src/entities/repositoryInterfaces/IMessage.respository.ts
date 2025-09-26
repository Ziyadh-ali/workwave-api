import { IMessageModel } from "../../frameworks/database/models/MessageModel";
import { IMessage } from "../models/IMessage.enities";
import { IBaseRepository } from "./IBase.repository";


export interface IMessageRepository extends IBaseRepository<IMessageModel> {
  createMessage(data: IMessage): Promise<IMessage>;

  getMessagesByRoomId(roomId: string): Promise<IMessage[]>;

  getPrivateMessages(user1: string, user2: string): Promise<IMessage[]>;

  markAsDelivered(messageId: string, userId: string): Promise<void>;

  markAsRead(messageId: string, userId: string): Promise<void>;
}
