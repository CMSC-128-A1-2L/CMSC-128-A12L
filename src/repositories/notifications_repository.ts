// repositories/notification_repository.ts
import { connectDB } from "@/databases/mongodb";
import { NotificationDto, NotificationSchema } from "@/models/notifications";
import { mapNotificationDtoToNotification, mapNotificationToNotificationDto } from "@/mappers/notifications";
import { Notification } from "@/entities/notifications";
import { Connection, Model } from "mongoose";

// Interface for the repository
export interface NotificationRepository {
    getNotificationsWithFilters(userId: string): Promise<Notification[]>;
    createNotification(notification: Notification): Promise<string>;
    createGlobalNotification(notification: Notification): Promise<string>;
    deleteNotificationById(id: string): Promise<void>;
    markAsRead(id: string): Promise<void>;
    markAsUnread(id: string): Promise<void>;
    markAllAsRead(userId: string): Promise<void>;
}

class MongoDBNotificationRepository implements NotificationRepository {
    private connection: Connection;
    private model: Model<NotificationDto>;

    constructor(connection: Connection) {
        this.connection = connection;
        this.model = connection.models["Notification"] ?? connection.model("Notification", NotificationSchema, "notifications");
    }

    async getNotificationsWithFilters(userId: string): Promise<Notification[]> {
        // Get both user-specific and global notifications
        const results = await this.model.find({
            $or: [
                { userId }, // User-specific notifications
                { userId: { $exists: false } } // Global notifications (no userId)
            ]
        }).sort({ createdAt: -1 });

        return results.map(mapNotificationDtoToNotification);
    }

    async createNotification(notification: Notification): Promise<string> {
        const dto = mapNotificationToNotificationDto(notification);
        const created = await this.model.create(dto);
        return created._id.toString();
    }

    async createGlobalNotification(notification: Notification): Promise<string> {
        // Create a notification without userId to make it global
        const { userId, ...globalNotification } = notification;
        const dto = mapNotificationToNotificationDto(globalNotification);
        const created = await this.model.create(dto);
        return created._id.toString();
    }

    async deleteNotificationById(id: string): Promise<void> {
        await this.model.findByIdAndDelete(id);
    }

    async markAsRead(id: string): Promise<void> {
        await this.model.findByIdAndUpdate(id, { isRead: true });
    }

    async markAsUnread(id: string): Promise<void> {
        await this.model.findByIdAndUpdate(id, { isRead: false });
    }

    async markAllAsRead(userId: string): Promise<void> {
        // Mark all notifications as read for a specific user
        // This includes both user-specific and global notifications
        await this.model.updateMany(
            {
                $or: [
                    { userId },
                    { userId: { $exists: false } }
                ]
            },
            { isRead: true }
        );
    }
}

let notificationRepository: NotificationRepository | null = null;

export function getNotificationRepository(): NotificationRepository {
    if (notificationRepository !== null) {
        return notificationRepository;
    }

    const connection = connectDB();
    notificationRepository = new MongoDBNotificationRepository(connection);
    return notificationRepository;
}
