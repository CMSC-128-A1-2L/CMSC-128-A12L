"use client";
import { useState, useEffect, useRef } from "react";
import Navbar from "@/app/components/navBar";
import { motion } from "framer-motion";
import Link from "next/link";
import { X, CreditCard, Wallet } from "lucide-react";

export default function DonationsLayout({
  children,
}: {
  children: React.ReactNode;
}) {
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

  const sidebarItems = [
    { name: "Donation Options", icon: <CreditCard size={20} />, path: "/donations" },
    { name: "Maya Payment", icon: <Wallet size={20} />, path: "/donations/maya" },
    { name: "Stripe Payment", icon: <CreditCard size={20} />, path: "/donations/stripe" },
  ];

  return (
    <div className="min-h-screen flex flex-col overflow-hidden bg-gray-50">
      {/* Subtle gradient background */}
      <div className="fixed inset-0 bg-gradient-to-br from-[#1a1f4d]/5 to-[#0d47a1]/5 z-0"></div>
      
      {/* Content */}
      <div className="relative z-10 flex flex-col min-h-screen">
        <Navbar
          setSidebarOpen={setSidebarOpen}
          menuButtonRef={menuButtonRef as React.RefObject<HTMLButtonElement>}
          homePath="/donations"
        />

        {/* Donations Sidebar */}
        <div
          ref={sidebarRef}
          className={`fixed inset-y-0 left-0 z-50 w-64 bg-white shadow-lg transform ${
            sidebarOpen ? "translate-x-0" : "-translate-x-full"
          } transition-transform duration-300 ease-in-out overflow-hidden`}
        >
          <div className="p-4 flex justify-between items-center border-b bg-gradient-to-r from-[#1a1f4d] to-[#0d47a1] text-white">
            <h2 className="text-lg font-bold">Donations</h2>
            <button
              onClick={() => setSidebarOpen(false)}
              className="focus:outline-none cursor-pointer hover:text-gray-200 transition-colors"
              aria-label="Close menu"
            >
              <X size={24} />
            </button>
          </div>
          
          <nav className="mt-4 flex flex-col h-[calc(100vh-80px)]">
            <ul className="flex-1 space-y-1 px-2">
              {sidebarItems.map((item, index) => (
                <li key={index}>
                  <Link
                    href={item.path}
                    className="flex items-center px-4 py-3 text-gray-700 hover:bg-gray-100 rounded-lg transition-colors cursor-pointer group"
                    onClick={() => setSidebarOpen(false)}
                  >
                    <span className="mr-3 text-[#1a1f4d] group-hover:text-[#0d47a1] transition-colors">{item.icon}</span>
                    <span className="font-medium">{item.name}</span>
                  </Link>
                </li>
              ))}
            </ul>
          </nav>
        </div>

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