// Sample page that FE can use (optional)

"use client";

import SignIn from "@/app/components/signIn";
import { signOut, useSession } from "next-auth/react";

export default function Login() {
  const { data: session } = useSession();

  return (
    <div className="flex flex-col items-center justify-center min-h-screen p-4">
      <div className="shadow-lg rounded-2xl p-6 w-full max-w-md text-center">
        <h2 className="text-2xl font-semibold mb-4">Welcome to Our App</h2>
        {session ? (
          <div>
            <p className="text-lg">You are logged in as <span className="font-bold">{session.user?.name}</span></p>
            <button
              onClick={() => signOut()}
              className="mt-4 px-4 py-2 bg-gray-500 text-white rounded-lg hover:bg-gray-600 transition"
            >
              Sign Out
            </button>
          </div>
        ) : (
          <div>
            <p className="text-lg mb-4">You are not logged in.</p>
            <SignIn />
          </div>
        )}
      </div>
    </div>
  );
}