"use client";

import React, { useState, useEffect } from "react";
import { useSession } from "next-auth/react";
import {
  Edit2,
  Camera,
  User as UserIcon,
  Mail,
  GraduationCap,
  Building2,
  Phone,
  Globe,
  MapPin,
  Briefcase,
} from "lucide-react";
import EditProfileModal from "@/app/components/EditProfileModal";
import { motion } from "framer-motion";

interface ProfileData {
  name: string;
  email: string;
  graduationYear?: number;
  department?: string;
  bio?: string;
  profilePicture?: string;
  phoneNumber?: string;
  currentLocation?: string;
  currentCompany?: string;
  currentPosition?: string;
  linkedIn?: string;
  website?: string;
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
    phoneNumber: "",
    currentLocation: "",
    currentCompany: "",
    currentPosition: "",
    linkedIn: "",
    website: "",
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
    // Update local state immediately
    setProfileData(updatedProfile);

    try {
      const response = await fetch("/api/alumni/profile", {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(updatedProfile),
      });

      if (!response.ok) {
        // Handle error
        console.error("Failed to update profile");
      }
    } catch (error) {
      console.error("Error updating profile", error);
    }
  };

  return (
    <div className="min-h-screen">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="relative"
      >
        {/* Banner Image */}
        <div className="relative h-[200px] w-full">
          <div className="absolute inset-0 bg-gradient-to-r from-[#1a1f4d]/90 to-[#2a3f8f]/90"></div>
          <div
            className="absolute inset-0 bg-cover bg-center opacity-10"
            style={{ backgroundImage: 'url("/mountains-banner.jpg")' }}
          ></div>
        </div>

        <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8">
          {/* Profile Section */}
          <div className="relative -mt-20">
            {/* Profile Picture */}
            <div className="relative inline-block">
              <div className="w-[168px] h-[168px] rounded-full border-4 border-white/20 bg-white/10 backdrop-blur-sm shadow-lg">
                {profileData.profilePicture ? (
                  <img
                    src={profileData.profilePicture}
                    alt="Profile"
                    className="w-full h-full rounded-full object-cover"
                  />
                ) : (
                  <div className="w-full h-full rounded-full bg-white/10 backdrop-blur-sm flex items-center justify-center">
                    <UserIcon size={80} className="text-white" />
                  </div>
                )}
                <button
                  className="absolute bottom-2 right-2 bg-white/20 backdrop-blur-sm p-2 rounded-full shadow-md hover:bg-white/30 transition border border-white/20"
                  onClick={() => {
                    /* TODO: Implement profile picture upload */
                  }}
                >
                  <Camera size={20} className="text-white" />
                </button>
              </div>
            </div>

            {/* Profile Info */}
            <div className="mt-4">
              <div className="flex justify-between items-start">
                <div>
                  <h1 className="text-2xl font-bold text-white">
                    {profileData.name}
                  </h1>
                  <div className="flex items-center text-gray-200 mt-1">
                    <Mail size={16} className="mr-2" />
                    <p>{profileData.email}</p>
                  </div>
                  {profileData.department && (
                    <div className="flex items-center text-gray-200 mt-1">
                      <Building2 size={16} className="mr-2" />
                      <p>{profileData.department}</p>
                    </div>
                  )}
                  {profileData.graduationYear && (
                    <div className="flex items-center text-gray-200 mt-1">
                      <GraduationCap size={16} className="mr-2" />
                      <p>Class of {profileData.graduationYear}</p>
                    </div>
                  )}
                </div>
                <button
                  onClick={() => setIsEditModalOpen(true)}
                  className="mt-2 inline-flex items-center px-3 py-1.5 border border-white/20 shadow-sm text-sm font-medium rounded-md text-white bg-white/10 backdrop-blur-sm hover:bg-white/20 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-white/20"
                >
                  <Edit2 size={16} className="mr-1.5" />
                  Edit Profile
                </button>
              </div>

              {/* Contact Information */}
              <div className="mt-6 grid grid-cols-1 md:grid-cols-2 gap-4">
                {profileData.phoneNumber && (
                  <div className="flex items-center text-gray-200">
                    <Phone size={16} className="mr-2" />
                    <p>{profileData.phoneNumber}</p>
                  </div>
                )}
                {profileData.currentLocation && (
                  <div className="flex items-center text-gray-200">
                    <MapPin size={16} className="mr-2" />
                    <p>{profileData.currentLocation}</p>
                  </div>
                )}
                {profileData.currentCompany && (
                  <div className="flex items-center text-gray-200">
                    <Briefcase size={16} className="mr-2" />
                    <p>{profileData.currentCompany}</p>
                  </div>
                )}
                {profileData.currentPosition && (
                  <div className="flex items-center text-gray-200">
                    <Briefcase size={16} className="mr-2" />
                    <p>{profileData.currentPosition}</p>
                  </div>
                )}
                {profileData.linkedIn && (
                  <div className="flex items-center text-gray-200">
                    <Globe size={16} className="mr-2" />
                    <a
                      href={profileData.linkedIn}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-blue-300 hover:text-blue-200 hover:underline"
                    >
                      LinkedIn Profile
                    </a>
                  </div>
                )}
                {profileData.website && (
                  <div className="flex items-center text-gray-200">
                    <Globe size={16} className="mr-2" />
                    <a
                      href={profileData.website}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-blue-300 hover:text-blue-200 hover:underline"
                    >
                      Personal Website
                    </a>
                  </div>
                )}
              </div>

              {/* About Section */}
              <div className="mt-8">
                <h2 className="text-xl font-semibold text-white mb-4">
                  About
                </h2>
                <div className="bg-white/10 backdrop-blur-sm rounded-lg p-6">
                  <p className="text-gray-200 whitespace-pre-wrap">
                    {profileData.bio || "No bio available"}
                  </p>
                </div>
              </div>
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
