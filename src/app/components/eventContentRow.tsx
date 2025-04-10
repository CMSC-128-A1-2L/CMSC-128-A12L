"use client";
import React from "react";

interface EventCardProps {
  title: string;
  organizer: string;
  location: string;
  date: string;
  onDetailsClick: () => void;
}

const EventRow: React.FC<EventCardProps> = ({
  title,
  organizer,
  location,
  date,
  onDetailsClick,
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
            {organizer} • {location}
          </p>
        </div>

        <div className="flex flex-row  items-center card-actions">
          <button
            onClick={onDetailsClick}
            className="btn btn-soft rounded-lg"
          >
            Details
          </button>
          
        </div>
      </div>
    </li>
  );
};

export default EventRow;
