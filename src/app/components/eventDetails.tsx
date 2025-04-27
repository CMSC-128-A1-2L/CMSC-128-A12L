"use client";
import React from "react";
import {
  Calendar,
  MapPin,
  Clock,
  ThumbsUp,
  ThumbsDown,
  HelpCircle,
  Building2
} from "lucide-react";
import { motion } from "framer-motion";

interface EventDetailsProps {
  title: string;
  organizer: string;
  location: string;
  date: Date;
  description: string;
  isOpen: boolean;
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

  return (
    <dialog id="job_details_modal" className="modal modal-bottom sm:modal-middle">
      <motion.div 
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        exit={{ opacity: 0, y: -20 }}
        className="modal-box max-w-4xl bg-gradient-to-br from-[#1a1f4d]/90 to-[#2a3f8f]/90 p-0 rounded-xl overflow-hidden text-white backdrop-blur-lg border border-white/10 z-[60]"
      >
        {/* Header Image */}
        <div className="relative h-48">
          {imageUrl ? (
            <img src={imageUrl} alt={title} className="w-full h-full object-cover" />
          ) : (
            <div className="w-full h-full flex items-center justify-center bg-gradient-to-br from-blue-500/20 to-purple-500/20">
              <h2 className="text-2xl font-bold text-white">{title}</h2>
            </div>
          )}
          <div className="absolute inset-0 bg-gradient-to-t from-[#1a1f4d]/90 to-transparent" />
        </div>

        {/* Content */}
        <div className="p-6">
          <div className="flex justify-between items-start mb-6">
            <div>
              <h2 className="text-2xl font-bold text-white mb-2">{title}</h2>
              <div className="flex items-center gap-2 text-gray-300">
                <Building2 size={16} />
                <span>{organizer}</span>
              </div>
            </div>
            <span className="px-3 py-1 bg-blue-500/20 text-blue-200 rounded-full text-sm font-medium capitalize border border-blue-500/20">
              {type}
            </span>
          </div>

          {/* Event Details Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
            <div className="space-y-4">
              <div className="flex items-center gap-3 text-gray-300">
                <Calendar size={18} />
                <div>
                  <p className="font-medium">Start</p>
                  <p>{formatDate(date)}</p>
                </div>
              </div>
              <div className="flex items-center gap-3 text-gray-300">
                <Clock size={18} />
                <div>
                  <p className="font-medium">End</p>
                  <p>{formatDate(endDate)}</p>
                </div>
              </div>
              <div className="flex items-center gap-3 text-gray-300">
                <MapPin size={18} />
                <div>
                  <p className="font-medium">Location</p>
                  <p>{location}</p>
                </div>
              </div>
            </div>

            {/* RSVP Stats */}
            <div className="bg-white/5 p-4 rounded-xl space-y-3 border border-white/10">
              <h3 className="font-medium text-white mb-3">RSVP Status</h3>
              <div className="flex items-center gap-3 text-gray-300">
                <ThumbsUp className="text-green-400" size={18} />
                <span className="flex-1">Going</span>
                <span className="font-medium">{wouldGo.length}</span>
              </div>
              <div className="flex items-center gap-3 text-gray-300">
                <HelpCircle className="text-yellow-400" size={18} />
                <span className="flex-1">Maybe</span>
                <span className="font-medium">{wouldMaybeGo.length}</span>
              </div>
              <div className="flex items-center gap-3 text-gray-300">
                <ThumbsDown className="text-red-400" size={18} />
                <span className="flex-1">Not Going</span>
                <span className="font-medium">{wouldNotGo.length}</span>
              </div>
            </div>
          </div>

          {/* Description */}
          <div className="mb-6">
            <h3 className="font-medium text-white mb-2">Description</h3>
            <p className="text-gray-300 whitespace-pre-wrap">{description}</p>
          </div>

          {/* Single Action Button */}
          <button
            onClick={onRSVPClick}
            className="btn w-full bg-blue-500/20 hover:bg-blue-500/30 text-blue-200 border border-blue-500/20"
          >
            RSVP Now
          </button>
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
