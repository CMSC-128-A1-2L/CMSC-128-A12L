"use client";

import { useState, useRef } from "react";
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
import EventDetails from "@/app/components/eventDetails";
import EditJobListComponent from "@/app/components/editJobList";
import eventData from "@/dummy_data/event.json";
// Refactor add event list and edit event to use modal than page
import EditEventModal from "@/app/components/editEvent";
import CreateEventModal from "@/app/components/createEvent";
import { Event } from "@/entities/event";

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
  const [events, setEvents] = useState<any[]>(eventData);

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
  });

  // Filter events based on available data
  const filteredEvents = events.filter((event) =>
    (event.title || event.name || "").toLowerCase().includes(search.toLowerCase())
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
    });
    setPreviewImage(null);
  };

  // Helper to safely format event data for display components
  const formatEventForDisplay = (event: any, index: number): Partial<Event> & { displayDate: string } => {
    const eventId = event._id || event.id || `event-${index}`;
    return {
      ...event, // Include original fields
      _id: eventId,
      name: event.title || event.name || "Untitled Event",
      description: event.description || "",
      type: event.type || "other",
      startDate: new Date(event.date || event.startDate || Date.now()), // Ensure Date object
      endDate: new Date(event.endDate || event.date || event.startDate || Date.now()), // Ensure Date object
      location: event.location || "N/A",
      imageUrl: event.imageUrl || "",
      monetaryValue: event.monetaryValue || 0,
      wouldGo: event.wouldGo || [],
      wouldNotGo: event.wouldNotGo || [],
      wouldMaybeGo: event.wouldMaybeGo || [],
      organizer: event.organizer || "N/A", // Add organizer if used in cards
      // Simple formatted date string for cards/rows
      displayDate: new Date(event.date || event.startDate || Date.now()).toLocaleDateString(),
    };
  };

  // Handle event details modal open/close
  const handleEventDetails = (eventData: any) => {
    // Format the data passed from the card/row click
    const formattedEvent = formatEventForDisplay(eventData, -1); // Index -1 as it's not from map loop
    setSelectedEvent(formattedEvent as Event); // Assume formattedEvent matches Event structure
    setIsModalOpen(true);
  };
  

  const handleCloseDetailsModal = () => {
    setIsModalOpen(false);
    setSelectedEvent(null);
  };

  // Handle edit modal open/close
  const handleEdit = (event: Event) => {
    setEventToEdit(event); // Set the event to be edited
    setIsEditModalOpen(true); // Open the edit modal
    setIsModalOpen(false); // Close the details modal if it was open
  };

  const handleCloseEditModal = () => {
    setIsEditModalOpen(false);
    setEventToEdit(null);
  };

  const handleSaveEditedEvent = (updatedEvent: Event) => {
    console.log("Saving updated event:", updatedEvent);
    // TODO: Implement actual save logic (e.g., API call)
    // For now, just update the dummy data visually (if needed) or refetch
    handleCloseEditModal();
    // Potentially reopen details modal with updated data
    // setSelectedEvent(updatedEvent); 
    // setIsModalOpen(true);
  };

  // Handle Apply to Job button click
  const handleApply = (jobTitle: string) => {
    console.log(`Applying for ${jobTitle}`);
  };

  function handleFilterChange(arg0: { jobType: { fullTime: boolean; partTime: boolean; contract: boolean; }; workType: { onSite: boolean; remote: boolean; hybrid: boolean; }; }): void {
    throw new Error("Function not implemented.");
  }

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
      // Update the events list with the new event
      setEvents(prevEvents => [...prevEvents, result.event]);
      
      // Show success message or handle UI updates
      // You might want to add a toast notification here
      console.log('Event created successfully:', result.event);
    } catch (error) {
      console.error('Error creating event:', error);
      // Handle error (show error message to user)
      // You might want to add an error toast notification here
    }
  };

  return (
    <div className="w-full">
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
          {displayedEvents.map((event, index) => {
            // Format event data specifically for Card/Row display
            const eventForDisplay = formatEventForDisplay(event, index);

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
                    _id={eventForDisplay._id!} // Use non-null assertion if confident _id exists
                    title={eventForDisplay.name!}
                    organizer={eventForDisplay.organizer!}
                    location={eventForDisplay.location!}
                    date={eventForDisplay.displayDate} // Use simple display date
                    imageUrl={eventForDisplay.imageUrl!}
                    onDetailsClick={() => handleEventDetails(event)} // Pass original event data
                    // Dummy props - ensure these match EventCard's actual props
                    index={index} 
                    rsvp={{ enabled: false, options: [] }} 
                    onClose={() => {}} 
                    onEditClick={() => {}} 
                    onDeleteClick={() => {}} 
                  />
                ) : (
                  <EventRow
                    title={eventForDisplay.name!}
                    organizer={eventForDisplay.organizer!}
                    location={eventForDisplay.location!}
                    date={eventForDisplay.displayDate} // Use simple display date
                    onDetailsClick={() => handleEventDetails(event)} // Pass original event data
                  />
                )}
              </motion.div>
            );
          })}
        </AnimatePresence>
      </div>

      {/* Pagination */}
      {totalPages > 1 && (
        <div className="flex justify-center gap-2 mt-6">
          <button
            onClick={() => setCurrentPage((prev) => Math.max(prev - 1, 1))}
            disabled={currentPage === 1}
            className="btn btn-ghost btn-sm"
          >
            <ChevronLeft size={16} />
          </button>
          {Array.from({ length: totalPages }, (_, i) => i + 1).map((page) => (
            <button
              key={page}
              onClick={() => setCurrentPage(page)}
              className={`btn btn-sm ${currentPage === page ? 'btn-primary' : 'btn-ghost'}`}
            >
              {page}
            </button>
          ))}
          <button
            onClick={() => setCurrentPage((prev) => Math.min(prev + 1, totalPages))}
            disabled={currentPage === totalPages}
            className="btn btn-ghost btn-sm"
          >
            <ChevronRight size={16} />
          </button>
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
        <EventDetails
          {...selectedEvent}
          _id={selectedEvent._id!}
          startDate={selectedEvent.startDate!}
          endDate={selectedEvent.endDate!}
          onEditClick={() => handleEdit(selectedEvent)}
          onDeleteClick={() => console.log("Delete event", selectedEvent._id)}
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
    </div>
  );
}
