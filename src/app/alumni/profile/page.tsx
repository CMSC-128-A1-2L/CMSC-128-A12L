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
  Maximize2,
  User,
  BookOpen,
  BriefcaseBusiness,
  FileText,
} from "lucide-react";
import EditProfileModal from "@/app/components/EditProfileModal";
import { motion } from "framer-motion";
import { toast } from 'react-hot-toast';

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
  firstName?: string;
  middleInitial?: string;
  lastName?: string;
  username?: string;
  role?: string;
  dateOfBirth?: string;
  gender?: string;
}

interface Session {
  user: {
    name: string;
    email: string;
    image?: string;
  };
}

export default function AlumniProfile() {
  const { data: session } = useSession() as { data: Session | null };
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [showPasswordFields, setShowPasswordFields] = useState(false);
  const [isFirstNameEditable, setIsFirstNameEditable] = useState(false);
  const [isLastNameEditable, setIsLastNameEditable] = useState(false);
  const [isMiddleInitialEditable, setIsMiddleInitialEditable] = useState(false);
  const [selectedOption, setSelectedOption] = useState('personal');
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
    firstName: "Juan",
    middleInitial: "D",
    lastName: "dela Cruz",
    dateOfBirth: "2002-03-08",
    gender: "",
  });

  useEffect(() => {
    const fetchProfileData = async () => {
      try {
        const response = await fetch("/api/alumni/profile");
        if (!response.ok) throw new Error("Failed to fetch profile data");
          const data = await response.json();
          setProfileData((prevData) => ({
            ...prevData,
            ...data,
          }));
      } catch (error) {
        console.error("Error fetching profile:", error);
        toast.error("Failed to load profile data");
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
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(updatedProfile),
      });

      if (!response.ok) throw new Error("Failed to update profile");
      
      setProfileData(updatedProfile);
      toast.success("Profile updated successfully");
      setIsEditModalOpen(false);
    } catch (error) {
      console.error("Error updating profile:", error);
      toast.error("Failed to update profile");
    }
  };

  return (
    <div className="h-screen overflow-hidden relative">
      {/* Background Elements */}
      <div className="fixed inset-0 bg-[#0f172a]" />
      <div className="fixed inset-0 bg-[url('/grid-pattern.svg')] opacity-5" />
      <div className="fixed inset-0 bg-[url('/noise-pattern.png')] opacity-5" />
      <div className="fixed inset-0 bg-gradient-to-br from-[#1a1f4d]/80 via-[#1a237e]/60 to-[#0d47a1]/40" />
      
      {/* Content */}
      <div className="relative z-10 h-full">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
          className="h-full"
        >
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-full">
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 h-full">
              {/* Left Card - Main Profile */}
              <div className="lg:col-span-5 bg-white/10 backdrop-blur-sm rounded-xl shadow-lg overflow-hidden h-[calc(100vh-6rem)]">
                <div className="p-6 h-full flex flex-col">
                  <div className="flex-grow overflow-y-auto">
                    {/* Profile Picture Square */}
                    <div className="flex flex-col items-center mb-6">
                      <div className="relative mb-3">
                        <div className="w-44 h-44 rounded-lg border-4 border-white/20 bg-white/10">
                {profileData.profilePicture ? (
                  <img
                    src={profileData.profilePicture}
                    alt="Profile"
                              className="w-full h-full rounded-lg object-cover"
                  />
                ) : (
                            <div className="w-full h-full rounded-lg bg-white/10 flex items-center justify-center">
                              <UserIcon size={72} className="text-white" />
                            </div>
                          )}
                        </div>
                        <button className="absolute bottom-2 right-2 p-2 bg-white/20 hover:bg-white/30 rounded-full transition cursor-pointer">
                          <Camera size={22} className="text-white" />
                        </button>
                      </div>
                      <h2 className="text-3xl font-semibold text-white mb-2">Juan dela Cruz</h2>
                      <div className="text-center space-y-1">
                        <p className="text-lg text-white/80">Senior Software Engineer at TechCorp</p>
                        <p className="text-base text-white/60">juan.delacruz@email.com</p>
                        <p className="text-base text-white/60">+63 912 345 6789</p>
                      </div>
                    </div>

                    {/* Divider */}
                    <div className="w-full h-px bg-white/20 my-6"></div>

                    {/* Navigation Buttons */}
                    <div className="space-y-0.5 mb-4">
                      <button 
                        onClick={() => setSelectedOption('personal')}
                        className={`w-full px-3 py-2 text-white font-medium rounded-lg transition-all duration-200 flex items-center gap-2 cursor-pointer ${
                          selectedOption === 'personal' 
                            ? 'bg-white/20 border-l-4 border-white' 
                            : 'hover:bg-white/10'
                        }`}
                      >
                        <User size={24} className={selectedOption === 'personal' ? 'text-white' : 'text-white/60'} />
                        <span className="text-lg">Personal Information</span>
                      </button>
                      <button 
                        onClick={() => setSelectedOption('educational')}
                        className={`w-full px-3 py-2 text-white font-medium rounded-lg transition-all duration-200 flex items-center gap-2 cursor-pointer ${
                          selectedOption === 'educational' 
                            ? 'bg-white/20 border-l-4 border-white' 
                            : 'hover:bg-white/10'
                        }`}
                      >
                        <BookOpen size={24} className={selectedOption === 'educational' ? 'text-white' : 'text-white/60'} />
                        <span className="text-lg">Educational Information</span>
                      </button>
                      <button 
                        onClick={() => setSelectedOption('professional')}
                        className={`w-full px-3 py-2 text-white font-medium rounded-lg transition-all duration-200 flex items-center gap-2 cursor-pointer ${
                          selectedOption === 'professional' 
                            ? 'bg-white/20 border-l-4 border-white' 
                            : 'hover:bg-white/10'
                        }`}
                      >
                        <BriefcaseBusiness size={24} className={selectedOption === 'professional' ? 'text-white' : 'text-white/60'} />
                        <span className="text-lg">Professional Information</span>
                      </button>
                      <button 
                        onClick={() => setSelectedOption('biographical')}
                        className={`w-full px-3 py-2 text-white font-medium rounded-lg transition-all duration-200 flex items-center gap-2 cursor-pointer ${
                          selectedOption === 'biographical' 
                            ? 'bg-white/20 border-l-4 border-white' 
                            : 'hover:bg-white/10'
                        }`}
                      >
                        <FileText size={24} className={selectedOption === 'biographical' ? 'text-white' : 'text-white/60'} />
                        <span className="text-lg">Biographical Information</span>
                      </button>
                    </div>

                    {/* Divider */}
                    <div className="w-full h-px bg-white/20 mb-4"></div>

                    {/* Password Change Section */}
                    <div className="space-y-4">
                      {showPasswordFields && (
                        <>
                          <div className="space-y-2">
                            <label className="block text-sm font-medium text-gray-200">
                              Old Password
                            </label>
                            <input
                              type="password"
                              className="w-full px-3 py-2 bg-white/10 border border-white/20 rounded-lg text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-white/20 focus:border-transparent"
                              placeholder="Enter your current password"
                            />
                          </div>
                          <div className="space-y-2">
                            <label className="block text-sm font-medium text-gray-200">
                              New Password
                            </label>
                            <input
                              type="password"
                              className="w-full px-3 py-2 bg-white/10 border border-white/20 rounded-lg text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-white/20 focus:border-transparent"
                              placeholder="Enter your new password"
                            />
                          </div>
                        </>
                      )}
                    </div>
                  </div>

                  {/* Change Password Button */}
                  <div className="mt-auto pt-4">
                <button
                      className="w-full px-4 py-2 bg-[#0f172a] hover:bg-[#1a1f4d] text-white font-medium rounded-lg transition border border-white/20 cursor-pointer text-lg"
                      onClick={() => setShowPasswordFields(!showPasswordFields)}
                    >
                      {showPasswordFields ? "Set New Password" : "Change Password"}
                </button>
                  </div>
                </div>
              </div>

              {/* Right Column - Single Card */}
              <div className="lg:col-span-7 h-[calc(100vh-6rem)]">
                <div className="bg-white/10 backdrop-blur-sm rounded-xl shadow-lg p-6 h-full">
                  {/* Personal Information Section */}
                  {selectedOption === 'personal' && (
                    <div className="space-y-4">
                      <h2 className="text-2xl font-semibold text-white mb-4">
                        Personal Information
                      </h2>
                      <div className="space-y-3">
                        {/* First Row: First Name, Middle Initial, and Last Name */}
                        <div className="grid grid-cols-[2fr_1fr_2fr] gap-4">
                          <div className="space-y-1">
                            <label className="block text-base font-medium text-gray-200">
                              First Name
                            </label>
                            <div className="relative">
                              <input
                                type="text"
                                className="w-full px-3 py-2 text-lg bg-white/10 border border-white/20 rounded-lg text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-white/20 focus:border-transparent pr-10"
                                placeholder="Enter your first name"
                                value={profileData.firstName || ""}
                                onChange={(e) => {
                                  setProfileData({ ...profileData, firstName: e.target.value });
                                }}
                                readOnly={!isFirstNameEditable}
                              />
                              <button
                                className="absolute right-2 top-1/2 -translate-y-1/2 text-white/60 hover:text-white transition-colors"
                                onClick={() => setIsFirstNameEditable(!isFirstNameEditable)}
                              >
                                <Edit2 size={18} />
                              </button>
                            </div>
                          </div>
                          <div className="space-y-1">
                            <label className="block text-base font-medium text-gray-200">
                              M.I.
                            </label>
                            <div className="relative">
                              <input
                                type="text"
                                className="w-full px-2 py-2 text-lg bg-white/10 border border-white/20 rounded-lg text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-white/20 focus:border-transparent pr-8"
                                placeholder="M.I."
                                value={profileData.middleInitial || ""}
                                onChange={(e) => {
                                  setProfileData({ ...profileData, middleInitial: e.target.value });
                                }}
                                readOnly={!isMiddleInitialEditable}
                                maxLength={2}
                              />
                              <button
                                className="absolute right-1 top-1/2 -translate-y-1/2 text-white/60 hover:text-white transition-colors"
                                onClick={() => setIsMiddleInitialEditable(!isMiddleInitialEditable)}
                              >
                                <Edit2 size={18} />
                              </button>
                            </div>
                          </div>
                          <div className="space-y-1">
                            <label className="block text-base font-medium text-gray-200">
                              Last Name
                            </label>
                            <div className="relative">
                              <input
                                type="text"
                                className="w-full px-3 py-2 text-lg bg-white/10 border border-white/20 rounded-lg text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-white/20 focus:border-transparent pr-10"
                                placeholder="Enter your last name"
                                value={profileData.lastName || ""}
                                onChange={(e) => {
                                  setProfileData({ ...profileData, lastName: e.target.value });
                                }}
                                readOnly={!isLastNameEditable}
                              />
                              <button
                                className="absolute right-2 top-1/2 -translate-y-1/2 text-white/60 hover:text-white transition-colors"
                                onClick={() => setIsLastNameEditable(!isLastNameEditable)}
                              >
                                <Edit2 size={18} />
                              </button>
                            </div>
                          </div>
                        </div>

                        {/* Second Row: Date of Birth and Gender */}
                        <div className="grid grid-cols-2 gap-4">
                          <div className="space-y-1">
                            <label className="block text-base font-medium text-gray-200">
                              Date of Birth
                            </label>
                            <input
                              type="date"
                              className="w-full px-3 py-2 text-lg bg-white/10 border border-white/20 rounded-lg text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-white/20 focus:border-transparent"
                              value={profileData.dateOfBirth || ""}
                              onChange={(e) => {
                                setProfileData({ ...profileData, dateOfBirth: e.target.value });
                              }}
                              readOnly
                            />
                          </div>
                          <div className="space-y-1">
                            <label className="block text-base font-medium text-gray-200">
                              Gender
                            </label>
                            <div className="relative">
                              <select
                                className="w-full px-3 py-2 text-lg bg-white/10 border border-white/20 rounded-lg text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-white/20 focus:border-transparent appearance-none pr-10"
                                value={profileData.gender || ""}
                                onChange={(e) => {
                                  setProfileData({ ...profileData, gender: e.target.value });
                                }}
                                style={{
                                  backgroundImage: `url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' fill='none' viewBox='0 0 24 24' stroke='%23ffffff'%3E%3Cpath stroke-linecap='round' stroke-linejoin='round' stroke-width='2' d='M19 9l-7 7-7-7'%3E%3C/path%3E%3C/svg%3E")`,
                                  backgroundRepeat: 'no-repeat',
                                  backgroundPosition: 'right 0.75rem center',
                                  backgroundSize: '1.25rem'
                                }}
                              >
                                <option value="" className="bg-[#0f172a] text-white">Select gender</option>
                                <option value="male" className="bg-[#0f172a] text-white">Male</option>
                                <option value="female" className="bg-[#0f172a] text-white">Female</option>
                                <option value="other" className="bg-[#0f172a] text-white">Other</option>
                              </select>
                            </div>
              </div>
            </div>

                        {/* Third Row: Email and Contact Number */}
                        <div className="grid grid-cols-2 gap-4">
                          <div className="space-y-1">
                            <label className="block text-base font-medium text-gray-200">
                              Email
                            </label>
                            <div className="relative">
                              <input
                                type="email"
                                className="w-full px-3 py-2 text-lg bg-white/10 border border-white/20 rounded-lg text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-white/20 focus:border-transparent pr-10"
                                placeholder="Enter your email"
                                value="juan.delacruz@email.com"
                                readOnly
                              />
                              <button
                                className="absolute right-2 top-1/2 -translate-y-1/2 text-white/60 hover:text-white transition-colors"
                                onClick={() => {}}
                              >
                                <Edit2 size={18} />
                              </button>
                            </div>
                          </div>
                          <div className="space-y-1">
                            <label className="block text-base font-medium text-gray-200">
                              Contact Number
                            </label>
                            <div className="relative">
                              <input
                                type="tel"
                                className="w-full px-3 py-2 text-lg bg-white/10 border border-white/20 rounded-lg text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-white/20 focus:border-transparent pr-10"
                                placeholder="Enter your contact number"
                                value="+63 912 345 6789"
                                readOnly
                              />
                              <button
                                className="absolute right-2 top-1/2 -translate-y-1/2 text-white/60 hover:text-white transition-colors"
                                onClick={() => {}}
                              >
                                <Edit2 size={18} />
                              </button>
                            </div>
                          </div>
                        </div>
                  </div>
                    </div>
                  )}

                  {/* Educational Information Section */}
                  {selectedOption === 'educational' && (
                    <div className="space-y-4">
                      <h2 className="text-2xl font-semibold text-white mb-4">
                        Educational Information
                      </h2>
                      <div className="space-y-3">
                        {/* College/University */}
                        <div className="space-y-1">
                          <label className="block text-base font-medium text-gray-200">
                            College/University
                          </label>
                          <div className="relative">
                            <input
                              type="text"
                              className="w-full px-3 py-2 text-lg bg-white/10 border border-white/20 rounded-lg text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-white/20 focus:border-transparent pr-10"
                              placeholder="Enter your college/university"
                              value="University of the Philippines"
                              readOnly
                            />
                            <button
                              className="absolute right-2 top-1/2 -translate-y-1/2 text-white/60 hover:text-white transition-colors"
                              onClick={() => {}}
                            >
                              <Edit2 size={18} />
                            </button>
                          </div>
                        </div>

                        {/* Degree Earned */}
                        <div className="space-y-1">
                          <label className="block text-base font-medium text-gray-200">
                            Degree Earned
                          </label>
                          <div className="relative">
                            <input
                              type="text"
                              className="w-full px-3 py-2 text-lg bg-white/10 border border-white/20 rounded-lg text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-white/20 focus:border-transparent pr-10"
                              placeholder="Enter your degree"
                              value="Bachelor of Science in Computer Science"
                              readOnly
                            />
                            <button
                              className="absolute right-2 top-1/2 -translate-y-1/2 text-white/60 hover:text-white transition-colors"
                              onClick={() => {}}
                            >
                              <Edit2 size={18} />
                            </button>
                          </div>
                        </div>

                        {/* Graduation Year and Department */}
                        <div className="grid grid-cols-2 gap-4">
                          <div className="space-y-1">
                            <label className="block text-base font-medium text-gray-200">
                              Graduation Year
                            </label>
                            <input
                              type="number"
                              className="w-full px-3 py-2 text-lg bg-white/10 border border-white/20 rounded-lg text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-white/20 focus:border-transparent"
                              placeholder="Enter graduation year"
                              value={profileData.graduationYear || ""}
                              onChange={(e) => {
                                setProfileData({ ...profileData, graduationYear: parseInt(e.target.value) });
                              }}
                            />
                          </div>
                          <div className="space-y-1">
                            <label className="block text-base font-medium text-gray-200">
                              Department
                            </label>
                            <input
                              type="text"
                              className="w-full px-3 py-2 text-lg bg-white/10 border border-white/20 rounded-lg text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-white/20 focus:border-transparent"
                              placeholder="Enter department"
                              value={profileData.department || ""}
                              onChange={(e) => {
                                setProfileData({ ...profileData, department: e.target.value });
                              }}
                            />
                          </div>
                        </div>

                        {/* Club/Organization */}
                        <div className="space-y-1">
                          <label className="block text-base font-medium text-gray-200">
                            Club/Organization
                          </label>
                          <div className="relative">
                            <input
                              type="text"
                              className="w-full px-3 py-2 text-lg bg-white/10 border border-white/20 rounded-lg text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-white/20 focus:border-transparent pr-10"
                              placeholder="Enter your club/organization"
                              value="UP Computer Science Society"
                              readOnly
                            />
                            <button
                              className="absolute right-2 top-1/2 -translate-y-1/2 text-white/60 hover:text-white transition-colors"
                              onClick={() => {}}
                            >
                              <Edit2 size={18} />
                            </button>
                          </div>
                        </div>
                      </div>
                    </div>
                  )}

                  {/* Professional Information Section */}
                  {selectedOption === 'professional' && (
                    <div className="space-y-4">
                      <h2 className="text-2xl font-semibold text-white mb-4">
                        Professional Information
                      </h2>
                      <div className="space-y-3">
                        <div className="grid grid-cols-2 gap-4">
                          <div className="space-y-1">
                            <label className="block text-base font-medium text-gray-200">
                              Current Company
                            </label>
                            <input
                              type="text"
                              className="w-full px-3 py-2 text-lg bg-white/10 border border-white/20 rounded-lg text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-white/20 focus:border-transparent"
                              placeholder="Enter current company"
                              value={profileData.currentCompany || ""}
                              onChange={(e) => {
                                setProfileData({ ...profileData, currentCompany: e.target.value });
                              }}
                            />
                </div>
                          <div className="space-y-1">
                            <label className="block text-base font-medium text-gray-200">
                              Current Position
                            </label>
                            <input
                              type="text"
                              className="w-full px-3 py-2 text-lg bg-white/10 border border-white/20 rounded-lg text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-white/20 focus:border-transparent"
                              placeholder="Enter current position"
                              value={profileData.currentPosition || ""}
                              onChange={(e) => {
                                setProfileData({ ...profileData, currentPosition: e.target.value });
                              }}
                            />
              </div>
                  </div>
                  </div>
                  </div>
                )}

                  {/* Biographical Information Section */}
                  {selectedOption === 'biographical' && (
                    <div className="space-y-4">
                      <h2 className="text-2xl font-semibold text-white mb-4">
                        Biographical Information
                      </h2>
                      <div className="space-y-3">
                        <div className="space-y-1">
                          <label className="block text-base font-medium text-gray-200">
                            Bio
                          </label>
                          <textarea
                            className="w-full px-3 py-2 text-lg bg-white/10 border border-white/20 rounded-lg text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-white/20 focus:border-transparent min-h-[200px] resize-none"
                            placeholder="Tell us about yourself..."
                            value={profileData.bio || ""}
                            onChange={(e) => {
                              setProfileData({ ...profileData, bio: e.target.value });
                            }}
                          />
                  </div>
                  </div>
                  </div>
                )}
                </div>
              </div>
            </div>
          </div>
        </motion.div>
        </div>

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
