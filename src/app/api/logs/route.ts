import { NextRequest, NextResponse } from "next/server";
import { getLogRepository } from "@/repositories/log_repository";
import { getServerSession } from "next-auth";
import { authOptions } from "@/app/api/auth/[...nextauth]/route";

export async function POST(request: NextRequest) {
    try {
        // Get the current session (if any)
        const session = await getServerSession(authOptions);
        
        const logRepository = getLogRepository();
        const data = await request.json();

        // Validate required fields
        const requiredFields = ["name", "action", "status"];
        for (const field of requiredFields) {
            if (!data[field]) {
                console.error("Missing required field: ", field)
                return NextResponse.json(
                    { error: `Missing required field: ${field}` },
                    { status: 400 }
                );
            }
        }


        // Create new log with user ID if available
        const newLog = {
            imageUrl: data.imageUrl || "",
            ipAddress: data.ipAddress || "",
            timestamp: data.timestamp || new Date(),
            ...data,
        };

        await logRepository.createLog(newLog);
        
        return NextResponse.json(
            { message: "Log created successfully" },
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