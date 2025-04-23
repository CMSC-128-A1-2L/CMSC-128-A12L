import { NextRequest, NextResponse } from "next/server";
import { getEventRepository } from "@/repositories/event_repository";
import { getServerSession } from "next-auth";
import { authOptions } from "@/app/api/auth/[...nextauth]/route";
import { UserRole } from "@/entities/user";

// * NOTE: Possibly disable clicking of other correspondence buttons until/unless previously clicked is unclicked. 


// MARKS an event as interested
export async function POST(req: NextRequest, { params }: { params: {id: string}}) {
    try {
        // get session info
        const session = await getServerSession(authOptions);
        if(!session || !session.user.role.includes(UserRole.ALUMNI)){
            return NextResponse.json({error: "Unauthorized"}, {status: 401})
        }

        const {id} = params;
        const eventRepository = getEventRepository();

        // URL Query Ver
        // const qParams = req.nextUrl.searchParams;
        // const interest = qParams.get('interest'); 
        // if(interest === 'true'){
        
        // marking as interested
        if(req.body){
            return await eventRepository.addToEventWGo(id, session.user.id)
            .then(() => new NextResponse("Successfully added interest to event", {status: 200}))
            .catch(() => new NextResponse("Failed to mark event interest", {status: 500}));
        }else{
        // toggle user INTEREST to false, remove user from wouldGo
            return await eventRepository.deleteFromEventWGo(id, session.user.id)
            .then(() => new NextResponse("Successfully removed interest to event", {status: 200}))
            .catch(() => new NextResponse("Failed to remove event interest", {status: 500}));
        }
        
    } catch (error) {
        console.log("Failed to mark as interested: ", error);
        return NextResponse.json(
            { error: "Failed to mark as interested"},
            { status: 500 }
        );
    }
}