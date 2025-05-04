import { NextRequest, NextResponse } from "next/server";
import { getNewsletterRepository } from "@/repositories/newsletters_repository";

export async function GET(
    request: NextRequest,
    { params }: { params: { id: string } }
) {
    try {
        const newsletterId = params.id;
        const newsletterRepository = getNewsletterRepository();
        const newsletter = await newsletterRepository.getNewsletterById(newsletterId);

        if (!newsletter) {
            return new NextResponse(
                JSON.stringify({ error: "Newsletter not found" }),
                {
                    status: 404,
                    headers: {
                        'Content-Type': 'application/json',
                    },
                }
            );
        }

        return NextResponse.json(newsletter);

    } catch (error) {
        console.error("Failed to fetch newsletter:", error);
        return new NextResponse(
            JSON.stringify({ error: "Failed to fetch newsletter" }),
            {
                status: 500,
                headers: {
                    'Content-Type': 'application/json',
                },
            }
        );
    }
}