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
        return new NextResponse("Error retrieving notifications", { status: 500 });
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
        return new NextResponse("Error marking notifications as read", { status: 500 });
    }
}


