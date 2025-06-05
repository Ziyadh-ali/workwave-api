import { Document, model, ObjectId } from "mongoose";
import { MessageSchema } from "../schemas/MessageSchema";
import { IMessage } from "../../../entities/models/IMessage.enities";


export interface IMessageModel extends Omit<IMessage , "_id">, Document {
    _id : ObjectId;
}

export const MessageModel = model<IMessageModel>("Message",MessageSchema);