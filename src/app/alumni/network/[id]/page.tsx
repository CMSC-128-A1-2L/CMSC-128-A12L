"use client";

import { useEffect, useState } from 'react';
import { useSession } from 'next-auth/react';
import { Briefcase, Mail, MapPin, Calendar, GraduationCap, Globe2, LinkedinIcon, User as UserIcon } from 'lucide-react';
import Image from 'next/image';
import { motion } from 'framer-motion';

interface AlumniProfile {
  id: string;
  fullName: string;
  email: string;
  graduationYear: string;
  courseGraduated: string;
  phoneNumber: string;
  currentLocation: string;
  currentCompany: string;
  currentPosition: string;
  linkedinUrl: string;
  personalWebsite: string;
  bio: string;
  profilePicture: string;
}

// Sample data for demonstration
const sampleAlumni: AlumniProfile = {
  id: "1",
  fullName: "Juan Dela Cruz",
  email: "juan.delacruz@gmail.com",
  graduationYear: "2020",
  courseGraduated: "BS Computer Science",
  phoneNumber: "+63 912 345 6789",
  currentLocation: "Makati City, Philippines",
  currentCompany: "Accenture Philippines",
  currentPosition: "Software Engineer",
  linkedinUrl: "https://linkedin.com/in/juandelacruz",
  personalWebsite: "https://juandelacruz.dev",
  bio: "Passionate software engineer with expertise in web development and cloud computing. UPLB Computer Science graduate with a strong foundation in both frontend and backend technologies. Currently working on enterprise-scale applications and contributing to open-source projects in my free time.",
  profilePicture: "/assets/default-avatar.png"
};

interface ProfilePageProps {
  params: {
    id: string;
  };
}

export default function AlumniProfilePage({ params }: ProfilePageProps) {
  const { data: session } = useSession();
  const [alumni, setAlumni] = useState<AlumniProfile | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Simulate API call with sample data
    const fetchAlumniProfile = async () => {
      try {
        // Simulating API delay
        await new Promise(resolve => setTimeout(resolve, 1000));
        setAlumni(sampleAlumni);
      } catch (error) {
        console.error('Error fetching alumni profile:', error);
      } finally {
        setLoading(false);
      }
    };

    if (session) {
      fetchAlumniProfile();
    }
  }, [params.id, session]);

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-32 w-32 border-t-2 border-b-2 border-blue-500"></div>
      </div>
    );
  }

  if (!alumni) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <h1 className="text-2xl font-bold text-gray-800">Profile Not Found</h1>
          <p className="mt-2 text-gray-600">The alumni profile you're looking for doesn't exist.</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-7xl mx-auto">
        {/* Hero Section */}
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="bg-white rounded-2xl shadow-xl overflow-hidden"
        >
          {/* Cover Photo */}
          <div className="h-60 bg-gradient-to-r from-blue-500 to-indigo-600 relative">
            <div className="absolute bottom-0 left-0 right-0 h-32 bg-gradient-to-t from-black/50 to-transparent"></div>
          </div>

          {/* Profile Info */}
          <div className="relative px-6 pb-6">
            {/* Profile Picture */}
            <div className="absolute -top-20 left-6">
              <div className="h-36 w-36 rounded-full border-4 border-white shadow-lg overflow-hidden bg-white">
                <Image
                  src={alumni.profilePicture}
                  alt={alumni.fullName}
                  width={144}
                  height={144}
                  className="object-cover"
                />
              </div>
            </div>

            {/* Name and Basic Info */}
            <div className="pt-20">
              <h1 className="text-3xl font-bold text-gray-900">
                {alumni.fullName}
              </h1>
              <div className="mt-2 flex flex-wrap gap-4">
                <div className="flex items-center text-gray-600">
                  <Briefcase className="h-5 w-5 mr-2" />
                  <span>{alumni.currentPosition} at {alumni.currentCompany}</span>
                </div>
                <div className="flex items-center text-gray-600">
                  <Mail className="h-5 w-5 mr-2" />
                  <span>{alumni.email}</span>
                </div>
                <div className="flex items-center text-gray-600">
                  <MapPin className="h-5 w-5 mr-2" />
                  <span>{alumni.currentLocation}</span>
                </div>
              </div>
            </div>
          </div>
        </motion.div>

        {/* Details Grid */}
        <div className="mt-8 grid grid-cols-1 md:grid-cols-3 gap-8">
          {/* Main Content */}
          <motion.div 
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.5, delay: 0.2 }}
            className="col-span-2 space-y-8"
          >
            {/* About */}
            <div className="bg-white rounded-xl shadow-md p-6">
              <h2 className="text-xl font-semibold text-gray-900 flex items-center">
                <UserIcon className="h-6 w-6 mr-2 text-blue-500" />
                About
              </h2>
              <p className="mt-4 text-gray-700 leading-relaxed">
                {alumni.bio}
              </p>
            </div>

            {/* Education */}
            <div className="bg-white rounded-xl shadow-md p-6">
              <h2 className="text-xl font-semibold text-gray-900 flex items-center">
                <GraduationCap className="h-6 w-6 mr-2 text-blue-500" />
                Education
              </h2>
              <div className="mt-4 space-y-4">
                <div className="flex items-start">
                  <div className="flex-shrink-0">
                    <div className="h-10 w-10 rounded-full bg-blue-100 flex items-center justify-center">
                      <Calendar className="h-5 w-5 text-blue-500" />
                    </div>
                  </div>
                  <div className="ml-4">
                    <h3 className="text-lg font-medium text-gray-900">
                      {alumni.courseGraduated}
                    </h3>
                    <p className="text-gray-600">University of the Philippines Los Baños</p>
                    <p className="text-sm text-gray-500">Class of {alumni.graduationYear}</p>
                  </div>
                </div>
              </div>
            </div>
          </motion.div>

          {/* Side Information */}
          <motion.div 
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.5, delay: 0.4 }}
            className="space-y-8"
          >
            {/* Contact Information */}
            <div className="bg-white rounded-xl shadow-md p-6">
              <h2 className="text-xl font-semibold text-gray-900 flex items-center">
                <Mail className="h-6 w-6 mr-2 text-blue-500" />
                Contact Information
              </h2>
              <div className="mt-4 space-y-3">
                <p className="text-gray-600">{alumni.email}</p>
                <p className="text-gray-600">{alumni.phoneNumber}</p>
                <p className="text-gray-600">{alumni.currentLocation}</p>
              </div>
            </div>

            {/* Social Links */}
            <div className="bg-white rounded-xl shadow-md p-6">
              <h2 className="text-xl font-semibold text-gray-900 flex items-center">
                <Globe2 className="h-6 w-6 mr-2 text-blue-500" />
                Connect
              </h2>
              <div className="mt-4 space-y-3">
                {alumni.linkedinUrl && (
                  <a
                    href={alumni.linkedinUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex items-center text-gray-700 hover:text-blue-500 transition-colors"
                  >
                    <LinkedinIcon className="h-5 w-5 mr-2" />
                    LinkedIn Profile
                  </a>
                )}
                {alumni.personalWebsite && (
                  <a
                    href={alumni.personalWebsite}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex items-center text-gray-700 hover:text-blue-500 transition-colors"
                  >
                    <Globe2 className="h-5 w-5 mr-2" />
                    Personal Website
                  </a>
                )}
              </div>
            </div>
          </motion.div>
        </div>
      </div>
    </div>
  );
} 