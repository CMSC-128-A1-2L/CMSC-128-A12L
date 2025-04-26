// app/api/notifications/route.ts
import { NextRequest, NextResponse } from "next/server";
import { getNotificationRepository } from "@/repositories/notifications_repository";
import { Notification } from "@/entities/notifications";
import { getServerSession } from "next-auth";
import { authOptions } from "@/app/api/auth/[...nextauth]/route";
import { UserRole } from "@/entities/user";


// Get all notifications
export async function GET(req: NextRequest) {
    const { searchParams } = req.nextUrl;
    const isRead = searchParams.get("isRead");
    const type = searchParams.get("type");
  
    const session = await getServerSession(authOptions);

    // if (!session || !session.user.role.includes(UserRole.ADMIN)) {
    //     return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    // }

    if (!session) {
        return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    try {
        const notificationRepository = getNotificationRepository();
        const notifications = await notificationRepository.getNotificationsWithFilters(
        session.user.id as string,
        isRead === "true" ? true : isRead === "false" ? false : undefined,
        type as string
        );
        return NextResponse.json(notifications, { status: 200 });
    } catch (error) {
        console.error("Error retrieving notifications:", error);
        return NextResponse.json({error: "Failed to retrieve notifications."}, {status: 500});
    }
}

// Mark all notifications as read
export async function PATCH(req: NextRequest) {
    const session = await getServerSession(authOptions);

    // if (!session || !session.user.role.includes(UserRole.ADMIN)) {
    //     return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    // }

    if (!session) {
        return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    try {
        const notificationRepository = getNotificationRepository();
        // await notificationRepository.markAllAsRead(session.user.id as string);
        return NextResponse.json({ message: "All notifications marked as read" }, { status: 200 });
    } catch (error) {
        console.error("Error marking notifications as read:", error);
        return NextResponse.json({error: "Failed to mark notifications as read."}, {status: 500});
    }
}

// Create a notification
export async function POST(req: NextRequest) {
    const session = await getServerSession(authOptions);

    if (!session || !session.user.role.includes(UserRole.ADMIN)) {
        return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    try {
        const notificationRepository = getNotificationRepository();
        const data = await req.json();
        if (!data.type || !data.message) {
            return NextResponse.json({ error: "Missing required fields" }, { status: 400 });
        }
        const notificationData = {
            ...data,
        }

        const notification = await notificationRepository.createNotification(notificationData);
        return NextResponse.json(notification, { status: 200 });
    } catch (error) {
        console.error("Error creating notification:", error);
        return NextResponse.json({error: "Failed to create new event."}, {status: 500});

    }
}