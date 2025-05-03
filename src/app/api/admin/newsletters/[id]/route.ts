import { NextResponse } from 'next/server';
import { getNewsletterRepository } from '@/repositories/newsletters_repository';
import { getServerSession } from 'next-auth';
import { authOptions } from '../../../auth/[...nextauth]/route';
import { NextRequest } from "next/server";
import { UserRole } from "@/entities/user";
import { Newsletter } from "@/entities/newsletters";

export async function DELETE(
    request: Request,
    { params }: { params: { id: string } }
) {
    try {
        const session = await getServerSession(authOptions);
        
        if (!session?.user?.id) {
            return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
        }

        const { id } = params;
        const repository = getNewsletterRepository();
        await repository.deleteNewsletter(id);

        return NextResponse.json({ message: 'Newsletter deleted successfully' }, { status: 200 });
    } catch (error) {
        console.error('Error deleting newsletter:', error);
        return NextResponse.json(
            { error: 'Failed to delete newsletter' },
            { status: 500 }
        );
    }
}

// You can also add GET for fetching a single newsletter if needed
export async function GET(
    request: Request,
    { params }: { params: { id: string } }
) {
    try {
        const { id } = await params;
        const repository = getNewsletterRepository();
        const newsletter = await repository.getNewsletterById(id);

        if (!newsletter) {
            return NextResponse.json({ error: 'Newsletter not found' }, { status: 404 });
        }

        return NextResponse.json(newsletter);
    } catch (error) {
        console.error('Error fetching newsletter:', error);
        return NextResponse.json(
            { error: 'Failed to fetch newsletter' },
            { status: 500 }
        );
    }
}

export async function PUT(request: NextRequest, { params }: { params: { id: string } }) {
    try {
        // Check admin authentication
        const session = await getServerSession(authOptions);
        if (!session || !session.user.role.includes(UserRole.ADMIN)) {
            return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
        }

        const newsletterRepository = getNewsletterRepository();
        const { id } = params;
        const data = await request.json();
        console.log("Received data for update:", data);
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

        // Check if newsletter exists
        const existingNewsletter = await newsletterRepository.getNewsletterById(id);
        if (!existingNewsletter) {
            return NextResponse.json(
                { error: "Newsletter not found" },
                { status: 404 }
            );
        }

        // Prepare updated newsletter with all fields
        const updatedNewsletter: Newsletter = {
            ...existingNewsletter,
            title: data.title,
            content: data.content,
            tags: data.tags || '', // Ensure tags are included
            isPinned: data.isPinned || false,
            thumbnail: data.thumbnail || undefined,
            attachments: data.attachments || [],
            updatedAt: new Date()
        };

        // Update the newsletter
        await newsletterRepository.updateNewsletter(updatedNewsletter);

        return NextResponse.json({
            message: "Newsletter updated successfully",
            newsletter: updatedNewsletter
        });
    } catch (error) {
        console.error("Failed to update newsletter:", error);
        return NextResponse.json(
            { error: "Failed to update newsletter" },
            { status: 500 }
        );
    }
}