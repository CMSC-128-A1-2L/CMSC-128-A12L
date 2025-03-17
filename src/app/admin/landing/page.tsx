"use client";
import { useState, useEffect, useRef } from "react";
import { Menu, X, LogOut, User, Briefcase, Calendar, Users, MessageCircle, FileText, Plus, Info } from "lucide-react";
import { signOut, useSession } from "next-auth/react";
import Link from "next/link"; 

export default function AdminLanding() {
  const { data: session } = useSession();
  const adminName = session?.user?.name ? `Admin ${session.user.name}` : "Admin TempName";
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const sidebarRef = useRef<HTMLDivElement>(null);
  const menuButtonRef = useRef<HTMLButtonElement>(null);

  // Stat numbers data
  const [totalAlumni, setTotalAlumni] = useState<number | null>(null);
  const [activeJobs, setActiveJobs] = useState<number | null>(null);
  const [upcomingEvents, setUpcomingEvents] = useState<number | null>(null);
  const [newUsers, setNewUsers] = useState<number | null>(null);

  // Same component with alumni-landing
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

  // Fetch stats
  // TODO: add the ff correct api calls
  // TBD: Unsure what is the method for the api calls
  // useEffect(() => {
  //   const fetchStats = () => {
  //     // Fetch total alumni
  //     fetch("/api/stats/total-alumni")
  //       .then((response) => response.json())
  //       .then((data) => setTotalAlumni(data.count ?? null))
  //       .catch((error) => {
  //         console.error("Error fetching total alumni:", error);
  //         setTotalAlumni(null); 
  //       });
  //   };

  //   // fetching stats with interval
  //   fetchStats(); 
  //   const interval = setInterval(fetchStats, 10000);
  //   return () => clearInterval(interval);
  // }, []);
  
  // Helper function for displaying invalid null data
  const displayValue = (value: number | null): string => {
    return value === null ? "-" : value.toString();
  };

  // Sidebar items for admin; connected with links
  // TODO: update Sidebar links if structure is not like this
  const sidebarItems = [
      { name: "Dashboard", icon: <User size={20} />, href: "/admin/dashboard" },
      { name: "Manage Users", icon: <Users size={20} />, href: "/admin/manage-users" },
      { name: "Job Listings", icon: <Briefcase size={20} />, href: "/admin/job-listings" },
      { name: "Events", icon: <Calendar size={20} />, href: "/admin/events" },
      { name: "Communications", icon: <MessageCircle size={20} />, href: "/admin/communications" },
      { name: "Reports", icon: <FileText size={20} />, href: "/admin/reports" },
  ];

  const quickActions = [
    { name: "Create New Event", icon: <Plus size={16} /> },
    { name: "Add New Alumni", icon: <Plus size={16} /> },
    { name: "Generate Reports", icon: <Plus size={16} /> },
  ];
  
  // TODO: find a way to have the alerts vary in message content and layout
  // What if an alert wants their message to be displayed in two separate lines

  // Dummy data for recent alerts section
  const recentAlerts = [
    { title: "Reunion Batch '69", message: "On February 31, 2025 and 134 are interested", time: "2 hours ago" },
    { title: "Area 51 Raid", message: "Ongoing with 1,291 participants", time: "5 hours ago" },
    { title: "Mars Terraformation", message: "On December 31, 4786 with 7,909 are interested", time: "1 day ago" },
  ];


  return (
    <div className="min-h-screen flex flex-col bg-gray-100">

      {/* Admin Topbar */}
      <header className="text-white py-4 bg-icscolor">
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
              <h1 className="text-xl font-bold cursor-pointer">AEGIS  |  Admin Account</h1>
          </div>
          <button
              className="focus:outline-none cursor-pointer"
              aria-label="Sign Out"
              onClick={() => signOut()}
          >
              <LogOut size={20} />
          </button>
          </div>
      </header>

      {/* Sidebar */}
      <div
        ref={sidebarRef}
        className={`fixed inset-y-0 left-0 z-50 w-64 bg-white shadow-lg transform ${sidebarOpen ? "translate-x-0" : "-translate-x-full"} transition-transform duration-300 ease-in-out`}>
        <div className="p-6 border-b border-gray-200 flex justify-between items-center">
          <div className="flex justify-between items-start flex-col">
              <h2 className="text-lg font-bold text-gray-800">AEGIS</h2>
              <h3 className="textarea-md font-bold text-gray-700">Admin Menu</h3>
          </div>
          <button
              onClick={() => setSidebarOpen(false)}
              className="focus:outline-none cursor-pointer text-gray-800"
              aria-label="Close menu"
          >
          <X size={24} />
          </button>
        </div>
        <nav className="mt-4">
        <ul>
          {sidebarItems.map((item, index) => (
          <li key={index}>
              <Link
              href={item.href} // Use the href from the sidebarItems array
              className="flex items-center px-6 py-3 text-gray-700 hover:bg-blue-50 transition-colors cursor-pointer"
              >
              <span className="mr-3 text-blue-600">{item.icon}</span>
              <span className="text-sm font-medium">{item.name}</span>
              </Link>
          </li>
          ))}
        </ul>
        </nav>
      </div>

      {/* Main Content */}
      <main className="flex-grow max-w-7xl mx-auto px-4 py-8 lg:px-8 xl:px-16">
        {/* Welcome Section */}
        <div className="bg-white shadow-lg rounded-3xl p-8 mb-8">
          <h2 className="text-3xl font-bold text-gray-800 mb-4">Welcome, {adminName}!</h2>
          <p className="text-gray-600">
              Thank you for managing the UPLB ICS relations! 
          </p>
        </div>

        {/* 1st Row (Stat Data) */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          <div className="card bg-base-100 shadow-xl hover:shadow-2xl transition-shadow">
            <div className="card-body items-center text-center">
              <h3 className="card-title text-lg">Total Alumni</h3>
              <p className="text-3xl font-bold text-primary">{displayValue(totalAlumni)}</p>
            </div>
          </div>
          <div className="card bg-base-100 shadow-xl hover:shadow-2xl transition-shadow">
            <div className="card-body items-center text-center">
              <h3 className="card-title text-lg">Active Jobs</h3>
              <p className="text-3xl font-bold text-primary">{displayValue(activeJobs)}</p>
            </div>
          </div>
          <div className="card bg-base-100 shadow-xl hover:shadow-2xl transition-shadow">
            <div className="card-body items-center text-center">
              <h3 className="card-title text-lg">Upcoming Events</h3>
              <p className="text-3xl font-bold text-primary">{displayValue(upcomingEvents)}</p>
            </div>
          </div>
          <div className="card bg-base-100 shadow-xl hover:shadow-2xl transition-shadow">
            <div className="card-body items-center text-center">
              <h3 className="card-title text-lg">New Users</h3>
              <p className="text-3xl font-bold text-primary">{displayValue(newUsers)}</p>
            </div>
          </div>
        </div>

        {/* 2nd Row (Quick Actions and Recent Alerts) */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {/* Quick Actions Section */}
          <div className="bg-white shadow-lg rounded-3xl p-6">
            <h2 className="text-2xl font-bold text-gray-800 mb-4">Quick Actions</h2>
            <div className="space-y-4">
              {quickActions.map((action, index) => (
                <button
                  key={index}
                  className="w-full flex justify-between items-center p-4 bg-gray-50 hover:bg-gray-100 rounded-lg transition-colors"
                >
                  <span className="text-gray-700">{action.name}</span>
                  <span className="text-blue-600">{action.icon}</span>
                </button>
              ))}
            </div>
          </div>

          {/* Recent Alerts Section */}
          <div className="bg-white shadow-lg rounded-3xl p-6">
            <h2 className="text-2xl font-bold text-gray-800 mb-4">Recent Alerts</h2>
            <div className="space-y-4">
              {recentAlerts.map((alert, index) => (
                <div key={index} className="flex items-center p-4 bg-gray-50 hover:bg-gray-100 rounded-lg transition-colors">
                  <Info size={20} className="text-blue-600 mr-4" />
                  <div>
                    <b className="text-gray-900">{alert.title}</b>
                    <p className="text-gray-700">{alert.message}</p>
                    <p className="text-sm text-gray-500">{alert.time}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>

      </main>
    </div>
  );
}