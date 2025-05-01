"use client";

import { useState, useEffect } from 'react';
import { Search, Filter, ChevronLeft, ChevronRight, Plus, X } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import JobCard from './jobContentCard';
import JobDetails from './jobDetails';
import MobileFilterDrawer from './MobileFilterDrawer';

import { useSession } from "next-auth/react";

interface MobileJobViewProps {
  jobs: any[];
  loading: boolean;
  onJobClick: (job: any) => void;
  onFilter: (filters: any) => void;
  onSearch: (query: string) => void;
  onCreateJob: () => void;
  onApply: (jobTitle: string) => void;
  onEdit: (job: any) => void;
  onDelete: (job: any) => void;
  activeFilters: any;
  jobView: 'all' | 'user';
  onJobViewChange: (view: 'all' | 'user') => void;
}

export default function MobileJobView({
  jobs,
  loading,
  onJobClick,
  onFilter,
  onSearch,
  onCreateJob,
  onApply,
  onEdit,
  onDelete,
  activeFilters,
  jobView,
  onJobViewChange
}: MobileJobViewProps) {
  const { data: session } = useSession();
  const [filterDrawerOpen, setFilterDrawerOpen] = useState(false);
  const [currentPage, setCurrentPage] = useState(1);
  const [selectedJob, setSelectedJob] = useState<any>(null);
  const [showDetailsModal, setShowDetailsModal] = useState(false);
  const itemsPerPage = 6;

  useEffect(() => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  }, [currentPage]);

  const handleJobClick = (job: any) => {
    setSelectedJob(job);
    setShowDetailsModal(true);
  };

  const handleCloseModal = () => {
    setShowDetailsModal(false);
    setSelectedJob(null);
  };

  const totalPages = Math.ceil(jobs.length / itemsPerPage);
  const displayedJobs = jobs.slice((currentPage - 1) * itemsPerPage, currentPage * itemsPerPage);

  // Filter jobs based on view
  const filteredDisplayedJobs = displayedJobs.filter(job => {
    if (jobView === 'user') {
      return job.userId === session?.user?.id;
    }
    return true;
  });

  return (
    <div className="min-h-screen pb-20">
      {/* Fixed Header */}
      <div className="fixed top-[64px] left-0 right-0 bg-[#1a1f4d]/95 backdrop-blur-sm z-20">
        {/* Search and Filter Bar */}
        <div className="p-4">
          <div className="flex items-center gap-3">
            <button
              onClick={() => setFilterDrawerOpen(true)}
              className="p-2 bg-white/5 hover:bg-white/10 text-white rounded-lg border border-white/10"
            >
              <Filter size={20} />
            </button>
            <div className="relative flex-1">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" size={18} />
              <input
                type="search"
                placeholder="Search jobs..."
                className="w-full pl-10 pr-4 py-2 bg-white/5 border border-white/10 rounded-lg text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500"
                onChange={(e) => onSearch(e.target.value)}
              />
            </div>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="pt-[136px] px-4">
        {/* View Toggle */}
        <div className="mb-6">
          <div className="flex rounded-lg bg-white/5 p-1">
            <button
              onClick={() => onJobViewChange('all')}
              className={`flex-1 py-2 text-sm rounded-md transition-colors ${
                jobView === 'all' 
                  ? 'bg-white/10 text-white font-medium' 
                  : 'text-white/70 hover:text-white hover:bg-white/5'
              }`}
            >
              All Jobs
            </button>
            <button
              onClick={() => onJobViewChange('user')}
              className={`flex-1 py-2 text-sm rounded-md transition-colors ${
                jobView === 'user'
                  ? 'bg-white/10 text-white font-medium'
                  : 'text-white/70 hover:text-white hover:bg-white/5'
              }`}
            >
              My Jobs
            </button>
          </div>
        </div>

        {/* Active Filters */}
        {Object.entries(activeFilters.workMode).some(([_, value]) => value) && (
          <div className="flex flex-wrap gap-2 mb-4">
            {Object.entries(activeFilters.workMode).map(([key, value]) =>
              value ? (
                <div
                  key={key}
                  className="px-3 py-2 bg-white/5 rounded-lg text-white border border-white/10 flex items-center gap-2"
                >
                  {key === "onSite" ? "On-site" : key === "remote" ? "Remote" : "Hybrid"}
                  <button
                    className="opacity-60 hover:opacity-100"
                    onClick={() => {
                      const newFilters = { ...activeFilters };
                      newFilters.workMode[key as keyof typeof newFilters.workMode] = false;
                      onFilter(newFilters);
                    }}
                  >
                    <X size={16} />
                  </button>
                </div>
              ) : null
            )}
          </div>
        )}

        {/* Jobs List */}
        {loading ? (
          <div className="flex justify-center py-8">
            <div className="text-white/80">Loading jobs...</div>
          </div>
        ) : (
          <>
            <div className="space-y-4">
              {filteredDisplayedJobs.map((job, index) => (
                <motion.div
                  key={job._id || index}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: index * 0.1 }}
                >
                  <JobCard
                    tags={job.tags}
                    workMode={job.workMode.charAt(0).toUpperCase() + job.workMode.slice(1)}
                    position={job.position}
                    title={job.title}
                    company={job.company}
                    location={job.location}
                    description={job.description}
                    imageUrl={job.imageUrl}
                    onDetailsClick={() => handleJobClick(job)}
                    onApplyClick={() => onApply(job.title)}
                  />
                </motion.div>
              ))}

              {filteredDisplayedJobs.length === 0 && (
                <div className="text-center py-8">
                  <p className="text-gray-400">
                    {jobView === 'user' ? 'You haven\'t posted any jobs yet' : 'No jobs found'}
                  </p>
                </div>
              )}
            </div>

            {/* Pagination */}
            {totalPages > 1 && (
              <div className="flex justify-center items-center gap-4 mt-8">
                <button
                  onClick={() => setCurrentPage(Math.max(1, currentPage - 1))}
                  disabled={currentPage === 1}
                  className="p-2 bg-white/5 hover:bg-white/10 text-white rounded-lg disabled:opacity-50"
                >
                  <ChevronLeft size={20} />
                </button>
                <span className="text-white/80">
                  {currentPage} / {totalPages}
                </span>
                <button
                  onClick={() => setCurrentPage(Math.min(totalPages, currentPage + 1))}
                  disabled={currentPage === totalPages}
                  className="p-2 bg-white/5 hover:bg-white/10 text-white rounded-lg disabled:opacity-50"
                >
                  <ChevronRight size={20} />
                </button>
              </div>
            )}
          </>
        )}

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
            onClose={handleCloseModal}
            onApplyClick={() => onApply(selectedJob.title)}
            onEditClick={() => onEdit(selectedJob)}
            onDeleteClick={() => onDelete(selectedJob)}
            canEdit={selectedJob.userId === session?.user?.id}
          />
        )}
      </div>

      {/* Filter Drawer */}
      <MobileFilterDrawer 
        isOpen={filterDrawerOpen}
        onClose={() => setFilterDrawerOpen(false)}
        onFilter={onFilter}
        onCreateJob={onCreateJob}
        activeFilters={activeFilters}
      />

      {/* Create Job FAB */}
      <button
        onClick={onCreateJob}
        className="fixed right-4 bottom-4 p-4 bg-blue-600 hover:bg-blue-700 text-white rounded-full shadow-lg transition-colors"
      >
        <Plus size={24} />
      </button>
    </div>
  );
}
