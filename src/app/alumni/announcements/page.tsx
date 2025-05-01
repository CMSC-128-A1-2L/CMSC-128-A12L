"use client";

import { useEffect, useState } from "react";
import { Card } from "@/components/ui/card";
import { ArrowRight, MessageSquare } from "lucide-react";
import { motion } from "framer-motion";
import ConstellationBackground from "@/app/components/constellationBackground";
import AnnouncementModal from "@/app/components/announcementModal";
import Footer from "@/app/components/footer";

interface RawAnnouncement {
  _id: string;
  title: string;
  content: string;
  publishDate: string;
}

interface AnnouncementForModal {
  id: number;
  title: string;
  description: string;
  date: string;
  category: string;
  icon: any;
  color: string;
}

export default function AnnouncementsPage() {
  const [announcements, setAnnouncements] = useState<RawAnnouncement[]>([]);
  const [selectedAnnouncement, setSelectedAnnouncement] = useState<AnnouncementForModal | null>(null);

  useEffect(() => {
    const fetchAnnouncements = async () => {
      try {
        const response = await fetch("/api/alumni/announcements");
        if (!response.ok) {
          throw new Error("Failed to fetch announcements");
        }
        const data = await response.json();
        const announcementsArray: RawAnnouncement[] = Array.isArray(data) ? data : [];

        const sortedAnnouncements = announcementsArray.sort(
          (a, b) => new Date(b.publishDate).getTime() - new Date(a.publishDate).getTime()
        );

        setAnnouncements(sortedAnnouncements);
      } catch (error) {
        console.error("Error fetching announcements:", error);
        setAnnouncements([]);
      }
    };

    fetchAnnouncements();
  }, []);

  const handleCardClick = (announcement: RawAnnouncement) => {
    const modalAnnouncement: AnnouncementForModal = {
      id: Date.now(), // Can be replaced with a better unique ID if needed
      title: announcement.title,
      description: announcement.content,
      date: announcement.publishDate,
      category: "Announcement",
      icon: MessageSquare,
      color: "bg-blue-500",
    };
    setSelectedAnnouncement(modalAnnouncement);
  };

  return (
    <div className="min-h-screen flex flex-col">
      {/* Hero Section */}
      <div className="relative text-white -mt-16 pt-16 overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-r from-[#1a1f4d]/90 to-[#2a3f8f]/90"></div>
        <ConstellationBackground />
        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 z-10">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
            className="text-center"
          >
            <h1 className="text-4xl md:text-5xl font-bold mb-4">
              Announcements
            </h1>
            <p className="text-xl text-gray-200">
              Stay updated with the latest news and events
            </p>
          </motion.div>
        </div>
      </div>

      {/* Main Content */}
      <div className="flex-grow">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.2 }}
          className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12"
        >
          {announcements.map((announcement) => (
            <motion.div
              key={announcement._id}
              whileHover={{ y: -5 }}
              transition={{ duration: 0.2 }}
            >
              <Card
                className="p-6 hover:shadow-lg transition-all duration-300 cursor-pointer bg-white/10 backdrop-blur-sm border-0 h-full"
                onClick={() => handleCardClick(announcement)}
              >
                <div className="flex items-center justify-between mb-4">
                  <div className="p-3 rounded-xl bg-blue-500 text-white shadow-lg">
                    <MessageSquare className="w-6 h-6" />
                  </div>
                  <span className="text-sm text-gray-300">Announcement</span>
                </div>
                <h3 className="text-xl font-semibold text-white mb-2">
                  {announcement.title}
                </h3>
                <p className="text-gray-200 text-sm mb-4 line-clamp-3">
                  {announcement.content}
                </p>
                <div className="flex items-center justify-between">
                  <span className="text-sm text-gray-400">
                    {new Date(announcement.publishDate).toLocaleDateString()}
                  </span>
                  <ArrowRight className="w-5 h-5 text-gray-400" />
                </div>
              </Card>
            </motion.div>
          ))}
        </motion.div>
      </div>

      {/* Modal */}
      <AnnouncementModal
        isOpen={!!selectedAnnouncement}
        onClose={() => setSelectedAnnouncement(null)}
        announcement={selectedAnnouncement}
      />

      {/* Footer */}
      <Footer />
    </div>
  );
}
