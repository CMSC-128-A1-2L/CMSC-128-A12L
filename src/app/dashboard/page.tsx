"use client"
import { getSession, useSession } from "next-auth/react";

export default function Dashboard(){
    const { data: session } = useSession(
    //     {
    //     required: true,
    //     onUnauthenticated: () => {
    //         return(
    //             <div>
    //                 <h1>Dashboard</h1>
    //                 <p>You are not logged in.</p>
    //             </div>
    //         )
    //     }
    // }
);

    return(
        <div>
            <h1>Dashboard</h1>
            {/* button for checking if jwt works */}
           {session && (
                <>
                    <p>Welcome, {session.user?.name}!</p>
                    <button onClick={() => getSession().then(session => console.log(session))}>
                        Check Session
                    </button>
                </>
            )}
            
        </div>
    );

}