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
  Settings,
  LayoutDashboard,
  Newspaper,
} from "lucide-react";
import { RefObject } from "react";
import Link from "next/link";
import { motion } from "framer-motion";
import { useSession } from "next-auth/react";
import { Montserrat } from "next/font/google";
import Image from "next/image";
import { UserRole } from "@/entities/user";

const montserrat = Montserrat({ subsets: ["latin"] });

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
  const { data: session } = useSession();

  const displayName = session?.user?.name?.split(" ")[0] || "Alumni User";
  const userImage = session?.user?.image;
  const initial = (displayName[0] || "A").toUpperCase();
  const getRole = () => {
    if(session?.user?.role?.includes(UserRole.ADMIN) && session?.user?.role?.includes(UserRole.ALUMNI)){
      return "Alumni Admin"
    }
    else if (session?.user?.role?.includes(UserRole.ADMIN)){
      return "Admin"
    }
    else if (session?.user?.role?.includes(UserRole.ALUMNI)){
      return "Alumni"
    }
    else{
      return "Unknown"
    }
  }
  const currentRole = getRole();
  const sidebarItems = {
    account: [
      {
        name: displayName,
        icon: <User size={20} />,
        path: "/alumni/profile",
        subtitle: currentRole,
      },
    ],
    general: [
      {
        name: "Dashboard",
        icon: <LayoutDashboard size={20} />,
        path: "/alumni",
      },
      {
        name: "Job Board",
        icon: <Briefcase size={20} />,
        path: "/alumni/jobs",
      },
      { name: "Events", icon: <Calendar size={20} />, path: "/alumni/events" },
      {
        name: "Newsletters",
        icon: <Newspaper size={20} />,
        path: "/alumni/newsletters",
      },
      {
        name: "Announcements",
        icon: <Bell size={20} />,
        path: "/alumni/announcements",
      },
      {
        name: "Donations",
        icon: <DollarSign size={20} />,
        path: "/alumni/donations",
      },
    ],
    others: [
      {
        name: "Notifications",
        icon: <Bell size={20} />,
        path: "/alumni/notifications",
      },
      {
        name: "Alumni Network",
        icon: <Users size={20} />,
        path: "/alumni/network",
      },
      {
        name: "Settings",
        icon: <Settings size={20} />,
        path: "/alumni/settings",
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
        <h2 className="text-lg font-bold ">Alumni Panel</h2>
        <button
          onClick={() => setSidebarOpen(false)}
          className="focus:outline-none cursor-pointer hover:text-gray-200 transition-colors"
          aria-label="Close menu"
        >
          <X size={24} />
        </button>
      </div>

      <div className="flex flex-col h-[calc(100vh-64px)]">
        {/* Main scrollable content */}
        <div className="flex-1 overflow-y-auto">
          <div className="p-4">
            <div className="mb-1">
              <h3 className="text-gray-500 text-sm font-medium mb-1">
                Account
              </h3>
              {sidebarItems.account.map((item, index) => (
                <Link
                  key={index}
                  href={item.path}
                  className="flex items-center px-4 py-3 text-gray-700 rounded-lg transition-all duration-200 cursor-pointer group hover:bg-gray-50"
                  onClick={() => setSidebarOpen(false)}
                >
                  {userImage ? (
                    <div className="w-10 h-10 rounded-full overflow-hidden mr-3 relative">
                      <Image
                        src={userImage}
                        alt="Profile"
                        fill
                        sizes="40px"
                        className="object-cover"
                      />
                    </div>
                  ) : (
                    <div className="w-10 h-10 rounded-full bg-[#1a1f4d] text-white flex items-center justify-center mr-3">
                      <span className="text-lg font-medium">{initial}</span>
                    </div>
                  )}
                  <motion.div
                    whileHover={{ x: 2 }}
                    transition={{ type: "tween", duration: 0.2 }}
                  >
                    <span className="font-medium block">{item.name}</span>
                    <span className="text-sm text-gray-500">{item.subtitle}</span>
                  </motion.div>
                </Link>
              ))}
            </div>

            <div className="h-px bg-gray-200 my-4" />

            <div className="mb-6">
              <h3 className="text-gray-500 text-sm font-medium mb-2">
                General
              </h3>
              {sidebarItems.general.map((item, index) => (
                <Link
                  key={index}
                  href={item.path}
                  className="flex items-center px-4 py-3 text-gray-700 rounded-lg transition-all duration-200 cursor-pointer group hover:bg-gray-50"
                  onClick={() => setSidebarOpen(false)}
                >
                  <motion.span
                    className="mr-3 text-[#1a1f4d] group-hover:text-[#0d47a1]"
                    whileHover={{ scale: 1.1 }}
                    transition={{ type: "spring", stiffness: 400, damping: 10 }}
                  >
                    {item.icon}
                  </motion.span>
                  <motion.span
                    className="font-medium"
                    whileHover={{ x: 2 }}
                    transition={{ type: "tween", duration: 0.2 }}
                  >
                    {item.name}
                  </motion.span>
                </Link>
              ))}
            </div>

            <div className="h-px bg-gray-200 my-4" />

            <div className="mb-6">
              <h3 className="text-gray-500 text-sm font-medium mb-2">
                Others
              </h3>
              {sidebarItems.others.map((item, index) => (
                <Link
                  key={index}
                  href={item.path}
                  className="flex items-center px-4 py-3 text-gray-700 rounded-lg transition-all duration-200 cursor-pointer group hover:bg-gray-50"
                  onClick={() => setSidebarOpen(false)}
                >
                  <motion.span
                    className="mr-3 text-[#1a1f4d] group-hover:text-[#0d47a1]"
                    whileHover={{ scale: 1.1 }}
                    transition={{ type: "spring", stiffness: 400, damping: 10 }}
                  >
                    {item.icon}
                  </motion.span>
                  <motion.span
                    className="font-medium"
                    whileHover={{ x: 2 }}
                    transition={{ type: "tween", duration: 0.2 }}
                  >
                    {item.name}
                  </motion.span>
                </Link>
              ))}
            </div>
          </div>
        </div>

        {/* Fixed bottom section */}
        {role?.includes("admin") && (
          <div className="bg-white">
            <Link
              href="/admin"
              onClick={() => setSidebarOpen(false)}
              className="flex items-center px-3 py-3 text-sm text-gray-700 transition-all duration-200 cursor-pointer group hover:bg-gray-50"
            >
              <motion.span
                className="mr-2 text-[#1a1f4d] group-hover:text-[#0d47a1]"
                whileHover={{ scale: 1.1 }}
                transition={{ type: "spring", stiffness: 400, damping: 10 }}
              >
                <SwitchCamera size={16} />
              </motion.span>
              <motion.span
                className="font-medium"
                whileHover={{ x: 2 }}
                transition={{ type: "tween", duration: 0.2 }}
              >
                Switch to Admin View
              </motion.span>
            </Link>
          </div>
        )}
      </div>
    </div>
  );
}