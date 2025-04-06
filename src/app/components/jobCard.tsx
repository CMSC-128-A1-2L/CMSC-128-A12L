"use client";
import React from "react";

interface JobListingCardProps {
  title: string;
  company: string;
  location: string;
  salary?: string;
  description: string;
  imageUrl: string;
  onApplyClick: () => void;
}

const JobListingCard: React.FC<JobListingCardProps> = ({
  title,
  company,
  location,
  salary,
  description,
  imageUrl,
  onApplyClick,
}) => {
  return (
    <div className="card bg-base-100 w-64 shadow-sm">
      <figure>
        <img
          src={imageUrl}
          alt={`${company} job banner`}
        />
      </figure>

      <div className="card-body">
        <h2 className="card-title">{title}</h2>
        <p>
          {company} • {location}
        </p>
        <div className="card-actions justify-end">
          <button
            onClick={onApplyClick}
            className="btn btn-primary btn-wide">
            Apply Now
          </button>
        </div>
      </div>



    </div>
  );
};

export default JobListingCard;
