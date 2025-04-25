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
    <div className="min-h-screen">
      {/* Hero Section */}
      <div className="relative text-white -mt-16 pt-16">
        <div className="absolute inset-0 bg-gradient-to-r from-[#1a1f4d]/90 to-[#2a3f8f]/90"></div>
        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 z-10">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
            className="text-center"
          >
            <h1 className="text-4xl md:text-5xl font-bold mb-4">
              Events
            </h1>
            <p className="text-xl text-gray-200 max-w-2xl mx-auto">
              Discover and participate in alumni events, from networking opportunities to professional development.
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
          {/* Search bar - center */}
          <div className="flex-1 max-w-2xl mx-auto">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={18} />
              <input
                type="search"
                placeholder="Search events"
                className="w-full pl-10 pr-16 py-2 bg-white/5 border border-white/10 rounded-lg text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                value={search}
                onChange={(e) => setSearch(e.target.value)}
              />
              <div className="absolute right-3 top-1/2 transform -translate-y-1/2 flex items-center gap-1">
                <kbd className="px-2 py-1 text-xs rounded bg-white/5 text-gray-400">ctrl</kbd>
                <kbd className="px-2 py-1 text-xs rounded bg-white/5 text-gray-400">K</kbd>
              </div>
            </div>
          </div>

          {/* View toggle - right */}
          <button 
            onClick={toggleView} 
            className="px-4 py-2 bg-white/5 hover:bg-white/10 text-white rounded-lg transition-colors flex items-center gap-2 border border-white/10"
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
        <div className="flex gap-6">
          {/* Sidebar */}
          <motion.aside 
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.1 }}
            className={`w-64 flex-shrink-0 ${filterSidebarOpen ? 'block' : 'hidden'} lg:block`}
          >
            <div className="flex items-center gap-3 mb-4">
              <button
                className="px-4 py-2 bg-white/5 hover:bg-white/10 text-white rounded-lg transition-colors border border-white/10"
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
          </motion.aside>

          <main className="flex-1">
            {/* Active filters */}
            <motion.div 
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.2 }}
              className="flex flex-wrap items-center gap-2 mb-4"
            >
              {Object.entries(activeFilters.eventType).map(([key, value]) =>
                value ? (
                  <div
                    key={key}
                    className="px-3 py-2 bg-white/5 rounded-lg text-white border border-white/10 flex items-center gap-2"
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
            </motion.div>

            {/* Grid/List View */}
            <motion.div 
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.3 }}
              className={`grid ${isGridView ? 'grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4' : 'grid-cols-1'} gap-4`}
            >
              {displayedEvents.length > 0 ? (
                displayedEvents.map((event, index) => (
                  <motion.div
                    key={event._id}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.3, delay: index * 0.05 }}
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
                    className="px-4 py-2 bg-white/5 hover:bg-white/10 text-white rounded-lg transition-colors mt-4 border border-white/10"
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
            </motion.div>

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