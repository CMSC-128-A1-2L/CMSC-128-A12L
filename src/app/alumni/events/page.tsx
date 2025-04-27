"use client";

import { useSession } from "next-auth/react";
import { toast } from "react-hot-toast";
import { useState, useRef, useEffect } from "react";
import FilterSidebar from "@/app/components/filtersEventListings";
import EventCard from "@/app/components/alumniEventCard";
import EventRow from "@/app/components/alumniEventRow";
import EventDetails from "@/app/components/eventDetails";
import SponsorshipsModal from "@/app/components/sponsorshipsModal";
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

export default function EventListings() {
  const { data: session } = useSession();
  // Add loading and error states
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [events, setEvents] = useState<Event[]>([]);

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

  // Add this after other state declarations
  const [timelineFilter, setTimelineFilter] = useState<'all' | 'ongoing' | 'finished'>('all');

  // Handle filter changes from FilterSidebar
  const handleFilterChange = (filters: any) => {
    // Create a new object reference to ensure React detects the change
    const newFilters = JSON.parse(JSON.stringify(filters));
    setActiveFilters(newFilters);
    setCurrentPage(1);
  };

  // Fetch events with timeline parameter
  useEffect(() => {
    const fetchEvents = async () => {
      setLoading(true);
      try {
        const response = await fetch(`/api/events?timeline=${timelineFilter}`);
        if (!response.ok) {
          throw new Error('Failed to fetch events');
        }
        const data = await response.json();
        setEvents(data);
      } catch (err) {
        console.error('Error fetching events:', err);
        setError('Failed to load events');
      } finally {
        setLoading(false);
      }
    };

    fetchEvents();
  }, [timelineFilter]); // Re-fetch when timeline filter changes

  // Update event response handlers
  const handleRespond = async (event: Event, response: 'go' | 'notGo' | 'maybeGo') => {
    try {
      const endpoint = `/api/events/${event._id}/${response === 'go' ? 'going' : response === 'notGo' ? 'not-going' : 'maybe-going'}`;
      const res = await fetch(endpoint, { method: 'POST' });
      
      if (!res.ok) throw new Error('Failed to update response');

      // Update local state
      const updatedEvents = events.map(e => {
        if (e._id === event._id) {
          // Remove from other arrays and add to the selected one
          const updatedEvent = {
            ...e,
            wouldGo: response === 'go' ? [...e.wouldGo, session?.user?.id] : e.wouldGo.filter(id => id !== session?.user?.id),
            wouldNotGo: response === 'notGo' ? [...e.wouldNotGo, session?.user?.id] : e.wouldNotGo.filter(id => id !== session?.user?.id),
            wouldMaybeGo: response === 'maybeGo' ? [...e.wouldMaybeGo, session?.user?.id] : e.wouldMaybeGo.filter(id => id !== session?.user?.id)
          };
          return updatedEvent;
        }
        return e;
      });

      setEvents(updatedEvents);
      toast.success('Response updated successfully');
    } catch (err) {
      console.error('Error updating response:', err);
      toast.error('Failed to update response');
    }
  };

  // Helper function to determine event status
  const getEventStatus = (event: Event) => {
    const now = new Date().getTime();
    const start = new Date(event.startDate).getTime();
    const end = new Date(event.endDate).getTime();

    if (now < start) return 'upcoming';
    if (now > end) return 'finished';
    return 'ongoing';
  };

  // Apply only search and type filters since timeline is handled by API
  const filteredEvents = events.filter((event) => {
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
        {/* Timeline Filter - Added Section */}
        <div className="flex justify-center gap-2 mb-8">
          <button
            onClick={() => setTimelineFilter('all')}
            className={`px-4 py-2 rounded-lg transition-colors border ${
              timelineFilter === 'all'
                ? 'bg-white/20 text-white border-white/20'
                : 'bg-white/5 text-gray-300 border-white/10 hover:bg-white/10'
            }`}
          >
            All Events
          </button>
          <button
            onClick={() => setTimelineFilter('ongoing')}
            className={`px-4 py-2 rounded-lg transition-colors border ${
              timelineFilter === 'ongoing'
                ? 'bg-white/20 text-white border-white/20'
                : 'bg-white/5 text-gray-300 border-white/10 hover:bg-white/10'
            }`}
          >
            Ongoing Events
          </button>
          <button
            onClick={() => setTimelineFilter('finished')}
            className={`px-4 py-2 rounded-lg transition-colors border ${
              timelineFilter === 'finished'
                ? 'bg-white/20 text-white border-white/20'
                : 'bg-white/5 text-gray-300 border-white/10 hover:bg-white/10'
            }`}
          >
            Past Events
          </button>
        </div>

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
                        date={event.startDate}
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
                        date={event.startDate}
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
                date={selectedEvent.startDate}
                description={selectedEvent.description}
                isOpen={showDetailsModal}
                onClose={handleCloseDetailsModal}
                onRSVPClick={() => handleRespond(selectedEvent, 'go')}
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