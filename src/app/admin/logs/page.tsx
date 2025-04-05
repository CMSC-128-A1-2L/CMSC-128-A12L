"use client";
import { useSession } from "next-auth/react";
import { useState, useEffect, useRef } from "react";
import { redirect } from "next/navigation";
import Navbar from "@/app/components/navBar";
import AdminSidebar from "@/app/components/adminSideBar";
import { motion } from 'framer-motion';
import { Search, Filter, Download, Calendar, User, Activity, Clock } from 'lucide-react';

export default function AdminLogs() {
  const { data: session, status } = useSession();
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const sidebarRef = useRef<HTMLDivElement>(null);
  const menuButtonRef = useRef<HTMLButtonElement>(null);
  const [activeTab, setActiveTab] = useState('all');
  const [searchQuery, setSearchQuery] = useState('');
  const [dateRange, setDateRange] = useState('last7days');

  // Sample log data
  const logs = [
    { id: 1, user: 'John Doe', action: 'Login', timestamp: '2023-04-01 09:30:45', status: 'Success', ip: '192.168.1.1' },
    { id: 2, user: 'Jane Smith', action: 'Create Event', timestamp: '2023-04-01 10:15:22', status: 'Success', ip: '192.168.1.2' },
    { id: 3, user: 'Robert Johnson', action: 'Update Profile', timestamp: '2023-04-01 11:05:10', status: 'Success', ip: '192.168.1.3' },
    { id: 4, user: 'Emily Davis', action: 'Delete Opportunity', timestamp: '2023-04-01 12:30:15', status: 'Failed', ip: '192.168.1.4' },
    { id: 5, user: 'Michael Wilson', action: 'Login', timestamp: '2023-04-01 13:45:30', status: 'Success', ip: '192.168.1.5' },
    { id: 6, user: 'Sarah Brown', action: 'Create Opportunity', timestamp: '2023-04-01 14:20:05', status: 'Success', ip: '192.168.1.6' },
    { id: 7, user: 'David Miller', action: 'Update Event', timestamp: '2023-04-01 15:10:40', status: 'Success', ip: '192.168.1.7' },
    { id: 8, user: 'Jennifer Taylor', action: 'Login', timestamp: '2023-04-01 16:25:15', status: 'Failed', ip: '192.168.1.8' },
    { id: 9, user: 'William Anderson', action: 'Delete Event', timestamp: '2023-04-01 17:05:50', status: 'Success', ip: '192.168.1.9' },
    { id: 10, user: 'Elizabeth Thomas', action: 'Create User', timestamp: '2023-04-01 18:30:25', status: 'Success', ip: '192.168.1.10' },
  ];

  useEffect(() => {
    if (status === "unauthenticated") {
      console.log("You've been logged out due to inactivity");
      redirect("/login");
    }
  }, [status]);

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
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, [sidebarOpen]);

  if (!session) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-white">
        <h2
          className="text-3xl font-bold text-center text-gray-800"
          style={{ fontFamily: "Montserrat, sans-serif" }}
        >
          Not Authenticated
        </h2>
      </div>
    );
  }

  return (
    <div className="min-h-screen flex flex-col bg-gradient-to-br from-[#1a237e] to-[#0d47a1]">
      <Navbar
        setSidebarOpen={setSidebarOpen}
        menuButtonRef={menuButtonRef}
        homePath="/admin-landing"
      />

      <AdminSidebar
        sidebarOpen={sidebarOpen}
        setSidebarOpen={setSidebarOpen}
        sidebarRef={sidebarRef}
        role={session.user.role}
      />

      <main className="flex-grow container mx-auto px-4 py-8 lg:ml-64 transition-all duration-300">
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="bg-white/10 backdrop-blur-md shadow-xl rounded-3xl p-6 w-full"
        >
          <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-6">
            <h2
              className="text-3xl font-bold text-white mb-4 md:mb-0"
              style={{ fontFamily: "Montserrat, sans-serif" }}
            >
              System Logs
            </h2>
            <div className="flex space-x-2">
              <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                className="bg-white/20 hover:bg-white/30 text-white px-4 py-2 rounded-lg flex items-center"
              >
                <Download className="w-4 h-4 mr-2" />
                Export
              </motion.button>
              <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                className="bg-white/20 hover:bg-white/30 text-white px-4 py-2 rounded-lg flex items-center"
              >
                <Filter className="w-4 h-4 mr-2" />
                Filter
              </motion.button>
            </div>
          </div>

          {/* Tabs */}
          <div className="flex overflow-x-auto mb-6 pb-2">
            {['all', 'login', 'create', 'update', 'delete', 'failed'].map((tab) => (
              <motion.button
                key={tab}
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                onClick={() => setActiveTab(tab)}
                className={`px-4 py-2 mr-2 rounded-lg whitespace-nowrap ${
                  activeTab === tab 
                    ? 'bg-white text-[#1a237e] font-semibold' 
                    : 'bg-white/10 text-white hover:bg-white/20'
                }`}
              >
                {tab.charAt(0).toUpperCase() + tab.slice(1)}
              </motion.button>
            ))}
          </div>

          {/* Search and Filter */}
          <div className="flex flex-col md:flex-row gap-4 mb-6">
            <div className="relative flex-grow">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
              <input
                type="text"
                placeholder="Search logs..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full pl-10 pr-4 py-2 rounded-lg bg-white/10 text-white placeholder-gray-300 border border-white/20 focus:outline-none focus:ring-2 focus:ring-white/30"
              />
            </div>
            <div className="flex space-x-2">
              <div className="relative">
                <Calendar className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
                <select
                  value={dateRange}
                  onChange={(e) => setDateRange(e.target.value)}
                  className="pl-10 pr-4 py-2 rounded-lg bg-white/10 text-white border border-white/20 focus:outline-none focus:ring-2 focus:ring-white/30 appearance-none"
                >
                  <option value="today">Today</option>
                  <option value="yesterday">Yesterday</option>
                  <option value="last7days">Last 7 Days</option>
                  <option value="last30days">Last 30 Days</option>
                  <option value="custom">Custom Range</option>
                </select>
              </div>
            </div>
          </div>

          {/* Logs Table */}
          <div className="overflow-x-auto rounded-lg border border-white/20">
            <table className="min-w-full divide-y divide-white/20">
              <thead className="bg-white/10">
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-medium text-white uppercase tracking-wider">User</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-white uppercase tracking-wider">Action</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-white uppercase tracking-wider">Timestamp</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-white uppercase tracking-wider">Status</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-white uppercase tracking-wider">IP Address</th>
                </tr>
              </thead>
              <tbody className="bg-white/5 divide-y divide-white/10">
                {logs.map((log) => (
                  <motion.tr 
                    key={log.id}
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    transition={{ duration: 0.3 }}
                    className="hover:bg-white/10 transition-colors"
                  >
                    <td className="px-6 py-4 whitespace-nowrap text-white">
                      <div className="flex items-center">
                        <div className="flex-shrink-0 h-8 w-8 bg-white/20 rounded-full flex items-center justify-center">
                          <User className="w-4 h-4 text-white" />
                        </div>
                        <div className="ml-3">
                          <div className="text-sm font-medium">{log.user}</div>
                        </div>
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-white">
                      <div className="flex items-center">
                        <Activity className="w-4 h-4 mr-2 text-white" />
                        <span>{log.action}</span>
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-white">
                      <div className="flex items-center">
                        <Clock className="w-4 h-4 mr-2 text-white" />
                        <span>{log.timestamp}</span>
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <span className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${
                        log.status === 'Success' 
                          ? 'bg-green-100 text-green-800' 
                          : log.status === 'Failed'
                            ? 'bg-red-100 text-red-800'
                            : 'bg-gray-100 text-gray-800'
                      }`}>
                        {log.status}
                      </span>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-white">
                      {log.ip}
                    </td>
                  </motion.tr>
                ))}
              </tbody>
            </table>
          </div>

          {/* Pagination */}
          <div className="flex justify-between items-center mt-6">
            <div className="text-white text-sm">
              Showing 1 to 10 of 50 entries
            </div>
            <div className="flex space-x-2">
              <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                className="px-4 py-2 rounded-lg bg-white/10 text-white hover:bg-white/20"
              >
                Previous
              </motion.button>
              <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                className="px-4 py-2 rounded-lg bg-white text-[#1a237e] font-semibold"
              >
                1
              </motion.button>
              <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                className="px-4 py-2 rounded-lg bg-white/10 text-white hover:bg-white/20"
              >
                2
              </motion.button>
              <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                className="px-4 py-2 rounded-lg bg-white/10 text-white hover:bg-white/20"
              >
                3
              </motion.button>
              <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                className="px-4 py-2 rounded-lg bg-white/10 text-white hover:bg-white/20"
              >
                Next
              </motion.button>
            </div>
          </div>
        </motion.div>
      </main>
    </div>
  );
}
