import { NextRequest } from "next/server";
import { UserRole } from "@/entities/user";
import { getServerSession } from "next-auth";
import { NextResponse } from "next/server";
import { authOptions } from "../../auth/[...nextauth]/route";
import { getUserRepository } from "@/repositories/user_repository";
import { getNotificationRepository } from "@/repositories/notifications_repository";

export async function POST(req: NextRequest) {
    const session = await getServerSession(authOptions);

    if (!session) {
        return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    try {
        // Get the notification data from request body
        const notificationData = await req.json();
        
        // Get all users
        const userRepository = getUserRepository();
        const users = await userRepository.getAllUsers();
        
        // Get notification repository
        const notificationRepository = getNotificationRepository();
        
        // Create a notification for each user
        const notificationPromises = users.map(user => {
            return notificationRepository.createNotification({
                userId: user.id,
                type: notificationData.type,
                message: notificationData.message,
                isRead: false,
                createdAt: new Date(),
                updatedAt: new Date()
            });
        });

        // Wait for all notifications to be created
        await Promise.all(notificationPromises);

        return NextResponse.json({ message: "Notifications sent to all users successfully" });
    } catch (error) {
        console.error("Error sending notifications:", error);
        return NextResponse.json(
            { error: "Failed to send notifications" },
            { status: 500 }
        );
    }
}
