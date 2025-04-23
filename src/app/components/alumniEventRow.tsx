"use client";
import React from "react";

interface EventCardProps {
  title: string;
  organizer: string;
  location: string;
  date: string;
  description: string;
  imageUrl: string;
  onDetailsClick: () => void;
  onSponsorClick: () => void;
  onApplyClick: () => void;
}

const EventRow: React.FC<EventCardProps> = ({
  title,
  organizer,
  location,
  date,
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
          alt={`${title} event banner`}
          className="w-full h-40 object-cover rounded-box"
        />
      </figure> */}
      <div className="flex list-col-grow gap-6">
        <div className="flex-1">
          <h2 className="card-title list-col-wrap text-gray-900">{title}</h2>
          <p className="text-gray-800">
            {organizer} • {location} • {new Date(date).toLocaleDateString()}
          </p>
        </div>

        <div className="flex flex-row items-center card-actions">
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
            Respond
          </button>
        </div>
      </div>
    </li>
  );
};

export default EventRow;
