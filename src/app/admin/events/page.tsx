"use client";

import { useState, useRef } from "react";

import EventCard from "@/app/components/eventContentCard";
import EventRow from "@/app/components/eventContentRow";
import EventDetails from "@/app/components/eventDetails";
import EditJobListComponent from "@/app/components/editJobList";
import eventData from "@/dummy_data/event.json";
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

  // Search state
  const [search, setSearch] = useState("");

  // Event details/Edit event details modal state
  const [selectedEvent, setSelectedEvent] = useState<any>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const openModal = () => setIsModalOpen(true);
  const closeModal = () => setIsModalOpen(false);
  
  // View toggle state
  const [isGridView, setIsGridView] = useState(true);
  const toggleView = () => {
    setIsGridView(!isGridView);
  };

  // Apply search/filters
  const filteredEvents = eventData.filter((event) => {
    // Search filter
    const searchMatch =
      event.title.toLowerCase().includes(search.toLowerCase());

    // // Job Type filter
    // const jobTypeFiltersActive =
    //   activeFilters.jobType.fullTime ||
    //   activeFilters.jobType.partTime ||
    //   activeFilters.jobType.contract;

    // const jobTypeMatch =
    //   !jobTypeFiltersActive ||
    //   (activeFilters.jobType.fullTime && job.job_type === "Full-time") ||
    //   (activeFilters.jobType.partTime && job.job_type === "Part-time") ||
    //   (activeFilters.jobType.contract && job.job_type === "Contract");

    // Work Type filter
    // const workTypeFiltersActive =
    //   activeFilters.workType.onSite ||
    //   activeFilters.workType.remote ||
    //   activeFilters.workType.hybrid;

    // const workTypeMatch =
    //   !workTypeFiltersActive ||
    //   (activeFilters.workType.onSite && job.work_type === "On-site") ||
    //   (activeFilters.workType.remote && job.work_type === "Remote") ||
    //   (activeFilters.workType.hybrid && job.work_type === "Hybrid");

    return searchMatch;
    // && jobTypeMatch && workTypeMatch;
  });

  // Handle Pagination
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 12;

  const totalPages = Math.ceil(filteredEvents.length / itemsPerPage);
  const displayedEvents = filteredEvents.slice(
    (currentPage - 1) * itemsPerPage,
    currentPage * itemsPerPage
  );

  // Handle event details modal
  const handleEventDetails = (event: any) => {
    setSelectedEvent(event);
    setIsModalOpen(true);
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
    setSelectedEvent(job);
    // Use the DaisyUI modal show method
    const modal = document.getElementById(
      "edit_job_modal"
    ) as HTMLDialogElement;
    if (modal) {
      modal.showModal();
      setIsModalOpen(true);
    }
  };

  function handleFilterChange(arg0: { jobType: { fullTime: boolean; partTime: boolean; contract: boolean; }; workType: { onSite: boolean; remote: boolean; hybrid: boolean; }; }): void {
    throw new Error("Function not implemented.");
  }

  return (
    <div className="flex flex-col min-h-screen bg-[#151821]">
      {/* Main container */}
      <div className="flex-1 container mx-auto px-6">
        {/* Toolbar */}
        <div className="flex items-center gap-4 py-4">
          {/* Left section */}
          <div className="flex items-center gap-3">
          
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
  

          <main className="flex-1">
            {/* Active filters */}
            <div className="flex flex-wrap items-center gap-2 mb-4">
            

              {/* Results count */}
              {filteredEvents.length > 0 && (
                <div className="ml-auto text-sm text-gray-400">
                  Showing {filteredEvents.length} results
                </div>
              )}
            </div>

            {/* Grid/List View */}
            <div className={`grid ${isGridView ? 'grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4' : 'grid-cols-1'} gap-4`}>
              {displayedEvents.length > 0 ? (
                displayedEvents.map((event, index) => (
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
                        title={event.title}
                        organizer={event.organizer}
                        location={event.location}
                        date={event.date}
                        onDetailsClick={() =>
                           handleEventDetails(event)} _id={""} index={0} imageUrl={""} rsvp={{
                          enabled: false,
                          options: []
                        }}  onClose={function (): void {
                          throw new Error("Function not implemented.");
                        } } onEditClick={function (): void {
                          throw new Error("Function not implemented.");
                        } } onDeleteClick={function (): void {
                          throw new Error("Function not implemented.");
                        } }                      />
                    ) : (
                      <EventRow
                        key={index}
                        title={event.title}
                        organizer={event.organizer}
                        location={event.location}
                        date={event.date}
                        onDetailsClick={() => handleEventDetails(event)}
                      />
                    )}
                  </motion.div>
                ))
              ) : (
                <div className="col-span-full text-center py-8">
                  <p className="text-white">
                    No events found matching your filters.
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
            {isModalOpen && selectedEvent && (
            <EventDetails
              _id={selectedEvent._id}
              index={selectedEvent.index}
              title={selectedEvent.title}
              organizer={selectedEvent.organizer}
              location={selectedEvent.location}
              date={selectedEvent.date}
          
           
              description={selectedEvent.description}
              contactInfo={selectedEvent.contactInfo}
              onEditClick={() => handleEdit(selectedEvent)}
              onDeleteClick={() => console.log("Delete event")}
              onClose={handleCloseModal}
              isOpen={true}
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
