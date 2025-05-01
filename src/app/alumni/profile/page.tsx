"use client";

import { motion, AnimatePresence } from "framer-motion";
import React, { useState, useEffect, useRef, useMemo } from "react";
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
  Linkedin,
  CheckCircle2
} from "lucide-react";
import EditProfileModal from "@/app/components/EditProfileModal";
import debounce from 'lodash/debounce';
import { COUNTRIES, validatePhoneNumber } from '@/lib/countries';

// Add validation functions at the top level
const CURRENT_YEAR = new Date().getFullYear();
const FOUNDING_YEAR = 1950; // Changed from 1909 to 1950

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

const LINKEDIN_REGEX = /^https?:\/\/(www\.)?linkedin\.com\/[a-zA-Z0-9\-_/]+$/i;

// Add styles for constellation animation
const constellationStyles = `
  @keyframes twinkle {
    0% { opacity: 0; }
    50% { opacity: 1; }
    100% { opacity: 0; }
  }
`;

export default function AlumniProfile() {
  const { data: session } = useSession() as { data: Session | null };
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [showPasswordFields, setShowPasswordFields] = useState(false);
  const [isFirstNameEditable, setIsFirstNameEditable] = useState(false);
  const [isLastNameEditable, setIsLastNameEditable] = useState(false);
  const [isMiddleInitialEditable, setIsMiddleInitialEditable] = useState(false);
  const [selectedOption, setSelectedOption] = useState('personal');
  const [isEditMode, setIsEditMode] = useState(false);
  const [showSuccessAlert, setShowSuccessAlert] = useState(false);
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

  // Add constellation elements
  const constellationElements = useMemo(() => {
    const stars = Array.from({ length: 50 }).map((_, i) => ({
      id: i,
      width: Math.random() * 2 + 1,
      height: Math.random() * 2 + 1,
      left: Math.random() * 100,
      top: Math.random() * 100,
      duration: Math.random() * 5 + 3,
      delay: Math.random() * 5
    }));

    const lines = Array.from({ length: 20 }).map((_, i) => ({
      id: i,
      width: Math.random() * 150 + 50,
      left: Math.random() * 100,
      top: Math.random() * 100,
      rotation: Math.random() * 360,
      opacity: Math.random() * 0.5
    }));

    return { stars, lines };
  }, []);

  const handleImageUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    if (!e.target.files || !e.target.files[0]) return;

    const file = e.target.files[0];

    // Check file size
    if (file.size > 3 * 1024 * 1024) {
      return;
    }

    // Check file type
    if (!file.type.startsWith('image/')) {
      return;
    }

    try {
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
    } catch (error) {
      console.error('Error:', error);
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
        if (value && (!LINKEDIN_REGEX.test(value) || value.length > 100)) {
          errors.linkedIn = 'Must be a valid LinkedIn URL (e.g. https://linkedin.com/in/username) and less than 100 characters';
        } else {
          delete errors.linkedIn;
        }
        break;

      case 'website':
        if (value) {
          try {
            new URL(value);
            if (value.length > 100) {
              errors.website = 'Website must be less than 100 characters';
            } else {
              delete errors.website;
            }
          } catch {
            errors.website = 'Must be a valid URL (e.g. https://example.com)';
          }
        } else {
          delete errors.website;
        }
        break;
    }

    setValidationErrors(errors);
  }, 300);

  // Modify handleSaveProfile to show success alert
  const handleSaveProfile = async () => {
    // Check if there are any validation errors
    console.log(profileData)

    if (Object.keys(validationErrors).length > 0) {
      return;
    }
    try {
      const response = await fetch("/api/users/profile", {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(profileData),
      });

      if (!response.ok) throw new Error("Failed to update profile");

      setBackupData(null); // Clear backup after successful save
      setIsEditMode(false);
      setShowSuccessAlert(true);
      
      // Hide alert after 3 seconds
      setTimeout(() => {
        setShowSuccessAlert(false);
      }, 3000);
    } catch (error) {
      console.error("Error updating profile:", error);
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
    <>
      {/* Success Alert - Moved outside main container */}
      <AnimatePresence>
        {showSuccessAlert && (
          <div className="fixed top-6 left-0 right-0 flex justify-center" style={{ zIndex: 99999 }}>
            <motion.div
              initial={{ opacity: 0, y: -20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -10 }}
              transition={{ duration: 0.3 }}
              className="bg-white text-gray-900 px-6 py-4 rounded-lg shadow-lg border border-gray-100 flex items-center gap-3"
            >
              <CheckCircle2 className="h-5 w-5 text-emerald-500" />
              <span className="font-medium">Profile saved successfully</span>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
      
      <div className="min-h-screen inset-0 overflow-hidden bg-[#0f172a]">
        <style jsx global>{constellationStyles}</style>
        {/* Background Elements */}
        <div className="absolute inset-0">
          <div className="absolute inset-0 bg-[url('/grid-pattern.svg')] opacity-5" />
          <div className="absolute inset-0 bg-[url('/noise-pattern.png')] opacity-5" />
          {/* Gradient only in the top portion */}
          <div className="absolute inset-x-0 top-0 h-[40vh] bg-gradient-to-br from-transparent from-0% via-transparent via-5% via-[#1a1f4d]/10 via-15% via-[#1a1f4d]/20 via-25% via-[#1a237e]/25 via-35% via-[#1a237e]/30 via-45% via-[#0d47a1]/35 via-55% via-[#0d47a1]/40 via-65% via-[#0d47a1]/45 via-70% via-[#0f172a]/45 via-75% via-[#0f172a]/50 via-80% via-[#0f172a]/55 via-85% via-[#0f172a]/60 via-90% via-[#0f172a]/70 via-95% to-[#0f172a]/80 to-100%" />
        </div>
        
        {/* Cover Photo Section with constellation and gradients */}
        <div className="h-[40vh] relative overflow-hidden">
          {/* Constellation Animation */}
          <div className="absolute inset-0">
            <div className="absolute inset-0 bg-[url('/grid-pattern.svg')] opacity-5" />
            <div className="absolute inset-0 bg-[url('/noise-pattern.png')] opacity-5" />
            <div className="absolute inset-0">
              <div className="absolute inset-0 bg-gradient-to-br from-[#1a1f4d]/80 via-[#1a237e]/60 to-[#0d47a1]/40" />
              <div className="h-full w-full" style={{ background: 'radial-gradient(circle at center, rgba(255,255,255,0.1) 0%, transparent 60%)' }} />
            </div>
            <div className="constellation absolute inset-0">
              <div className="stars absolute inset-0">
                {constellationElements.stars.map((star) => (
                  <div
                    key={star.id}
                    className="star absolute rounded-full bg-white"
                    style={{
                      width: star.width + 'px',
                      height: star.height + 'px',
                      left: star.left + '%',
                      top: star.top + '%',
                      animation: `twinkle ${star.duration}s infinite ${star.delay}s`
                    }}
                  />
                ))}
              </div>
              <div className="lines absolute inset-0">
                {constellationElements.lines.map((line) => (
                  <div
                    key={line.id}
                    className="line absolute bg-white/10"
                    style={{
                      width: line.width + 'px',
                      height: '1px',
                      left: line.left + '%',
                      top: line.top + '%',
                      transform: `rotate(${line.rotation}deg)`,
                      opacity: line.opacity
                    }}
                  />
                ))}
              </div>
            </div>
          </div>
          {/* Gradient fade ending above nav */}
          <div className="absolute inset-0 bg-gradient-to-b from-transparent via-[#1a237e]/10 via-[#1a237e]/20 via-[#0d47a1]/30 via-[#0f172a]/40 via-[#0f172a]/60 via-[#0f172a]/80 to-[#0f172a]" />
        </div>

        {/* Main Content Container */}
        <div className="relative w-full h-[60vh] flex">
          {/* Left Column - Profile Info */}
          <div className="w-[43.33%] p-6 relative">
            {/* Profile Picture */}
            <div className="relative -mt-[176px]">
              <div className="h-56 w-56 rounded-full border-4 border-white/20 shadow-lg overflow-hidden bg-white/10 mx-auto relative group">
                {profileData.imageUrl ? (
                  <img
                    src={profileData.imageUrl}
                    alt={profileData.name}
                    className="w-full h-full object-cover"
                  />
                ) : (
                  <div className="w-full h-full flex items-center justify-center">
                    <UserIcon className="h-24 w-24 text-white/60" />
                  </div>
                )}
                {isEditMode && (
                  <div 
                    className="absolute inset-0 bg-black/50 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity cursor-pointer"
                    onClick={() => fileInputRef.current?.click()}
                  >
                    <Camera className="h-8 w-8 text-white" />
                  </div>
                )}
                <input
                  type="file"
                  ref={fileInputRef}
                  className="hidden"
                  accept="image/*"
                  onChange={handleImageUpload}
                />
              </div>
            </div>

            {/* Profile Info */}
            <div className="mt-6 text-center">
              <h1 className="text-4xl font-bold text-white mb-4">{profileData.name}</h1>
              <p className="text-lg text-white/80">
                {profileData.currentPosition} {profileData.currentCompany && `at ${profileData.currentCompany}`}
              </p>
              <p className="text-base text-white/60 mb-8">{profileData.email}</p>
              
              <div className="flex flex-col items-center gap-3">
                {profileData.currentLocation && (
                  <div className="flex items-center gap-2 text-white/70">
                    <MapPin className="h-4 w-4" />
                    <span>{profileData.currentLocation}</span>
                  </div>
                )}
                {profileData.graduationYear && (
                  <div className="flex items-center gap-2 text-white/70">
                    <GraduationCap className="h-4 w-4" />
                    <span>Class of {profileData.graduationYear}</span>
                  </div>
                )}
                {profileData.department && (
                  <div className="flex items-center gap-2 text-white/70">
                    <Building2 className="h-4 w-4" />
                    <span>{profileData.department}</span>
                  </div>
                )}
                {profileData.phoneNumber && (
                  <div className="flex items-center gap-2 text-white/70">
                    <Phone className="h-4 w-4" />
                    <span>{profileData.phoneNumber}</span>
                  </div>
                )}
                {profileData.website && (
                  <div className="flex items-center gap-2 text-white/70">
                    <Globe className="h-4 w-4" />
                    <a href={profileData.website} target="_blank" rel="noopener noreferrer" className="hover:text-white transition-colors">
                      {new URL(profileData.website).hostname}
                    </a>
                  </div>
                )}
                {profileData.linkedIn && (
                  <div className="flex items-center gap-2 text-white/70">
                    <Linkedin className="h-4 w-4" />
                    <a href={profileData.linkedIn} target="_blank" rel="noopener noreferrer" className="hover:text-white transition-colors">
                      LinkedIn Profile
                    </a>
                  </div>
                )}
              </div>

              {/* Edit Profile Button */}
              <div className="mt-8">
                <button
                  onClick={() => isEditMode ? handleSaveProfile() : setIsEditMode(true)}
                  className={`px-6 py-2.5 rounded-full transition-all duration-300 flex items-center gap-3 mx-auto cursor-pointer font-medium text-sm ${
                    isEditMode 
                    ? 'bg-gradient-to-r from-green-500 to-emerald-600 hover:from-green-600 hover:to-emerald-700 text-white shadow-lg hover:shadow-emerald-500/30' 
                    : 'bg-gradient-to-r from-blue-500 to-indigo-600 hover:from-blue-600 hover:to-indigo-700 text-white shadow-lg hover:shadow-indigo-500/30'
                  }`}
                >
                  {isEditMode ? (
                    <>
                      <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7" />
                      </svg>
                      <span>Save Profile</span>
                    </>
                  ) : (
                    <>
                      <Edit2 className="h-4 w-4" />
                      <span>Edit Profile</span>
                    </>
                  )}
                </button>
              </div>
            </div>
          </div>

          {/* Right Column - Additional Content */}
          <div className="flex-1 p-6 overflow-y-auto">
            {/* Navigation Pills */}
            <div className="flex space-x-8 mb-12">
              {['personal', 'educational', 'professional', 'biographical', 'security'].map((option) => (
                <button 
                  key={option}
                  onClick={() => setSelectedOption(option)}
                  className={`text-sm font-medium hover:text-white transition-colors relative group cursor-pointer ${
                    selectedOption === option ? 'text-white' : 'text-gray-400'
                  }`}
                >
                  <span className="uppercase">{option}</span>
                  <span className={`absolute -bottom-1 left-0 h-0.5 bg-white transition-all duration-300 ${
                    selectedOption === option ? 'w-full' : 'w-0 group-hover:w-full'
                  }`}></span>
                </button>
              ))}
            </div>

            {/* Content Sections */}
            <div className="pr-8">
              <AnimatePresence mode="wait">
                {selectedOption === 'personal' && (
                  <motion.div
                    key="personal"
                    initial={{ opacity: 0, x: 20 }}
                    animate={{ opacity: 1, x: 0 }}
                    exit={{ opacity: 0, x: -20 }}
                    transition={{ duration: 0.3, ease: "easeInOut" }}
                    className="space-y-4"
                  >
                    <div className="space-y-4">
                      <div className="flex items-center gap-4 text-white/80">
                        <Mail className="h-5 w-5 flex-shrink-0" />
                        <span>{profileData.email}</span>
                      </div>
                      <div className="flex items-start gap-4 text-white/80">
                        <User className={`h-5 w-5 flex-shrink-0 ${isEditMode ? 'mt-[33px]' : 'mt-[10px]'}`} />
                        {isEditMode ? (
                          <div className="flex-1">
                            <label className="block text-sm font-medium text-white/90 mb-1">Full Name</label>
                            <input
                              type="text"
                              value={profileData.name || ''}
                              onChange={(e) => {
                                const value = e.target.value;
                                // Allow only letters, spaces, dots, and hyphens
                                if (value === '' || /^[a-zA-Z\s.-]+$/.test(value)) {
                                  setProfileData(prev => ({ ...prev, name: value }));
                                }
                              }}
                              className="bg-white/10 text-white rounded-lg p-2 w-full max-w-md"
                              placeholder="Enter full name"
                            />
                            <p className="text-xs text-white/60 mt-1">Only letters, spaces, dots, and hyphens are allowed</p>
                          </div>
                        ) : (
                          <span className="pt-2">{profileData.name || 'No name added'}</span>
                        )}
                      </div>
                      <div className="flex items-start gap-4 text-white/80">
                        <Phone className={`h-5 w-5 flex-shrink-0 ${isEditMode ? 'mt-[33px]' : 'mt-[10px]'}`} />
                        {isEditMode ? (
                          <div className="flex-1">
                            <label className="block text-sm font-medium text-white/90 mb-1">Contact Number</label>
                            <input
                              type="number"
                              value={profileData.phoneNumber || ''}
                              onChange={(e) => {
                                const value = e.target.value;
                                if (value === '' || /^\d+$/.test(value)) {
                                  setProfileData(prev => ({ ...prev, phoneNumber: value }));
                                }
                              }}
                              className="bg-white/10 text-white rounded-lg p-2 w-full max-w-md [appearance:textfield] [&::-webkit-outer-spin-button]:appearance-none [&::-webkit-inner-spin-button]:appearance-none"
                              placeholder="Enter contact number"
                            />
                          </div>
                        ) : (
                          <span className="pt-2">{profileData.phoneNumber || 'No contact number added'}</span>
                        )}
                      </div>
                      <div className="flex items-start gap-4 text-white/80">
                        <MapPin className={`h-5 w-5 flex-shrink-0 ${isEditMode ? 'mt-[33px]' : 'mt-[10px]'}`} />
                        {isEditMode ? (
                          <div className="flex-1">
                            <label className="block text-sm font-medium text-white/90 mb-1">Current Location</label>
                            <input
                              type="text"
                              value={profileData.currentLocation || ''}
                              onChange={(e) => setProfileData(prev => ({ ...prev, currentLocation: e.target.value }))}
                              className="bg-white/10 text-white rounded-lg p-2 w-full max-w-md"
                              placeholder="Enter current location"
                            />
                          </div>
                        ) : (
                          <span className="pt-2">{profileData.currentLocation || 'No location added'}</span>
                        )}
                      </div>
                    </div>
                  </motion.div>
                )}

                {selectedOption === 'educational' && (
                  <motion.div
                    key="educational"
                    initial={{ opacity: 0, x: 20 }}
                    animate={{ opacity: 1, x: 0 }}
                    exit={{ opacity: 0, x: -20 }}
                    transition={{ duration: 0.3, ease: "easeInOut" }}
                    className="space-y-4"
                  >
                    <div className="space-y-4">
                      <div className="flex items-start gap-4 text-white/80">
                        <GraduationCap className={`h-5 w-5 flex-shrink-0 ${isEditMode ? 'mt-[33px]' : 'mt-[10px]'}`} />
                        {isEditMode ? (
                          <div className="flex-1">
                            <label className="block text-sm font-medium text-white/90 mb-1">Graduation Year</label>
                            <input
                              type="number"
                              min={FOUNDING_YEAR}
                              max={CURRENT_YEAR}
                              value={profileData.graduationYear || ''}
                              onChange={(e) => {
                                const value = parseInt(e.target.value);
                                if (!value || (value >= FOUNDING_YEAR && value <= CURRENT_YEAR)) {
                                  setProfileData(prev => ({ ...prev, graduationYear: value || undefined }));
                                  handleValidation('graduationYear', value);
                                }
                              }}
                              className="bg-white/10 text-white rounded-lg p-2 w-full max-w-md"
                              placeholder={`Enter graduation year (${FOUNDING_YEAR}-${CURRENT_YEAR})`}
                            />
                          </div>
                        ) : (
                          <span className="pt-2">Class of {profileData.graduationYear || 'Not specified'}</span>
                        )}
                      </div>
                      <div className="flex items-start gap-4 text-white/80">
                        <Building2 className={`h-5 w-5 flex-shrink-0 ${isEditMode ? 'mt-[33px]' : 'mt-[10px]'}`} />
                        {isEditMode ? (
                          <div className="flex-1">
                            <label className="block text-sm font-medium text-white/90 mb-1">Department</label>
                            <input
                              type="text"
                              value={profileData.department || ''}
                              onChange={(e) => setProfileData(prev => ({ ...prev, department: e.target.value }))}
                              className="bg-white/10 text-white rounded-lg p-2 w-full max-w-md"
                              placeholder="Enter department"
                            />
                          </div>
                        ) : (
                          <span className="pt-2">{profileData.department || 'No department added'}</span>
                        )}
                      </div>
                    </div>
                  </motion.div>
                )}

                {selectedOption === 'professional' && (
                  <motion.div
                    key="professional"
                    initial={{ opacity: 0, x: 20 }}
                    animate={{ opacity: 1, x: 0 }}
                    exit={{ opacity: 0, x: -20 }}
                    transition={{ duration: 0.3, ease: "easeInOut" }}
                    className="space-y-4"
                  >
                    <div className="space-y-4">
                      <div className="flex items-start gap-4 text-white/80">
                        <Briefcase className={`h-5 w-5 flex-shrink-0 ${isEditMode ? 'mt-[33px]' : 'mt-[10px]'}`} />
                        {isEditMode ? (
                          <div className="flex-1">
                            <label className="block text-sm font-medium text-white/90 mb-1">Current Position</label>
                            <input
                              type="text"
                              value={profileData.currentPosition || ''}
                              onChange={(e) => setProfileData(prev => ({ ...prev, currentPosition: e.target.value }))}
                              className="bg-white/10 text-white rounded-lg p-2 w-full max-w-md"
                              placeholder="Enter current position"
                            />
                          </div>
                        ) : (
                          <span className="pt-2">{profileData.currentPosition || 'No position added'}</span>
                        )}
                      </div>
                      <div className="flex items-start gap-4 text-white/80">
                        <Building2 className={`h-5 w-5 flex-shrink-0 ${isEditMode ? 'mt-[33px]' : 'mt-[10px]'}`} />
                        {isEditMode ? (
                          <div className="flex-1">
                            <label className="block text-sm font-medium text-white/90 mb-1">Current Company</label>
                            <input
                              type="text"
                              value={profileData.currentCompany || ''}
                              onChange={(e) => setProfileData(prev => ({ ...prev, currentCompany: e.target.value }))}
                              className="bg-white/10 text-white rounded-lg p-2 w-full max-w-md"
                              placeholder="Enter current company"
                            />
                          </div>
                        ) : (
                          <span className="pt-2">{profileData.currentCompany || 'No company added'}</span>
                        )}
                      </div>
                      <div className="flex items-start gap-4 text-white/80">
                        <Linkedin className={`h-5 w-5 flex-shrink-0 ${isEditMode ? 'mt-[33px]' : 'mt-[10px]'}`} />
                        {isEditMode ? (
                          <div className="flex-1">
                            <label className="block text-sm font-medium text-white/90 mb-1">LinkedIn Profile</label>
                            <input
                              type="url"
                              value={profileData.linkedIn || ''}
                              onChange={(e) => setProfileData(prev => ({ ...prev, linkedIn: e.target.value }))}
                              className="bg-white/10 text-white rounded-lg p-2 w-full max-w-md"
                              placeholder="Enter LinkedIn profile URL"
                            />
                          </div>
                        ) : (
                          <span className="pt-2">
                            <a 
                              href={profileData.linkedIn}
                              target="_blank"
                              rel="noopener noreferrer"
                              className="hover:text-white transition-colors"
                            >
                              LinkedIn Profile
                            </a>
                          </span>
                        )}
                      </div>
                      <div className="flex items-start gap-4 text-white/80">
                        <Globe className={`h-5 w-5 flex-shrink-0 ${isEditMode ? 'mt-[33px]' : 'mt-[10px]'}`} />
                        {isEditMode ? (
                          <div className="flex-1">
                            <label className="block text-sm font-medium text-white/90 mb-1">Website</label>
                            <input
                              type="url"
                              value={profileData.website || ''}
                              onChange={(e) => setProfileData(prev => ({ ...prev, website: e.target.value }))}
                              className="bg-white/10 text-white rounded-lg p-2 w-full max-w-md"
                              placeholder="Enter website URL"
                            />
                          </div>
                        ) : (
                          <span className="pt-2">
                            <a 
                              href={profileData.website}
                              target="_blank"
                              rel="noopener noreferrer"
                              className="hover:text-white transition-colors"
                            >
                              {profileData.website ? new URL(profileData.website).hostname : 'No website added'}
                            </a>
                          </span>
                        )}
                      </div>
                    </div>
                  </motion.div>
                )}

                {selectedOption === 'biographical' && (
                  <motion.div
                    key="biographical"
                    initial={{ opacity: 0, x: 20 }}
                    animate={{ opacity: 1, x: 0 }}
                    exit={{ opacity: 0, x: -20 }}
                    transition={{ duration: 0.3, ease: "easeInOut" }}
                    className="space-y-4 pr-8"
                  >
                    <div className="space-y-4">
                      <div className="space-y-4">
                        <div className="flex items-start gap-4 text-white/80">
                          <Mail className="h-5 w-5 flex-shrink-0" />
                          <span>{profileData.email}</span>
                        </div>
                        <div className="flex items-start gap-4 text-white/80">
                          <User className={`h-5 w-5 flex-shrink-0 ${isEditMode ? 'mt-[33px]' : 'mt-[10px]'}`} />
                          {isEditMode ? (
                            <div className="flex-1">
                              <label className="block text-sm font-medium text-white/90 mb-1">Bio</label>
                              <textarea
                                value={profileData.bio || ''}
                                onChange={(e) => setProfileData(prev => ({ ...prev, bio: e.target.value }))}
                                className="w-full h-32 bg-white/10 text-white rounded-lg p-3 resize-none"
                                placeholder="Write something about yourself..."
                              />
                            </div>
                          ) : (
                            <p className="text-white/80 whitespace-pre-wrap">
                              {profileData.bio || 'No bio available'}
                            </p>
                          )}
                        </div>
                      </div>
                    </div>
                  </motion.div>
                )}

                {selectedOption === 'security' && (
                  <motion.div
                    key="security"
                    initial={{ opacity: 0, x: 20 }}
                    animate={{ opacity: 1, x: 0 }}
                    exit={{ opacity: 0, x: -20 }}
                    transition={{ duration: 0.3, ease: "easeInOut" }}
                    className="space-y-6 max-w-md"
                  >
                    <div className="space-y-4">
                      <h3 className="text-lg font-medium text-white">Change Password</h3>
                      <div className="space-y-4">
                        <div>
                          <label className="block text-sm font-medium text-white/90 mb-1">Current Password</label>
                          <input
                            type="password"
                            className="bg-white/10 text-white rounded-lg p-2 w-full"
                            placeholder="Enter current password"
                          />
                        </div>
                        <div>
                          <label className="block text-sm font-medium text-white/90 mb-1">New Password</label>
                          <input
                            type="password"
                            className="bg-white/10 text-white rounded-lg p-2 w-full"
                            placeholder="Enter new password"
                          />
                        </div>
                        <div>
                          <label className="block text-sm font-medium text-white/90 mb-1">Confirm New Password</label>
                          <input
                            type="password"
                            className="bg-white/10 text-white rounded-lg p-2 w-full"
                            placeholder="Confirm new password"
                          />
                        </div>
                        <button 
                          className="mt-4 px-6 py-2.5 rounded-full bg-gradient-to-r from-blue-500 to-indigo-600 hover:from-blue-600 hover:to-indigo-700 text-white shadow-lg hover:shadow-indigo-500/30 transition-all duration-300 flex items-center gap-2 text-sm font-medium cursor-pointer"
                        >
                          Update Password
                        </button>
                      </div>
                      <p className="text-sm text-white/60 mt-4">
                        Make sure your new password is at least 8 characters long and includes a mix of letters, numbers, and special characters.
                      </p>
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>
            </div>
          </div>
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
    </>
  );
}