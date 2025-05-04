"use client";
import React from "react";
import {
  Calendar,
  MapPin,
  Clock,
  ThumbsUp,
  ThumbsDown,
  HelpCircle,
  Building2,
  DollarSign,
  X
} from "lucide-react";
import { motion } from "framer-motion";

interface EventDetailsProps {
  _id?: string;
  title: string;
  name: string;
  organizer: string;
  location: string;
  date: Date;
  description: string;
  isOpen: boolean;
  eventStatus: string;
  onClose: () => void;
  onRSVPClick: () => void;
  imageUrl?: string;
  type: string;
  endDate: Date;
  wouldGo: string[];
  wouldNotGo: string[];
  wouldMaybeGo: string[];
  sponsorship?: {
    enabled: boolean;
    goal: number;
    currentAmount: number;
  };
}

const EventDetails: React.FC<EventDetailsProps> = ({
  _id,
  title,
  name,
  organizer,
  location,
  date,
  endDate,
  eventStatus,
  description,
  isOpen,
  onClose,
  onRSVPClick,
  imageUrl,
  type,
  wouldGo,
  wouldNotGo,
  wouldMaybeGo,
  sponsorship
}) => {
  // Format the dates
  const formatDate = (date: Date) => {
    return new Date(date).toLocaleDateString('en-US', {
      weekday: 'long',
      year: 'numeric',
      month: 'long',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  // Add a ref for the modal content
  const modalRef = React.useRef<HTMLDivElement>(null);

  // Added useEffect to handle modal behavior and positioning
  React.useEffect(() => {
    const modal = document.getElementById("event_details_modal") as HTMLDialogElement;
    if (modal) {
      if (isOpen) {
        modal.showModal();
        
        // Center the modal content on mobile
        if (modalRef.current && window.innerWidth < 640) {
          modalRef.current.scrollIntoView({
            behavior: 'smooth',
            block: 'center'
          });
        }
      } else {
        modal.close();
      }
    }
  }, [isOpen]);

  return (
    <dialog id="event_details_modal" className="modal modal-bottom sm:modal-middle">
      <motion.div 
        ref={modalRef}
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        exit={{ opacity: 0, y: -20 }}
        className="modal-box max-w-4xl bg-gradient-to-br from-[#1a1f4d]/90 to-[#2a3f8f]/90 p-0 rounded-xl overflow-hidden text-white backdrop-blur-lg border border-white/10 z-[60] flex flex-col"
      >
        {/* Header Image */}
        <div className="relative h-48 flex-shrink-0">
          {imageUrl ? (
            <img src={imageUrl} alt={title} className="w-full h-full object-cover" />
          ) : (
            <div className="w-full h-full flex items-center justify-center bg-gradient-to-br from-blue-500/20 to-purple-500/20">
              <h2 className="text-2xl font-bold text-white">{title}</h2>
            </div>
          )}
          <div className="absolute inset-0 bg-gradient-to-t from-[#1a1f4d]/90 to-transparent" />
        </div>

        {/* Scrollable Content */}
        <div className="flex-1 overflow-y-auto" style={{ maxHeight: "calc(80vh - 12rem)" }}>
          <div className="p-4 sm:p-6">
            <div className="flex flex-col sm:flex-row sm:justify-between sm:items-start gap-2 sm:gap-0 mb-4 sm:mb-6">
              <div>
                <h2 className="text-xl sm:text-2xl font-bold text-white mb-1 sm:mb-2">{title}</h2>
                <div className="flex items-center gap-2 text-gray-300">
                  <Building2 size={16} />
                  <span>{organizer}</span>
                </div>
              </div>
              <span className="inline-flex items-center px-3 py-1 rounded-full text-xs sm:text-sm font-medium bg-blue-500/20 text-blue-200 border border-blue-500/20">
                {type}
              </span>
            </div>

            {/* Event Details Grid */}
            <div className="grid grid-cols-1 gap-4 sm:gap-6 mb-4 sm:mb-6">
              <div className="space-y-3 sm:space-y-4">
                <div className="flex items-center gap-3 text-gray-300">
                  <Calendar size={18} className="flex-shrink-0" />
                  <div className="overflow-hidden">
                    <p className="font-medium">Start</p>
                    <p className="text-sm sm:text-base">{formatDate(date)}</p>
                  </div>
                </div>
                <div className="flex items-center gap-3 text-gray-300">
                  <Clock size={18} className="flex-shrink-0" />
                  <div className="overflow-hidden">
                    <p className="font-medium">End</p>
                    <p className="text-sm sm:text-base">{formatDate(endDate)}</p>
                  </div>
                </div>
                <div className="flex items-center gap-3 text-gray-300">
                  <MapPin size={18} className="flex-shrink-0" />
                  <div className="overflow-hidden">
                    <p className="font-medium">Location</p>
                    <p className="text-sm sm:text-base break-words">{location}</p>
                  </div>
                </div>
              </div>

              {/* RSVP Stats */}
              <div className="bg-white/5 p-3 sm:p-4 rounded-xl space-y-2 sm:space-y-3 border border-white/10">
                <h3 className="font-medium text-white mb-2 sm:mb-3">RSVP Status</h3>
                <div className="flex items-center gap-3 text-gray-300">
                  <ThumbsUp className="text-green-400 flex-shrink-0" size={18} />
                  <span className="flex-1">Going</span>
                  <span className="font-medium">{wouldGo.length}</span>
                </div>
                <div className="flex items-center gap-3 text-gray-300">
                  <HelpCircle className="text-yellow-400 flex-shrink-0" size={18} />
                  <span className="flex-1">Maybe</span>
                  <span className="font-medium">{wouldMaybeGo.length}</span>
                </div>
                <div className="flex items-center gap-3 text-gray-300">
                  <ThumbsDown className="text-red-400 flex-shrink-0" size={18} />
                  <span className="flex-1">Not Going</span>
                  <span className="font-medium">{wouldNotGo.length}</span>
                </div>
              </div>
            </div>

            {/* Description */}
            <div className="mb-6">
              <h3 className="font-medium text-white mb-2">Description</h3>
              <p className="text-gray-300 whitespace-pre-wrap text-sm sm:text-base">{description}</p>
            </div>

            {/* Sponsorship Section - Moved inside scrollable content for better mobile view */}
            {sponsorship?.enabled && (
              <div className="mb-6">
                <div className="bg-white/5 p-4 rounded-xl border border-white/10">
                  <div className="flex items-center justify-between mb-4">
                    <div className="flex items-center gap-2">
                      <DollarSign className="w-5 h-5 text-gray-300" />
                      <span className="font-medium text-white">Sponsorship Progress</span>
                    </div>
                    <span className="text-sm text-gray-300">
                      Goal: ₱{sponsorship.goal.toLocaleString()}
                    </span>
                  </div>
                  <div className="space-y-2">
                    <div className="flex justify-between text-sm text-gray-300">
                      <span>Raised</span>
                      <span>₱{sponsorship.currentAmount.toLocaleString()}</span>
                    </div>
                    <div className="w-full bg-white/10 rounded-full h-2">
                      <div
                        className="bg-blue-500 h-2 rounded-full transition-all duration-300"
                        style={{
                          width: `${Math.min((sponsorship.currentAmount / sponsorship.goal) * 100, 100)}%`
                        }}
                      />
                    </div>
                  </div>
                </div>
              </div>
            )}
          </div>
        </div>

        {/* Fixed Action Buttons */}
        <div className="p-4 sm:p-6 border-t border-white/10 bg-[#1a1f4d]/80 backdrop-blur-sm flex-shrink-0">
          <div className="flex flex-col sm:flex-row gap-3 sm:gap-4">
            <button
              disabled={eventStatus === "finished"}
              onClick={onRSVPClick}
              className={`btn w-full sm:flex-1 rounded-lg border 
                ${eventStatus === "finished" 
                  ? "bg-gray-400 text-gray-200 border-gray-300 cursor-not-allowed opacity-60 hover:bg-gray-400" 
                  : "bg-blue-500/20 hover:bg-blue-500/30 text-blue-200 border-blue-500/20"}
              `}
            >
              RSVP Now
            </button>
            
            {sponsorship?.enabled && (
              <button
                disabled={eventStatus === "finished"}
                onClick={() => {
                  const modal = document.getElementById("event_details_modal") as HTMLDialogElement;
                  if (modal) {
                    modal.close();
                  }
                  const params = new URLSearchParams({
                    eventId: _id!,
                    eventName: title,
                    sponsorshipGoal: sponsorship.goal.toString()
                  });
                  window.location.href = `/alumni/donations?${params.toString()}`;
                }}
                className={`btn w-full sm:flex-1 rounded-lg border
                  ${eventStatus === "finished" 
                    ? "bg-gray-400 text-gray-200 border-gray-300 cursor-not-allowed opacity-60 hover:bg-gray-400" 
                    : "bg-green-500/20 hover:bg-green-500/30 text-green-200 border-green-500/20"}
                `}
              >
                <DollarSign className="w-4 h-4" />
                Sponsor Event
              </button>
            )}
          </div>
        </div>

        {/* Close button */}
        <form method="dialog">
          <button 
            onClick={onClose}
            className="btn btn-sm btn-circle btn-ghost absolute right-2 top-2 text-white hover:bg-white/10"
          >
            ✕
          </button>
        </form>
      </motion.div>
      <form method="dialog" className="modal-backdrop">
        <button onClick={onClose}>close</button>
      </form>
    </dialog>
  );
};

export default EventDetails;
