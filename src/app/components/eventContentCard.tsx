"use client";
import React from "react";
import { Calendar, MapPin, Users, Edit2, Trash2, Loader2 } from "lucide-react";

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
    isProcessing?: boolean;
  }

const EventCard: React.FC<EventCardProps> = ({
    title,
    organizer,
    location,
    date,
    imageUrl,
    onDetailsClick,
    onEditClick,
    onDeleteClick,
    isProcessing
}) => {
  return (
    <div className="card bg-white shadow-sm hover:shadow-md transition-all duration-200 rounded-lg overflow-hidden h-[280px]">
      {/* Image Section */}
      <div className="relative h-32 overflow-hidden">
        {imageUrl ? (
          <>
            <img
              src={imageUrl}
              alt={title}
              className="w-full h-full object-cover"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-black/30 to-transparent" />
          </>
        ) : (
          <div className="w-full h-full bg-gradient-to-br from-blue-500/20 to-purple-500/20 flex items-center justify-center">
            <Calendar className="h-12 w-12 text-gray-400" />
          </div>
        )}
      </div>

      {/* Content Section */}
      <div className="card-body p-4">
        <div className="flex flex-col h-full">
          <div className="flex-1 min-h-0">
            <h2 className="card-title text-lg font-semibold text-gray-800 mb-2 line-clamp-1">{title}</h2>
            <div className="space-y-1">
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

          {/* Actions */}
          <div className="flex items-center justify-between gap-2 mt-2">
            <button
              onClick={onDetailsClick}
              className="btn btn-sm btn-primary"
            >
              View Details
            </button>
            <div className="flex items-center gap-2">
              <button
                onClick={onEditClick}
                className="btn btn-sm btn-ghost"
                disabled={isProcessing}
              >
                <Edit2 size={16} className="text-gray-600" />
              </button>
              <button
                onClick={onDeleteClick}
                className="btn btn-sm btn-ghost text-red-500 hover:text-red-600"
                disabled={isProcessing}
              >
                {isProcessing ? <Loader2 className="h-4 w-4 animate-spin" /> : <Trash2 size={16} />}
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default EventCard;