"use client";
import React, { useState, useRef } from "react";
import { motion } from "framer-motion";
import { X, Image as ImageIcon, Calendar, MapPin, Handshake } from "lucide-react";
import { Event } from "@/entities/event";

interface CreateEventModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSubmit: (eventData: Partial<Event>) => void;
}

interface SponsorshipChip {
  id: string;
  name: string;
}

const CreateEventModal: React.FC<CreateEventModalProps> = ({ isOpen, onClose, onSubmit }) => {
  const [formData, setFormData] = useState<Partial<Event>>({
    name: "",
    organizer: "",
    description: "",
    type: "",
    startDate: new Date(),
    endDate: new Date(),
    location: "",
    imageUrl: "",
    sponsorship: {
      enabled: false,
      sponsors: [],
    },
  });
  const [sponsorshipInput, setSponsorshipInput] = useState<string>("");
  const [sponsorshipChips, setSponsorshipChips] = useState<SponsorshipChip[]>([]);
  const [sponsorshipEnabled, setSponsorshipEnabled] = useState(false);
  const [rsvpEnabled, setRsvpEnabled] = useState(false);
  const [previewImage, setPreviewImage] = useState<string | null>(null);
  const [imageFile, setImageFile] = useState<File | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

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

  const handleSponsorshipInput = (e: React.ChangeEvent<HTMLInputElement>) => {
    setSponsorshipInput(e.target.value);
  };

  const handleSponsorshipKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Enter' || e.key === ',') {
      e.preventDefault();
      const sponsorship = sponsorshipInput.trim();
      if (sponsorship) {
        setSponsorshipChips([...sponsorshipChips, { id: Date.now().toString(), name: sponsorship }]);
        setFormData(prev => ({
          ...prev,
          sponsorship: {
            enabled: true,
            sponsors: [...(prev.sponsorship?.sponsors || []), sponsorship]
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
      setFormData(prev => ({ ...prev, sponsorship: { enabled: false, sponsors: [] } }));
      setSponsorshipChips([]);
      setSponsorshipInput('');
    }
  };

  const handleRsvpToggle = (e: React.ChangeEvent<HTMLInputElement>) => {
    setRsvpEnabled(e.target.checked);
    if (e.target.checked) {
      setFormData(prev => ({ ...prev, wouldGo: [] }));
    } else {
      setFormData(prev => ({ ...prev, wouldGo: undefined }));
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.startDate || !formData.endDate) return;
    
    try {
      let imageUrl = formData.imageUrl;
      
      // Upload image if a new one was selected
      if (imageFile) {
        const formData = new FormData();
        formData.append('file', imageFile);
        formData.append('fileName', imageFile.name);

        const response = await fetch('/api/cloudinary/upload_event_image', {
          method: 'POST',
          body: formData,
        });

        if (!response.ok) {
          throw new Error('Failed to upload image');
        }

        const result = await response.json();
        imageUrl = result.url;
      }

      const eventData: Partial<Event> = {
        ...formData,
        startDate: new Date(formData.startDate),
        endDate: new Date(formData.endDate),
        imageUrl,
        rsvp: {
          enabled: rsvpEnabled,
          options: ['Yes', 'No', 'Maybe']
        },
        sponsorship: {
          enabled: sponsorshipEnabled,
          sponsors: sponsorshipChips.map(chip => chip.name)
        }
      };
      
      onSubmit(eventData);
      onClose();
      setFormData({
        name: "",
        organizer: "",
        description: "",
        type: "",
        startDate: new Date(),
        endDate: new Date(),
        location: "",
        imageUrl: "",
        sponsorship: {
          enabled: false,
          sponsors: [],
        },
      });
      setPreviewImage(null);
      setImageFile(null);
      setSponsorshipChips([]);
      setSponsorshipInput('');
      setSponsorshipEnabled(false);
      setRsvpEnabled(false);
    } catch (error) {
      console.error('Error creating event:', error);
      // You might want to show an error message to the user here
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-gray-900/50 backdrop-blur-sm flex items-center justify-center p-4 z-50 text-gray-500">
      <motion.div
        initial={{ opacity: 0, scale: 0.9 }}
        animate={{ opacity: 1, scale: 1 }}
        exit={{ opacity: 0, scale: 0.9 }}
        className="bg-gray-50 rounded-lg p-6 w-full max-w-2xl max-h-[90vh] overflow-y-auto shadow-xl border border-gray-200"
      >
        <div className="flex justify-between items-center mb-6">
          <h2 className="text-2xl font-bold text-gray-800">Create New Event</h2>
          <button
            onClick={onClose}
            className="btn btn-ghost btn-circle hover:bg-gray-100"
          >
            <X size={24} />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="space-y-6">
          {/* Image Upload */}
          <div className="space-y-2">
            <label className="block text-sm font-medium text-gray-700">Event Image</label>
            <div className="flex flex-col sm:flex-row items-start sm:items-center gap-4">
              <div className="relative w-32 h-32 border-2 border-dashed border-gray-300 rounded-lg flex items-center justify-center">
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
                  <div className="text-center">
                    <ImageIcon size={24} className="mx-auto mb-2 text-gray-400" />
                    <span className="text-sm text-gray-400">Upload Image</span>
                  </div>
                )}
                <input
                  type="file"
                  ref={fileInputRef}
                  onChange={handleImageChange}
                  accept="image/*"
                  className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
                />
              </div>
              <div className="text-sm text-gray-500">
                Recommended size: 800x600px
                <br />
                Max file size: 5MB
              </div>
            </div>
          </div>

          {/* Event Details */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div className="space-y-2">
              <label className="block text-sm font-medium text-gray-700">Event Name</label>
              <input
                type="text"
                value={formData.name}
                onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                className="input input-bordered w-full bg-white border-gray-200"
                required
              />
            </div>

            <div className="space-y-2">
              <label className="block text-sm font-medium text-gray-700">Organizer</label>
              <input
                type="text"
                value={formData.organizer}
                onChange={(e) => setFormData({ ...formData, organizer: e.target.value })}
                className="input input-bordered w-full bg-white border-gray-200"
                required
              />
            </div>

            <div className="space-y-2">
              <label className="block text-sm font-medium text-gray-700">Event Type</label>
              <select
                value={formData.type}
                onChange={(e) => setFormData({ ...formData, type: e.target.value })}
                className="select select-bordered w-full bg-white border-gray-200"
                required
              >
                <option value="">Select type</option>
                <option value="academic">Academic</option>
                <option value="social">Social</option>
                <option value="career">Career</option>
                <option value="other">Other</option>
              </select>
            </div>

            <div className="space-y-2">
              <label className="block text-sm font-medium text-gray-700">Start Date & Time</label>
              <div className="relative">
                <Calendar className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-800 z-10" size={20} />
                <input
                  type="datetime-local"
                  value={formData.startDate ? formData.startDate.toISOString().slice(0, 16) : ""}
                  onChange={(e) => setFormData({ ...formData, startDate: new Date(e.target.value) })}
                  className="input input-bordered w-full pl-10 bg-white border-gray-200 no-input-date"
                  onKeyDown={(e) => e.preventDefault()}
                  required
                />
              </div>
            </div>

            <div className="space-y-2">
              <label className="block text-sm font-medium text-gray-700">End Date & Time</label>
              <div className="relative">
                <Calendar className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-800 z-10" size={20} />
                <input
                  type="datetime-local"
                  value={formData.endDate ? formData.endDate.toISOString().slice(0, 16) : ""}
                  onChange={(e) => setFormData({ ...formData, endDate: new Date(e.target.value) })}
                  className="input input-bordered w-full pl-10 bg-white border-gray-200 no-input-date"
                  onKeyDown={(e) => e.preventDefault()}
                  required
                />
              </div>
            </div>

            <div className="space-y-2">
              <label className="block text-sm font-medium text-gray-700">Location</label>
              <div className="relative">
                <MapPin className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-800 z-10" size={20} />
                <input
                  type="text"
                  value={formData.location}
                  onChange={(e) => setFormData({ ...formData, location: e.target.value })}
                  className="input input-bordered w-full pl-10 bg-white border-gray-200"
                  required
                />
              </div>
            </div>
          </div>

          {/* Toggles section */}
          <div className="space-y-4">
            <div className="flex items-center gap-2">
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

            <div className="flex items-center gap-2">
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

          <div className="space-y-2">
            <label className="block text-sm font-medium text-gray-700">Description</label>
            <textarea
              value={formData.description}
              onChange={(e) => setFormData({ ...formData, description: e.target.value })}
              className="textarea textarea-bordered w-full h-32 bg-white border-gray-200"
              required
            />
          </div>

          <div className="flex justify-end gap-4">
            <button
              type="button"
              onClick={onClose}
              className="btn btn-ghost text-gray-500 hover:text-gray-700"
            >
              Cancel
            </button>
            <button type="submit" className="btn btn-primary">
              Create Event
            </button>
          </div>
        </form>
      </motion.div>
    </div>
  );
};

export default CreateEventModal;