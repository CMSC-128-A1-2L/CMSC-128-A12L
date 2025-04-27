// pages/api/alumni/jobPostings.ts
import { NextRequest, NextResponse } from "next/server";
import { getOpportunityRepository } from "@/repositories/opportunity_repository";
import { getServerSession } from "next-auth";
import { authOptions } from "@/app/api/auth/[...nextauth]/route";
import { UserRole } from "@/entities/user";
import { Opportunity } from "@/entities/opportunity";

export async function GET(request: NextRequest) {
    try {
        const session = await getServerSession(authOptions);
        if (!session || !session.user.role.includes(UserRole.ALUMNI)) {
            return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
        }

        // Get filter from URL params
        const { searchParams } = new URL(request.url);
        const filter = searchParams.get('filter');
        
        const opportunityRepository = getOpportunityRepository();

        if (filter === 'user') {
            // Get only user's opportunities
            const opportunities = await opportunityRepository.getOpportunitiesByUserId(session.user.id);
            return NextResponse.json(opportunities);
        } else {
            // Get all opportunities
            const opportunities = await opportunityRepository.getAllOpportunities();
            return NextResponse.json(opportunities);
        }
    } catch (error) {
        console.error("Failed to fetch opportunities:", error);
        return NextResponse.json(
            { error: "Failed to fetch opportunities" },
            { status: 500 }
        );
    }
}

export async function POST(request: NextRequest) {
    try {
        // Check alumni authentication
        const session = await getServerSession(authOptions);
        if (!session || !session.user.role.includes(UserRole.ALUMNI)) {
            return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
        }

        const opportunityRepository = getOpportunityRepository();
        const data = await request.json();

        // Validate required fields
        const requiredFields = ["title", "description", "position", "company", "location", "workMode"];
        for (const field of requiredFields) {
            if (!data[field]) {
                return NextResponse.json(
                    { error: `Missing required field: ${field}` },
                    { status: 400 }
                );
            }
        }

        // Create new opportunity with alumni's user ID
        const newOpportunity: Opportunity = {
            userId: session.user.id,
            ...data,
            tags: data.tags || []
        };

        const id = await opportunityRepository.createOpportunity(newOpportunity);
        
        return NextResponse.json(
            { ...newOpportunity, _id: id },
            { status: 201 }
        );
    } catch (error) {
        console.error("Failed to create opportunity:", error);
        return NextResponse.json(
            { error: "Failed to create opportunity" },
            { status: 500 }
        );
    }
}
