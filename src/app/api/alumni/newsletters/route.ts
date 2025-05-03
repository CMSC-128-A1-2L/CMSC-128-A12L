import { NextRequest, NextResponse } from "next/server";
import { getNewsletterRepository } from "@/repositories/newsletters_repository";
import { getServerSession } from "next-auth";
import { authOptions } from "../../auth/[...nextauth]/route";
import { UserRole } from "@/entities/user";

export async function GET(request: NextRequest) {
    try {
        const session = await getServerSession(authOptions);
        if (!session || !session.user.role.includes(UserRole.ALUMNI)) {
            return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
        }

        const newsletterRepository = getNewsletterRepository();
        const newsletters = await newsletterRepository.getAllNewsletters();
        
        return NextResponse.json(newsletters);
    
    } catch (error) {
        console.error("Failed to fetch newsletters:", error);
        return new NextResponse(
            JSON.stringify({ error: "Failed to fetch newsletters" }),
            {
                status: 500,
                headers: {
                    'Content-Type': 'application/json',
                },
            }
        );
    }
} 