"use client";

import { useEffect, useState, useMemo } from 'react';
import { useSession } from 'next-auth/react';
import { Briefcase, Mail, MapPin, Calendar, GraduationCap, Globe2, LinkedinIcon, User as UserIcon, Phone, Building2 } from 'lucide-react';
import Image from 'next/image';
import { motion } from 'framer-motion';
import { toast } from 'react-hot-toast';
import { useParams } from 'next/navigation';

// Add styles for constellation animation
const constellationStyles = `
  @keyframes twinkle {
    0% { opacity: 0; }
    50% { opacity: 1; }
    100% { opacity: 0; }
  }
`;

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
  const [selectedOption, setSelectedOption] = useState('personal');

  // Memoize stars and lines to maintain consistent positions
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
  }, []); // Empty dependency array means this will only be calculated once

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
    <div className="min-h-screen bg-[#0f172a]">
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
        {/* Left Column - Profile Info (decreased to accommodate right column) */}
        <div className="w-[43.33%] p-6 relative">
          {/* Profile Picture */}
          <div className="relative -mt-[176px]">
            <div className="h-56 w-56 rounded-full border-4 border-white/20 shadow-lg overflow-hidden bg-white/10 mx-auto">
              {alumni.imageUrl ? (
                <img
                  src={alumni.imageUrl}
                  alt={alumni.name}
                  className="w-full h-full object-cover"
                />
              ) : (
                <div className="w-full h-full flex items-center justify-center">
                  <UserIcon className="h-24 w-24 text-white/60" />
                </div>
              )}
            </div>
          </div>

          {/* Profile Info */}
          <div className="mt-6 text-center">
            <h1 className="text-4xl font-bold text-white mb-4">{alumni.name}</h1>
            <p className="text-lg text-white/80">{alumni.currentPosition} {alumni.currentCompany && `at ${alumni.currentCompany}`}</p>
            <p className="text-base text-white/60 mb-8">{alumni.email}</p>
            
            <div className="flex flex-col items-center gap-3">
              {alumni.phoneNumber && (
                <div className="flex items-center gap-2 text-white/60">
                  <Phone className="w-5 h-5" />
                  <span className="text-base">{alumni.phoneNumber}</span>
                </div>
              )}
              {alumni.currentLocation && (
                <div className="flex items-center gap-2 text-white/60">
                  <MapPin className="w-5 h-5" />
                  <span className="text-base">{alumni.currentLocation}</span>
                </div>
              )}
              {alumni.graduationYear && (
                <div className="flex items-center gap-2 text-white/60">
                  <GraduationCap className="w-5 h-5" />
                  <span className="text-base">Class of {alumni.graduationYear}</span>
                </div>
              )}
              {alumni.department && (
                <div className="flex items-center gap-2 text-white/60">
                  <Building2 className="w-5 h-5" />
                  <span className="text-base">{alumni.department}</span>
                </div>
              )}
            </div>

            {/* Social Links */}
            <div className="mt-8 flex justify-center gap-4">
              {alumni.linkedIn && (
                <a 
                  href={alumni.linkedIn} 
                  target="_blank" 
                  rel="noopener noreferrer"
                  className="p-2 bg-white/10 rounded-full hover:bg-white/20 transition-colors"
                >
                  <LinkedinIcon className="w-6 h-6 text-white" />
                </a>
              )}
              {alumni.website && (
                <a 
                  href={alumni.website} 
                  target="_blank" 
                  rel="noopener noreferrer"
                  className="p-2 bg-white/10 rounded-full hover:bg-white/20 transition-colors"
                >
                  <Globe2 className="w-6 h-6 text-white" />
                </a>
              )}
            </div>
          </div>
        </div>

        {/* Right Column - About Me (increased by 5%) */}
        <div className="w-[56.67%] p-3 relative flex">
          <div className="w-full mt-4">
            <h2 className="text-white text-2xl font-bold">
              ABOUT ME
            </h2>
            <div className="mt-6 text-white/80 text-lg leading-relaxed">
              {alumni.bio ? (
                <p>{alumni.bio}</p>
              ) : (
                <p className="text-white/60 italic">No biography provided yet.</p>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}