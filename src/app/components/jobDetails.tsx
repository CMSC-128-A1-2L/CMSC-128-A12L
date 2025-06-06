"use client";
import React, { useEffect } from "react";
import {
  Building2,
  MapPin,
  User2,
  FileText,
  X,
  Edit2,
  Trash2,
  Clock,
  Tags
} from "lucide-react";
import { motion } from "framer-motion";

interface JobDetailsProps {
  title: string;
  company: string;
  location: string;
  workMode: string;
  description: string;
  position: string;
  tags?: string[];
  isOpen: boolean;
  onClose: () => void;
  onApplyClick: () => void;
  onEditClick: () => void;
  onDeleteClick: () => void;
  canEdit?: boolean;
  isOwnJob?: boolean;
  jobId: string;
}

export default function JobDetails({
  title,
  company,
  location,
  workMode,
  description,
  position,
  tags,
  isOpen,
  onClose,
  onApplyClick,
  onEditClick,
  onDeleteClick,
  canEdit = false,
  isOwnJob = false,
  jobId,
}: JobDetailsProps) {
  useEffect(() => {
    const modal = document.getElementById("job_details_modal") as HTMLDialogElement;
    if (modal) {
      if (isOpen) {
        modal.showModal();
      } else {
        modal.close();
      }
    }
  }, [isOpen]);

  const handleClose = () => {
    const modal = document.getElementById("job_details_modal") as HTMLDialogElement;
    if (modal) {
      modal.close();
    }
    onClose();
  };

  return (
    <dialog id="job_details_modal" className="modal">
      <motion.div 
        initial={{ opacity: 0, y: 50 }}
        animate={{ opacity: 1, y: 0 }}
        exit={{ opacity: 0, y: 50 }}
        className="modal-box max-w-3xl bg-gradient-to-br from-[#1a1f4d]/90 to-[#2a3f8f]/90 text-white border border-white/10 p-0 rounded-xl overflow-hidden flex flex-col"
      >
        {/* Header */}
        <div className="relative h-32 bg-gradient-to-r from-blue-500/20 to-purple-500/20 p-6 flex-shrink-0">
          <button 
            onClick={handleClose}
            className="absolute right-4 top-4 p-2 hover:bg-black/20 rounded-full transition-colors"
          >
            <X size={20} />
          </button>
          <div className="absolute bottom-6">
            <h2 className="text-2xl font-bold">{title}</h2>
            <p className="text-white/80">{company}</p>
          </div>
        </div>

        {/* Scrollable Content */}
        <div className="flex-1 overflow-y-auto" style={{ maxHeight: "calc(80vh - 13rem)" }}>
          <div className="p-6 space-y-6">
            {/* Key Details */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="flex items-center gap-3 text-white/80">
                <Building2 size={20} className="flex-shrink-0" />
                <div className="overflow-hidden">
                  <p className="text-sm font-medium text-white">Company</p>
                  <p className="truncate">{company}</p>
                </div>
              </div>
              
              <div className="flex items-center gap-3 text-white/80">
                <MapPin size={20} className="flex-shrink-0" />
                <div className="overflow-hidden">
                  <p className="text-sm font-medium text-white">Location</p>
                  <p className="truncate">{location}</p>
                </div>
              </div>

              <div className="flex items-center gap-3 text-white/80">
                <User2 size={20} className="flex-shrink-0" />
                <div className="overflow-hidden">
                  <p className="text-sm font-medium text-white">Position</p>
                  <p className="truncate">{position}</p>
                </div>
              </div>

              <div className="flex items-center gap-3 text-white/80">
                <Clock size={20} className="flex-shrink-0" />
                <div className="overflow-hidden">
                  <p className="text-sm font-medium text-white">Work Mode</p>
                  <p className="truncate">{workMode}</p>
                </div>
              </div>
            </div>

            {/* Description */}
            <div className="space-y-2">
              <div className="flex items-center gap-2">
                <FileText size={20} className="flex-shrink-0" />
                <h3 className="text-lg font-medium">Description</h3>
              </div>
              <p className="text-white/80 whitespace-pre-wrap text-sm sm:text-base">{description}</p>
            </div>

            {/* Tags */}
            {tags && tags.length > 0 && (
              <div className="space-y-2">
                <div className="flex items-center gap-2">
                  <Tags size={20} className="flex-shrink-0" />
                  <h3 className="text-lg font-medium">Tags</h3>
                </div>
                <div className="flex flex-wrap gap-2">
                  {tags.map((tag, index) => (
                    <span 
                      key={index}
                      className="px-3 py-1 bg-white/5 rounded-full text-sm text-white/80"
                    >
                      {tag}
                    </span>
                  ))}
                </div>
              </div>
            )}
          </div>
        </div>

        {/* Actions */}
        <div className="border-t border-white/10 p-4 sm:p-6 flex flex-col sm:flex-row flex-wrap gap-3 justify-end bg-[#1a1f4d]/80 backdrop-blur-sm flex-shrink-0">
          <button
            onClick={handleClose}
            className="px-4 py-2 text-white/80 hover:text-white hover:bg-white/5 rounded-lg transition-colors cursor-pointer"
          >
            Close
          </button>
          {canEdit && (
            <>
              <button 
                onClick={onEditClick}
                className="px-4 py-2 bg-white/5 hover:bg-white/10 text-blue-200 rounded-lg transition-colors border border-blue-500/20 cursor-pointer"
              >
                <div className="flex items-center gap-2">
                  <Edit2 size={18} />
                  Edit
                </div>
              </button>
              <button 
                onClick={onDeleteClick}
                className="px-4 py-2 bg-white/5 hover:bg-white/10 text-red-200 rounded-lg transition-colors border border-red-500/20 cursor-pointer"
              >
                <div className="flex items-center gap-2">
                  <Trash2 size={18} />
                  Delete
                </div>
              </button>
            </>
          )}
          {!isOwnJob ? (
            <button
              onClick={onApplyClick}
              className="px-4 py-2 bg-blue-500/20 hover:bg-blue-500/30 text-blue-200 rounded-lg transition-colors border border-blue-500/20 cursor-pointer"
            >
              Apply Now
            </button>
          ) : (
            <button
              disabled
              className="px-4 py-2 bg-gray-500/20 text-gray-400 rounded-lg border border-gray-500/20 cursor-not-allowed"
              title="You cannot apply to your own job posting"
            >
              Apply Now
            </button>
          )}
        </div>
      </motion.div>

      {/* Keep the modal backdrop for clicking outside to close */}
      <form method="dialog" className="modal-backdrop">
        <button onClick={handleClose}>close</button>
      </form>
    </dialog>
  );
}
