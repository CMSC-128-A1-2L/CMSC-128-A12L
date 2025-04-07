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
    <div className="card rounded-xl border border-gray-200 w-72 h-128 hover:shadow-md transition-shadow">
      <figure>
        <img src={imageUrl} alt={`${company} job banner`} className="w-full h-40 object-cover" />
      </figure>

      <div className="card-body">
        <h2 className="card-title">{title}</h2>
        <p>
          {company} • {location}
        </p>
        <div className="card-actions mt-4">
          <button
            onClick={onDetailsClick}
            className="btn btn-soft btn-wide rounded-lg"
          >
            Details
          </button>
          <button
            onClick={(e) => {
              e.stopPropagation();
              onApplyClick();
            }}
            className="btn btn-primary btn-wide rounded-lg "
          >
            Apply
          </button>
        </div>
      </div>
    </div>
  );
};

export default JobCard;