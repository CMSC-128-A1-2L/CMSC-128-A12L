// pages/api/alumni/jobPostings.ts
import { NextRequest, NextResponse } from "next/server";
import { getOpportunityRepository } from "@/repositories/opportunity_repository";
import { getServerSession } from "next-auth";
import { authOptions } from "@/app/api/auth/[...nextauth]/route";
import { UserRole } from "@/entities/user";
import { Opportunity } from "@/entities/opportunity";
export async function GET(req: NextRequest) {
  try {
    const session = await getServerSession(authOptions);
    if (!session?.user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const { searchParams } = new URL(req.url);
    const filter = searchParams.get("filter") || "all";

    const opportunityRepository = getOpportunityRepository();
    let opportunities;

    if (filter === "user") {
      opportunities = await opportunityRepository.getOpportunitiesByUserId(session.user.id);
    } else {
      opportunities = await opportunityRepository.getAllOpportunities();
    }

    return NextResponse.json(opportunities);
  } catch (error) {
    console.error("Error fetching opportunities:", error);
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
