import { NextRequest, NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/app/api/auth/[...nextauth]/route";
import { getReportRepository } from "@/repositories/report_repository";
import { UserRole } from "@/entities/user";

// Params: reportId from the URL
export async function GET(
    request: NextRequest,
    { params }: { params: { reportId: string } }
) {
    try {
        const session = await getServerSession(authOptions);
        if (!session) {
            return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
        }

        const reportRepository = getReportRepository();
        const report = await reportRepository.getReportById(params.reportId);

        if (!report) {
            return NextResponse.json({ error: "Report not found" }, { status: 404 });
        }

        // Only allow admin or the report creator to view the report
        if (
            report.userId !== session.user.id &&
            !session.user.role.includes(UserRole.ADMIN)
        ) {
            return NextResponse.json({ error: "Unauthorized" }, { status: 403 });
        }

        return NextResponse.json(report, { status: 200 });
    } catch (error) {
        console.error("Error fetching report:", error);
        return NextResponse.json(
            { error: "Failed to fetch report" },
            { status: 500 }
        );
    }
}

export async function PUT(
    request: NextRequest,
    { params }: { params: { reportId: string } }
) {
    try {
        const session = await getServerSession(authOptions);
        if (!session) {
            return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
        }

        const data = await request.json();
        const reportRepository = getReportRepository();

        const existingReport = await reportRepository.getReportById(params.reportId);
        if (!existingReport) {
            return NextResponse.json({ error: "Report not found" }, { status: 404 });
        }

        // Only allow admin or the report creator to update the report
        if (
            existingReport.userId !== session.user.id &&
            !session.user.role.includes(UserRole.ADMIN)
        ) {
            return NextResponse.json({ error: "Unauthorized" }, { status: 403 });
        }

        // Admin can update status and adminResponse
        // Regular users can only update title, description, and category
        const updateData: any = {};
        if (session.user.role.includes(UserRole.ADMIN)) {
            if (data.status) updateData.status = data.status;
            if (data.adminResponse) updateData.adminResponse = data.adminResponse;
        } else {
            if (data.title) updateData.title = data.title;
            if (data.description) updateData.description = data.description;
            if (data.category) updateData.category = data.category;
        }

        updateData.updatedAt = new Date();

        const updatedReport = await reportRepository.updateReport(
            params.reportId,
            updateData
        );

        return NextResponse.json(updatedReport, { status: 200 });
    } catch (error) {
        console.error("Error updating report:", error);
        return NextResponse.json(
            { error: "Failed to update report" },
            { status: 500 }
        );
    }
}

export async function DELETE(
    request: NextRequest,
    { params }: { params: { reportId: string } }
) {
    try {
        const session = await getServerSession(authOptions);
        if (!session || !session.user.role.includes(UserRole.ADMIN)) {
            return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
        }

        const reportRepository = getReportRepository();
        const existingReport = await reportRepository.getReportById(params.reportId);

        if (!existingReport) {
            return NextResponse.json({ error: "Report not found" }, { status: 404 });
        }

        await reportRepository.deleteReport(params.reportId);

        return NextResponse.json({ message: "Report deleted" }, { status: 200 });
    } catch (error) {
        console.error("Error deleting report:", error);
        return NextResponse.json(
            { error: "Failed to delete report" },
            { status: 500 }
        );
    }
}
