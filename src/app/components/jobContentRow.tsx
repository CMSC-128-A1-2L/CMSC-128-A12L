"use client";
import React from "react";
import { Building2, MapPin, Briefcase, Clock, Image as ImageIcon } from "lucide-react";
import { motion } from "framer-motion";

interface JobCardProps {
  title: string;
  company: string;
  position: string;
  location: string;
  description: string;
  workMode: string;
  tags: string[];
  imageUrl?: string;
  onDetailsClick: () => void;
  onApplyClick: () => void;
  isOwnJob?: boolean;
}

const DefaultJobBanner = ({ title }: { title: string }) => (
  <div className="relative h-full bg-gradient-to-br from-blue-500/20 to-purple-500/20 flex items-center justify-center p-4">
    <div className="text-center">
      <ImageIcon className="w-8 h-8 mx-auto mb-1 text-white/40" />
      <h3 className="text-sm font-bold text-white/80 line-clamp-2">{title}</h3>
    </div>
    <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent" />
  </div>
);

const JobRow: React.FC<JobCardProps> = ({
  title,
  company,
  position,
  location,
  description,
  workMode,
  tags,
  imageUrl = "/default-job-banner.jpg",
  onDetailsClick,
  onApplyClick,
  isOwnJob = false,
}) => {
  return (
    <motion.div
      whileHover={{ x: 5 }}
      transition={{ type: "spring", stiffness: 400, damping: 10 }}
      className="bg-white/5 backdrop-blur-sm rounded-xl overflow-hidden border border-white/10 hover:border-white/20 transition-all duration-300"
    >
      <div className="flex flex-col md:flex-row gap-4 p-4">
        {/* Image Section */}
        <div className="relative w-full md:w-48 h-32 flex-shrink-0 rounded-lg overflow-hidden">
          {imageUrl ? (
            <>
              <img
                src={imageUrl}
                alt={`${title} job banner`}
                className="w-full h-full object-cover"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent" />
            </>
          ) : (
            <DefaultJobBanner title={title} />
          )}
        </div>

        {/* Content Section */}
        <div className="flex-1">
          <h2 className="text-lg font-semibold text-white mb-2">{title}</h2>
          
          <div className="space-y-2 mb-2">
            <div className="flex items-center gap-2 text-sm text-gray-300">
              <Building2 size={16} className="text-gray-400" />
              <span>{company}</span>
            </div>
            <div className="flex items-center gap-2 text-sm text-gray-300">
              <Briefcase size={16} className="text-gray-400" />
              <span>{position}</span>
            </div>
            <div className="flex items-center gap-2 text-sm text-gray-300">
              <MapPin size={16} className="text-gray-400" />
              <span>{location}</span>
            </div>
            <div className="flex items-center gap-2 text-sm text-gray-300">
              <Clock size={16} className="text-gray-400" />
              <span>{workMode}</span>
            </div>
          </div>

          <p className="text-sm text-gray-400 line-clamp-2 mb-4">{description}</p>

          {/* Tags */}
          {tags && tags.length > 0 && (
            <div className="flex flex-wrap gap-2 mb-4">
              {tags.map((tag, index) => (
                <span 
                  key={index}
                  className="px-2 py-1 bg-white/5 rounded-full text-xs text-gray-300"
                >
                  {tag}
                </span>
              ))}
            </div>
          )}

          {/* Action Buttons */}
          <div className="flex flex-wrap gap-2">
            <button
              onClick={onDetailsClick}
              className="px-4 py-2 bg-white/5 hover:bg-white/10 text-white rounded-lg transition-colors border border-white/10"
            >
              Details
            </button>
            {!isOwnJob ? (
              <button
                onClick={(e) => {
                  e.stopPropagation();
                  onApplyClick();
                }}
                className="px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg transition-colors"
              >
                Apply
              </button>
            ) : (
              <button
                disabled
                className="px-4 py-2 bg-gray-500/20 text-gray-400 rounded-lg border border-gray-500/20 cursor-not-allowed"
                title="You cannot apply to your own job posting"
              >
                Apply
              </button>
            )}
          </div>
        </div>
      </div>
    </motion.div>
  );
};

export default JobRow;
