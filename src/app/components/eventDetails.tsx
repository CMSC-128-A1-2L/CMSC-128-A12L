"use client";
import React from "react";
import {
  Trash2,
  Calendar,
  MapPin,
  Users,
  Building
} from "lucide-react";

interface EventDetailsProps {
  title: string;
  organizer: string;
  location: string;
  date: string;
  description: string;
  isOpen: boolean;
  onClose: () => void;
  onRSVPClick: () => void;
  onEditClick: () => void;
  onDeleteClick: () => void;
}

const EventDetails: React.FC<EventDetailsProps> = ({
  title,
  organizer,
  location,
  date,
  description,
  isOpen,
  onClose,
  onRSVPClick,
  onEditClick,
  onDeleteClick,
}) => {
  // Format the date
  const formattedDate = new Date(date).toLocaleDateString('en-US', {
    weekday: 'long',
    year: 'numeric',
    month: 'long',
    day: 'numeric',
    hour: '2-digit',
    minute: '2-digit'
  });

  return (
    <dialog id="job_details_modal" className="modal">
      <div className="modal-box rounded-3xl bg-white">
        <form method="dialog">
          <button className="btn btn-sm btn-circle btn-ghost absolute right-2 top-2 text-gray-600 hover:bg-[#605dff] hover:text-white">
            ✕
          </button>
        </form>

        <h3 className="font-bold text-xl text-gray-900 mt-4">{title}</h3>

        <div className="pt-4">
          <p className="font-bold text-left text-gray-800">Date & Time</p>
          <p className="px-2 pb-2 text-gray-700">{formattedDate}</p>

          <p className="font-bold text-left text-gray-800">Organizer</p>
          <p className="px-2 pb-2 text-gray-700">{organizer}</p>

          <p className="font-bold text-left text-gray-800">Location</p>
          <p className="px-2 pb-2 text-gray-700">{location}</p>

          <p className="font-bold text-left text-gray-800">Description</p>
          <p className="px-2 pb-2 text-gray-700 whitespace-pre-wrap">{description}</p>

          <div className="flex flex-row gap-2 mt-4">
            <button onClick={onEditClick} className="btn btn-dash flex-grow bg-gray-100 hover:bg-gray-200 text-gray-800">
              Edit
            </button>
            <button onClick={onDeleteClick} className="btn btn-dash btn-error btn-sqr">
              <Trash2 />
            </button>
          </div>
          <button
            onClick={onRSVPClick}
            className="btn btn-primary btn-block mt-2"
          >
            RSVP Now
          </button>
        </div>
      </div>
      <form method="dialog" className="modal-backdrop">
        <button onClick={onClose}>close</button>
      </form>
    </dialog>
  );
};

export default EventDetails;
