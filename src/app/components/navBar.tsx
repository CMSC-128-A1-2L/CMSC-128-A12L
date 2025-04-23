"use client";
import { signOut, useSession } from "next-auth/react";
import { Menu, LogOut, User, X } from "lucide-react";
import Link from "next/link";
import { RefObject, useState, useEffect } from "react";
import { UserRole } from "@/entities/user";
import { usePathname } from "next/navigation";

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
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const pathname = usePathname();
  
  // Determine the role label and profile path based on the user's role
  const isAdmin = session?.user?.role?.includes(UserRole.ADMIN);
  const roleLabel = isAdmin ? "Admin" : "Alumni";
  const profilePath = isAdmin ? "/admin/profile" : "/alumni/profile";
  
  const toggleMobileMenu = () => {
    setMobileMenuOpen(!mobileMenuOpen);
  };
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
              <span className="ml-2 text-sm text-gray-300 hidden sm:inline">{roleLabel}</span>
            </div>
          </Link>
        </div>
        
        {/* Desktop Navigation */}
        <div className="hidden md:flex items-center space-x-8">
          {session ? (
            <>
              {session?.user.role.includes(UserRole.ALUMNI) ? (<Link href={profilePath} className="text-sm font-medium hover:text-gray-200 transition-colors relative group">
                <span className="flex items-center">
                  <User size={18} className="mr-1" />
                  <span>PROFILE</span>
                </span>
                <span className="absolute -bottom-1 left-0 w-0 h-0.5 bg-white transition-all duration-300 group-hover:w-full"></span>
              </Link>) : ""}
              <button
                onClick={() => signOut()}
                className="text-sm font-medium hover:text-gray-200 transition-colors relative group focus:outline-none cursor-pointer"
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
        
        {/* Mobile Menu Button */}
        <div className="md:hidden">
          <button
            onClick={toggleMobileMenu}
            className="focus:outline-none cursor-pointer hover:text-gray-300 transition-colors"
            aria-label="Toggle mobile menu"
          >
            {mobileMenuOpen ? <X size={24} /> : <Menu size={24} />}
          </button>
        </div>
      </div>
      
      {/* Mobile Menu */}
      {mobileMenuOpen && (
        <div className="md:hidden bg-[#1a1f4d] border-t border-gray-700 py-4 px-4">
          <div className="flex flex-col space-y-4">
            {session ? (
              <>
                <Link 
                  href={profilePath} 
                  className="text-sm font-medium hover:text-gray-200 transition-colors flex items-center py-2"
                  onClick={() => setMobileMenuOpen(false)}
                >
                  <User size={18} className="mr-2" />
                  <span>PROFILE</span>
                </Link>
                
                <button
                  onClick={() => {
                    signOut();
                    setMobileMenuOpen(false);
                  }}
                  className="text-sm font-medium hover:text-gray-200 transition-colors flex items-center py-2 focus:outline-none cursor-pointer text-left"
                  aria-label="Sign Out"
                >
                  <LogOut size={18} className="mr-2" />
                  <span>LOGOUT</span>
                </button>
              </>
            ) : (
              <div className="text-sm text-gray-300">Not logged in</div>
            )}
          </div>
        </div>
      )}
    </header>
  );
}