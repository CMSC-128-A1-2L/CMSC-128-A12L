"use client";

import { useState, useEffect } from 'react';
import { Search, Filter, ChevronLeft, ChevronRight, Plus, X, LayoutGrid, LayoutList } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import EventCard from './eventContentCard';
import EventRow from './eventContentRow';
import { Event } from '@/entities/event';

interface AdminMobileEventViewProps {
  events: Event[];
  loading: boolean;
  onEventClick: (event: Event) => void;
  onSearch: (query: string) => void;
  onCreateEvent: () => void;
  onEdit: (event: Event) => void;
  onDelete: (eventId: string) => void;
}

export default function AdminMobileEventView({
  events,
  loading,
  onEventClick,
  onSearch,
  onCreateEvent,
  onEdit,
  onDelete
}: AdminMobileEventViewProps) {
  const [currentPage, setCurrentPage] = useState(1);
  const [isGridView, setIsGridView] = useState(true);
  const itemsPerPage = 6;

  useEffect(() => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  }, [currentPage]);

  const totalPages = Math.ceil(events.length / itemsPerPage);
  const displayedEvents = events.slice((currentPage - 1) * itemsPerPage, currentPage * itemsPerPage);

  // Helper to safely format event data for display components
  const formatEventForDisplay = (event: Event): Event & { displayDate: string } => {
    return {
      ...event,
      displayDate: new Date(event.startDate).toLocaleDateString(),
    };
  };

  return (
    <div className="min-h-screen pb-20">
      {/* Fixed Header */}
      <div className="fixed top-[64px] left-0 right-0 bg-white shadow-sm z-20">
        {/* Search Bar */}
        <div className="p-4">
          <div className="flex items-center gap-3">
            <div className="relative flex-1">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" size={18} />
              <input
                type="search"
                placeholder="Search events..."
                className="w-full pl-10 pr-4 py-2 bg-white border border-gray-200 rounded-lg text-gray-700 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500"
                onChange={(e) => onSearch(e.target.value)}
              />
            </div>
            <div className="flex gap-2">
              <button
                onClick={() => setIsGridView(true)}
                className={`btn ${isGridView ? 'btn-primary' : 'btn-ghost'}`}
              >
                <LayoutGrid size={20} className="text-gray-800"/>
              </button>
              <button
                onClick={() => setIsGridView(false)}
                className={`btn ${!isGridView ? 'btn-primary' : 'btn-ghost'}`}
              >
                <LayoutList size={20} className="text-gray-800"/>
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="pt-32 px-4">
        {/* Events List */}
        {loading ? (
          <div className="flex justify-center py-8">
            <div className="loading loading-spinner loading-lg"></div>
          </div>
        ) : (
          <>
            <div className="space-y-4">
              {displayedEvents.map((event, index) => {
                const eventForDisplay = formatEventForDisplay(event);
                return (
                  <motion.div
                    key={eventForDisplay._id}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: index * 0.1 }}
                  >
                    {isGridView ? (
                      <EventCard
                        _id={eventForDisplay._id!}
                        title={eventForDisplay.name}
                        organizer={eventForDisplay.organizer}
                        location={eventForDisplay.location}
                        date={eventForDisplay.displayDate}
                        imageUrl={eventForDisplay.imageUrl || ''}
                        onDetailsClick={() => onEventClick(event)}
                        onEditClick={() => onEdit(event)}
                        onDeleteClick={() => onDelete(event._id!)}
                        onClose={() => {}}
                        index={index}
                        rsvp={eventForDisplay.rsvp || { enabled: false, options: [] }}
                      />
                    ) : (
                      <EventRow
                        title={eventForDisplay.name}
                        organizer={eventForDisplay.organizer}
                        location={eventForDisplay.location}
                        date={eventForDisplay.displayDate}
                        onDetailsClick={() => onEventClick(event)}
                        onEditClick={() => onEdit(event)}
                        onDeleteClick={() => onDelete(event._id!)}
                      />
                    )}
                  </motion.div>
                );
              })}

              {displayedEvents.length === 0 && (
                <div className="text-center py-8">
                  <p className="text-gray-400">No events found</p>
                </div>
              )}
            </div>

            {/* Pagination */}
            <div className="mt-6">
              <div className="flex items-center justify-between">
                <button
                  onClick={() => setCurrentPage(Math.max(1, currentPage - 1))}
                  className={`btn ${currentPage > 1 ? 'bg-white hover:bg-gray-100' : 'bg-gray-100 cursor-not-allowed'} text-gray-700 border border-gray-200 flex items-center justify-center gap-2 px-4 py-2 rounded-lg transition-all duration-300 shadow-sm hover:shadow`}
                  disabled={currentPage === 1}
                >
                  <ChevronLeft className="text-xl" />
                  <span>Prev</span>
                </button>

                <div className="flex items-center space-x-2">
                  <input
                    type="number"
                    value={currentPage}
                    onChange={(e) => {
                      const value = parseInt(e.target.value);
                      if (!isNaN(value) && value >= 1 && value <= totalPages) {
                        setCurrentPage(value);
                      }
                    }}
                    min={1}
                    max={totalPages}
                    className="w-12 input input-bordered input-sm text-center text-base bg-white text-gray-700 border-gray-200"
                  />
                  <span className="text-gray-600">/ {totalPages}</span>
                </div>

                <button
                  onClick={() => setCurrentPage(Math.min(totalPages, currentPage + 1))}
                  className={`btn ${currentPage < totalPages ? 'bg-white hover:bg-gray-100' : 'bg-gray-100 cursor-not-allowed'} text-gray-700 border border-gray-200 flex items-center justify-center gap-2 px-4 py-2 rounded-lg transition-all duration-300 shadow-sm hover:shadow`}
                  disabled={currentPage === totalPages}
                >
                  <span>Next</span>
                  <ChevronRight className="text-xl" />
                </button>
              </div>
            </div>
          </>
        )}
      </div>

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