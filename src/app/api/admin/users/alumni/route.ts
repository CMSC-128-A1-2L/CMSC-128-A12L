import { NextRequest, NextResponse } from "next/server";
import { getUserRepository } from "@/repositories/user_repository";
import { getServerSession } from "next-auth";
import { UserRole } from "@/entities/user";
import { authOptions } from "@/app/api/auth/[...nextauth]/route";

export async function GET(req: NextRequest) {
    try {
        // Check if user is authenticated and is an admin
        const session = await getServerSession(authOptions);
        if (!session?.user) {
            return NextResponse.json(
                { error: "Unauthorized" },
                { status: 401 }
            );
        }

        const userRepository = getUserRepository();
        const user = await userRepository.getUserByEmail(session.user.email!);
        
        if (!user || !user.role.includes(UserRole.ADMIN)) {
            return NextResponse.json(
                { error: "Forbidden" },
                { status: 403 }
            );
        }

        // Get all alumni
        const alumni = await userRepository.getAllAlumni();
        
        return NextResponse.json(alumni);
    } catch (error) {
        console.error("Error fetching alumni:", error);
        return NextResponse.json(
            { error: "Failed to fetch alumni" },
            { status: 500 }
        );
    }
} 