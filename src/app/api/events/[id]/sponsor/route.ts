import { NextRequest, NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/app/api/auth/[...nextauth]/route";
import { UserRole } from "@/entities/user";
import { getEventRepository } from "@/repositories/event_repository";
import { getEducationRepository } from "@/repositories/donation_repository";
import { Donation } from "@/entities/donation";

// Get sponsorship status for an event
export async function GET(request: NextRequest, { params }: { params: { id: string } }) {
    try {
        const session = await getServerSession(authOptions);
        if (!session || !session.user.role.includes(UserRole.ALUMNI)) {
            return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
        }

        const { id: eventId } = await params;
        const donationRepository = getEducationRepository();
        const eventRepository = getEventRepository();

        // Get the event to check if sponsorship is enabled
        const event = await eventRepository.getEventById(eventId);
        if (!event) {
            return NextResponse.json({ error: "Event not found" }, { status: 404 });
        }

        if (!event.sponsorship?.enabled) {
            return NextResponse.json({
                isActive: false,
                currentAmount: 0,
                goal: 0
            });
        }

        // Get the sponsorship details
        const sponsorship = await donationRepository.getEventSponsorship(eventId);
        
        return NextResponse.json({
            isActive: true,
            currentAmount: sponsorship?.currentAmount || 0,
            goal: event.sponsorship.goal || 0
        });
    } catch (error) {
        console.error("Failed to fetch sponsorship status:", error);
        return NextResponse.json(
            { error: "Failed to fetch sponsorship status" },
            { status: 500 }
        );
    }
}

// Submit a sponsorship contribution
export async function POST(request: NextRequest, { params }: { params: { id: string } }) {
    try {
        const session = await getServerSession(authOptions);
        if (!session || !session.user.role.includes(UserRole.ALUMNI)) {
            return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
        }

        const { id: eventId } = await params;
        const data = await request.json();

        // Validate the contribution data
        if (!data.amount || data.amount <= 0) {
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

        // Create the contribution record
        const contribution: Donation = {
            donationName: `Event Sponsorship - ${event.name}`,
            description: data.description || "Event Sponsorship Contribution",
            type: "Cash",
            monetaryValue: data.amount,
            donorID: [session.user.id],
            receiveDate: new Date()
        };

        await donationRepository.addSponsorshipContribution(eventId, contribution);

        // Get updated sponsorship status
        const sponsorship = await donationRepository.getEventSponsorship(eventId);
        
        return NextResponse.json({
            message: "Sponsorship contribution added successfully",
            currentAmount: sponsorship?.currentAmount || 0,
            goal: event.sponsorship.goal
        });
    } catch (error) {
        console.error("Failed to process sponsorship contribution:", error);
        return NextResponse.json(
            { error: "Failed to process sponsorship contribution" },
            { status: 500 }
        );
    }
}