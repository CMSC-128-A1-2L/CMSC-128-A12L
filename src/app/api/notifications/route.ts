// app/api/notifications/route.ts
import { NextApiRequest, NextApiResponse } from "next/server";
import { getNotificationRepository } from "@/repositories/notifications_repository";
import { Notification } from "@/entities/notifications";
import { getServerSession } from "next-auth";
import { authOptions } from "@/app/api/auth/[...nextauth]/route";
import { UserRole } from "@/entities/user";

// Get all notifications
export async function GET(req: NextApiRequest, res: NextApiResponse) {
    const { isRead, type } = req.query;
    const session = await getServerSession(authOptions);

    if (!session || !session.user.role.includes(UserRole.ADMIN)) {
        return res.status(401).json({ error: "Unauthorized" });
    }

    try {
        const notificationRepository = getNotificationRepository();
        const notifications = await notificationRepository.getNotificationsWithFilters(
            session.user.id as string,
            isRead === "true" ? true : isRead === "false" ? false : undefined,
            type as string
        );
        res.status(200).json(notifications);
    } catch (error) {
        res.status(500).json({ error: "Error retrieving notifications" });
    }
}

// Mark all notifications as read
export async function PATCH(req: NextApiRequest, res: NextApiResponse) {
    const session = await getServerSession(authOptions);

    if (!session || !session.user.role.includes(UserRole.ADMIN)) {
        return res.status(401).json({ error: "Unauthorized" });
    }

    try {
        const notificationRepository = getNotificationRepository();
        await notificationRepository.markAllAsRead(session.user.id as string);
        res.status(200).json({ message: "All notifications marked as read" });
    } catch (error) {
        res.status(500).json({ error: "Error marking all notifications as read" });
    }
}

// Admin only: Create a new notification
export async function POST(req: NextApiRequest, res: NextApiResponse) {
    const session = await getServerSession(authOptions);

    if (!session || !session.user.role.includes(UserRole.ADMIN)) {
        return res.status(401).json({ error: "Unauthorized" });
    }

    try {
        const notificationRepository = getNotificationRepository();
        const notification: Notification = req.body;
        const notificationId = await notificationRepository.createNotification(notification);
        res.status(201).json({ message: "Notification created", id: notificationId });
    } catch (error) {
        res.status(500).json({ error: "Error creating notification" });
    }
}
