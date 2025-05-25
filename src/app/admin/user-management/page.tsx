"use client";

import userData from "@/dummy_data/user.json";
import PromoteUser from "../../components/promoteUser";
import DeleteUser from "../../components/deleteUser";
import { useSession } from "next-auth/react";
import { Search, ChevronLeft, ChevronRight, Download, User, Mail, Shield, Users, FileCheck, ChevronDown, Check } from "lucide-react";
import { useState, useEffect } from "react";
import FilterModal from "../../components/filterModal";
import { motion } from 'framer-motion';
import { UserDto } from "@/models/user";
import { createNotification } from "@/services/notification.service";
import { UserRole } from "@/entities/user";

export default function UsersManagement(){
    const { data: session } = useSession();
    const [tempQuery, setTempQuery] = useState("");
    const [searchQuery, setSearchQuery] = useState("");
    const [sortOrder, setSortOrder] = useState<"asc" | "desc" | null>(null);
    const [roleFilter, setRoleFilter] = useState("All");
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [alumniUsers, setAlumniUsers] = useState<UserDto[]>([]);
    const [pendingVerificationUsers, setPendingVerificationUsers] = useState<UserDto[]>([]);
    const [activeSection, setActiveSection] = useState<'users' | 'pending'>('users');
    const [isExporting, setIsExporting] = useState(false);


      const getRole = (role: UserRole[] | UserRole) => {
        const roleArray = Array.isArray(role) ? role : [role];
        
        if (roleArray.includes(UserRole.ADMIN) && roleArray.includes(UserRole.ALUMNI)) {
          return "Alumni Admin";
        } else if (roleArray.includes(UserRole.ADMIN)) {
          return "Admin";
        } else if (roleArray.includes(UserRole.ALUMNI)) {
          return "Alumni";
        } else {
          return "Pending Verification";
        }
    }
    const handleAccept = async (userId: string) => {
        console.log(userId);
        const response = await fetch(`/api/admin/users/${userId}`, {
            method: "PUT",
            body: JSON.stringify({
                role: ["alumni"],
                alumniStatus: "verified"
            })
        });

        if (response.ok) {
            console.log("User accepted");
            createNotification({
                type: "Welcome",
                entity: userId,
                userId: userId,
                customMessage: `Welcome to AEGIS!`
            });
            setPendingVerificationUsers(pendingVerificationUsers.filter((user) => user.id !== userId));
        }
    }

    const handleDecline = async (userId: string) => {
        console.log(userId);
        const response = await fetch(`/api/admin/users/${userId}`, {
            method: "PUT",
            body: JSON.stringify({
                alumniStatus: "rejected"
            })
        });
        if (response.ok) {
            console.log("User declined");
            setPendingVerificationUsers(pendingVerificationUsers.filter((user) => user.id !== userId));
        }
    }

    const handleDocumentDownload = async (url: string | undefined, fileName: string) => {
        if (!url) {
            console.error('Document URL is undefined');
            return;
        }
        try {
            const response = await fetch(url);
            if (!response.ok) throw new Error('Network response was not ok');
            
            const blob = await response.blob();
            const blobUrl = window.URL.createObjectURL(blob);
            
            const link = document.createElement('a');
            link.href = blobUrl;
            link.download = `${fileName}.pdf`;
            document.body.appendChild(link);
            link.click();
            document.body.removeChild(link);
            window.URL.revokeObjectURL(blobUrl);
        } catch (error) {
            console.error('Error downloading document:', error);
        }
    };

    useEffect(() => {
        const fetchAlumniUsers = async () => {
            const response = await fetch("/api/admin/users");
            const data = await response.json();
            console.log("The data is: ", data);
            setAlumniUsers(data);
        }
        fetchAlumniUsers();
    }, []);

    useEffect(() => {
        const fetchPendingVerificationUsers = async () => {
            const response = await fetch("/api/admin/users/pending-verification");
            const data = await response.json();
            setPendingVerificationUsers(data);
            console.log(data);
        }
        fetchPendingVerificationUsers();
    }, []);

    // Pagination state
    const [currentPage, setCurrentPage] = useState(1);
    const itemsPerPage = 20;

    const deleteSuccess = (userId: string) => {
        setAlumniUsers(alumniUsers.filter((user) => user.id !== userId));
    }
    // function for clicking "Name" label 
    const toggleSortOrder = () => {
        setSortOrder((prevOrder) => (prevOrder === "asc" ? "desc" : "asc"));
    };

    // search input box only works for when user presses enter key
    const handleSearch = (e: any) => {
        if (e.key === "Enter") {  // Check if Enter key is pressed
            setSearchQuery(tempQuery);
            setCurrentPage(1); // Reset to first page when searching
        }
    };

    // Filter and sort users based on search query and role filter
    const filteredUsers = alumniUsers
  .filter(user =>
    user.name.toLowerCase().includes(searchQuery.toLowerCase())
  )
  .filter(user => {
    if (roleFilter === "All") return true;

    if (roleFilter === "Alumni Admin") {
      return user.role.includes(UserRole.ALUMNI) && user.role.includes(UserRole.ADMIN);
    }

    if(roleFilter === "Alumni") {
        return user.role.includes(UserRole.ALUMNI)
    }

    if(roleFilter === "Admin") {
        return user.role.includes(UserRole.ADMIN)
    }
  });

    if (sortOrder === "asc") {
        filteredUsers.sort((a, b) => a.name.localeCompare(b.name));
    } else if (sortOrder === "desc") {
        filteredUsers.sort((a, b) => b.name.localeCompare(a.name));
    }
    
    // Calculate pagination
    const totalPages = Math.ceil(filteredUsers.length / itemsPerPage);
    const startIndex = (currentPage - 1) * itemsPerPage;
    const endIndex = startIndex + itemsPerPage;
    const currentUsers = filteredUsers.slice(startIndex, endIndex);
    
    // Handle page navigation
    const goToPage = (page: number) => {
        if (page >= 1 && page <= totalPages) {
            setCurrentPage(page);
        }
    };
    
    // Generate page numbers to display
    const getPageNumbers = () => {
        const pageNumbers = [];
        const maxVisiblePages = 3;
        
        if (totalPages <= maxVisiblePages) {
            // Show all pages if total is less than max visible
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

    // Handle export functionality
    const handleExport = async () => {
        try {
            setIsExporting(true);
            // Create CSV headers
            const headers = [
                "Name",
                "Email",
                "Role",
                "Status",
                "Graduation Year",
                "Department",
                "Current Company",
                "Current Position",
                "Location",
                "LinkedIn"
            ].join(",");

            // Convert user data to CSV rows
            const csvRows = filteredUsers.map(user => {                const row = [
                    user.name,
                    user.email,
                    getRole(user.role),
                    user.alumniStatus,
                    user.graduationYear || "",
                    user.department || "",
                    user.currentCompany || "",
                    user.currentPosition || "",
                    user.currentLocation || "",
                    user.linkedIn || ""
                ].map(value => `"${String(value || "").replace(/"/g, '""')}"`); // Convert to string before using replace
                return row.join(",");
            });

            // Combine headers and rows
            const csvContent = [headers, ...csvRows].join("\n");

            // Create blob and download
            const blob = new Blob([csvContent], { type: "text/csv;charset=utf-8;" });
            const link = document.createElement("a");
            const url = URL.createObjectURL(blob);
            link.setAttribute("href", url);
            link.setAttribute("download", `alumni_data_${new Date().toISOString().split('T')[0]}.csv`);
            link.style.visibility = 'hidden';
            document.body.appendChild(link);
            link.click();
            document.body.removeChild(link);
            URL.revokeObjectURL(url);
            
            // Create success notification
            createNotification({
                type: "Success",
                entity: session?.user.id || "",
                userId: session?.user.id || "",
                customMessage: "User data has been exported successfully!"
            });
            
        } catch (error) {
            console.error('Error exporting data:', error);
            // Create error notification
            createNotification({
                type: "Error",
                entity: session?.user.id || "",
                userId: session?.user.id || "",
                customMessage: "Failed to export user data. Please try again."
            });
        } finally {
            setIsExporting(false);
        }
    };

    const isAdmin = (user: UserDto) => user.role === UserRole.ADMIN || (Array.isArray(user.role) && user.role.includes(UserRole.ADMIN));
const isAlumni = (user: UserDto) => user.role === UserRole.ALUMNI || (Array.isArray(user.role) && user.role.includes(UserRole.ALUMNI));

    return (
        <div className="w-full px-2 sm:px-4 md:px-10">
            <div className="flex flex-col lg:flex-row gap-4 sm:gap-6">
                {/* User Management Card */}
                <motion.div 
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.5 }}
                    className="bg-white/10 backdrop-blur-md shadow-xl rounded-3xl p-3 sm:p-4 md:p-6 w-full lg:w-2/3"
                >
                    {/* Mobile Navigation Tabs */}
                    <div className="md:hidden flex justify-center mb-4">
                        <div className="flex bg-gray-100 rounded-lg p-1 w-full max-w-xs">
                            <button
                                onClick={() => setActiveSection('users')}
                                className={`flex-1 py-2 px-4 rounded-md text-sm font-medium transition-colors ${
                                    activeSection === 'users'
                                        ? 'bg-white text-blue-600 shadow-sm'
                                        : 'text-gray-600 hover:text-gray-800'
                                }`}
                            >
                                Manage Users
                            </button>
                            <button
                                onClick={() => setActiveSection('pending')}
                                className={`flex-1 py-2 px-4 rounded-md text-sm font-medium transition-colors ${
                                    activeSection === 'pending'
                                        ? 'bg-white text-blue-600 shadow-sm'
                                        : 'text-gray-600 hover:text-gray-800'
                                }`}
                            >
                                Pending Verifications
                            </button>
                        </div>
                    </div>

                    <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-4 sm:mb-6">
                        <h2
                            className="text-xl sm:text-2xl md:text-3xl font-bold text-gray-800 mb-3 md:mb-0 flex items-center"
                            style={{ fontFamily: "Montserrat, sans-serif" }}
                        >
                            <Users className="w-6 h-6 sm:w-8 sm:h-8 mr-2 sm:mr-3 text-blue-600" />
                            User Management
                        </h2>
                        <div className="flex space-x-2 w-full md:w-auto mt-3 md:mt-0">
                            <motion.button
                                whileHover={{ scale: 1.05 }}
                                whileTap={{ scale: 0.95 }}
                                onClick={handleExport}
                                disabled={isExporting}
                                className="bg-blue-600 hover:bg-blue-700 text-white px-3 sm:px-4 py-2 rounded-lg flex items-center w-full md:w-auto justify-center cursor-pointer text-sm sm:text-base disabled:bg-blue-400 disabled:cursor-not-allowed"
                            >
                                <Download className={`w-4 h-4 mr-2 ${isExporting ? 'animate-bounce' : ''}`} />
                                {isExporting ? 'Exporting...' : 'Export'}
                            </motion.button>
                        </div>
                    </div>
                    
                    {/* Search and Filter - Stack on mobile */}
                    <div className="flex flex-col sm:flex-row gap-3 mb-4 sm:mb-6">
                        <div className="relative flex-grow">
                            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4 sm:w-5 sm:h-5" />
                            <input
                                type="text"
                                placeholder="Search users..."
                                value={tempQuery}
                                onChange={(e) => setTempQuery(e.target.value)}
                                onKeyDown={handleSearch}
                                className="w-full pl-9 sm:pl-10 pr-4 py-2 rounded-lg bg-gray-100 text-gray-800 placeholder-gray-500 border border-gray-200 focus:outline-none focus:ring-2 focus:ring-blue-500 text-sm sm:text-base"
                            />
                        </div>                        <div className="relative">                            <motion.button
                                whileHover={{ scale: 1.02 }}
                                whileTap={{ scale: 0.98 }}
                                onClick={() => setIsModalOpen(!isModalOpen)}
                                className="relative bg-white border border-gray-200 hover:bg-gray-50 text-gray-700 px-4 py-2 rounded-xl flex items-center justify-center cursor-pointer text-sm sm:text-base gap-2 shadow-sm"
                            >
                                <Shield className="w-4 h-4 text-gray-400" />
                                {roleFilter === "All" ? "All Roles" : roleFilter}
                                <ChevronDown className={`w-4 h-4 text-gray-400 transition-transform duration-200 ${isModalOpen ? 'rotate-180' : ''}`} />
                            </motion.button>
                            {/* Filter Dropdown */}
                            {isModalOpen && (
                                <motion.div
                                    initial={{ opacity: 0, y: -10 }}
                                    animate={{ opacity: 1, y: 0 }}
                                    exit={{ opacity: 0, y: -10 }}
                                    transition={{ duration: 0.2 }}
                                    className="absolute right-0 mt-2 w-56 rounded-xl shadow-xl bg-white/95 backdrop-blur-sm border border-gray-200 z-50 overflow-hidden"
                                >
                                    <div className="py-1">
                                        {['All', 'Admin', 'Alumni', 'Alumni Admin'].map((tab) => (
                                            <motion.button
                                                key={tab}
                                                whileHover={{ backgroundColor: 'rgba(59, 130, 246, 0.05)' }}
                                                onClick={() => {
                                                    setRoleFilter(tab);
                                                    setCurrentPage(1);
                                                    setIsModalOpen(false);
                                                }}
                                                className={`flex items-center w-full px-4 py-2.5 text-sm ${
                                                    roleFilter === tab
                                                        ? 'bg-blue-50 text-blue-600 font-medium'
                                                        : 'text-gray-700 hover:bg-gray-50'
                                                }`}
                                            >
                                                <Shield className={`w-4 h-4 mr-2 ${
                                                    roleFilter === tab ? 'text-blue-600' : 'text-gray-400'
                                                }`} />
                                                {tab}
                                            </motion.button>
                                        ))}
                                    </div>
                                </motion.div>
                            )}
                        </div>
                    </div>

                    {/* Mobile Card View for User Management */}
                    <div className={`md:hidden space-y-3 ${activeSection === 'users' ? 'block' : 'hidden'}`}>
                        {currentUsers.map((user, index) => (
                            <motion.div
                                key={index}
                                initial={{ opacity: 0 }}
                                animate={{ opacity: 1 }}
                                transition={{ duration: 0.3 }}
                                className="bg-white rounded-lg shadow-md p-3 sm:p-4"
                            >
                                {/* User Info Header */}
                                <div className="flex items-center space-x-3 mb-3">
                                    <div className="w-10 h-10 sm:w-12 sm:h-12 bg-gray-100 rounded-full flex items-center justify-center flex-shrink-0">
                                        <User className="w-5 h-5 sm:w-6 sm:h-6 text-gray-500" />
                                    </div>
                                    <div className="flex-1 min-w-0">
                                        <h3 className="font-semibold text-gray-800 truncate text-sm sm:text-base">{user.name}</h3>
                                        <div className="flex items-center text-xs sm:text-sm text-gray-500 truncate">
                                            <Mail className="w-3 h-3 sm:w-4 sm:h-4 mr-1 flex-shrink-0" />
                                            <span className="truncate">{user.email}</span>
                                        </div>
                                    </div>
                                </div>

                                {/* Role Badge */}
                                <div className="mb-3">
                                    <span className={`inline-flex items-center px-2 sm:px-3 py-1 rounded-full text-xs font-medium
                                        ${getRole(user.role) === 'Alumni Admin' ? 'bg-purple-100 text-purple-800' :
                                        getRole(user.role) === 'Admin' ? 'bg-red-100 text-red-800' :
                                        getRole(user.role) === 'Alumni' ? 'bg-blue-100 text-blue-800' :
                                        'bg-gray-100 text-gray-800'}`}>
                                        <Shield className="w-3 h-3 mr-1 flex-shrink-0" />
                                        {getRole(user.role)}
                                    </span>
                                </div>

                                {/* Action Buttons */}
                                <div className="flex flex-col space-y-2">
                                    {user.role ? (
                                        user.role[0] === "alumni" ? (
                                            <div className="w-full flex justify-end space-x-2">
                                                <PromoteUser person={user} />
                                                <DeleteUser person={user} deleteSuccess={deleteSuccess} />
                                            </div>
                                        ) : (
                                            <div className="w-full flex justify-end space-x-2">
                                                <span className="text-xs sm:text-sm text-gray-500 bg-gray-50 px-3 py-2 rounded-md text-center">
                                                    Promoted
                                                </span>
                                                <DeleteUser person={user} deleteSuccess={deleteSuccess} />
                                            </div>
                                        )
                                    ) : (
                                        user.alumniStatus === "pending" ? (
                                            <span className="text-xs sm:text-sm text-gray-500 bg-gray-50 px-3 py-2 rounded-md w-full text-center">
                                                Pending Verification
                                            </span>
                                        ) : (
                                            <div className="w-full flex justify-end space-x-2">
                                                <span className="text-xs sm:text-sm text-gray-500">Rejected</span>
                                                <DeleteUser person={user} deleteSuccess={deleteSuccess} />
                                            </div>
                                        )
                                    )}
                                </div>
                            </motion.div>
                        ))}

                        {/* Empty State for Mobile */}
                        {filteredUsers.length === 0 && (
                            <div className="text-center py-6 bg-white rounded-lg shadow-md">
                                <Users className="w-10 h-10 sm:w-12 sm:h-12 text-gray-400 mx-auto mb-2" />
                                <p className="text-gray-500 text-sm sm:text-base">No users found</p>
                            </div>
                        )}
                    </div>

                    {/* Mobile View for Pending Verifications */}
                    <div className={`md:hidden space-y-3 ${activeSection === 'pending' ? 'block' : 'hidden'}`}>
                        {pendingVerificationUsers.length > 0 ? (
                            pendingVerificationUsers.map((user: UserDto, index) => (
                                <motion.div
                                    key={index}
                                    initial={{ opacity: 0 }}
                                    animate={{ opacity: 1 }}
                                    transition={{ duration: 0.3 }}
                                    className="bg-white rounded-lg shadow p-3 sm:p-4 space-y-3"
                                >
                                    <div className="flex items-center space-x-3">
                                        <div className="flex-shrink-0 h-10 w-10 bg-gray-200 rounded-full flex items-center justify-center">
                                            <User className="w-5 h-5 text-gray-600" />
                                        </div>
                                        <div>
                                            <div className="font-medium text-gray-900 text-sm sm:text-base">{user.name}</div>
                                            <div className="text-xs sm:text-sm text-gray-500">{user.email}</div>
                                        </div>
                                    </div>
                                    
                                    <div>
                                        {user.documentUrl ? (
                                            <div className="flex items-center text-xs sm:text-sm text-gray-600">
                                                <FileCheck className="w-4 h-4 mr-2 text-blue-500" />
                                                <a 
                                                    href="#" 
                                                    className="text-blue-600 hover:text-blue-800 underline flex items-center"
                                                    onClick={(e) => {
                                                        e.preventDefault();
                                                        const fileName = user.documentUrl?.split("/").pop()?.split(".")[0] || "document";
                                                        if (user.documentUrl) {
                                                            handleDocumentDownload(user.documentUrl, fileName);
                                                        }
                                                    }}
                                                >
                                                    View Verification Document
                                                </a>
                                            </div>
                                        ) : (
                                            <div className="flex items-center text-xs sm:text-sm text-gray-600 bg-yellow-50 p-2 sm:p-3 rounded-lg">
                                                <FileCheck className="w-4 h-4 mr-2 text-yellow-500" />
                                                <span className="text-yellow-700">{user.name} has not submitted a verification document</span>
                                            </div>
                                        )}
                                    </div>
                                    
                                    <div className="flex justify-end space-x-2 pt-2">
                                        <motion.button
                                            whileHover={{ scale: 1.05 }}
                                            whileTap={{ scale: 0.95 }}
                                            className="bg-green-600 hover:bg-green-700 text-white px-3 sm:px-4 py-2 rounded-lg text-xs sm:text-sm"
                                            onClick={() => handleAccept(user.id)}
                                        >
                                            Accept
                                        </motion.button>
                                        <motion.button
                                            whileHover={{ scale: 1.05 }}
                                            whileTap={{ scale: 0.95 }}
                                            className="bg-red-600 hover:bg-red-700 text-white px-3 sm:px-4 py-2 rounded-lg text-xs sm:text-sm"
                                            onClick={() => handleDecline(user.id)}
                                        >
                                            Decline
                                        </motion.button>
                                    </div>
                                </motion.div>
                            ))
                        ) : (
                            <div className="bg-white rounded-lg shadow p-4 sm:p-6 text-center">
                                <p className="text-gray-500 text-sm sm:text-base">No pending verifications</p>
                            </div>
                        )}
                    </div>

                    {/* Desktop Table View */}
                    <div className="hidden md:block overflow-y-auto max-h-[calc(100vh-300px)] rounded-lg border border-gray-200">
                        <div className="grid grid-cols-1 gap-4 p-4">
                            {currentUsers.map((user, index) => (
                                <motion.div
                                    key={index}
                                    initial={{ opacity: 0 }}
                                    animate={{ opacity: 1 }}
                                    transition={{ duration: 0.3 }}
                                    className="bg-white rounded-lg shadow p-4"
                                >
                                    <div className="flex flex-col space-y-3">
                                        <div className="flex items-center space-x-3">
                                            <div className="flex-shrink-0 h-10 w-10 bg-gray-200 rounded-full flex items-center justify-center">
                                                <User className="w-5 h-5 text-gray-600" />
                                            </div>
                                            <div className="flex-1 min-w-0">
                                                <div className="font-medium text-gray-900 truncate">{user.name}</div>
                                                <div className="text-sm text-gray-500 truncate">{user.email || "N/A"}</div>
                                            </div>
                                        </div>
                                        
                                        <div className="flex items-center">
                                            <span className={`inline-flex items-center px-3 py-1 rounded-full text-xs font-medium
                                                ${getRole(user.role) === 'Alumni Admin' ? 'bg-purple-100 text-purple-800' :
                                                getRole(user.role) === 'Admin' ? 'bg-red-100 text-red-800' :
                                                getRole(user.role) === 'Alumni' ? 'bg-blue-100 text-blue-800' :
                                                'bg-gray-100 text-gray-800'}`}>
                                                <Shield className="w-3 h-3 mr-1 flex-shrink-0" />
                                                {getRole(user.role)}
                                            </span>
                                        </div>
                                        
                                        <div className="flex justify-end space-x-2 pt-2">
                                            {user.role[0] ? (
                                                user.role[0] === "alumni" ? (
                                                    <PromoteUser person={user} />
                                                ) : (
                                                    <span className="text-gray-500 text-sm">Promoted</span>
                                                )
                                            ) : (
                                                user.alumniStatus === "pending" ? (
                                                    <span className="text-gray-500 text-sm">Pending Verification</span>
                                                ) : (
                                                    <div className="flex items-center gap-x-2">
                                                        <span className="text-gray-500 text-sm mr-5">Rejected</span>
                                                        <DeleteUser person={user} deleteSuccess={deleteSuccess} />
                                                    </div>
                                                )
                                            )}
                                            {user.role[0] && user.role[0] !== "admin" && (
                                                <DeleteUser person={user} deleteSuccess={deleteSuccess} />
                                            )}
                                        </div>
                                    </div>
                                </motion.div>
                            ))}
                            {filteredUsers.length === 0 && (
                                <div className="text-center py-8">
                                    <p className="text-gray-500">No users found</p>
                                </div>
                            )}
                        </div>
                    </div>

                    {/* Pagination - Responsive */}
                    {filteredUsers.length > 0 && (
                        <div className="flex flex-col md:flex-row justify-between items-center mt-6 space-y-4 md:space-y-0">
                            <div className="text-gray-600 text-sm text-center md:text-left">
                                Showing {startIndex + 1} to {Math.min(endIndex, filteredUsers.length)} of {filteredUsers.length} users
                            </div>
                            <div className="flex space-x-2">
                                <motion.button
                                    whileHover={{ scale: 1.05 }}
                                    whileTap={{ scale: 0.95 }}
                                    onClick={() => goToPage(currentPage - 1)}
                                    disabled={currentPage === 1}
                                    className={`px-3 py-1 md:px-4 md:py-2 rounded-lg ${
                                        currentPage === 1
                                            ? 'bg-gray-100 text-gray-400 cursor-not-allowed'
                                            : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                                    }`}
                                >
                                    Previous
                                </motion.button>
                                
                                {getPageNumbers().map((page, index) => (
                                    <motion.button
                                        key={index}
                                        whileHover={{ scale: 1.05 }}
                                        whileTap={{ scale: 0.95 }}
                                        onClick={() => goToPage(page)}
                                        className={`px-3 py-1 md:px-4 md:py-2 rounded-lg ${
                                            currentPage === page
                                                ? 'bg-blue-600 text-white font-semibold'
                                                : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                                        }`}
                                    >
                                        {page}
                                    </motion.button>
                                ))}
                                
                                <motion.button
                                    whileHover={{ scale: 1.05 }}
                                    whileTap={{ scale: 0.95 }}
                                    onClick={() => goToPage(currentPage + 1)}
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
                    )}
                </motion.div>

                {/* Pending Verifications Card - Desktop Only */}
                <motion.div 
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.5, delay: 0.2 }}
                    className="hidden md:block bg-white/10 backdrop-blur-md shadow-xl rounded-3xl p-4 md:p-6 w-full lg:w-1/3 h-fit"
                >
                    <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-6">
                        <h2
                            className="text-2xl md:text-3xl font-bold text-gray-800 mb-4 md:mb-0 flex items-center"
                            style={{ fontFamily: "Montserrat, sans-serif" }}
                        >
                            <FileCheck className="w-8 h-8 mr-3 text-green-600" />
                            Pending Verifications
                        </h2>
                    </div>

                    <div className="grid grid-cols-1 gap-4 p-4">
                        {pendingVerificationUsers.length > 0 ? (
                            pendingVerificationUsers.map((user: UserDto, index) => (
                                <motion.div
                                    key={index}
                                    initial={{ opacity: 0 }}
                                    animate={{ opacity: 1 }}
                                    transition={{ duration: 0.3 }}
                                    className="bg-white rounded-lg shadow p-4"
                                >
                                    <div className="flex flex-col space-y-3">
                                        <div className="flex items-center space-x-3">
                                            <div className="flex-shrink-0 h-10 w-10 bg-gray-200 rounded-full flex items-center justify-center">
                                                <User className="w-5 h-5 text-gray-600" />
                                            </div>
                                            <div>
                                                <div className="font-medium text-gray-900">{user.name}</div>
                                                <div className="text-sm text-gray-500">{user.email}</div>
                                            </div>
                                        </div>
                                        
                                        <div className="flex flex-col space-y-2">
                                            {user.documentUrl ? (
                                                <div className="flex items-center text-sm text-gray-600">
                                                    <FileCheck className="w-4 h-4 mr-2 text-blue-500" />
                                                    <a 
                                                        href="#" 
                                                        className="text-blue-600 hover:text-blue-800 underline flex items-center"
                                                        onClick={(e) => {
                                                            e.preventDefault();
                                                            const fileName = user.documentUrl?.split("/").pop()?.split(".")[0] || "document";
                                                            if (user.documentUrl) {
                                                                handleDocumentDownload(user.documentUrl, fileName);
                                                            }
                                                        }}
                                                    >
                                                        View Verification Document
                                                    </a>
                                                </div>
                                            ) : (
                                                <div className="flex items-center text-sm text-gray-600 bg-yellow-50 p-3 rounded-lg">
                                                    <FileCheck className="w-4 h-4 mr-2 text-yellow-500" />
                                                    <span className="text-yellow-700">{user.name} has not submitted a verification document</span>
                                                </div>
                                            )}
                                            
                                            {user.documentUrl && (
                                                <div className="flex justify-end space-x-2 pt-2">
                                                    <motion.button
                                                        whileHover={{ scale: 1.05 }}
                                                        whileTap={{ scale: 0.95 }}
                                                        className="bg-green-600 hover:bg-green-700 text-white px-4 py-2 rounded-lg"
                                                        onClick={() => handleAccept(user.id)}
                                                    >
                                                        Accept
                                                    </motion.button>
                                                    <motion.button
                                                        whileHover={{ scale: 1.05 }}
                                                        whileTap={{ scale: 0.95 }}
                                                        className="bg-red-600 hover:bg-red-700 text-white px-4 py-2 rounded-lg"
                                                        onClick={() => handleDecline(user.id)}
                                                    >
                                                        Decline
                                                    </motion.button>
                                                </div>
                                            )}
                                        </div>
                                    </div>
                                </motion.div>
                            ))
                        ) : (
                            <div className="bg-white rounded-lg shadow p-6 text-center">
                                <p className="text-gray-500 text-lg">No pending verifications</p>
                            </div>
                        )}
                    </div>
                </motion.div>
            </div>
        </div>
    );
}