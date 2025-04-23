"use client";

import React, { useState, useEffect } from "react";
import { useSession } from "next-auth/react";
import { Edit2, Camera, User as UserIcon } from "lucide-react";
import EditProfileModal from "@/app/components/EditProfileModal";
import { motion } from "framer-motion";

interface ProfileData {
  name: string;
  email: string;
  graduationYear?: number;
  department?: string;
  bio?: string;
  profilePicture?: string;
}

export default function AlumniProfile() {
  const { data: session } = useSession();
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [profileData, setProfileData] = useState<ProfileData>({
    name: session?.user?.name || "",
    email: session?.user?.email || "",
    graduationYear: undefined,
    department: "",
    bio: "",
    profilePicture: session?.user?.image || "",
  });

  useEffect(() => {
    // Fetch detailed profile data from API
    const fetchProfileData = async () => {
      try {
        const response = await fetch("/api/alumni/profile");
        if (response.ok) {
          const data = await response.json();
          setProfileData((prevData) => ({
            ...prevData,
            ...data,
          }));
        }
      } catch (error) {
        console.error("Failed to fetch profile data", error);
      }
    };

    if (session?.user) {
      fetchProfileData();
    }
  }, [session]);

  const handleUpdateProfile = async (updatedProfile: ProfileData) => {
    try {
      const response = await fetch("/api/alumni/profile", {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(updatedProfile),
      });

      if (response.ok) {
        setProfileData(updatedProfile);
        setIsEditModalOpen(false);
      } else {
        // Handle error
        console.error("Failed to update profile");
      }
    } catch (error) {
      console.error("Error updating profile", error);
    }
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="bg-white shadow-sm"
      >
        {/* Banner Image */}
        <div className="relative h-[200px] bg-gradient-to-r from-[#1a1f4d] to-[#0d47a1] w-full">
          {/* You can replace this with an actual banner image */}
          <div
            className="absolute inset-0 bg-cover bg-center"
            style={{ backgroundImage: 'url("/mountains-banner.jpg")' }}
          ></div>
          <div className="absolute inset-0 bg-black/20"></div>
        </div>

        <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8">
          {/* Profile Section */}
          <div className="relative -mt-[100px]">
            {/* Profile Picture */}
            <div className="relative inline-block">
              <div className="w-[168px] h-[168px] rounded-full border-4 border-white bg-white shadow-lg">
                {profileData.profilePicture ? (
                  <img
                    src={profileData.profilePicture}
                    alt="Profile"
                    className="w-full h-full rounded-full object-cover"
                  />
                ) : (
                  <div className="w-full h-full rounded-full bg-gray-100 flex items-center justify-center">
                    <UserIcon size={80} className="text-gray-400" />
                  </div>
                )}
                <button
                  className="absolute bottom-2 right-2 bg-white p-2 rounded-full shadow-md hover:bg-gray-50 transition border border-gray-200"
                  onClick={() => {
                    /* TODO: Implement profile picture upload */
                  }}
                >
                  <Camera size={20} className="text-gray-700" />
                </button>
              </div>
            </div>

            {/* Profile Info */}
            <div className="mt-4 pb-4 border-b border-gray-200">
              <div className="flex justify-between items-start">
                <div>
                  <h1 className="text-2xl font-bold text-gray-900">
                    {profileData.name}
                  </h1>
                  <p className="text-lg text-gray-600 mt-1">
                    {profileData.email}
                  </p>
                  {profileData.department && (
                    <p className="text-base text-gray-600 mt-1">
                      {profileData.department}
                    </p>
                  )}
                  <p className="text-sm text-gray-500 mt-2">
                    {profileData.graduationYear
                      ? `Class of ${profileData.graduationYear}`
                      : ""}
                  </p>
                </div>
                <button
                  onClick={() => setIsEditModalOpen(true)}
                  className="mt-2 inline-flex items-center px-3 py-1.5 border border-gray-300 shadow-sm text-sm font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-[#1a1f4d]"
                >
                  <Edit2 size={16} className="mr-1.5" />
                  Edit Profile
                </button>
              </div>
            </div>

            {/* About Section */}
            <div className="py-6">
              <h2 className="text-xl font-semibold text-gray-900 mb-4">
                About
              </h2>
              <p className="text-gray-600 whitespace-pre-wrap">
                {profileData.bio || "No bio available"}
              </p>
            </div>
          </div>
        </div>
      </motion.div>

      {/* Edit Profile Modal */}
      {isEditModalOpen && (
        <EditProfileModal
          isOpen={isEditModalOpen}
          onClose={() => setIsEditModalOpen(false)}
          profileData={profileData}
          onUpdateProfile={handleUpdateProfile}
        />
      )}
    </div>
  );
}
