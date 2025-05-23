"use client";
import { useSession } from "next-auth/react";
import { useState, useEffect } from "react";
import { motion } from 'framer-motion';
import { Search, Download, Calendar, User, Activity, Clock } from 'lucide-react';
import { LogSkeleton } from "./components/LogSkeleton";

import {
  ChevronLeftIcon,
  ChevronRightIcon,
  DoubleArrowLeftIcon,
  DoubleArrowRightIcon,
} from "@radix-ui/react-icons";

interface LogsDto {
  // ...existing interface...
}

const tabs = ['ALL', 'INFO', 'WARNING', 'ERROR'];
const dateRanges = [
  { value: 'last7days', label: 'Last 7 Days' },
  { value: 'last30days', label: 'Last 30 Days' },
  { value: 'last90days', label: 'Last 90 Days' },
];

export default function AdminLogs() {
  const { data: session } = useSession();
  const [activeTab, setActiveTab] = useState('ALL');
  const [searchQuery, setSearchQuery] = useState('');
  const [dateRange, setDateRange] = useState('last7days');
  const [logs, setLogs] = useState<LogsDto[]>([]);
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage, setItemsPerPage] = useState(10);
  const [filteredLogs, setFilteredLogs] = useState<LogsDto[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const fetchLogs = async () => {
      try {
        setIsLoading(true);
        const response = await fetch("/api/admin/logs");
        const data = await response.json();
        setLogs(data);
        setFilteredLogs(data);
      } catch (error) {
        console.error("Error fetching logs:", error);
      } finally {
        setIsLoading(false);
      }
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

  const handleLastPage = () => {
    setCurrentPage(totalPages);
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
    <div className="w-full px-2 sm:px-4 md:px-6">
      <motion.div 
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="bg-white/10 backdrop-blur-md shadow-xl rounded-xl sm:rounded-3xl p-3 sm:p-4 md:p-6 w-full"
      >
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-4 sm:mb-6">
          <h2
            className="text-xl sm:text-2xl md:text-3xl font-bold text-gray-800 mb-3 sm:mb-4 md:mb-0 flex items-center"
            style={{ fontFamily: "Montserrat, sans-serif" }}
          >
            <Activity className="w-6 h-6 sm:w-8 sm:h-8 mr-2 sm:mr-3 text-blue-600" />
            System Logs
          </h2>
          <div className="flex space-x-2 w-full md:w-auto">
            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg flex items-center justify-center w-full md:w-auto"
            >
              <Download className="w-4 h-4 mr-2" />
              Export
            </motion.button>
          </div>
        </div>

        {/* Tabs - Scrollable on mobile */}
        <div className="flex overflow-x-auto mb-4 sm:mb-6 pb-2 -mx-3 sm:-mx-4 px-3 sm:px-4 md:mx-0 md:px-0 scrollbar-hide">
          {['ALL', 'GET', 'POST', 'PUT', 'DELETE'].map((tab) => (
            <motion.button
              key={tab}
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              onClick={() => setActiveTab(tab)}
              className={`px-3 sm:px-4 py-2 mr-2 rounded-lg whitespace-nowrap flex-shrink-0 cursor-pointer text-sm sm:text-base ${
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
        <div className="flex flex-col sm:flex-row gap-3 sm:gap-4 mb-4 sm:mb-6">
          <div className="relative flex-grow">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
            <input
              type="text"
              placeholder="Search logs..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-10 pr-4 py-2 rounded-lg bg-gray-100 text-gray-800 placeholder-gray-500 border border-gray-200 focus:outline-none focus:ring-2 focus:ring-blue-500 text-sm sm:text-base"
            />
          </div>
          <div className="flex w-full sm:w-auto">
            <div className="relative flex-grow sm:flex-grow-0">
              <Calendar className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
              <select
                value={dateRange}
                onChange={(e) => setDateRange(e.target.value)}
                className="w-full sm:w-auto pl-10 pr-4 py-2 rounded-lg bg-gray-100 text-gray-800 border border-gray-200 focus:outline-none focus:ring-2 focus:ring-blue-500 appearance-none text-sm sm:text-base"
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

        {isLoading ? (
          <LogSkeleton />
        ) : (
          <>
            {/* Mobile Card View */}
            <div className="md:hidden space-y-3">
              {currentItems.map((log) => (
                <motion.div
                  key={log._id}
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  transition={{ duration: 0.3 }}
                  className="bg-white rounded-lg shadow-sm p-3 space-y-2 border border-gray-100"
                >
                  <div className="flex items-center space-x-3">
                    <div className="flex-shrink-0 h-8 w-8 sm:h-10 sm:w-10 bg-gray-100 rounded-full flex items-center justify-center">
                      <User className="w-4 h-4 sm:w-5 sm:h-5 text-gray-600" />
                    </div>
                    <div>
                      <div className="font-medium text-gray-900 text-sm sm:text-base">{log.name}</div>
                      <div className="text-xs sm:text-sm text-gray-500">{log.ipAddress}</div>
                    </div>
                  </div>
                  <div className="flex items-center text-xs sm:text-sm text-gray-600">
                    <Activity className="w-4 h-4 mr-2 flex-shrink-0" />
                    <span className="truncate">{log.action}</span>
                  </div>
                  <div className="flex items-center text-xs sm:text-sm text-gray-600">
                    <Clock className="w-4 h-4 mr-2 flex-shrink-0" />
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
                    >
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="flex items-center">
                          <div className="flex-shrink-0 h-10 w-10 bg-gray-100 rounded-full flex items-center justify-center">
                            <User className="w-5 h-5 text-gray-600" />
                          </div>
                          <div className="ml-4">
                            <div className="text-sm font-medium text-gray-900">{log.name}</div>
                          </div>
                        </div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <span className="text-sm text-gray-900">{log.action}</span>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                        {new Date(log.timestamp).toLocaleString()}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                        {log.ipAddress}
                      </td>
                    </motion.tr>
                  ))}
                </tbody>
              </table>
            </div>
          </>
        )}          {/* Pagination */}
          <div className="mt-4 sm:mt-6 flex flex-col sm:flex-row items-center justify-between space-y-3 sm:space-y-0">
            <div className="flex justify-center sm:justify-start items-center bg-white/50 backdrop-blur-sm rounded-lg shadow-sm px-2 py-1 w-full sm:w-auto order-2 sm:order-1 gap-1.5">
              <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                onClick={() => setCurrentPage(1)}
                disabled={currentPage === 1}
                className="w-9 h-9 flex items-center justify-center rounded-md bg-gray-100 text-gray-700 hover:bg-gray-200 disabled:opacity-50 disabled:hover:bg-gray-100"
              >
                <DoubleArrowLeftIcon className="h-4 w-4" />
              </motion.button>
              <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                onClick={handlePreviousPage}
                disabled={currentPage === 1}
                className="w-9 h-9 flex items-center justify-center rounded-md bg-gray-100 text-gray-700 hover:bg-gray-200 disabled:opacity-50 disabled:hover:bg-gray-100"
              >
                <ChevronLeftIcon className="h-4 w-4" />
              </motion.button>
              {getPageNumbers().map((number) => (
                <motion.button
                  key={number}
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  onClick={() => handlePageChange(number)}
                  className={`w-9 h-9 flex items-center justify-center text-sm font-medium rounded-md ${
                    currentPage === number
                      ? 'bg-blue-600 text-white'
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
                className="w-9 h-9 flex items-center justify-center rounded-md bg-gray-100 text-gray-700 hover:bg-gray-200 disabled:opacity-50 disabled:hover:bg-gray-100"
              >
                <ChevronRightIcon className="h-4 w-4" />
              </motion.button>
              <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                onClick={handleLastPage}
                disabled={currentPage === totalPages}
                className="w-9 h-9 flex items-center justify-center rounded-md bg-gray-100 text-gray-700 hover:bg-gray-200 disabled:opacity-50 disabled:hover:bg-gray-100"
              >
                <DoubleArrowRightIcon className="h-4 w-4" />
              </motion.button>
            </div>
            <div className="text-sm text-gray-500 order-1 sm:order-2">
              Showing <span className="font-medium text-gray-700">{indexOfFirstItem + 1}</span> to <span className="font-medium text-gray-700">{Math.min(indexOfLastItem, filteredLogs.length)}</span> of <span className="font-medium text-gray-700">{filteredLogs.length}</span> entries
            </div>
          </div>
      </motion.div>
    </div>
  );
}
