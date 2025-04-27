import { NextRequest, NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/app/api/auth/[...nextauth]/route";
import { UserRole } from "@/entities/user";
import { getOpportunityRepository } from "@/repositories/opportunity_repository";

// Update job
export async function PUT(request: NextRequest, { params }: { params: { id: string } }) {
    try {
        const session = await getServerSession(authOptions);
        if (!session || !session.user.role.includes(UserRole.ALUMNI)) {
            return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
        }

        const { id } = params;
        const data = await request.json();
        const opportunityRepository = getOpportunityRepository();

        // Check if opportunity exists and belongs to user
        const existingOpportunity = await opportunityRepository.getOpportunityById(id);
        if (!existingOpportunity) {
            return NextResponse.json({ error: "Job not found" }, { status: 404 });
        }

        if (existingOpportunity.userId !== session.user.id) {
            return NextResponse.json({ error: "You can only edit your own job postings" }, { status: 403 });
        }

        // Update the opportunity
        const updatedOpportunity = {
            ...existingOpportunity,
            ...data,
            _id: id
        };

        await opportunityRepository.updateOpportunity(updatedOpportunity);

        return NextResponse.json({ message: "Job updated successfully" });
    } catch (error) {
        console.error("Failed to update job:", error);
        return NextResponse.json({ error: "Failed to update job" }, { status: 500 });
    }
}

// Delete job
export async function DELETE(request: NextRequest, { params }: { params: { id: string } }) {
    try {
        const session = await getServerSession(authOptions);
        if (!session || !session.user.role.includes(UserRole.ALUMNI)) {
            return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
        }

        const { id } = params;
        const opportunityRepository = getOpportunityRepository();

        // Check if opportunity exists and belongs to user
        const existingOpportunity = await opportunityRepository.getOpportunityById(id);
        if (!existingOpportunity) {
            return NextResponse.json({ error: "Job not found" }, { status: 404 });
        }

        if (existingOpportunity.userId !== session.user.id) {
            return NextResponse.json({ error: "You can only delete your own job postings" }, { status: 403 });
        }

        await opportunityRepository.deleteOpportunity(id);
        return NextResponse.json({ message: "Job deleted successfully" });
    } catch (error) {
        console.error("Failed to delete job:", error);
        return NextResponse.json({ error: "Failed to delete job" }, { status: 500 });
    }
}