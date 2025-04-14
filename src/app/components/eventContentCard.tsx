"use client";
import React from "react";

interface EventCardProps {
    _id: string;
    index: number;
    imageUrl: string;
    title: string;
    organizer: string;
    location: string;
    date: string;
    rsvp: {
      enabled: boolean;
      options: string[]; // e.g., ["Yes", "No", "Maybe"]
    };
    sponsorship?: {
      enabled: boolean;
      requests?: {
        companyName: string;
        contact: string;
      }[];
    };
    description?: string;
    contactInfo?: string;
    onClose: () => void;
    onEditClick: () => void;
    onDeleteClick: () => void;
    onDetailsClick: () => void;
  }

const EventCard: React.FC<EventCardProps> = ({
    title,
    organizer,
    location,
    date,
    onDetailsClick
}) => {
  return (
    <div className="card bg-[#1e2433] rounded-xl overflow-hidden hover:bg-[#242937] transition-all duration-200">
      <figure className="relative h-48">
        <div className="absolute inset-0 bg-gradient-to-t from-black/50 to-transparent"></div>
      </figure>

      <div className="card-body p-4">
        <h2 className="card-title text-lg font-semibold text-white mb-1">{title}</h2>
        <p className="text-sm text-gray-400 mb-3">
          {organizer} • {location}
        </p>
        <div className="flex flex-col gap-2 mt-auto">
          <button
            onClick={onDetailsClick}
            className="btn btn-sm btn-ghost bg-[#242937] hover:bg-[#2a3041] text-white rounded-lg w-full"
          >
            Details
          </button>
        </div>
      </div>
    </div>
  );
};

export default EventCard;