import { IMessage } from "../../entities/models/IMessage.enities";
import { IMessageRepository } from "../../entities/repositoryInterfaces/IMessage.respository";
import { injectable } from "tsyringe";
import { IMessageModel, MessageModel } from "../../frameworks/database/models/MessageModel";
import { BaseRepository } from "./BaseRepository";

@injectable()
export class MessageRepository extends BaseRepository<IMessageModel> implements IMessageRepository {
    constructor() {
        super(MessageModel)
    }
    async createMessage(data: IMessage): Promise<IMessage> {
        const message = await MessageModel.create({
            content: data.content,
            sender: data.sender,
            recipient: data.recipient || null,
            roomId: data.roomId || null,
            media : data.media,
        });
        return message
    }

    async getMessagesByRoomId(roomId: string): Promise<IMessage[]> {
        return MessageModel.find({ roomId })
            .populate("sender", "fullName email profilePic")
            .sort({ createdAt: 1 });
    }

    async getPrivateMessages(user1: string, user2: string): Promise<IMessage[]> {
        return MessageModel.find({
            $or: [
                { sender: user1, recipient: user2 },
                { sender: user2, recipient: user1 },
            ],
        })
            .populate("sender", "fullName email profilePic")
            .sort({ createdAt: 1 });
    }

    async markAsDelivered(messageId: string, userId: string): Promise<void> {
        await MessageModel.findByIdAndUpdate(messageId, {
            $addToSet: { deliveredTo: userId },
        });
    }

    async markAsRead(messageId: string, userId: string): Promise<void> {
        await MessageModel.findByIdAndUpdate(messageId, {
            $addToSet: { readBy: userId },
        });
    }
}