"use client";

import { useState, useEffect, useRef } from "react";
import Navbar from "@/app/components/navBar";
import JobListingsSidebar from "@/app/components/jobListings_sidebar";
import FilterSidebar from "@/app/components/filtersJobListings";
import JobCard from "../components/jobCard";
import JobDetails from "../components/jobDetails";
import { FiFilter } from "react-icons/fi";
import { IoIosArrowForward, IoIosArrowBack } from "react-icons/io";
import jobData from "@/dummy_data/job.json";
import { redirect } from "next/navigation";

type Alumni = {
    role: string;
    studentId: string;
    firstName: string;
    middleName?: string | null;
    lastName: string;
    suffix?: string | null;
    gender?: string;
    bio?: string;
    linkedIn?: string;
    contactNumbers?: string[];
};

export default function JobListings() {
    const [sidebarOpen, setSidebarOpen] = useState(false);
    const menuButtonRef = useRef<HTMLButtonElement>(null);
    const sidebarRef = useRef<HTMLDivElement>(null);

    const [search, setSearch] = useState("");
    const [selectedFilter, setSelectedFilter] = useState({
        role: "",
        gender: "",
    });
    const [currentPage, setCurrentPage] = useState(1);
    const [showFilter, setShowFilter] = useState(false);
    const itemsPerPage = 12;
    const filterRef = useRef<HTMLDivElement>(null);

    useEffect(() => {
        function handleClickOutside(event: MouseEvent) {
            if (
                showFilter &&
                filterRef.current &&
                !filterRef.current.contains(event.target as Node)
            ) {
                setShowFilter(false);
            }
        }

        document.addEventListener("mousedown", handleClickOutside);
        return () => document.removeEventListener("mousedown", handleClickOutside);
    }, [showFilter]);

    // Filter job listings based on search and selected filters
    const filteredJobs = jobData.filter((job) => {
        const searchMatch = job.title.toLowerCase().includes(search.toLowerCase());
        const roleMatch =
            selectedFilter.role === "" || job.title === selectedFilter.role;

        return searchMatch && roleMatch;
    });

    // Clear filters
    const clearFilters = () => {
        setSelectedFilter({ role: "", gender: "" });
        setSearch("");
    };

    // Pagination logic
    const totalPages = Math.ceil(filteredJobs.length / itemsPerPage);
    const displayedJobs = filteredJobs.slice(
        (currentPage - 1) * itemsPerPage,
        currentPage * itemsPerPage
    );

    return (
        <div className="flex flex-col h-screen">
            <Navbar
                setSidebarOpen={setSidebarOpen}
                menuButtonRef={menuButtonRef}
                homePath="/job-listings"
            />

            <JobListingsSidebar
                sidebarOpen={sidebarOpen}
                setSidebarOpen={setSidebarOpen} 
                sidebarRef={sidebarRef}
            />

            <div className="mx-8 my-4 prose lg:prose-xl">
                <h1 className="">Jobs</h1>
            </div>

            <div className="flex-grow flex">
                <FilterSidebar />

                <main className="flex-1">
                    {/* Search/Sort/View Section */}
                    <div className="flex justify-center my-4">
                        <div className="flex space-x-2 max-w-7xl">
                            <input
                                type="text"
                                placeholder="Search jobs"
                                value={search}
                                onChange={(e) => setSearch(e.target.value)}
                                className="input input-bordered w-96 bg-white"
                            />
                        </div>
                    </div>

                    {/* Job Listings Grid */}
                    <div className="w-full flex justify-center px-6">
                        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-6 gap-4 max-w-7xl">
                            {displayedJobs.length > 0 ? (
                                displayedJobs.map((job, index) => (
                                    <JobCard
                                        key={index}
                                        title={job.title}
                                        company={job.company}
                                        location={job.location}
                                        description={job.description}
                                        imageUrl={job.imageUrl}
                                        onApplyClick={() => console.log(`Applying for ${job.title}`)}
                                    />
                                ))
                            ) : (
                                <p className="text-gray-500 text-center w-full col-span-full">
                                    No jobs found.
                                </p>
                            )}
                        </div>
                    </div>

                    {/* Pagination */}
                    {totalPages > 1 && (
                        <div className="flex justify-center items-center space-x-4 my-4 px-6 w-full">
                            <button
                                onClick={() => setCurrentPage(currentPage - 1)}
                                disabled={currentPage === 1}
                                className="btn btn-outline btn-sm"
                            >
                                <IoIosArrowBack />
                            </button>
                            <span>
                                {currentPage} / {totalPages}
                            </span>
                            <button
                                onClick={() => setCurrentPage(currentPage + 1)}
                                disabled={currentPage === totalPages}
                                className="btn btn-outline btn-sm"
                            >
                                <IoIosArrowForward />
                            </button>
                        </div>
                    )}
                </main>
            </div>
        </div>
    );
}