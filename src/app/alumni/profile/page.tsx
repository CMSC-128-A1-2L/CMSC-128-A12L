"use client";

import React, { useState, useEffect, useRef } from "react";
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
  Linkedin
} from "lucide-react";
import EditProfileModal from "@/app/components/EditProfileModal";
import { motion } from "framer-motion";
import { toast } from 'react-hot-toast';
import debounce from 'lodash/debounce';
import { COUNTRIES, validatePhoneNumber } from '@/lib/countries';

// Add validation functions at the top level
const CURRENT_YEAR = new Date().getFullYear();
const FOUNDING_YEAR = 1909; // UPLB founding year

const validateGraduationYear = (year: number) => {
  return year >= FOUNDING_YEAR && year <= CURRENT_YEAR;
};

const validateUrl = (url: string) => {
  try {
    new URL(url);
    return true;
  } catch {
    return false;
  }
};

// Add these interfaces before the component
interface ValidationErrors {
  graduationYear?: string;
  phoneNumber?: string;
  currentLocation?: string;
  department?: string;
  bio?: string;
  linkedIn?: string;
  website?: string;
}

interface ProfileData {
  name: string;
  email: string;
  graduationYear?: number;
  department?: string;
  bio?: string;
  imageUrl?: string; // Changed from profilePicture to imageUrl
  phoneNumber?: string;
  currentLocation?: string;
  currentCompany?: string;
  currentPosition?: string;
  linkedIn?: string;
  website?: string;
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
  const [isEditMode, setIsEditMode] = useState(false);
  const [profileData, setProfileData] = useState<ProfileData>({
    name: session?.user?.name || "",
    email: session?.user?.email || "",
    graduationYear: undefined,
    department: "",
    bio: "",
    imageUrl: session?.user?.image || "", // Changed from profilePicture to imageUrl
    phoneNumber: "",
    currentLocation: "",
    currentCompany: "",
    currentPosition: "",
    linkedIn: "",
    website: ""
  });
  const [phoneFormat, setPhoneFormat] = useState('PH');
  const [validationErrors, setValidationErrors] = useState<ValidationErrors>({});
  const [backupData, setBackupData] = useState<ProfileData | null>(null);

  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleImageUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    if (!e.target.files || !e.target.files[0]) return;

    const file = e.target.files[0];

    // Check file size
    if (file.size > 3 * 1024 * 1024) {
      toast.error('Image size must be less than 3MB');
      return;
    }

    // Check file type
    if (!file.type.startsWith('image/')) {
      toast.error('File must be an image (PNG or JPEG)');
      return;
    }

    try {
      // Show loading toast
      const loadingToast = toast.loading('Uploading image...');

      // First upload to Cloudinary
      const formData = new FormData();
      formData.append('file', file);

      const uploadResponse = await fetch('/api/cloudinary/upload_profile_image', {
        method: 'POST',
        body: formData,
      });

      if (!uploadResponse.ok) {
        throw new Error('Failed to upload image');
      }

      const { url, public_id } = await uploadResponse.json();

      // Then update the user profile with the new image URL
      const updateResponse = await fetch('/api/users/profile', {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          ...profileData,
          imageUrl: url, // Changed from profilePicture to imageUrl
          cloudinaryPublicId: public_id // Store this if you need to manage/delete images later
        }),
      });

      if (!updateResponse.ok) {
        throw new Error('Failed to update profile');
      }

      // Update local state
      setProfileData(prev => ({
        ...prev,
        imageUrl: url // Changed from profilePicture to imageUrl
      }));

      // Dismiss loading toast and show success
      toast.dismiss(loadingToast);
      toast.success('Profile picture updated successfully');
    } catch (error) {
      console.error('Error:', error);
      toast.error('Failed to update profile picture');
    }
  };

  useEffect(() => {
    const fetchProfileData = async () => {
      try {
        const response = await fetch("/api/users/profile");
        if (!response.ok) throw new Error("Failed to fetch profile data");
        const data = await response.json();
        setProfileData(prev => ({
          ...prev,
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

  // Add validation handler
  const handleValidation = debounce((field: string, value: any) => {
    const errors = { ...validationErrors };

    switch (field) {
      case 'graduationYear':
        if (value && !validateGraduationYear(value)) {
          errors.graduationYear = `Year must be between ${FOUNDING_YEAR} and ${CURRENT_YEAR}`;
        } else {
          delete errors.graduationYear;
        }
        break;

      case 'phoneNumber':
        if (value && !validatePhoneNumber(value, phoneFormat)) {
          errors.phoneNumber = 'Invalid phone number format';
        } else {
          delete errors.phoneNumber;
        }
        break;

      case 'currentLocation':
        if (value?.length > 100) {
          errors.currentLocation = 'Location must be less than 100 characters';
        } else {
          delete errors.currentLocation;
        }
        break;

      case 'department':
        if (value?.length > 100) {
          errors.department = 'Department must be less than 100 characters';
        } else {
          delete errors.department;
        }
        break;

      case 'bio':
        if (value?.length > 500) {
          errors.bio = 'Bio must be less than 500 characters';
        } else {
          delete errors.bio;
        }
        break;

      case 'linkedIn':
        if (value && !value.startsWith('https://www.linkedin.com/')) {
          errors.linkedIn = 'Must be a valid LinkedIn URL';
        } else {
          delete errors.linkedIn;
        }
        break;

      case 'website':
        if (value && !validateUrl(value)) {
          errors.website = 'Must be a valid URL';
        } else {
          delete errors.website;
        }
        break;
    }

    setValidationErrors(errors);
  }, 300);

  // Modify handleSaveProfile to check for validation errors
  const handleSaveProfile = async () => {
    // Check if there are any validation errors
    if (Object.keys(validationErrors).length > 0) {
      toast.error('Please fix validation errors before saving');
      return;
    }

    try {
      const response = await fetch("/api/users/profile", {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(profileData),
      });

      if (!response.ok) throw new Error("Failed to update profile");

      toast.success("Profile updated successfully");
      setBackupData(null); // Clear backup after successful save
      setIsEditMode(false);
    } catch (error) {
      console.error("Error updating profile:", error);
      toast.error("Failed to update profile");
    }
  };

  // Add this right before the return statement
  const canEdit = !isEditMode ? "readOnly" : "";

  // Modify the edit mode handling
  const handleEditMode = (isEditing: boolean) => {
    if (isEditing) {
      // Store current data as backup before entering edit mode
      setBackupData(profileData);
    } else {
      // Restore from backup when canceling
      if (backupData) {
        setProfileData(backupData);
        setValidationErrors({});
      }
      setBackupData(null);
    }
    setIsEditMode(isEditing);
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
          {/* Mobile View */}
          <div className="lg:hidden h-full overflow-y-auto">
            <div className="p-4">
              {/* Profile Picture and Basic Info */}
              <div className="flex flex-col items-center mb-6">
                <div className="relative mb-3">
                  <input
                    type="file"
                    ref={fileInputRef}
                    className="hidden"
                    accept="image/png,image/jpeg,image/jpg"
                    onChange={handleImageUpload}
                    onClick={(e) => (e.currentTarget.value = '')}
                  />
                  <div className="w-32 h-32 rounded-lg border-4 border-white/20 bg-white/10">
                    {profileData.imageUrl ? (
                      <img
                        src={profileData.imageUrl}
                        alt="Profile"
                        className="w-full h-full rounded-lg object-cover"
                      />
                    ) : (
                      <div className="w-full h-full rounded-lg bg-white/10 flex items-center justify-center">
                        <UserIcon size={48} className="text-white" />
                      </div>
                    )}
                  </div>
                  <button 
                    className="absolute bottom-2 right-2 p-2 bg-white/20 hover:bg-white/30 rounded-full transition cursor-pointer"
                    onClick={() => fileInputRef.current?.click()}
                  >
                    <Camera size={18} className="text-white" />
                  </button>
                </div>
                <div className="text-center">
                  <h2 className="text-2xl font-semibold text-white">{profileData.name}</h2>
                  <p className="text-base text-white/80">
                    {profileData.currentPosition && `${profileData.currentPosition}`}
                    {profileData.currentCompany && profileData.currentPosition && ' at '}
                    {profileData.currentCompany}
                  </p>
                </div>
              </div>

              {/* Edit Button */}
              <div className="flex justify-end mb-4">
                {isEditMode ? (
                  <div className="space-x-2">
                    <button
                      onClick={() => handleEditMode(false)}
                      className="px-3 py-1.5 bg-gray-600 text-white rounded-lg hover:bg-gray-700 transition-colors text-sm"
                    >
                      Cancel
                    </button>
                    <button
                      onClick={handleSaveProfile}
                      className="px-3 py-1.5 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors text-sm"
                    >
                      Save
                    </button>
                  </div>
                ) : (
                  <button
                    onClick={() => handleEditMode(true)}
                    className="px-3 py-1.5 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors text-sm"
                  >
                    Edit Profile
                  </button>
                )}
              </div>

              {/* Navigation Pills */}
              <div className="flex overflow-x-auto pb-2 mb-4 space-x-2 -mx-4 px-4">
                {['personal', 'educational', 'professional', 'biographical'].map((option) => (
                  <button
                    key={option}
                    onClick={() => setSelectedOption(option)}
                    className={`px-4 py-2 text-white rounded-lg whitespace-nowrap transition-all duration-200 text-sm ${
                      selectedOption === option 
                        ? 'bg-white/20 font-medium' 
                        : 'bg-white/5'
                    }`}
                  >
                    {option.charAt(0).toUpperCase() + option.slice(1)}
                  </button>
                ))}
              </div>

              {/* Content Sections */}
              <div className="bg-white/10 backdrop-blur-sm rounded-xl p-4">
                {/* Keep existing content sections but adjust padding/margins */}
                {selectedOption === 'personal' && (
                  <div className="space-y-4">
                    <h2 className="text-2xl font-semibold text-white mb-4">
                      Personal Information
                    </h2>
                    <div className="space-y-3">
                      {/* Name Field */}
                      <div className="space-y-1">
                        <label className="block text-base font-medium text-gray-200">
                          Name
                        </label>
                        <div className="relative">
                          <input
                            type="text"
                            className="w-full pl-10 pr-3 py-2 text-lg bg-white/10 border border-white/20 rounded-lg text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-white/20 focus:border-transparent"
                            placeholder="Enter your name"
                            value={profileData.name}
                            onChange={(e) => setProfileData({ ...profileData, name: e.target.value })}
                            readOnly={!isEditMode}
                          />
                          <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                            <User className="h-5 w-5 text-gray-400" />
                          </div>
                        </div>
                      </div>

                      {/* Email and Contact Number */}
                      <div className="grid grid-cols-2 gap-4">
                        <div className="space-y-1">
                          <label className="block text-base font-medium text-gray-200">
                            Email
                          </label>
                          <div className="relative">
                            <input
                              type="email"
                              className="w-full pl-10 pr-3 py-2 text-lg bg-white/10 border border-white/20 rounded-lg text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-white/20 focus:border-transparent"
                              placeholder="Enter your email"
                              value={profileData.email}
                              readOnly
                            />
                            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                              <Mail className="h-5 w-5 text-gray-400" />
                            </div>
                          </div>
                        </div>
                        <div className="space-y-1">
                          <label className="block text-base font-medium text-gray-200">
                            Phone Number
                          </label>
                          <div className="flex gap-2">
                            <select
                              className="w-36 pl-3 pr-8 py-2 text-lg bg-white/10 border border-white/20 rounded-lg text-white appearance-none cursor-pointer hover:bg-white/20 transition-colors"
                              value={phoneFormat}
                              onChange={(e) => setPhoneFormat(e.target.value)}
                              disabled={!isEditMode}
                              style={{
                                backgroundImage: `url("data:image/svg+xml,%3csvg xmlns='http://www.w3.org/2000/svg' fill='none' viewBox='0 0 20 20'%3e%3cpath stroke='%23ffffff' stroke-linecap='round' stroke-linejoin='round' stroke-width='1.5' d='M6 8l4 4 4-4'/%3e%3c/svg%3e")`,
                                backgroundPosition: 'right 0.5rem center',
                                backgroundRepeat: 'no-repeat',
                                backgroundSize: '1.5em 1.5em',
                                paddingRight: '2.5rem'
                              }}
                            >
                              {COUNTRIES.map(country => (
                                <option key={country.code} value={country.code}>
                                  {country.name} ({country.prefix})
                                </option>
                              ))}
                            </select>
                            <div className="relative flex-1">
                              <input
                                type="tel"
                                className={`w-full pl-10 pr-3 py-2 text-lg bg-white/10 border ${
                                  validationErrors.phoneNumber ? 'border-red-500' : 'border-white/20'
                                } rounded-lg text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-white/20 focus:border-transparent`}
                                placeholder="Enter your phone number"
                                value={profileData.phoneNumber || ""}
                                onChange={(e) => {
                                  const value = e.target.value;
                                  setProfileData({...profileData, phoneNumber: value});
                                  handleValidation('phoneNumber', value);
                                }}
                                readOnly={!isEditMode}
                              />
                              {validationErrors.phoneNumber && (
                                <p className="text-red-500 text-sm mt-1">{validationErrors.phoneNumber}</p>
                              )}
                            </div>
                          </div>
                        </div>
                      </div>

                      {/* Location */}
                      <div className="space-y-1">
                        <label className="block text-base font-medium text-gray-200">
                          Current Location
                        </label>
                        <div className="relative">
                          <input
                            type="text"
                            className="w-full pl-10 pr-3 py-2 text-lg bg-white/10 border border-white/20 rounded-lg text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-white/20 focus:border-transparent"
                            placeholder="Enter your current location"
                            value={profileData.currentLocation || ""}
                            maxLength={100}
                            onChange={(e) => {
                              const value = e.target.value;
                              setProfileData({...profileData, currentLocation: value});
                              handleValidation('currentLocation', value);
                            }}
                            readOnly={!isEditMode}
                          />
                          <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                            <MapPin className="h-5 w-5 text-gray-400" />
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
                      {/* Graduation Year and Department */}
                      <div className="grid grid-cols-2 gap-4">
                        <div className="space-y-1">
                          <label className="block text-base font-medium text-gray-200">
                            Graduation Year
                          </label>
                          <div className="relative">
                            <input
                              type="number"
                              className={`w-full pl-10 pr-3 py-2 text-lg bg-white/10 border ${
                                validationErrors.graduationYear ? 'border-red-500' : 'border-white/20'
                              } rounded-lg text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-white/20 focus:border-transparent`}
                              placeholder="Enter graduation year"
                              value={profileData.graduationYear || ""}
                              min={FOUNDING_YEAR}
                              max={CURRENT_YEAR}
                              onChange={(e) => {
                                const value = parseInt(e.target.value);
                                setProfileData({ ...profileData, graduationYear: value });
                                handleValidation('graduationYear', value);
                              }}
                              readOnly={!isEditMode}
                            />
                            {validationErrors.graduationYear && (
                              <p className="text-red-500 text-sm mt-1">{validationErrors.graduationYear}</p>
                            )}
                          </div>
                        </div>
                        <div className="space-y-1">
                          <label className="block text-base font-medium text-gray-200">
                            Department
                          </label>
                          <div className="relative">
                            <input
                              type="text"
                              className="w-full pl-10 pr-3 py-2 text-lg bg-white/10 border border-white/20 rounded-lg text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-white/20 focus:border-transparent"
                              placeholder="Enter department" 
                              value={profileData.department || ""}
                              maxLength={100}
                              onChange={(e) => {
                                const value = e.target.value;
                                setProfileData({...profileData, department: value});
                                handleValidation('department', value);
                              }}
                              readOnly={!isEditMode}
                            />
                            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                              <Building2 className="h-5 w-5 text-gray-400" />
                            </div>
                          </div>
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
                      {/* Current Position and Company */}
                      <div className="grid grid-cols-2 gap-4">
                        <div className="space-y-1">
                          <label className="block text-base font-medium text-gray-200">
                            Current Position
                          </label>
                          <div className="relative">
                            <input
                              type="text"
                              className="w-full pl-10 pr-3 py-2 text-lg bg-white/10 border border-white/20 rounded-lg text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-white/20 focus:border-transparent"
                              placeholder="Enter current position"
                              value={profileData.currentPosition || ""}
                              onChange={(e) => setProfileData({...profileData, currentPosition: e.target.value})}
                              readOnly={!isEditMode}
                            />
                            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                              <Briefcase className="h-5 w-5 text-gray-400" />
                            </div>
                          </div>
                        </div>
                        <div className="space-y-1">
                          <label className="block text-base font-medium text-gray-200">
                            Current Company
                          </label>
                          <div className="relative">
                            <input
                              type="text"
                              className="w-full pl-10 pr-3 py-2 text-lg bg-white/10 border border-white/20 rounded-lg text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-white/20 focus:border-transparent"
                              placeholder="Enter current company"
                              value={profileData.currentCompany || ""}
                              onChange={(e) => setProfileData({...profileData, currentCompany: e.target.value})}
                              readOnly={!isEditMode}
                            />
                            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                              <Building2 className="h-5 w-5 text-gray-400" />
                            </div>
                          </div>
                        </div>
                      </div>

                      {/* LinkedIn Profile */}
                      <div className="space-y-1">
                        <label className="block text-base font-medium text-gray-200">
                          LinkedIn Profile
                        </label>
                        <div className="relative">
                          <input
                            type="url"
                            className="w-full pl-10 pr-3 py-2 text-lg bg-white/10 border border-white/20 rounded-lg text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-white/20 focus:border-transparent"
                            placeholder="Enter LinkedIn profile URL"
                            value={profileData.linkedIn || ""}
                            onChange={(e) => {
                              const value = e.target.value;
                              setProfileData({...profileData, linkedIn: value});
                              handleValidation('linkedIn', value);
                            }}
                            readOnly={!isEditMode}
                          />
                          <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                            <Linkedin className="h-5 w-5 text-gray-400" />
                          </div>
                        </div>
                      </div>

                      {/* Personal Website */}
                      <div className="space-y-1">
                        <label className="block text-base font-medium text-gray-200">
                          Personal Website
                        </label>
                        <div className="relative">
                          <input
                            type="url" 
                            className="w-full pl-10 pr-3 py-2 text-lg bg-white/10 border border-white/20 rounded-lg text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-white/20 focus:border-transparent"
                            placeholder="Enter personal website URL"
                            value={profileData.website || ""}
                            onChange={(e) => {
                              const value = e.target.value;
                              setProfileData({...profileData, website: value});
                              handleValidation('website', value);
                            }}
                            readOnly={!isEditMode}
                          />
                          <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                            <Globe className="h-5 w-5 text-gray-400" />
                          </div>
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
                          maxLength={500}
                          onChange={(e) => {
                            const value = e.target.value;
                            setProfileData({...profileData, bio: value});
                            handleValidation('bio', value);
                          }}
                          readOnly={!isEditMode}
                        />
                        {validationErrors.bio && (
                          <p className="text-red-500 text-sm mt-1">{validationErrors.bio}</p>
                        )}
                      </div>
                    </div>
                  </div>
                )}
              </div>
            </div>
          </div>

          {/* Desktop View */}
          <div className="hidden lg:block">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-full">
              <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 h-full">
                {/* Left Card - Main Profile */}
                <div className="lg:col-span-5 bg-white/10 backdrop-blur-sm rounded-xl shadow-lg overflow-hidden h-[calc(100vh-6rem)]">
                  <div className="p-6 h-full flex flex-col">
                    <div className="flex-grow overflow-y-auto">
                      {/* Profile Picture Square */}
                      <div className="flex flex-col items-center mb-6">
                        <div className="relative mb-3">
                          <input
                            type="file"
                            ref={fileInputRef}
                            className="hidden"
                            accept="image/png,image/jpeg,image/jpg"
                            onChange={handleImageUpload}
                            onClick={(e) => (e.currentTarget.value = '')} // Reset input
                          />
                          <div className="w-44 h-44 rounded-lg border-4 border-white/20 bg-white/10">
                            {profileData.imageUrl ? ( // Changed from profilePicture to imageUrl
                              <img
                                src={profileData.imageUrl}
                                alt="Profile"
                                className="w-full h-full rounded-lg object-cover"
                              />
                            ) : (
                              <div className="w-full h-full rounded-lg bg-white/10 flex items-center justify-center">
                                <UserIcon size={72} className="text-white" />
                              </div>
                            )}
                          </div>
                          <button 
                            className="absolute bottom-2 right-2 p-2 bg-white/20 hover:bg-white/30 rounded-full transition cursor-pointer"
                            onClick={() => fileInputRef.current?.click()}
                          >
                            <Camera size={22} className="text-white" />
                          </button>
                        </div>
                        <div className="text-center space-y-1">
                          <h2 className="text-3xl font-semibold text-white mb-2">{profileData.name}</h2>
                          <p className="text-lg text-white/80">
                            {profileData.currentPosition && `${profileData.currentPosition}`}
                            {profileData.currentCompany && profileData.currentPosition && ' at '}
                            {profileData.currentCompany}
                          </p>
                          <p className="text-base text-white/60">{profileData.email}</p>
                          <p className="text-base text-white/60">{profileData.phoneNumber}</p>
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
                    </div>
                  </div>
                </div>
                {/* Right Column - Single Card */}
                <div className="lg:col-span-7 h-[calc(100vh-6rem)]">
                  <div className="bg-white/10 backdrop-blur-sm rounded-xl shadow-lg p-6 h-full">
                    {/* Add Edit/Save Buttons */}
                    <div className="flex justify-end mb-6">
                      {isEditMode ? (
                        <div className="space-x-2">
                          <button
                            onClick={() => handleEditMode(false)}
                            className="px-4 py-2 bg-gray-600 text-white rounded-lg hover:bg-gray-700 transition-colors"
                          >
                            Cancel
                          </button>
                          <button
                            onClick={handleSaveProfile}
                            className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
                          >
                            Save Changes
                          </button>
                        </div>
                      ) : (
                        <button
                          onClick={() => handleEditMode(true)}
                          className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
                        >
                          Edit Profile
                        </button>
                      )}
                    </div>

                    {/* Personal Information Section */}
                    {selectedOption === 'personal' && (
                      <div className="space-y-4">
                        <h2 className="text-2xl font-semibold text-white mb-4">
                          Personal Information
                        </h2>
                        <div className="space-y-3">
                          {/* Name Field */}
                          <div className="space-y-1">
                            <label className="block text-base font-medium text-gray-200">
                              Name
                            </label>
                            <div className="relative">
                              <input
                                type="text"
                                className="w-full pl-10 pr-3 py-2 text-lg bg-white/10 border border-white/20 rounded-lg text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-white/20 focus:border-transparent"
                                placeholder="Enter your name"
                                value={profileData.name}
                                onChange={(e) => setProfileData({ ...profileData, name: e.target.value })}
                                readOnly={!isEditMode}
                              />
                              <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                                <User className="h-5 w-5 text-gray-400" />
                              </div>
                            </div>
                          </div>

                          {/* Email and Contact Number */}
                          <div className="grid grid-cols-2 gap-4">
                            <div className="space-y-1">
                              <label className="block text-base font-medium text-gray-200">
                                Email
                              </label>
                              <div className="relative">
                                <input
                                  type="email"
                                  className="w-full pl-10 pr-3 py-2 text-lg bg-white/10 border border-white/20 rounded-lg text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-white/20 focus:border-transparent"
                                  placeholder="Enter your email"
                                  value={profileData.email}
                                  readOnly
                                />
                                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                                  <Mail className="h-5 w-5 text-gray-400" />
                                </div>
                              </div>
                            </div>
                            <div className="space-y-1">
                              <label className="block text-base font-medium text-gray-200">
                                Phone Number
                              </label>
                              <div className="flex gap-2">
                                <select
                                  className="w-36 pl-3 pr-8 py-2 text-lg bg-white/10 border border-white/20 rounded-lg text-white appearance-none cursor-pointer hover:bg-white/20 transition-colors"
                                  value={phoneFormat}
                                  onChange={(e) => setPhoneFormat(e.target.value)}
                                  disabled={!isEditMode}
                                  style={{
                                    backgroundImage: `url("data:image/svg+xml,%3csvg xmlns='http://www.w3.org/2000/svg' fill='none' viewBox='0 0 20 20'%3e%3cpath stroke='%23ffffff' stroke-linecap='round' stroke-linejoin='round' stroke-width='1.5' d='M6 8l4 4 4-4'/%3e%3c/svg%3e")`,
                                    backgroundPosition: 'right 0.5rem center',
                                    backgroundRepeat: 'no-repeat',
                                    backgroundSize: '1.5em 1.5em',
                                    paddingRight: '2.5rem'
                                  }}
                                >
                                  {COUNTRIES.map(country => (
                                    <option key={country.code} value={country.code}>
                                      {country.name} ({country.prefix})
                                    </option>
                                  ))}
                                </select>
                                <div className="relative flex-1">
                                  <input
                                    type="tel"
                                    className={`w-full pl-10 pr-3 py-2 text-lg bg-white/10 border ${
                                      validationErrors.phoneNumber ? 'border-red-500' : 'border-white/20'
                                    } rounded-lg text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-white/20 focus:border-transparent`}
                                    placeholder="Enter your phone number"
                                    value={profileData.phoneNumber || ""}
                                    onChange={(e) => {
                                      const value = e.target.value;
                                      setProfileData({...profileData, phoneNumber: value});
                                      handleValidation('phoneNumber', value);
                                    }}
                                    readOnly={!isEditMode}
                                  />
                                  {validationErrors.phoneNumber && (
                                    <p className="text-red-500 text-sm mt-1">{validationErrors.phoneNumber}</p>
                                  )}
                                </div>
                              </div>
                            </div>
                          </div>

                          {/* Location */}
                          <div className="space-y-1">
                            <label className="block text-base font-medium text-gray-200">
                              Current Location
                            </label>
                            <div className="relative">
                              <input
                                type="text"
                                className="w-full pl-10 pr-3 py-2 text-lg bg-white/10 border border-white/20 rounded-lg text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-white/20 focus:border-transparent"
                                placeholder="Enter your current location"
                                value={profileData.currentLocation || ""}
                                maxLength={100}
                                onChange={(e) => {
                                  const value = e.target.value;
                                  setProfileData({...profileData, currentLocation: value});
                                  handleValidation('currentLocation', value);
                                }}
                                readOnly={!isEditMode}
                              />
                              <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                                <MapPin className="h-5 w-5 text-gray-400" />
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
                          {/* Graduation Year and Department */}
                          <div className="grid grid-cols-2 gap-4">
                            <div className="space-y-1">
                              <label className="block text-base font-medium text-gray-200">
                                Graduation Year
                              </label>
                              <div className="relative">
                                <input
                                  type="number"
                                  className={`w-full pl-10 pr-3 py-2 text-lg bg-white/10 border ${
                                    validationErrors.graduationYear ? 'border-red-500' : 'border-white/20'
                                  } rounded-lg text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-white/20 focus:border-transparent`}
                                  placeholder="Enter graduation year"
                                  value={profileData.graduationYear || ""}
                                  min={FOUNDING_YEAR}
                                  max={CURRENT_YEAR}
                                  onChange={(e) => {
                                    const value = parseInt(e.target.value);
                                    setProfileData({ ...profileData, graduationYear: value });
                                    handleValidation('graduationYear', value);
                                  }}
                                  readOnly={!isEditMode}
                                />
                                {validationErrors.graduationYear && (
                                  <p className="text-red-500 text-sm mt-1">{validationErrors.graduationYear}</p>
                                )}
                              </div>
                            </div>
                            <div className="space-y-1">
                              <label className="block text-base font-medium text-gray-200">
                                Department
                              </label>
                              <div className="relative">
                                <input
                                  type="text"
                                  className="w-full pl-10 pr-3 py-2 text-lg bg-white/10 border border-white/20 rounded-lg text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-white/20 focus:border-transparent"
                                  placeholder="Enter department" 
                                  value={profileData.department || ""}
                                  maxLength={100}
                                  onChange={(e) => {
                                    const value = e.target.value;
                                    setProfileData({...profileData, department: value});
                                    handleValidation('department', value);
                                  }}
                                  readOnly={!isEditMode}
                                />
                                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                                  <Building2 className="h-5 w-5 text-gray-400" />
                                </div>
                              </div>
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
                          {/* Current Position and Company */}
                          <div className="grid grid-cols-2 gap-4">
                            <div className="space-y-1">
                              <label className="block text-base font-medium text-gray-200">
                                Current Position
                              </label>
                              <div className="relative">
                                <input
                                  type="text"
                                  className="w-full pl-10 pr-3 py-2 text-lg bg-white/10 border border-white/20 rounded-lg text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-white/20 focus:border-transparent"
                                  placeholder="Enter current position"
                                  value={profileData.currentPosition || ""}
                                  onChange={(e) => setProfileData({...profileData, currentPosition: e.target.value})}
                                  readOnly={!isEditMode}
                                />
                                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                                  <Briefcase className="h-5 w-5 text-gray-400" />
                                </div>
                              </div>
                            </div>
                            <div className="space-y-1">
                              <label className="block text-base font-medium text-gray-200">
                                Current Company
                              </label>
                              <div className="relative">
                                <input
                                  type="text"
                                  className="w-full pl-10 pr-3 py-2 text-lg bg-white/10 border border-white/20 rounded-lg text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-white/20 focus:border-transparent"
                                  placeholder="Enter current company"
                                  value={profileData.currentCompany || ""}
                                  onChange={(e) => setProfileData({...profileData, currentCompany: e.target.value})}
                                  readOnly={!isEditMode}
                                />
                                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                                  <Building2 className="h-5 w-5 text-gray-400" />
                                </div>
                              </div>
                            </div>
                          </div>

                          {/* LinkedIn Profile */}
                          <div className="space-y-1">
                            <label className="block text-base font-medium text-gray-200">
                              LinkedIn Profile
                            </label>
                            <div className="relative">
                              <input
                                type="url"
                                className="w-full pl-10 pr-3 py-2 text-lg bg-white/10 border border-white/20 rounded-lg text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-white/20 focus:border-transparent"
                                placeholder="Enter LinkedIn profile URL"
                                value={profileData.linkedIn || ""}
                                onChange={(e) => {
                                  const value = e.target.value;
                                  setProfileData({...profileData, linkedIn: value});
                                  handleValidation('linkedIn', value);
                                }}
                                readOnly={!isEditMode}
                              />
                              <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                                <Linkedin className="h-5 w-5 text-gray-400" />
                              </div>
                            </div>
                          </div>

                          {/* Personal Website */}
                          <div className="space-y-1">
                            <label className="block text-base font-medium text-gray-200">
                              Personal Website
                            </label>
                            <div className="relative">
                              <input
                                type="url" 
                                className="w-full pl-10 pr-3 py-2 text-lg bg-white/10 border border-white/20 rounded-lg text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-white/20 focus:border-transparent"
                                placeholder="Enter personal website URL"
                                value={profileData.website || ""}
                                onChange={(e) => {
                                  const value = e.target.value;
                                  setProfileData({...profileData, website: value});
                                  handleValidation('website', value);
                                }}
                                readOnly={!isEditMode}
                              />
                              <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                                <Globe className="h-5 w-5 text-gray-400" />
                              </div>
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
                              maxLength={500}
                              onChange={(e) => {
                                const value = e.target.value;
                                setProfileData({...profileData, bio: value});
                                handleValidation('bio', value);
                              }}
                              readOnly={!isEditMode}
                            />
                            {validationErrors.bio && (
                              <p className="text-red-500 text-sm mt-1">{validationErrors.bio}</p>
                            )}
                          </div>
                        </div>
                      </div>
                    )}
                  </div>
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
          onUpdateProfile={handleSaveProfile}
        />
      )}
    </div>
  );
}