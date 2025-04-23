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

const JobRow: React.FC<JobCardProps> = ({
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
    <li className="list-row">
      {/* <figure>
        <img
          src={imageUrl}
          alt={`${company} job banner`}
          className="w-full h-40 object-cover rounded-box"
        />
      </figure> */}
      <div className="flex list-col-grow gap-6">
        <div className="flex-1">
          <h2 className="card-title list-col-wrap text-gray-900">{title}</h2>
          <p className="text-gray-800">
            {company} • {location}
          </p>
        </div>

        <div className="flex flex-row  items-center card-actions">
          <button
            onClick={onDetailsClick}
            className="btn btn-soft rounded-lg"
          >
            Details
          </button>
          <button
            onClick={(e) => {
              e.stopPropagation();
              onApplyClick();
            }}
            className="btn btn-primary rounded-lg"
          >
            Apply
          </button>
        </div>
      </div>
    </li>
  );
};

export default JobRow;
