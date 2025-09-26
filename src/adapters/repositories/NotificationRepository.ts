import { injectable } from "tsyringe";
import { INotification } from "../../entities/models/INotification";
import { INotificationRepository } from "../../entities/repositoryInterfaces/INotification.repository";
import { NotificationModel } from "../../frameworks/database/models/NotificationModel";
import mongoose from "mongoose";

@injectable()
export class NotificationRepository implements INotificationRepository {
    async createNotification(notificationData : INotification ) {
        const notification =await NotificationModel.create({
            ...notificationData,
            _id: new mongoose.Types.ObjectId(),
        });
        return notification
    }

    async deleteNotification(notificationId: string): Promise<void> {
        await NotificationModel.findByIdAndDelete(notificationId);
    }

    async getUnreadNotifications(userId: string): Promise<INotification[]> {
        const notifications = await NotificationModel.find({
            recipient: userId,
            read: false,
        })
            .sort({ createdAt: -1 })
            .populate("sender", "fullName email profilePic")
            .lean()
            .exec()

        return notifications;
    }

    async getUserNotifications(userId: string): Promise<{ notifications: INotification[]; total: number; }> {

        const [notifications, total] = await Promise.all([
            NotificationModel
                .find({ recipient: userId })
                .sort({ createdAt: -1 })
                .populate("sender", "fullName email profilePic")
                .lean()
                .exec(),

            NotificationModel.countDocuments({ recipient: userId }),
        ]);

        return {
            notifications: notifications as INotification[],
            total
        }
    }

    async markAsRead(notificationIds: string[]) {
        const realIds = notificationIds.filter(id => !id.startsWith('temp-'));

        if (realIds.length > 0) {
            await NotificationModel.updateMany(
                { _id: { $in: realIds } },
                { $set: { read: true } }
            ).exec();
        }
    }
}