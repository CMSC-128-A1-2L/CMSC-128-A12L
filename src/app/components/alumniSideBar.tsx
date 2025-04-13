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
import { useSession } from "next-auth/react";
import { Montserrat } from "next/font/google";
import Image from "next/image";

const montserrat = Montserrat({ subsets: ["latin"] });

interface SidebarProps {
  sidebarOpen: boolean;
  setSidebarOpen: (open: boolean) => void;
  sidebarRef: RefObject<HTMLDivElement>;
  role?: string | string[];
}

// Update the type declaration to match the exact session structure
declare module "next-auth" {
  interface Session {
    user: {
      id: string;
      role: string[];
      email: string;
      accessToken: string;
      imageUrl?: string;
    };
  }
}

export default function AlumniSidebar({
  sidebarOpen,
  setSidebarOpen,
  sidebarRef,
  role,
}: SidebarProps) {
  const { data: session } = useSession();
  console.log("Session data:", session);

  const userName = session?.user?.name || "";
  const displayName = userName || "Alumni User";
  const userImage = session?.user?.image;
  const initial = (userName[0] || "A").toUpperCase();

  const sidebarItems = {
    account: [
      {
        name: displayName,
        icon: <User size={20} />,
        path: "/alumni/profile",
        subtitle: "Alumni",
      },
    ],
    general: [
      {
        name: "Job Board",
        icon: <Briefcase size={20} />,
        path: "/alumni/jobs",
      },
      { name: "Events", icon: <Calendar size={20} />, path: "/alumni/events" },
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

      <nav className="mt-4 flex flex-col h-[calc(100vh-80px)]">
        <div className="flex-1 px-2">
          <div className="mb-6">
            <h3 className="text-gray-500 text-sm font-medium mb-2 px-4">
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

          <div className="h-px bg-gray-200 mx-4 my-4" />

          <div className="mb-6">
            <h3 className="text-gray-500 text-sm font-medium mb-2 px-4">
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

          <div className="h-px bg-gray-200 mx-4 my-4" />

          <div className="mb-6">
            <h3 className="text-gray-500 text-sm font-medium mb-2 px-4">
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

        {role == "admin" && (
          <div className="mt-auto border-t pt-2 px-2 pb-4">
            <Link
              href="/admin"
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
                Switch to Admin View
              </motion.span>
            </Link>
          </div>
        )}
      </nav>
    </div>
  );
}
