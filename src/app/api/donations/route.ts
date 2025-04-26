// app/api/donations/route.ts
import { NextRequest, NextResponse } from "next/server";
import { getEducationRepository } from "@/repositories/donation_repository";
import { Donation } from "@/entities/donation";
import { getServerSession } from "next-auth";
import { authOptions } from "@/app/api/auth/[...nextauth]/route";
import { UserRole } from "@/entities/user";

export async function GET(req: NextRequest) {
    const session = await getServerSession(authOptions);

    if (!session || !session.user.role.includes(UserRole.ADMIN)) {
        return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const donationRepo = getEducationRepository();

    try {
        const allDonations = await donationRepo.getAllDonations();
        return NextResponse.json(allDonations, { status: 200 });
    } catch (error) {
        console.error("Failed to fetch donations:", error);
        return new NextResponse("Failed to fetch donations", { status: 500 });
    }
}

export async function POST(req: NextRequest) {
    console.log("POST /api/donations triggered.");

    const session = await getServerSession(authOptions);

    if (!session || !session.user.role.includes(UserRole.ADMIN)) {
        return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const donationRepo = getEducationRepository();

    try {
        const donationData: Donation = await req.json();
        const newDonationId = await donationRepo.createDonation(donationData);
        console.log("Created Donation ID:", newDonationId);

        return NextResponse.json({ id: newDonationId }, { status: 201 });
    } catch (err) {
        console.error("Failed to create donation:", err);
        return new NextResponse("Failed to create donation", { status: 500 });
    }
}
