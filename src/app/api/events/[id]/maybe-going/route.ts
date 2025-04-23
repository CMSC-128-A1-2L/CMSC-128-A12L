import { NextRequest, NextResponse } from "next/server";
import { getEventRepository } from "@/repositories/event_repository";
import { getServerSession } from "next-auth";
import { authOptions } from "@/app/api/auth/[...nextauth]/route";
import { UserRole } from "@/entities/user";

// MARKS possible attendance to event (wouldMaybeGo)
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
        // const maybegoing = qParams.get('maybe-going'); 
        // if(maybegoing === 'true'){
        
        // marking as interested
        if(req.body){
            return await eventRepository.addToEventWMaybeGo(id, session.user.id)
            .then(() => new NextResponse("Successfully confirmed possible attendance to event", {status: 200}))
            .catch(() => new NextResponse("Failed to mark event possible attendance", {status: 500}));
        }else{
        // toggle user MAYBEGOING to false, remove user from wouldMaybeGo
            return await eventRepository.deleteFromEventWMaybeGo(id, session.user.id)
            .then(() => new NextResponse("Successfully removed possible attendance to event", {status: 200}))
            .catch(() => new NextResponse("Failed to remove event possible attendance", {status: 500}));
        }
        
    } catch (error) {
        console.log("Failed to mark possible attendance: ", error);
        return NextResponse.json(
            { error: "Failed to mark possible attendance"},
            { status: 500 }
        );
    }
}