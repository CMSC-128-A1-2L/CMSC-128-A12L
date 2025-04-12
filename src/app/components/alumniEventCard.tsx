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
    <div className="card bg-[#1e2433] rounded-xl overflow-hidden hover:bg-[#242937] transition-all duration-200">
      <figure className="relative h-48">
        <img 
          src={imageUrl} 
          alt={`${company} job banner`} 
          className="w-full h-full object-cover" 
        />
        <div className="absolute inset-0 bg-gradient-to-t from-black/50 to-transparent"></div>
      </figure>

      <div className="card-body p-4">
        <h2 className="card-title text-lg font-semibold text-white mb-1">{title}</h2>
        <p className="text-sm text-gray-400 mb-3">
          {company} • {location}
        </p>
        <div className="flex flex-col gap-2 mt-auto">
          <button
            onClick={onDetailsClick}
            className="btn btn-sm btn-ghost bg-[#242937] hover:bg-[#2a3041] text-white rounded-lg w-full"
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