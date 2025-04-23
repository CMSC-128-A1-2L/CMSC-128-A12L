"use client";

import { useState, useRef } from "react";
import FilterSidebar from "@/app/components/filtersJobListings";
import JobCard from "@/app/components/jobContentCard";
import JobRow from "@/app/components/jobContentRow";
import JobDetails from "@/app/components/jobDetails";
import EditJobListComponent from "@/app/components/editJobList";
import jobData from "@/dummy_data/job.json";
import CreateJL from "@/app/components/createJL";
// Refactor add job list to use modal than page

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
  // Sidebar state
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const menuButtonRef = useRef<HTMLButtonElement>(null);
  const sidebarRef = useRef<HTMLDivElement>(null);

  // Filter sidebar state
  const [filterSidebarOpen, setFilterSidebarOpen] = useState(true);

  // Add job modal state
  const [showModal, setShowModal] = useState(false);

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
    experienceLevel: {
      entry: false,
      midLevel: false,
      senior: false,
    }
  });

  // Handle filter changes from FilterSidebar
  const handleFilterChange = (filters: any) => {
    // Create a new object reference to ensure React detects the change
    const newFilters = JSON.parse(JSON.stringify(filters));
    setActiveFilters(newFilters);
    setCurrentPage(1);
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
      (activeFilters.jobType.fullTime && job.job_type === "full-time") ||
      (activeFilters.jobType.partTime && job.job_type === "part-time") ||
      (activeFilters.jobType.contract && job.job_type === "contract");

    // Work Type filter
    const workTypeFiltersActive =
      activeFilters.workType.onSite ||
      activeFilters.workType.remote ||
      activeFilters.workType.hybrid;

    const workTypeMatch =
      !workTypeFiltersActive ||
      (activeFilters.workType.onSite && job.work_type === "on-site") ||
      (activeFilters.workType.remote && job.work_type === "remote") ||
      (activeFilters.workType.hybrid && job.work_type === "hybrid");

    // Experience Level filter
    const experienceLevelFiltersActive =
      activeFilters.experienceLevel.entry ||
      activeFilters.experienceLevel.midLevel ||
      activeFilters.experienceLevel.senior;

    // Since we don't have experience_level in the data yet, we'll return true
    // This can be updated once the experience_level field is added to the data
    const experienceLevelMatch = !experienceLevelFiltersActive;

    return searchMatch && jobTypeMatch && workTypeMatch && experienceLevelMatch;
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
    <div className="flex flex-col min-h-screen bg-gray-100">
      {/* Main container */}
      <div className="flex-1 container mx-auto px-6">
        {/* Search bar and View toggle */}
        <div className="flex items-center gap-4 py-4">
          {/* Search bar - center */}
          <div className="flex-1 max-w-2xl mx-auto">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={18} />
              <input
                type="search"
                placeholder="Search jobs"
                className="input input-bordered w-full pl-10 pr-16 bg-white border-gray-300 text-gray-800"
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
          <button onClick={toggleView} className="btn btn-sm rounded-lg bg-[#605dff] text-white hover:bg-[#4f4ccc]">
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
          <aside className={`w-64 flex-shrink-0 ${filterSidebarOpen ? 'block' : 'hidden'} lg:block -mt-[13px]`}>
            <div className="flex items-center gap-3 mb-4">
              <button
                className="btn btn-sm rounded-lg bg-[#605dff] text-white hover:bg-[#4f4ccc]"
                onClick={() => setFilterSidebarOpen(!filterSidebarOpen)}
              >
                <Filter size={18} />
              </button>
              <button
                onClick={() => setShowModal(true)}
                className="btn btn-primary btn-sm rounded-lg"
              >
                <Plus size={18} /> Add Job
              </button>

            </div>
            {showModal && <CreateJL onClose={() => setShowModal(false)} />}
            <FilterSidebar
              isOpen={filterSidebarOpen}
              setIsOpen={setFilterSidebarOpen}
              onFilterChange={handleFilterChange}
              showModal={() => setShowModal(true)}
              activeFilters={activeFilters}
            />
          </aside>

          {/* Main content */}
          <main className="flex-1">
            {/* Active filters */}
            <div className="flex flex-wrap items-center gap-2 mb-4">
              {Object.entries(activeFilters.jobType).map(([key, value]) =>
                value ? (
                  <div
                    key={key}
                    className="badge badge-lg gap-2 px-3 py-3 bg-[#242937] text-white border-none"
                  >
                    {key === "fullTime"
                      ? "Full-time"
                      : key === "partTime"
                      ? "Part-time"
                      : "Contract"}
                    <button
                      className="opacity-60 hover:opacity-100 cursor-pointer"
                      onClick={() => {
                        const newFilters = { ...activeFilters };
                        newFilters.jobType[key as keyof typeof newFilters.jobType] = false;
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
                    className="badge badge-lg gap-2 px-3 py-3 bg-[#242937] text-white border-none"
                  >
                    {key === "onSite"
                      ? "On-site"
                      : key === "remote"
                      ? "Remote"
                      : "Hybrid"}
                    <button
                      className="opacity-60 hover:opacity-100 cursor-pointer"
                      onClick={() => {
                        const newFilters = { ...activeFilters };
                        newFilters.workType[key as keyof typeof newFilters.workType] = false;
                        handleFilterChange(newFilters);
                      }}
                    >
                      ✕
                    </button>
                  </div>
                ) : null
              )}

              {Object.entries(activeFilters.experienceLevel).map(([key, value]) =>
                value ? (
                  <div
                    key={key}
                    className="badge badge-lg gap-2 px-3 py-3 bg-[#242937] text-white border-none"
                  >
                    {key === "entry"
                      ? "Entry Level"
                      : key === "midLevel"
                      ? "Mid-Level"
                      : "Senior"}
                    <button
                      className="opacity-60 hover:opacity-100 cursor-pointer"
                      onClick={() => {
                        const newFilters = { ...activeFilters };
                        newFilters.experienceLevel[key as keyof typeof newFilters.experienceLevel] = false;
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
            <div className={`grid ${isGridView ? 'grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4' : 'grid-cols-1 gap-2'}`}>
              {displayedJobs.length > 0 ? (
                displayedJobs.map((job, index) => (
                  <motion.div
                    key={index}
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    transition={{ duration: 0.3, delay: index * 0.1 }}
                  >
                    {isGridView ? (
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
                    ) : (
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
                    )}
                  </motion.div>
                ))
              ) : (
                <div className="col-span-full text-center py-8">
                  <p className="text-gray-400">
                    No jobs found matching your filters.
                  </p>
                  <button
                    className="btn btn-error btn-sm rounded-lg mt-4"
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
                        experienceLevel: {
                          entry: false,
                          midLevel: false,
                          senior: false,
                        }
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
                jobType={selectedJob.job_type}
                workType={selectedJob.work_type}
                salary={selectedJob.salary}
                description={selectedJob.description}
                isOpen={isModalOpen}
                onClose={handleCloseModal}
                onApplyClick={() => handleApply(selectedJob.title)}
                onEditClick={() => handleEdit(selectedJob)}
                onDeleteClick={() => {}}
              />
            )}

            {/* Edit Job Modal */}
            {selectedJob && (
              <EditJobListComponent
                isOpen={isModalOpen}
                onClose={handleCloseModal}
                onSave={(jobData) => {
                  console.log("Save job", jobData);
                  setIsModalOpen(false);
                }}
                initialJobData={{
                  title: selectedJob.title,
                  company: selectedJob.company,
                  location: selectedJob.location,
                  jobType: selectedJob.job_type,
                  workType: selectedJob.work_type,
                  salary: selectedJob.salary,
                  description: selectedJob.description
                }}
              />
            )}
          </main>
        </div>
      </div>

      {/* Create Job Modal */}
      {showModal && (
        <CreateJL
          onClose={() => setShowModal(false)}
        />
      )}
    </div>
  );
}
