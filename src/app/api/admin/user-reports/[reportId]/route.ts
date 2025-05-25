import { NextRequest, NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/app/api/auth/[...nextauth]/route";
import { UserRole } from "@/entities/user";
import { getReportRepository } from "@/repositories/report_repository";

export async function PUT(request: NextRequest, { params }: { params: { reportId: string } }) {
    try {
        const session = await getServerSession(authOptions);
        if (!session || !session.user.role.includes(UserRole.ADMIN)) {
            return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
        }

        const { reportId } = params;
        if (!reportId) {
            return NextResponse.json({ error: "Report ID is required" }, { status: 400 });
        }

        const reportRepository = getReportRepository();
        const existingReport = await reportRepository.getReportById(reportId);
        if (!existingReport) {
            return NextResponse.json({ error: "Report not found" }, { status: 404 });
        }

        const data = await request.json();
        
        // Validate required fields
        if (!data.status) {
            return NextResponse.json({ error: "Status is required" }, { status: 400 });
        }

        const updatedReport = {
            ...existingReport,
            ...data,
            _id: reportId,
            updatedAt: new Date()
        };

        await reportRepository.updateReport(reportId, updatedReport);
        return NextResponse.json({ message: "Report updated successfully", report: updatedReport });

    } catch (error) {
        console.error("Failed to update report:", error);
        return NextResponse.json({ error: "Failed to update report" }, { status: 500 });
    }
}

export async function DELETE(request: NextRequest, { params }: { params: { reportId: string } }) {
    try {
        const session = await getServerSession(authOptions);
        if (!session || !session.user.role.includes(UserRole.ADMIN)) {
            return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
        }

        const { reportId } = params;
        if (!reportId) {
            return NextResponse.json({ error: "Report ID is required" }, { status: 400 });
        }

        const reportRepository = getReportRepository();
        const existingReport = await reportRepository.getReportById(reportId);
        if (!existingReport) {
            return NextResponse.json({ error: "Report not found" }, { status: 404 });
        }

        await reportRepository.deleteReport(reportId);
        return NextResponse.json({ message: "Report deleted successfully" });

    } catch (error) {
        console.error("Failed to delete report:", error);
        return NextResponse.json({ error: "Failed to delete report" }, { status: 500 });
    }
}
