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
        
        // Filter logs by userId and write operations only
        const userLogs = allLogs
            .filter(log => {
                // Only keep logs for current user
                if (log.userId !== session.user.id) return false;
                
                // Get HTTP method from status or action
                const method = log.status || log.action.split(' ')[0];
                
                // Only keep write operations
                return ['POST', 'PUT', 'PATCH'].includes(method.toUpperCase());
            })
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
