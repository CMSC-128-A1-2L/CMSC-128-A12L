"use client";

import userData from "@/dummy_data/user.json";
import PromoteUser from "../../components/promoteUser";
import DeleteUser from "../../components/deleteUser";
import { signOut, useSession } from "next-auth/react";
import { Menu, X, LogOut, User, Briefcase, Calendar, DollarSign, Bell, Users } from "lucide-react";
import { useState, useEffect, useRef } from "react";
import Link from "next/link";
import { text } from "stream/consumers";
import FilterModal from "../../components/filterModal";

export default function UsersManagement(){
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
    <div className="min-h-screen flex flex-col bg-white">
        <header style={{ backgroundColor: "#0C0051" }} className="text-white py-4">
        <div className="container mx-auto flex justify-between items-center">
          <div className="flex-1">
          <h1 className="text-xl font-bold z" style={{cursor: "pointer"}} 
          onClick={() => {
            setTempQuery("");
            setSearchQuery("");
            setSortOrder(null);
            setRoleFilter("All");
        }}>
            AEGIS | <span className="text-lg font-normal">User Management</span>
            </h1>

          </div>
          <div className="flex">
            <button className="focus:outline-none cursor-pointer"baria-label="Sign Out">
              <LogOut size={20} />
            </button>
          </div>
        </div>
      </header>
  
        <div className="mt-5">
        <div className="flex justify-end">
        <label className="mb-2 text-sm font-medium text-gray-900 sr-only dark:text-white">Search</label>
        <div className="relative w-full sm:w-auto">
            <div className="absolute inset-y-0 start-0 flex items-center ps-3 pointer-events-none">
                <svg className="w-4 h-4 text-gray-500 dark:text-gray-400" aria-hidden="true" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 20 20">
                    <path stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="m19 19-4-4m0-7A7 7 0 1 1 1 8a7 7 0 0 1 14 0Z"/>
                </svg>
            </div>
            <input  type="search" 
                    className="block w-full p-2.5 ps-10 text-sm text-black border border-gray-300 rounded-lg" 
                    placeholder="Search" 
                    value={tempQuery} 
                    onChange={(e) => setTempQuery(e.target.value)} 
                    onKeyDown={handleSearch} />
        </div>
        <button className="btn ml-3 bg-[#0C0051] text-white hover:bg-[#12006A] mr-3" 
                style={{ fontFamily: "Montserrat, sans-serif", fontSize: "15px", cursor: "pointer"}}
                onClick={() => setIsModalOpen(true)}>Filters
        </button>
        
        </div>
        <FilterModal 
                    isOpen={isModalOpen}
                    onClose={() => setIsModalOpen(false)}
                    selectedRole={roleFilter}
                    onSelectRole={setRoleFilter}
                />
        <div>
            {/* displays users */}
            <table className="table text-center">
                <thead>
                <tr>
                    <th className="text-left text-black" style={{cursor:"pointer"}} onClick={toggleSortOrder}>Name {sortOrder === "asc" ? "▲" : sortOrder === "desc" ? "▼" : ""}</th>
                    <th className="text-left text-black">Role</th>
                    <th className="text-left text-black">Email</th>
                    <th className="text-center text-black">Actions</th>
                </tr>
                </thead>
                <tbody className="mr-0">
                    {alumniUsers.map((user, index) => 
                    
                    <tr key={index}>
                        <td className="text-black text-left" >{user.firstName} {user.lastName}</td>
                        <td className="text-black text-left" >{user.role}</td>
                        <td className="text-black text-left"> Email </td>
                        <td className="text-center"> <PromoteUser name={{ firstName: user.firstName, lastName: user.lastName}} /> <DeleteUser person={{ firstName: user.firstName, lastName: user.lastName}} /> </td>
                    </tr>
                    )}
                </tbody>
            </table>
            {alumniUsers.length === 0 && <p className="text-center text-gray-500 mt-4">No Alumni Found</p>}
        </div>
        </div>
    </div>
   );
}