import React, { useState } from "react";
import { X } from "lucide-react";
import { motion } from "framer-motion";

interface CustomModalProps {
  modalId: string;
  title: string;
  isOpen: boolean;
  onClose: () => void;
  onSubmit: () => void;
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
  const [contactNo, setContactNo] = useState("");
  const [email, setEmail] = useState("");
  const [name, setName] = useState("");
  const [sponsorshipType, setSponsorshipType] = useState<string>("cash");
  const [specificItem, setSpecificItem] = useState("");
  const [amount, setAmount] = useState("");

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    console.log({ 
      contactNo, 
      email, 
      sponsorshipType, 
      specificItem,
      amount: sponsorshipType === 'cash' ? amount : undefined 
    });
    onSubmit();
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
        <div>
            <label className="block text-sm font-semibold text-gray-700" htmlFor="email">
              Name
            </label>
            <input
              type="name"
              id="name"
              className="input input-bordered w-full mt-2 bg-gray-50"
              value={name}
              onChange={(e) => setName(e.target.value)}
              required
            />
          </div>


        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-sm font-semibold text-gray-700" htmlFor="contactNo">
              Contact No.
            </label>
            <input
              type="text"
              id="contactNo"
              className="input input-bordered w-full mt-2 bg-gray-50"
              value={contactNo}
              onChange={(e) => setContactNo(e.target.value)}
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
              value={email}
              onChange={(e) => setEmail(e.target.value)}
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
                    checked={sponsorshipType === "cash"}
                    onChange={() => {
                      setSponsorshipType("cash");
                      setSpecificItem("");
                    }}
                    className="radio radio-primary"
                  />
                  <span className="text-gray-700">Cash</span>
                </label>

                {sponsorshipType === "cash" && (
                  <div className="flex-1 ml-4">
                    <input
                      type="number"
                      className="input input-bordered w-full bg-gray-50"
                      placeholder="Enter amount"
                      value={amount}
                      onChange={(e) => setAmount(e.target.value)}
                      required
                    />
                    <div className="mt-2 flex items-center gap-4">
                      <label className="flex items-center gap-2">
                        <input
                          type="radio"
                          name="cashOption"
                          value="gcash"
                          onChange={() => setSpecificItem("gcash")}
                          className="radio radio-primary"
                        />
                        <span className="text-gray-700">GCash</span>
                      </label>
                      <label className="flex items-center gap-2">
                        <input
                          type="radio"
                          name="cashOption"
                          value="bankTransfer"
                          onChange={() => setSpecificItem("bankTransfer")}
                          className="radio radio-primary"
                        />
                        <span className="text-gray-700">Bank Transfer</span>
                      </label>
                    </div>
                  </div>
                )}
              </div>

              <div className="flex items-center gap-4">
                <label className="flex items-center gap-2">
                  <input
                    type="radio"
                    name="sponsorshipType"
                    value="specificItems"
                    checked={sponsorshipType === "specificItems"}
                    onChange={() => {
                      setSponsorshipType("specificItems");
                      setAmount("");
                      setSpecificItem("");
                    }}
                    className="radio radio-primary"
                  />
                  <span className="text-gray-700">Specific Items</span>
                </label>

                {sponsorshipType === "specificItems" && (
                  <div className="flex-1">
                    <input
                      type="text"
                      className="input input-bordered w-full bg-gray-50"
                      placeholder="Enter specific item(s)"
                      value={specificItem}
                      onChange={(e) => setSpecificItem(e.target.value)}
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
              className="btn btn-primary bg-blue-600 hover:bg-blue-700"
            >
              Submit Request
            </button>
          </div>
        </form>
      </motion.div>
    </div>
  );
};

export default CustomModal;
