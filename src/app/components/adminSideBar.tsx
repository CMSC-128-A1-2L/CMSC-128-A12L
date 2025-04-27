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
import { Montserrat } from "next/font/google";

const montserrat = Montserrat({ subsets: ["latin"] });

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
  const sidebarItems = {
    general: [
      {
        name: "Dashboard",
        icon: <LayoutDashboardIcon size={20} />,
        path: "/admin",
      },
      {
        name: "Reports",
        icon: <MessageCircleWarningIcon size={20} />,
        path: "/admin/reports",
      },
      { name: "Logs", icon: <LogsIcon size={20} />, path: "/admin/logs" },
    ],
    management: [
      {
        name: "Manage Users",
        icon: <Users size={20} />,
        path: "/admin/user-management",
      },
      {
        name: "Job Opportunities",
        icon: <Briefcase size={20} />,
        path: "/admin/opportunities",
      },
      {
        name: "Events",
        icon: <CalendarCogIcon size={20} />,
        path: "/admin/events",
      },
      {
        name: "Communications",
        icon: <Phone size={20} />,
        path: "/admin/communications",
      },
    ],
  };

  return (
    <div
      ref={sidebarRef}
      className={`fixed inset-y-0 left-0 z-50 w-64 bg-white shadow-lg transform ${
        sidebarOpen ? "translate-x-0" : "-translate-x-full"
      } transition-transform duration-300 ease-in-out overflow-hidden ${
        montserrat.className
      }`}
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
        <div className="mb-6">
          <h3 className="text-gray-500 text-sm font-medium mb-2 px-4">
            General
          </h3>
          <ul className="space-y-1 px-2">
            {sidebarItems.general.map((item, index) => (
              <li key={index}>
                <Link
                  href={item.path}
                  className="flex items-center px-4 py-3 text-gray-700 hover:bg-gray-100 rounded-lg transition-colors cursor-pointer group"
                  onClick={() => setSidebarOpen(false)}
                >
                  <span className="mr-3 text-[#1a1f4d] group-hover:text-[#0d47a1] transition-colors">
                    {item.icon}
                  </span>
                  <span className="font-medium">{item.name}</span>
                </Link>
              </li>
            ))}
          </ul>
        </div>
        <div className="h-px bg-gray-200 mx-4 my-4" />
        <div className="mb-6">
          <h3 className="text-gray-500 text-sm font-medium mb-2 px-4">
            Management
          </h3>
          <ul className="space-y-1 px-2">
            {sidebarItems.management.map((item, index) => (
              <li key={index}>
                <Link
                  href={item.path}
                  className="flex items-center px-4 py-3 text-gray-700 hover:bg-gray-100 rounded-lg transition-colors cursor-pointer group"
                  onClick={() => setSidebarOpen(false)}
                >
                  <span className="mr-3 text-[#1a1f4d] group-hover:text-[#0d47a1] transition-colors">
                    {item.icon}
                  </span>
                  <span className="font-medium">{item.name}</span>
                </Link>
              </li>
            ))}
          </ul>
        </div>
        <div className="h-px bg-gray-200 mx-4 my-4" />
        {role == "admin" && (
          <div className="mt-auto border-t pt-2 px-2 pb-4">
            <h3 className="text-gray-500 text-sm font-medium mb-2 px-4">
              Others
            </h3>
            <Link
              href="/alumni"
              onClick={() => setSidebarOpen(false)}
              className="flex items-center px-4 py-3 text-gray-700 rounded-lg transition-all duration-200 cursor-pointer group hover:bg-gray-50"
            >
              <motion.span
                className="mr-3 text-[#1a1f4d] group-hover:text-[#0d47a1]"
                whileHover={{ scale: 1.1 }}
                transition={{ type: "spring", stiffness: 400, damping: 10 }}
              >
                <SwitchCamera size={20} />
              </motion.span>
              <motion.span
                className="font-medium"
                whileHover={{ x: 2 }}
                transition={{ type: "tween", duration: 0.2 }}
              >
                Switch to Alumni View
              </motion.span>
            </Link>
          </div>
        )}
      </nav>
    </div>
  );
}
