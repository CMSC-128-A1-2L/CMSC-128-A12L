import { NextRequest, NextResponse } from "next/server";
import { getEventRepository } from "@/repositories/event_repository";
import { getServerSession } from "next-auth";
import { authOptions } from "@/app/api/auth/[...nextauth]/route";
import { UserRole } from "@/entities/user";
import { Event } from "@/entities/event";

export async function GET(request: NextRequest) {
    try {
        const session = await getServerSession(authOptions);
        if (!session || !session.user.role.includes(UserRole.ALUMNI)) {
            return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
        }

        // Get timeline filter from query params
        const { searchParams } = new URL(request.url);
        const timeline = searchParams.get('timeline') || 'active';

        const eventRepository = getEventRepository();
        const allEvents = await eventRepository.getAllEvents();
        const now = new Date();

        let filteredEvents;
        switch (timeline) {
            case 'ongoing':
                filteredEvents = allEvents.filter(event => {
                    const startDate = new Date(event.startDate);
                    const endDate = new Date(event.endDate);
                    return startDate <= now && endDate >= now;
                });
                break;
            case 'finished':
                filteredEvents = allEvents.filter(event => {
                    const endDate = new Date(event.endDate);
                    return endDate < now;
                });
                break;
            case 'upcoming':
                filteredEvents = allEvents.filter(event => {
                    const startDate = new Date(event.startDate);
                    return startDate > now;
                });
                break;
            default: // 'active' - includes ongoing and upcoming
                filteredEvents = allEvents.filter(event => {
                    const endDate = new Date(event.endDate);
                    return endDate >= now;
                });
        }

        // Sort events by start date (newest first)
        filteredEvents.sort((a: Event, b: Event) => 
            new Date(b.startDate).getTime() - new Date(a.startDate).getTime()
        );
        
        return NextResponse.json(filteredEvents);
    } catch (error) {
        console.error("Failed to fetch events:", error);
        return NextResponse.json(
            { error: "Failed to fetch events" },
            { status: 500 }
        );
    }
}
