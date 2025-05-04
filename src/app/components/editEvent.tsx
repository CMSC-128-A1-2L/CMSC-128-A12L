"use client";
import React, { useState, useEffect, useRef } from "react";
import { Event } from "@/entities/event";
import { Calendar, MapPin, X, Handshake, Info, Users, Image as ImageIcon, ChevronDown, DollarSign } from "lucide-react";
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

// Helper function to format date for display
const formatDateForDisplay = (date: Date | string | undefined) => {
  if (!date) return "";
  const dateObj = date instanceof Date ? date : new Date(date);
  return dateObj.toLocaleString('en-US', {
    year: 'numeric',
    month: '2-digit',
    day: '2-digit',
    hour: 'numeric',
    minute: '2-digit',
    hour12: true
  });
};

// Helper to format date for datetime-local input
const formatDateTimeLocal = (date: Date | string | undefined): string => {
  if (!date) return "";
  try {
    const d = new Date(date);
    if (isNaN(d.getTime())) return "";
    return d.toISOString().slice(0, 16);
  } catch (error) {
    console.error("Error formatting date:", error);
    return "";
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
      enabled: event?.sponsorship?.enabled || false,
      goal: event?.sponsorship?.goal || 0,
      currentAmount: event?.sponsorship?.currentAmount || 0,
      sponsors: event?.sponsorship?.sponsors || [],
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

  useEffect(() => {
    const modal = document.getElementById("edit_event_modal") as HTMLDialogElement;
    if (isOpen && modal && !modal.open) {
      modal.showModal();
    }
  }, [isOpen]);

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
          goal: 0,
          currentAmount: 0,
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

  if (!event) return null;

  return (
    <div className="fixed inset-0 bg-gray-900/50 backdrop-blur-sm flex items-center justify-center p-4 z-50 text-gray-500">
      <motion.div
        initial={{ opacity: 0, scale: 0.9 }}
        animate={{ opacity: 1, scale: 1 }}
        exit={{ opacity: 0, scale: 0.9 }}
        className="bg-gray-50 rounded-lg p-6 w-full max-w-3xl max-h-[90vh] overflow-y-auto shadow-xl border border-gray-200"
      >
        <form method="dialog">
          <button className="btn btn-sm btn-circle btn-ghost absolute right-2 top-2 text-gray-600 hover:bg-[#605dff] hover:text-white">
            ✕
          </button>
        </form>

        <h3 className="font-bold text-xl text-gray-900 mt-4">Edit Event</h3>

        <form onSubmit={handleSubmit} className="space-y-6 mt-6">
          {/* Image Upload */}
          <div className="space-y-2">
            <label className="font-bold text-left text-gray-800 block">Event Image</label>
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
                  <div className="text-center text-gray-600">
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
                  name="imageFile"
                />
              </div>
              <div className="text-sm text-gray-600">
                Recommended: 800x600px. Max: 5MB.
              </div>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {/* Column 1 */}
            <div className="space-y-4">
              <div>
                <label className="font-bold text-left text-gray-800 block">Event Name</label>
                <input
                  type="text"
                  name="name"
                  value={formData.name || ""}
                  onChange={handleChange}
                  className="input w-full mt-1 bg-white border-black text-black"
                  required
                />
              </div>

              <div>
                <label className="font-bold text-left text-gray-800 block">Organizer</label>
                <input
                  type="text"
                  name="organizer"
                  value={formData.organizer || ""}
                  onChange={handleChange}
                  className="input w-full mt-1 bg-white border-black text-black"
                  required
                />
              </div>

              <div>
                <label className="font-bold text-left text-gray-800 block">Event Type</label>
                <select
                  name="type"
                  value={formData.type || "social"}
                  onChange={handleChange}
                  className="select w-full mt-1 bg-white border-black text-black"
                  required
                >
                  <option value="social">Social</option>
                  <option value="academic">Academic</option>
                  <option value="career">Career</option>
                  <option value="other">Other</option>
                </select>
              </div>

              <div>
                <label className="font-bold text-left text-gray-800 block">Location</label>
                <div className="relative">
                  <MapPin className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-600 pointer-events-none z-10" size={18} />
                  <input
                    type="text"
                    name="location"
                    value={formData.location || ""}
                    onChange={handleChange}
                    className="input w-full pl-10 bg-white border-black text-black"
                    required
                  />
                </div>
              </div>

              {/* RSVP Toggle */}
              <div className="flex items-center gap-2 pt-2">
                <input
                  type="checkbox"
                  checked={rsvpEnabled}
                  onChange={handleRsvpToggle}
                  className="checkbox border border-black bg-white [&:checked]:bg-[#242937]"
                />
                <label className="font-bold text-left text-gray-800">Enable RSVP</label>
              </div>
            </div>

            {/* Column 2 */}
            <div className="space-y-4">
              <div>
                <label className="font-bold text-left text-gray-800 block">Start Date & Time</label>
                <div className="relative">
                  <Calendar className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-600 pointer-events-none z-10" size={18} />
                  <input
                    type="datetime-local"
                    name="startDate"
                    value={formatDateTimeLocal(formData.startDate)}
                    onChange={handleChange}
                    className="input w-full pl-10 bg-white border-black text-black [color-scheme:light]"
                    required
                    onKeyDown={(e) => e.preventDefault()}
                  />
                </div>
                {formData.startDate && (
                  <p className="text-sm text-gray-500 mt-1">
                    {formatDateForDisplay(formData.startDate)}
                  </p>
                )}
              </div>

              <div>
                <label className="font-bold text-left text-gray-800 block">End Date & Time</label>
                <div className="relative">
                  <Calendar className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-600 pointer-events-none z-10" size={18} />
                  <input
                    type="datetime-local"
                    name="endDate"
                    value={formatDateTimeLocal(formData.endDate)}
                    onChange={handleChange}
                    className="input w-full pl-10 bg-white border-black text-black [color-scheme:light]"
                    required
                    onKeyDown={(e) => e.preventDefault()}
                  />
                </div>
                {formData.endDate && (
                  <p className="text-sm text-gray-500 mt-1">
                    {formatDateForDisplay(formData.endDate)}
                  </p>
                )}
              </div>

              {/* Sponsorship Toggle & Input */}
              <div className="space-y-2">
                <div className="flex items-center gap-2">
                  <input
                    type="checkbox"
                    checked={sponsorshipEnabled}
                    onChange={handleSponsorshipToggle}
                    className="checkbox border border-black bg-white [&:checked]:bg-[#242937]"
                  />
                  <label className="font-bold text-left text-gray-800">Enable Sponsorship</label>
                </div>
                {sponsorshipEnabled && (
                  <div className="space-y-4">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">
                        Sponsorship Goal (₱)
                      </label>
                      <div className="relative">
                        <DollarSign className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={20} />
                        <input
                          type="number"
                          value={formData.sponsorship?.goal || ''}
                          onChange={(e) => setFormData(prev => ({
                            ...prev,
                            sponsorship: {
                              ...prev.sponsorship,
                              enabled: true,
                              goal: parseFloat(e.target.value) || 0
                            }
                          }))}
                          className="input input-bordered w-full pl-10 bg-white"
                          placeholder="Enter sponsorship goal amount"
                          min="1"
                          step="any"
                          required={sponsorshipEnabled}
                        />
                      </div>
                    </div>

                    <div className="space-y-2">
                      <label className="block text-sm font-medium text-gray-700">
                        Add Sponsorship Options
                      </label>
                      <div className="space-y-2">
                        <input
                          type="text"
                          value={sponsorshipInput}
                          onChange={handleSponsorshipInput}
                          onKeyDown={handleSponsorshipKeyDown}
                          placeholder="Add sponsors (press Enter)"
                          className="input w-full bg-white border-black text-black placeholder:text-gray-400"
                        />
                        <div className="flex flex-wrap gap-2">
                          {sponsorshipChips.map(chip => (
                            <div key={chip.id} className="badge gap-2 bg-[#242937] text-white border-none">
                              {chip.name}
                              <button
                                type="button"
                                onClick={() => removeSponsorshipChip(chip.id)}
                                className="btn btn-xs btn-ghost btn-circle hover:bg-[#1b1f4e]"
                              >
                                <X size={14} />
                              </button>
                            </div>
                          ))}
                        </div>
                      </div>
                    </div>
                  </div>
                )}
              </div>
            </div>
          </div>

          {/* Description (Full Width) */}
          <div>
            <label className="font-bold text-left text-gray-800 block">Description</label>
            <textarea
              name="description"
              value={formData.description || ""}
              onChange={handleChange}
              className="textarea w-full h-32 mt-1 bg-white border-black text-black"
              required
            />
          </div>

          {/* Action Buttons */}
          <div className="flex justify-end gap-4 pt-4">
            <button
              type="button"
              onClick={onClose}
              className="btn btn-dash bg-gray-100 hover:bg-gray-200 text-gray-800"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="btn btn-primary"
            >
              Save Changes
            </button>
          </div>
        </form>
      </motion.div>
    </div>
  );
};

export default EditEventModal;
