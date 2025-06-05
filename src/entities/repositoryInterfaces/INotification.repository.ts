import { INotification } from "../models/INotification";

export interface INotificationRepository {
    createNotification(notification: Omit<INotification, "_id" | "createdAt" | "updatedAt">): Promise<INotification>;
    getUnreadNotifications(userId: string): Promise<INotification[]>;
    markAsRead(notificationIds: string[]): Promise<void>;
    getUserNotifications(userId: string): Promise<{ notifications: INotification[]; total: number }>;
    deleteNotification(notificationId: string): Promise<void>;
}