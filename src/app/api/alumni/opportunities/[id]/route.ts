import { NextRequest, NextResponse } from "next/server";
import { getOpportunityRepository } from "@/repositories/opportunity_repository";
import { getServerSession } from "next-auth";
import { authOptions } from "@/app/api/auth/[...nextauth]/route";
import { UserRole } from "@/entities/user";
import { Opportunity } from "@/entities/opportunity";

export async function GET(
    request: NextRequest,
    { params }: { params: { id: string } }
) {
    const { id: opportunityId } = params;
    try {
        // Check alumni authentication
        const session = await getServerSession(authOptions);
        if (!session || !session.user.role.includes(UserRole.ALUMNI)) {
            return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
        }

        const opportunityRepository = getOpportunityRepository();
        const opportunity = await opportunityRepository.getOpportunityById(opportunityId);

        if (!opportunity) {
            return NextResponse.json(
                { error: "Opportunity not found" },
                { status: 404 }
            );
        }

        return NextResponse.json(opportunity);
    } catch (error) {
        console.error("Failed to fetch opportunity:", error);
        return NextResponse.json(
            { error: "Failed to fetch opportunity" },
            { status: 500 }
        );
    }
}

export async function PUT(
    request: NextRequest,
    { params }: { params: { id: string } }
) {
    const { id: opportunityId } = params;

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

        // Check if opportunity exists and belongs to the user
        const existingOpportunity = await opportunityRepository.getOpportunityById(opportunityId);
        if (!existingOpportunity) {
            return NextResponse.json(
                { error: "Opportunity not found" },
                { status: 404 }
            );
        }

        if (existingOpportunity.userId !== session.user.id) {
            return NextResponse.json(
                { error: "You can only update your own opportunities" },
                { status: 403 }
            );
        }

        // Update opportunity
        const updatedOpportunity: Opportunity = {
            ...existingOpportunity,
            ...data,
            id: opportunityId // Ensure ID remains unchanged
        };

        await opportunityRepository.updateOpportunity(updatedOpportunity);

        return NextResponse.json({
            message: "Opportunity updated successfully",
            opportunity: updatedOpportunity
        });
    } catch (error) {
        console.error("Failed to update opportunity:", error);
        return NextResponse.json(
            { error: "Failed to update opportunity" },
            { status: 500 }
        );
    }
}

export async function DELETE(
    request: NextRequest,
    { params }: { params: { id: string } }
) {
    const { id: opportunityId } = params;

    try {
        // Check alumni authentication
        const session = await getServerSession(authOptions);
        if (!session || !session.user.role.includes(UserRole.ALUMNI)) {
            return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
        }

        const opportunityRepository = getOpportunityRepository();

        // Check if opportunity exists and belongs to the user
        const existingOpportunity = await opportunityRepository.getOpportunityById(opportunityId);
        if (!existingOpportunity) {
            return NextResponse.json(
                { error: "Opportunity not found" },
                { status: 404 }
            );
        }

        if (existingOpportunity.userId !== session.user.id) {
            return NextResponse.json(
                { error: "You can only delete your own opportunities" },
                { status: 403 }
            );
        }

        await opportunityRepository.deleteOpportunity(opportunityId);

        return NextResponse.json({
            message: "Opportunity deleted successfully"
        });
    } catch (error) {
        console.error("Failed to delete opportunity:", error);
        return NextResponse.json(
            { error: "Failed to delete opportunity" },
            { status: 500 }
        );
    }
} 