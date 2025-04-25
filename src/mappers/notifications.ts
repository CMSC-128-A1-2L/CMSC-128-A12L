// mappers/notification.ts
import { NotificationDto } from "@/models/notifications";
import { Notification } from "@/entities/notifications";

// Maps NotificationDto to Notification
export function mapNotificationDtoToNotification(dto: NotificationDto): Notification {
    return {
        _id: dto._id?.toString(),
        userId: dto.userId.toString(),
        type: dto.type,
        title: dto.title,
        message: dto.message,
        link: dto.link,
        isRead: dto.isRead,
        createdAt: dto.createdAt,
        updatedAt: dto.updatedAt,
    };
}

// Maps Notification to NotificationDto
export function mapNotificationToNotificationDto(notification: Notification): NotificationDto {
    return {
        _id: notification._id,
        userId: notification.userId,
        type: notification.type,
        title: notification.title,
        message: notification.message,
        link: notification.link,
        isRead: notification.isRead,
        createdAt: notification.createdAt,
        updatedAt: notification.updatedAt,
    };
}
