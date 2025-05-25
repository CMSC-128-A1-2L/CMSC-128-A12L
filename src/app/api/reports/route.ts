import { NextRequest, NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/app/api/auth/[...nextauth]/route";
import { getReportRepository } from "@/repositories/report_repository";
import { UserRole } from "@/entities/user";

export async function POST(request: NextRequest) {
    try {
        const session = await getServerSession(authOptions);
        if (!session) {
            return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
        }

        const data = await request.json();
        const reportRepository = getReportRepository();

        // Validate required fields
        const requiredFields = ["title", "description", "category"];
        for (const field of requiredFields) {
            if (!data[field]) {
                return NextResponse.json(
                    { error: `Missing required field: ${field}` },
                    { status: 400 }
                );
            }
        }

        // Create the report
        const report = await reportRepository.createReport({
            ...data,
            userId: session.user.id,
            status: "pending",
            createdAt: new Date(),
            updatedAt: new Date()
        });

        return NextResponse.json(report, { status: 201 });
    } catch (error) {
        console.error("Error creating report:", error);
        return NextResponse.json(
            { error: "Failed to create report" },
            { status: 500 }
        );
    }
}

export async function GET(request: NextRequest) {
    try {
        const session = await getServerSession(authOptions);
        if (!session) {
            return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
        }

        const reportRepository = getReportRepository();
        const reports = await reportRepository.getReportsByUserId(session.user.id);

        return NextResponse.json(reports, { status: 200 });
    } catch (error) {
        console.error("Error fetching reports:", error);
        return NextResponse.json(
            { error: "Failed to fetch reports" },
            { status: 500 }
        );
    }
}
