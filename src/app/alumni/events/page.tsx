"use client";

import { useState, useRef } from "react";
import FilterSidebar from "@/app/components/filtersJobListings";
import JobCard from "@/app/components/jobContentCard";
import JobRow from "@/app/components/jobContentRow";
import JobDetails from "@/app/components/jobDetails";
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
    <div className="flex flex-col h-screen">
      {/* Margin to make up for the sticky navbar */}
      <div className="mx-8 mt-16 my-4 prose lg:prose-xl">
        {/* <h1 className="">Jobs</h1> */}
      </div>

      {/* Toolbar */}
      <div className="flex flex-wrap items-center align-center gap-2 m-4 my-6 py-1 px-2 bg-gray-200 rounded-2xl">
        <div className="flex items-center gap-2 w-64">
          {/* Filter sidebar toggle */}
          <button
            className="btn btn-sqr  btn-ghost rounded-xl"
            onClick={() => setFilterSidebarOpen(!filterSidebarOpen)}
          >
            <Filter size={18} />{" "}
          </button>

          {/* Add event button */}
          <button
            onClick={() => setShowEventModal(true)}
            className="btn btn-primary btn-soft  rounded-xl flex-grow rounded-xl"
          >
            <Plus size={18} /> Add Event{" "}
          </button>

          {/* Handle Add Event Modal */}
          {showEventModal && (
            <CreateEvent onClose={() => setShowEventModal(false)} />
          )}
        </div>

        {/* Search bar */}
        <div className="flex flex-1 justify-center">
          <label className="input w-full max-w-4xl sm:max-w-lg md:max-w-xl lg:max-w-2xl xl:max-w-3xl rounded-xl">
            <Search />
            <input
              type="search"
              placeholder="Search events"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
            />
            <kbd className="kbd kbd-sm">ctrl</kbd>
            <kbd className="kbd kbd-sm">K</kbd>
          </label>
        </div>

        {/* View */}
        <button onClick={toggleView} className="btn btn-ghost w-24 rounded-xl">
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

      {/* Main content area */}

      {/* Animation when loading in */}
      <motion.div
        initial={{ opacity: 0, y: 50 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
      >
        <div className="flex-grow flex w-screen">
          {/* Sidebar */}
          <aside className="flex flex-col gap-4 mx-4 mb-4">
            <FilterSidebar
              isOpen={filterSidebarOpen}
              setIsOpen={setFilterSidebarOpen}
              onFilterChange={handleFilterChange}
            />
          </aside>

          <main className="flex-1 pr-8">
            {/* Filter Tags / Active Filters */}
            <div className="flex flex-wrap gap-2 mb-4 p-2 rounded-lg border border-gray-200">
              {Object.entries(activeFilters.jobType).map(([key, value]) =>
                value ? (
                  <div
                    key={key}
                    className="badge badge-primary rounded-xl badge-outline p-3"
                  >
                    {key === "fullTime"
                      ? "Full-time"
                      : key === "partTime"
                      ? "Part-time"
                      : "Contract"}
                    <button
                      className="ml-2"
                      onClick={() => {
                        const newFilters = { ...activeFilters };
                        newFilters.jobType[
                          key as keyof typeof newFilters.jobType
                        ] = false;
                        handleFilterChange(newFilters);
                      }}
                    >
                      ✕
                    </button>
                  </div>
                ) : null
              )}
              {Object.entries(activeFilters.workType).map(([key, value]) =>
                value ? (
                  <div
                    key={key}
                    className="badge badge-secondary rounded-xl badge-outline p-3"
                  >
                    {key === "onSite"
                      ? "On-site"
                      : key === "remote"
                      ? "Remote"
                      : "Hybrid"}
                    <button
                      className="ml-2"
                      onClick={() => {
                        const newFilters = { ...activeFilters };
                        newFilters.workType[
                          key as keyof typeof newFilters.workType
                        ] = false;
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
                <div className="text-sm text-gray-500 flex items-center ml-auto">
                  Showing {filteredJobs.length} results
                </div>
              )}
            </div>

            {/* Jobs listing View */}
            {isGridView ? (
              // Grid view
              <div className="flex flex-wrap gap-3 justify-center px-12">
                {displayedJobs.length > 0 ? (
                  displayedJobs.map((job, index) => (
                    <motion.div
                      key={index}
                      initial={{ opacity: 0 }}
                      animate={{ opacity: 1 }}
                      transition={{ duration: 0.3 }}
                      className="hover:bg-gray-50 transition-colors"
                    >
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
                    </motion.div>
                  ))
                ) : (
                  <div className="w-full text-center py-8">
                    <p className="text-gray-500">
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
            ) : (
              // List view
              <div className="flex justify-center">
                <ul className="list rounded-lg border border-gray-200 w-full">
                  {displayedJobs.length > 0 ? (
                    displayedJobs.map((job, index) => (
                      <motion.div
                        key={index}
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        transition={{ duration: 0.3 }}
                        className="hover:bg-gray-50 transition-colors"
                      >
                        <JobRow
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
                      </motion.div>
                    ))
                  ) : (
                    <div className="w-full text-center py-8">
                      <p className="text-gray-500">
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
                </ul>
              </div>
            )}

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
      </motion.div>
    </div>
  );
}
