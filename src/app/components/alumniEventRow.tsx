"use client";
import React from "react";
import { Calendar, MapPin, Users } from "lucide-react";
import { motion } from "framer-motion";

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
    <motion.div
      whileHover={{ x: 5 }}
      transition={{ type: "spring", stiffness: 400, damping: 10 }}
      className="bg-white/5 backdrop-blur-sm rounded-xl overflow-hidden border border-white/10 hover:border-white/20 transition-all duration-300"
    >
      <div className="flex flex-col md:flex-row gap-4 p-4">
        {/* Image Section */}
        <div className="relative w-full md:w-48 h-32 flex-shrink-0">
          <img
            src={imageUrl}
            alt={`${title} event banner`}
            className="w-full h-full object-cover rounded-lg"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent rounded-lg" />
        </div>

        {/* Content Section */}
        <div className="flex-1 flex flex-col">
          <div className="flex-1">
            <h2 className="text-lg font-semibold text-white mb-2">{title}</h2>
            
            <div className="space-y-2 mb-2">
              <div className="flex items-center gap-2 text-sm text-gray-300">
                <Users size={16} className="text-gray-400" />
                <span>{organizer}</span>
              </div>
              <div className="flex items-center gap-2 text-sm text-gray-300">
                <MapPin size={16} className="text-gray-400" />
                <span>{location}</span>
              </div>
              <div className="flex items-center gap-2 text-sm text-gray-300">
                <Calendar size={16} className="text-gray-400" />
                <span>{new Date(date).toLocaleDateString()}</span>
              </div>
            </div>

            <p className="text-sm text-gray-400 line-clamp-2">{description}</p>
          </div>

          {/* Action Buttons */}
          <div className="flex flex-wrap gap-2 mt-4">
            <button
              onClick={onDetailsClick}
              className="px-4 py-2 bg-white/5 hover:bg-white/10 text-white rounded-lg transition-colors border border-white/10"
            >
              Details
            </button>
            <button
              onClick={onSponsorClick}
              className="px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg transition-colors"
            >
              Sponsor
            </button>
            <button
              onClick={(e) => {
                e.stopPropagation();
                onApplyClick();
              }}
              className="px-4 py-2 bg-green-600 hover:bg-green-700 text-white rounded-lg transition-colors"
            >
              Respond
            </button>
          </div>
        </div>
      </div>
    </motion.div>
  );
};

export default EventRow;
