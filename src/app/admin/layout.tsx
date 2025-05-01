"use client";
import { signOut, useSession } from "next-auth/react";
import { useState, useEffect, useRef } from "react";
import { redirect } from "next/navigation";
import Navbar from "@/app/components/navBar";
import AdminSidebar from "@/app/components/adminSideBar";
import { motion } from "framer-motion";
import Footer from "@/app/components/footer";
import { UserRole } from "@/entities/user";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import Link from "next/link";
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

   if (!session?.user.role.includes(UserRole.ADMIN)) {
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
    <div className="min-h-screen flex flex-col overflow-hidden bg-gray-50">
      {/* Subtle gradient background */}
      <div className="fixed inset-0 bg-gradient-to-br from-[#1a1f4d]/5 to-[#0d47a1]/5 z-0"></div>
      
      {/* Content */}
      <div className="relative z-10 flex flex-col min-h-screen">
        <Navbar
          setSidebarOpen={setSidebarOpen}
          menuButtonRef={menuButtonRef as React.RefObject<HTMLButtonElement>}
          homePath="/admin"
        />

        <AdminSidebar
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
        <Footer />
      </div>
    </div>
  );
}