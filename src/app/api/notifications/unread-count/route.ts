import { NextRequest } from "next/server";
import { getServerSession } from "next-auth";
import { NextResponse } from "next/server";
import { authOptions } from "../../auth/[...nextauth]/route";
import { getNotificationRepository } from "@/repositories/notifications_repository";

export async function GET() {
    try {
        const session = await getServerSession(authOptions);
        
        if (!session?.user?.email) {
            return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
        }

        const notificationRepository = getNotificationRepository();
        const notifications = await notificationRepository.getNotificationsWithFilters(session.user.id);
        
        // Count unread notifications
        const unreadCount = notifications.filter(notification => !notification.isRead).length;

        return NextResponse.json({ unreadCount });
    } catch (error) {
        console.error('Error fetching unread notifications count:', error);
        return NextResponse.json(
            { error: 'Failed to fetch unread notifications count' },
            { status: 500 }
        );
    }
} 