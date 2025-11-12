import { Document, model, ObjectId } from "mongoose";
import { MessageSchema } from "../schemas/MessageSchema";
import { INotification } from "../../../entities/models/INotification";
import { NotificationSchema } from "../schemas/NotificationSchema";


export interface INotificationModel extends Omit<INotification , "_id">, Document {
    _id : ObjectId;
}

export const NotificationModel = model<INotificationModel>("Notification",NotificationSchema);