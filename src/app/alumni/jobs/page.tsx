"use client";

import { useState, useRef, useEffect } from "react";
import FilterSidebar from "@/app/components/filtersJobListings";
import JobCard from "@/app/components/jobContentCard";
import JobRow from "@/app/components/jobContentRow";
import JobDetails from "@/app/components/jobDetails";
import EditJobListComponent from "@/app/components/editJobList";
import CreateJL from "@/app/components/createJL";
import { useSession } from "next-auth/react";
import { toast } from "react-hot-toast";
import ConstellationBackground from "@/app/components/constellationBackground";
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
  const { data: session } = useSession();
  // Add state for jobs
  const [jobs, setJobs] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [jobView, setJobView] = useState<'all' | 'user'>('all');

  // Add fetch function
  const fetchJobs = async (filter: 'all' | 'user' = 'all') => {
    try {
      setLoading(true);
      const response = await fetch(`/api/alumni/opportunities?filter=${filter}`);
      if (!response.ok) throw new Error('Failed to fetch jobs');
      const data = await response.json();
      console.log(data)
      setJobs(data);
    } catch (error) {
      console.error('Error fetching jobs:', error);
      toast.error('Failed to load jobs');
    } finally {
      setLoading(false);
    }
  };

  // Fetch jobs on mount and when view changes
  useEffect(() => {
    fetchJobs(jobView);
  }, [jobView]);

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
  const [showDetailsModal, setShowDetailsModal] = useState(false);
  const [showEditModal, setShowEditModal] = useState(false);

  // View toggle state
  const [isGridView, setIsGridView] = useState(true);
  const toggleView = () => {
    setIsGridView(!isGridView);
  };

  // Update filter state to remove jobType and rename workType to workMode
  const [activeFilters, setActiveFilters] = useState({
    workMode: {
      onSite: false,
      remote: false,
      hybrid: false,
    },
    sort: 'newest' // Add sort property with default value
  });

  // Handle filter changes from FilterSidebar
  const handleFilterChange = (filters: any) => {
    const newFilters = JSON.parse(JSON.stringify(filters));
    setActiveFilters(newFilters);
    setCurrentPage(1);
  };

  // Update filtered jobs logic to remove experienceLevel checks
  const filteredJobs = jobs.filter((job) => {
    const searchMatch =
      job.title.toLowerCase().includes(search.toLowerCase()) ||
      job.company.toLowerCase().includes(search.toLowerCase()) ||
      job.description.toLowerCase().includes(search.toLowerCase());

    const workModeFiltersActive =
      activeFilters.workMode.onSite ||
      activeFilters.workMode.remote ||
      activeFilters.workMode.hybrid;

    const workModeMatch =
      !workModeFiltersActive ||
      (activeFilters.workMode.onSite && job.workMode.toLowerCase() === "on-site") ||
      (activeFilters.workMode.remote && job.workMode.toLowerCase() === "remote") ||
      (activeFilters.workMode.hybrid && job.workMode.toLowerCase() === "hybrid");

    return searchMatch && workModeMatch;
  }).sort((a, b) => {
    // Add sorting logic
    switch (activeFilters.sort) {
      case 'newest':
        return new Date(b.createdAt || 0).getTime() - new Date(a.createdAt || 0).getTime();
      case 'oldest':
        return new Date(a.createdAt || 0).getTime() - new Date(b.createdAt || 0).getTime();
      case 'a-z':
        return a.title.localeCompare(b.title);
      case 'z-a':
        return b.title.localeCompare(a.title);
      default:
        return 0;
    }
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
    setShowDetailsModal(true);
  };

  const handleCloseDetailsModal = () => {
    setShowDetailsModal(false);
    setTimeout(() => setSelectedJob(null), 100); // Clear selected job after modal closes
  };

  // Handle Apply to Job button click
  const handleApply = (jobTitle: string) => {
    console.log(`Applying for ${jobTitle}`);
  };

  // Add delete handler
  const handleDelete = async (job: any) => {
    if (job.userId !== session?.user?.id) {
      toast.error("You can only delete your own job postings");
      return;
    }

    if (!confirm("Are you sure you want to delete this job posting?")) {
      return;
    }

    try {
      const response = await fetch(`/api/alumni/opportunities/${job._id}`, {
        method: 'DELETE',
      });

      if (!response.ok) {
        throw new Error('Failed to delete job');
      }

      toast.success('Job deleted successfully');
      setShowDetailsModal(false);
      fetchJobs(jobView); // Refresh jobs list
    } catch (error) {
      console.error('Error deleting job:', error);
      toast.error('Failed to delete job');
    }
  };

  // Update edit handler
  const handleEditClick = (job: any) => {
    // Check both userId and _id formats since they may come in different formats
    const currentUserId = session?.user?.id;
    const jobUserId = job.userId || job._id;

    if (jobUserId !== currentUserId) {
      toast.error("You can only edit your own job postings");
      return;
    }

    // Normalize the job data before setting it
    const normalizedJob = {
      ...job,
      job_type: job.job_type || job.jobType || 'full-time',
      work_type: job.work_type || job.workType || 'on-site',
    };

    setSelectedJob(normalizedJob);
    setShowDetailsModal(false); // Close details modal
    setShowEditModal(true); // Open edit modal
  };

  const handleCloseEditModal = () => {
    setShowEditModal(false);
    setSelectedJob(null);
  };

  // Update edit submit handler
  const handleEdit = async (jobData: any) => {
    try {
      const response = await fetch(`/api/alumni/opportunities/${selectedJob._id}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          ...jobData,
          tags: jobData.tags || selectedJob.tags || [],
        }),
      });

      if (!response.ok) {
        throw new Error('Failed to update job');
      }

      toast.success('Job updated successfully');
      setShowEditModal(false);
      setSelectedJob(null);
      fetchJobs(jobView);
    } catch (error) {
      console.error('Error updating job:', error);
      toast.error('Failed to update job');
    }
  };

  return (
    <div className="min-h-screen">
      {/* Hero Section */}
      <div className="relative text-white -mt-16 pt-16 overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-r from-[#1a1f4d]/90 to-[#2a3f8f]/90"></div>
        <ConstellationBackground />
        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 z-10">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
            className="text-center"
          >
            <h1 className="text-4xl md:text-5xl font-bold mb-4">
              Job Board
            </h1>
            <p className="text-xl text-gray-200">
              Discover career opportunities and connect with employers
            </p>
          </motion.div>
        </div>
      </div>

      {/* Main Content */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Search and View Toggle */}
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.2 }}
          className="flex items-center gap-4 py-4 mb-8"
        >
          {/* Jobs filter toggle - left */}
          <div className="flex items-center gap-2 bg-white/5 rounded-lg p-1 border border-white/10">
            <button
              onClick={() => setJobView('all')}
              className={`px-3 py-1.5 rounded-md text-sm transition-colors ${
                jobView === 'all'
                  ? 'bg-white/10 text-white'
                  : 'text-white/70 hover:text-white hover:bg-white/5'
              }`}
            >
              All Jobs
            </button>
            <button
              onClick={() => setJobView('user')}
              className={`px-3 py-1.5 rounded-md text-sm transition-colors ${
                jobView === 'user'
                  ? 'bg-white/10 text-white'
                  : 'text-white/70 hover:text-white hover:bg-white/5'
              }`}
            >
              My Jobs
            </button>
          </div>

          {/* Search bar - center */}
          <div className="flex-1 max-w-2xl mx-auto">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={18} />
              <input
                type="search"
                placeholder="Search jobs"
                className="w-full pl-10 pr-16 py-2 bg-white/5 border border-white/10 rounded-lg text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent text-sm sm:text-base"
                value={search}
                onChange={(e) => setSearch(e.target.value)}
              />
              <div className="absolute right-3 top-1/2 transform -translate-y-1/2 flex items-center gap-1">
                <kbd className="hidden sm:inline-block px-2 py-1 text-xs rounded bg-white/5 text-gray-400">ctrl</kbd>
                <kbd className="hidden sm:inline-block px-2 py-1 text-xs rounded bg-white/5 text-gray-400">K</kbd>
              </div>
            </div>
          </div>

          {/* View toggle - right */}
          <button 
            onClick={toggleView} 
            className="px-2 py-2 sm:px-4 sm:py-2 bg-white/5 hover:bg-white/10 text-white rounded-lg transition-colors flex items-center gap-2 border border-white/10"
          >
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
        </motion.div>

        {/* Content area */}
        <div className="flex flex-col sm:flex-row gap-8">
          {/* Sidebar */}
          <motion.aside 
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.1 }}
            className="w-64 flex-shrink-0"
          >
            <div className="flex items-center gap-3 mb-4">
              <button
                className="px-4 py-2 bg-white/5 hover:bg-white/10 text-white rounded-lg transition-colors border border-white/10"
                onClick={() => setFilterSidebarOpen(!filterSidebarOpen)}
              >
                <Filter size={18} />
              </button>
            </div>
            <div className={`${filterSidebarOpen ? 'block' : 'hidden'} lg:block`}>
              <FilterSidebar
                isOpen={filterSidebarOpen}
                setIsOpen={setFilterSidebarOpen}
                onFilterChange={handleFilterChange}
                showModal={() => setShowModal(true)}
                activeFilters={activeFilters}
              />
            </div>
          </motion.aside>

          {/* Main content */}
          <main className="flex-1">
            {loading ? (
              <div className="flex items-center justify-center py-12">
                <div className="text-white/80">Loading jobs...</div>
              </div>
            ) : (
              <>
                {/* Active filters */}
                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.2 }}
                  className="flex flex-wrap items-center gap-2 mb-4"
                >
                  {Object.entries(activeFilters.workMode).map(([key, value]) =>
                    value ? (
                      <div
                        key={key}
                        className="px-3 py-2 bg-white/5 rounded-lg text-white border border-white/10 flex items-center gap-2"
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
                            newFilters.workMode[key as keyof typeof newFilters.workMode] = false;
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
                </motion.div>

            {/* Grid/List View */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.3 }}
              className={`grid ${
                isGridView
                  ? 'grid-cols-1 min-[400px]:grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4'
                  : 'grid-cols-1'
              } gap-4 xs:gap-4 md:gap-4`}
            >
              {displayedJobs.length > 0 ? (
                displayedJobs.map((job, index) => (
                  <motion.div
                    key={index}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.3, delay: index * 0.05 }}
                    className="transition-colors"
                  >
                    {isGridView ? (
                      <JobCard
                      tags={job.tags}
                      workMode={job.workMode.charAt(0).toUpperCase() + job.workMode.slice(1)}
                      position={job.position}
                      title={job.title}
                      company={job.company}
                      location={job.location}
                      description={job.description}
                      imageUrl={job.imageUrl}
                      onDetailsClick={() => handleJobDetails(job)}
                      onApplyClick={() => handleApply(job.title)}
                      />
                    ) : (
                      <JobRow
                        tags={job.tags}
                          workMode={job.workMode.charAt(0).toUpperCase() + job.workMode.slice(1)}
                          position={job.position}
                          title={job.title}
                          company={job.company}
                          location={job.location}
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
                    className="px-4 py-2 bg-white/5 hover:bg-white/10 text-white rounded-lg transition-colors mt-4 border border-white/10"
                    onClick={() =>
                      handleFilterChange({
                        workMode: {
                          onSite: false,
                          remote: false,
                          hybrid: false,
                        }
                      })
                    }
                  >
                    Clear all filters
                  </button>
                </div>
              )}
            </motion.div>

                {/* Job Details Modal */}
                {selectedJob && (
                  <JobDetails
                    position={selectedJob.position}
                    title={selectedJob.title}
                    company={selectedJob.company}
                    location={selectedJob.location}
                    workMode={selectedJob.workMode}
                    description={selectedJob.description}
                    tags={selectedJob.tags}
                    isOpen={showDetailsModal}
                    onClose={handleCloseDetailsModal}
                    onApplyClick={() => handleApply(selectedJob.title)}
                    onEditClick={() => handleEditClick(selectedJob)}
                    onDeleteClick={() => handleDelete(selectedJob)}
                    canEdit={selectedJob.userId === session?.user?.id}
                  />
                )}

                {/* Edit Job Modal */}
                {selectedJob && (
                  <EditJobListComponent
                    isOpen={showEditModal}
                    onClose={handleCloseEditModal}
                    onSave={handleEdit}
                    initialJobData={{
                      title: selectedJob.title,
                      company: selectedJob.company,
                      location: selectedJob.location,
                      workMode: selectedJob.workMode,
                      description: selectedJob.description,
                      tags: selectedJob.tags || [],
                    }}
                  />
                )}

                {/* Pagination */}
                {totalPages > 1 && (
                  <motion.div 
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.4 }}
                    className="flex justify-center items-center space-x-4 my-8"
                  >
                    <button
                      onClick={() => setCurrentPage(currentPage - 1)}
                      disabled={currentPage === 1}
                      className="px-4 py-2 bg-white/5 hover:bg-white/10 text-white rounded-lg transition-colors disabled:opacity-50 disabled:cursor-not-allowed border border-white/10"
                    >
                      <ChevronLeft />
                    </button>
                    <span className="text-gray-400">
                      {currentPage} / {totalPages}
                    </span>
                    <button
                      onClick={() => setCurrentPage(currentPage + 1)}
                      disabled={currentPage === totalPages}
                      className="px-4 py-2 bg-white/5 hover:bg-white/10 text-white rounded-lg transition-colors disabled:opacity-50 disabled:cursor-not-allowed border border-white/10"
                    >
                      <ChevronRight />
                    </button>
                  </motion.div>
                )}
              </>
            )}
          </main>
        </div>
      </div>

      {/* Create Job Modal */}
      {showModal && (
        <CreateJL
          onClose={() => setShowModal(false)}
          onSuccess={() => {
            toast.success('Job posted successfully');
            
            setShowModal(false);
            fetchJobs(jobView); // Refresh jobs list
          }}
        />
      )}
    </div>
  );
}
