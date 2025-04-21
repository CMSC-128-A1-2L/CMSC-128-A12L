import { NextApiRequest, NextApiResponse } from "next/server";
import { getServerSession } from "next-auth"; 
import { authOptions } from "@/app/api/auth/[...nextauth]/route";
import { getEducationRepository } from "@/repositories/donation_repository";
import { Donation } from "@/entities/donation";
import { UserRole } from "@/entities/user";  


const donationRepository = getEducationRepository();

export async function GET(req: NextApiRequest, res: NextApiResponse) {
    const session = await getServerSession(authOptions);
    if (!session || !session.user.role.includes(UserRole.ADMIN)) {
        return res.status(401).json({ error: "Unauthorized" });
    }

    try {
        const donations = await donationRepository.getAllDonations();
        res.status(200).json(donations);
    } catch (error) {
        res.status(500).json({ error: "Error retrieving donations" });
    }
}

export async function POST(req: NextApiRequest, res: NextApiResponse) {
    const session = await getServerSession(authOptions);
    if (!session || !session.user.role.includes(UserRole.ADMIN)) {
        return res.status(401).json({ error: "Unauthorized" });
    }

    try {
        const donationData: Donation = req.body;
        const donationId = await donationRepository.createDonation(donationData);
        res.status(201).json({ message: "Donation created successfully", id: donationId });
    } catch (error) {
        res.status(500).json({ error: "Error creating donation" });
    }
}
