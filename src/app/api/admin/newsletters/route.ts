import { NextRequest, NextResponse } from "next/server";
import { getNewsletterRepository } from "@/repositories/newsletters_repository";
import { Newsletter } from "@/entities/newsletters";
import { getServerSession } from "next-auth";
import { authOptions } from "../../auth/[...nextauth]/route";
import { UserRole } from "@/entities/user";

export async function POST(request: NextRequest) {
    try {
        // Check admin authentication
        const session = await getServerSession(authOptions);
        if (!session || !session.user.role.includes(UserRole.ADMIN)) {
            return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
        }

        const newsletterRepository = getNewsletterRepository();
        const data = await request.json();

        // Validate required fields
        const requiredFields = ["title", "content"];
        for (const field of requiredFields) {
            if (!data[field]) {
                return NextResponse.json(
                    { error: `Missing required field: ${field}` },
                    { status: 400 }
                );
            }
        }

        // Create new newsletter with admin's user ID as author
        const newNewsletter: Newsletter = {
            title: data.title,
            content: data.content,
            authorId: session.user.id,
            publishDate: new Date(),
            isPinned: data.isPinned || false,
            thumbnail: data.thumbnail || undefined,
            attachments: data.attachments || [],
            tags: data.tags, // Ensure tags are included with default empty string
        };

        console.log("The news letter received is: ", newNewsletter);
        const id = await newsletterRepository.createNewsletter(newNewsletter);
        
        return NextResponse.json(
            { message: "Newsletter created successfully", id },
            { status: 201 }
        );
    } catch (error) {
        console.error("Failed to create newsletter:", error);
        return NextResponse.json(
            { error: "Failed to create newsletter" },
            { status: 500 }
        );
    }
}

export async function GET(request: NextRequest) {
    try {
        const session = await getServerSession(authOptions);
        if (!session || !session.user.role.includes(UserRole.ADMIN)) {
            return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
        }

        const newsletterRepository = getNewsletterRepository();
        const newsletters = await newsletterRepository.getAllNewsletters();
        return NextResponse.json(newsletters);
    } catch (error) {
        console.error("Failed to fetch newsletters:", error);
        return NextResponse.json(
            { error: "Failed to fetch newsletters" },
            { status: 500 }
        );
    }
}