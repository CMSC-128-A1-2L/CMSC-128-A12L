"use client";
import {
  X,
  User,
  Briefcase,
  Calendar,
  DollarSign,
  Bell,
  Users,
  SwitchCamera,
} from "lucide-react";
import { RefObject } from "react";
import Link from "next/link";
import { motion } from "framer-motion";

interface SidebarProps {
  sidebarOpen: boolean;
  setSidebarOpen: (open: boolean) => void;
  sidebarRef: RefObject<HTMLDivElement>;
  role?: string | string[];
}

export default function AlumniSidebar({
  sidebarOpen,
  setSidebarOpen,
  sidebarRef,
  role,
}: SidebarProps) {
  const sidebarItems = [
    { name: "Profile", icon: <User size={20} />, path: "/alumni/profile" },
    { name: "Job Board", icon: <Briefcase size={20} />, path: "/alumni/job-listing" },
    { name: "Events", icon: <Calendar size={20} />, path: "/alumni/events" },
    { name: "Donations", icon: <DollarSign size={20} />, path: "/alumni/donations" },
    { name: "Notifications", icon: <Bell size={20} />, path: "/alumni/notifications" },
    { name: "Alumni Network", icon: <Users size={20} />, path: "/alumni/network" },
  ];

  return (
    <div
      ref={sidebarRef}
      className={`fixed inset-y-0 left-0 z-50 w-64 bg-white shadow-lg transform ${
        sidebarOpen ? "translate-x-0" : "-translate-x-full"
      } transition-transform duration-300 ease-in-out overflow-hidden`}
    >
      <div className="p-4 flex justify-between items-center border-b bg-gradient-to-r from-[#1a1f4d] to-[#0d47a1] text-white">
        <h2 className="text-lg font-bold">Alumni Panel</h2>
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

        {role === "admin" && (
          <div className="mt-auto border-t pt-2 px-2 pb-4">
            <Link
              href="/admin"
              onClick={() => setSidebarOpen(false)}
              className="flex items-center px-4 py-3 text-gray-700 hover:bg-gray-100 rounded-lg transition-colors cursor-pointer group"
            >
              <span className="mr-3 text-[#1a1f4d] group-hover:text-[#0d47a1] transition-colors">
                <SwitchCamera size={20} />
              </span>
              <span className="font-medium">Switch to Admin View</span>
            </Link>
          </div>
        )}
      </nav>
    </div>
  );
}
