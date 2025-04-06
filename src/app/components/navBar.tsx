"use client";
import { signOut, useSession } from "next-auth/react";
import { Menu, LogOut, User } from "lucide-react";
import Link from "next/link";
import { RefObject } from "react";
import { UserRole } from "@/entities/user";

interface NavbarProps {
  setSidebarOpen: (open: boolean) => void;
  menuButtonRef: RefObject<HTMLButtonElement>;
  homePath: string;
}

export default function Navbar({
  setSidebarOpen,
  menuButtonRef,
  homePath,
}: NavbarProps) {
  const { data: session } = useSession();
  
  // Determine the role label based on the user's role
  const isAdmin = session?.user?.role?.includes(UserRole.ADMIN);
  const roleLabel = isAdmin ? "Admin" : "Alumni";
  
  return (
    <header className="fixed top-0 left-0 w-full bg-[#1a1f4d] text-white py-4 z-50 shadow-md">
      <div className="container mx-auto px-4 flex justify-between items-center">
        <div className="flex items-center">
          <button
            ref={menuButtonRef}
            onClick={() => {
              // Get current state and toggle it
              const currentState = document.querySelector('.sidebar')?.classList.contains('open');
              setSidebarOpen(!currentState);
            }}
            className="mr-4 focus:outline-none cursor-pointer hover:text-gray-300 transition-colors"
            aria-label="Toggle menu"
          >
            <Menu size={24} />
          </button>
          <Link href={homePath}>
            <div className="flex items-center cursor-pointer">
              <h1 className="text-xl font-bold tracking-wide">AEGIS</h1>
              <span className="ml-1 text-gray-300">|</span>
              <span className="ml-2 text-sm text-gray-300">{roleLabel}</span>
            </div>
          </Link>
        </div>
        
        <div className="flex items-center space-x-8">
          {session ? (
            <>
              <Link href="/profile" className="text-sm font-medium hover:text-gray-200 transition-colors relative group">
                <span className="flex items-center">
                  <User size={18} className="mr-1" />
                  <span>PROFILE</span>
                </span>
                <span className="absolute -bottom-1 left-0 w-0 h-0.5 bg-white transition-all duration-300 group-hover:w-full"></span>
              </Link>
              
              <button
                onClick={() => signOut()}
                className="text-sm font-medium hover:text-gray-200 transition-colors relative group focus:outline-none"
                aria-label="Sign Out"
              >
                <span className="flex items-center">
                  <LogOut size={18} className="mr-1" />
                  <span>LOGOUT</span>
                </span>
                <span className="absolute -bottom-1 left-0 w-0 h-0.5 bg-white transition-all duration-300 group-hover:w-full"></span>
              </button>
            </>
          ) : null}
        </div>
      </div>
    </header>
  );
}
