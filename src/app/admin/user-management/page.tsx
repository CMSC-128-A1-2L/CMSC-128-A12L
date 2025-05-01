"use client";

import userData from "@/dummy_data/user.json";
import PromoteUser from "../../components/promoteUser";
import DeleteUser from "../../components/deleteUser";
import { useSession } from "next-auth/react";
import { Search, ChevronLeft, ChevronRight, Download, User, Mail, Shield, Users, FileCheck, ChevronDown } from "lucide-react";
import { useState, useEffect } from "react";
import FilterModal from "../../components/filterModal";
import { motion } from 'framer-motion';
import { UserDto, UserRoleDto } from "@/models/user";
import ScrollIndicator from "../../components/ScrollIndicator";
import { createNotification } from "@/services/notification.service";
import { UserRole } from "@/entities/user";

interface PendingVerification {
    name: string;
    email: string;
    document: string;
}

const sampleUserData = [
    {
        name: "John Doe",
        email: "john.doe@example.com",
        document: "alumni_verification.pdf"
    },
    {
        name: "Jane Smith",
        email: "jane.smith@example.com",
        document: "graduation_cert.pdf"
    },
    {
        name: "Mike Johnson",
        email: "mike.j@example.com",
        document: "diploma.pdf"
    },
    {
        name: "Sarah Williams",
        email: "sarah.w@example.com",
        document: "transcript.pdf"
    },
    {
        name: "David Brown",
        email: "david.b@example.com",
        document: "certificate.pdf"
    },
    {
        name: "Emily Davis",
        email: "emily.d@example.com",
        document: "diploma_verification.pdf"
    }
]


export default function UsersManagement(){
    const { data: session } = useSession();
    const [tempQuery, setTempQuery] = useState("");
    const [searchQuery, setSearchQuery] = useState("");
    const [sortOrder, setSortOrder] = useState<"asc" | "desc" | null>(null);
    const [roleFilter, setRoleFilter] = useState("All");
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [alumniUsers, setAlumniUsers] = useState<UserDto[]>([]);
    const [pendingVerificationUsers, setPendingVerificationUsers] = useState<UserDto[]>([]);
    const [activeView, setActiveView] = useState<'users' | 'pending'>('users');


    
    const getRole = (role: number) => {
        if ((role & UserRoleDto.ADMIN) && (role & UserRoleDto.ALUMNI)) {
            return "Alumni Admin"
        }
        else if (role & UserRoleDto.ADMIN) {
            return "Admin"
        }
        else if (role & UserRoleDto.ALUMNI) {
            return "Alumni"
        }
        else {
            return "Pending Verification"
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

    const handleDocumentDownload = async (url: string, fileName: string) => {
        try {
            // Show loading state if needed
            const response = await fetch(url);
            if (!response.ok) throw new Error('Network response was not ok');
            
            // Get the blob from the response
            const blob = await response.blob();
            
            // Create a blob URL
            const blobUrl = window.URL.createObjectURL(blob);
            
            // Create a temporary link element
            const link = document.createElement('a');
            link.href = blobUrl;
            link.download = `${fileName}.pdf`; // Force .pdf extension
            
            // Append to body, click, and remove
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
                return (user.role & UserRoleDto.ADMIN) && (user.role & UserRoleDto.ALUMNI);
            }

            if (roleFilter === "Alumni") {
                return Boolean(user.role & UserRoleDto.ALUMNI);
            }

            if (roleFilter === "Admin") {
                return Boolean(user.role & UserRoleDto.ADMIN);
            }

            return false;
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

    return (
        <div className="w-full px-2 sm:px-4 md:px-6">
            <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5 }}
                className="bg-white/10 backdrop-blur-md shadow-xl rounded-xl sm:rounded-3xl p-3 sm:p-4 md:p-6 w-full"
            >
                {/* Mobile View Toggle */}
                <div className="md:hidden mb-4">
                    <div className="flex rounded-lg bg-gray-800/50 p-1">
                        <button
                            onClick={() => setActiveView('users')}
                            className={`flex-1 py-2 text-sm rounded-md transition-colors cursor-pointer ${
                                activeView === 'users'
                                    ? 'bg-blue-600 text-white font-medium'
                                    : 'text-gray-300 hover:text-white hover:bg-gray-700/50'
                            }`}
                        >
                            <Users className="w-4 h-4 mx-auto mb-1" />
                            User Management
                        </button>
                        <button
                            onClick={() => setActiveView('pending')}
                            className={`flex-1 py-2 text-sm rounded-md transition-colors cursor-pointer ${
                                activeView === 'pending'
                                    ? 'bg-blue-600 text-white font-medium'
                                    : 'text-gray-300 hover:text-white hover:bg-gray-700/50'
                            }`}
                        >
                            <FileCheck className="w-4 h-4 mx-auto mb-1" />
                            Pending Verification
                        </button>
                    </div>
                </div>

                {/* Desktop View Toggle */}
                <div className="hidden md:flex justify-center mb-6">
                    <div className="flex rounded-lg bg-gray-800/50 p-1">
                        <button
                            onClick={() => setActiveView('users')}
                            className={`flex items-center px-6 py-2 text-sm rounded-md transition-colors cursor-pointer ${
                                activeView === 'users'
                                    ? 'bg-blue-600 text-white font-medium'
                                    : 'text-gray-300 hover:text-white hover:bg-gray-700/50'
                            }`}
                        >
                            <Users className="w-4 h-4 mr-2" />
                            User Management
                        </button>
                        <button
                            onClick={() => setActiveView('pending')}
                            className={`flex items-center px-6 py-2 text-sm rounded-md transition-colors cursor-pointer ${
                                activeView === 'pending'
                                    ? 'bg-blue-600 text-white font-medium'
                                    : 'text-gray-300 hover:text-white hover:bg-gray-700/50'
                            }`}
                        >
                            <FileCheck className="w-4 h-4 mr-2" />
                            Pending Verification
                        </button>
                    </div>
                </div>

                {/* User Management Section */}
                <div className={activeView === 'users' ? 'block' : 'hidden'}>
                    <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-4 sm:mb-6">
                        <h2 className="text-xl sm:text-2xl md:text-3xl font-bold text-gray-800 mb-3 sm:mb-4 md:mb-0 flex items-center">
                            <Users className="w-6 h-6 sm:w-8 sm:h-8 mr-2 sm:mr-3 text-blue-600" />
                            User Management
                        </h2>
                        <div className="flex flex-col sm:flex-row gap-2 w-full md:w-auto">
                            <div className="relative flex-grow md:flex-grow-0">
                                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
                                <input
                                    type="text"
                                    placeholder="Search users..."
                                    value={tempQuery}
                                    onChange={(e) => setTempQuery(e.target.value)}
                                    onKeyDown={handleSearch}
                                    className="w-full md:w-64 pl-10 pr-4 py-2 rounded-lg bg-gray-100 text-gray-800 placeholder-gray-500 border border-gray-200 focus:outline-none focus:ring-2 focus:ring-blue-500 text-sm"
                                />
                            </div>
                            <div className="flex gap-2">
                                <button
                                    onClick={() => setIsModalOpen(true)}
                                    className="px-4 py-2 bg-gray-100 text-gray-700 rounded-lg hover:bg-gray-200 transition-colors text-sm w-full sm:w-auto cursor-pointer"
                                >
                                    Filter
                                </button>
                                <button className="px-4 py-2 bg-gray-100 text-gray-700 rounded-lg hover:bg-gray-200 transition-colors text-sm flex items-center justify-center gap-2 w-full sm:w-auto cursor-pointer">
                                    <Download className="w-4 h-4" />
                                    Export
                                </button>
                            </div>
                        </div>
                    </div>

                    {/* Mobile User Cards */}
                    <div className="md:hidden space-y-3">
                        {currentUsers.map((user) => (
                            <motion.div
                                key={user.id}
                                initial={{ opacity: 0 }}
                                animate={{ opacity: 1 }}
                                transition={{ duration: 0.3 }}
                                className="bg-white rounded-lg shadow-sm p-3 space-y-2 border border-gray-100"
                            >
                                <div className="flex items-center space-x-3">
                                    <div className="flex-shrink-0 h-10 w-10 bg-gray-100 rounded-full flex items-center justify-center">
                                        <User className="w-5 h-5 text-gray-600" />
                                    </div>
                                    <div>
                                        <div className="font-medium text-gray-900">{user.name}</div>
                                        <div className="text-sm text-gray-500">{user.email}</div>
                                    </div>
                                </div>
                                <div className="flex items-center justify-between">
                                    <span className="text-sm text-gray-600">{getRole(user.role)}</span>
                                    <div className="flex gap-2">
                                        <PromoteUser person={user} />
                                        <DeleteUser person={user} deleteSuccess={deleteSuccess} />
                                    </div>
                                </div>
                            </motion.div>
                        ))}
                    </div>

                    {/* Desktop Table View */}
                    <div className="hidden md:block overflow-x-auto">
                        <table className="min-w-full divide-y divide-gray-200">
                            <thead className="bg-gray-50">
                                <tr>
                                    <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                        <button
                                            onClick={toggleSortOrder}
                                            className="flex items-center space-x-1 hover:text-gray-700"
                                        >
                                            <span>Name</span>
                                            {sortOrder && (
                                                <ChevronDown
                                                    className={`w-4 h-4 transform ${
                                                        sortOrder === "desc" ? "rotate-180" : ""
                                                    }`}
                                                />
                                            )}
                                        </button>
                                    </th>
                                    <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Email</th>
                                    <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Role</th>
                                    <th scope="col" className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">Actions</th>
                                </tr>
                            </thead>
                            <tbody className="bg-white divide-y divide-gray-200">
                                {currentUsers.map((user) => (
                                    <motion.tr
                                        key={user.id}
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
                                                    <div className="text-sm font-medium text-gray-900">{user.name}</div>
                                                </div>
                                            </div>
                                        </td>
                                        <td className="px-6 py-4 whitespace-nowrap">
                                            <div className="text-sm text-gray-900">{user.email}</div>
                                        </td>
                                        <td className="px-6 py-4 whitespace-nowrap">
                                            <div className="text-sm text-gray-900">{getRole(user.role)}</div>
                                        </td>
                                        <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                                            <div className="flex justify-end space-x-2">
                                                {user.role ? (
                                                    user.role & UserRoleDto.ALUMNI && !(user.role & UserRoleDto.ADMIN) ? (
                                                        <PromoteUser person={user} />
                                                    ) : (
                                                        <span className="text-gray-500">Promoted</span>
                                                    )
                                                ) : (
                                                    user.alumniStatus === "pending" ? (
                                                        <span className="text-gray-500">Pending Verification</span>
                                                    ) : (
                                                        <div className="flex items-center gap-x-2">
                                                            <span className="text-gray-500 mr-2">Rejected</span>
                                                            <DeleteUser person={user} deleteSuccess={deleteSuccess} />
                                                        </div>
                                                    )
                                                )}
                                                {user.role && !(user.role & UserRoleDto.ADMIN) && (
                                                    <DeleteUser person={user} deleteSuccess={deleteSuccess} />
                                                )}
                                            </div>
                                        </td>
                                    </motion.tr>
                                ))}
                            </tbody>
                        </table>
                        {filteredUsers.length === 0 && (
                            <div className="text-center py-8">
                                <p className="text-gray-500">No users found</p>
                            </div>
                        )}
                    </div>

                    {/* Pagination */}
                    <div className="mt-4 sm:mt-6 flex flex-col sm:flex-row items-center justify-between space-y-3 sm:space-y-0">
                        <div className="flex justify-center sm:justify-start space-x-2 w-full sm:w-auto order-2 sm:order-1">
                            <button
                                onClick={() => goToPage(currentPage - 1)}
                                disabled={currentPage === 1}
                                className="px-3 py-1 text-sm rounded-md bg-gray-100 text-gray-700 disabled:opacity-50 cursor-pointer disabled:cursor-not-allowed"
                            >
                                Prev
                            </button>
                            {getPageNumbers().map((number) => (
                                <button
                                    key={number}
                                    onClick={() => goToPage(number)}
                                    className={`px-3 py-1 text-sm rounded-md cursor-pointer ${
                                        currentPage === number
                                            ? 'bg-blue-600 text-white'
                                            : 'bg-gray-100 text-gray-700'
                                    }`}
                                >
                                    {number}
                                </button>
                            ))}
                            <button
                                onClick={() => goToPage(currentPage + 1)}
                                disabled={currentPage === totalPages}
                                className="px-3 py-1 text-sm rounded-md bg-gray-100 text-gray-700 disabled:opacity-50 cursor-pointer disabled:cursor-not-allowed"
                            >
                                Next
                            </button>
                        </div>
                        <div className="text-sm text-gray-500 order-1 sm:order-2">
                            Showing {startIndex + 1} to {Math.min(endIndex, filteredUsers.length)} of {filteredUsers.length} entries
                        </div>
                    </div>
                </div>

                {/* Pending Verification Section */}
                <div className={activeView === 'pending' ? 'block' : 'hidden'}>
                    <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-4 sm:mb-6">
                        <h2 className="text-xl sm:text-2xl md:text-3xl font-bold text-gray-800 mb-3 sm:mb-4 md:mb-0 flex items-center">
                            <FileCheck className="w-6 h-6 sm:w-8 sm:h-8 mr-2 sm:mr-3 text-blue-600" />
                            Pending Verification
                        </h2>
                    </div>

                    {/* Mobile Pending Cards */}
                    <div className="md:hidden space-y-3">
                        {pendingVerificationUsers.map((user) => (
                            <motion.div
                                key={user.id}
                                initial={{ opacity: 0 }}
                                animate={{ opacity: 1 }}
                                transition={{ duration: 0.3 }}
                                className="bg-white rounded-lg shadow-sm p-3 space-y-2 border border-gray-100"
                            >
                                <div className="flex items-center space-x-3">
                                    <div className="flex-shrink-0 h-10 w-10 bg-gray-100 rounded-full flex items-center justify-center">
                                        <User className="w-5 h-5 text-gray-600" />
                                    </div>
                                    <div>
                                        <div className="font-medium text-gray-900">{user.name}</div>
                                        <div className="text-sm text-gray-500">{user.email}</div>
                                    </div>
                                </div>
                                <div className="flex flex-col gap-2">
                                    <button
                                        onClick={() => handleDocumentDownload(user.documentUrl || '', user.name)}
                                        className="w-full px-3 py-2 text-sm bg-gray-100 text-gray-700 rounded-md hover:bg-gray-200 transition-colors flex items-center justify-center gap-2"
                                    >
                                        <Download className="w-4 h-4" />
                                        View Document
                                    </button>
                                    <div className="flex gap-2">
                                        <button
                                            onClick={() => handleAccept(user.id)}
                                            className="flex-1 px-3 py-2 text-sm bg-green-600 text-white rounded-md hover:bg-green-700 transition-colors cursor-pointer"
                                        >
                                            Accept
                                        </button>
                                        <button
                                            onClick={() => handleDecline(user.id)}
                                            className="flex-1 px-3 py-2 text-sm bg-red-600 text-white rounded-md hover:bg-red-700 transition-colors cursor-pointer"
                                        >
                                            Decline
                                        </button>
                                    </div>
                                </div>
                            </motion.div>
                        ))}
                        {pendingVerificationUsers.length === 0 && (
                            <div className="text-center py-8 text-gray-500">
                                No pending verifications
                            </div>
                        )}
                    </div>

                    {/* Desktop Pending Table */}
                    <div className="hidden md:block overflow-x-auto">
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
                                                        <button
                                                            onClick={(e) => {
                                                                e.preventDefault();
                                                                if (user.documentUrl) {
                                                                    const fileName = user.documentUrl.split("/").pop()?.split(".")[0] || "document";
                                                                    handleDocumentDownload(user.documentUrl, fileName);
                                                                }
                                                            }}
                                                            className="text-blue-600 hover:text-blue-800 underline flex items-center cursor-pointer"
                                                        >
                                                            View Verification Document
                                                        </button>
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
                                                            className="bg-green-600 hover:bg-green-700 text-white px-4 py-2 rounded-lg cursor-pointer"
                                                            onClick={() => handleAccept(user.id)}
                                                        >
                                                            Accept
                                                        </motion.button>
                                                        <motion.button
                                                            whileHover={{ scale: 1.05 }}
                                                            whileTap={{ scale: 0.95 }}
                                                            className="bg-red-600 hover:bg-red-700 text-white px-4 py-2 rounded-lg cursor-pointer"
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
                    </div>
                </div>

                {/* Filter Modal */}
                <FilterModal
                    isOpen={isModalOpen}
                    onClose={() => setIsModalOpen(false)}
                    selectedRole={roleFilter}
                    onSelectRole={(role: string) => setRoleFilter(role)}
                />
            </motion.div>
        </div>
    );
}