"use client";
import React from "react";

interface EventCardProps {
  title: string;
  company: string;
  location: string;
  jobType: string;
  workType: string;
  description: string;
  imageUrl: string;
  onDetailsClick: () => void;
  onSponsorClick: () => void;
  onApplyClick: () => void;
}

const EventCard: React.FC<EventCardProps> = ({
  title,
  company,
  location,
  jobType,
  workType,
  description,
  imageUrl,
  onDetailsClick,
  onSponsorClick,
  onApplyClick,
}) => {
  return (
    <div className="card bg-white hover:bg-white rounded-xl overflow-hidden transition-all duration-200 h-[500px] shadow-lg">
      <figure className="relative h-48">
        <img 
          src={imageUrl} 
          alt={`${company} job banner`} 
          className="w-full h-full object-cover" 
        />
      </figure>

      <div className="card-body p-4 flex flex-col h-[calc(500px-12rem)]">
        <h2 className="card-title text-lg font-semibold text-gray-800 mb-1 line-clamp-2">{title}</h2>
        <p className="text-sm text-gray-600 mb-3 line-clamp-1">
          {company} • {location}
        </p>
        <div className="flex flex-col gap-2 mt-auto">
          <button
            onClick={onDetailsClick}
            className="btn btn-sm btn-ghost bg-gray-100 hover:bg-gray-200 text-gray-800 rounded-lg w-full"
          >
            Details
          </button>
          <button
            onClick={() => {
              onSponsorClick();
            }}
            className="btn btn-sm btn-primary rounded-lg w-full"
          >
            Sponsor
          </button>
          <button
            onClick={(e) => {
              e.stopPropagation();
              onApplyClick();
            }}
            className="btn btn-sm btn-primary rounded-lg w-full"
          >
            Apply
          </button>
        </div>
      </div>
    </div>
  );
};

export default EventCard;