"use client";

import React, { useState, FormEvent } from "react";
import { X } from "lucide-react";
import { motion } from "framer-motion";

interface ProfileData {
  name: string;
  email: string;
  graduationYear?: number;
  department?: string;
  bio?: string;
  profilePicture?: string;
}

interface EditProfileModalProps {
  isOpen: boolean;
  onClose: () => void;
  profileData: ProfileData;
  onUpdateProfile: (updatedProfile: ProfileData) => void;
}

export default function EditProfileModal({
  isOpen,
  onClose,
  profileData,
  onUpdateProfile,
}: EditProfileModalProps) {
  const [formData, setFormData] = useState<ProfileData>({ ...profileData });

  const handleSubmit = (e: FormEvent) => {
    e.preventDefault();
    onUpdateProfile(formData);
  };

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: name === "graduationYear" ? parseInt(value) : value,
    }));
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/30">
      <motion.div
        initial={{ opacity: 0, scale: 0.9 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 0.3 }}
        className="bg-white rounded-xl shadow-2xl w-full max-w-md mx-4"
      >
        <div className="p-6 border-b flex justify-between items-center">
          <h2 className="text-xl font-bold text-gray-900">Edit Profile</h2>
          <button
            onClick={onClose}
            className="text-gray-600 hover:text-gray-900 transition"
            aria-label="Close"
          >
            <X size={24} />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="p-6 space-y-4">
          <div>
            <label
              htmlFor="name"
              className="block text-sm font-medium text-gray-700"
            >
              Full Name
            </label>
            <input
              type="text"
              id="name"
              name="name"
              value={formData.name}
              onChange={handleChange}
              required
              className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-[#1a1f4d] focus:ring focus:ring-[#1a1f4d]/20 text-black"
            />
          </div>

          <div>
            <label
              htmlFor="email"
              className="block text-sm font-medium text-gray-700"
            >
              Email Address
            </label>
            <input
              type="email"
              id="email"
              name="email"
              value={formData.email}
              onChange={handleChange}
              required
              disabled
              className="mt-1 block w-full rounded-md border-gray-300 bg-gray-100 shadow-sm text-black"
            />
          </div>

          <div>
            <label
              htmlFor="graduationYear"
              className="block text-sm font-medium text-gray-700 "
            >
              Graduation Year
            </label>
            <input
              type="number"
              id="graduationYear"
              name="graduationYear"
              value={formData.graduationYear || ""}
              onChange={handleChange}
              min="1900"
              max={new Date().getFullYear()}
              className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-[#1a1f4d] focus:ring focus:ring-[#1a1f4d]/20 text-black"
            />
          </div>

          <div>
            <label
              htmlFor="department"
              className="block text-sm font-medium text-gray-700 "
            >
              Department
            </label>
            <input
              type="text"
              id="department"
              name="department"
              value={formData.department || ""}
              onChange={handleChange}
              className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-[#1a1f4d] focus:ring focus:ring-[#1a1f4d]/20 text-black"
            />
          </div>

          <div>
            <label
              htmlFor="bio"
              className="block text-sm font-medium text-gray-700"
            >
              Bio
            </label>
            <textarea
              id="bio"
              name="bio"
              rows={4}
              value={formData.bio || ""}
              onChange={handleChange}
              className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-[#1a1f4d] focus:ring focus:ring-[#1a1f4d]/20 text-black"
            />
          </div>

          <div className="flex justify-end space-x-3 pt-4">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 text-gray-600 hover:bg-gray-100 rounded-md transition"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="px-4 py-2 bg-[#1a1f4d] text-white rounded-md hover:bg-[#0d47a1] transition"
            >
              Save Changes
            </button>
          </div>
        </form>
      </motion.div>
    </div>
  );
}
