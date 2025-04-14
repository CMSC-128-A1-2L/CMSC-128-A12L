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

const EventRow: React.FC<EventCardProps> = ({
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
          <h2 className="card-title list-col-wrap">{title}</h2>
          <p>
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
            className="btn btn-primary rounded-lg"
          >
            Apply
          </button>
        </div>
      </div>
    </li>
  );
};

export default EventRow;
