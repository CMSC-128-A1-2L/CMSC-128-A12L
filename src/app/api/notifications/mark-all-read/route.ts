import { NextRequest, NextResponse } from "next/server";
import { getNotificationRepository } from "@/repositories/notifications_repository";
import { getServerSession } from "next-auth";
import { authOptions } from "@/app/api/auth/[...nextauth]/route";

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