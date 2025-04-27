"use client";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Bell, ArrowRight, Calendar, MessageSquare } from "lucide-react";
import { motion } from "framer-motion";
import Link from "next/link";
import ConstellationBackground from "@/app/components/constellationBackground";
import AnnouncementModal from "@/app/components/announcementModal";
import { useState } from "react";

export default function AnnouncementsPage() {
  const [selectedAnnouncement, setSelectedAnnouncement] = useState<{
    id: number;
    title: string;
    description: string;
    date: string;
    category: string;
    icon: any;
    color: string;
  } | null>(null);

  const announcements = [
    {
      id: 1,
      title: "Annual Alumni Homecoming",
      description: "Join us for our annual homecoming event on December 15th, 2024. Reconnect with old friends and make new connections!",
      date: "2024-12-15",
      category: "Event",
      icon: Calendar,
      color: "bg-green-500"
    },
    {
      id: 2,
      title: "New Career Development Program",
      description: "We're launching a new career development program for recent graduates. Applications open next month.",
      date: "2024-11-01",
      category: "Program",
      icon: Bell,
      color: "bg-blue-500"
    },
    {
      id: 3,
      title: "Alumni Survey",
      description: "Help us improve our alumni services by participating in our annual survey.",
      date: "2024-10-20",
      category: "Survey",
      icon: MessageSquare,
      color: "bg-purple-500"
    }
  ];

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
              key={announcement.id}
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
                    {new Date(announcement.date).toLocaleDateString()}
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