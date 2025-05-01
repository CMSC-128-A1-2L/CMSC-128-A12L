import { NextRequest, NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/app/api/auth/[...nextauth]/route";
import { getEducationRepository } from "@/repositories/donation_repository";
import { UserRole } from "@/entities/user";

type PaymentMethod = 'stripe' | 'maya';

export async function GET(req: NextRequest) {
    const session = await getServerSession(authOptions);

    if (!session?.user?.id) {
        return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    
    const donationRepo = getEducationRepository();

    try {
        const allDonations = await donationRepo.getAllDonations();
        const userDonations = allDonations
            .filter(donation => donation.donorID.includes(session.user.id))
            .map(donation => ({
                ...donation,
                paymentMethod: donation.description?.toLowerCase().includes('maya') 
                    ? 'maya' as PaymentMethod 
                    : 'stripe' as PaymentMethod
            }));
        
        return NextResponse.json(userDonations, { status: 200 });
    } catch (error) {
        console.error("Failed to fetch user donations:", error);
        return NextResponse.json({ error: "Failed to fetch donations" }, { status: 500 });
    }
}
