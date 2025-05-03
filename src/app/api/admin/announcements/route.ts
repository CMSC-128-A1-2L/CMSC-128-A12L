// pages/api/admin/announcements.ts
import { NextRequest, NextResponse } from "next/server";
import { getAnnouncementRepository } from "@/repositories/announcement_repository";
import { getServerSession } from "next-auth";
import { authOptions } from "@/app/api/auth/[...nextauth]/route";
import { UserRole } from "@/entities/user";
import { Announcement } from "@/entities/announcements"
import { AnnouncementVisibility } from "@/models/announcements";

export async function GET(request: NextRequest) {
    try {
        // Check admin authentication
        const session = await getServerSession(authOptions);
        if (!session || !session.user.role.includes(UserRole.ADMIN)) {
            return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
        }

        const announcementRepository = getAnnouncementRepository();
        // Admins can see ALL announcements regardless of visibility
        const announcements = await announcementRepository.getAllAnnouncements();
        
        return NextResponse.json(announcements);
    } catch (error) {
        console.error("Failed to fetch announcements:", error);
        return NextResponse.json(
            { error: "Failed to fetch announcements" },
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

        const announcementRepository = getAnnouncementRepository();
        const data = await request.json();

        // Validate required fields
        const requiredFields = ["title", "content", "visibility"];
        for (const field of requiredFields) {
            if (!data[field]) {
                return NextResponse.json(
                    { error: `Missing required field: ${field}` },
                    { status: 400 }
                );
            }
        }

        // Create new announcement with admin's user ID as author
        const newAnnouncement = {
            title: data.title,
            content: data.content,
            authorId: session.user.id,
            publishDate: new Date(),
            visibility: data.visibility,
            isPinned: data.isPinned || false,
            attachments: data.attachments || []
        };

        const id = await announcementRepository.createAnnouncement(newAnnouncement);
        
        return NextResponse.json(
            { ...newAnnouncement, _id: id },
            { status: 201 }
        );
    } catch (error) {
        console.error("Failed to create announcement:", error);
        return NextResponse.json(
            { error: "Failed to create announcement" },
            { status: 500 }
        );
    }
}

export async function PUT(request: NextRequest) {
    try {
        // Check admin authentication
        const session = await getServerSession(authOptions);
        if (!session || !session.user.role.includes(UserRole.ADMIN)) {
            return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
        }

        const announcementRepository = getAnnouncementRepository();
        const data = await request.json();

        // Validate required fields for update
        const requiredFields = ["_id", "title", "content", "visibility"];
        for (const field of requiredFields) {
            if (!data[field]) {
                return NextResponse.json(
                    { error: `Missing required field: ${field}` },
                    { status: 400 }
                );
            }
        }

        // Verify if announcement exists
        const existingAnnouncement = await announcementRepository.getAnnouncementById(data._id);
        if (!existingAnnouncement) {
            return NextResponse.json(
                { error: "Announcement not found" },
                { status: 404 }
            );
        }

        // Update announcement (admins can modify any announcement regardless of original visibility)
        const updatedAnnouncement = {
            ...existingAnnouncement,
            title: data.title,
            content: data.content,
            visibility: data.visibility,
            isPinned: data.isPinned || false,
            attachments: data.attachments || []
        };

        await announcementRepository.updateAnnouncement(updatedAnnouncement);
        
        return NextResponse.json(updatedAnnouncement);
    } catch (error) {
        console.error("Failed to update announcement:", error);
        return NextResponse.json(
            { error: "Failed to update announcement" },
            { status: 500 }
        );
    }
}

export async function DELETE(request: NextRequest) {
    try {
        // Check admin authentication
        const session = await getServerSession(authOptions);
        if (!session || !session.user.role.includes(UserRole.ADMIN)) {
            return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
        }

        const { searchParams } = new URL(request.url);
        const id = searchParams.get("id");
        
        if (!id) {
            return NextResponse.json(
                { error: "Missing announcement ID" },
                { status: 400 }
            );
        }

        const announcementRepository = getAnnouncementRepository();
        
        // Admins can delete any announcement regardless of visibility
        await announcementRepository.deleteAnnouncement(id);
        
        return NextResponse.json(
            { success: true },
            { status: 200 }
        );
    } catch (error) {
        console.error("Failed to delete announcement:", error);
        return NextResponse.json(
            { error: "Failed to delete announcement" },
            { status: 500 }
        );
    }
}