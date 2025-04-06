"use client";
import { signOut, useSession } from "next-auth/react";
import { useState, useEffect, useRef } from "react";
import { redirect } from "next/navigation";
import Navbar from "@/app/components/navBar";
import AdminSidebar from "@/app/components/adminSideBar";

export default function AdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const { data: session, status } = useSession();
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const sidebarRef = useRef<HTMLDivElement>(null);
  const menuButtonRef = useRef<HTMLButtonElement>(null);

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
          Loading...
        </h2>
      </div>
    );
  }

  return (
    <div className="min-h-screen flex flex-col bg-white overflow-hidden">
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

      <main className={`flex-grow w-full px-4 py-6 transition-all duration-300 ${sidebarOpen ? 'md:ml-64' : ''} overflow-x-hidden`}>
        <div className="max-w-7xl mx-auto flex items-center justify-center min-h-[calc(100vh-64px)]">
          {children}
        </div>
      </main>
    </div>
  );
}