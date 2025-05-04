"use client";
import React, { useState, useRef } from "react";
import { motion } from "framer-motion";
import { X, Image as ImageIcon, Calendar, MapPin, Handshake, DollarSign } from "lucide-react";
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
      goal: 0,
      currentAmount: 0,
      sponsors: []
    }
  });

  const [previewImage, setPreviewImage] = useState<string | null>(null);
  const [imageFile, setImageFile] = useState<File | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  // Helper function to format date for display
  const formatDate = (date: Date) => {
    return date.toLocaleString('en-US', {
      year: 'numeric',
      month: '2-digit',
      day: '2-digit',
      hour: 'numeric',
      minute: '2-digit',
      hour12: true
    });
  };

  // Handle date/time changes
  const handleDateTimeChange = (e: React.ChangeEvent<HTMLInputElement>, field: 'startDate' | 'endDate') => {
    const value = e.target.value;
    if (value) {
      setFormData(prev => ({
        ...prev,
        [field]: new Date(value)
      }));
    }
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    if (name === 'startDate' || name === 'endDate') {
      setFormData(prev => ({
        ...prev,
        [name]: new Date(value)
      }));
    } else if (name === 'sponsorship.goal') {
      setFormData(prev => ({
        ...prev,
        sponsorship: {
          ...prev.sponsorship!,
          goal: parseInt(value) || 0
        }
      }));
    } else {
      setFormData(prev => ({
        ...prev,
        [name]: value
      }));
    }
  };

  const handleSponsorshipToggle = (e: React.ChangeEvent<HTMLInputElement>) => {
    const enabled = e.target.checked;
    setFormData(prev => ({
      ...prev,
      sponsorship: {
        ...prev.sponsorship!,
        enabled,
        goal: enabled ? prev.sponsorship?.goal || 0 : 0,
        currentAmount: 0,
        sponsors: enabled ? prev.sponsorship?.sponsors || [] : []
      }
    }));
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

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.startDate || !formData.endDate) return;
    
    try {
      let imageUrl = formData.imageUrl;
      
      const eventData: Partial<Event> = {
        ...formData,
        startDate: new Date(formData.startDate),
        endDate: new Date(formData.endDate),
        imageUrl,
        rsvp: {
          enabled: true,
          options: ['Yes', 'No', 'Maybe']
        }
      };
      
      onSubmit(eventData);
      onClose();
    } catch (error) {
      console.error('Error creating event:', error);
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-gray-900/50 backdrop-blur-sm flex items-center justify-center p-4 z-50 text-gray-500">
      <motion.div
        initial={{ opacity: 0, scale: 0.9 }}
        animate={{ opacity: 1, scale: 1 }}
        exit={{ opacity: 0, scale: 0.9 }}
        className="bg-gray-50 rounded-lg p-6 w-full max-w-3xl max-h-[90vh] overflow-y-auto shadow-xl border border-gray-200"
      >
        <div className="flex justify-between items-center mb-6">
          <h2 className="text-2xl font-bold text-gray-800">Create New Event</h2>
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
                />
              </div>
              <div className="text-sm text-gray-500">
                Recommended: 800x600px. Max: 5MB.
              </div>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {/* Basic Information */}
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700">Event Name</label>
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
                <label className="block text-sm font-medium text-gray-700">Organizer</label>
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
                <label className="block text-sm font-medium text-gray-700">Event Type</label>
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
                <label className="block text-sm font-medium text-gray-700">Location</label>
                <input
                  type="text"
                  name="location"
                  value={formData.location || ''}
                  onChange={handleChange}
                  className="input input-bordered w-full bg-white"
                  required
                />
              </div>
            </div>

            {/* Dates and Sponsorship */}
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700">Start Date & Time</label>
                <div className="relative">
                  <Calendar className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 pointer-events-none" size={18} />
                  <input
                    type="datetime-local"
                    name="startDate"
                    value={formData.startDate ? formData.startDate.toISOString().slice(0, 16) : ""}
                    onChange={(e) => handleDateTimeChange(e, 'startDate')}
                    className="input input-bordered w-full pl-10 bg-white [color-scheme:light]"
                    required
                    onKeyDown={(e) => e.preventDefault()}
                  />
                </div>
                {formData.startDate && (
                  <p className="text-sm text-gray-500 mt-1">
                    {formatDate(formData.startDate)}
                  </p>
                )}
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700">End Date & Time</label>
                <div className="relative">
                  <Calendar className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 pointer-events-none" size={18} />
                  <input
                    type="datetime-local"
                    name="endDate"
                    value={formData.endDate ? formData.endDate.toISOString().slice(0, 16) : ""}
                    onChange={(e) => handleDateTimeChange(e, 'endDate')}
                    className="input input-bordered w-full pl-10 bg-white [color-scheme:light]"
                    required
                    onKeyDown={(e) => e.preventDefault()}
                  />
                </div>
                {formData.endDate && (
                  <p className="text-sm text-gray-500 mt-1">
                    {formatDate(formData.endDate)}
                  </p>
                )}
              </div>

              {/* Sponsorship Settings */}
              <div className="space-y-4">
                <h3 className="text-lg font-semibold">Sponsorship Settings</h3>
                <div className="form-control">
                  <label className="label cursor-pointer justify-start gap-2">
                    <input
                      type="checkbox"
                      className="checkbox"
                      checked={formData.sponsorship?.enabled}
                      onChange={handleSponsorshipToggle}
                    />
                    <span className="label-text">Enable Sponsorship for this Event</span>
                  </label>
                </div>

                {formData.sponsorship?.enabled && (
                  <div className="form-control">
                    <label className="label">
                      <span className="label-text">Sponsorship Goal (₱)</span>
                    </label>
                    <input
                      type="number"
                      name="sponsorship.goal"
                      className="input input-bordered"
                      value={formData.sponsorship.goal}
                      onChange={handleChange}
                      min="0"
                      required
                    />
                  </div>
                )}
              </div>
            </div>
          </div>

          {/* Description */}
          <div>
            <label className="block text-sm font-medium text-gray-700">Description</label>
            <textarea
              name="description"
              value={formData.description || ''}
              onChange={handleChange}
              className="textarea textarea-bordered w-full h-32 bg-white"
              required
            />
          </div>

          {/* Action Buttons */}
          <div className="flex justify-end gap-4">
            <button
              type="button"
              onClick={onClose}
              className="btn btn-ghost"
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