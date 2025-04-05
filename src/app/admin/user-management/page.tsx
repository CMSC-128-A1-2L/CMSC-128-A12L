"use client";

import userData from "@/dummy_data/user.json";
import PromoteUser from "../../components/promoteUser";
import DeleteUser from "../../components/deleteUser";
import { useSession } from "next-auth/react";
import { Search } from "lucide-react";
import { useState, useEffect } from "react";
import FilterModal from "../../components/filterModal";
import { motion } from 'framer-motion';

export default function UsersManagement(){
    const { data: session } = useSession();
    const [tempQuery, setTempQuery] = useState("");
    const [searchQuery, setSearchQuery] = useState("");
    const [sortOrder, setSortOrder] = useState<"asc" | "desc" | null>(null);
    const [roleFilter, setRoleFilter] = useState("All");
    const [isModalOpen, setIsModalOpen] = useState(false);

    // function for clicking "Name" label
    const toggleSortOrder = () => {
        setSortOrder((prevOrder) => (prevOrder === "asc" ? "desc" : "asc"));
    };

    // search input box only works for when user presses enter key
    const handleSearch = (e: any) => {
        if (e.key === "Enter") {  // Check if Enter key is pressed
            setSearchQuery(tempQuery);
        }
    };

    const alumniUsers = userData
        .filter(user => 
        `${user.firstName} ${user.lastName}`.toLowerCase().includes(searchQuery.toLowerCase())
        )
        .filter(user => roleFilter === "All" || user.role === roleFilter);

    if (sortOrder === "asc") {
        alumniUsers.sort((a, b) => a.firstName.localeCompare(b.firstName));
    } else if (sortOrder === "desc") {
        alumniUsers.sort((a, b) => b.firstName.localeCompare(a.firstName));
    }
    
    return(
        <div className="w-full">
            <motion.div 
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5 }}
                className="bg-white shadow-xl rounded-3xl p-6 w-full"
            >
                <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-6">
                    <h2
                        className="text-3xl font-bold text-gray-800 mb-4 md:mb-0"
                        style={{ fontFamily: "Montserrat, sans-serif" }}
                    >
                        User Management
                    </h2>
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
                    onSelectRole={setRoleFilter}
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
                            {alumniUsers.map((user, index) => (
                                <motion.tr 
                                    key={index}
                                    initial={{ opacity: 0 }}
                                    animate={{ opacity: 1 }}
                                    transition={{ duration: 0.3 }}
                                    className="hover:bg-gray-50 transition-colors"
                                >
                                    <td className="px-6 py-4 whitespace-nowrap text-gray-800">
                                        {user.firstName} {user.lastName}
                                    </td>
                                    <td className="px-6 py-4 whitespace-nowrap text-gray-800">
                                        {user.role}
                                    </td>
                                    <td className="px-6 py-4 whitespace-nowrap text-gray-800">
                                        {user.email || "Email"}
                                    </td>
                                    <td className="px-6 py-4 whitespace-nowrap text-center">
                                        <div className="flex justify-center space-x-2">
                                            <PromoteUser name={{ firstName: user.firstName, lastName: user.lastName}} />
                                            <DeleteUser person={{ firstName: user.firstName, lastName: user.lastName}} />
                                        </div>
                                    </td>
                                </motion.tr>
                            ))}
                        </tbody>
                    </table>
                    {alumniUsers.length === 0 && (
                        <div className="text-center py-8">
                            <p className="text-gray-500">No users found</p>
                        </div>
                    )}
                </div>
            </motion.div>
        </div>
    );
}