"use client";
import { signOut, useSession } from "next-auth/react";
import { useState, useEffect, useRef } from "react";
import { redirect } from "next/navigation";
import Navbar from "@/app/components/navBar";
import AlumniSidebar from "@/app/components/alumniSideBar";
import { motion } from "framer-motion";
import Footer from "@/app/components/footer";
import { UserRole } from "@/entities/user";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import Link from "next/link";

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

  if (!session?.user.role.includes(UserRole.ALUMNI)) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <Card className="p-6 bg-white/10 backdrop-blur-sm border-0">
          <h2 className="text-2xl font-bold text-white mb-4">Access Denied</h2>
          <p className="text-gray-200">You do not have permission to view this page.</p>
          <Link href="/">
            <Button variant="outline" className="mt-4">Go to Home</Button>
          </Link>
        </Card>
      </div>
    );
  }

  return (
    <div className="min-h-screen relative">
      {/* Background Elements */}
      <div className="fixed inset-0 bg-[#0f172a]" />
      <div className="fixed inset-0 bg-[url('/grid-pattern.svg')] opacity-5" />
      <div className="fixed inset-0 bg-[url('/noise-pattern.png')] opacity-5" />
      <div className="fixed inset-0 bg-gradient-to-br from-[#1a1f4d]/80 via-[#1a237e]/60 to-[#0d47a1]/40" />
      
      {/* Content */}
      <div className="relative z-10">
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

        <main 
          className={`pt-16 transition-all duration-300 ${sidebarOpen ? 'md:ml-64' : ''}`}
        >
          {children}
        </main>
        <Footer />
      </div>
    </div>
  );
}