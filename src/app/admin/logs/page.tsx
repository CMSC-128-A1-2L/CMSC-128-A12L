"use client";
import { useSession } from "next-auth/react";
import { useState, useEffect } from "react";
import { motion } from 'framer-motion';
import { Search, Download, Calendar, User, Activity, Clock } from 'lucide-react';
import { LogsDto } from "@/models/logs";

export default function AdminLogs() {
  const { data: session } = useSession();
  const [activeTab, setActiveTab] = useState('ALL');
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
    if (activeTab !== 'ALL') {
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

  return (
    <div className="w-full px-4 md:px-6">
      <motion.div 
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="bg-white/10 backdrop-blur-md shadow-xl rounded-3xl p-4 md:p-6 w-full"
      >
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-6">
          <h2
            className="text-2xl md:text-3xl font-bold text-gray-800 mb-4 md:mb-0 flex items-center"
            style={{ fontFamily: "Montserrat, sans-serif" }}
          >
            <Activity className="w-8 h-8 mr-3 text-blue-600" />
            System Logs
          </h2>
          <div className="flex space-x-2">
            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg flex items-center"
            >
              <Download className="w-4 h-4 mr-2" />
              Export
            </motion.button>
          </div>
        </div>

        {/* Tabs - Scrollable on mobile */}
        <div className="flex overflow-x-auto mb-6 pb-2 -mx-4 px-4 md:mx-0 md:px-0">
          {['ALL', 'GET', 'POST', 'PUT', 'DELETE'].map((tab) => (
            <motion.button
              key={tab}
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              onClick={() => setActiveTab(tab)}
              className={`px-4 py-2 mr-2 rounded-lg whitespace-nowrap flex-shrink-0 ${
                activeTab === tab 
                  ? 'bg-blue-600 text-white font-semibold' 
                  : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
              }`}
            >
              {tab}
            </motion.button>
          ))}
        </div>

        {/* Search and Filter - Stack on mobile */}
        <div className="flex flex-col md:flex-row gap-4 mb-6">
          <div className="relative flex-grow">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
            <input
              type="text"
              placeholder="Search logs..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-10 pr-4 py-2 rounded-lg bg-gray-100 text-gray-800 placeholder-gray-500 border border-gray-200 focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>
          <div className="flex space-x-2">
            <div className="relative">
              <Calendar className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
              <select
                value={dateRange}
                onChange={(e) => setDateRange(e.target.value)}
                className="pl-10 pr-4 py-2 rounded-lg bg-gray-100 text-gray-800 border border-gray-200 focus:outline-none focus:ring-2 focus:ring-blue-500 appearance-none"
              >
                <option value="today" className="bg-white text-gray-800">Today</option>
                <option value="yesterday" className="bg-white text-gray-800">Yesterday</option>
                <option value="last7days" className="bg-white text-gray-800">Last 7 Days</option>
                <option value="last30days" className="bg-white text-gray-800">Last 30 Days</option>
                <option value="custom" className="bg-white text-gray-800">Custom Range</option>
              </select>
            </div>
          </div>
        </div>

        {/* Mobile Card View */}
        <div className="md:hidden space-y-4">
          {currentItems.map((log) => (
            <motion.div
              key={log._id}
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ duration: 0.3 }}
              className="bg-white rounded-lg shadow p-4 space-y-3"
            >
              <div className="flex items-center space-x-3">
                <div className="flex-shrink-0 h-10 w-10 bg-gray-200 rounded-full flex items-center justify-center">
                  <User className="w-5 h-5 text-gray-600" />
                </div>
                <div>
                  <div className="font-medium text-gray-900">{log.name}</div>
                  <div className="text-sm text-gray-500">{log.ipAddress}</div>
                </div>
              </div>
              <div className="flex items-center text-sm text-gray-600">
                <Activity className="w-4 h-4 mr-2" />
                <span>{log.action}</span>
              </div>
              <div className="flex items-center text-sm text-gray-600">
                <Clock className="w-4 h-4 mr-2" />
                <span>{new Date(log.timestamp).toLocaleString()}</span>
              </div>
            </motion.div>
          ))}
        </div>

        {/* Desktop Table View */}
        <div className="hidden md:block overflow-x-auto">
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">User</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Action</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Timestamp</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">IP Address</th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {currentItems.map((log) => (
                <motion.tr 
                  key={log._id}
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  transition={{ duration: 0.3 }}
                  className="hover:bg-gray-50 transition-colors"
                >
                  <td className="px-6 py-4 whitespace-nowrap text-gray-800">
                    <div className="flex items-center">
                      <div className="flex-shrink-0 h-8 w-8 bg-gray-200 rounded-full flex items-center justify-center">
                        <User className="w-4 h-4 text-gray-600" />
                      </div>
                      <div className="ml-3">
                        <div className="text-sm font-medium">{log.name}</div>
                      </div>
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-gray-800">
                    <div className="flex items-center">
                      <Activity className="w-4 h-4 mr-2 text-gray-600" />
                      <span>{log.action}</span>
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-gray-800">
                    <div className="flex items-center">
                      <Clock className="w-4 h-4 mr-2 text-gray-600" />
                      <span>{new Date(log.timestamp).toLocaleString()}</span>
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-gray-800">
                    {log.ipAddress}
                  </td>
                </motion.tr>
              ))}
            </tbody>
          </table>
        </div>

        {/* Pagination - Responsive */}
        <div className="flex flex-col md:flex-row justify-between items-center mt-6 space-y-4 md:space-y-0">
          <div className="text-gray-600 text-sm text-center md:text-left">
            Showing {indexOfFirstItem + 1} to {Math.min(indexOfLastItem, filteredLogs.length)} of {filteredLogs.length} entries
          </div>
          <div className="flex space-x-2">
            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              onClick={handlePreviousPage}
              disabled={currentPage === 1}
              className={`px-3 py-1 md:px-4 md:py-2 rounded-lg ${
                currentPage === 1 
                  ? 'bg-gray-100 text-gray-400 cursor-not-allowed' 
                  : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
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
                className={`px-3 py-1 md:px-4 md:py-2 rounded-lg ${
                  currentPage === number
                    ? 'bg-blue-600 text-white font-semibold'
                    : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
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
              className={`px-3 py-1 md:px-4 md:py-2 rounded-lg ${
                currentPage === totalPages
                  ? 'bg-gray-100 text-gray-400 cursor-not-allowed'
                  : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
              }`}
            >
              Next
            </motion.button>
          </div>
        </div>
      </motion.div>
    </div>
  );
}
