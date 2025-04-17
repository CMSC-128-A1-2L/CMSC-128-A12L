import { NextRequest, NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/app/api/auth/[...nextauth]/route";
import { UserRole } from "@/entities/user";
import { getEventRepository } from "@/repositories/event_repository";

// Get a specific event
export async function GET(request: NextRequest, {params}: {params: {id: string}}){
    const {id: eventId} = await params;

    try{
        const session = await getServerSession(authOptions);
        if(!session || !session.user.role.includes(UserRole.ADMIN)){
            return NextResponse.json({error: "Unauthorized."}, {status: 401});
        }

        const eventRepository = getEventRepository();
        const event = await eventRepository.getEventById(eventId);

        if(!event){
            return NextResponse.json({error: "Event not found."}, {status: 404});
        }

        return NextResponse.json(event);
    }catch(error){
        console.error("Failed to fetch the event.", error);
        return NextResponse.json({error: "Failed to fetch the event."}, {status: 500})
    }
}

// Update an event
export async function PUT(request: NextRequest, {params}:{params: {id: string}}){
    const {id: eventId} = await params;

    try{
        const session = await getServerSession(authOptions);
        if(!session || !session.user.role.includes(UserRole.ADMIN)){
            return NextResponse.json({error: "Unauthorized."}, {status: 401});
        }

        const eventRepository = getEventRepository();
        
        const data = await request.json();
        const requiredFields = ["name", "description", "type", "location", "startDate", "endDate"];
        for(const field of requiredFields){
            if(!data[field]){
                return NextResponse.json({error: `Missing required field: ${field}`}, {status: 400});
            }
        }

        const existingEvent = await eventRepository.getEventById(eventId);
        if(!existingEvent){
            return NextResponse.json({error: "Event not found."}, {status: 404});
        }

        const currDate = new Date();
        if(currDate >= new Date(existingEvent.startDate)){
            return NextResponse.json({error: "Cannot edit event on/after start date."}, {status: 403});
        }

        // Ensure dates are properly formatted
        const updatedEvent = {
            ...existingEvent,
            ...data,
            startDate: new Date(data.startDate),
            endDate: new Date(data.endDate),
            _id: eventId,
            // Preserve existing arrays if not provided in update
            wouldGo: data.wouldGo || existingEvent.wouldGo || [],
            wouldNotGo: data.wouldNotGo || existingEvent.wouldNotGo || [],
            wouldMaybeGo: data.wouldMaybeGo || existingEvent.wouldMaybeGo || [],
            // Handle optional fields
            imageUrl: data.imageUrl || existingEvent.imageUrl,
            sponsorship: data.sponsorship || existingEvent.sponsorship,
            rsvp: data.rsvp || existingEvent.rsvp
        };

        await eventRepository.updateEvent(updatedEvent);

        return NextResponse.json({message: "Event updated successfully.", event: updatedEvent});
    }catch(error){
        console.error("Failed to update event: ", error);
        return NextResponse.json({error: "Failed to update event."}, {status: 500});
    }
}

// Delete an event
export async function DELETE(request: NextRequest, {params}: {params: {id: string}}){
    const {id: eventId} = await params;

    try{
        const session = await getServerSession(authOptions);
        if(!session || !session.user.role.includes(UserRole.ADMIN)){
            return NextResponse.json({error: "Unauthorized."}, {status: 401});
        }

        const eventRepository = getEventRepository();

        const existingEvent = await eventRepository.getEventById(eventId);
        if(!existingEvent){
            return NextResponse.json({error: "Event not found."}, {status: 404});
        }

        await eventRepository.deleteEvent(eventId);

        return NextResponse.json({message: "Event deleted successfully."});        
    }catch(error){
        console.error("Failed to delete event: ", error);
        return NextResponse.json({error: "Failed to delete event."}, {status: 500});
    }
}