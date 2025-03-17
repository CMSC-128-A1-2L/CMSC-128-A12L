// Sample page that FE can use (optional)

"use client";
import { getSession, signOut, useSession } from "next-auth/react";
import { redirect } from "next/navigation";
import { useEffect } from "react";

export default function Dashboard() {
  const { data: session, status } = useSession();

  // Redirect unauthenticated users to login
  useEffect(() => {
    // This happens when token expires.
    if (status === "unauthenticated") {
      redirect("/login");
    }
  }, [status]);

  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-black text-white p-4">
      <div className="bg-gray-900 shadow-lg rounded-2xl p-6 w-full max-w-lg text-center">
        <h1 className="text-3xl font-bold mb-4">Dashboard</h1>
        {session ? (
          <>
            <p className="text-lg">Welcome, <span className="font-bold">{session.user?.name}</span>!</p>
            <button
              onClick={() => signOut()}
              className="mt-4 px-4 py-2 bg-gray-700 text-white rounded-lg hover:bg-gray-600 transition"
            >
              Sign Out
            </button>
          </>
        ) : (
          <p className="text-lg">Loading...</p>
        )}
      </div>
    </div>
  );
}
