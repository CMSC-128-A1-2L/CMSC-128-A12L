import { NextRequest, NextResponse } from "next/server";
import { getOpportunityRepository } from "@/repositories/opportunity_repository";
import { getServerSession } from "next-auth";
import { authOptions } from "@/app/api/auth/[...nextauth]/route";
import { UserRole } from "@/entities/user";


// Sample opportunity for testing
const sampleOpportunity = {
    id: "opp-" + Math.random().toString(36).substr(2, 9),
    userId: "user-123",
    title: "Software Engineer Internship",
    description: "An exciting internship opportunity for aspiring software engineers. Join our dynamic team and work on cutting-edge projects using modern technologies like React, Node.js, and MongoDB. You'll gain hands-on experience in full-stack development and agile methodologies.",
    position: "Intern",
    company: "Tech Solutions Inc.",
    location: "Manila, Philippines",
    tags: ["Software", "Internship", "Engineering", "Full-stack", "Web Development"],
    workMode: "remote"
};

export async function GET(request: NextRequest) {
    try {
        // Check admin authentication
        const session = await getServerSession(authOptions);
        if (!session || !session.user.role.includes(UserRole.ADMIN)) {
            return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
        }

        const opportunityRepository = getOpportunityRepository();
        const opportunities = await opportunityRepository.getAllOpportunities();
        
        return NextResponse.json(opportunities);
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
        // Check admin authentication
        const session = await getServerSession(authOptions);
        if (!session || !session.user.role.includes(UserRole.ADMIN)) {
            return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
        }

        const opportunityRepository = getOpportunityRepository();
        const data = await request.json();

        // Validate required fields
        const requiredFields = ["title", "description", "position", "company", "location", "tags", "workMode"];
        for (const field of requiredFields) {
            if (!data[field]) {
                return NextResponse.json(
                    { error: `Missing required field: ${field}` },
                    { status: 400 }
                );
            }
        }

        // Create new opportunity with generated ID and admin's user ID
        const newOpportunity = {
            userId: session.user.id,
            ...data
        };

        await opportunityRepository.createOpportunity(newOpportunity);
        
        return NextResponse.json(
            { message: "Opportunity created successfully", opportunity: newOpportunity },
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