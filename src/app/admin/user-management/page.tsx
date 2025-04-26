"use client";

import userData from "@/dummy_data/user.json";
import PromoteUser from "../../components/promoteUser";
import DeleteUser from "../../components/deleteUser";
import { useSession } from "next-auth/react";
import { Search, ChevronLeft, ChevronRight, Download, User, Mail, Shield, Users, FileCheck, ChevronDown } from "lucide-react";
import { useState, useEffect } from "react";
import FilterModal from "../../components/filterModal";
import { motion } from 'framer-motion';
import { UserDto } from "@/models/user";
import ScrollIndicator from "../../components/ScrollIndicator";
import { createNotification } from "@/services/notification.service";

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
        .filter(user => roleFilter === "All" || user.role.toString() === roleFilter);

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
        <div className="w-full px-4 md:px-10">
            <div className="flex flex-col lg:flex-row gap-6">
                {/* User Management Card */}
                <motion.div 
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.5 }}
                    className="bg-white/10 backdrop-blur-md shadow-xl rounded-3xl p-4 md:p-6 w-full lg:w-2/3"
                >
                    <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-6">
                        <h2
                            className="text-2xl md:text-3xl font-bold text-gray-800 mb-4 md:mb-0 flex items-center"
                            style={{ fontFamily: "Montserrat, sans-serif" }}
                        >
                            <Users className="w-8 h-8 mr-3 text-blue-600" />
                            User Management
                        </h2>
                        <div className="flex space-x-2 w-full md:w-auto">
                            <motion.button
                                whileHover={{ scale: 1.05 }}
                                whileTap={{ scale: 0.95 }}
                                className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg flex items-center w-full md:w-auto justify-center cursor-pointer"
                            >
                                <Download className="w-4 h-4 mr-2" />
                                Export
                            </motion.button>
                        </div>
                    </div>

                    {/* Tabs - Scrollable on mobile */}
                    <div className="flex overflow-x-auto mb-6 pb-2 -mx-4 px-4 md:mx-0 md:px-0">
                        {['All', 'admin', 'alumni', 'alumniadmin'].map((tab) => (
                            <motion.button
                                key={tab}
                                whileHover={{ scale: 1.05 }}
                                whileTap={{ scale: 0.95 }}
                                onClick={() => {
                                    setRoleFilter(tab);
                                    setCurrentPage(1);
                                }}
                                className={`px-4 py-2 mr-2 rounded-lg whitespace-nowrap flex-shrink-0 cursor-pointer ${
                                    roleFilter === tab 
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
                                placeholder="Search users..."
                                value={tempQuery}
                                onChange={(e) => setTempQuery(e.target.value)}
                                onKeyDown={handleSearch}
                                className="w-full pl-10 pr-4 py-2 rounded-lg bg-gray-100 text-gray-800 placeholder-gray-500 border border-gray-200 focus:outline-none focus:ring-2 focus:ring-blue-500"
                            />
                        </div>
                        <div className="flex space-x-2">
                            <motion.button
                                whileHover={{ scale: 1.05 }}
                                whileTap={{ scale: 0.95 }}
                                onClick={() => setIsModalOpen(true)}
                                className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg flex items-center w-full md:w-auto justify-center cursor-pointer"
                            >
                                Filters
                            </motion.button>
                        </div>
                    </div>

                    {/* Mobile Card View */}
                    <div className="md:hidden space-y-4">
                        {currentUsers.map((user, index) => (
                            <motion.div
                                key={index}
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
                                        <div className="font-medium text-gray-900">{user.name}</div>
                                        <div className="text-sm text-gray-500">{user.email}</div>
                                    </div>
                                </div>
                                <div className="flex items-center text-sm text-gray-600">
                                    <Shield className="w-4 h-4 mr-2" />
                                    {/* bruh, don't mind these errors, it's just a type error */}
                                    <span>{user.role[0] ? (user.role[0].charAt(0).toUpperCase() + user.role[0].slice(1)) : "Pending Verification"}</span>
                                </div>
                                <div className="flex justify-end space-x-2 pt-2">
                                {user.role[0] ? (
                                                user.role[0] === "alumni" ? (
                                                    <PromoteUser person={user} />
                                                ) : (
                                                    <span className="text-gray-500 text-sm">Promoted</span>
                                                )
                                            ) : (
                                                <span className="text-gray-500 text-sm">Pending Verification</span>
                                            )}
                                </div>
                            </motion.div>
                        ))}
                    </div>

                    {/* Desktop Table View */}
                    <div className="hidden md:block overflow-y-auto max-h-[calc(100vh-300px)] rounded-lg border border-gray-200 [&::-webkit-scrollbar]:hidden">
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
                                            <div>
                                                <div className="font-medium text-gray-900">{user.name}</div>
                                                <div className="text-sm text-gray-500">{user.email || "N/A"}</div>
                                            </div>
                                        </div>
                                        
                                        <div className="flex items-center text-sm text-gray-600">
                                            <Shield className="w-4 h-4 mr-2" />
                                            <span>{user.role[0] ? (user.role[0].charAt(0).toUpperCase() + user.role[0].slice(1)) : "Pending Verification"}</span>
                                        </div>
                                        
                                        <div className="flex justify-end space-x-2 pt-2">
                                            {user.role[0] ? (
                                                user.role[0] === "alumni" ? (
                                                    <PromoteUser person={user} />
                                                ) : (
                                                    <span className="text-gray-500 text-sm">Promoted</span>
                                                )
                                            ) : (
                                                <span className="text-gray-500 text-sm">Pending Verification</span>
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

                {/* Pending Verifications Card - Mobile Friendly */}
                <motion.div 
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.5, delay: 0.2 }}
                    className="bg-white/10 backdrop-blur-md shadow-xl rounded-3xl p-4 md:p-6 w-full lg:w-1/3 h-fit"
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

                    {/* Mobile Card View for Pending Verifications */}
                    <div className="md:hidden space-y-4">
                        {pendingVerificationUsers.length > 0 ? (
                            pendingVerificationUsers.map((user: UserDto, index) => (
                                <motion.div
                                    key={index}
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
                                                        handleDocumentDownload(user.documentUrl, fileName);
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
                                                    className="bg-green-600 hover:bg-green-700 text-white px-4 py-2 rounded-lg text-sm"
                                                    onClick={() => handleAccept(user.id)}
                                                >
                                                    Accept
                                                </motion.button>
                                                <motion.button
                                                    whileHover={{ scale: 1.05 }}
                                                    whileTap={{ scale: 0.95 }}
                                                    className="bg-red-600 hover:bg-red-700 text-white px-4 py-2 rounded-lg text-sm"
                                                    onClick={() => handleDecline(user.id)}
                                                >
                                                    Decline
                                                </motion.button>
                                            </div>
                                        )}
                                    </div>
                                </motion.div>
                            ))
                        ) : (
                            <div className="bg-white rounded-lg shadow p-6 text-center">
                                <p className="text-gray-500 text-lg">No pending verifications</p>
                            </div>
                        )}
                    </div>

                    {/* Desktop Table View for Pending Verifications */}
                    <div className="hidden md:block">
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
                                                                handleDocumentDownload(user.documentUrl, fileName);
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
                    </div>
                </motion.div>
            </div>
            
            {/* Page Scroll Indicator */}
            <ScrollIndicator className="hidden md:block" />
        </div>
    );
}