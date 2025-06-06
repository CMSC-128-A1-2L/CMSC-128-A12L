// app/api/notifications/[id]/route.ts
import { NextRequest, NextResponse } from "next/server";
import { getNotificationRepository } from "@/repositories/notifications_repository";
import { getServerSession } from "next-auth";
import { authOptions } from "@/app/api/auth/[...nextauth]/route";
import { UserRole } from "@/entities/user";

// Fetch a specific notification by ID
export async function GET(req: NextRequest) {
    const { searchParams } = req.nextUrl;
    const id = searchParams.get('id');  // Use `.get()` to retrieve 'id'

    if (!id) {
        return NextResponse.json({ error: "Notification ID is required" }, { status: 400 });
    }
    const session = await getServerSession(authOptions);

    // if (!session || !session.user.role.includes(UserRole.ADMIN)) { //uncomment this line to restrict access to admin users only
    //     return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    // }

    if (!session) {
        return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    try {
        const notificationRepository = getNotificationRepository();
        const notifications = await notificationRepository.getNotificationsWithFilters(session.user.id as string);

        const notification = notifications.find((notification) => notification._id === id);
        
        if (!notification) {
            return NextResponse.json({ error: "Notification not found" }, { status: 404 });
        }

        return NextResponse.json(notification, { status: 200 });
    } catch (error) {
        console.error("Error retrieving notification:", error);
        return new NextResponse("Error retrieving notification", { status: 500 });
    }
}

// Mark a specific notification as read
export async function PATCH(
    req: NextRequest,
    { params }: { params: { id: string } }
) {
    const id = params.id;

    if (!id) {
        return NextResponse.json({ error: "Notification ID is required" }, { status: 400 });
    }

    const session = await getServerSession(authOptions);

    if (!session) {
        return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    try {
        const notificationRepository = getNotificationRepository();
        const body = await req.json();
        
        if (body.isRead) {
            await notificationRepository.markAsRead(id);
        } else {
            await notificationRepository.markAsUnread(id);
        }
        
        return NextResponse.json({ 
            message: `Notification marked as ${body.isRead ? 'read' : 'unread'}` 
        });
    } catch (error) {
        console.error("Error updating notification read status:", error);
        return NextResponse.json(
            { error: "Failed to update notification status" },
            { status: 500 }
        );
    }
}

// Delete a specific notification
export async function DELETE(
    req: NextRequest,
    { params }: { params: { id: string } }
) {
    const id = params.id;

    if (!id) {
        return NextResponse.json({ error: "Notification ID is required" }, { status: 400 });
    }

    const session = await getServerSession(authOptions);

    if (!session) {
        return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    try {
        const notificationRepository = getNotificationRepository();
        await notificationRepository.deleteNotificationById(id);
        return NextResponse.json({ message: "Notification deleted successfully" });
    } catch (error) {
        console.error("Error deleting notification:", error);
        return NextResponse.json(
            { error: "Failed to delete notification" },
            { status: 500 }
        );
    }
}
