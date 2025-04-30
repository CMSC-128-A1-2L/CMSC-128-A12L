// app/api/notifications/route.ts
import { NextRequest, NextResponse } from "next/server";
import { getNotificationRepository } from "@/repositories/notifications_repository";
import { Notification } from "@/entities/notifications";
import { getServerSession } from "next-auth";
import { authOptions } from "@/app/api/auth/[...nextauth]/route";
import { UserRole } from "@/entities/user";


// Get all notifications (both global and user-specific)
export async function GET(req: NextRequest) {
    const session = await getServerSession(authOptions);

    if (!session) {
        return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    try {
        const notificationRepository = getNotificationRepository();
        const notifications = await notificationRepository.getNotificationsWithFilters(session.user.id);
        
        // Sort notifications by date (newest first)
        notifications.sort((a, b) => 
            new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
        );

        return NextResponse.json(notifications);
    } catch (error) {
        console.error("Error fetching notifications:", error);
        return NextResponse.json(
            { error: "Failed to fetch notifications" },
            { status: 500 }
        );
    }
}

export async function POST(req: NextRequest) {
    const session = await getServerSession(authOptions);

    if (!session) {
        return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    try {
        const notificationRepository = getNotificationRepository();
        const body = await req.json();
        
        if (!body.userId || !body.type || !body.message) {
            return NextResponse.json({ error: "Missing required fields" }, { status: 400 });
        }

        const notification = await notificationRepository.createNotification(body);
        return NextResponse.json(notification, { status: 200 });
    } catch (error) {
        console.error("Error creating notification:", error);
        return NextResponse.json({ error: "Failed to create notification" }, { status: 500 });
    }
}

// Mark all notifications as read for a user
export async function PUT(req: NextRequest) {
    const session = await getServerSession(authOptions);

    if (!session) {
        return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    try {
        const notificationRepository = getNotificationRepository();
        await notificationRepository.markAllAsRead(session.user.id as string);
        return NextResponse.json({ message: "All notifications marked as read" });
    } catch (error) {
        console.error("Error marking all notifications as read:", error);
        return NextResponse.json(
            { error: "Failed to mark all notifications as read" },
            { status: 500 }
        );
    }
}
