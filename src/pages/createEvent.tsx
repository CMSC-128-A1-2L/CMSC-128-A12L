"use client";
import { useState } from "react";

export default function CreateEvent({ onClose }: { onClose: () => void }) {
  const [sponsorship, setSponsorship] = useState(false);

  return (
    <dialog id="create_event_modal" className="modal">
      <div className="modal-box rounded-3xl bg-white max-w-lg">
        <form method="dialog">
          <button className="btn btn-sm btn-circle btn-ghost absolute right-2 top-2 text-gray-600 hover:bg-[#605dff] hover:text-white">
            ✕
          </button>
        </form>

        <h3 className="font-bold text-xl text-gray-900 mt-4">Create new event</h3>

        <form className="space-y-4 mt-6">
          {/* Event Title */}
          <div>
            <p className="font-bold text-left text-gray-800">Event title*</p>
            <input 
              type="text" 
              className="w-full p-2 border border-gray-300 rounded-md bg-white text-gray-800 focus:border-[#605dff] focus:ring-1 focus:ring-[#605dff]" 
              required 
            />
          </div>

          {/* Date and Time */}
          <div className="grid grid-cols-2 gap-4">
            <div>
              <p className="font-bold text-left text-gray-800">Date*</p>
              <input 
                type="date" 
                className="w-full p-2 border border-gray-300 rounded-md bg-white text-gray-800 focus:border-[#605dff] focus:ring-1 focus:ring-[#605dff] [color-scheme:light]" 
                required 
              />
            </div>
            <div>
              <p className="font-bold text-left text-gray-800">Time*</p>
              <input 
                type="time" 
                className="w-full p-2 border border-gray-300 rounded-md bg-white text-gray-800 focus:border-[#605dff] focus:ring-1 focus:ring-[#605dff] [color-scheme:light]" 
                required 
              />
            </div>
          </div>

          {/* Location */}
          <div>
            <p className="font-bold text-left text-gray-800">Location*</p>
            <input 
              type="text" 
              className="w-full p-2 border border-gray-300 rounded-md bg-white text-gray-800 focus:border-[#605dff] focus:ring-1 focus:ring-[#605dff]" 
              required 
            />
          </div>

          {/* Max Participant Count */}
          <div>
            <p className="font-bold text-left text-gray-800">Maximum Participant Count*</p>
            <input 
              type="number" 
              min="0"
              className="w-full p-2 border border-gray-300 rounded-md bg-white text-gray-800 focus:border-[#605dff] focus:ring-1 focus:ring-[#605dff]" 
              required 
            />
          </div>

          {/* Sponsorship Toggle */}
          <div className="flex items-center justify-between">
            <p className="font-bold text-left text-gray-800">Sponsorship Requests</p>
            <input
              type="checkbox"
              checked={sponsorship}
              onChange={() => setSponsorship(!sponsorship)}
              className="checkbox checkbox-primary"
            />
          </div>

          {/* Contact Info */}
          <div>
            <p className="font-bold text-left text-gray-800">Contact information</p>
            <input 
              type="text" 
              className="w-full p-2 border border-gray-300 rounded-md bg-white text-gray-800 focus:border-[#605dff] focus:ring-1 focus:ring-[#605dff]" 
            />
          </div>

          {/* Description */}
          <div>
            <p className="font-bold text-left text-gray-800">Description</p>
            <textarea 
              rows={4} 
              className="w-full p-2 border border-gray-300 rounded-md bg-white text-gray-800 focus:border-[#605dff] focus:ring-1 focus:ring-[#605dff] resize-none" 
            />
          </div>

          {/* Submit Button */}
          <button
            type="submit"
            className="btn btn-primary btn-block mt-6"
          >
            Post
          </button>
        </form>
      </div>
      <form method="dialog" className="modal-backdrop">
        <button onClick={onClose}>close</button>
      </form>
    </dialog>
  );
}
