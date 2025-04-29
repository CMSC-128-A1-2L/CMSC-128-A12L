// pages/api/alumni/announcements.ts
import { NextRequest, NextResponse } from "next/server";
import { getAnnouncementRepository } from "@/repositories/announcement_repository";
import { getServerSession } from "next-auth";
import { authOptions } from "@/app/api/auth/[...nextauth]/route";
import { UserRole } from "@/entities/user";
import { Announcement } from "@/entities/announcements";
import { AnnouncementVisibility } from "@/models/announcements";

export async function GET(request: NextRequest) {
    try {
        // Check alumni authentication
        const session = await getServerSession(authOptions);
       //removed checking if user is an alumni (for now)
        const announcementRepository = getAnnouncementRepository();
        // Get announcements visible to alumni (ALUMNI or ALL visibility)
        const announcements = await announcementRepository.getAnnouncementsByVisibility([
            AnnouncementVisibility.ALUMNI,
            AnnouncementVisibility.ALL
        ]);
        
        return NextResponse.json(announcements);
    } catch (error) {
        console.error("Failed to fetch announcements:", error);
        return NextResponse.json(
            { error: "Failed to fetch announcements" },
            { status: 500 }
        );
    }
}

