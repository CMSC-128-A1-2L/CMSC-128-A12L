"use client";
import React from "react";
import { Calendar, MapPin, Users, Edit2, Trash2 } from "lucide-react";

interface EventCardProps {
  title: string;
  organizer: string;
  location: string;
  date: string;
  onDetailsClick: () => void;
  onEditClick?: () => void;
  onDeleteClick?: () => void;
}

const EventRow: React.FC<EventCardProps> = ({
  title,
  organizer,
  location,
  date,
  onDetailsClick,
  onEditClick,
  onDeleteClick,
}) => {
  return (
    <div className="card bg-white shadow-sm hover:shadow-md transition-all duration-200 rounded-lg overflow-hidden">
      <div className="card-body p-4">
        <div className="flex justify-between items-start gap-4">
          <div className="flex-1 min-w-0">
            <h2 className="card-title text-lg font-semibold text-gray-800 mb-2 truncate">{title}</h2>
            <div className="space-y-2">
              <div className="flex items-center gap-2 text-sm text-gray-600">
                <Users size={16} className="text-gray-400 flex-shrink-0" />
                <span className="truncate">{organizer}</span>
              </div>
              <div className="flex items-center gap-2 text-sm text-gray-600">
                <MapPin size={16} className="text-gray-400 flex-shrink-0" />
                <span className="truncate">{location}</span>
              </div>
              <div className="flex items-center gap-2 text-sm text-gray-600">
                <Calendar size={16} className="text-gray-400 flex-shrink-0" />
                <span className="truncate">{date}</span>
              </div>
            </div>
          </div>
          <div className="flex flex-col items-end gap-2 flex-shrink-0">
            <button
              onClick={onDetailsClick}
              className="btn btn-sm btn-primary w-full"
            >
              View Details
            </button>
            <div className="flex items-center gap-2">
              {onEditClick && (
                <button
                  onClick={onEditClick}
                  className="btn btn-sm btn-ghost"
                >
                  <Edit2 size={16} className="text-gray-600" />
                </button>
              )}
              {onDeleteClick && (
                <button
                  onClick={onDeleteClick}
                  className="btn btn-sm btn-ghost text-red-500 hover:text-red-600"
                >
                  <Trash2 size={16} />
                </button>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default EventRow;
