import { NextRequest, NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/app/api/auth/[...nextauth]/route";
import { UserRole } from "@/entities/user";
import { getEventRepository } from "@/repositories/event_repository";

// Get list of all events
export async function GET(request: NextRequest){
    try{
        const session = await getServerSession(authOptions);
        if(!session || !session.user.role.includes(UserRole.ADMIN)){
            return NextResponse.json({error: "Unauthorized."}, {status: 401});
        }

        const eventRepository = getEventRepository();
        const events = await eventRepository.getAllEvents();

        return NextResponse.json(events);
    }catch(error){
        console.error("Failed to fetch events: ", error);
        return NextResponse.json({error: "Failed to fetch events."}, {status: 500});
    }
}

// Create an event
export async function POST(request: NextRequest){
    try{
        const session = await getServerSession(authOptions);
        if(!session || !session.user.role.includes(UserRole.ADMIN)){
            return NextResponse.json({error: "Unauthorized."}, {status: 401});
        }

        const eventRepository = getEventRepository();
        const data = await request.json();

        const requiredFields = [
            "name", 
            "organizer",
            "description", 
            "type", 
            "location", 
            "startDate", 
            "endDate"
        ];

        for(const field of requiredFields){
            if(!data[field]){
                return NextResponse.json({error: `Missing required field: ${field}`}, {status: 400});
            }
        }

        // Initialize arrays if not provided
        const newEvent = {
            ...data,
            wouldGo: data.wouldGo || [],
            wouldNotGo: data.wouldNotGo || [],
            wouldMaybeGo: data.wouldMaybeGo || [],
            sponsorship: data.sponsorship || { enabled: false, sponsors: [] },
            rsvp: data.rsvp || { enabled: false, options: ['Yes', 'No', 'Maybe'] },
            userId: session.user.id
        };

        const eventId = await eventRepository.createEvent(newEvent);

        return NextResponse.json({
            message: "Event created successfully.", 
            event: { ...newEvent, _id: eventId }
        }, {status: 201});
    }catch(error){
        console.error("Failed to create new event: ",error);
        return NextResponse.json({error: "Failed to create new event."}, {status: 500});
    }
}