import { NextRequest, NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/app/api/auth/[...nextauth]/route";
import { UserRole } from "@/entities/user";
import { getEventRepository } from "@/repositories/event_repository";
import { getEducationRepository } from "@/repositories/donation_repository";
import { Donation } from "@/entities/donation";

export async function POST(request: NextRequest, { params }: { params: { id: string } }) {
    try {
        const session = await getServerSession(authOptions);
        if (!session || !session.user.role.includes(UserRole.ALUMNI)) {
            return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
        }

        const { id: eventId } = params;
        const data = await request.json();
        
        // Validate request data
        if (!data.sponsorshipType || !data.name || !data.email || !data.contactNo) {
            return NextResponse.json(
                { error: "Missing required fields" },
                { status: 400 }
            );
        }

        if (data.sponsorshipType === 'cash' && (!data.amount || data.amount <= 0)) {
            return NextResponse.json(
                { error: "Invalid contribution amount" },
                { status: 400 }
            );
        }

        const donationRepository = getEducationRepository();
        const eventRepository = getEventRepository();

        // Get the event to check if sponsorship is enabled
        const event = await eventRepository.getEventById(eventId);
        if (!event) {
            return NextResponse.json({ error: "Event not found" }, { status: 404 });
        }

        if (!event.sponsorship?.enabled) {
            return NextResponse.json(
                { error: "Sponsorship is not enabled for this event" },
                { status: 400 }
            );
        }

        // Create the sponsorship request record
        const contributionData: Donation = {
            donationName: `Event Sponsorship - ${event.name}`,
            description: data.sponsorshipType === 'cash' 
                ? `Cash Sponsorship: $${data.amount}` 
                : `In-kind Sponsorship: ${data.specificItem}`,
            type: data.sponsorshipType === 'cash' ? 'Cash' : 'Goods',
            monetaryValue: data.sponsorshipType === 'cash' ? data.amount : 0,
            donorID: [session.user.id],
            receiveDate: new Date()
        };

        if (data.sponsorshipType === 'cash') {
            await donationRepository.addSponsorshipContribution(eventId, contributionData);
        }

        // Get updated sponsorship status
        const sponsorship = await donationRepository.getEventSponsorship(eventId);
        
        return NextResponse.json({
            message: "Sponsorship request submitted successfully",
            currentAmount: sponsorship?.currentAmount || 0,
            goal: event.sponsorship.goal,
            type: data.sponsorshipType,
            details: data.sponsorshipType === 'cash' ? data.amount : data.specificItem
        });
    } catch (error) {
        console.error("Failed to process sponsorship request:", error);
        return NextResponse.json(
            { error: "Failed to process sponsorship request" },
            { status: 500 }
        );
    }
}