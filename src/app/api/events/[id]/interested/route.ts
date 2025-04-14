import { NextRequest, NextResponse } from "next/server";
import { getEventRepository } from "@/repositories/event_repository";
import { getServerSession } from "next-auth";
import { authOptions } from "@/app/api/auth/[...nextauth]/route";

// MARKS an event as interested
export async function POST(req: NextRequest, { params }: { params: {id: string}}) {
    try {
        // get session info
        const session = await getServerSession(authOptions);
        if(!session){
            return NextResponse.json("No session", {status: 401})
        }

        const {id} = params;
        const eventRepository = getEventRepository();

        // marking as interested
        if(req.body){
            return await eventRepository.addToEventWGo(id, session.user.id)
            .then(() => new NextResponse("Successfully added interest to event", {status: 200}))
            .catch(() => new NextResponse("Failed to mark event interest", {status: 500}));
            // ? remove from wouldNotGo if it exists?
        }else{
        // toggle user INTEREST to false, remove user from wouldGo
            return await eventRepository.deleteFromEventWGo(id, session.user.id)
            .then(() => new NextResponse("Successfully removed interest to event", {status: 200}))
            .catch(() => new NextResponse("Failed to remove event interest", {status: 500}));
            // ? add to wouldNotGo?
        }
        
    } catch (error) {
        console.log("Failed to mark as interested: ", error);
        return NextResponse.json(
            { error: "Failed to mark as interested"},
            { status: 500 }
        );
    }
}