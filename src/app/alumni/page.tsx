"use client";
import { useSession } from "next-auth/react";
import { UserRole } from "@/entities/user";

export default function AlumniLanding() {
  const { data: session } = useSession();

  return (
    <div className="w-full flex items-center justify-center">
      <div className="bg-white shadow-lg rounded-3xl p-8 max-w-2xl w-full">
        <h2
          className="text-3xl font-bold text-center text-gray-800 mb-6"
          style={{ fontFamily: "Montserrat, sans-serif" }}
        >
          Welcome to the Alumni Portal!
        </h2>
        <p
          className="text-gray-600 text-center"
          style={{ fontFamily: "Montserrat, sans-serif" }}
        >
          Connect with fellow alumni, explore job opportunities, stay updated
          with university events, and contribute to our growing community.
          Your success is our legacy!
        </p>
        {session?.user.role.includes(UserRole.ALUMNI) && (
          <div className="mt-6 text-center">
            <p className="text-sm text-gray-500">
              Switch to Alumni View using the button in the sidebar
            </p>
          </div>
        )}
      </div>
    </div>
  );
}
