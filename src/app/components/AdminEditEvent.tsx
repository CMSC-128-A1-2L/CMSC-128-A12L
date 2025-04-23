"use client";
import React, { useState, useEffect, useRef } from "react";
import { Event } from "@/entities/event";
import { Calendar, MapPin, X, Handshake, Info, Users, Image as ImageIcon } from "lucide-react";
import { motion } from "framer-motion";

interface EditEventModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSave: (updatedEvent: Event) => void;
  event: Event | null;
}

interface SponsorshipChip {
  id: string;
  name: string;
}

// Helper to format date for datetime-local input
const formatDateTimeLocal = (date: Date | string | undefined): string => {
  if (!date) return "";
  try {
    const d = new Date(date);
    // Check if date is valid
    if (isNaN(d.getTime())) {
      return "";
    }
    // Format: YYYY-MM-DDTHH:mm
    const year = d.getFullYear();
    const month = (d.getMonth() + 1).toString().padStart(2, '0');
    const day = d.getDate().toString().padStart(2, '0');
    const hours = d.getHours().toString().padStart(2, '0');
    const minutes = d.getMinutes().toString().padStart(2, '0');
    return `${year}-${month}-${day}T${hours}:${minutes}`;
  } catch (error) {
    console.error("Error formatting date:", error);
    return ""; // Return empty string on error
  }
};

const EditEventModal: React.FC<EditEventModalProps> = ({ isOpen, onClose, onSave, event }) => {
  const [formData, setFormData] = useState<Partial<Event>>({
    name: event?.name || "",
    organizer: event?.organizer || "",
    description: event?.description || "",
    type: event?.type || "social",
    startDate: event?.startDate ? new Date(event.startDate) : new Date(),
    endDate: event?.endDate ? new Date(event.endDate) : new Date(),
    location: event?.location || "",
    imageUrl: event?.imageUrl || "",
    sponsorship: {
      enabled: false,
      sponsors: []
    },
  });
  const [sponsorshipInput, setSponsorshipInput] = useState<string>("");
  const [sponsorshipChips, setSponsorshipChips] = useState<SponsorshipChip[]>([]);
  const [sponsorshipEnabled, setSponsorshipEnabled] = useState(false);
  const [rsvpEnabled, setRsvpEnabled] = useState(false);
  const [previewImage, setPreviewImage] = useState<string | null>(event?.imageUrl || null);
  const [imageFile, setImageFile] = useState<File | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    if (event) {
      setFormData({
        ...event,
        startDate: event.startDate ? new Date(event.startDate) : new Date(),
        endDate: event.endDate ? new Date(event.endDate) : new Date(),
      });
      setSponsorshipEnabled(event.sponsorship?.enabled || false);
      if (event.sponsorship?.sponsors) {
        setSponsorshipChips(
          event.sponsorship.sponsors.map(sponsor => ({
            id: Date.now().toString() + sponsor,
            name: sponsor
          }))
        );
      }
      setRsvpEnabled(event.rsvp?.enabled || false);
      setPreviewImage(event.imageUrl || null);
    } else {
      setFormData({});
      setSponsorshipEnabled(false);
      setSponsorshipChips([]);
      setRsvpEnabled(false);
      setPreviewImage(null);
    }
  }, [event]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    
    if (name === 'startDate' || name === 'endDate') {
      const dateValue = new Date(value);
      if (!isNaN(dateValue.getTime())) {
        setFormData(prev => ({
          ...prev,
          [name]: dateValue
        }));
      }
    } else if (name === 'monetaryValue') {
      setFormData(prev => ({
        ...prev,
        monetaryValue: parseFloat(value)
      }));
    } else {
      setFormData(prev => ({
        ...prev,
        [name]: value
      }));
    }
  };

  const handleCheckboxChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, checked } = e.target;
    setFormData(prev => ({ ...prev, [name]: checked }));
  };

  const handleSponsorshipInput = (e: React.ChangeEvent<HTMLInputElement>) => {
    setSponsorshipInput(e.target.value);
  };

  const handleSponsorshipKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Enter' || e.key === ',') {
      e.preventDefault();
      const sponsor = sponsorshipInput.trim();
      if (sponsor) {
        const newChip = { id: Date.now().toString(), name: sponsor };
        setSponsorshipChips([...sponsorshipChips, newChip]);
        setFormData(prev => ({
          ...prev,
          sponsorship: {
            enabled: true,
            sponsors: [...(prev.sponsorship?.sponsors || []), sponsor]
          }
        }));
        setSponsorshipInput('');
      }
    }
  };

  const removeSponsorshipChip = (id: string) => {
    const chipToRemove = sponsorshipChips.find(chip => chip.id === id);
    if (chipToRemove) {
      setSponsorshipChips(sponsorshipChips.filter(chip => chip.id !== id));
      setFormData(prev => ({
        ...prev,
        sponsorship: {
          enabled: true,
          sponsors: prev.sponsorship?.sponsors?.filter(s => s !== chipToRemove.name) || []
        }
      }));
    }
  };

  const handleSponsorshipToggle = (e: React.ChangeEvent<HTMLInputElement>) => {
    const enabled = e.target.checked;
    setSponsorshipEnabled(enabled);
    if (!enabled) {
      setFormData(prev => ({
        ...prev,
        sponsorship: {
          enabled: false,
          sponsors: []
        }
      }));
      setSponsorshipChips([]);
      setSponsorshipInput('');
    }
  };

  const handleRsvpToggle = (e: React.ChangeEvent<HTMLInputElement>) => {
    setRsvpEnabled(e.target.checked);
    // Add logic here if disabling RSVP should clear wouldGo arrays etc.
    // For now, just toggles the state.
  };

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      setImageFile(file);
      const reader = new FileReader();
      reader.onloadend = () => {
        setPreviewImage(reader.result as string);
        setFormData(prev => ({ ...prev, imageUrl: reader.result as string }));
      };
      reader.readAsDataURL(file);
    }
  };

  const handleRemoveImage = () => {
    setPreviewImage(null);
    setImageFile(null);
    setFormData(prev => ({ ...prev, imageUrl: "" }));
    if (fileInputRef.current) {
      fileInputRef.current.value = "";
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.startDate || !formData.endDate) return;
    
    const eventData: Partial<Event> = {
      ...formData,
      startDate: formData.startDate instanceof Date ? formData.startDate : new Date(formData.startDate),
      endDate: formData.endDate instanceof Date ? formData.endDate : new Date(formData.endDate),
    };
    onSave(eventData as Event);
    onClose();
  };

  if (!isOpen || !event) return null;

  return (
    <div className="fixed inset-0 bg-gray-900/50 backdrop-blur-sm flex items-center justify-center p-4 z-50 text-gray-500">
      <motion.div
        initial={{ opacity: 0, scale: 0.9 }}
        animate={{ opacity: 1, scale: 1 }}
        exit={{ opacity: 0, scale: 0.9 }}
        className="bg-gray-50 rounded-lg p-6 w-full max-w-3xl max-h-[90vh] overflow-y-auto shadow-xl border border-gray-200"
      >
        <div className="flex justify-between items-center mb-6">
          <h2 className="text-2xl font-bold text-gray-800">Edit Event</h2>
          <button
            onClick={onClose}
            className="btn btn-circle bg-gray-100 hover:bg-gray-300 transition-colors duration-200"
          >
            <X size={24} className="text-black" />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="space-y-6">
           {/* Image Upload */}
           <div className="space-y-2">
              <label className="block text-sm font-medium text-gray-700">Event Image</label>
              <div className="flex flex-col sm:flex-row items-start sm:items-center gap-4">
                <div className="relative w-32 h-32 border-2 border-dashed border-gray-300 rounded-lg flex items-center justify-center bg-white">
                  {previewImage ? (
                    <>
                      <img
                        src={previewImage}
                        alt="Preview"
                        className="w-full h-full object-cover rounded-lg"
                      />
                      <button
                        type="button"
                        onClick={handleRemoveImage}
                        className="absolute -top-2 -right-2 btn btn-circle btn-sm btn-error"
                      >
                        <X size={16} />
                      </button>
                    </>
                  ) : (
                    <div className="text-center text-gray-400">
                      <ImageIcon size={32} className="mx-auto mb-1" />
                      Upload
                    </div>
                  )}
                  <input
                    type="file"
                    ref={fileInputRef}
                    onChange={handleImageChange}
                    accept="image/*"
                    className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
                    name="imageFile" // Name matches state if storing file object
                  />
                </div>
                <div className="text-sm text-gray-500">
                  Recommended: 800x600px. Max: 5MB.
                </div>
              </div>
            </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {/* Column 1 */}
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Event Name</label>
                <input
                  type="text"
                  name="name"
                  value={formData.name || ''}
                  onChange={handleChange}
                  className="input input-bordered w-full bg-white"
                  required
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Organizer</label>
                <input
                  type="text"
                  name="organizer"
                  value={formData.organizer || ''}
                  onChange={handleChange}
                  className="input input-bordered w-full bg-white"
                  required
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Event Type</label>
                <select
                  name="type"
                  value={formData.type || ''}
                  onChange={handleChange}
                  className="select select-bordered w-full bg-white"
                  required
                >
                  <option value="">Select type</option>
                  <option value="academic">Academic</option>
                  <option value="social">Social</option>
                  <option value="career">Career</option>
                  <option value="other">Other</option>
                </select>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Location</label>
                <div className="relative">
                  <MapPin className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-800 z-10" size={18} />
                  <input
                    type="text"
                    name="location"
                    value={formData.location || ''}
                    onChange={handleChange}
                    className="input input-bordered w-full pl-10 bg-white"
                    required
                  />
                </div>
              </div>
              
              {/* RSVP Toggle */}
              <div className="flex items-center gap-2 pt-2">
                <label htmlFor="rsvpToggle" className="text-sm font-medium text-gray-700 flex-1">Enable RSVP</label>
                <input 
                  type="checkbox" 
                  id="rsvpToggle"
                  checked={rsvpEnabled}
                  onChange={handleRsvpToggle}
                  className="toggle toggle-primary border-2 border-gray-300 checked:bg-blue-500"
                 />
              </div>

            </div>

            {/* Column 2 */} 
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Start Date & Time</label>
                <div className="relative">
                  <Calendar className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-800 z-10" size={18} />
                  <input
                    type="datetime-local"
                    value={formData.startDate ? formData.startDate.toISOString().slice(0, 16) : ""}
                    onChange={(e) => setFormData({ ...formData, startDate: new Date(e.target.value) })}
                    className="input input-bordered w-full pl-10 bg-white border-gray-200"
                    required
                  />
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">End Date & Time</label>
                <div className="relative">
                  <Calendar className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-800 z-10" size={18} />
                  <input
                    type="datetime-local"
                    value={formData.endDate ? formData.endDate.toISOString().slice(0, 16) : ""}
                    onChange={(e) => setFormData({ ...formData, endDate: new Date(e.target.value) })}
                    className="input input-bordered w-full pl-10 bg-white border-gray-200"
                    required
                  />
                </div>
              </div>

              {/* Sponsorship Toggle & Value */}
              <div className="flex items-center gap-2 pt-2">
                 <label htmlFor="sponsorshipToggle" className="text-sm font-medium text-gray-700 flex-1">Enable Sponsorship</label>
                 <input 
                  type="checkbox" 
                  id="sponsorshipToggle"
                  checked={sponsorshipEnabled}
                  onChange={handleSponsorshipToggle}
                  className="toggle toggle-primary border-2 border-gray-300 checked:bg-blue-500"
                 />
              </div>
              
              {sponsorshipEnabled && (
                <div className="space-y-2">
                  <label className="block text-sm font-medium text-gray-700">Add Sponsorships</label>
                  <div className="flex flex-wrap gap-2 p-3 bg-gray-50 border border-gray-200 rounded-xl min-h-[42px] hover:border-blue-300 transition-colors duration-200">
                    {sponsorshipChips.map((chip) => (
                      <motion.div
                        key={chip.id}
                        initial={{ opacity: 0, scale: 0.8 }}
                        animate={{ opacity: 1, scale: 1 }}
                        className="flex items-center gap-1 bg-blue-100 text-blue-700 px-3 py-1.5 rounded-full text-sm hover:bg-blue-200 transition-colors duration-200"
                      >
                        <span>{chip.name}</span>
                        <button
                          type="button"
                          onClick={() => removeSponsorshipChip(chip.id)}
                          className="hover:text-blue-500 transition-colors"
                        >
                          <X size={16} />
                        </button>
                      </motion.div>
                    ))}
                    <input
                      type="text"
                      value={sponsorshipInput}
                      onChange={handleSponsorshipInput}
                      onKeyDown={handleSponsorshipKeyDown}
                      className="flex-1 bg-transparent border-none outline-none text-gray-900 placeholder-gray-400 min-w-[200px]"
                      placeholder="Type sponsorship and press Enter"
                    />
                  </div>
                </div>
              )}
            </div>
          </div>

          {/* Description (Full Width) */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Description</label>
            <textarea
              name="description"
              value={formData.description || ''}
              onChange={handleChange}
              className="textarea textarea-bordered w-full h-32 bg-white"
              required
            />
          </div>

          {/* Action Buttons */}
          <div className="flex justify-end gap-4 pt-4">
            <button
              type="button"
              onClick={onClose}
              className="btn btn-ghost"
            >
              Cancel
            </button>
            <button type="submit" className="btn btn-primary">
              Save Changes
            </button>
          </div>
        </form>
      </motion.div>
    </div>
  );
};

export default EditEventModal;