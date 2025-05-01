import { NextRequest, NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/app/api/auth/[...nextauth]/route";
import { UserRole } from "@/entities/user";
import { getApplicationRepository } from "@/repositories/application_repository";
import { ApplicationStatus } from "@/entities/application";

export async function PUT(request: NextRequest, { params }: { params: { id: string } }) {
    try {
        const session = await getServerSession(authOptions);
        if (!session || !session.user.role.includes(UserRole.ALUMNI)) {
            return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
        }

        const { id } = params;
        const { status } = await request.json();

        const applicationRepository = getApplicationRepository();
        const application = await applicationRepository.getApplicationById(id);

        if (!application) {
            return NextResponse.json({ error: "Application not found" }, { status: 404 });
        }

        // Only allow the applicant to withdraw their application
        if (application.userId !== session.user.id) {
            return NextResponse.json({ error: "Can only modify your own applications" }, { status: 403 });
        }

        // Users can only set their applications to withdrawn
        if (status !== ApplicationStatus.WITHDRAWN) {
            return NextResponse.json({ error: "Invalid status update" }, { status: 400 });
        }

        await applicationRepository.updateApplicationStatus(id, status);

        return NextResponse.json({ message: "Application updated successfully" });

    } catch (error) {
        console.error("Failed to update application:", error);
        return NextResponse.json({ error: "Failed to update application" }, { status: 500 });
    }
}

export async function DELETE(request: NextRequest, { params }: { params: { id: string } }) {
    try {
        const session = await getServerSession(authOptions);
        if (!session || !session.user.role.includes(UserRole.ALUMNI)) {
            return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
        }

        const { id } = params;
        const applicationRepository = getApplicationRepository();
        const application = await applicationRepository.getApplicationById(id);

        if (!application) {
            return NextResponse.json({ error: "Application not found" }, { status: 404 });
        }

        if (application.userId !== session.user.id) {
            return NextResponse.json({ error: "Can only delete your own applications" }, { status: 403 });
        }

        await applicationRepository.deleteApplication(id);

        return NextResponse.json({ message: "Application deleted successfully" });

    } catch (error) {
        console.error("Failed to delete application:", error);
        return NextResponse.json({ error: "Failed to delete application" }, { status: 500 });
    }
}