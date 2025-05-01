import { NextRequest, NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/app/api/auth/[...nextauth]/route";
import { UserRole } from "@/entities/user";
import { getApplicationRepository } from "@/repositories/application_repository";
import { ApplicationStatus } from "@/entities/application";
import { getOpportunityRepository } from "@/repositories/opportunity_repository";

export async function POST(request: NextRequest) {
    try {
        const session = await getServerSession(authOptions);
        if (!session || !session.user.role.includes(UserRole.ALUMNI)) {
            return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
        }

        const data = await request.json();
        const { jobId, coverLetter, resumeUrl } = data;

        if (!jobId) {
            return NextResponse.json({ error: "Job ID is required" }, { status: 400 });
        }

        // Verify the job exists
        const opportunityRepository = getOpportunityRepository();
        const job = await opportunityRepository.getOpportunityById(jobId);
        if (!job) {
            return NextResponse.json({ error: "Job not found" }, { status: 404 });
        }

        // Check if user is trying to apply to their own job
        if (job.userId === session.user.id) {
            return NextResponse.json({ error: "Cannot apply to your own job posting" }, { status: 403 });
        }

        const applicationRepository = getApplicationRepository();

        // Check if user has already applied
        const hasApplied = await applicationRepository.hasUserApplied(session.user.id, jobId);
        if (hasApplied) {
            return NextResponse.json({ error: "You have already applied to this job" }, { status: 409 });
        }

        // Create the application
        const applicationId = await applicationRepository.createApplication({
            userId: session.user.id,
            jobId,
            status: ApplicationStatus.PENDING,
            appliedAt: new Date(),
            coverLetter,
            resumeUrl
        });

        return NextResponse.json({ 
            message: "Application submitted successfully",
            applicationId
        }, { status: 201 });

    } catch (error) {
        console.error("Failed to submit application:", error);
        return NextResponse.json({ error: "Failed to submit application" }, { status: 500 });
    }
}

export async function GET(request: NextRequest) {
    try {
        const session = await getServerSession(authOptions);
        if (!session || !session.user.role.includes(UserRole.ALUMNI)) {
            return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
        }

        const applicationRepository = getApplicationRepository();
        const applications = await applicationRepository.getApplicationsByUserId(session.user.id);

        return NextResponse.json(applications);

    } catch (error) {
        console.error("Failed to fetch applications:", error);
        return NextResponse.json({ error: "Failed to fetch applications" }, { status: 500 });
    }
}