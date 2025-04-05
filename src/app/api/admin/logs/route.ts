import { NextRequest, NextResponse } from "next/server";
import { getLogRepository } from "@/repositories/log_repository";
import { getServerSession } from "next-auth";
import { authOptions } from "@/app/api/auth/[...nextauth]/route";
import { UserRole } from "@/entities/user";

export async function GET(request: NextRequest) {
    try {
        // Check admin authentication
        const session = await getServerSession(authOptions);
        if (!session || !session.user.role.includes(UserRole.ADMIN)) {
            return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
        }

        const logRepository = getLogRepository();
        const logs = await logRepository.getAllLogs();
        
        return NextResponse.json(logs);
    } catch (error) {
        console.error("Failed to fetch logs:", error);
        return NextResponse.json(
            { error: "Failed to fetch logs" },
            { status: 500 }
        );
    }
}

export async function POST(request: NextRequest) {
    try {
        // Check admin authentication
        const session = await getServerSession(authOptions);
        if (!session || !session.user.role.includes(UserRole.ADMIN)) {
            return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
        }

        const logRepository = getLogRepository();
        const data = await request.json();

        // Validate required fields
        const requiredFields = ["name", "action"];
        for (const field of requiredFields) {
            if (!data[field]) {
                return NextResponse.json(
                    { error: `Missing required field: ${field}` },
                    { status: 400 }
                );
            }
        }

        // Create new log with admin's user ID
        const newLog = {
            userId: session.user.id,
            ...data,
            // Set status to the HTTP method if not provided
            status: data.status || request.method
        };

        await logRepository.createLog(newLog);
        
        return NextResponse.json(
            { message: "Log created successfully", log: newLog },
            { status: 201 }
        );
    } catch (error) {
        console.error("Failed to create log:", error);
        return NextResponse.json(
            { error: "Failed to create log" },
            { status: 500 }
        );
    }
}
