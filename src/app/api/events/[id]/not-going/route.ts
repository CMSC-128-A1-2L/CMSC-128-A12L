import { NextRequest, NextResponse } from "next/server";
import { getEventRepository } from "@/repositories/event_repository";
import { getServerSession } from "next-auth";
import { authOptions } from "@/app/api/auth/[...nextauth]/route";
import { UserRole } from "@/entities/user";

export async function POST(req: NextRequest, { params }: { params: {id: string}}) {
    try {
        const session = await getServerSession(authOptions);
        if(!session || !session.user.role.includes(UserRole.ALUMNI)){
            return NextResponse.json({error: "Unauthorized"}, {status: 401})
        }

        const {id} = await params;
        const eventRepository = getEventRepository();
        const event = await eventRepository.getEventById(id);

        if (!event) {
            return NextResponse.json({error: "Event not found"}, {status: 404});
        }

        const userId = session.user.id;

        // Check if user is already in wouldNotGo
        if (event.wouldNotGo.includes(userId)) {
            // Remove from wouldNotGo if already present
            await eventRepository.deleteFromEventWNotGo(id, userId);
            return NextResponse.json({message: "Response removed", action: "removed"}, {status: 200});
        } else {
            // Remove from other arrays first
            await eventRepository.deleteFromEventWGo(id, userId);
            await eventRepository.deleteFromEventWMaybeGo(id, userId);
            // Add to wouldNotGo
            await eventRepository.addToEventWNotGo(id, userId);
            return NextResponse.json({message: "Response updated", action: "added"}, {status: 200});
        }
    } catch (error) {
        console.error("Failed to update response:", error);
        return NextResponse.json(
            { error: "Failed to update response"},
            { status: 500 }
        );
    }
}