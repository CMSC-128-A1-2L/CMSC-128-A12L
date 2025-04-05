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

interface SidebarProps {
  sidebarOpen: boolean;
  setSidebarOpen: (open: boolean) => void;
  sidebarRef: RefObject<HTMLDivElement>;
  role?: string;
}

export default function JobListingsSidebar({
  sidebarOpen,
  setSidebarOpen,
  sidebarRef,
  role,
}: SidebarProps) {
  const sidebarItems = [
    { name: "Dashboard", icon: <LayoutDashboardIcon size={20} /> },
    { name: "Manage Users", icon: <Users size={20} /> },
    { name: "Job Listings", icon: <Briefcase size={20} /> },
    { name: "Events", icon: <CalendarCogIcon size={20} /> },
    { name: "Communications", icon: <Phone size={20} /> },
    { name: "Reports", icon: <MessageCircleWarningIcon size={20} /> },
    { name: "Logs", icon: <LogsIcon size={20} /> },
  ];

  return (
    <div
      ref={sidebarRef}
      className={`fixed inset-y-0 left-0 z-50 w-64 bg-white shadow-lg transform ${
        sidebarOpen ? "translate-x-0" : "-translate-x-full"
      } transition-transform duration-300 ease-in-out`}
    >
      <div className="p-4 flex justify-between items-center border-b">
        <h2 className="text-lg font-bold text-gray-800">Job Listings Sidebar</h2>
        <button
          onClick={() => setSidebarOpen(false)}
          className="focus:outline-none cursor-pointer"
          aria-label="Close menu"
        >
          <X size={24} />
        </button>
      </div>
      <nav className="mt-4 flex flex-col h-[calc(100vh-80px)]">
        <ul className="flex-1">
          {sidebarItems.map((item, index) => (
            <li key={index}>
              <a
                href="#"
                className="flex items-center px-4 py-3 text-gray-700 hover:bg-gray-100 transition-colors cursor-pointer"
              >
                <span className="mr-3">{item.icon}</span>
                {item.name}
              </a>
            </li>
          ))}
        </ul>

        {role === "alumni" && (
          <Link
            href="/alumni-landing"
            className="mt-auto border-t pt-2"
            onClick={() => setSidebarOpen(false)}
          >
            <div className="flex items-center px-4 py-3 text-gray-700 hover:bg-gray-100 transition-colors cursor-pointer">
              <SwitchCamera size={20} className="mr-3" />
              Switch to Alumni View
            </div>
          </Link>
        )}
      </nav>
    </div>
  );
}
