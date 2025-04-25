"use client";

import React, { useState } from "react";
import { Dialog, Transition } from "@headlessui/react";
import { Fragment } from "react";
import { X } from "lucide-react";

interface ProfileData {
  name: string;
  email: string;
  graduationYear?: number;
  course?: string;
  bio?: string;
  profilePicture?: string;
  phoneNumber?: string;
  currentLocation?: string;
  currentCompany?: string;
  currentPosition?: string;
  linkedIn?: string;
  website?: string;
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
  const [formData, setFormData] = useState<ProfileData>(profileData);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onUpdateProfile(formData);
  };

  const handleChange = (
    e: React.ChangeEvent<
      HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement
    >
  ) => {
    const { name, value } = e.target;
    setFormData(prevData => ({
      ...prevData,
      [name]: value,
    }));
  };

  return (
    <Transition appear show={isOpen} as={Fragment}>
      <Dialog as="div" className="relative z-50" onClose={onClose}>
        <Transition.Child
          as={Fragment}
          enter="ease-out duration-300"
          enterFrom="opacity-0"
          enterTo="opacity-100"
          leave="ease-in duration-200"
          leaveFrom="opacity-100"
          leaveTo="opacity-0"
        >
          <div className="fixed inset-0 bg-black/25" />
        </Transition.Child>

        <div className="fixed inset-0 overflow-y-auto">
          <div className="flex min-h-full items-center justify-center p-4 text-center">
            <Transition.Child
              as={Fragment}
              enter="ease-out duration-300"
              enterFrom="opacity-0 scale-95"
              enterTo="opacity-100 scale-100"
              leave="ease-in duration-200"
              leaveFrom="opacity-100 scale-100"
              leaveTo="opacity-0 scale-95"
            >
              <Dialog.Panel className="w-full max-w-2xl transform overflow-hidden rounded-2xl bg-white p-6 text-left align-middle shadow-xl transition-all">
                <Dialog.Title
                  as="div"
                  className="flex justify-between items-center mb-6 border-b pb-4"
                >
                  <h3 className="text-2xl font-semibold text-gray-900">
                    Edit Profile
                  </h3>
                  <button
                    onClick={onClose}
                    className="text-gray-400 hover:text-gray-500 transition-colors"
                  >
                    <X size={24} />
                  </button>
                </Dialog.Title>

                <form onSubmit={handleSubmit} className="space-y-8">
                  <div className="space-y-6">
                    <div className="bg-gray-50 p-4 rounded-lg">
                      <h4 className="text-lg font-medium text-gray-900 mb-4">
                        Basic Information
                      </h4>
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        <div>
                          <label
                            htmlFor="name"
                            className="block text-sm font-medium text-gray-700 mb-1"
                          >
                            Full Name
                          </label>
                          <input
                            type="text"
                            name="name"
                            id="name"
                            value={formData.name}
                            onChange={handleChange}
                            className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-[#1a1f4d] focus:ring-[#1a1f4d] sm:text-sm text-black px-4 py-2"
                          />
                        </div>

                        <div>
                          <label
                            htmlFor="email"
                            className="block text-sm font-medium text-gray-700 mb-1"
                          >
                            Email
                          </label>
                          <input
                            type="email"
                            name="email"
                            id="email"
                            value={formData.email}
                            onChange={handleChange}
                            className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-[#1a1f4d] focus:ring-[#1a1f4d] sm:text-sm text-black px-4 py-2"
                          />
                        </div>

                        <div>
                          <label
                            htmlFor="graduationYear"
                            className="block text-sm font-medium text-gray-700 mb-1"
                          >
                            Graduation Year
                          </label>
                          <input
                            type="number"
                            name="graduationYear"
                            id="graduationYear"
                            value={formData.graduationYear}
                            onChange={handleChange}
                            className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-[#1a1f4d] focus:ring-[#1a1f4d] sm:text-sm text-black px-4 py-2"
                          />
                        </div>

                        <div>
                          <label
                            htmlFor="course"
                            className="block text-sm font-medium text-gray-700 mb-1"
                          >
                            Course Graduated
                          </label>
                          <input
                            type="text"
                            name="course"
                            id="course"
                            value={formData.course}
                            onChange={handleChange}
                            className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-[#1a1f4d] focus:ring-[#1a1f4d] sm:text-sm text-black px-4 py-2"
                          />
                        </div>
                      </div>
                    </div>

                    <div className="bg-gray-50 p-4 rounded-lg">
                      <h4 className="text-lg font-medium text-gray-900 mb-4">
                        Contact Information
                      </h4>
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        <div>
                          <label
                            htmlFor="phoneNumber"
                            className="block text-sm font-medium text-gray-700 mb-1"
                          >
                            Phone Number
                          </label>
                          <input
                            type="tel"
                            name="phoneNumber"
                            id="phoneNumber"
                            value={formData.phoneNumber}
                            onChange={handleChange}
                            className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-[#1a1f4d] focus:ring-[#1a1f4d] sm:text-sm text-black px-4 py-2"
                          />
                        </div>

                        <div>
                          <label
                            htmlFor="currentLocation"
                            className="block text-sm font-medium text-gray-700 mb-1"
                          >
                            Current Location
                          </label>
                          <input
                            type="text"
                            name="currentLocation"
                            id="currentLocation"
                            value={formData.currentLocation}
                            onChange={handleChange}
                            className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-[#1a1f4d] focus:ring-[#1a1f4d] sm:text-sm text-black px-4 py-2"
                          />
                        </div>

                        <div>
                          <label
                            htmlFor="currentCompany"
                            className="block text-sm font-medium text-gray-700 mb-1"
                          >
                            Current Company
                          </label>
                          <input
                            type="text"
                            name="currentCompany"
                            id="currentCompany"
                            value={formData.currentCompany}
                            onChange={handleChange}
                            className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-[#1a1f4d] focus:ring-[#1a1f4d] sm:text-sm text-black px-4 py-2"
                          />
                        </div>

                        <div>
                          <label
                            htmlFor="currentPosition"
                            className="block text-sm font-medium text-gray-700 mb-1"
                          >
                            Current Position
                          </label>
                          <input
                            type="text"
                            name="currentPosition"
                            id="currentPosition"
                            value={formData.currentPosition}
                            onChange={handleChange}
                            className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-[#1a1f4d] focus:ring-[#1a1f4d] sm:text-sm text-black px-4 py-2"
                          />
                        </div>
                      </div>
                    </div>

                    <div className="bg-gray-50 p-4 rounded-lg">
                      <h4 className="text-lg font-medium text-gray-900 mb-4">
                        Social Links
                      </h4>
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        <div>
                          <label
                            htmlFor="linkedIn"
                            className="block text-sm font-medium text-gray-700 mb-1"
                          >
                            LinkedIn Profile URL
                          </label>
                          <input
                            type="url"
                            name="linkedIn"
                            id="linkedIn"
                            value={formData.linkedIn}
                            onChange={handleChange}
                            className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-[#1a1f4d] focus:ring-[#1a1f4d] sm:text-sm text-black px-4 py-2"
                          />
                        </div>

                        <div>
                          <label
                            htmlFor="website"
                            className="block text-sm font-medium text-gray-700 mb-1"
                          >
                            Personal Website URL
                          </label>
                          <input
                            type="url"
                            name="website"
                            id="website"
                            value={formData.website}
                            onChange={handleChange}
                            className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-[#1a1f4d] focus:ring-[#1a1f4d] sm:text-sm text-black px-4 py-2"
                          />
                        </div>
                      </div>
                    </div>

                    <div className="bg-gray-50 p-4 rounded-lg">
                      <h4 className="text-lg font-medium text-gray-900 mb-4">
                        About
                      </h4>
                      <div>
                        <label
                          htmlFor="bio"
                          className="block text-sm font-medium text-gray-700 mb-1"
                        >
                          Bio
                        </label>
                        <textarea
                          name="bio"
                          id="bio"
                          rows={4}
                          value={formData.bio}
                          onChange={handleChange}
                          className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-[#1a1f4d] focus:ring-[#1a1f4d] sm:text-sm text-black px-4 py-2"
                        />
                      </div>
                    </div>
                  </div>

                  <div className="mt-6 flex justify-end space-x-3 border-t pt-4">
                    <button
                      type="button"
                      onClick={onClose}
                      className="inline-flex justify-center rounded-md border border-gray-300 bg-white px-4 py-2 text-sm font-medium text-gray-700 shadow-sm hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-[#1a1f4d] focus:ring-offset-2 transition-colors"
                    >
                      Cancel
                    </button>
                    <button
                      type="submit"
                      className="inline-flex justify-center rounded-md border border-transparent bg-[#1a1f4d] px-4 py-2 text-sm font-medium text-white shadow-sm hover:bg-[#0d47a1] focus:outline-none focus:ring-2 focus:ring-[#1a1f4d] focus:ring-offset-2 transition-colors"
                    >
                      Save Changes
                    </button>
                  </div>
                </form>
              </Dialog.Panel>
            </Transition.Child>
          </div>
        </div>
      </Dialog>
    </Transition>
  );
}
