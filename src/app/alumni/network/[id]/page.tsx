"use client";

import { useEffect, useState } from 'react';
import { useSession } from 'next-auth/react';
import { Briefcase, Mail, MapPin, Calendar, GraduationCap, Globe2, LinkedinIcon, User as UserIcon } from 'lucide-react';
import Image from 'next/image';
import { motion } from 'framer-motion';
import { toast } from 'react-hot-toast';
import { useParams } from 'next/navigation';
interface AlumniProfile {
  id: string;
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

interface ProfilePageProps {
  params: {
    id: string;
  };
}

export default function AlumniProfilePage() {
  const params = useParams();
  const id = params?.id as string;
  const { data: session } = useSession();
  const [alumni, setAlumni] = useState<AlumniProfile | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchAlumniProfile = async () => {
      try {

        const response = await fetch(`/api/users/${id}`);
        if (!response.ok) {
          throw new Error('Failed to fetch alumni profile');
        }
        const data = await response.json();
        setAlumni(data);
      } catch (error) {
        console.error('Error fetching alumni profile:', error);
        toast.error('Failed to load alumni profile');
      } finally {
        setLoading(false);
      }
    };

    fetchAlumniProfile();
  }, [id]);

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
                {alumni.imageUrl ? (
                  <img
                    src={alumni.imageUrl}
                    alt={alumni.name}
                    className="w-full h-full object-cover"
                  />
                ) : (
                  <div className="w-full h-full flex items-center justify-center bg-gray-100">
                    <UserIcon className="h-16 w-16 text-gray-400" />
                  </div>
                )}
              </div>
            </div>

            {/* Name and Basic Info */}
            <div className="pt-20">
              <h1 className="text-3xl font-bold text-gray-900">
                {alumni.name}
              </h1>
              <div className="mt-2 flex flex-wrap gap-4">
                {alumni.currentPosition && alumni.currentCompany && (
                  <div className="flex items-center text-gray-600">
                    <Briefcase className="h-5 w-5 mr-2" />
                    <span>{alumni.currentPosition} at {alumni.currentCompany}</span>
                  </div>
                )}
                <div className="flex items-center text-gray-600">
                  <Mail className="h-5 w-5 mr-2" />
                  <span>{alumni.email}</span>
                </div>
                {alumni.currentLocation && (
                  <div className="flex items-center text-gray-600">
                    <MapPin className="h-5 w-5 mr-2" />
                    <span>{alumni.currentLocation}</span>
                  </div>
                )}
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
                {alumni.bio || "No bio available"}
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
                      {alumni.department || "Not specified"}
                    </h3>
                    <p className="text-gray-600">University of the Philippines Los Baños</p>
                    {alumni.graduationYear && (
                      <p className="text-sm text-gray-500">Class of {alumni.graduationYear}</p>
                    )}
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
                {alumni.phoneNumber && (
                  <p className="text-gray-600">{alumni.phoneNumber}</p>
                )}
                {alumni.currentLocation && (
                  <p className="text-gray-600">{alumni.currentLocation}</p>
                )}
              </div>
            </div>

            {/* Social Links */}
            <div className="bg-white rounded-xl shadow-md p-6">
              <h2 className="text-xl font-semibold text-gray-900 flex items-center">
                <Globe2 className="h-6 w-6 mr-2 text-blue-500" />
                Connect
              </h2>
              <div className="mt-4 space-y-3">
                {alumni.linkedIn && (
                  <a
                    href={alumni.linkedIn}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex items-center text-gray-700 hover:text-blue-500 transition-colors"
                  >
                    <LinkedinIcon className="h-5 w-5 mr-2" />
                    LinkedIn Profile
                  </a>
                )}
                {alumni.website && (
                  <a
                    href={alumni.website}
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