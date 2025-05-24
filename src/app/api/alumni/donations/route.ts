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
            .map(donation => {
                let paymentMethod: PaymentMethod = donation.description?.toLowerCase().includes('maya') ? 'maya' : 'stripe';
                let statusLabel = 'Unknown';
                if (paymentMethod === 'maya') {
                    if (donation.status === 'SUCCESS') statusLabel = 'Success';
                    else if (donation.status === 'FAIL' || donation.status === 'pending') statusLabel = 'Failed';
                    else statusLabel = 'Pending';
                } else {
                    // For Stripe and others, use status if available, else Success
                    if (donation.status === 'SUCCESS') statusLabel = 'Success';
                    else if (donation.status === 'FAIL') statusLabel = 'Failed';
                    else statusLabel = 'Success';
                }
                return {
                    ...donation,
                    paymentMethod,
                    status: statusLabel,
                    createdAt: donation.receiveDate ? new Date(donation.receiveDate).toISOString() : new Date().toISOString(),
                    date: donation.receiveDate ? new Date(donation.receiveDate).toLocaleDateString() : 'N/A'
                };
            });

        return NextResponse.json(userDonations, { status: 200 });
    } catch (error) {
        console.error("Failed to fetch user donations:", error);
        return NextResponse.json({ error: "Failed to fetch donations" }, { status: 500 });
    }
}
