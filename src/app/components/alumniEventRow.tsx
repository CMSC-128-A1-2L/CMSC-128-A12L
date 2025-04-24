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

        <div className="flex flex-row items-center card-actions gap-2">
          <button
            onClick={onDetailsClick}
            className="btn btn-ghost bg-[#2B3139] text-white rounded-lg w-24 shadow-md hover:shadow-lg transition-shadow"
          >
            Details
          </button>
          <button
            onClick={() => {
              onSponsorClick();
            }}
            className="btn btn-primary rounded-lg w-24"
          >
            Sponsor
          </button>
          <button
            onClick={(e) => {
              e.stopPropagation();
              onApplyClick();
            }}
            className="btn btn-primary rounded-lg w-24"
          >
            Respond
          </button>
        </div>
      </div>
    </li>
  );
};

export default EventRow;
