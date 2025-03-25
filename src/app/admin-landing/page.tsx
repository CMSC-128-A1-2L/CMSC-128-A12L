<<<<<<< Updated upstream
"use client"

import { signOut, useSession } from "next-auth/react";
import { redirect } from "next/navigation";
import { useEffect } from "react";

const AdminLanding = () => {
    const { data: session, status } = useSession();

    useEffect(() => {
        if (status === "unauthenticated") {
            console.log("You've been logged out due to inactivity");
            signOut();
        }
    }, [status])
    
    if (!session) {
        return (
          <div className="min-h-screen flex items-center justify-center bg-white">
            <h2 className="text-3xl font-bold text-center text-gray-800" style={{ fontFamily: "Montserrat, sans-serif" }}>
              Not Authenticated
            </h2>
          </div>
        );
      }
    // put your page component here
    return (
        <div>
            <h1>Admin Landing Page</h1>
        </div>
    )
}

=======
"use client"

import { useSession } from "next-auth/react";

const AdminLanding = () => {
    const { data: session } = useSession();
    if (!session) {
        return (
          <div className="min-h-screen flex items-center justify-center bg-white">
            <h2 className="text-3xl font-bold text-center text-gray-800" style={{ fontFamily: "Montserrat, sans-serif" }}>
              Not Authenticated
            </h2>
          </div>
        );
      }
    // put your page component here
    return (
        <div>
            <h1>Admin Landing Page</h1>
        </div>
    )
}

>>>>>>> Stashed changes
export default AdminLanding;