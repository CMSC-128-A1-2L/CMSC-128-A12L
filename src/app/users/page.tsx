"use client"
import userData from "@/dummy_data/user.json";
import PromoteUser from "../components/promoteUser";
import DeleteUser from "../components/deleteUser";
import { signOut, useSession } from "next-auth/react";
import { Menu, X, LogOut, User, Briefcase, Calendar, DollarSign, Bell, Users } from "lucide-react";
import { useState, useEffect, useRef } from "react";
import Link from "next/link";
import { text } from "stream/consumers";

export default function UsersManagement(){
   
    const alumniUsers = userData.filter(user => user.role === "alumni");
   return(
    <div className="min-h-screen flex flex-col bg-white">
        <header style={{ backgroundColor: "#0C0051" }} className="text-white py-4">
        <div className="container mx-auto px-4 flex justify-between items-center">
          <div className="flex items-center">
            <h1 className="text-xl font-bold cursor-pointer">AEGIS |</h1>
          </div>
          <div className="flex items-center space-x-4">
            <button className="focus:outline-none cursor-pointer"baria-label="Sign Out">
              <LogOut size={20} />
            </button>
          </div>
        </div>
      </header>

        <div className="flex pt-4 px-20">
            <a className="btn btn-ghost text-xl">User Management</a>
        </div>
        <div className="flex-none">
        <button className="btn btn-square btn-ghost">
        </button>

        </div>
        
        <div className="flex px-15 justify-end">
        <label className="mb-2 text-sm font-medium text-gray-900 sr-only dark:text-white">Search</label>
        <div className="relative">
            <div className="absolute inset-y-0 start-0 flex items-center ps-3 pointer-events-none">
                <svg className="w-4 h-4 text-gray-500 dark:text-gray-400" aria-hidden="true" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 20 20">
                    <path stroke="currentColor" stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="m19 19-4-4m0-7A7 7 0 1 1 1 8a7 7 0 0 1 14 0Z"/>
                </svg>
            </div>
            <input type="search" className="block w-full p-2.5 ps-10 text-sm text-black border border-gray-300 rounded-lg" placeholder="Search" />
        </div>
        <button className="btn ml-3 bg-[#0C0051] text-white hover:bg-[#12006A]" style={{ fontFamily: "Montserrat, sans-serif", fontSize: "15px", cursor: "pointer"}}>Filters</button>
       
        </div>
        <div className="px-3 py-4">
            {/* displays users */}
            <table className="table text-center">
                <thead>
                <tr>
                    <th>Name</th>
                    <th>Email</th>
                    <th>Actions</th>
                </tr>
                </thead>
                <tbody>
                    {alumniUsers.map((user, index) => 
                    
                    <tr key={index}>
                        <td className="text-black">{user.firstName} {user.lastName}</td>
                        <td> Email </td>
                        <td> <PromoteUser name={{ firstName: user.firstName, lastName: user.lastName}} /> <DeleteUser name={{ firstName: user.firstName, lastName: user.lastName}} /> </td>
                    </tr>
                    )}
                </tbody>
            </table>
            {alumniUsers.length === 0 && <p className="text-center text-gray-500 mt-4">No Alumni Found</p>}
        </div>
    </div>
   );
}