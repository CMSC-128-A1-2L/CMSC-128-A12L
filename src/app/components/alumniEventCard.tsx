"use client";
import React from "react";
import { Calendar, MapPin, Users, Image as ImageIcon } from "lucide-react";
import { motion } from "framer-motion";

interface EventCardProps {
  title: string;
  organizer: string;
  location: string;
  date: Date;
  description: string;
  imageUrl: string;
  onDetailsClick: () => void;
  onSponsorClick: () => void;
  onApplyClick: () => void;
}

const DefaultEventBanner = ({ title }: { title: string }) => (
  <div className="relative h-full bg-gradient-to-br from-blue-500/20 to-purple-500/20 flex items-center justify-center p-4">
    <div className="text-center">
      <ImageIcon className="w-12 h-12 mx-auto mb-2 text-white/40" />
      <h3 className="text-xl font-bold text-white/80 line-clamp-2">{title}</h3>
    </div>
    <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent" />
  </div>
);

const EventCard: React.FC<EventCardProps> = ({
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
      whileHover={{ y: -5 }}
      transition={{ type: "spring", stiffness: 400, damping: 10 }}
      className="bg-white/5 backdrop-blur-sm rounded-xl overflow-hidden border border-white/10 hover:border-white/20 transition-all duration-300 h-full flex flex-col"
    >
      {/* Image Section */}
      <div className="relative h-48">
        {imageUrl ? (
          <>
            <img 
              src={imageUrl} 
              alt={`${title} event banner`} 
              className="w-full h-full object-cover" 
            />
            <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent" />
          </>
        ) : (
          <DefaultEventBanner title={title} />
        )}
      </div>

      {/* Content Section */}
      <div className="p-4 flex flex-col flex-grow">
        <h2 className="text-lg font-semibold text-white mb-2 line-clamp-2">{title}</h2>
        
        <div className="space-y-2 mb-4">
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

        <p className="text-sm text-gray-400 mb-4 line-clamp-2 flex-grow">{description}</p>

        {/* Action Buttons */}
        <div className="flex flex-col gap-2 mt-auto">
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
    </motion.div>
  );
};

export default EventCard;