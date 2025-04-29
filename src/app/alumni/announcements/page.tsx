"use client";

import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Bell, ArrowRight, Calendar, MessageSquare } from "lucide-react";
import { motion } from "framer-motion";
import Link from "next/link";
import ConstellationBackground from "@/app/components/constellationBackground";
import AnnouncementModal from "@/app/components/announcementModal";
import { useState, useEffect } from "react";

interface Announcement {
  id: number;
  title: string;
  description: string;
  date: string;
  category: string;
  color: string;
  icon: any;
}

export default function AnnouncementsPage() {
  const [selectedAnnouncement, setSelectedAnnouncement] = useState<Announcement | null>(null);
  const [announcements, setAnnouncements] = useState<Announcement[]>([]);

  useEffect(() => {
    const fetchAnnouncements = async () => {
      try {
        const response = await fetch('/api/alumni/announcements'); // Your route.ts should handle this
        if (!response.ok) throw new Error('Failed to fetch announcements');
        const data = await response.json();

        // Category -> Color & Icon mapping
        const categoryStyles: { [key: string]: { color: string; icon: any } } = {
          "Event": { color: "bg-green-500", icon: Calendar },
          "Program": { color: "bg-blue-500", icon: Bell },
          "Survey": { color: "bg-purple-500", icon: MessageSquare },
          // Add more if needed
        };

        const enhancedData: Announcement[] = data.map((announcement: any) => {
          const category = "Event"; // Default category, adjust based on actual logic or data

          return {
            id: announcement._id,  // Use _id from the fetched data
            title: announcement.title,
            description: announcement.content, // Mapping content to description
            date: new Date(announcement.publishDate).toLocaleDateString('en-US', {
              year: 'numeric',
              month: 'long',
              day: 'numeric'
            }),
            category, // You may need to adjust how categories are determined based on your data
            color: categoryStyles[category]?.color || "bg-gray-500",
            icon: categoryStyles[category]?.icon || Bell,
          };
        });

        setAnnouncements(enhancedData);
      } catch (error) {
        console.error('Error loading announcements:', error);
      }
    };

    fetchAnnouncements();
  }, []);


  return (
    <div className="min-h-screen">
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
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Announcements Grid */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.2 }}
          className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6"
        >
          {announcements.map((announcement) => (
            <motion.div
              key={announcement.id ?? `${announcement.title}-${announcement.date}`}

              whileHover={{ y: -5 }}
              transition={{ duration: 0.2 }}
            >
              <Card
                className="p-6 hover:shadow-lg transition-all duration-300 cursor-pointer bg-white/10 backdrop-blur-sm border-0 h-full"
                onClick={() => setSelectedAnnouncement(announcement)}
              >
                <div className="flex items-center justify-between mb-4">
                  <div className={`p-3 rounded-xl ${announcement.color} text-white shadow-lg`}>
                    <announcement.icon className="w-6 h-6" />
                  </div>
                  <span className="text-sm text-gray-300">{announcement.category}</span>
                </div>
                <h3 className="text-xl font-semibold text-white mb-2">
                  {announcement.title}
                </h3>
                <p className="text-gray-200 text-sm mb-4">
                  {announcement.description}
                </p>
                <div className="flex items-center justify-between">
                  <span className="text-sm text-gray-400">
                    {new Date(announcement.date).toLocaleDateString('en-US', {
                      year: 'numeric',
                      month: 'long',
                      day: 'numeric'
                    })}
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
    </div>
  );
}
