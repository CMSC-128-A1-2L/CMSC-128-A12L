"use client";
import React from "react";

interface JobCardProps {
  title: string;
  company: string;
  location: string;
  description: string;
  imageUrl: string;
  onDetailsClick: () => void;
  onApplyClick: () => void;
}

const JobCard: React.FC<JobCardProps> = ({
  title,
  company,
  location,
  description,
  imageUrl,
  onDetailsClick,
  onApplyClick,
}) => {
  return (
    <div className="cursor-pointer card bg-base-100 w-64 h-112 shadow-sm hover:shadow-lg transition-shadow">
      <figure>
        <img src={imageUrl} alt={`${company} job banner`} className="w-full h-40 object-cover" />
      </figure>

      <div className="card-body">
        <h2 className="card-title">{title}</h2>
        <p>
          {company} • {location}
        </p>
        <div className="card-actions justify-between mt-4">
          <button
            onClick={onDetailsClick}
            className="btn bg-[#0c0051] text-white hover:bg-[#12006A]"
          >
            Details
          </button>
          <button
            onClick={onApplyClick}
            className="btn btn-primary"
          >
            Apply
          </button>
        </div>
      </div>
    </div>
  );
};

export default JobCard;