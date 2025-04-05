"use client";
import { useSession } from "next-auth/react";
import { useState, useEffect, useRef } from "react";
import { redirect } from "next/navigation";
import Navbar from "@/app/components/navBar";
import AdminSidebar from "@/app/components/adminSideBar";
import { motion } from 'framer-motion';
import { Search, Filter, Download, Calendar, User, Activity, Clock } from 'lucide-react';
import { LogsDto } from "@/models/logs";

export default function AdminLogs() {
  const { data: session, status } = useSession();
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const sidebarRef = useRef<HTMLDivElement>(null);
  const menuButtonRef = useRef<HTMLButtonElement>(null);
  const [activeTab, setActiveTab] = useState('all');
  const [searchQuery, setSearchQuery] = useState('');
  const [dateRange, setDateRange] = useState('last7days');
  const [logs, setLogs] = useState<LogsDto[]>([]);
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage] = useState(10);
  const [filteredLogs, setFilteredLogs] = useState<LogsDto[]>([]);

  useEffect(() => {
    const fetchLogs = async () => {
      const response = await fetch("/api/admin/logs");
      const data = await response.json();
      console.log("The fetched logs are: ", data);
      setLogs(data);
      setFilteredLogs(data);
    }
    fetchLogs();
  }, []);

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

  // Filter logs based on search query, date range, and active tab
  useEffect(() => {
    let filtered = [...logs];

    // Filter by search query
    if (searchQuery) {
      filtered = filtered.filter(log => 
        log.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        log.action.toLowerCase().includes(searchQuery.toLowerCase()) ||
        log.ipAddress?.toLowerCase().includes(searchQuery.toLowerCase())
      );
    }

    // Filter by HTTP method
    if (activeTab !== 'all') {
      filtered = filtered.filter(log => 
        log.action.startsWith(activeTab)
      );
    }

    // Filter by date range
    const now = new Date();
    const today = new Date(now.getFullYear(), now.getMonth(), now.getDate());
    const yesterday = new Date(today);
    yesterday.setDate(yesterday.getDate() - 1);
    const last7Days = new Date(today);
    last7Days.setDate(last7Days.getDate() - 7);
    const last30Days = new Date(today);
    last30Days.setDate(last30Days.getDate() - 30);

    filtered = filtered.filter(log => {
      const logDate = new Date(log.timestamp);
      switch (dateRange) {
        case 'today':
          return logDate >= today;
        case 'yesterday':
          return logDate >= yesterday && logDate < today;
        case 'last7days':
          return logDate >= last7Days;
        case 'last30days':
          return logDate >= last30Days;
        default:
        // case 'custom': (don't know whether to put a modal here)
          return true;
      }
    });

    setFilteredLogs(filtered);
    setCurrentPage(1); // Reset to first page when filters change
  }, [logs, searchQuery, activeTab, dateRange]);

  // Calculate pagination
  const indexOfLastItem = currentPage * itemsPerPage;
  const indexOfFirstItem = indexOfLastItem - itemsPerPage;
  const currentItems = filteredLogs.slice(indexOfFirstItem, indexOfLastItem);
  const totalPages = Math.ceil(filteredLogs.length / itemsPerPage);

  const handlePageChange = (pageNumber: number) => {
    setCurrentPage(pageNumber);
  };

  const handlePreviousPage = () => {
    if (currentPage > 1) {
      setCurrentPage(currentPage - 1);
    }
  };

  const handleNextPage = () => {
    if (currentPage < totalPages) {
      setCurrentPage(currentPage + 1);
    }
  };

  // Generate page numbers for pagination
  const getPageNumbers = () => {
    const pageNumbers = [];
    const maxVisiblePages = 3;
    
    if (totalPages <= maxVisiblePages) {
      for (let i = 1; i <= totalPages; i++) {
        pageNumbers.push(i);
      }
    } else {
      if (currentPage <= 2) {
        for (let i = 1; i <= 3; i++) {
          pageNumbers.push(i);
        }
      } else if (currentPage >= totalPages - 1) {
        for (let i = totalPages - 2; i <= totalPages; i++) {
          pageNumbers.push(i);
        }
      } else {
        for (let i = currentPage - 1; i <= currentPage + 1; i++) {
          pageNumbers.push(i);
        }
      }
    }
    
    return pageNumbers;
  };

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
            </div>
          </div>

          {/* Tabs */}
          <div className="flex overflow-x-auto mb-6 pb-2">
            {['all', 'GET', 'POST', 'PUT', 'DELETE'].map((tab) => (
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
                {tab}
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
                  <option value="today" className="bg-[#1a237e] text-white">Today</option>
                  <option value="yesterday" className="bg-[#1a237e] text-white">Yesterday</option>
                  <option value="last7days" className="bg-[#1a237e] text-white">Last 7 Days</option>
                  <option value="last30days" className="bg-[#1a237e] text-white">Last 30 Days</option>
                  <option value="custom" className="bg-[#1a237e] text-white">Custom Range</option>
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
                  <th className="px-6 py-3 text-left text-xs font-medium text-white uppercase tracking-wider">IP Address</th>
                </tr>
              </thead>
              <tbody className="bg-white/5 divide-y divide-white/10">
                {currentItems.map((log) => (
                  <motion.tr 
                    key={log._id}
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
                          <div className="text-sm font-medium">{log.name}</div>
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
                        <span>{log.timestamp.toLocaleString()}</span>
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-white">
                      {log.ipAddress}
                    </td>
                  </motion.tr>
                ))}
              </tbody>
            </table>
          </div>

          {/* Pagination */}
          <div className="flex justify-between items-center mt-6">
            <div className="text-white text-sm">
              Showing {indexOfFirstItem + 1} to {Math.min(indexOfLastItem, filteredLogs.length)} of {filteredLogs.length} entries
            </div>
            <div className="flex space-x-2">
              <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                onClick={handlePreviousPage}
                disabled={currentPage === 1}
                className={`px-4 py-2 rounded-lg ${
                  currentPage === 1 
                    ? 'bg-white/5 text-white/50 cursor-not-allowed' 
                    : 'bg-white/10 text-white hover:bg-white/20'
                }`}
              >
                Previous
              </motion.button>
              {getPageNumbers().map((number) => (
                <motion.button
                  key={number}
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  onClick={() => handlePageChange(number)}
                  className={`px-4 py-2 rounded-lg ${
                    currentPage === number
                      ? 'bg-white text-[#1a237e] font-semibold'
                      : 'bg-white/10 text-white hover:bg-white/20'
                  }`}
                >
                  {number}
                </motion.button>
              ))}
              <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                onClick={handleNextPage}
                disabled={currentPage === totalPages}
                className={`px-4 py-2 rounded-lg ${
                  currentPage === totalPages
                    ? 'bg-white/5 text-white/50 cursor-not-allowed'
                    : 'bg-white/10 text-white hover:bg-white/20'
                }`}
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
