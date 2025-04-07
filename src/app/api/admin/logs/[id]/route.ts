import { NextRequest, NextResponse } from "next/server";
import { getLogRepository } from "@/repositories/log_repository";
import { getServerSession } from "next-auth";
import { authOptions } from "@/app/api/auth/[...nextauth]/route";
import { UserRole } from "@/entities/user";

export async function GET(
    request: NextRequest,
    { params }: { params: { id: string } }
) {
    try {
        // Check admin authentication
        const session = await getServerSession(authOptions);
        if (!session || !session.user.role.includes(UserRole.ADMIN)) {
            return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
        }

        const logRepository = getLogRepository();
        const log = await logRepository.getLogById(params.id);
        
        if (!log) {
            return NextResponse.json(
                { error: "Log not found" },
                { status: 404 }
            );
        }
        
        return NextResponse.json(log);
    } catch (error) {
        console.error("Failed to fetch log:", error);
        return NextResponse.json(
            { error: "Failed to fetch log" },
            { status: 500 }
        );
    }
}

export async function PUT(
    request: NextRequest,
    { params }: { params: { id: string } }
) {
    try {
        // Check admin authentication
        const session = await getServerSession(authOptions);
        if (!session || !session.user.role.includes(UserRole.ADMIN)) {
            return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
        }

        const logRepository = getLogRepository();
        const data = await request.json();
        
        // Get existing log
        const existingLog = await logRepository.getLogById(params.id);
        if (!existingLog) {
            return NextResponse.json(
                { error: "Log not found" },
                { status: 404 }
            );
        }
        
        // Update log
        const updatedLog = {
            ...existingLog,
            ...data,
            _id: params.id
        };
        
        await logRepository.updateLog(updatedLog);
        
        return NextResponse.json(
            { message: "Log updated successfully", log: updatedLog },
            { status: 200 }
        );
    } catch (error) {
        console.error("Failed to update log:", error);
        return NextResponse.json(
            { error: "Failed to update log" },
            { status: 500 }
        );
    }
}

export async function DELETE(
    request: NextRequest,
    { params }: { params: { id: string } }
) {
    try {
        // Check admin authentication
        const session = await getServerSession(authOptions);
        if (!session || !session.user.role.includes(UserRole.ADMIN)) {
            return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
        }

        const logRepository = getLogRepository();
        
        // Check if log exists
        const existingLog = await logRepository.getLogById(params.id);
        if (!existingLog) {
            return NextResponse.json(
                { error: "Log not found" },
                { status: 404 }
            );
        }
        
        // Delete log
        await logRepository.deleteLog(params.id);
        
        return NextResponse.json(
            { message: "Log deleted successfully" },
            { status: 200 }
        );
    } catch (error) {
        console.error("Failed to delete log:", error);
        return NextResponse.json(
            { error: "Failed to delete log" },
            { status: 500 }
        );
    }
} 