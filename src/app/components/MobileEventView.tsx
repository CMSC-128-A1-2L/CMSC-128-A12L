"use client";

import { useState, useEffect } from 'react';
import { Search, Filter, ChevronLeft, ChevronRight, Plus, X } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import EventCard from './alumniEventCard';
import EventDetails from './eventDetails';
import MobileEventFilterDrawer from './MobileEventFilterDrawer';
import { Event } from '@/entities/event';
import { useSession } from "next-auth/react";

interface MobileEventViewProps {
  events: Event[];
  loading: boolean;
  onEventClick: (event: Event) => void;
  onFilter: (filters: any) => void;
  onSearch: (query: string) => void;
  onCreateEvent: () => void;
  onRSVP: (event: Event) => void;
  onEdit: (event: Event) => void;
  onDelete: (event: Event) => void;
  activeFilters: any;
  timelineFilter: 'all' | 'ongoing' | 'finished';
  onTimelineChange: (timeline: 'all' | 'ongoing' | 'finished') => void;
}

export default function MobileEventView({
  events,
  loading,
  onEventClick,
  onFilter,
  onSearch,
  onCreateEvent,
  onRSVP,
  onEdit,
  onDelete,
  activeFilters,
  timelineFilter,
  onTimelineChange
}: MobileEventViewProps) {
  const { data: session } = useSession();
  const [filterDrawerOpen, setFilterDrawerOpen] = useState(false);
  const [currentPage, setCurrentPage] = useState(1);
  const [selectedEvent, setSelectedEvent] = useState<Event | null>(null);
  const [showDetailsModal, setShowDetailsModal] = useState(false);
  const itemsPerPage = 6;

  useEffect(() => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  }, [currentPage]);

  const handleEventClick = (event: Event) => {
    setSelectedEvent(event);
    setShowDetailsModal(true);
  };

  const handleCloseModal = () => {
    setShowDetailsModal(false);
    setSelectedEvent(null);
  };

  const totalPages = Math.ceil(events.length / itemsPerPage);
  const displayedEvents = events.slice((currentPage - 1) * itemsPerPage, currentPage * itemsPerPage);

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
                placeholder="Search events..."
                className="w-full pl-10 pr-4 py-2 bg-white/5 border border-white/10 rounded-lg text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500"
                onChange={(e) => onSearch(e.target.value)}
              />
            </div>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="pt-[136px] px-4">
        {/* Timeline Filter */}
        <div className="mb-6">
          <div className="flex rounded-lg bg-white/5 p-1">
            <button
              onClick={() => onTimelineChange('all')}
              className={`flex-1 py-2 text-sm rounded-md transition-colors ${
                timelineFilter === 'all' 
                  ? 'bg-white/10 text-white font-medium' 
                  : 'text-white/70 hover:text-white hover:bg-white/5'
              }`}
            >
              All Events
            </button>
            <button
              onClick={() => onTimelineChange('ongoing')}
              className={`flex-1 py-2 text-sm rounded-md transition-colors ${
                timelineFilter === 'ongoing'
                  ? 'bg-white/10 text-white font-medium'
                  : 'text-white/70 hover:text-white hover:bg-white/5'
              }`}
            >
              Ongoing Events
            </button>
            <button
              onClick={() => onTimelineChange('finished')}
              className={`flex-1 py-2 text-sm rounded-md transition-colors ${
                timelineFilter === 'finished'
                  ? 'bg-white/10 text-white font-medium'
                  : 'text-white/70 hover:text-white hover:bg-white/5'
              }`}
            >
              Past Events
            </button>
          </div>
        </div>

        {/* Active Filters */}
        {Object.entries(activeFilters.eventType).some(([_, value]) => value) && (
          <div className="flex flex-wrap gap-2 mb-4">
            {Object.entries(activeFilters.eventType).map(([key, value]) =>
              value ? (
                <div
                  key={key}
                  className="px-3 py-2 bg-white/5 rounded-lg text-white border border-white/10 flex items-center gap-2"
                >
                  {key === "social" ? "Social" : key === "academic" ? "Academic" : key === "career" ? "Career" : "Other"}
                  <button
                    className="opacity-60 hover:opacity-100"
                    onClick={() => {
                      const newFilters = { ...activeFilters };
                      newFilters.eventType[key as keyof typeof newFilters.eventType] = false;
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

        {/* Events List */}
        {loading ? (
          <div className="flex justify-center py-8">
            <div className="text-white/80">Loading events...</div>
          </div>
        ) : (
          <>
            <div className="space-y-4">
              {displayedEvents.map((event, index) => (
                <motion.div
                  key={event._id}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: index * 0.1 }}
                >
                  <EventCard
                    title={event.name}
                    organizer={event.organizer}
                    location={event.location}
                    date={event.startDate}
                    description={event.description}
                    imageUrl={event.imageUrl || ''}
                    eventStatus={timelineFilter}
                    onDetailsClick={() => handleEventClick(event)}
                    onSponsorClick={() => {}}
                    onApplyClick={() => onRSVP(event)}
                  />
                </motion.div>
              ))}

              {displayedEvents.length === 0 && (
                <div className="text-center py-8">
                  <p className="text-gray-400">No events found</p>
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

        {/* Event Details Modal */}
        {selectedEvent && (
          <EventDetails
            title={selectedEvent.name}
            eventStatus={timelineFilter}
            organizer={selectedEvent.organizer}
            location={selectedEvent.location}
            date={selectedEvent.startDate}
            endDate={selectedEvent.endDate}
            description={selectedEvent.description}
            isOpen={showDetailsModal}
            onClose={handleCloseModal}
            onRSVPClick={() => {
              handleCloseModal();
              onRSVP(selectedEvent);
            }}
            imageUrl={selectedEvent.imageUrl}
            type={selectedEvent.type}
            wouldGo={selectedEvent.wouldGo}
            wouldNotGo={selectedEvent.wouldNotGo}
            wouldMaybeGo={selectedEvent.wouldMaybeGo}
          />
        )}
      </div>

      {/* Filter Drawer */}
      <MobileEventFilterDrawer
        isOpen={filterDrawerOpen}
        onClose={() => setFilterDrawerOpen(false)}
        onFilter={onFilter}
        onCreateEvent={onCreateEvent}
        activeFilters={activeFilters}
      />

      {/* Create Event FAB */}
      <button
        onClick={onCreateEvent}
        className="fixed right-4 bottom-4 p-4 bg-blue-600 hover:bg-blue-700 text-white rounded-full shadow-lg transition-colors"
      >
        <Plus size={24} />
      </button>
    </div>
  );
} 