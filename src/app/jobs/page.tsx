"use client";

import { useState, useEffect, useRef } from "react";
import Navbar from "@/app/components/navBar";
import JobListingsSidebar from "@/app/components/jobListings_sidebar";
import FilterSidebar from "@/app/components/filtersJobListings";
import JobCard from "../components/jobCard";
import JobDetails from "../components/jobDetails";
import jobData from "@/dummy_data/job.json";
import { SlidersHorizontal, Search, ArrowDownUp, LayoutGrid, ChevronRight, ChevronLeft, Plus} from "lucide-react";

export default function JobListings() {
    const [sidebarOpen, setSidebarOpen] = useState(false);
    const menuButtonRef = useRef<HTMLButtonElement>(null);
    const sidebarRef = useRef<HTMLDivElement>(null);

    const [search, setSearch] = useState("");
    const [currentPage, setCurrentPage] = useState(1);
    const [selectedJob, setSelectedJob] = useState<any>(null);
    const [isModalOpen, setIsModalOpen] = useState(false);
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

    const handleJobDetails = (job: any) => {
        setSelectedJob(job);
        setIsModalOpen(true);
    };

    const handleCloseModal = () => {
        setIsModalOpen(false);
    };

    const handleApply = (jobTitle: string) => {
        console.log(`Applying for ${jobTitle}`);
        // Application logic would go here
    };

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

            <div className="mx-8 mt-16 my-4 prose lg:prose-xl">
                {/* <h1 className="">Jobs</h1> */}
            </div>

            <div className="flex-grow flex w-screen">
                <aside className="flex flex-col gap-4 m-4">
                    <button className="btn btn-wide btn-primary btn-lg rounded-3xl"> <Plus/> Test </button>
                    <FilterSidebar />
                </aside>

                <main className="flex-1 px-12">
                    <div className="flex items-center align-center gap-2 my-4">
                        <button className="btn btn-sqr btn-soft"> <SlidersHorizontal /> </button>

                        <div className="flex flex-1 justify-center">
                            <label className="input w-150 input-lg">
                                <Search />
                                <input type="search"
                                    className=""
                                    placeholder="Search jobs"
                                    value={search}
                                    onChange={(e) => setSearch(e.target.value)} />
                                <kbd className="kbd kbd-sm">ctrl</kbd>
                                <kbd className="kbd kbd-sm">K</kbd>
                            </label>
                        </div>

                        <button className="btn btn-soft"> <ArrowDownUp /> Sort </button>
                        <button className="btn btn-soft"> <LayoutGrid /> View </button>
                    </div>

                    <div className="w-full flex justify-center">
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
                                        onDetailsClick={() => handleJobDetails(job)}
                                        onApplyClick={() => handleApply(job.title)}
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
                                className="btn btn-sqr"
                            >
                                <ChevronLeft />
                            </button>
                            <span>
                                {currentPage} / {totalPages}
                            </span>
                            <button
                                onClick={() => setCurrentPage(currentPage + 1)}
                                disabled={currentPage === totalPages}
                                className="btn btn-sqr"
                            >
                                <ChevronRight />
                            </button>
                        </div>
                    )}

                    {/* Job Details Modal */}
                    {selectedJob && (
                        <JobDetails
                            title={selectedJob.title}
                            company={selectedJob.company}
                            location={selectedJob.location}
                            salary={selectedJob.salary}
                            description={selectedJob.description}
                            isOpen={isModalOpen}
                            onClose={handleCloseModal}
                            onApplyClick={() => handleApply(selectedJob.title)}
                        />
                    )}
                </main>
            </div>
        </div>
    );
}