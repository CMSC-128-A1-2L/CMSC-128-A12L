import { NextRequest, NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/app/api/auth/[...nextauth]/route";
import { getEducationRepository } from "@/repositories/donation_repository";
import { UserRole } from "@/entities/user";

export async function GET(req: NextRequest) {
    const session = await getServerSession(authOptions);

    if (!session?.user?.id) {
        return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    // Check if user is admin
    if (!session.user.role.includes(UserRole.ADMIN)) {
        return NextResponse.json({ error: "Forbidden" }, { status: 403 });
    }

    const donationRepo = getEducationRepository();

    try {
        const allDonations = await donationRepo.getAllDonations();
        
        // Calculate statistics
        const totalDonations = allDonations.reduce((sum, donation) => sum + donation.monetaryValue, 0);
        const uniqueDonors = new Set(allDonations.map(d => d.donorID[0])).size;
        const averageDonation = totalDonations / allDonations.length || 0;
        
        // Get current month's donations
        const currentMonth = new Date().getMonth();
        const monthlyDonations = allDonations
            .filter(donation => new Date(donation.receiveDate || new Date()).getMonth() === currentMonth)
            .reduce((sum, donation) => sum + donation.monetaryValue, 0);

        return NextResponse.json({
            totalDonations,
            totalDonors: uniqueDonors,
            averageDonation,
            monthlyDonations
        }, { status: 200 });
    } catch (error) {
        console.error("Failed to fetch donation statistics:", error);
        return NextResponse.json({ error: "Failed to fetch statistics" }, { status: 500 });
    }
} 