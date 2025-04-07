"use client";
import { useState } from "react";

export default function CreateEvent({ onClose }: { onClose: () => void }) {
  const [sponsorship, setSponsorship] = useState(false);

  return (
    <div className="fixed inset-0 flex items-center justify-center bg-gray-800 bg-opacity-50 z-50">
      <div className="bg-gray-100 p-6 rounded-lg shadow-lg w-full max-w-lg relative">
        <button
          onClick={onClose}
          className="absolute top-2 right-3 text-xl font-bold"
        >
          ✕
        </button>
        <h2 className="text-xl mb-4 text-center font-semibold">Create new event</h2>
        <form className="space-y-4">
          {/* Event Title */}
          <label className="font-bold">Event title*:</label>
          <input type="text" className="w-full border rounded p-2 bg-gray-300" />

          {/* Date and Time */}
          <div className="flex space-x-2">
            <div className="w-1/2">
              <label className="font-bold">Date*:</label>
              <input type="date" className="w-full border rounded p-2 bg-gray-300" />
            </div>
            <div className="w-1/2">
              <label className="font-bold">Time*:</label>
              <input type="time" className="w-full border rounded p-2 bg-gray-300" />
            </div>
          </div>

          {/* Location */}
          <label className="font-bold">Location*:</label>
          <input type="text" className="w-full border rounded p-2 bg-gray-300" />

          {/* Max Participant Count */}
          <label className="font-bold">Maximum Participant Count*:</label>
          <input type="number" className="w-full border rounded p-2 bg-gray-300" />

          {/* Sponsorship Toggle */}
          <div className="flex items-center justify-between">
            <label className="font-bold">Sponsorship Requests</label>
            <input
              type="checkbox"
              checked={sponsorship}
              onChange={() => setSponsorship(!sponsorship)}
              className="w-5 h-5"
            />
          </div>

          {/* Contact Info */}
          <label className="font-bold">Contact information:</label>
          <input type="text" className="w-full border rounded p-2 bg-gray-300" />

          {/* Description */}
          <label className="font-bold">Description:</label>
          <textarea rows={4} className="w-full border rounded p-2 bg-gray-300" />

          {/* Submit Button */}
          <button
            type="submit"
            className="bg-gray-400 text-white px-4 py-2 rounded mx-auto block"
          >
            Post
          </button>
        </form>
      </div>
    </div>
  );
}
