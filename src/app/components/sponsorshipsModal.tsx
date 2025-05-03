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
}

const SponsorDetails: React.FC<SponsorDetailsProps> = ({ onClose, eventId, eventName }) => {
  const [amount, setAmount] = useState("");
  const [loading, setLoading] = useState(false);
  const [showRequestForm, setShowRequestForm] = useState(false);
  const [sponsorshipStatus, setSponsorshipStatus] = useState<{
    currentAmount: number;
    goal: number;
    isActive: boolean;
  }>({ currentAmount: 0, goal: 0, isActive: false });

  useEffect(() => {
    fetchSponsorshipStatus();
  }, [eventId]);

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

      await fetchSponsorshipStatus(); // Refresh the status
      toast.success('Sponsorship request submitted successfully!');
      setShowRequestForm(false);
    } catch (error) {
      console.error('Error submitting sponsorship:', error);
      toast.error(error instanceof Error ? error.message : 'Failed to submit sponsorship request');
    }
  };

  return (
    <>
      <dialog id="sponsor_details_modal" className="modal">
        <motion.div 
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          exit={{ opacity: 0, scale: 0.9 }}
          className="modal-box rounded-3xl bg-white"
        >
          <form method="dialog">
            <button className="btn btn-sm btn-circle btn-ghost absolute right-2 top-2 text-gray-600 hover:bg-[#242937] hover:text-white">✕</button>
          </form>

          <h3 className="font-bold text-xl text-gray-900 mt-4">Event Sponsorship</h3>

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
                className="btn btn-primary bg-blue-600 hover:bg-blue-700"
              >
                Sponsor Now
              </button>
            </div>
          </div>
        </motion.div>
      </dialog>

      <CustomModal
        modalId="sponsorship_request_modal"
        title="Sponsorship Request"
        isOpen={showRequestForm}
        onClose={() => setShowRequestForm(false)}
        onSubmit={handleSubmit}
        eventName={eventName}
      />
    </>
  );
};

export default SponsorDetails;
