"use client";

import userData from "@/dummy_data/user.json";
import PromoteUser from "../../components/promoteUser";
import DeleteUser from "../../components/deleteUser";
import { useSession } from "next-auth/react";
import { Search, ChevronLeft, ChevronRight, Download, User, Mail, Shield } from "lucide-react";
import { useState, useEffect } from "react";
import FilterModal from "../../components/filterModal";
import { motion } from 'framer-motion';
import { UserDto } from "@/models/user";

export default function UsersManagement(){
    const { data: session } = useSession();
    const [tempQuery, setTempQuery] = useState("");
    const [searchQuery, setSearchQuery] = useState("");
    const [sortOrder, setSortOrder] = useState<"asc" | "desc" | null>(null);
    const [roleFilter, setRoleFilter] = useState("All");
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [alumniUsers, setAlumniUsers] = useState<UserDto[]>([]);
    useEffect(() => {
        const fetchAlumniUsers = async () => {
            const response = await fetch("/api/admin/users");
            const data = await response.json();
            data.forEach((datas) => {
                console.log(datas)
            })
            setAlumniUsers(data);
        }
        fetchAlumniUsers();
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
    
    return(
        <div className="w-full">
            <motion.div 
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5 }}
                className="bg-white/10 backdrop-blur-md shadow-xl rounded-3xl p-6 w-full"
            >
                <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-6">
                    <h2
                        className="text-3xl font-bold text-gray-800 mb-4 md:mb-0"
                        style={{ fontFamily: "Montserrat, sans-serif" }}
                    >
                        User Management
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

                {/* Tabs */}
                <div className="flex overflow-x-auto mb-6 pb-2">
                    {['All', 'admin', 'alumni', 'alumniadmin'].map((tab) => (
                        <motion.button
                            key={tab}
                            whileHover={{ scale: 1.05 }}
                            whileTap={{ scale: 0.95 }}
                            onClick={() => {
                                setRoleFilter(tab);
                                setCurrentPage(1);
                            }}
                            className={`px-4 py-2 mr-2 rounded-lg whitespace-nowrap ${
                                roleFilter === tab 
                                    ? 'bg-blue-600 text-white font-semibold' 
                                    : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                            }`}
                        >
                            {tab}
                        </motion.button>
                    ))}
                </div>

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
                            className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg flex items-center"
                        >
                            Filters
                        </motion.button>
                    </div>
                </div>
                
                <FilterModal 
                    isOpen={isModalOpen}
                    onClose={() => setIsModalOpen(false)}
                    selectedRole={roleFilter}
                    onSelectRole={(role) => {
                        setRoleFilter(role);
                        setCurrentPage(1); // Reset to first page when changing filters
                    }}
                />
                
                <div className="overflow-x-auto rounded-lg border border-gray-200">
                    <table className="min-w-full divide-y divide-gray-200">
                        <thead className="bg-gray-50">
                            <tr>
                                <th 
                                    className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider cursor-pointer"
                                    onClick={toggleSortOrder}
                                >
                                    Name {sortOrder === "asc" ? "▲" : sortOrder === "desc" ? "▼" : ""}
                                </th>
                                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Role</th>
                                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Email</th>
                                <th className="px-6 py-3 text-center text-xs font-medium text-gray-500 uppercase tracking-wider">Actions</th>
                            </tr>
                        </thead>
                        <tbody className="bg-white divide-y divide-gray-200">
                            {currentUsers.map((user, index) => (
                                <motion.tr 
                                    key={index}
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
                                                <div className="text-sm font-medium">{user.name}</div>
                                            </div>
                                        </div>
                                    </td>
                                    <td className="px-6 py-4 whitespace-nowrap text-gray-800">
                                        <div className="flex items-center">
                                            <Shield className="w-4 h-4 mr-2 text-gray-600" />
                                            <span>{user.role}</span>
                                        </div>
                                    </td>
                                    <td className="px-6 py-4 whitespace-nowrap text-gray-800">
                                        <div className="flex items-center">
                                            <Mail className="w-4 h-4 mr-2 text-gray-600" />
                                            <span>{user.email || "N/A"}</span>
                                        </div>
                                    </td>
                                    <td className="px-6 py-4 whitespace-nowrap text-center">
                                        <div className="flex justify-center space-x-2">
                                            {user.role[0] === "alumni" ? <PromoteUser person={user} /> : <span className="pt-1 text-gray-500 font-bold">Promoted</span>}
                                            {user.role[0] !== "admin" ? <DeleteUser person={user} deleteSuccess={deleteSuccess} /> : null}
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
                
                {/* Pagination Controls */}
                {filteredUsers.length > 0 && (
                    <div className="flex justify-between items-center mt-6">
                        <div className="text-gray-600 text-sm">
                            Showing {startIndex + 1} to {Math.min(endIndex, filteredUsers.length)} of {filteredUsers.length} users
                        </div>
                        <div className="flex space-x-2">
                            <motion.button
                                whileHover={{ scale: 1.05 }}
                                whileTap={{ scale: 0.95 }}
                                onClick={() => goToPage(currentPage - 1)}
                                disabled={currentPage === 1}
                                className={`px-4 py-2 rounded-lg ${
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
                                    className={`px-4 py-2 rounded-lg ${
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
                                className={`px-4 py-2 rounded-lg ${
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
        </div>
    );
}