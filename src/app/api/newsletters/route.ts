import { NextRequest, NextResponse } from "next/server";
import { getNewsletterRepository } from "@/repositories/newsletters_repository";

export async function GET(request: NextRequest) {
    try {
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