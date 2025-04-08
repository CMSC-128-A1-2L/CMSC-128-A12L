"use client";
import { useState } from "react";
import { Calendar, Clock, X } from "lucide-react";

export default function EditEventModal() {
  const [isOpen, setIsOpen] = useState(true);

  const [eventTitle, setEventTitle] = useState("");
  const [date, setDate] = useState("");
  const [time, setTime] = useState("");
  const [location, setLocation] = useState("");
  const [maxParticipants, setMaxParticipants] = useState("");
  const [sponsorship, setSponsorship] = useState(false);
  const [contactInfo, setContactInfo] = useState("");
  const [description, setDescription] = useState("");

  const [errors, setErrors] = useState({
    eventTitle: "",
    date: "",
    time: "",
    location: "",
    maxParticipants: "",
  });

  const handleSubmit = () => {
    const newErrors = {
      eventTitle: eventTitle ? "" : "Event title is required.",
      date: date ? "" : "Date is required.",
      time: time ? "" : "Time is required.",
      location: location ? "" : "Location is required.",
      maxParticipants: maxParticipants ? "" : "Maximum participants is required.",
    };

    setErrors(newErrors);

    const hasErrors = Object.values(newErrors).some((e) => e !== "");
    if (hasErrors) return;

    const eventData = {
      title: eventTitle,
      date,
      time,
      location,
      maxParticipants,
      sponsorship,
      contactInfo,
      description,
    };

    console.log("Saved Event:", eventData);
    setIsOpen(false);
  };

  return (
    <div className="flex items-center justify-center min-h-screen bg-black bg-opacity-60">
      {isOpen && (
        <div className="relative bg-white text-[#0c0051] rounded-2xl p-6 w-11/12 max-w-md shadow-lg">
          {/* Close Button */}
          <button onClick={() => setIsOpen(false)} className="absolute top-4 right-4 text-2xl font-light">
            <X size={20} />
          </button>

          {/* Modal Title */}
          <h2 className="text-xl font-bold text-center" style={{ fontFamily: "Montserrat, sans-serif" }}>
            Edit Event
          </h2>

          {/* Form Fields */}
          <div className="mt-4 space-y-3" style={{ fontFamily: "Montserrat, sans-serif" }}>
            <label>Event title*:</label>
            <input
              type="text"
              className="w-full p-2 rounded-md bg-[#0c0051] text-white"
              value={eventTitle}
              onChange={(e) => setEventTitle(e.target.value)}
            />
            {errors.eventTitle && <p className="text-red-500 text-sm">{errors.eventTitle}</p>}

            <div className="flex gap-2">
              <div className="flex-1">
                <label>Date*:</label>
                <div className="flex items-center p-2 bg-[#0c0051] text-white rounded-md">
                  <Calendar className="mr-2" size={16} />
                  <input
                    type="date"
                    className="bg-transparent outline-none flex-1"
                    value={date}
                    onChange={(e) => setDate(e.target.value)}
                  />
                </div>
                {errors.date && <p className="text-red-500 text-sm">{errors.date}</p>}
              </div>

              <div className="flex-1">
                <label>Time*:</label>
                <div className="flex items-center p-2 bg-[#0c0051] text-white rounded-md">
                  <Clock className="mr-2" size={16} />
                  <input
                    type="time"
                    className="bg-transparent outline-none flex-1"
                    value={time}
                    onChange={(e) => setTime(e.target.value)}
                  />
                </div>
                {errors.time && <p className="text-red-500 text-sm">{errors.time}</p>}
              </div>
            </div>

            <label>Location*:</label>
            <input
              type="text"
              className="w-full p-2 rounded-md bg-[#0c0051] text-white"
              value={location}
              onChange={(e) => setLocation(e.target.value)}
            />
            {errors.location && <p className="text-red-500 text-sm">{errors.location}</p>}

            <label>Maximum Participant Count*:</label>
            <input
              type="number"
              className="w-full p-2 rounded-md bg-[#0c0051] text-white"
              value={maxParticipants}
              onChange={(e) => setMaxParticipants(e.target.value)}
            />
            {errors.maxParticipants && <p className="text-red-500 text-sm">{errors.maxParticipants}</p>}

            <label className="flex justify-between items-center">
              Sponsorship Requests
              <div className="relative inline-block w-10 align-middle select-none transition duration-200 ease-in">
                <input
                  type="checkbox"
                  checked={sponsorship}
                  onChange={() => setSponsorship(!sponsorship)}
                  className="sr-only peer"
                />
                <div className="w-10 h-5 bg-white border-2 border-[#0c0051] rounded-full peer-checked:bg-[#0c0051]"></div>
                <div className="absolute top-0.5 left-0.5 w-4 h-4 bg-[#0c0051] rounded-full transition-transform duration-200 transform peer-checked:translate-x-5 peer-checked:bg-white"></div>
              </div>
            </label>

            <label>Contact information:</label>
            <input
              type="text"
              className="w-full p-2 rounded-md bg-[#0c0051] text-white"
              value={contactInfo}
              onChange={(e) => setContactInfo(e.target.value)}
            />

            <label>Description:</label>
            <textarea
              className="w-full p-2 rounded-md bg-[#0c0051] text-white h-24"
              value={description}
              onChange={(e) => setDescription(e.target.value)}
            ></textarea>

            {/* Post Button */}
            <button
              onClick={handleSubmit}
              className="w-full bg-[#0c0051] text-white mt-4 py-2 rounded-md text-sm font-light"
            >
              Post
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
