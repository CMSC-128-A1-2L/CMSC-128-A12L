// app/api/notifications/[id]/route.ts
import { NextApiRequest, NextApiResponse } from "next/server";
import { getNotificationRepository } from "@/repositories/notifications_repository";
import { getServerSession } from "next-auth";
import { authOptions } from "@/app/api/auth/[...nextauth]/route";
import { UserRole } from "@/entities/user";

// Fetch a specific notification by ID
export async function GET(req: NextApiRequest, res: NextApiResponse) {
    const { id } = req.query;
    const session = await getServerSession(authOptions);

    if (!session || !session.user.role.includes(UserRole.ADMIN)) {
        return res.status(401).json({ error: "Unauthorized" });
    }

    try {
        const notificationRepository = getNotificationRepository();
        const notifications = await notificationRepository.getNotificationsWithFilters(session.user.id as string);

        const notification = notifications.find((notification) => notification._id === id);
        
        if (!notification) {
            return res.status(404).json({ error: "Notification not found" });
        }

        res.status(200).json(notification);
    } catch (error) {
        res.status(500).json({ error: "Error retrieving notification" });
    }
}

// Mark a specific notification as read
export async function PATCH(req: NextApiRequest, res: NextApiResponse) {
    const { id } = req.query;
    const session = await getServerSession(authOptions);

    if (!session || !session.user.role.includes(UserRole.ADMIN)) {
        return res.status(401).json({ error: "Unauthorized" });
    }

    try {
        const notificationRepository = getNotificationRepository();
        await notificationRepository.markAsRead(id as string);
        res.status(200).json({ message: "Notification marked as read" });
    } catch (error) {
        res.status(500).json({ error: "Error marking notification as read" });
    }
}

// Delete a specific notification
export async function DELETE(req: NextApiRequest, res: NextApiResponse) {
    const { id } = req.query;
    const session = await getServerSession(authOptions);

    if (!session || !session.user.role.includes(UserRole.ADMIN)) {
        return res.status(401).json({ error: "Unauthorized" });
    }

    try {
        const notificationRepository = getNotificationRepository();
        await notificationRepository.deleteNotificationById(id as string);
        res.status(200).json({ message: "Notification deleted successfully" });
    } catch (error) {
        res.status(500).json({ error: "Error deleting notification" });
    }
}
