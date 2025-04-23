"use client";
import React from "react";

interface JobCardProps {
  title: string;
  company: string;
  location: string;
  jobType: string;
  workType: string;
  description: string;
  imageUrl: string;
  onDetailsClick: () => void;
  onApplyClick: () => void;
}

const JobCard: React.FC<JobCardProps> = ({
  title,
  company,
  location,
  jobType,
  workType,
  description,
  imageUrl,
  onDetailsClick,
  onApplyClick,
}) => {
  return (
    <div className="card bg-white rounded-xl overflow-hidden transition-all duration-200 h-[450px] shadow-lg">
      <figure className="relative h-48">
        <img 
          src={imageUrl} 
          alt={`${company} job banner`} 
          className="w-full h-full object-cover" 
        />
        <div className="absolute inset-0 bg-gradient-to-t from-black/50 to-transparent"></div>
      </figure>

      <div className="card-body p-4 flex flex-col h-[calc(450px-12rem)]">
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

export default JobCard;