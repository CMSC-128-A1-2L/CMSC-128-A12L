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
import { SlidersHorizontal } from "lucide-react";

import { redirect } from "next/navigation";


export default function JobListings() {
    const [sidebarOpen, setSidebarOpen] = useState(false);
    const menuButtonRef = useRef<HTMLButtonElement>(null);
    const sidebarRef = useRef<HTMLDivElement>(null);

    const [search, setSearch] = useState("");
    const [currentPage, setCurrentPage] = useState(1);
    const itemsPerPage = 10;

    const filteredJobs = jobData.filter((job) => {
        const searchMatch = job.title.toLowerCase().includes(search.toLowerCase());
        return searchMatch;
    });

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

            <div className="flex-grow flex w-screen">
                <FilterSidebar />

                <main className="flex-1 px-12">
                    <div className="flex gap-2 my-4">
                        <button className="btn btn-sqr"><SlidersHorizontal /></button>

                        <div className="flex flex-1 justify-center">
                            <label className="input w-150 input-lg">
                                <svg className="h-[1em] opacity-50" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24"><g strokeLinejoin="round" strokeLinecap="round" strokeWidth="2.5" fill="none" stroke="currentColor"><circle cx="11" cy="11" r="8"></circle><path d="m21 21-4.3-4.3"></path></g></svg>
                                <input type="search"
                                    className=""
                                    placeholder="Search jobs"
                                    value={search}
                                    onChange={(e) => setSearch(e.target.value)} />
                                <kbd className="kbd kbd-sm">ctrl</kbd>
                                <kbd className="kbd kbd-sm">K</kbd>
                            </label>
                        </div>

                        <button className="btn btn-soft">Sort</button>
                        <button className="btn btn-soft">View</button>
                    </div>

                    <div className="w-full flex">
                        <div className="flex flex-wrap gap-3 justify-center">
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
                                <p className="text-gray-500">
                                    No jobs found.
                                </p>
                            )}
                        </div>
                    </div>

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
