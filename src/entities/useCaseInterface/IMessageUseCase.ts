import { IMessage } from "../models/IMessage.enities";

export interface IMessageUseCase {
    createMessage(data: IMessage): Promise<IMessage>;

    getPrivateMessages(user1: string, user2: string): Promise<IMessage[]>;

    getGroupMessages(roomId: string): Promise<IMessage[]>;

    createMessageWithMedia(data: Partial<IMessage>): Promise<IMessage>
}