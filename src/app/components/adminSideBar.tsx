"use client";
import {
  X,
  LayoutDashboardIcon,
  Users,
  Briefcase,
  CalendarCogIcon,
  Phone,
  MessageCircleWarningIcon,
  LogsIcon,
  SwitchCamera,
} from "lucide-react";
import { RefObject } from "react";
import Link from "next/link";
import { motion } from "framer-motion";

interface SidebarProps {
  sidebarOpen: boolean;
  setSidebarOpen: (open: boolean) => void;
  sidebarRef?: RefObject<HTMLDivElement> | null;
  role?: string | string[];
}

export default function AdminSidebar({
  sidebarOpen,
  setSidebarOpen,
  sidebarRef,
  role,
}: SidebarProps) {
  const sidebarItems = [
    { name: "Dashboard", icon: <LayoutDashboardIcon size={20} />, path: "/admin" },
    { name: "Manage Users", icon: <Users size={20} />, path: "/admin/user-management" },
    { name: "Job Opportunities", icon: <Briefcase size={20} />, path: "/admin/opportunities" },
    { name: "Events", icon: <CalendarCogIcon size={20} />, path: "/admin/events" },
    { name: "Communications", icon: <Phone size={20} />, path: "/admin/communications" },
    { name: "Reports", icon: <MessageCircleWarningIcon size={20} />, path: "/admin/reports" },
    { name: "Logs", icon: <LogsIcon size={20} />, path: "/admin/logs" },
  ];

  return (
    <div
      ref={sidebarRef}
      className={`fixed inset-y-0 left-0 z-50 w-64 bg-white shadow-lg transform ${
        sidebarOpen ? "translate-x-0" : "-translate-x-full"
      } transition-transform duration-300 ease-in-out overflow-hidden`}
    >
      <div className="p-4 flex justify-between items-center border-b bg-gradient-to-r from-[#1a1f4d] to-[#0d47a1] text-white">
        <h2 className="text-lg font-bold">Admin Panel</h2>
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

        {role == "admin" && (
          <div className="mt-auto border-t pt-2 px-2 pb-4">
            <Link
              href="/alumni"
              onClick={() => setSidebarOpen(false)}
              className="flex items-center px-4 py-3 text-gray-700 hover:bg-gray-100 rounded-lg transition-colors cursor-pointer group"
            >
              <span className="mr-3 text-[#1a1f4d] group-hover:text-[#0d47a1] transition-colors">
                <SwitchCamera size={20} />
              </span>
              <span className="font-medium">Switch to Alumni View</span>
            </Link>
          </div>
        )}
      </nav>
    </div>
  );
}
