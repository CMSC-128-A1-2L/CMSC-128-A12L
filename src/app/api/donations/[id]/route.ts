// app/api/donations/[id]/route.ts
import { NextRequest, NextResponse } from "next/server";
import { getEducationRepository } from "@/repositories/donation_repository";
import { Donation } from "@/entities/donation";
import { getServerSession } from "next-auth";
import { authOptions } from "@/app/api/auth/[...nextauth]/route";
import { UserRole } from "@/entities/user";

export async function GET(req: NextRequest, { params }: { params: { id: string } }) {
    const session = await getServerSession(authOptions);

    if (!session || !session.user.role.includes(UserRole.ADMIN)) {
        return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const donationRepo = getEducationRepository();

    try {
        const donation = await donationRepo.getDonationById(params.id);

        if (donation) {
        return NextResponse.json(donation, { status: 200 });
        } else {
        return NextResponse.json({ error: "Donation not found" }, { status: 404 });
        }
    } catch (err) {
        console.error("Failed to fetch donation:", err);
        return new NextResponse("Failed to fetch donation", { status: 500 });
    }
}

export async function PUT(req: NextRequest, { params }: { params: { id: string } }) {
    const session = await getServerSession(authOptions);

    if (!session || !session.user.role.includes(UserRole.ADMIN)) {
        return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const donationRepo = getEducationRepository();

    try {
        const existingDonation = await donationRepo.getDonationById(params.id);
        if (!existingDonation) {
        return NextResponse.json({ error: "Donation not found" }, { status: 404 });
        }

        const donationData: Donation = await req.json();
        donationData._id = params.id;
        await donationRepo.updateDonation(donationData);

        return NextResponse.json({ message: "Donation updated successfully" }, { status: 200 });
    } catch (err) {
        console.error("Failed to update donation:", err);
        return new NextResponse("Failed to update donation", { status: 500 });
    }
}

export async function DELETE(req: NextRequest, { params }: { params: { id: string } }) {
    const session = await getServerSession(authOptions);

    if (!session || !session.user.role.includes(UserRole.ADMIN)) {
        return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const donationRepo = getEducationRepository();

    try {
        const existingDonation = await donationRepo.getDonationById(params.id);
        if (!existingDonation) {
        return NextResponse.json({ error: "Donation not found" }, { status: 404 });
        }

        await donationRepo.deleteDonation(params.id);
        return NextResponse.json({ message: "Donation deleted successfully" }, { status: 200 });
    } catch (err) {
        console.error("Failed to delete donation:", err);
        return new NextResponse("Failed to delete donation", { status: 500 });
    }
}
