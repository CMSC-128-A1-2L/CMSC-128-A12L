"use client";
import { signOut, useSession } from "next-auth/react";
import { Menu, LogOut, User, X, Bell, ChevronDown } from "lucide-react";
import Link from "next/link";
import { RefObject, useState, useEffect } from "react";
import { UserRole } from "@/entities/user";
import { usePathname } from "next/navigation";
import { motion } from "framer-motion";
import { useUnreadNotificationCount } from "@/hooks/useUnreadNotificationCount";

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
  const { unreadCount, loading } = useUnreadNotificationCount();
  
  // Determine the role label and profile path based on the user's role
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
  const isAdmin = session?.user?.role?.includes(UserRole.ADMIN);
  const profilePath = "/alumni/profile"
  
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
            <motion.div 
              className="flex items-center cursor-pointer"
              whileHover={{ scale: 1.05 }}
            >
              <div className="w-24 h-8">
                <svg viewBox="0 14.3 135.35 32.5" className="w-full h-full text-white">
                  <motion.path
                    initial={{ pathLength: 0 }}
                    animate={{ pathLength: 1 }}
                    transition={{ duration: 4, ease: "easeInOut" }}
                    d="M11.50 28.30L21.80 28.30L22.15 29.25L10.75 29.25L11.50 28.30M34.85 45.60Q35.05 45.60 35.05 45.90Q35.05 46.20 34.85 46.20Q33.95 46.20 31.95 46.10Q30.05 46 29.15 46Q28.10 46 26.40 46.10Q24.80 46.20 24 46.20Q23.80 46.20 23.80 45.90Q23.80 45.60 24 45.60Q26.05 45.60 26.95 45.23Q27.85 44.85 27.85 43.95Q27.85 43.25 27.30 42L16 17.70L16.95 16.85L7.30 40.05Q6.60 41.75 6.60 42.85Q6.60 44.30 7.80 44.95Q9 45.60 11.55 45.60Q11.80 45.60 11.80 45.90Q11.80 46.20 11.55 46.20Q10.65 46.20 8.95 46.10Q7.05 46 5.65 46Q4.40 46 2.70 46.10Q1.20 46.20 0.25 46.20Q0 46.20 0 45.90Q0 45.60 0.25 45.60Q1.65 45.60 2.63 45.10Q3.60 44.60 4.48 43.30Q5.35 42 6.35 39.60L16.80 14.45Q16.90 14.30 17.13 14.30Q17.35 14.30 17.40 14.45L29 39.35Q30.15 41.90 31.05 43.23Q31.95 44.55 32.83 45.08Q33.70 45.60 34.85 45.60ZM37.25 46.20Q37.15 46.20 37.15 45.90Q37.15 45.60 37.25 45.60Q39.20 45.60 40.13 45.35Q41.05 45.10 41.38 44.38Q41.70 43.65 41.70 42.15L41.70 19Q41.70 17.50 41.38 16.80Q41.05 16.10 40.13 15.83Q39.20 15.55 37.25 15.55Q37.15 15.55 37.15 15.25Q37.15 14.95 37.25 14.95L57.05 14.95Q57.50 14.95 57.50 15.40L57.60 21.45Q57.60 21.60 57.33 21.60Q57.05 21.60 57.05 21.45Q57.05 18.90 55.70 17.40Q54.35 15.90 52.15 15.90L48.70 15.90Q46.80 15.90 45.90 16.15Q45 16.40 44.67 17.10Q44.35 17.80 44.35 19.30L44.35 41.95Q44.35 43.40 44.67 44.08Q45 44.75 45.88 45Q46.75 45.25 48.70 45.25L53.30 45.25Q55.30 45.25 56.72 43.50Q58.15 41.75 58.55 38.90Q58.55 38.75 58.85 38.78Q59.15 38.80 59.15 38.95Q58.70 42.10 58.70 45.45Q58.70 45.85 58.52 46.03Q58.35 46.20 57.90 46.20L37.25 46.20M55.10 34.45Q55.10 32.20 54.15 31.30Q53.20 30.40 50.80 30.40L43.10 30.40L43.10 29.45L50.95 29.45Q53.25 29.45 54.15 28.68Q55.05 27.90 55.05 26Q55.05 25.90 55.35 25.90Q55.65 25.90 55.65 26L55.60 29.95Q55.60 31.40 55.65 32.10L55.70 34.45Q55.70 34.55 55.40 34.55Q55.10 34.55 55.10 34.45ZM81.90 46.80Q76.45 46.80 72.43 44.70Q68.40 42.60 66.28 39Q64.15 35.40 64.15 30.95Q64.15 26.10 66.63 22.35Q69.10 18.60 73.43 16.50Q77.75 14.40 83.20 14.40Q85.65 14.40 87.83 14.90Q90 15.40 91.45 16.30Q91.80 16.55 91.88 16.73Q91.95 16.90 91.98 17.13Q92 17.35 92 17.45L92.60 22.70Q92.60 22.85 92.33 22.88Q92.05 22.90 92 22.75Q91.05 19.20 88.25 17.33Q85.45 15.45 81.15 15.45Q74.55 15.45 70.90 19.10Q67.25 22.75 67.25 29.20Q67.25 34 69.30 37.83Q71.35 41.65 74.98 43.80Q78.60 45.95 83.10 45.95Q85.80 45.95 87.28 45.50Q88.75 45.05 89.43 43.75Q90.10 42.45 90.10 39.90Q90.10 37.30 89.75 36.28Q89.40 35.25 88.25 34.90Q87.10 34.55 84.25 34.55Q83.95 34.55 83.95 34.15Q83.95 34 84.03 33.88Q84.10 33.75 84.20 33.75Q88.05 34 90.40 34Q92.65 34 95.20 33.85Q95.30 33.85 95.38 33.98Q95.45 34.10 95.45 34.20Q95.45 34.55 95.20 34.55Q93.90 34.50 93.35 34.88Q92.80 35.25 92.65 36.40Q92.50 37.55 92.50 40.40Q92.50 42.65 92.68 43.60Q92.85 44.55 92.85 44.80Q92.85 45.10 92.75 45.20Q92.65 45.30 92.30 45.40Q86.45 46.80 81.90 46.80ZM106.95 42.15Q106.95 43.70 107.27 44.40Q107.60 45.10 108.50 45.35Q109.40 45.60 111.40 45.60Q111.50 45.60 111.50 45.90Q111.50 46.20 111.40 46.20Q109.90 46.20 109.05 46.15L105.55 46.10L102.20 46.15Q101.30 46.20 99.75 46.20Q99.60 46.20 99.60 45.90Q99.60 45.60 99.75 45.60Q101.70 45.60 102.63 45.35Q103.55 45.10 103.90 44.38Q104.25 43.65 104.25 42.15L104.25 19Q104.25 17.50 103.90 16.80Q103.55 16.10 102.63 15.83Q101.70 15.55 99.75 15.55Q99.60 15.55 99.60 15.25Q99.60 14.95 99.75 14.95L102.20 15Q104.30 15.10 105.55 15.10Q106.95 15.10 109.05 15L111.40 14.95Q111.50 14.95 111.50 15.25Q111.50 15.55 111.40 15.55Q109.45 15.55 108.52 15.85Q107.60 16.15 107.27 16.88Q106.95 17.60 106.95 19.10L106.95 42.15ZM120.75 21Q120.75 23 121.70 24.45Q122.65 25.90 124.02 26.88Q125.40 27.85 127.85 29.30Q130.45 30.85 131.88 31.88Q133.30 32.90 134.32 34.50Q135.35 36.10 135.35 38.35Q135.35 40.70 134.20 42.63Q133.05 44.55 130.78 45.68Q128.50 46.80 125.20 46.80Q123.45 46.80 121.88 46.43Q120.30 46.05 118.40 45.10Q118.15 44.95 118.07 44.75Q118 44.55 117.95 44.15L117.20 37.65L117.20 37.60Q117.20 37.40 117.45 37.38Q117.70 37.35 117.75 37.55Q118.25 41 120.40 43.55Q122.55 46.10 126.30 46.10Q128.95 46.10 130.78 44.65Q132.60 43.20 132.60 40.10Q132.60 37.85 131.60 36.23Q130.60 34.60 129.17 33.53Q127.75 32.45 125.30 31Q122.90 29.60 121.52 28.55Q120.15 27.50 119.17 25.93Q118.20 24.35 118.20 22.15Q118.20 19.65 119.47 17.90Q120.75 16.15 122.80 15.28Q124.85 14.40 127.20 14.40Q129.95 14.40 132.90 15.60Q133.65 15.90 133.65 16.45L134.10 21.75Q134.10 21.95 133.82 21.95Q133.55 21.95 133.50 21.75Q133.30 19.15 131.55 17.10Q129.80 15.05 126.55 15.05Q123.55 15.05 122.15 16.80Q120.75 18.55 120.75 21Z"
                    stroke="currentColor"
                    strokeWidth="1"
                    fill="none"
                  />
                </svg>
              </div>
              <span className="mx-2 text-gray-300/50 hidden sm:inline">•</span>
              <span className="text-sm text-gray-300 hidden sm:inline">{currentRole}</span>
            </motion.div>
          </Link>
        </div>
        
        {/* Desktop Navigation */}
        <div className="hidden md:flex items-center space-x-8">
          {session ? (
            <>
              {(session?.user.role.includes(UserRole.ALUMNI) && pathname?.includes('/alumni')) && (
                <>
                  <Link href="/alumni/notifications" className="text-sm font-medium hover:text-gray-200 transition-colors relative group">
                    <span className="flex items-center">
                      <div className="relative">
                        <Bell size={18} className="mr-3.5" />
                        {!loading && unreadCount > 0 && (
                          <span className="absolute -top-2 -right-0.25 bg-red-500 text-white text-xs rounded-full w-5 h-5 flex items-center justify-center">
                            {unreadCount > 99 ? '99+' : unreadCount}
                          </span>
                        )}
                      </div>
                      <span>NOTIFICATIONS</span>
                    </span>
                    <span className="absolute -bottom-1 left-0 w-0 h-0.5 bg-white transition-all duration-300 group-hover:w-full"></span>
                  </Link>
                  <Link href={profilePath} className="text-sm font-medium hover:text-gray-200 transition-colors relative group">
                    <span className="flex items-center">
                      <User size={18} className="mr-1" />
                      <span>PROFILE</span>
                    </span>
                    <span className="absolute -bottom-1 left-0 w-0 h-0.5 bg-white transition-all duration-300 group-hover:w-full"></span>
                  </Link>
                </>
              )}
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
            {mobileMenuOpen ? <X size={24} /> : <ChevronDown size={24} />}
          </button>
        </div>
      </div>
      
      {/* Mobile Menu */}
      {mobileMenuOpen && (
        <div className="md:hidden bg-[#1a1f4d] border-t border-gray-700 py-4 px-4">
          <div className="flex flex-col space-y-4">
            {session ? (
              <>
                {session?.user.role.includes(UserRole.ALUMNI) && (
                  <>
                    <Link 
                      href="/alumni/notifications" 
                      className="text-sm font-medium hover:text-gray-200 transition-colors flex items-center py-2"
                      onClick={() => setMobileMenuOpen(false)}
                    >
                      <div className="relative mr-2">
                        <Bell size={18} />
                        {!loading && unreadCount > 0 && (
                          <span className="absolute -top-2 -right-2 bg-red-500 text-white text-xs rounded-full w-5 h-5 flex items-center justify-center">
                            {unreadCount > 99 ? '99+' : unreadCount}
                          </span>
                        )}
                      </div>
                      <span>NOTIFICATIONS</span>
                    </Link>
                    <Link 
                      href={profilePath} 
                      className="text-sm font-medium hover:text-gray-200 transition-colors flex items-center py-2"
                      onClick={() => setMobileMenuOpen(false)}
                    >
                      <User size={18} className="mr-2" />
                      <span>PROFILE</span>
                    </Link>
                  </>
                )}
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