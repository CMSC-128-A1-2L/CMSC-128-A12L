"use client";
import React from "react";
import { Calendar, MapPin, Users } from "lucide-react";

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
    <div className="card bg-white shadow-sm hover:shadow-md transition-all duration-200 rounded-lg overflow-hidden">
      <div className="card-body p-4">
        <div className="flex items-start justify-between gap-4">
          <div className="flex-1">
            <h2 className="card-title text-lg font-semibold text-gray-800 mb-2">{title}</h2>
            <div className="space-y-2">
              <div className="flex items-center gap-2 text-sm text-gray-600">
                <Users size={16} className="text-gray-400" />
                <span>{organizer}</span>
              </div>
              <div className="flex items-center gap-2 text-sm text-gray-600">
                <MapPin size={16} className="text-gray-400" />
                <span>{location}</span>
              </div>
              <div className="flex items-center gap-2 text-sm text-gray-600">
                <Calendar size={16} className="text-gray-400" />
                <span>{date}</span>
              </div>
            </div>
          </div>
        </div>
        <div className="card-actions justify-end mt-4">
          <button
            onClick={onDetailsClick}
            className="btn btn-sm btn-primary"
          >
            View Details
          </button>
        </div>
      </div>
    </div>
  );
};

export default EventCard;