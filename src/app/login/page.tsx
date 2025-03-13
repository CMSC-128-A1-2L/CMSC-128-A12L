/*
 * Sample route that FE can use (optional)
 * */
"use client"
import SignIn from "@/app/components/sign-in";
import { signOut, useSession } from "next-auth/react";

export default function Login() {
	const { data: session } = useSession();
	return (
		<div>
			Test login:
			<br />
			< SignIn />
			<p>Are you currently logged in?:</p> 
			{session ? (<>	
				<p>Yes, I am {session.user?.name}</p>
				<button onClick={() => signOut()}>Sign Out</button>
			</>
			) : (<p>No, noone is logged in</p>)}
		</div>
	);
}
