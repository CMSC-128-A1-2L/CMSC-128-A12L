import { NextRequest, NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "../../auth/[...nextauth]/route";
import { getApplicationRepository } from "@/repositories/application_repository";
import { getUserRepository } from "@/repositories/user_repository";
import { getOpportunityRepository } from "@/repositories/opportunity_repository";
import { createNotification } from "@/services/notification.service";
import { ApplicationStatus } from "@/entities/application";

export async function POST(request: NextRequest) {
    const session = await getServerSession(authOptions);

    if (!session) {
        return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    try {
        const { jobId, fullName, email, phone, resume, coverLetter, portfolio } = await request.json();
        console.log("Received application data:", { jobId, fullName, email, phone, resume, coverLetter, portfolio });
        if (!jobId || !fullName || !email || !phone || !resume) {
            return NextResponse.json({ 
                error: "Missing required fields", 
                details: "jobId, fullName, email, phone, and resume are required" 
            }, { status: 400 });
        }

        // Get repositories
        const applicationRepository = getApplicationRepository();
        const opportunityRepository = getOpportunityRepository();
        const userRepository = getUserRepository();

        // Check if job exists and get job owner
        const job = await opportunityRepository.getOpportunityById(jobId);
        if (!job) {
            return NextResponse.json({ error: "Job not found" }, { status: 404 });
        }

        // Get job owner details
        const jobOwner = await userRepository.getUserById(job.userId);
        if (!jobOwner) {
            return NextResponse.json({ error: "Job owner not found" }, { status: 404 });
        }

        // Check if user has already applied
        const hasApplied = await applicationRepository.hasUserApplied(session.user.id, jobId);
        if (hasApplied) {
            return NextResponse.json({ error: "You have already applied for this job" }, { status: 400 });
        }

        // Create application
        const applicationId = await applicationRepository.createApplication({
            userId: session.user.id,
            jobId,
            fullName,
            email,
            phone,
            resumeUrl: resume,
            coverLetter,
            portfolio,
            status: ApplicationStatus.PENDING,
            appliedAt: new Date(),
            updatedAt: new Date()
        });

        // Create notification for job owner
        await createNotification({
            type: 'application',
            userId: jobOwner.id,
            entity: {
                jobId,
                applicationId,
                applicantName: fullName
            },
            customMessage: `New application from ${fullName} for "${job.title}"`,
            entityName: 'Job Application',
            action: 'created',
            sendAll: false
        });

        // Create notification for applicant
        await createNotification({
            type: 'application',
            userId: session.user.id,
            entity: {
                jobId,
                applicationId
            },
            customMessage: `Your application for "${job.title}" at ${job.company} has been submitted successfully`,
            entityName: 'Job Application',
            action: 'created',
            sendAll: false
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

// Get applications for a job or user
export async function GET(request: NextRequest) {
    const session = await getServerSession(authOptions);

    if (!session) {
        return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    try {
        const { searchParams } = request.nextUrl;
        const jobId = searchParams.get('jobId');
        const userId = searchParams.get('userId');

        const applicationRepository = getApplicationRepository();

        if (jobId) {
            // Get applications for a specific job
            // Verify the requester owns the job
            const opportunityRepository = getOpportunityRepository();
            const job = await opportunityRepository.getOpportunityById(jobId);
            
            if (!job || job.userId !== session.user.id) {
                return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
            }

            const applications = await applicationRepository.getApplicationsByJobId(jobId);
            return NextResponse.json(applications);
        } else if (userId) {
            // Get applications for a specific user
            if (userId !== session.user.id) {
                return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
            }

            const applications = await applicationRepository.getApplicationsByUserId(userId);
            return NextResponse.json(applications);
        } else {
            return NextResponse.json({ error: "Missing jobId or userId parameter" }, { status: 400 });
        }
    } catch (error) {
        console.error("Failed to fetch applications:", error);
        return NextResponse.json({ error: "Failed to fetch applications" }, { status: 500 });
    }
}