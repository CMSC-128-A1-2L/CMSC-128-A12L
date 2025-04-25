// repositories/notification_repository.ts
import { connectDB } from "@/databases/mongodb";
import { NotificationDto, NotificationSchema } from "@/models/notifications";
import { mapNotificationDtoToNotification, mapNotificationToNotificationDto } from "@/mappers/notifications";
import { Notification } from "@/entities/notifications";
import { Connection, Model } from "mongoose";

// Interface for the repository
export interface NotificationRepository {
    getNotificationsWithFilters(userId: string, isRead?: boolean, type?: string): Promise<Notification[]>;
    createNotification(notification: Notification): Promise<string>;
    deleteNotificationById(id: string): Promise<void>;
    markAsRead(id: string): Promise<void>;
    markAllAsRead(userId: string): Promise<void>;
}


class MongoDBNotificationRepository implements NotificationRepository {
    private connection: Connection;
    private model: Model<NotificationDto>;

    constructor(connection: Connection) {
        this.connection = connection;
        this.model = connection.models["Notification"] ?? connection.model("Notification", NotificationSchema, "notifications");
    }

    async getNotificationsWithFilters(userId: string, isRead?: boolean, type?: string): Promise<Notification[]> {
        const query: any = { userId };
        if (typeof isRead === "boolean") query.isRead = isRead;
        if (type) query.type = type;

        const results = await this.model.find(query).sort({ createdAt: -1 });
        return results.map(mapNotificationDtoToNotification);
    }

    async createNotification(notification: Notification): Promise<string> {
        const dto = mapNotificationToNotificationDto(notification);
        const created = await this.model.create(dto);
        return created._id.toString();
    }

    async deleteNotificationById(id: string): Promise<void> {
        await this.model.findByIdAndDelete(id);
    }

    async markAsRead(id: string): Promise<void> {
        await this.model.findByIdAndUpdate(id, { isRead: true });
    }

    async markAllAsRead(userId: string): Promise<void> {
        await this.model.updateMany({ userId }, { isRead: true });
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
