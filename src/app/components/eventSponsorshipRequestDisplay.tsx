import React, { useState } from "react";
import { X } from "lucide-react";
import { motion } from "framer-motion";
import { toast } from "react-hot-toast";

interface SponsorshipRequestFormData {
  name: string;
  contactNo: string;
  email: string;
  sponsorshipType: 'cash' | 'specificItems';
  amount?: number;
  specificItem?: string;
}

interface CustomModalProps {
  modalId: string;
  title: string;
  isOpen: boolean;
  onClose: () => void;
  onSubmit: (data: SponsorshipRequestFormData) => void;
  eventName?: string;
}

const CustomModal: React.FC<CustomModalProps> = ({
  modalId,
  title,
  isOpen,
  onClose,
  onSubmit,
  eventName,
}) => {
  const [formData, setFormData] = useState<SponsorshipRequestFormData>({
    name: "",
    contactNo: "",
    email: "",
    sponsorshipType: "cash",
  });
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    try {
      if (formData.sponsorshipType === 'cash' && (!formData.amount || formData.amount <= 0)) {
        throw new Error('Please enter a valid amount');
      }

      if (formData.sponsorshipType === 'specificItems' && !formData.specificItem) {
        throw new Error('Please specify the items');
      }

      await onSubmit(formData);
      setFormData({
        name: "",
        contactNo: "",
        email: "",
        sponsorshipType: "cash",
      });
      toast.success('Sponsorship request submitted successfully');
      onClose();
    } catch (error) {
      toast.error(error instanceof Error ? error.message : 'Failed to submit request');
    } finally {
      setLoading(false);
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-gray-900/50 backdrop-blur-sm flex items-center justify-center p-4 z-[60]">
      <motion.div
        initial={{ opacity: 0, scale: 0.9 }}
        animate={{ opacity: 1, scale: 1 }}
        exit={{ opacity: 0, scale: 0.9 }}
        className="bg-gray-50 rounded-lg p-6 w-full max-w-2xl max-h-[90vh] overflow-y-auto shadow-xl border border-gray-200"
      >
        <div className="flex justify-between items-center mb-6">
          <div>
            <h2 className="text-2xl font-bold text-gray-800">{title}</h2>
            {eventName && (
              <p className="text-sm text-gray-600 mt-1">
                Event: {eventName}
              </p>
            )}
          </div>
          <button
            onClick={onClose}
            className="btn btn-circle bg-gray-100 hover:bg-gray-300 transition-colors duration-200"
          >
            <X size={24} className="text-black" />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-sm font-semibold text-gray-700" htmlFor="name">
              Name
            </label>
            <input
              type="text"
              id="name"
              className="input input-bordered w-full mt-2 bg-gray-50"
              value={formData.name}
              onChange={(e) => setFormData({ ...formData, name: e.target.value })}
              required
            />
          </div>

          <div>
            <label className="block text-sm font-semibold text-gray-700" htmlFor="contactNo">
              Contact No.
            </label>
            <input
              type="text"
              id="contactNo"
              className="input input-bordered w-full mt-2 bg-gray-50"
              value={formData.contactNo}
              onChange={(e) => setFormData({ ...formData, contactNo: e.target.value })}
              required
            />
          </div>

          <div>
            <label className="block text-sm font-semibold text-gray-700" htmlFor="email">
              Email
            </label>
            <input
              type="email"
              id="email"
              className="input input-bordered w-full mt-2 bg-gray-50"
              value={formData.email}
              onChange={(e) => setFormData({ ...formData, email: e.target.value })}
              required
            />
          </div>

          <div>
            <label className="block text-sm font-semibold text-gray-700">Sponsorship Type</label>
            <div className="mt-2 space-y-4">
              <div className="flex items-center gap-4">
                <label className="flex items-center gap-2">
                  <input
                    type="radio"
                    name="sponsorshipType"
                    value="cash"
                    checked={formData.sponsorshipType === "cash"}
                    onChange={() => setFormData({
                      ...formData,
                      sponsorshipType: "cash",
                      specificItem: undefined
                    })}
                    className="radio radio-primary"
                  />
                  <span className="text-gray-700">Cash</span>
                </label>

                {formData.sponsorshipType === "cash" && (
                  <div className="flex-1">
                    <input
                      type="number"
                      className="input input-bordered w-full bg-gray-50"
                      placeholder="Enter amount"
                      value={formData.amount || ''}
                      onChange={(e) => setFormData({
                        ...formData,
                        amount: parseFloat(e.target.value)
                      })}
                      min="1"
                      step="any"
                      required
                    />
                  </div>
                )}
              </div>

              <div className="flex items-center gap-4">
                <label className="flex items-center gap-2">
                  <input
                    type="radio"
                    name="sponsorshipType"
                    value="specificItems"
                    checked={formData.sponsorshipType === "specificItems"}
                    onChange={() => setFormData({
                      ...formData,
                      sponsorshipType: "specificItems",
                      amount: undefined
                    })}
                    className="radio radio-primary"
                  />
                  <span className="text-gray-700">Specific Items</span>
                </label>

                {formData.sponsorshipType === "specificItems" && (
                  <div className="flex-1">
                    <input
                      type="text"
                      className="input input-bordered w-full bg-gray-50"
                      placeholder="Enter specific item(s)"
                      value={formData.specificItem || ''}
                      onChange={(e) => setFormData({
                        ...formData,
                        specificItem: e.target.value
                      })}
                      required
                    />
                  </div>
                )}
              </div>
            </div>
          </div>

          <div className="flex justify-end gap-2 mt-6">
            <button
              type="button"
              onClick={onClose}
              className="btn btn-ghost"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={loading}
              className="btn btn-primary bg-blue-600 hover:bg-blue-700"
            >
              {loading ? 'Submitting...' : 'Submit Request'}
            </button>
          </div>
        </form>
      </motion.div>
    </div>
  );
};

export default CustomModal;
