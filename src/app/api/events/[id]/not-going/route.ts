import { NextRequest, NextResponse } from "next/server";
import { getEventRepository } from "@/repositories/event_repository";
import { getServerSession } from "next-auth";
import { authOptions } from "@/app/api/auth/[...nextauth]/route";
import { UserRole } from "@/entities/user";

// MARKS non-attendance to an event (WouldNotGo)
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
        // const notgoing = qParams.get('not-going'); 
        // if(notgoing === 'true'){
        
        // marking as interested
        if(req.body){
            return await eventRepository.addToEventWNotGo(id, session.user.id)
            .then(() => new NextResponse("Successfully confirmed non-attendance to event", {status: 200}))
            .catch(() => new NextResponse("Failed to mark event non-attendance", {status: 500}));
        }else{
        // toggle user NOTGOING to false, remove user from wouldNotGo
            return await eventRepository.deleteFromEventWNotGo(id, session.user.id)
            .then(() => new NextResponse("Successfully removed non-attendance to event", {status: 200}))
            .catch(() => new NextResponse("Failed to remove event non-attendance", {status: 500}));
        }
        
    } catch (error) {
        console.log("Failed to mark non-attendance: ", error);
        return NextResponse.json(
            { error: "Failed to mark non-attendance"},
            { status: 500 }
        );
    }
}