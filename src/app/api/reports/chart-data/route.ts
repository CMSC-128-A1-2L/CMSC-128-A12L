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
        
        // Group donations by month
        const monthlyData = allDonations.reduce((acc: { [key: string]: { amount: number; donors: Set<string> } }, donation) => {
            const date = new Date(donation.receiveDate || new Date());
            const monthKey = date.toLocaleString('default', { month: 'short' });
            
            if (!acc[monthKey]) {
                acc[monthKey] = { amount: 0, donors: new Set() };
            }
            
            acc[monthKey].amount += donation.monetaryValue;
            acc[monthKey].donors.add(donation.donorID[0]);
            
            return acc;
        }, {});

        // Convert to array format for charts
        const chartData = Object.entries(monthlyData).map(([date, data]) => ({
            date,
            amount: data.amount,
            donors: data.donors.size
        }));

        return NextResponse.json(chartData, { status: 200 });
    } catch (error) {
        console.error("Failed to fetch chart data:", error);
        return NextResponse.json({ error: "Failed to fetch chart data" }, { status: 500 });
    }
} 