import { NextRequest, NextResponse } from "next/server";
import { getLogRepository } from "@/repositories/log_repository";
import { getServerSession } from "next-auth";
import { authOptions } from "@/app/api/auth/[...nextauth]/route";

export async function GET(request: NextRequest) {
    try {
        const session = await getServerSession(authOptions);
        if (!session?.user?.id) {
            return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
        }

        const { searchParams } = new URL(request.url);
        const limit = parseInt(searchParams.get('limit') || '3');

        const logRepository = getLogRepository();
        const allLogs = await logRepository.getAllLogs();
        
        // Filter logs by userId and sort by timestamp descending
        const userLogs = allLogs
            .filter(log => log.userId === session.user.id)
            .sort((a, b) => new Date(b.timestamp).getTime() - new Date(a.timestamp).getTime())
            .slice(0, limit);

        return NextResponse.json(userLogs);
    } catch (error) {
        console.error("Failed to fetch user logs:", error);
        return NextResponse.json(
            { error: "Failed to fetch user logs" },
            { status: 500 }
        );
    }
}
