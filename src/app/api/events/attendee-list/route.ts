// Simulating an API endpoint to return a list of attendees for events.
// Dummy data used

import { NextResponse } from "next/server";
import events from "@/dummy_data/event.json";
import users from "@/dummy_data/user.json";

type RSVPType = "wouldGo" | "wouldMaybeGo" | "wouldNotGo";

// Randomly assign users into three RSVP lists for each event
function assignRandomAttendees() {
  return (events as any[]).map((event) => {
    const shuffled = [...users].sort(() => Math.random() - 0.5);
    const total = shuffled.length;
    const sliceSize = Math.floor(total / 3);

    return {
      ...event,
      wouldGo: shuffled.slice(0, sliceSize),
      wouldMaybeGo: shuffled.slice(sliceSize, 2 * sliceSize),
      wouldNotGo: shuffled.slice(2 * sliceSize, total)
    };
  });
}

export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const eventId = searchParams.get("eventId");
    const rsvpType = (searchParams.get("type") || "wouldGo") as RSVPType;

    const allowedTypes: RSVPType[] = ["wouldGo", "wouldMaybeGo", "wouldNotGo"];
    if (!allowedTypes.includes(rsvpType)) {
      return NextResponse.json(
        { error: `Invalid type. Allowed types are ${allowedTypes.join(", ")}` },
        { status: 400 }
      );
    }

    const eventsWithAttendees = assignRandomAttendees();
    let result;

    if (eventId) {
      const event = eventsWithAttendees.find((e) => e._id === eventId);
      if (!event) {
        return NextResponse.json({ error: "Event not found" }, { status: 404 });
      }
      result = {
        eventId: event._id,
        title: event.title,
        type: rsvpType,
        attendees: event[rsvpType]  
      };
    } else {
      result = eventsWithAttendees.map((event) => ({
        eventId: event._id,
        title: event.title,
        type: rsvpType,
        attendees: event[rsvpType]
      }));
    }

    return NextResponse.json(result);
  } catch (error: any) {
    console.error("Error in dummy attendee endpoint:", error);
    return NextResponse.json(
      { error: "Failed to get dummy attendees", details: error.message },
      { status: 500 }
    );
  }
}

// Endpoint test
// GET http://localhost:3000/api/events/attendee-list
// GET http://localhost:3000/api/events/attendee-list?eventId=1&type=wouldGo
// GET http://localhost:3000/api/events/attendee-list?eventId=1&type=wouldMaybeGo
// GET http://localhost:3000/api/events/attendee-list?eventId=1&type=wouldNotGo
// GET http://localhost:3000/api/events/attendee-list?eventId=1&type=invalidTypes