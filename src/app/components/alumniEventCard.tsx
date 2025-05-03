"use client";
import React, { useEffect, useState } from "react";
import { Calendar, MapPin, Users, Image as ImageIcon, DollarSign } from "lucide-react";
import { motion } from "framer-motion";

interface EventCardProps {
  title: string;
  organizer: string;
  location: string;
  date: Date;
  description: string;
  imageUrl: string;
  eventStatus: string;
  onDetailsClick: () => void;
  onSponsorClick: () => void;
  onApplyClick: () => void;
  eventId: string; // Add this prop
}

const DefaultEventBanner = ({ title }: { title: string }) => (
  <div className="relative h-full bg-gradient-to-br from-blue-500/20 to-purple-500/20 flex items-center justify-center p-4">
    <div className="text-center">
      <ImageIcon className="w-12 h-12 mx-auto mb-2 text-white/40" />
      <h3 className="text-xl font-bold text-white/80 line-clamp-2">{title}</h3>
    </div>
    <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent" />
  </div>
);

const EventCard: React.FC<EventCardProps> = ({
  title,
  organizer,
  location,
  date,
  description,
  imageUrl,
  eventStatus,
  onDetailsClick,
  onSponsorClick,
  onApplyClick,
  eventId,
}) => {
  const [sponsorshipStatus, setSponsorshipStatus] = useState<{
    currentAmount: number;
    goal: number;
    isActive: boolean;
  }>({ currentAmount: 0, goal: 0, isActive: false });

  useEffect(() => {
    const fetchSponsorshipStatus = async () => {
      try {
        const response = await fetch(`/api/events/${eventId}/sponsor`);
        if (response.ok) {
          const data = await response.json();
          setSponsorshipStatus(data);
        }
      } catch (error) {
        console.error('Error fetching sponsorship status:', error);
      }
    };

    if (eventId) {
      fetchSponsorshipStatus();
    }
  }, [eventId]);

  return (
    <motion.div
      whileHover={{ y: -5 }}
      transition={{ type: "spring", stiffness: 400, damping: 10 }}
      className="h-full flex flex-col bg-white/5 hover:bg-white/10 border border-white/10 rounded-lg overflow-hidden transition-colors cursor-pointer"
    >
      {/* Image container */}
      <div className="relative h-48 overflow-hidden">
        {imageUrl ? (
          <img
            src={imageUrl}
            alt={title}
            className="w-full h-full object-cover"
          />
        ) : (
          <div className="w-full h-full bg-white/5 flex items-center justify-center">
            <Calendar className="h-12 w-12 text-white/20" />
          </div>
        )}
      </div>

      {/* Content */}
      <div className="flex flex-col flex-grow p-4">
        {/* Title and Status */}
        <div className="flex items-start justify-between gap-4 mb-2">
          <h3 className="text-lg font-semibold text-white line-clamp-2">{title}</h3>
          <span className={`px-2 py-1 rounded-full text-xs font-medium ${
            eventStatus === 'upcoming' ? 'bg-green-500/20 text-green-400' :
            eventStatus === 'ongoing' ? 'bg-blue-500/20 text-blue-400' :
            'bg-gray-500/20 text-gray-400'
          }`}>
            {eventStatus.charAt(0).toUpperCase() + eventStatus.slice(1)}
          </span>
        </div>

        {/* Organizer */}
        <p className="text-sm text-gray-300 mb-2">{organizer}</p>

        {/* Location and Date */}
        <div className="space-y-2 mb-4">
          <div className="flex items-center gap-2 text-sm text-gray-400">
            <MapPin size={14} />
            <span>{location}</span>
          </div>
          <div className="flex items-center gap-2 text-sm text-gray-400">
            <Calendar size={14} />
            <span>{new Date(date).toLocaleDateString()}</span>
          </div>
        </div>

        {/* Sponsorship Progress (if active) */}
        {sponsorshipStatus.isActive && (
          <div className="mb-4">
            <div className="flex items-center justify-between mb-2">
              <div className="flex items-center gap-2 text-sm text-gray-300">
                <DollarSign className="w-4 h-4" />
                <span>Sponsorship Progress</span>
              </div>
              <span className="text-sm font-medium text-white">
                ₱{sponsorshipStatus.currentAmount.toLocaleString()} / ₱{sponsorshipStatus.goal.toLocaleString()}
              </span>
            </div>
            <div className="w-full bg-white/10 rounded-full h-1.5">
              <div
                className="bg-blue-500 h-1.5 rounded-full transition-all duration-300"
                style={{
                  width: `${(sponsorshipStatus.currentAmount / sponsorshipStatus.goal) * 100}%`
                }}
              />
            </div>
          </div>
        )}

        {/* Description */}
        <p className="text-sm text-gray-300 line-clamp-3 mb-4 flex-grow">{description}</p>

        {/* Action Buttons */}
        <div className="flex flex-col gap-2 mt-auto">
          <button
            onClick={onDetailsClick}
            className="px-4 py-2 bg-white/5 hover:bg-white/10 text-white rounded-lg transition-colors border border-white/10 cursor-pointer"
          >
            Details
          </button>
          {sponsorshipStatus.isActive && (
            <button
              disabled={eventStatus === "finished"}
              onClick={onSponsorClick}
              className={`px-4 py-2 rounded-lg transition-colors border-none text-white 
                ${eventStatus === "finished" 
                  ? "bg-gray-400 cursor-not-allowed opacity-60 hover:bg-gray-400" 
                  : "bg-blue-600 hover:bg-blue-700"}
              `}
            >
              Sponsor
            </button>
          )}
          <button
            disabled={eventStatus === "finished"}
            onClick={(e) => {
              e.stopPropagation();
              onApplyClick();
            }}
            className={`px-4 py-2 rounded-lg transition-colors border-none text-white 
              ${eventStatus === "finished" 
                ? "bg-gray-400 cursor-not-allowed opacity-60 hover:bg-gray-400" 
                : "bg-green-600 hover:bg-green-700"}
            `}
          >
            RSVP
          </button>
        </div>
      </div>
    </motion.div>
  );
};

export default EventCard;