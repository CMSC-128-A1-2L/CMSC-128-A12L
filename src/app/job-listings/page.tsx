"use client";
import { signOut, useSession } from "next-auth/react";
import { useState, useEffect, useRef } from "react";
import JobListingsSidebar from "@/app/components/jobListings_sidebar";
import Navbar from "@/app/components/navBar";
import { redirect } from "next/navigation";
import FilterSidebar from "@/app/components/filtersJobListings";

export default function JobListings() {
    const { data: session, status } = useSession();
    const [sidebarOpen, setSidebarOpen] = useState(false);
    const sidebarRef = useRef<HTMLDivElement>(null);
    const menuButtonRef = useRef<HTMLButtonElement>(null);

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
    <div className="min-h-screen flex flex-col bg-white">
        <Navbar
        setSidebarOpen={setSidebarOpen}
        menuButtonRef={menuButtonRef}
        homePath="/job-listings"
        />
        
        <JobListingsSidebar
        sidebarOpen={sidebarOpen}
        setSidebarOpen={setSidebarOpen}
        sidebarRef={sidebarRef}
        role={session.user.role}
        />
        <FilterSidebar />

    </div>
    );
}