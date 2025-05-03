"use client";
import React, { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { toast } from "react-hot-toast";
import { X, DollarSign, Target } from "lucide-react";
import CustomModal from "./eventSponsorshipRequestDisplay";

interface SponsorDetailsProps {
  onClose: () => void;
  eventId: string;
  eventName: string;
  isOpen: boolean;
}

const SponsorDetails: React.FC<SponsorDetailsProps> = ({ onClose, eventId, eventName, isOpen }) => {
  const [showRequestForm, setShowRequestForm] = useState(false);
  const [sponsorshipStatus, setSponsorshipStatus] = useState<{
    currentAmount: number;
    goal: number;
    isActive: boolean;
  }>({ currentAmount: 0, goal: 0, isActive: false });

  useEffect(() => {
    if (isOpen) {
      fetchSponsorshipStatus();
    }
  }, [isOpen, eventId]);

  const fetchSponsorshipStatus = async () => {
    try {
      const response = await fetch(`/api/events/${eventId}/sponsor`);
      if (response.ok) {
        const data = await response.json();
        setSponsorshipStatus(data);
      }
    } catch (error) {
      console.error('Error fetching sponsorship status:', error);
      toast.error('Failed to load sponsorship details');
    }
  };

  const handleSubmit = async (formData: any) => {
    try {
      const response = await fetch(`/api/events/${eventId}/sponsorship-request`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(formData),
      });

      if (!response.ok) {
        const error = await response.json();
        throw new Error(error.message || 'Failed to process sponsorship');
      }

      await fetchSponsorshipStatus();
      toast.success('Sponsorship request submitted successfully!');
      setShowRequestForm(false);
    } catch (error) {
      console.error('Error submitting sponsorship:', error);
      toast.error(error instanceof Error ? error.message : 'Failed to submit sponsorship request');
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-[60]">
      <motion.div 
        initial={{ opacity: 0, scale: 0.9 }}
        animate={{ opacity: 1, scale: 1 }}
        exit={{ opacity: 0, scale: 0.9 }}
        className="bg-white rounded-3xl p-6 max-w-lg w-full mx-4"
      >
        <div className="flex justify-between items-center mb-4">
          <h3 className="font-bold text-xl text-gray-900">Event Sponsorship</h3>
          <button 
            onClick={onClose}
            className="btn btn-sm btn-circle btn-ghost text-gray-600 hover:bg-[#242937] hover:text-white"
          >
            <X size={20} />
          </button>
        </div>

        <div className="mt-6">
          <div className="bg-[#242937] p-6 rounded-xl text-white">
            <div className="flex items-center justify-between mb-4">
              <div className="flex items-center gap-2">
                <DollarSign className="w-5 h-5" />
                <span className="font-medium">Current Progress</span>
              </div>
              <div className="flex items-center gap-2">
                <Target className="w-5 h-5" />
                <span className="font-medium">Goal: ₱{sponsorshipStatus.goal.toLocaleString()}</span>
              </div>
            </div>

            <div className="flex flex-col gap-2">
              <div className="flex justify-between items-center">
                <span className="text-sm text-gray-300">Raised</span>
                <span className="font-medium">₱{sponsorshipStatus.currentAmount.toLocaleString()}</span>
              </div>
              <div className="w-full bg-white/10 rounded-full h-2">
                <div
                  className="bg-blue-500 h-2 rounded-full transition-all duration-300"
                  style={{
                    width: `${Math.min((sponsorshipStatus.currentAmount / sponsorshipStatus.goal) * 100, 100)}%`
                  }}
                />
              </div>
            </div>
          </div>

          <div className="mt-6 flex justify-end">
            <button
              onClick={() => setShowRequestForm(true)}
              className="btn btn-primary bg-blue-600 hover:bg-blue-700 text-white"
            >
              Sponsor Now
            </button>
          </div>
        </div>
      </motion.div>

      <CustomModal
        modalId="sponsorship_request_modal"
        title="Sponsorship Request"
        isOpen={showRequestForm}
        onClose={() => setShowRequestForm(false)}
        onSubmit={handleSubmit}
        eventName={eventName}
      />
    </div>
  );
};

export default SponsorDetails;
