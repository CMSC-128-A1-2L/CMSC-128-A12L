'use client'
import SignUp from "@/app/components/sign_up";
import { redirect } from "next/navigation";
import { useSession } from "next-auth/react";

export default function Registration() {
    const { data: session } = useSession();
    
    if(session){
		redirect(`${process.env.NEXT_PUBLIC_CALLBACK_URL}/redirect`)
	}
    return (
        <div> 
            <SignUp/>
        </div>
    )
}