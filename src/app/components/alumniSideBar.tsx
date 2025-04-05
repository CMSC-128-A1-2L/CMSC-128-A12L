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
    { name: "Profile", icon: <User size={20} /> },
    { name: "Job Board", icon: <Briefcase size={20} /> },
    { name: "Events", icon: <Calendar size={20} /> },
    { name: "Donations", icon: <DollarSign size={20} /> },
    { name: "Notifications", icon: <Bell size={20} /> },
    { name: "Alumni Network", icon: <Users size={20} /> },
  ];

  return (
    <div
      ref={sidebarRef}
      className={`fixed inset-y-0 left-0 z-50 w-64 bg-white shadow-lg transform ${
        sidebarOpen ? "translate-x-0" : "-translate-x-full"
      } transition-transform duration-300 ease-in-out`}
    >
      <div className="p-4 flex justify-between items-center border-b">
        <h2 className="text-lg font-bold text-gray-800">Alumni Sidebar</h2>
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
            {item.name === "Alumni Network" ? (
              <Link
                href="/alumni/network" // Navigate to /alumni for Alumni Network
                className="flex items-center px-4 py-3 text-gray-700 hover:bg-gray-100 transition-colors cursor-pointer"
                onClick={() => setSidebarOpen(false)} // Close the sidebar on click
              >
                <span className="mr-3">{item.icon}</span>
                {item.name}
              </Link>
            ) : (
              <a
                href={`/alumni/${item.name.toLowerCase()}`}
                className={`flex items-center px-4 py-3 text-gray-700 hover:bg-gray-100 transition-colors cursor-pointer ${
                  window.location.pathname === `/alumni/${item.name.toLowerCase()}` ? 'bg-gray-100' : ''
                }`}
              >
                <span className="mr-3">{item.icon}</span>
                {item.name}
              </a>
            )}
          </li>
          ))}
        </ul>

        {role === "admin" && ( //alumniadmin palitan mo mamaya
          <Link
            href="/admin"
            className="mt-auto border-t pt-2"
            onClick={() => setSidebarOpen(false)}
          >
            <div className="flex items-center px-4 py-3 text-gray-700 hover:bg-gray-100 transition-colors cursor-pointer">
              <SwitchCamera size={20} className="mr-3" />
              Switch to Admin View
            </div>
          </Link>
        )}
      </nav>
    </div>
  );
}
