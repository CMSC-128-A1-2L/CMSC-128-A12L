"use client";
import { UserRole } from "@/entities/user";
import { useSession } from "next-auth/react";

export default function AdminLanding() {
  const { data: session } = useSession();

  return (
    <div className="w-full flex items-center justify-center">
      <div className="bg-white shadow-lg rounded-3xl p-8 max-w-2xl w-full">
        <h2
          className="text-3xl font-bold text-center text-gray-800 mb-6"
          style={{ fontFamily: "Montserrat, sans-serif" }}
        >
          Welcome to Admin Portal, {session?.user.name}!
        </h2>
        <p
          className="text-gray-600 text-center mb-4"
          style={{ fontFamily: "Montserrat, sans-serif" }}
        >
          Manage university operations, monitor activities, and oversee
          community engagement through this comprehensive admin interface.
        </p>
        {session?.user.role.includes(UserRole.ADMIN) && (
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
