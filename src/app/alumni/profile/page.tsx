"use client";

import { motion, AnimatePresence } from "framer-motion";
import React, { useState, useEffect, useRef, useMemo } from "react";
import { useSession } from "next-auth/react";
import { useRouter } from "next/navigation";
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
  CheckCircle2,
} from "lucide-react";
import EditProfileModal from "@/app/components/EditProfileModal";
import debounce from "lodash/debounce";
import { COUNTRIES, validatePhoneNumber } from "@/lib/countries";
import { toast } from "react-hot-toast";

// Interfaces
interface ValidationErrors {
  email?: string;
  graduationYear?: string;
  phoneNumber?: string;
  currentLocation?: string;
  department?: string;
  bio?: string;
  linkedIn?: string;
  website?: string;
  name?: string;
  currentCompany?: string;
  currentPosition?: string;
}

interface ProfileData {
  name: string;
  email: string;
  graduationYear?: number;
  department?: string;
  bio?: string;
  imageUrl?: string;
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

// Validation helper functions
const validateName = (value: string): boolean => {
  return NAME_REGEX.test(value) && value.length <= MAX_NAME_LENGTH;
};

const validateEmail = (value: string): boolean => {
  return EMAIL_REGEX.test(value);
};

const validateGraduationYear = (value: number): boolean => {
  return value >= FOUNDING_YEAR && value <= CURRENT_YEAR;
};

const validateLinkedIn = (value: string): boolean => {
  return value.length <= MAX_URL_LENGTH && LINKEDIN_REGEX.test(value);
};

const validateUrl = (value: string): boolean => {
  return value.length <= MAX_URL_LENGTH && URL_REGEX.test(value);
};

// Constants
const CURRENT_YEAR = new Date().getFullYear();
const FOUNDING_YEAR = 1950;
const MAX_NAME_LENGTH = 100;
const MAX_BIO_LENGTH = 500;
const MAX_LOCATION_LENGTH = 100;
const MAX_DEPARTMENT_LENGTH = 100;
const MAX_COMPANY_LENGTH = 100;
const MAX_POSITION_LENGTH = 100;
const MAX_URL_LENGTH = 200;

// Validation patterns
const NAME_REGEX = /^[a-zA-Z\s.-]+$/;
const EMAIL_REGEX = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
const PHONE_REGEX = /^[\d\s+()-]+$/;
const URL_REGEX = new RegExp(
  '^https?:\\/\\/' + // Protocol (http:// or https://)
  '((([a-z\\d]([a-z\\d-]*[a-z\\d])*)\\.)+[a-z]{2,}|' + // Domain name
  'localhost|' + // localhost
  '((\\d{1,3}\\.){3}\\d{1,3}))' + // OR ip (v4) address
  '(\\:\\d+)?(\\/[-a-z\\d%_.~+]*)*' + // Port and path
  '(\\?[;&a-z\\d%_.~+=-]*)?' + // Query string
  '(\\#[-a-z\\d_]*)?$', // Fragment locator
  'i'
);

const LINKEDIN_REGEX = /^https?:\/\/(www\.)?linkedin\.com\/(in\/[a-zA-Z0-9_-]+|company\/[a-zA-Z0-9_-]+)\/?$/i;

// Add styles for constellation animation
const constellationStyles = `
  @keyframes twinkle {
    0% { opacity: 0; }
    50% { opacity: 1; }
    100% { opacity: 0; }
  }
`;

export default function AlumniProfile() {
  const router = useRouter();
  const { data: session } = useSession() as { data: Session | null };
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [selectedOption, setSelectedOption] = useState("personal");
  const [isEditMode, setIsEditMode] = useState(false);
  const [showSuccessAlert, setShowSuccessAlert] = useState(false);
  const [profileData, setProfileData] = useState<ProfileData>({
    name: session?.user?.name || "",
    email: session?.user?.email || "",
    graduationYear: undefined,
    department: "",
    bio: "",
    imageUrl: session?.user?.image || "",
    phoneNumber: "",
    currentLocation: "",
    currentCompany: "",
    currentPosition: "",
    linkedIn: "",
    website: "",
  });
  const [phoneFormat, setPhoneFormat] = useState("PH");
  const [validationErrors, setValidationErrors] = useState<ValidationErrors>(
    {}
  );
  const [backupData, setBackupData] = useState<ProfileData | null>(null);
  const [websiteHostname, setWebsiteHostname] = useState<string>('');

  const fileInputRef = useRef<HTMLInputElement>(null);
  const navRefs = useRef<{ [key: string]: HTMLButtonElement }>({});
  const observerRef = useRef<IntersectionObserver | null>(null);
  const containerRef = useRef<HTMLDivElement>(null);
  const isScrollingRef = useRef<boolean>(false);
  const scrollTimeoutRef = useRef<NodeJS.Timeout | undefined>(undefined);

  // Add constellation elements
  const constellationElements = useMemo(() => {
    const stars = Array.from({ length: 50 }).map((_, i) => ({
      id: i,
      width: Math.random() * 2 + 1,
      height: Math.random() * 2 + 1,
      left: Math.random() * 100,
      top: Math.random() * 100,
      duration: Math.random() * 5 + 3,
      delay: Math.random() * 5,
    }));

    const lines = Array.from({ length: 20 }).map((_, i) => ({
      id: i,
      width: Math.random() * 150 + 50,
      left: Math.random() * 100,
      top: Math.random() * 100,
      rotation: Math.random() * 360,
      opacity: Math.random() * 0.5,
    }));

    return { stars, lines };
  }, []);

  // Function to find the most centered element
  const findCenteredElement = () => {
    const container = containerRef.current;
    if (!container) return null;

    const containerCenter = container.offsetLeft + container.offsetWidth / 2;
    let closestOption = null;
    let minDistance = Infinity;

    Object.entries(navRefs.current).forEach(([option, element]) => {
      const rect = element.getBoundingClientRect();
      const elementCenter = rect.left + rect.width / 2;
      const distance = Math.abs(elementCenter - containerCenter);

      if (distance < minDistance) {
        minDistance = distance;
        closestOption = option;
      }
    });

    return closestOption;
  };

  // Function to handle manual scrolling to an option
  const scrollToOption = (option: string) => {
    const element = navRefs.current[option];
    if (!element) return;

    // Only apply scroll behavior on mobile
    if (window.innerWidth < 640) {
      element.scrollIntoView({
        behavior: "smooth",
        block: "center",
        inline: "center",
      });
    }

    // Update selection
    setSelectedOption(option);
  };

  // Handle scroll end detection
  const handleScrollEnd = () => {
    if (scrollTimeoutRef.current) {
      clearTimeout(scrollTimeoutRef.current);
    }

    scrollTimeoutRef.current = setTimeout(() => {
      isScrollingRef.current = false;
      // Only apply auto-centering on mobile
      if (window.innerWidth < 640) {
        const centeredOption = findCenteredElement();
        if (centeredOption) {
          setSelectedOption(centeredOption);
          navRefs.current[centeredOption]?.scrollIntoView({
            behavior: "smooth",
            block: "center",
            inline: "center",
          });
        }
      }
    }, 150);
  };

  // Setup scroll event listener
  useEffect(() => {
    const container = containerRef.current;
    if (!container) return;

    const handleScroll = () => {
      // Only handle scroll events on mobile
      if (window.innerWidth < 640) {
        isScrollingRef.current = true;
        handleScrollEnd();
      }
    };

    container.addEventListener("scroll", handleScroll, { passive: true });
    return () => {
      container.removeEventListener("scroll", handleScroll);
      if (scrollTimeoutRef.current) {
        clearTimeout(scrollTimeoutRef.current);
      }
    };
  }, []);
  const [isUploadingImage, setIsUploadingImage] = useState(false);

  const handleImageUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    if (!e.target.files || !e.target.files[0]) return;

    const file = e.target.files[0];

    // Check file size - 3MB limit
    if (file.size > 3 * 1024 * 1024) {
      toast.error('Image size must be less than 3MB');
      return;
    }

    // Check file type
    if (!file.type.startsWith("image/")) {
      toast.error('File must be an image');
      return;
    }

    // Validate file type more specifically
    const allowedTypes = ['image/jpeg', 'image/png', 'image/jpg', 'image/webp'];
    if (!allowedTypes.includes(file.type)) {
      toast.error('Only JPG, PNG and WebP images are allowed');
      return;
    }

    setIsUploadingImage(true);
    const uploadToast = toast.loading('Uploading image...');

    try {
      // First upload to Cloudinary
      const formData = new FormData();
      formData.append("file", file);

      const uploadResponse = await fetch(
        "/api/cloudinary/upload_profile_image",
        {
          method: "POST",
          body: formData,
        }
      );

      if (!uploadResponse.ok) {
        const error = await uploadResponse.text();
        throw new Error(error || "Failed to upload image");
      }

      const { url, public_id } = await uploadResponse.json();

      // Then update the user profile with the new image URL
      const updateResponse = await fetch("/api/users/profile", {
        method: "PUT",        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          ...profileData,
          imageUrl: url,
          cloudinaryPublicId: public_id,
        }),
      });

      if (!updateResponse.ok) {
        throw new Error("Failed to update profile");
      }

      // Update local state
      setProfileData((prev) => ({
        ...prev,
        imageUrl: url,
      }));

      toast.dismiss(uploadToast);
      toast.success('Profile picture updated successfully');
    } catch (error) {
      console.error("Error:", error);
      toast.dismiss(uploadToast);
      toast.error(error instanceof Error ? error.message : 'Failed to update profile picture');
    } finally {
      setIsUploadingImage(false);
    }
  };

  useEffect(() => {
    const fetchProfileData = async () => {
      try {
        const response = await fetch("/api/users/profile");
        if (!response.ok) throw new Error("Failed to fetch profile data");
        const data = await response.json();
        setProfileData((prev) => ({
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

  // Add this useEffect to handle URL parsing
  useEffect(() => {
    if (profileData.website) {
      try {
        const url = new URL(profileData.website);
        setWebsiteHostname(url.hostname);
      } catch {
        setWebsiteHostname(profileData.website);
      }
    } else {
      setWebsiteHostname('');
    }
  }, [profileData.website]);
  // Validation handler with comprehensive field validation
  const handleValidation = debounce((field: string, value: any) => {
    const errors = { ...validationErrors };

    switch (field) {
      case "name":
        if (!value) {
          errors.name = "Name is required";
        } else if (!validateName(value)) {
          errors.name = "Name can only contain letters, spaces, dots, and hyphens";
        } else if (value.length > MAX_NAME_LENGTH) {
          errors.name = `Name must be less than ${MAX_NAME_LENGTH} characters`;
        } else {
          delete errors.name;
        }
        break;

      case "email":
        if (!value) {
          errors.email = "Email is required";
        } else if (!validateEmail(value)) {
          errors.email = "Please enter a valid email address";
        } else {
          delete errors.email;
        }
        break;

      case "graduationYear":
        if (value && !validateGraduationYear(value)) {
          errors.graduationYear = `Year must be between ${FOUNDING_YEAR} and ${CURRENT_YEAR}`;
        } else {
          delete errors.graduationYear;
        }
        break;      case "phoneNumber":
        const digitsOnly = value ? value.replace(/\D/g, "") : "";
        if (value && (!validatePhoneNumber(value, phoneFormat) || digitsOnly.length !== 11)) {
          errors.phoneNumber = "Please enter exactly 11 digits for the phone number";
        } else {
          delete errors.phoneNumber;
        }
        break;

      case "currentLocation":
        if (value?.length > MAX_LOCATION_LENGTH) {
          errors.currentLocation = `Location must be less than ${MAX_LOCATION_LENGTH} characters`;
        } else {
          delete errors.currentLocation;
        }
        break;

      case "currentCompany":
        if (value?.length > MAX_COMPANY_LENGTH) {
          errors.currentCompany = `Company name must be less than ${MAX_COMPANY_LENGTH} characters`;
        } else {
          delete errors.currentCompany;
        }
        break;

      case "currentPosition":
        if (value?.length > MAX_POSITION_LENGTH) {
          errors.currentPosition = `Position must be less than ${MAX_POSITION_LENGTH} characters`;
        } else {
          delete errors.currentPosition;
        }
        break;

      case "department":
        if (value?.length > MAX_DEPARTMENT_LENGTH) {
          errors.department = `Department must be less than ${MAX_DEPARTMENT_LENGTH} characters`;
        } else {
          delete errors.department;
        }
        break;

      case "bio":
        if (value?.length > MAX_BIO_LENGTH) {
          errors.bio = `Bio must be less than ${MAX_BIO_LENGTH} characters`;
        } else {
          delete errors.bio;
        }
        break;

      case "linkedIn":
        if (value && !validateLinkedIn(value)) {
          errors.linkedIn = "Must be a valid LinkedIn URL (e.g. https://linkedin.com/in/username)";
        } else {
          delete errors.linkedIn;
        }
        break;

      case "website":
        if (value && !validateUrl(value)) {
          errors.website = "Must be a valid URL (e.g. https://example.com)";
        } else {
          delete errors.website;
        }
        break;
    }

    setValidationErrors(errors);
  }, 300);
  // Enhanced handleSaveProfile with comprehensive validation and error handling
  const handleSaveProfile = async () => {
    // Validate all fields before saving
    const fields = Object.keys(profileData);
    let hasErrors = false;
    
    fields.forEach(field => {
      handleValidation(field, profileData[field as keyof ProfileData]);
      if (validationErrors[field as keyof ValidationErrors]) {
        hasErrors = true;
      }
    });

    // Show error toast if there are validation errors
    if (hasErrors) {
      toast.error("Please fix the validation errors before saving");
      return;
    }

    try {
      // Show loading state
      const loadingToast = toast.loading("Saving profile changes...");

      const response = await fetch("/api/users/profile", {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(profileData),
      });

      if (!response.ok) {
        throw new Error(await response.text() || "Failed to update profile");
      }

      setBackupData(null); // Clear backup after successful save
      setIsEditMode(false);
      
      // Dismiss loading toast and show success
      toast.dismiss(loadingToast);
      toast.success("Profile updated successfully");
      setShowSuccessAlert(true);

      // Hide alert after 3 seconds
      setTimeout(() => {
        setShowSuccessAlert(false);
      }, 3000);
    } catch (error) {
      console.error("Error updating profile:", error);
      toast.error(error instanceof Error ? error.message : "Failed to update profile");
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
          <div
            className="fixed top-6 left-0 right-0 flex justify-center"
            style={{ zIndex: 99999 }}
          >
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
        <style jsx global>
          {constellationStyles}
        </style>
        <style jsx global>{`
          /* Hide scrollbar for Chrome, Safari and Opera */
          .no-scrollbar::-webkit-scrollbar {
            display: none;
          }

          /* Hide scrollbar for IE, Edge and Firefox */
          .no-scrollbar {
            -ms-overflow-style: none; /* IE and Edge */
            scrollbar-width: none; /* Firefox */
          }
        `}</style>
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
              <div
                className="h-full w-full"
                style={{
                  background:
                    "radial-gradient(circle at center, rgba(255,255,255,0.1) 0%, transparent 60%)",
                }}
              />
            </div>
            <div className="constellation absolute inset-0">
              <div className="stars absolute inset-0">
                {constellationElements.stars.map((star) => (
                  <div
                    key={star.id}
                    className="star absolute rounded-full bg-white"
                    style={{
                      width: star.width + "px",
                      height: star.height + "px",
                      left: star.left + "%",
                      top: star.top + "%",
                      animation: `twinkle ${star.duration}s infinite ${star.delay}s`,
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
                      width: line.width + "px",
                      height: "1px",
                      left: line.left + "%",
                      top: line.top + "%",
                      transform: `rotate(${line.rotation}deg)`,
                      opacity: line.opacity,
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
        <div className="relative w-full min-h-[60vh] flex flex-col lg:flex-row">
          {/* Left Column - Profile Info */}
          <div className="w-full lg:w-[43.33%] p-4 sm:p-6 relative">
            {/* Profile Picture */}
            <div className="relative -mt-[176px] sm:-mt-[176px]">
              <div className="h-56 w-56 sm:h-56 sm:w-56 rounded-full border-4 border-white/20 shadow-lg overflow-hidden bg-white/10 mx-auto relative group">                {isUploadingImage ? (
                  <div className="w-full h-full flex items-center justify-center bg-black/50">
                    <div className="animate-spin rounded-full h-8 w-8 border-2 border-white border-t-transparent" />
                  </div>
                ) : (
                  <>
                    {profileData.imageUrl ? (
                      <img
                        src={profileData.imageUrl}
                        alt={profileData.name}
                        className="w-full h-full object-cover"
                      />
                    ) : (
                      <div className="w-full h-full flex items-center justify-center">
                        <UserIcon className="h-24 w-24 sm:h-24 sm:w-24 text-white/60" />
                      </div>
                    )}
                    {isEditMode && (
                      <div
                        className="absolute inset-0 bg-black/50 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity cursor-pointer"
                        onClick={() => fileInputRef.current?.click()}
                      >
                        <Camera className="h-10 w-10 sm:h-8 sm:w-8 text-white" />
                      </div>
                    )}
                  </>
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
              <h1 className="text-3xl sm:text-4xl font-bold text-white mb-2 sm:mb-4">
                {profileData.name}
              </h1>
              <p className="text-base sm:text-lg text-white/80">
                {profileData.currentPosition}{" "}
                {profileData.currentCompany &&
                  `at ${profileData.currentCompany}`}
              </p>
              <p className="text-sm sm:text-base text-white/60 mb-6 sm:mb-8">
                {profileData.email}
              </p>

              <div className="flex flex-col items-center gap-2 sm:gap-3">
                {profileData.currentLocation && (
                  <div className="flex items-center gap-2 text-white/70 text-sm sm:text-base">
                    <MapPin className="h-4 w-4" />
                    <span>{profileData.currentLocation}</span>
                  </div>
                )}
                {profileData.graduationYear && (
                  <div className="flex items-center gap-2 text-white/70 text-sm sm:text-base">
                    <GraduationCap className="h-4 w-4" />
                    <span>Class of {profileData.graduationYear}</span>
                  </div>
                )}
                {profileData.department && (
                  <div className="flex items-center gap-2 text-white/70 text-sm sm:text-base">
                    <Building2 className="h-4 w-4" />
                    <span>{profileData.department}</span>
                  </div>
                )}
                {profileData.phoneNumber && (
                  <div className="flex items-center gap-2 text-white/70 text-sm sm:text-base mb-4 sm:mb-0">
                    <Phone className="h-4 w-4" />
                    <span>{profileData.phoneNumber}</span>
                  </div>
                )}
                {profileData.website && (
                  <div className="flex items-center gap-2 text-white/70 text-sm sm:text-base">
                    <Globe className="h-4 w-4" />
                    <a 
                      href={profileData.website} 
                      target="_blank" 
                      rel="noopener noreferrer" 
                      className="hover:text-white transition-colors"
                    >
                      {getHostname(profileData.website)}
                    </a>
                  </div>
                )}
                {profileData.linkedIn && (
                  <div className="flex items-center gap-2 text-white/70 text-sm sm:text-base">
                    <Linkedin className="h-4 w-4" />
                    <a
                      href={profileData.linkedIn}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="hover:text-white transition-colors"
                    >
                      LinkedIn Profile
                    </a>
                  </div>
                )}
              </div>

              {/* Edit Profile Button */}
              <div className="mt-2 sm:mt-8 mb-6 sm:mb-32 flex gap-4 justify-center">
                {isEditMode && (
                  <button
                    onClick={() => handleEditMode(false)}
                    className="px-6 sm:px-6 py-3 sm:py-2.5 rounded-full transition-all duration-300 flex items-center gap-3 sm:gap-3 cursor-pointer font-medium text-sm sm:text-sm bg-gray-500 hover:bg-gray-600 text-white shadow-lg hover:shadow-gray-500/30"
                  >
                    Cancel
                  </button>
                )}
                <button
                  onClick={() =>
                    isEditMode ? handleSaveProfile() : setIsEditMode(true)
                  }
                  className={`px-6 sm:px-6 py-3 sm:py-2.5 rounded-full transition-all duration-300 flex items-center gap-3 sm:gap-3 cursor-pointer font-medium text-sm sm:text-sm ${
                    isEditMode
                      ? "bg-gradient-to-r from-green-500 to-emerald-600 hover:from-green-600 hover:to-emerald-700 text-white shadow-lg hover:shadow-emerald-500/30"
                      : "bg-gradient-to-r from-blue-500 to-indigo-600 hover:from-blue-600 hover:to-indigo-700 text-white shadow-lg hover:shadow-indigo-500/30"
                  }`}
                >
                  {isEditMode ? (
                    <>
                      <svg
                        className="w-4 h-4 sm:w-4 sm:h-4"
                        fill="none"
                        stroke="currentColor"
                        viewBox="0 0 24 24"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth="2"
                          d="M5 13l4 4L19 7"
                        />
                      </svg>
                      <span>Save Profile</span>
                    </>
                  ) : (
                    <>
                      <Edit2 className="h-4 w-4 sm:h-4 sm:w-4" />
                      <span>Edit Profile</span>
                    </>
                  )}
                </button>
              </div>
            </div>
          </div>

          {/* Right Column - Additional Content */}
          <div className="flex-1 p-4 sm:p-6 overflow-y-auto">
            {/* Navigation Pills */}
            <div className="relative mb-2 sm:mb-12">
              {/* Mobile fade overlay (left) */}
              <div className="absolute left-0 top-0 bottom-0 w-16 bg-gradient-to-r from-[#0f172a] to-transparent pointer-events-none sm:hidden z-10" />

              {/* Mobile fade overlay (right) */}
              <div className="absolute right-0 top-0 bottom-0 w-16 bg-gradient-to-l from-[#0f172a] to-transparent pointer-events-none sm:hidden z-10" />

              {/* Navigation container */}
              <div
                ref={containerRef}
                className="flex overflow-x-auto no-scrollbar sm:overflow-visible sm:space-x-8 snap-x snap-mandatory pb-2 relative"
              >
                <div className="flex space-x-8 px-[calc(50%-60px)] sm:px-0">
                  {[
                    "personal",
                    "educational",
                    "professional",
                    "biographical",
                    "security",
                  ].map((option) => (
                    <button
                      key={option}
                      ref={(el) => {
                        if (el) navRefs.current[option] = el;
                      }}
                      data-option={option}
                      onClick={() => {
                        scrollToOption(option);
                      }}
                      className={`relative pb-2 cursor-pointer snap-center min-w-[120px] sm:min-w-0 transition-transform duration-200 ${
                        selectedOption === option ? "scale-105" : "scale-100"
                      }`}
                    >
                      <span
                        className={`text-sm sm:text-base font-semibold uppercase whitespace-nowrap ${
                          selectedOption === option
                            ? "text-white"
                            : "text-gray-400 hover:text-white"
                        } transition-colors duration-200`}
                      >
                        {option}
                      </span>
                      <div
                        className="absolute bottom-0 left-0 w-full h-0.5 bg-white/0 transition-all duration-300"
                        style={{
                          backgroundColor:
                            selectedOption === option
                              ? "rgb(255 255 255)"
                              : "transparent",
                          width: selectedOption === option ? "100%" : "0%",
                        }}
                      />
                    </button>
                  ))}
                </div>
              </div>
            </div>

            {/* Content Sections */}
            <div className="pr-0 sm:pr-8 min-h-[calc(100vh-32rem)] sm:min-h-[calc(100vh-36rem)] mt-6 sm:mt-0">
              <AnimatePresence mode="wait">
                {selectedOption === "personal" && (
                  <motion.div
                    key="personal"
                    initial={{ opacity: 0, x: 20 }}
                    animate={{ opacity: 1, x: 0 }}
                    exit={{ opacity: 0, x: -20 }}
                    transition={{ duration: 0.3, ease: "easeInOut" }}
                    className="space-y-4"
                  >
                    <div className="space-y-4">
                      <div className="flex items-center gap-4 text-white/80 text-sm sm:text-base">
                        <Mail className="h-4 w-4 sm:h-5 sm:w-5 flex-shrink-0" />
                        <span>{profileData.email}</span>
                      </div>
                      <div className="flex items-start gap-4 text-white/80">
                        <User
                          className={`h-4 w-4 sm:h-5 sm:w-5 flex-shrink-0 ${
                            isEditMode ? "mt-[33px]" : "mt-[10px]"
                          }`}
                        />
                        {isEditMode ? (
                          <div className="flex-1">
                            <label className="block text-xs sm:text-sm font-medium text-white/90 mb-1">
                              Full Name
                            </label>
                            <input
                              type="text"
                              value={profileData.name || ""}
                              onChange={(e) => {
                                const value = e.target.value;
                                if (
                                  value === "" ||
                                  /^[a-zA-Z\s.-]+$/.test(value)
                                ) {
                                  setProfileData((prev) => ({
                                    ...prev,
                                    name: value,
                                  }));
                                }
                              }}
                              className="bg-white/10 text-white rounded-lg p-2 w-full max-w-md text-sm sm:text-base"
                              placeholder="Enter full name"
                            />
                            <p className="text-[10px] sm:text-xs text-white/60 mt-1">
                              Only letters, spaces, dots, and hyphens are
                              allowed
                            </p>
                          </div>
                        ) : (
                          <span className="pt-2 text-sm sm:text-base">
                            {profileData.name || "No name added"}
                          </span>
                        )}
                      </div>
                      <div className="flex items-start gap-4 text-white/80">
                        <Phone
                          className={`h-4 w-4 sm:h-5 sm:w-5 flex-shrink-0 ${
                            isEditMode ? "mt-[33px]" : "mt-[10px]"
                          }`}
                        />
                        {isEditMode ? (
                          <div className="flex-1">
                            <label className="block text-xs sm:text-sm font-medium text-white/90 mb-1">
                              Mobile Number
                            </label>
                            <div className="flex gap-2 max-w-md">
                              <select
                                value={phoneFormat}
                                onChange={(e) => setPhoneFormat(e.target.value)}
                                className="bg-white/10 text-white rounded-lg p-2 w-14 sm:w-20 text-sm sm:text-base appearance-none cursor-pointer focus:outline-none focus:ring-2 focus:ring-blue-500"
                                style={{
                                  backgroundImage: `url("data:image/svg+xml,%3csvg xmlns='http://www.w3.org/2000/svg' fill='none' viewBox='0 0 20 20'%3e%3cpath stroke='%23ffffff' stroke-linecap='round' stroke-linejoin='round' stroke-width='1.5' d='M6 8l4 4 4-4'/%3e%3c/svg%3e")`,
                                  backgroundPosition: "right 0.25rem center",
                                  backgroundRepeat: "no-repeat",
                                  backgroundSize: "1.25em 1.25em",
                                  paddingRight: "1.75rem",
                                }}
                              >
                                {COUNTRIES.map((country) => (
                                  <option
                                    key={country.code}
                                    value={country.code}
                                    className="bg-[#1a1f4d] text-white"
                                  >
                                    {country.code}
                                  </option>
                                ))}
                              </select>                              <input                                type="tel"
                                value={profileData.phoneNumber || ""}
                                onChange={(e) => {
                                  // Remove all non-digits
                                  let value = e.target.value.replace(/\D/g, "");
                                  
                                  // Limit to 11 digits
                                  if (value.length > 11) {
                                    value = value.slice(0, 11);
                                  }
                                  
                                  setProfileData((prev) => ({
                                    ...prev,
                                    phoneNumber: value,
                                  }));
                                }}
                                onBlur={(e) => {
                                  // On blur, validate the phone number format
                                  const digitsOnly = e.target.value.replace(/\D/g, "");
                                  if (digitsOnly.length > 0 && digitsOnly.length !== 11) {
                                    setProfileData((prev) => ({
                                      ...prev,
                                      phoneNumber: "",
                                    }));
                                  }
                                }}
                                maxLength={11}
                                pattern="[0-9]{11}"
                                className="bg-white/10 text-white rounded-lg p-2 flex-1 text-sm sm:text-base focus:outline-none focus:ring-2 focus:ring-blue-500"
                                placeholder="Enter mobile number (10 digits)"
                              />
                            </div>                              <p className="text-[10px] sm:text-xs text-white/60 mt-1">
                              Enter exactly 11 digits
                            </p>
                          </div>
                        ) : (
                          <span className="pt-2 text-sm sm:text-base">
                            {profileData.phoneNumber || "No phone number added"}
                          </span>
                        )}
                      </div>
                      <div className="flex items-start gap-4 text-white/80">
                        <MapPin
                          className={`h-4 w-4 sm:h-5 sm:w-5 flex-shrink-0 ${
                            isEditMode ? "mt-[33px]" : "mt-[10px]"
                          }`}
                        />
                        {isEditMode ? (
                          <div className="flex-1">
                            <label className="block text-xs sm:text-sm font-medium text-white/90 mb-1">
                              Current Location
                            </label>
                            <input
                              type="text"
                              value={profileData.currentLocation || ""}
                              onChange={(e) =>
                                setProfileData((prev) => ({
                                  ...prev,
                                  currentLocation: e.target.value,
                                }))
                              }
                              className="bg-white/10 text-white rounded-lg p-2 w-full max-w-md text-sm sm:text-base"
                              placeholder="Enter current location"
                            />
                          </div>
                        ) : (
                          <span className="pt-2 text-sm sm:text-base">
                            {profileData.currentLocation || "No location added"}
                          </span>
                        )}
                      </div>
                      <div className="flex items-start gap-4 text-white/80">
                        <Globe
                          className={`h-4 w-4 sm:h-5 sm:w-5 flex-shrink-0 ${
                            isEditMode ? "mt-[33px]" : "mt-[10px]"
                          }`}
                        />
                        {isEditMode ? (
                          <div className="flex-1">
                            <label className="block text-xs sm:text-sm font-medium text-white/90 mb-1">
                              Website
                            </label>
                            <input
                              type="url"
                              value={profileData.website || ''}
                              onChange={(e) => {
                                const value = e.target.value;
                                setProfileData(prev => ({ ...prev, website: value }));
                                handleValidation('website', value);
                              }}

                              className="bg-white/10 text-white rounded-lg p-2 w-full max-w-md text-sm sm:text-base"
                              placeholder="Enter website URL"
                            />
                            {validationErrors.website && (
                              <p className="text-[10px] sm:text-xs text-red-400 mt-1">
                                {validationErrors.website}
                              </p>
                            )}
                          </div>
                        ) : (
                          <span className="pt-2 text-sm sm:text-base">
                            {profileData.website ? (
                              <a 
                                href={profileData.website}
                                target="_blank"
                                rel="noopener noreferrer"
                                className="text-blue-400 hover:text-blue-300"
                              >
                                {getHostname(profileData.website)}

                              </a>
                            ) : (
                              "No website added"
                            )}
                          </span>
                        )}
                      </div>
                      <div className="flex items-start gap-4 text-white/80">
                        <Linkedin
                          className={`h-4 w-4 sm:h-5 sm:w-5 flex-shrink-0 ${
                            isEditMode ? "mt-[33px]" : "mt-[10px]"
                          }`}
                        />
                        {isEditMode ? (
                          <div className="flex-1">
                            <label className="block text-xs sm:text-sm font-medium text-white/90 mb-1">
                              LinkedIn Profile
                            </label>
                            <input
                              type="url"
                              value={profileData.linkedIn || ""}
                              onChange={(e) =>
                                setProfileData((prev) => ({
                                  ...prev,
                                  linkedIn: e.target.value,
                                }))
                              }
                              className="bg-white/10 text-white rounded-lg p-2 w-full max-w-md text-sm sm:text-base"
                              placeholder="Enter LinkedIn profile URL"
                            />
                            {validationErrors.linkedIn && (
                              <p className="text-[10px] sm:text-xs text-red-400 mt-1">
                                {validationErrors.linkedIn}
                              </p>
                            )}
                          </div>
                        ) : (
                          <span className="pt-2 text-sm sm:text-base">
                            {profileData.linkedIn ? (
                              <a
                                href={profileData.linkedIn}
                                target="_blank"
                                rel="noopener noreferrer"
                                className="text-blue-400 hover:text-blue-300"
                              >
                                LinkedIn Profile
                              </a>
                            ) : (
                              "No LinkedIn profile added"
                            )}
                          </span>
                        )}
                      </div>
                    </div>
                  </motion.div>
                )}

                {selectedOption === "educational" && (
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
                        <GraduationCap
                          className={`h-5 w-5 flex-shrink-0 ${
                            isEditMode ? "mt-[33px]" : "mt-[10px]"
                          }`}
                        />
                        {isEditMode ? (
                          <div className="flex-1">
                            <label className="block text-sm font-medium text-white/90 mb-1">
                              Graduation Year
                            </label>
                            <input
                              type="text"
                              value={profileData.graduationYear || ""}
                              onChange={(e) => {
                                const value = e.target.value;
                                // Allow empty value or numbers between FOUNDING_YEAR and CURRENT_YEAR
                                if (value === "" || /^\d{4}$/.test(value)) {
                                  const year = parseInt(value);
                                  if (
                                    !year ||
                                    (year >= FOUNDING_YEAR &&
                                      year <= CURRENT_YEAR)
                                  ) {
                                    setProfileData((prev) => ({
                                      ...prev,
                                      graduationYear: year || undefined,
                                    }));
                                    handleValidation("graduationYear", year);
                                  }
                                }
                              }}
                              className="bg-white/10 text-white rounded-lg p-2 w-full max-w-md"
                              placeholder={`Enter graduation year (${FOUNDING_YEAR}-${CURRENT_YEAR})`}
                            />
                            {validationErrors.graduationYear && (
                              <p className="text-[10px] sm:text-xs text-red-400 mt-1">
                                {validationErrors.graduationYear}
                              </p>
                            )}
                          </div>
                        ) : (
                          <span className="pt-2">
                            Class of{" "}
                            {profileData.graduationYear || "Not specified"}
                          </span>
                        )}
                      </div>
                      <div className="flex items-start gap-4 text-white/80">
                        <Building2
                          className={`h-5 w-5 flex-shrink-0 ${
                            isEditMode ? "mt-[33px]" : "mt-[10px]"
                          }`}
                        />
                        {isEditMode ? (
                          <div className="flex-1">
                            <label className="block text-sm font-medium text-white/90 mb-1">
                              Department
                            </label>
                            <input
                              type="text"
                              value={profileData.department || ""}
                              onChange={(e) =>
                                setProfileData((prev) => ({
                                  ...prev,
                                  department: e.target.value,
                                }))
                              }
                              className="bg-white/10 text-white rounded-lg p-2 w-full max-w-md"
                              placeholder="Enter department"
                            />
                          </div>
                        ) : (
                          <span className="pt-2">
                            {profileData.department || "No department added"}
                          </span>
                        )}
                      </div>
                    </div>
                  </motion.div>
                )}

                {selectedOption === "professional" && (
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
                        <Briefcase
                          className={`h-5 w-5 flex-shrink-0 ${
                            isEditMode ? "mt-[33px]" : "mt-[10px]"
                          }`}
                        />
                        {isEditMode ? (
                          <div className="flex-1">
                            <label className="block text-sm font-medium text-white/90 mb-1">
                              Current Position
                            </label>
                            <input
                              type="text"
                              value={profileData.currentPosition || ""}
                              onChange={(e) =>
                                setProfileData((prev) => ({
                                  ...prev,
                                  currentPosition: e.target.value,
                                }))
                              }
                              className="bg-white/10 text-white rounded-lg p-2 w-full max-w-md"
                              placeholder="Enter current position"
                            />
                          </div>
                        ) : (
                          <span className="pt-2">
                            {profileData.currentPosition || "No position added"}
                          </span>
                        )}
                      </div>
                      <div className="flex items-start gap-4 text-white/80">
                        <Building2
                          className={`h-5 w-5 flex-shrink-0 ${
                            isEditMode ? "mt-[33px]" : "mt-[10px]"
                          }`}
                        />
                        {isEditMode ? (
                          <div className="flex-1">
                            <label className="block text-sm font-medium text-white/90 mb-1">
                              Current Company
                            </label>
                            <input
                              type="text"
                              value={profileData.currentCompany || ""}
                              onChange={(e) =>
                                setProfileData((prev) => ({
                                  ...prev,
                                  currentCompany: e.target.value,
                                }))
                              }
                              className="bg-white/10 text-white rounded-lg p-2 w-full max-w-md"
                              placeholder="Enter current company"
                            />
                          </div>
                        ) : (
                          <span className="pt-2">
                            {profileData.currentCompany || "No company added"}
                          </span>
                        )}
                      </div>
                      <div className="flex items-start gap-4 text-white/80">
                        <Linkedin
                          className={`h-5 w-5 flex-shrink-0 ${
                            isEditMode ? "mt-[33px]" : "mt-[10px]"
                          }`}
                        />
                        {isEditMode ? (
                          <div className="flex-1">
                            <label className="block text-sm font-medium text-white/90 mb-1">
                              LinkedIn Profile
                            </label>
                            <input
                              type="url"
                              value={profileData.linkedIn || ""}
                              onChange={(e) =>
                                setProfileData((prev) => ({
                                  ...prev,
                                  linkedIn: e.target.value,
                                }))
                              }
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
                        <Globe
                          className={`h-5 w-5 flex-shrink-0 ${
                            isEditMode ? "mt-[33px]" : "mt-[10px]"
                          }`}
                        />
                        {isEditMode ? (
                          <div className="flex-1">
                            <label className="block text-sm font-medium text-white/90 mb-1">
                              Website
                            </label>
                            <input
                              type="url"
                              value={profileData.website || ''}
                              onChange={(e) => {
                                const value = e.target.value;
                                setProfileData(prev => ({ ...prev, website: value }));
                                handleValidation('website', value);
                              }}

                              className="bg-white/10 text-white rounded-lg p-2 w-full max-w-md"
                              placeholder="Enter website URL"
                            />
                            {validationErrors.website && (
                              <p className="text-[10px] sm:text-xs text-red-400 mt-1">{validationErrors.website}</p>
                            )}
                          </div>
                        ) : (
                          <span className="pt-2">
                            {profileData.website ? (
                              <a 
                                href={profileData.website}
                                target="_blank"
                                rel="noopener noreferrer"
                                className="hover:text-white transition-colors"
                              >
                                {getHostname(profileData.website)}
                              </a>
                            ) : (
                              'No website added'
                            )}
                          </span>
                        )}
                      </div>
                    </div>
                  </motion.div>
                )}

                {selectedOption === "biographical" && (
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
                          <User
                            className={`h-5 w-5 flex-shrink-0 ${
                              isEditMode ? "mt-[33px]" : "mt-[10px]"
                            }`}
                          />
                          {isEditMode ? (
                            <div className="flex-1">
                              <label className="block text-sm font-medium text-white/90 mb-1">
                                Bio
                              </label>
                              <textarea
                                value={profileData.bio || ""}
                                onChange={(e) =>
                                  setProfileData((prev) => ({
                                    ...prev,
                                    bio: e.target.value,
                                  }))
                                }
                                className="w-full h-32 bg-white/10 text-white rounded-lg p-3 resize-none"
                                placeholder="Write something about yourself..."
                              />
                            </div>
                          ) : (
                            <p className="text-white/80 whitespace-pre-wrap">
                              {profileData.bio || "No bio available"}
                            </p>
                          )}
                        </div>
                      </div>
                    </div>
                  </motion.div>
                )}

                {selectedOption === "security" && (
                  <motion.div
                    key="security"
                    initial={{ opacity: 0, x: 20 }}
                    animate={{ opacity: 1, x: 0 }}
                    exit={{ opacity: 0, x: -20 }}
                    transition={{ duration: 0.3, ease: "easeInOut" }}
                    className="space-y-6 max-w-md"
                  >
                    <div className="space-y-6">
                      <div className="bg-white/5 rounded-xl p-6 backdrop-blur-sm">
                        <div className="flex items-start gap-4">
                          <div className="p-3 rounded-lg bg-indigo-500/10">
                            <svg
                              className="w-6 h-6 text-indigo-500"
                              fill="none"
                              stroke="currentColor"
                              viewBox="0 0 24 24"
                            >
                              <path
                                strokeLinecap="round"
                                strokeLinejoin="round"
                                strokeWidth="2"
                                d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8V7a4 4 0 00-8 0v4h8z"
                              />
                            </svg>
                          </div>
                          <div className="flex-1">
                            <h3 className="text-lg font-medium text-white mb-2">
                              Password Management
                            </h3>
                            <p className="text-white/60 text-sm mb-4">
                              Manage your password and security settings in the
                              settings page. Keep your account secure by
                              regularly updating your password.
                            </p>
                            <button
                              onClick={() => router.push("/alumni/settings")}
                              className="inline-flex items-center gap-2 px-4 py-2 bg-gradient-to-r from-indigo-500 to-blue-600 text-white rounded-lg hover:from-indigo-600 hover:to-blue-700 transition-all duration-200 text-sm font-medium"
                            >
                              <span>Go to Settings</span>
                              <svg
                                className="w-4 h-4"
                                fill="none"
                                stroke="currentColor"
                                viewBox="0 0 24 24"
                              >
                                <path
                                  strokeLinecap="round"
                                  strokeLinejoin="round"
                                  strokeWidth="2"
                                  d="M13 7l5 5m0 0l-5 5m5-5H6"
                                />
                              </svg>
                            </button>
                          </div>
                        </div>
                      </div>

                      <div className="bg-white/5 rounded-xl p-6 backdrop-blur-sm">
                        <div className="flex items-start gap-4">
                          <div className="p-3 rounded-lg bg-blue-500/10">
                            <svg
                              className="w-6 h-6 text-blue-500"
                              fill="none"
                              stroke="currentColor"
                              viewBox="0 0 24 24"
                            >
                              <path
                                strokeLinecap="round"
                                strokeLinejoin="round"
                                strokeWidth="2"
                                d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
                              />
                            </svg>
                          </div>
                          <div>
                            <h3 className="text-lg font-medium text-white mb-2">
                              Security Tips
                            </h3>
                            <ul className="space-y-2 text-white/60 text-sm">
                              <li className="flex items-center gap-2">
                                <span className="w-1.5 h-1.5 bg-blue-500 rounded-full"></span>
                                Use a strong password with at least 8 characters
                              </li>
                              <li className="flex items-center gap-2">
                                <span className="w-1.5 h-1.5 bg-blue-500 rounded-full"></span>
                                Include numbers and special characters
                              </li>
                              <li className="flex items-center gap-2">
                                <span className="w-1.5 h-1.5 bg-blue-500 rounded-full"></span>
                                Change your password regularly
                              </li>
                              <li className="flex items-center gap-2">
                                <span className="w-1.5 h-1.5 bg-blue-500 rounded-full"></span>
                                Never share your password with others
                              </li>
                            </ul>
                          </div>
                        </div>
                      </div>
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

// Helper functions
const getHostname = (url: string): string => {
  try {
    const urlObj = new URL(url);
    return urlObj.hostname;
  } catch {
    return url;
  }
};
