"use client";
import { signOut, useSession } from "next-auth/react";
import { useState, useEffect, useRef } from "react";
import { redirect } from "next/navigation";
import Navbar from "@/app/components/navBar";
import AlumniSidebar from "@/app/components/alumniSideBar";
import { motion } from "framer-motion";

export default function AlumniLayout({
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
    <div className="min-h-screen flex flex-col overflow-hidden bg-gray-50">
      {/* Subtle gradient background */}
      <div className="fixed inset-0 bg-gradient-to-br from-[#1a1f4d]/5 to-[#0d47a1]/5 z-0"></div>
      
      {/* Content */}
      <div className="relative z-10 flex flex-col min-h-screen">
        <Navbar
          setSidebarOpen={setSidebarOpen}
          menuButtonRef={menuButtonRef as React.RefObject<HTMLButtonElement>}
          homePath="/alumni"
        />

        <AlumniSidebar
          sidebarOpen={sidebarOpen}
          setSidebarOpen={setSidebarOpen}
          sidebarRef={sidebarRef as React.RefObject<HTMLDivElement>}
          role={session.user.role}
        />

        <motion.main 
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.5 }}
          className={`flex-grow w-full px-4 py-6 transition-all duration-300 ${sidebarOpen ? 'md:ml-64' : ''} overflow-x-hidden`}
        >
          <div className="max-w-7xl mx-auto flex items-center justify-center min-h-[calc(100vh-64px)]">
            <motion.div 
              initial={{ y: 20, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              transition={{ duration: 0.5, delay: 0.2 }}
              className="w-full pt-10"
            >
              {children}
            </motion.div>
          </div>
        </motion.main>
      </div>
    </div>
  );
} 