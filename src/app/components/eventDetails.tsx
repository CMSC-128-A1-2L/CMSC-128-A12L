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
  X
} from "lucide-react";
import { motion } from "framer-motion";

interface EventDetailsProps {
  title: string;
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
}

const EventDetails: React.FC<EventDetailsProps> = ({
  title,
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
  wouldMaybeGo
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
    const modal = document.getElementById("job_details_modal") as HTMLDialogElement;
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
    <dialog id="job_details_modal" className="modal w-full">
      <div className="fixed inset-0 flex items-center justify-center px-3 sm:px-4 z-50">
        <motion.div 
          ref={modalRef}
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: -20 }}
          className="w-full max-w-4xl bg-gradient-to-br from-[#1a1f4d]/90 to-[#2a3f8f]/90 p-0 rounded-xl overflow-hidden text-white backdrop-blur-lg border border-white/10 max-h-[90vh] mx-auto my-auto"
        >
          {/* Header Image */}
          <div className="relative h-32 sm:h-40 md:h-48">
            {imageUrl ? (
              <img src={imageUrl} alt={title} className="w-full h-full object-cover" />
            ) : (
              <div className="w-full h-full flex items-center justify-center bg-gradient-to-br from-blue-500/20 to-purple-500/20">
                <h2 className="text-xl sm:text-2xl font-bold text-white px-4 text-center">{title}</h2>
              </div>
            )}
            <div className="absolute inset-0 bg-gradient-to-t from-[#1a1f4d]/90 to-transparent" />
            
            {/* Close button - repositioned for better mobile access */}
            <button 
              onClick={onClose}
              className="absolute right-3 top-3 p-2 hover:bg-black/20 rounded-full transition-colors bg-black/30"
            >
              <X size={20} className="text-white" />
            </button>
          </div>

          {/* Content */}
          <div className="p-4 sm:p-6 overflow-y-auto flex-1">
            <div className="flex flex-col sm:flex-row sm:justify-between sm:items-start gap-2 sm:gap-0 mb-4 sm:mb-6">
              <div>
                <h2 className="text-xl sm:text-2xl font-bold text-white mb-1 sm:mb-2 pr-8 sm:pr-0">{title}</h2>
                <div className="flex items-center gap-2 text-gray-300">
                  <Building2 size={16} />
                  <span>{organizer}</span>
                </div>
              </div>
              <span className="px-3 py-1 bg-blue-500/20 text-blue-200 rounded-full text-sm font-medium capitalize border border-blue-500/20 self-start">
                {type}
              </span>
            </div>

            {/* Event Details Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 sm:gap-6 mb-4 sm:mb-6">
              <div className="space-y-3 sm:space-y-4">
                <div className="flex items-center gap-3 text-gray-300">
                  <Calendar size={18} className="flex-shrink-0" />
                  <div className="overflow-hidden">
                    <p className="font-medium">Start</p>
                    <p className="text-sm sm:text-base break-words">{formatDate(date)}</p>
                  </div>
                </div>
                <div className="flex items-center gap-3 text-gray-300">
                  <Clock size={18} className="flex-shrink-0" />
                  <div className="overflow-hidden">
                    <p className="font-medium">End</p>
                    <p className="text-sm sm:text-base break-words">{formatDate(endDate)}</p>
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
            <div className="mb-4 sm:mb-6">
              <h3 className="font-medium text-white mb-2">Description</h3>
              <div className="text-gray-300 whitespace-pre-wrap text-sm sm:text-base max-h-[20vh] sm:max-h-[25vh] overflow-y-auto pr-2">
                {description}
              </div>
            </div>

            {/* Single Action Button */}
            <button
              disabled={eventStatus === "finished"}
              onClick={onRSVPClick}
              className={`w-full py-3 px-4 rounded-lg border font-medium transition-colors cursor-pointer
                ${eventStatus === "finished" 
                  ? "bg-gray-400 text-gray-200 border-gray-300 cursor-not-allowed opacity-60 hover:bg-gray-400" 
                  : "bg-blue-500/20 hover:bg-blue-500/30 text-blue-200 border-blue-500/20"}
              `}
            >
              RSVP Now
            </button>
          </div>
        </motion.div>
      </div>
      <form method="dialog" className="modal-backdrop">
        <button onClick={onClose}>close</button>
      </form>
    </dialog>
  );
};

export default EventDetails;
