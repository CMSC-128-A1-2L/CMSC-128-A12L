import { NextApiRequest, NextApiResponse } from "next/server";
import { getServerSession } from "next-auth"; 
import { authOptions } from "@/app/api/auth/[...nextauth]/route";
import { getEducationRepository } from "@/repositories/donation_repository";
import { Donation } from "@/entities/donation";
import { UserRole } from "@/entities/user";  



export async function GET(req: NextApiRequest, res: NextApiResponse) {
    const { id } = req.query;
    const session = await getServerSession(authOptions);
    //authorization check: ensure the user is authenticated and has the "ADMIN" role
    if (!session || !session.user.role.includes(UserRole.ADMIN)) {
        return res.status(401).json({ error: "Unauthorized" });
    }

    const donationRepository = getEducationRepository();

    try {
        const donation = await donationRepository.getDonationById(id as string);
        if (donation) {
            res.status(200).json(donation);
        } else {
            res.status(404).json({ error: "Donation not found" });
        }
    } catch (error) {
        res.status(500).json({ error: "Error retrieving donation" });
    }
}

export async function PUT(req: NextApiRequest, res: NextApiResponse) {
    const { id } = req.query;
    const session = await getServerSession(authOptions);

    if (!session || !session.user.role.includes(UserRole.ADMIN)) {
        return res.status(401).json({ error: "Unauthorized" });
    }

    const donationRepository = getEducationRepository();

    try {
        const existingDonation = await donationRepository.getDonationById(id as string);
        if (existingDonation) {
            const donationData: Donation = req.body;
            donationData._id = id as string;
            await donationRepository.updateDonation(donationData);
            res.status(200).json({ message: "Donation updated successfully" });
        } else {
            res.status(404).json({ error: "Donation not found" });
        }
    } catch (error) {
        res.status(500).json({ error: "Error updating donation" });
    }
}

export async function DELETE(req: NextApiRequest, res: NextApiResponse) {
    const { id } = req.query;
    const session = await getServerSession(authOptions);
    if (!session || !session.user.role.includes(UserRole.ADMIN)) {
        return res.status(401).json({ error: "Unauthorized" });
    }

    const donationRepository = getEducationRepository();

    try {
        const existingDonation = await donationRepository.getDonationById(id as string);
        if (existingDonation) {
            await donationRepository.deleteDonation(id as string);
            res.status(200).json({ message: "Donation deleted successfully" });
        } else {
            res.status(404).json({ error: "Donation not found" });
        }
    } catch (error) {
        res.status(500).json({ error: "Error deleting donation" });
    }
}
