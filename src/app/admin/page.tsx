"use client";
import { signOut, useSession } from "next-auth/react";
import { useState, useEffect, useRef } from "react";
import { redirect } from "next/navigation";
import Navbar from "@/app/components/navBar";
import AdminSidebar from "@/app/components/adminSideBar";

export default function AdminLanding() {
  const { data: session, status } = useSession();
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const sidebarRef = useRef<HTMLDivElement>(null);
  const menuButtonRef = useRef<HTMLButtonElement>(null);

  useEffect(() => {
    if (status === "unauthenticated") {
      console.log("You've been logged out due to inactivity");
      signOut();
    }
  }, [status]);

  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (
        sidebarOpen &&
        sidebarRef.current &&
        !sidebarRef.current.contains(event.target as Node) &&
        menuButtonRef.current &&
        !menuButtonRef.current.contains(event.target as Node)
      ) {
        setSidebarOpen(false);
      }
    }

    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, [sidebarOpen]);

  if (!session) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-white">
        <h2
          className="text-3xl font-bold text-center text-gray-800"
          style={{ fontFamily: "Montserrat, sans-serif" }}
        >
          Not Authenticated
        </h2>
      </div>
    );
  }

  return (
    <div className="min-h-screen flex flex-col bg-white">
      <Navbar
        setSidebarOpen={setSidebarOpen}
        menuButtonRef={menuButtonRef}
        homePath="/admin"
      />

      <AdminSidebar
        sidebarOpen={sidebarOpen}
        setSidebarOpen={setSidebarOpen}
        sidebarRef={sidebarRef}
        role={session.user.role}
      />

      <main className="flex-grow container mx-auto px-4 py-8 flex items-center justify-center lg:ml-64 transition-all duration-300">
        <div className="bg-white shadow-lg rounded-3xl p-8 max-w-2xl w-full">
          <h2
            className="text-3xl font-bold text-center text-gray-800 mb-6"
            style={{ fontFamily: "Montserrat, sans-serif" }}
          >
            Welcome to Admin Portal, {session.user.name}!
          </h2>
          <p
            className="text-gray-600 mb-4"
            style={{ fontFamily: "Montserrat, sans-serif" }}
          >
            Manage university operations, monitor activities, and oversee
            community engagement through this comprehensive admin interface.
          </p>
          {session.user.role === "alumniadmin" && (
            <div className="mt-4 text-center">
              <p className="text-sm text-gray-500">
                Switch to Alumni View using the button in the sidebarrrrr
              </p>
            </div>
          )}
        </div>
      </main>
    </div>
  );
}
