import { NextResponse } from "next/server";
import { getEventRepository, RSVPType } from "@/repositories/event_repository";
import { getServerSession } from "next-auth/next";
import { authOptions } from "@/app/api/auth/[...nextauth]/route";
import { UserRole } from "@/entities/user";

export async function GET(request: Request) {
  try {
    // Get the user's session using NextAuth
    const session = await getServerSession(authOptions);
    
    // Check if the user is authenticated and has admin role
    if (!session || !session.user || !session.user.role || 
        !session.user.role.includes(UserRole.ADMIN)) {
      return NextResponse.json(
        { error: "Unauthorized. Admin access required." },
        { status: 403 }
      );
    }

    const { searchParams } = new URL(request.url);
    const eventId = searchParams.get("eventId");
    const userId = searchParams.get("userId");
    const rsvpTypeParam = searchParams.get("type") || "wouldGo";

    // Validate RSVP type
    const allowedTypes: RSVPType[] = ["wouldGo", "wouldMaybeGo", "wouldNotGo"];
    if (!allowedTypes.includes(rsvpTypeParam as RSVPType)) {
      return NextResponse.json(
        { error: `Invalid type. Allowed types are ${allowedTypes.join(", ")}` },
        { status: 400 }
      );
    }

    const rsvpType = rsvpTypeParam as RSVPType;
    const eventRepository = getEventRepository();

    // If eventId is provided, get attendees for a specific event
    if (eventId) {
      const event = await eventRepository.getEventById(eventId);
      if (!event) {
        return NextResponse.json({ error: "Event not found" }, { status: 404 });
      }

      // Get attendees based on RSVP type and optional userId filter
      const attendees = await eventRepository.getEventAttendees(eventId, rsvpType, userId);
      
      return NextResponse.json({
        eventId: event._id,
        title: event.name,
        type: rsvpType,
        attendees: attendees.map(user => ({
          id: user.id,
          name: user.name,
          email: user.email,
          role: user.role
        }))
      });
    } 
    // If no eventId is provided, get attendees for all events
    else {
      const events = await eventRepository.getAllEvents();
      const result = await Promise.all(events.map(async (event) => {
        const attendees = await eventRepository.getEventAttendees(
          event._id as string, 
          rsvpType, 
          userId
        );
        
        return {
          eventId: event._id,
          title: event.name,
          type: rsvpType,
          attendees: attendees.map(user => ({
            id: user.id,
            name: user.name,
            email: user.email,
            role: user.role
          }))
        };
      }));

      return NextResponse.json(result);
    }
  } catch (error: any) {
    console.error("Error in attendee list endpoint:", error);
    return NextResponse.json(
      { error: "Failed to get attendees", details: error.message },
      { status: 500 }
    );
  }
}