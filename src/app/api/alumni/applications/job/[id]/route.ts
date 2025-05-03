import { NextRequest, NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/app/api/auth/[...nextauth]/route";
import { UserRole } from "@/entities/user";
import { getApplicationRepository } from "@/repositories/application_repository";
import { getOpportunityRepository } from "@/repositories/opportunity_repository";
import { ApplicationStatus } from "@/entities/application";

export async function GET(request: NextRequest, { params }: { params: { id: string } }) {
    try {
        const session = await getServerSession(authOptions);
        if (!session || !session.user.role.includes(UserRole.ALUMNI)) {
            return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
        }

        const { id } = params;

        // Verify the job exists and the user owns it
        const opportunityRepository = getOpportunityRepository();
        const job = await opportunityRepository.getOpportunityById(id);
        if (!job) {
            return NextResponse.json({ error: "Job not found" }, { status: 404 });
        }

        // Only job owner can view applications
        if (job.userId !== session.user.id) {
            return NextResponse.json({ error: "Can only view applications for your own job postings" }, { status: 403 });
        }

        const applicationRepository = getApplicationRepository();
        const applications = await applicationRepository.getApplicationsByJobId(id);

        return NextResponse.json(applications);

    } catch (error) {
        console.error("Failed to fetch job applications:", error);
        return NextResponse.json({ error: "Failed to fetch job applications" }, { status: 500 });
    }
}

export async function PUT(request: NextRequest, { params }: { params: { id: string } }) {
    try {
        const session = await getServerSession(authOptions);
        if (!session || !session.user.role.includes(UserRole.ALUMNI)) {
            return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
        }

        const { id } = params;
        const { applicationId, status } = await request.json();

        if (!applicationId || !status) {
            return NextResponse.json({ error: "Application ID and status are required" }, { status: 400 });
        }

        // Verify the job exists and the user owns it
        const opportunityRepository = getOpportunityRepository();
        const job = await opportunityRepository.getOpportunityById(id);
        if (!job) {
            return NextResponse.json({ error: "Job not found" }, { status: 404 });
        }

        // Only job owner can update application status
        if (job.userId !== session.user.id) {
            return NextResponse.json({ error: "Can only update applications for your own job postings" }, { status: 403 });
        }

        // Employers can only set status to accepted or rejected
        if (![ApplicationStatus.ACCEPTED, ApplicationStatus.REJECTED].includes(status)) {
            return NextResponse.json({ error: "Invalid status update" }, { status: 400 });
        }

        const applicationRepository = getApplicationRepository();
        const application = await applicationRepository.getApplicationById(applicationId);

        if (!application) {
            return NextResponse.json({ error: "Application not found" }, { status: 404 });
        }

        if (application.jobId !== id) {
            return NextResponse.json({ error: "Application does not belong to this job" }, { status: 400 });
        }

        await applicationRepository.updateApplicationStatus(applicationId, status);

        return NextResponse.json({ message: "Application status updated successfully" });

    } catch (error) {
        console.error("Failed to update application status:", error);
        return NextResponse.json({ error: "Failed to update application status" }, { status: 500 });
    }
}