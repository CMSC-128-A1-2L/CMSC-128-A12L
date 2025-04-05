"use client";
import { signOut, useSession } from "next-auth/react";
import { useState, useEffect, useRef } from "react";
import { redirect } from "next/navigation";
import Navbar from "@/app/components/navBar";
import AlumniSidebar from "@/app/components/alumniSideBar";

export default function AlumniLanding() {
  const { data: session, status } = useSession();
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const sidebarRef = useRef<HTMLDivElement>(null!);
  const menuButtonRef = useRef<HTMLButtonElement>(null!);

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
        homePath="/alumni-landing"
      />

      <AlumniSidebar
        sidebarOpen={sidebarOpen}
        setSidebarOpen={setSidebarOpen}
        sidebarRef={sidebarRef}
        role={session.user.role}
      />

      <main className="flex-grow container mx-auto px-4 py-8 flex items-center justify-center">
        <div className="bg-white shadow-lg rounded-3xl p-8 max-w-2xl w-full">
          <h2
            className="text-3xl font-bold text-center text-gray-800 mb-6"
            style={{ fontFamily: "Montserrat, sans-serif" }}
          >
            Welcome to the Alumni Portal!
          </h2>
          <p
            className="text-gray-600"
            style={{ fontFamily: "Montserrat, sans-serif" }}
          >
            Connect with fellow alumni, explore job opportunities, stay updated
            with university events, and contribute to our growing community.
            Your success is our legacy!
          </p>
          {session.user.role === "alumniadmin" && (
            <div className="mt-4 text-center">
              <p className="text-sm text-gray-500">
                Switch to Alumni View using the button in the sidebar
              </p>
            </div>
          )}
        </div>
      </main>
    </div>
  );
}
