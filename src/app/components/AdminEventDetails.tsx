import React, { useState } from "react";
import { Trash2, Edit2, Calendar, MapPin, Users, Mail, Info, Handshake, X, Clock } from "lucide-react";
import CustomModal from "./eventSponsorshipRequestDisplay";
import { motion } from "framer-motion";
import { Event } from "@/entities/event";

interface EventDetailsProps extends Omit<Event, '_id'> {
  _id: string;
  isOpen: boolean;
  onClose: () => void;
  onEditClick: () => void;
  onDeleteClick: () => void;
}

const EventDetails: React.FC<EventDetailsProps> = ({
  _id,
  name,
  description,
  type,
  startDate,
  endDate,
  location,
  imageUrl,
  wouldGo,
  wouldNotGo,
  wouldMaybeGo,
  isOpen,
  onClose,
  onEditClick,
  onDeleteClick,
}) => {
  const [isSponsorModalOpen, setSponsorModalOpen] = useState(false);

  const handleCloseDetails = () => {
    onClose();
  };


  const handleSponsorClose = () => {
    setSponsorModalOpen(false);
  };

  const formatDate = (date: Date) => {
    return new Date(date).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  if (!isOpen) return null;

  return (
    <>
      <div className="fixed inset-0 bg-gray-900/50 backdrop-blur-sm flex items-center justify-center p-4 z-50">
        <motion.div
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          exit={{ opacity: 0, scale: 0.9 }}
          className="bg-gray-50 rounded-lg p-6 w-full max-w-2xl max-h-[90vh] overflow-y-auto shadow-xl border border-gray-200"
        >
          <div className="flex justify-between items-center mb-6">
            <h2 className="text-2xl font-bold text-gray-800">Event Details</h2>
            <button
              onClick={handleCloseDetails}
              className="btn btn-circle bg-gray-100 hover:bg-gray-300 transition-colors duration-200"
            >
              <X size={24} className="text-black" />
            </button>
          </div>

          <div className="space-y-6">
            {imageUrl && (
              <div className="w-full aspect-video rounded-lg overflow-hidden bg-gray-100">
                <img src={imageUrl} alt={name} className="w-full h-full object-cover" />
              </div>
            )}

            <div>
              <h3 className="text-2xl font-bold text-gray-800 mb-2">{name}</h3>
              <div className="flex items-center gap-2 text-sm text-gray-600">
                <Calendar size={16} className="text-gray-500" />
                <span>{formatDate(startDate)}</span>
              </div>
              {startDate !== endDate && (
                <div className="flex items-center gap-2 text-sm text-gray-600 mt-1">
                  <Clock size={16} className="text-gray-500" />
                  <span>Until {formatDate(endDate)}</span>
                </div>
              )}
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <div className="flex items-center gap-2 text-sm text-gray-700">
                  <Info size={16} className="text-gray-500" />
                  <span className="font-medium">Type:</span>
                  <span className="capitalize">{type}</span>
                </div>
                <div className="flex items-center gap-2 text-sm text-gray-700">
                  <MapPin size={16} className="text-gray-500" />
                  <span className="font-medium">Location:</span>
                  <span>{location}</span>
                </div>
                <div className="flex items-center gap-2 text-sm text-gray-700">
                  <Users size={16} className="text-gray-500" />
                  <span className="font-medium">Interest:</span>
                  <span>{wouldGo.length} Going • {wouldMaybeGo.length} Maybe • {wouldNotGo.length} Not Going</span>
                </div>
              </div>
            </div>

            {description && (
              <div className="space-y-2">
                <div className="flex items-center gap-2 text-sm text-gray-700">
                  <Info size={16} className="text-gray-500" />
                  <span className="font-medium">Description:</span>
                </div>
                <p className="text-sm text-gray-600 pl-6">{description}</p>
              </div>
            )}

            <div className="space-y-4">
              <div className="flex justify-end gap-2">
                <button onClick={onEditClick} className="btn btn-primary gap-2 bg-blue-600 hover:bg-blue-700">
                  <Edit2 size={16} />
                  Edit
                </button>
                <button onClick={onDeleteClick} className="btn btn-error gap-2">
                  <Trash2 size={16} />
                  Delete
                </button>
              </div>
            </div>
          </div>
        </motion.div>
      </div>

      {isSponsorModalOpen && (
        <CustomModal
          modalId="custom_modal"
          title="Sponsorship Request"
          isOpen={isSponsorModalOpen}
          onClose={handleSponsorClose}
          onSubmit={() => {
            handleSponsorClose();
            onClose();
          }}
          eventName={name}
        />
      )}
    </>
  );
};

export default EventDetails;