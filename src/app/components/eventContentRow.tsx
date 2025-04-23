"use client";
import React from "react";
import { Calendar, MapPin, Users } from "lucide-react";

interface EventCardProps {
  title: string;
  organizer: string;
  location: string;
  date: string;
  onDetailsClick: () => void;
}

const EventRow: React.FC<EventCardProps> = ({
  title,
  organizer,
  location,
  date,
  onDetailsClick,
}) => {
  return (
    <div className="card bg-white shadow-sm hover:shadow-md transition-all duration-200 rounded-lg overflow-hidden">
      <div className="card-body p-4">
        <div className="flex items-center justify-between gap-4">
          <div className="flex-1">
            <h2 className="card-title text-lg font-semibold text-gray-800 mb-2">{title}</h2>
            <div className="flex items-center gap-4">
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
          <div className="card-actions">
            <button
              onClick={onDetailsClick}
              className="btn btn-sm btn-primary"
            >
              View Details
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default EventRow;
