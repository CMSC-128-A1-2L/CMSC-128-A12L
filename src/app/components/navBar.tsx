"use client";
import { signOut } from "next-auth/react";
import { Menu, LogOut } from "lucide-react";
import Link from "next/link";
import { RefObject } from "react";

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
  return (
    <header style={{ backgroundColor: "#0C0051" }} className="text-white py-4">
      <div className="container mx-auto px-4 flex justify-between items-center">
        <div className="flex items-center">
          <button
            ref={menuButtonRef}
            onClick={() => setSidebarOpen((prev) => !prev)}
            className="mr-4 focus:outline-none cursor-pointer"
            aria-label="Toggle menu"
          >
            <Menu size={24} />
          </button>
          <Link href={homePath}>
            <h1 className="text-xl font-bold cursor-pointer">AEGIS |</h1>
          </Link>
        </div>
        <div className="flex items-center space-x-4">
          <button
            onClick={() => signOut()}
            className="focus:outline-none cursor-pointer"
            aria-label="Sign Out"
          >
            <LogOut size={20} />
          </button>
        </div>
      </div>
    </header>
  );
}
