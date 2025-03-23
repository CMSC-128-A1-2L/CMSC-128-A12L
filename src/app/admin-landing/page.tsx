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

export default AdminLanding;