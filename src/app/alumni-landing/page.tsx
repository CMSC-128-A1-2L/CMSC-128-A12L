"use client";
import { signOut, useSession } from "next-auth/react";
import { useState, useEffect, useRef } from "react";
import Link from "next/link";
import { Menu, X, LogOut, User, Briefcase, Calendar, DollarSign, Bell, Users } from "lucide-react";
import { redirect } from "next/navigation";

export default function AlumniLanding() {
  const { data: session } = useSession({
    required: true,
    onUnauthenticated() {
      redirect("/login");
    }
  }
  );
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const sidebarRef = useRef<HTMLDivElement>(null);
  const menuButtonRef = useRef<HTMLButtonElement>(null);

  // Handle clicks outside the sidebar to close it
  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (
        sidebarOpen &&
        sidebarRef.current &&
        !sidebarRef.current.contains(event.target as Node) &&
        menuButtonRef.current &&
        !menuButtonRef.current.contains(event.target as Node)
      ) {
        setSidebarOpen(false);
      }
    }

    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, [sidebarOpen]);

  const sidebarItems = [
    { name: "Profile", icon: <User size={20} /> },
    { name: "Job Listings", icon: <Briefcase size={20} /> },
    { name: "Events", icon: <Calendar size={20} /> },
    { name: "Donations", icon: <DollarSign size={20} /> },
    { name: "Notifications", icon: <Bell size={20} /> },
    { name: "Alumni", icon: <Users size={20} /> },
  ];

  return (
    <div className="min-h-screen flex flex-col bg-white">
      {/* Blue Topbar */}
      <header style={{ backgroundColor: "#0C0051" }} className="text-white py-4">
        <div className="container mx-auto px-4 flex justify-between items-center">
          <div className="flex items-center">
            <button
              ref={menuButtonRef}
              onClick={() => setSidebarOpen(!sidebarOpen)}
              className="mr-4 focus:outline-none cursor-pointer"
              aria-label="Toggle menu"
            >
              <Menu size={24} />
            </button>
            <Link href="/alumni-landing">
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

      {/* Sidebar */}
      <div
        ref={sidebarRef}
        className={`fixed inset-y-0 left-0 z-50 w-64 bg-white shadow-lg transform ${sidebarOpen ? "translate-x-0" : "-translate-x-full"
          } transition-transform duration-300 ease-in-out`}
      >
        <div className="p-4 flex justify-between items-center border-b">
          <h2 className="text-lg font-bold text-gray-800">AEGIS Menu</h2>
          <button
            onClick={() => setSidebarOpen(false)}
            className="focus:outline-none cursor-pointer"
            aria-label="Close menu"
          >
            <X size={24} />
          </button>
        </div>
        <nav className="mt-4">
          <ul>
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
        </nav>
      </div>

      {/* Main Content */}
      <main className="flex-grow container mx-auto px-4 py-8 flex items-center justify-center">
        <div className="bg-white shadow-lg rounded-3xl p-8 max-w-2xl w-full">
          <h2 className="text-3xl font-bold text-center text-gray-800 mb-6" style={{ fontFamily: "Montserrat, sans-serif" }}>
            Welcome to AEGIS!
          </h2>
          <p className="text-gray-600" style={{ fontFamily: "Montserrat, sans-serif" }}>
            Lorem ipsum dolor sit amet, consectetur adipiscing elit. Nullam pulvinar risus non risus hendrerit venenatis.
            Pellentesque sit amet hendrerit risus, sed porttitor quam. Magna etiam tempor orci eu lobortis elementum nibh.
            Amet est placerat in egestas erat imperdiet. Tempus urna et pharetra pharetra massa massa ultricies mi quis.
          </p>
        </div>
      </main>

    </div>
  );
}