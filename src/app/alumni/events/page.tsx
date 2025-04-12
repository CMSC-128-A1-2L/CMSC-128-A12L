"use client";

import { useState, useRef } from "react";
import FilterSidebar from "@/app/components/filtersJobListings";
import EventCard from "@/app/components/alumniEventCard";
import EventRow from "@/app/components/alumniEventRow";
import JobDetails from "@/app/components/jobDetails";
import SponsorshipsModal from "@/app/components/sponsorshipsModal";
import EditJobListComponent from "@/app/components/editJobList";
import jobData from "@/dummy_data/job.json";

import CreateEvent from "@/pages/createEvent";
// Refactor add event list and edit event to use modal than page
import EditEventModal from "@/app/components/editEvent";

import {
  Search,
  LayoutGrid,
  LayoutList,
  ChevronRight,
  ChevronLeft,
  Plus,
  Filter,
} from "lucide-react";
import { motion } from "framer-motion";

export default function JobListings() {
  // Add Event modal state
  const [showEventModal, setShowEventModal] = useState(false);

  // Sidebar state
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const menuButtonRef = useRef<HTMLButtonElement>(null);
  const sidebarRef = useRef<HTMLDivElement>(null);

  // Filter sidebar state
  const [filterSidebarOpen, setFilterSidebarOpen] = useState(true);

  // Search state
  const [search, setSearch] = useState("");

  // Job details/Edit job details modal state
  const [selectedJob, setSelectedJob] = useState<any>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);

  // View toggle state
  const [isGridView, setIsGridView] = useState(true);
  const toggleView = () => {
    setIsGridView(!isGridView);
  };

  // Add filter state
  const [activeFilters, setActiveFilters] = useState({
    jobType: {
      fullTime: false,
      partTime: false,
      contract: false,
    },
    workType: {
      onSite: false,
      remote: false,
      hybrid: false,
    },
  });

  // Handle filter changes from FilterSidebar
  const handleFilterChange = (filters: any) => {
    setActiveFilters(filters);
    setCurrentPage(1); // Reset to first page when filters change
  };

  // Apply search/filters
  const filteredJobs = jobData.filter((job) => {
    // Search filter
    const searchMatch =
      job.title.toLowerCase().includes(search.toLowerCase()) ||
      job.company.toLowerCase().includes(search.toLowerCase()) ||
      job.description.toLowerCase().includes(search.toLowerCase());

    // Job Type filter
    const jobTypeFiltersActive =
      activeFilters.jobType.fullTime ||
      activeFilters.jobType.partTime ||
      activeFilters.jobType.contract;

    const jobTypeMatch =
      !jobTypeFiltersActive ||
      (activeFilters.jobType.fullTime && job.job_type === "Full-time") ||
      (activeFilters.jobType.partTime && job.job_type === "Part-time") ||
      (activeFilters.jobType.contract && job.job_type === "Contract");

    // Work Type filter
    const workTypeFiltersActive =
      activeFilters.workType.onSite ||
      activeFilters.workType.remote ||
      activeFilters.workType.hybrid;

    const workTypeMatch =
      !workTypeFiltersActive ||
      (activeFilters.workType.onSite && job.work_type === "On-site") ||
      (activeFilters.workType.remote && job.work_type === "Remote") ||
      (activeFilters.workType.hybrid && job.work_type === "Hybrid");

    return searchMatch && jobTypeMatch && workTypeMatch;
  });

  // Handle Pagination
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 12;

  const totalPages = Math.ceil(filteredJobs.length / itemsPerPage);
  const displayedJobs = filteredJobs.slice(
    (currentPage - 1) * itemsPerPage,
    currentPage * itemsPerPage
  );

  // Handle job details modal
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

  // Handle Apply to Job button click
  const handleApply = (jobTitle: string) => {
    console.log(`Applying for ${jobTitle}`);
  };

  // Handle Sponsor Details button click
  const handleSponsor = (job:any) => {
    setSelectedJob(job);
    // Use the DaisyUI modal show method
    const modal = document.getElementById(
      "sponsor_details_modal"
    ) as HTMLDialogElement;
    if (modal) {
      modal.showModal();
      setIsModalOpen(true);
    }
  };  

  // Handle Edit Job button click
  const handleEdit = (job: any) => {
    setSelectedJob(job);
    // Use the DaisyUI modal show method
    const modal = document.getElementById(
      "edit_job_modal"
    ) as HTMLDialogElement;
    if (modal) {
      modal.showModal();
      setIsModalOpen(true);
    }
  };

  return (
    <div className="flex flex-col min-h-screen bg-[#151821]">
      {/* Main container */}
      <div className="flex-1 container mx-auto px-6">
        {/* Toolbar */}
        <div className="flex items-center gap-4 py-4">
          {/* Left section */}
          <div className="flex items-center gap-3">
            <button
              className="btn btn-ghost btn-sm rounded-lg"
              onClick={() => setFilterSidebarOpen(!filterSidebarOpen)}
            >
              <Filter size={18} />
            </button>
            <button
              onClick={() => setShowEventModal(true)}
              className="btn btn-primary btn-sm rounded-lg"
            >
              <Plus size={18} /> Add Event
            </button>
          </div>

          {/* Search bar - center */}
          <div className="flex-1 max-w-2xl mx-auto">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={18} />
              <input
                type="search"
                placeholder="Search events"
                className="input input-bordered w-full pl-10 pr-16 bg-[#1e2433] border-gray-700 text-gray-200"
                value={search}
                onChange={(e) => setSearch(e.target.value)}
              />
              <div className="absolute right-3 top-1/2 transform -translate-y-1/2 flex items-center gap-1">
                <kbd className="kbd kbd-sm">ctrl</kbd>
                <kbd className="kbd kbd-sm">K</kbd>
              </div>
            </div>
          </div>

          {/* View toggle - right */}
          <button onClick={toggleView} className="btn btn-ghost btn-sm rounded-lg text-gray-300">
            {isGridView ? (
              <>
                <LayoutList size={18} /> List
              </>
            ) : (
              <>
                <LayoutGrid size={18} /> Grid
              </>
            )}
          </button>
        </div>

        {/* Content area */}
        <div className="flex gap-6 mt-6">
          {/* Sidebar */}
          <aside className={`w-64 flex-shrink-0 ${filterSidebarOpen ? 'block' : 'hidden'} lg:block`}>
              <FilterSidebar
                isOpen={filterSidebarOpen}
                setIsOpen={setFilterSidebarOpen}
                onFilterChange={handleFilterChange}
              />
          </aside>

          <main className="flex-1">
            {/* Active filters */}
            <div className="flex flex-wrap items-center gap-2 mb-4">
              {Object.entries({...activeFilters.jobType, ...activeFilters.workType}).map(([key, value]) =>
                value ? (
                  <div
                    key={key}
                    className="badge badge-lg gap-2 px-3 py-3 bg-[#1e2433] text-white border-none"
                  >
                    {key === "fullTime"
                      ? "Full-time"
                      : key === "partTime"
                      ? "Part-time"
                      : key === "contract"
                      ? "Contract"
                      : key === "onSite"
                      ? "On-site"
                      : key === "remote"
                      ? "Remote"
                      : "Hybrid"}
                    <button
                      className="opacity-60 hover:opacity-100"
                      onClick={() => {
                        const newFilters = { ...activeFilters };
                        if (key in newFilters.jobType) {
                          newFilters.jobType[key as keyof typeof newFilters.jobType] = false;
                        } else if (key in newFilters.workType) {
                          newFilters.workType[key as keyof typeof newFilters.workType] = false;
                        }
                        handleFilterChange(newFilters);
                      }}
                    >
                      ✕
                    </button>
                  </div>
                ) : null
              )}

              {/* Results count */}
              {filteredJobs.length > 0 && (
                <div className="ml-auto text-sm text-gray-400">
                  Showing {filteredJobs.length} results
                </div>
              )}
            </div>

            {/* Grid/List View */}
            <div className={`grid ${isGridView ? 'grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4' : 'grid-cols-1'} gap-4`}>
              {displayedJobs.length > 0 ? (
                displayedJobs.map((job, index) => (
                  <motion.div
                    key={index}
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    transition={{ duration: 0.3 }}
                    className="hover:bg-gray-700 transition-colors"
                  >
                    {isGridView ? (
                      <EventCard
                        key={index}
                        title={job.title}
                        company={job.company}
                        location={job.location}
                        jobType={job.job_type}
                        workType={job.work_type}
                        description={job.description}
                        imageUrl={job.imageUrl}
                        onDetailsClick={() => handleJobDetails(job)}
                        onSponsorClick={() => handleSponsor(job)}
                        onApplyClick={() => handleApply(job.title)}
                      />
                    ) : (
                      <EventRow
                        key={index}
                        title={job.title}
                        company={job.company}
                        location={job.location}
                        jobType={job.job_type}
                        workType={job.work_type}
                        description={job.description}
                        imageUrl={job.imageUrl}
                        onDetailsClick={() => handleJobDetails(job)}
                        onSponsorClick={() => handleSponsor(job)}
                        onApplyClick={() => handleApply(job.title)}
                      />
                    )}
                  </motion.div>
                ))
              ) : (
                <div className="col-span-full text-center py-8">
                  <p className="text-white">
                    No jobs found matching your filters.
                  </p>
                  <button
                    className="btn btn-error rounded-lg mt-4"
                    onClick={() =>
                      handleFilterChange({
                        jobType: {
                          fullTime: false,
                          partTime: false,
                          contract: false,
                        },
                        workType: {
                          onSite: false,
                          remote: false,
                          hybrid: false,
                        },
                      })
                    }
                  >
                    Clear all filters
                  </button>
                </div>
              )}
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
                //   ONLY FOR ADMIN/CREATOR VIEWS WIP
                onEditClick={() => handleEdit(selectedJob)}
                onDeleteClick={() => console.log("Delete job")}
              />
            )}

            {/* Sponsorship Details Modal */}
              {selectedJob && (
                <SponsorshipsModal
                  onClose={handleCloseModal}
              />)}

            {/* Edit Job Details Modal */}
            {selectedJob && (
              <EditJobListComponent
                isOpen={false}
                onClose={function (): void {
                  throw new Error("Function not implemented.");
                }}
                onSave={function (jobData: any): void {
                  throw new Error("Function not implemented.");
                }}
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
    </div>
  );
}
