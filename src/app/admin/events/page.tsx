"use client";

import { useState, useRef, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  Search,
  LayoutGrid,
  LayoutList,
  ChevronRight,
  ChevronLeft,
  Plus,
  Image as ImageIcon,
} from "lucide-react";
import EventCard from "@/app/components/eventContentCard";
import EventRow from "@/app/components/eventContentRow";
import AdminEventDetails from "@/app/components/AdminEventDetails";
import EditEventModal from "@/app/components/AdminEditEvent";
import CreateEventModal from "@/app/components/createEvent";
import AdminMobileEventView from "@/app/components/AdminMobileEventView";
import { Event } from "@/entities/event";
import { createNotification } from '@/services/notification.service';

export default function EventsPage() {
  // State management
  const [showEventModal, setShowEventModal] = useState(false);
  const [search, setSearch] = useState("");
  const [isGridView, setIsGridView] = useState(true);
  const [selectedEvent, setSelectedEvent] = useState<Event | null>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [currentPage, setCurrentPage] = useState(1);
  const [previewImage, setPreviewImage] = useState<string | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [eventToEdit, setEventToEdit] = useState<Event | null>(null);
  const [events, setEvents] = useState<Event[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [isMobile, setIsMobile] = useState(false);

  // Form state
  const [formData, setFormData] = useState({
    name: "",
    description: "",
    type: "",
    startDate: "",
    endDate: "",
    location: "",
    monetaryValue: 0,
    image: null as File | null,
    sponsorship: {
      enabled: false,
      goal: 0,
      currentAmount: 0,
      sponsors: []
    },
  });

  const fetchEvents = async () => {
    try {
      setIsLoading(true);
      const response = await fetch('/api/admin/events');
      
      if (!response.ok) {
        throw new Error('Failed to fetch events');
      }

      const data = await response.json();
      setEvents(data);
      setError(null);
    } catch (err) {
      console.error('Error fetching events:', err);
      setError('Failed to load events. Please try again later.');
    } finally {
      setIsLoading(false);
    }
  };

  // Fetch events on component mount
  useEffect(() => {
    fetchEvents();
  }, []);

  // Add resize handler
  useEffect(() => {
    const checkMobile = () => {
      setIsMobile(window.innerWidth < 768);
    };
    
    // Initial check
    checkMobile();
    
    // Add event listener
    window.addEventListener('resize', checkMobile);
    
    // Cleanup
    return () => window.removeEventListener('resize', checkMobile);
  }, []);

  // Filter events based on search
  const filteredEvents = events.filter((event) =>
    (event.name || "").toLowerCase().includes(search.toLowerCase())
  );

  // Pagination
  const itemsPerPage = 12;
  const totalPages = Math.ceil(filteredEvents.length / itemsPerPage);
  const displayedEvents = filteredEvents.slice(
    (currentPage - 1) * itemsPerPage,
    currentPage * itemsPerPage
  );

  // Handle image upload
  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      setFormData({ ...formData, image: file });
      const reader = new FileReader();
      reader.onloadend = () => {
        setPreviewImage(reader.result as string);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleRemoveImage = () => {
    setPreviewImage(null);
    setFormData({ ...formData, image: null });
    if (fileInputRef.current) {
      fileInputRef.current.value = "";
    }
  };

  // Handle form submission
  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    // Here you would typically handle the form submission
    console.log("Form submitted:", formData);
    setShowEventModal(false);
    setFormData({
      name: "",
      description: "",
      type: "",
      startDate: "",
      endDate: "",
      location: "",
      monetaryValue: 0,
      image: null,
      sponsorship: {
        enabled: false,
        goal: 0,
        currentAmount: 0,
        sponsors: []
      },
    });
    setPreviewImage(null);
  };

  // Helper to safely format event data for display components
  const formatEventForDisplay = (event: Event): Event & { displayDate: string } => {
    return {
      ...event,
      displayDate: new Date(event.startDate).toLocaleDateString(),
    };
  };

  // Handle event details modal open/close
  const handleEventDetails = (eventData: Event) => {
    const formattedEvent = formatEventForDisplay(eventData);
    setSelectedEvent(formattedEvent);
    setIsModalOpen(true);
  };

  const handleCloseDetailsModal = () => {
    setIsModalOpen(false);
    setSelectedEvent(null);
  };

  // Handle edit modal open/close
  const handleEdit = (event: Event) => {
    setEventToEdit(event);
    setIsEditModalOpen(true);
    setIsModalOpen(false);
  };

  const handleCloseEditModal = () => {
    setIsEditModalOpen(false);
    setEventToEdit(null);
  };

  const handleSaveEditedEvent = async (updatedEvent: Event) => {
    try {
      const response = await fetch(`/api/admin/events/${updatedEvent._id}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          ...updatedEvent,
          startDate: updatedEvent.startDate.toISOString(),
          endDate: updatedEvent.endDate.toISOString(),
        }),
      });

      if (!response.ok) {
        const error = await response.json();
        throw new Error(error.error || 'Failed to update event');
      }

      // Refresh the events list
      await fetchEvents();
      handleCloseEditModal();
    } catch (error) {
      console.error('Error updating event:', error);
      // You might want to show an error message to the user here
    }
  };

  // Handle form submission
  const handleCreateEvent = async (eventData: Partial<Event>) => {
    try {
      const response = await fetch('/api/admin/events', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(eventData),
      });

      if (!response.ok) {
        const error = await response.json();
        throw new Error(error.error || 'Failed to create event');
      }

      const result = await response.json();
      // Ensure the event has an _id before adding it to the state
      if (result.event && result.event._id) {
        setEvents(prevEvents => [...prevEvents, result.event]);
      }

      // Create notification using the service
      await createNotification({
        type: 'event',
        entity: eventData,
        entityName: eventData.name ?? '',
        action: 'created',
        sendAll: true
      });

      setShowEventModal(false);
    } catch (error) {
      console.error('Error creating event:', error);
      // You might want to show an error message to the user here
    }
  };

  const handleDeleteEvent = async (eventId: string) => {
    try {
      const response = await fetch(`/api/admin/events/${eventId}`, {
        method: 'DELETE',
      });

      if (!response.ok) {
        const error = await response.json();
        throw new Error(error.error || 'Failed to delete event');
      }

      // Refresh the events list
      await fetchEvents();
      setIsModalOpen(false);
      setSelectedEvent(null);
    } catch (error) {
      console.error('Error deleting event:', error);
    }
  };

  if (isLoading) {
    return (
      <div className="flex items-center justify-center h-screen">
        <div className="loading loading-spinner loading-lg"></div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex items-center justify-center h-screen">
        <div className="text-red-500">{error}</div>
      </div>
    );
  }

  return (
    <>
      {isMobile ? (
        <AdminMobileEventView
          events={filteredEvents}
          loading={isLoading}
          onEventClick={handleEventDetails}
          onSearch={setSearch}
          onCreateEvent={() => setShowEventModal(true)}
          onEdit={handleEdit}
          onDelete={handleDeleteEvent}
        />
      ) : (
        <div className="container mx-auto p-4 sm:p-6 max-w-7xl">
          {/* Header */}
          <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-4 mb-6">
            <h1 className="text-2xl font-bold text-gray-800">Events Management</h1>
            <button
              onClick={() => setShowEventModal(true)}
              className="btn btn-primary gap-2"
            >
              <Plus size={20} />
              Create Event
            </button>
          </div>

          {/* Search and View Toggle */}
          <div className="flex flex-col md:flex-row gap-4 mb-6">
            <div className="flex-1">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-800 z-10" size={20} />
                <input
                  type="search"
                  placeholder="Search events..."
                  className="input input-bordered w-full pl-10 bg-white border-gray-200 text-gray-500"
                  value={search}
                  onChange={(e) => setSearch(e.target.value)}
                />
              </div>
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

          {/* Events Grid/List */}
          <div className={`grid ${isGridView ? 'grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4' : 'grid-cols-1'} gap-4`}>
            <AnimatePresence>
              {displayedEvents.map((event) => {
                const eventForDisplay = formatEventForDisplay(event);

                return (
                  <motion.div
                    key={eventForDisplay._id}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -20 }}
                    transition={{ duration: 0.3 }}
                  >
                    {isGridView ? (
                      <EventCard
                        _id={eventForDisplay._id!}
                        title={eventForDisplay.name}
                        organizer={eventForDisplay.organizer}
                        location={eventForDisplay.location}
                        date={eventForDisplay.displayDate}
                        imageUrl={eventForDisplay.imageUrl || ''}
                        onDetailsClick={() => handleEventDetails(event)}
                        onEditClick={() => handleEdit(event)}
                        onDeleteClick={() => handleDeleteEvent(event._id!)}
                        onClose={() => {}}
                        index={0}
                        rsvp={eventForDisplay.rsvp || { enabled: false, options: [] }}
                      />
                    ) : (
                      <EventRow
                        title={eventForDisplay.name}
                        organizer={eventForDisplay.organizer}
                        location={eventForDisplay.location}
                        date={eventForDisplay.displayDate}
                        onDetailsClick={() => handleEventDetails(event)}
                        onEditClick={() => handleEdit(event)}
                        onDeleteClick={() => handleDeleteEvent(event._id!)}
                      />
                    )}
                  </motion.div>
                );
              })}
            </AnimatePresence>
          </div>

          {/* Pagination */}
          <div className="flex justify-center gap-2 mt-6">
            <button
              onClick={() => setCurrentPage((prev) => Math.max(prev - 1, 1))}
              disabled={currentPage === 1}
              className="btn btn-sm btn-outline text-gray-700 hover:text-white"
            >
              <ChevronLeft size={16} />
            </button>
            {Array.from({ length: totalPages }, (_, i) => i + 1).map((page) => (
              <button
                key={page}
                onClick={() => setCurrentPage(page)}
                className={`btn btn-sm min-w-[2.5rem] ${
                  currentPage === page 
                    ? 'btn-primary text-white'
                    : 'btn-outline text-gray-700 hover:text-white'
                }`}
              >
                {page}
              </button>
            ))}
            <button
              onClick={() => setCurrentPage((prev) => Math.min(prev + 1, totalPages))}
              disabled={currentPage === totalPages}
              className="btn btn-sm btn-outline text-gray-700 hover:text-white"
            >
              <ChevronRight size={16} />
            </button>
          </div>
        </div>
      )}

      {/* Create Event Modal */}
      {showEventModal && (
        <CreateEventModal
          isOpen={showEventModal}
          onClose={() => setShowEventModal(false)}
          onSubmit={handleCreateEvent}
        />
      )}

      {/* Event Details Modal */}
      {isModalOpen && selectedEvent && (
        <AdminEventDetails
          _id={selectedEvent._id!}
          name={selectedEvent.name}
          organizer={selectedEvent.organizer}
          description={selectedEvent.description}
          type={selectedEvent.type}
          startDate={selectedEvent.startDate}
          endDate={selectedEvent.endDate}
          location={selectedEvent.location}
          imageUrl={selectedEvent.imageUrl}
          sponsorship={selectedEvent.sponsorship}
          rsvp={selectedEvent.rsvp}
          wouldGo={selectedEvent.wouldGo}
          wouldNotGo={selectedEvent.wouldNotGo}
          wouldMaybeGo={selectedEvent.wouldMaybeGo}
          onEditClick={() => handleEdit(selectedEvent)}
          onDeleteClick={() => handleDeleteEvent(selectedEvent._id!)}
          onClose={handleCloseDetailsModal}
          isOpen={isModalOpen}
        />
      )}

      {/* Edit Event Modal */}
      {isEditModalOpen && eventToEdit && (
        <EditEventModal
          isOpen={isEditModalOpen}
          onClose={handleCloseEditModal}
          onSave={handleSaveEditedEvent}
          event={eventToEdit}
        />
      )}
    </>
  );
}