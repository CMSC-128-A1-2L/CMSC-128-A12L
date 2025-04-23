"use client";

import { useState, useRef } from "react";
import FilterSidebar from "@/app/components/filtersEventListings";
import EventCard from "@/app/components/alumniEventCard";
import EventRow from "@/app/components/alumniEventRow";
import EventDetails from "@/app/components/eventDetails";
import SponsorshipsModal from "@/app/components/sponsorshipsModal";
import eventData from "@/dummy_data/event.json";
import { Event } from "@/entities/event";

import CreateEvent from "@/pages/createEvent";
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

// Convert JSON data to match Event interface
const convertEventData = (data: any): Event => ({
  _id: data._id,
  name: data.title,
  organizer: data.organizer,
  description: data.description,
  type: "social", // Default value since it's not in JSON
  startDate: new Date(data.date),
  endDate: new Date(data.date), // Using same date since end date is not in JSON
  location: data.location,
  imageUrl: data.imageUrl,
  sponsorship: {
    enabled: data.sponsorship?.enabled || false,
    sponsors: data.sponsorship?.requests?.map((r: any) => r.companyName) || []
  },
  rsvp: {
    enabled: data.rsvp?.enabled || false,
    options: data.rsvp?.options || []
  },
  wouldGo: [],
  wouldNotGo: [],
  wouldMaybeGo: []
});

export default function EventListings() {
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

  // Modal states
  const [selectedEvent, setSelectedEvent] = useState<Event | null>(null);
  const [showDetailsModal, setShowDetailsModal] = useState(false);
  const [showSponsorModal, setShowSponsorModal] = useState(false);
  const [showEditModal, setShowEditModal] = useState(false);

  // View toggle state
  const [isGridView, setIsGridView] = useState(true);
  const toggleView = () => {
    setIsGridView(!isGridView);
  };

  // Add filter state
  const [activeFilters, setActiveFilters] = useState({
    eventType: {
      social: false,
      academic: false,
      career: false,
      other: false
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
  const filteredEvents = eventData
    .map(convertEventData)
    .filter((event) => {
      // Search filter
      const searchMatch =
        event.name.toLowerCase().includes(search.toLowerCase()) ||
        event.organizer.toLowerCase().includes(search.toLowerCase()) ||
        event.description.toLowerCase().includes(search.toLowerCase());

      // Event Type filter
      const eventTypeFiltersActive =
        activeFilters.eventType.social ||
        activeFilters.eventType.academic ||
        activeFilters.eventType.career ||
        activeFilters.eventType.other;

      const eventTypeMatch =
        !eventTypeFiltersActive ||
        (activeFilters.eventType.social && event.type === "social") ||
        (activeFilters.eventType.academic && event.type === "academic") ||
        (activeFilters.eventType.career && event.type === "career") ||
        (activeFilters.eventType.other && event.type === "other");

      return searchMatch && eventTypeMatch;
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
  const handleEventDetails = (event: Event) => {
    setSelectedEvent(event);
    const modal = document.getElementById(
      "job_details_modal"
    ) as HTMLDialogElement;
    if (modal) {
      modal.showModal();
      setShowDetailsModal(true);
    }
  };

  const handleCloseDetailsModal = () => {
    setShowDetailsModal(false);
  };

  // Handle Respond to Event button click
  const handleRespond = (eventTitle: string) => {
    console.log(`Responding to ${eventTitle}`);
  };

  // Handle Sponsor Details button click
  const handleSponsor = (event: Event) => {
    setSelectedEvent(event);
    const modal = document.getElementById(
      "sponsor_details_modal"
    ) as HTMLDialogElement;
    if (modal) {
      modal.showModal();
      setShowSponsorModal(true);
    }
  };

  const handleCloseSponsorModal = () => {
    setShowSponsorModal(false);
  };

  // Handle Edit Event button click
  const handleEdit = (event: Event) => {
    setSelectedEvent(event);
    // Close the details modal first
    const detailsModal = document.getElementById(
      "job_details_modal"
    ) as HTMLDialogElement;
    if (detailsModal) {
      detailsModal.close();
      setShowDetailsModal(false);
    }
    // Then open the edit modal after a short delay to ensure smooth transition
    setTimeout(() => {
      const editModal = document.getElementById(
        "edit_event_modal"
      ) as HTMLDialogElement;
      if (editModal) {
        editModal.showModal();
        setShowEditModal(true);
      }
    }, 100);
  };

  const handleCloseEditModal = () => {
    setShowEditModal(false);
  };

  // Handle Delete Event
  const handleDelete = (eventId: string) => {
    console.log("Delete event", eventId);
    // TODO: Implement delete functionality
  };

  // Handle Add Event button click
  const handleAddEvent = () => {
    const modal = document.getElementById(
      "create_event_modal"
    ) as HTMLDialogElement;
    if (modal) {
      modal.showModal();
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
                placeholder="Search events"
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
            </div>
            {showEventModal && <CreateEvent onClose={() => setShowEventModal(false)} />}
            <FilterSidebar
              isOpen={filterSidebarOpen}
              setIsOpen={setFilterSidebarOpen}
              onFilterChange={handleFilterChange}
              showModal={handleAddEvent}
              activeFilters={activeFilters}
            />
          </aside>

          <main className="flex-1">
            {/* Active filters */}
            <div className="flex flex-wrap items-center gap-2 mb-4">
              {Object.entries(activeFilters.eventType).map(([key, value]) =>
                value ? (
                  <div
                    key={key}
                    className="badge badge-lg gap-2 px-3 py-3 bg-[#242937] text-white border-none"
                  >
                    {key === "social"
                      ? "Social"
                      : key === "academic"
                      ? "Academic"
                      : key === "career"
                      ? "Career"
                      : "Other"}
                    <button
                      className="opacity-60 hover:opacity-100 cursor-pointer"
                      onClick={() => {
                        const newFilters = { ...activeFilters };
                        newFilters.eventType[key as keyof typeof newFilters.eventType] = false;
                        handleFilterChange(newFilters);
                      }}
                    >
                      ✕
                    </button>
                  </div>
                ) : null
              )}

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
                    key={event._id}
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    transition={{ duration: 0.3 }}
                    className="transition-colors"
                  >
                    {isGridView ? (
                      <EventCard
                        title={event.name}
                        organizer={event.organizer}
                        location={event.location}
                        date={event.startDate.toISOString()}
                        description={event.description}
                        imageUrl={event.imageUrl || ''}
                        onDetailsClick={() => handleEventDetails(event)}
                        onSponsorClick={() => handleSponsor(event)}
                        onApplyClick={() => handleRespond(event.name)}
                      />
                    ) : (
                      <EventRow
                        title={event.name}
                        organizer={event.organizer}
                        location={event.location}
                        date={event.startDate.toISOString()}
                        description={event.description}
                        imageUrl={event.imageUrl || ''}
                        onDetailsClick={() => handleEventDetails(event)}
                        onSponsorClick={() => handleSponsor(event)}
                        onApplyClick={() => handleRespond(event.name)}
                      />
                    )}
                  </motion.div>
                ))
              ) : (
                <div className="col-span-full text-center py-8">
                  <p className="text-gray-400">
                    No events found matching your filters.
                  </p>
                  <button
                    className="btn btn-error btn-sm rounded-lg mt-4"
                    onClick={() =>
                      handleFilterChange({
                        eventType: {
                          social: false,
                          academic: false,
                          career: false,
                          other: false
                        }
                      })
                    }
                  >
                    Clear all filters
                  </button>
                </div>
              )}
            </div>

            {/* Event Details Modal */}
            {selectedEvent && (
              <EventDetails
                title={selectedEvent.name}
                organizer={selectedEvent.organizer}
                location={selectedEvent.location}
                date={selectedEvent.startDate.toISOString()}
                description={selectedEvent.description}
                isOpen={showDetailsModal}
                onClose={handleCloseDetailsModal}
                onRSVPClick={() => handleRespond(selectedEvent.name)}
                onEditClick={() => handleEdit(selectedEvent)}
                onDeleteClick={() => handleDelete(selectedEvent._id || '')}
              />
            )}

            {/* Sponsorship Details Modal */}
            {selectedEvent && (
              <SponsorshipsModal
                onClose={handleCloseSponsorModal}
              />
            )}

            {/* Edit Event Modal */}
            {selectedEvent && (
              <EditEventModal
                isOpen={showEditModal}
                onClose={handleCloseEditModal}
                onSave={(eventData) => {
                  console.log("Save event", eventData);
                  setShowEditModal(false);
                }}
                event={selectedEvent}
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

      {/* Create Event Modal */}
      <CreateEvent
        onClose={() => {
          const modal = document.getElementById(
            "create_event_modal"
          ) as HTMLDialogElement;
          if (modal) {
            modal.close();
          }
        }}
      />
    </div>
  );
}