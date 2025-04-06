"use client";

import { useState, useRef } from "react";
import Navbar from "@/app/components/navBar";
import JobListingsSidebar from "@/app/components/jobListings_sidebar";
import FilterSidebar from "@/app/components/filtersJobListings";
import JobCard from "../components/jobCard";
import JobDetails from "../components/jobDetails";
import jobData from "@/dummy_data/job.json";
import {
  SlidersHorizontal,
  Search,
  ArrowDownUp,
  LayoutGrid,
  ChevronRight,
  ChevronLeft,
  Plus,
} from "lucide-react";

export default function JobListings() {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const menuButtonRef = useRef<HTMLButtonElement>(null);
  const sidebarRef = useRef<HTMLDivElement>(null);

  const [search, setSearch] = useState("");
  const [filterSidebarOpen, setFilterSidebarOpen] = useState(true);
  const [currentPage, setCurrentPage] = useState(1);
  const [selectedJob, setSelectedJob] = useState<any>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const itemsPerPage = 12;

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
    // Use the DaisyUI modal show method
    const modal = document.getElementById(
      "job_details_modal"
    ) as HTMLDialogElement;
    if (modal) {
      modal.showModal();
      setIsModalOpen(true);
    }
  };

  const handleCloseModal = () => {
    setIsModalOpen(false);
  };

  const handleApply = (jobTitle: string) => {
    console.log(`Applying for ${jobTitle}`);
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

      {/* Toolbar */}
      <div className="flex items-center align-center gap-2 m-4 my-6">
        <div className="flex items-center gap-2 w-64">
          {/* Filter sidebar toggle */}
          <button
            className="btn btn-sqr btn-soft"
            onClick={() => setFilterSidebarOpen(!filterSidebarOpen)}
          >
            <SlidersHorizontal />{" "}
          </button>

          {/* Placeholder */}
          <button className="btn btn-primary btn-lg flex-grow rounded-3xl">
            {" "}
            <Plus /> Test{" "}
          </button>
        </div>

        {/* Placeholder */}
        <button className="btn btn-ghost btn-lg">
          My job listings
        </button>

        {/* Search bar */}
        <div className="flex flex-1 justify-center">
          <label className="input w-150 input-lg">
            <Search />
            <input
              type="search"
              className=""
              placeholder="Search jobs"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
            />
            <kbd className="kbd kbd-sm">ctrl</kbd>
            <kbd className="kbd kbd-sm">K</kbd>
          </label>
        </div>

        {/* Filter/view dropbar */}
        <button className="btn btn-soft">
          <ArrowDownUp /> Sort{" "}
        </button>
        <button className="btn btn-soft">
          <LayoutGrid /> View{" "}
        </button>
      </div>

      <div className="flex-grow flex w-screen">
        {/* Sidebar */}
        <aside className="flex flex-col gap-4 mx-4 mb-4">
          <FilterSidebar
            isOpen={filterSidebarOpen}
            setIsOpen={setFilterSidebarOpen}
          />
        </aside>

        <main className="flex-1 pr-8">
          {/* Job listing grid */}
          <div className="w-full flex justify-center">
            <div className="flex flex-wrap gap-3 justify-center">
              {displayedJobs.length > 0 ? (
                displayedJobs.map((job, index) => (
                  <JobCard
                    key={index}
                    title={job.title}
                    company={job.company}
                    location={job.location}
                    jobType={job.job_type}
                    workType={job.work_type}
                    description={job.description}
                    imageUrl={job.imageUrl}
                    onDetailsClick={() => handleJobDetails(job)}
                    onApplyClick={() => handleApply(job.title)}
                  />
                ))
              ) : (
                <p className="text-gray-500">No jobs found.</p>
              )}
            </div>
          </div>

          {/* Job Details Modal */}
          {selectedJob && (
            <JobDetails
              title={selectedJob.title}
              company={selectedJob.company}
              location={selectedJob.location}
              salary={selectedJob.salary}
              jobType={selectedJob.job_type}
              workType={selectedJob.work_type}
              description={selectedJob.description}
              isOpen={isModalOpen}
              onClose={handleCloseModal}
              onApplyClick={() => handleApply(selectedJob.title)}
            />
          )}

          {/* Pagination */}
          {totalPages > 1 && (
            <div className="flex justify-center items-center space-x-4 my-4 px-6 w-full select-none">
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
        </main>
      </div>
    </div>
  );
}
