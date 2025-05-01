"use client";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Bell, ArrowRight, Calendar, MessageSquare, ChevronLeft, ChevronRight, Search, LayoutList, LayoutGrid } from "lucide-react";
import { motion } from "framer-motion";
import Image from "next/image";
import ConstellationBackground from "@/app/components/constellationBackground";
import AnnouncementModal from "@/app/components/announcementModal";
import { useState, useRef } from "react";

export default function NewslettersPage() {
  const [search, setSearch] = useState("");
  const [isGridView, setIsGridView] = useState(true);
  const toggleView = () => setIsGridView(!isGridView);
  const [selectedNews, setSelectedNews] = useState<{
    id: number;
    title: string;
    description: string;
    date: string;
    category: string;
    icon: any;
    color: string;
  } | null>(null);

  const [scrollPosition, setScrollPosition] = useState(0);
  const carouselRef = useRef<HTMLDivElement>(null);

  const handleScroll = (direction: 'left' | 'right') => {
    if (carouselRef.current) {
      const container = carouselRef.current;
      const cardWidth = 520;
      const containerWidth = container.clientWidth;
      const scrollWidth = container.scrollWidth;
      
      let newPosition;
      if (direction === 'left') {
        const cardsScrolled = Math.round(scrollPosition / cardWidth);
        if (cardsScrolled <= 0) {
          newPosition = scrollWidth - containerWidth;
        } else {
          newPosition = (cardsScrolled - 1) * cardWidth;
        }
      } else {
        const cardsScrolled = Math.round(scrollPosition / cardWidth);
        if (cardsScrolled >= Math.floor((scrollWidth - containerWidth) / cardWidth)) {
          if (scrollPosition < scrollWidth - containerWidth) {
            newPosition = scrollWidth - containerWidth;
          } else {
            newPosition = 0;
          }
        } else {
          newPosition = (cardsScrolled + 1) * cardWidth;
        }
      }
      
      container.scrollTo({
        left: newPosition,
        behavior: 'smooth'
      });
      setScrollPosition(newPosition);
    }
  };

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
    },
    {
      id: 4,
      title: "Alumni Fun Run Event",
      description: "Join us for a fun run event on the 20th of May. All alumni are welcome to participate!",
      date: "2025-05-20",
      category: "Event",
      icon: Calendar,
      color: "bg-green-500"
    },
    {
      id: 5,
      title: "Campus Tour",
      description: "Tag along as we tour the campus and see the latest developments.",
      date: "2025-10-20",
      category: "Event",
      icon: Calendar,
      color: "bg-green-500"
    },
    {
      id: 6,
      title: "Alumni Game Night",
      description: "Need some time to unwind? Join us for a game night on the 12th of June.",
      date: "2025-06-12",
      category: "Event",
      icon: Calendar,
      color: "bg-green-500"
    },
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
              Newsletters
            </h1>
            <p className="text-xl text-gray-200">
              Stay updated with the latest news and events
            </p>
          </motion.div>
        </div>
      </div>

      {/* Highlighted News */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.1 }}
          className="relative"
        >
          <Card className="p-8 bg-gradient-to-r from-[#1a1f4d] to-[#2a3f8f] text-white border-0">
            <div className="flex items-center justify-between mb-6">
              <div className="p-4 rounded-xl bg-white/20 text-white shadow-lg">
                <Calendar className="w-8 h-8" />
              </div>
              <span className="text-sm bg-white/20 px-4 py-2 rounded-full">Featured News</span>
            </div>
            <h2 className="text-3xl font-bold mb-4">Annual Alumni Homecoming 2024</h2>
            <p className="text-lg text-gray-200 mb-6">
              Join us for our biggest event of the year! Reconnect with old friends, network with fellow alumni, and celebrate our shared journey.
            </p>
            <div className="flex items-center justify-between">
              <span className="text-sm text-gray-300">December 15, 2024</span>
              <Button variant="secondary" className="bg-white text-[#1a1f4d] hover:bg-gray-100">
                Learn More
              </Button>
            </div>
          </Card>
        </motion.div>
      </div>

      {/* Carousel Section */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.2 }}
          className="relative"
        >
          <h2 className="text-2xl font-bold text-white mb-6">Recent News</h2>
          <div className="relative px-12">
            <button
              onClick={() => handleScroll('left')}
              className="absolute left-0 top-1/2 -translate-y-1/2 z-10 bg-white/10 hover:bg-white/20 text-white p-2 rounded-full backdrop-blur-sm transition-all duration-300"
              aria-label="Scroll left"
            >
              <ChevronLeft className="w-6 h-6" />
            </button>
            <div 
              ref={carouselRef}
              className="flex space-x-6 overflow-x-hidden pb-4"
            >
              {announcements.map((announcement) => (
                <motion.div
                  key={announcement.id}
                  whileHover={{ y: -5 }}
                  transition={{ duration: 0.2 }}
                  className="flex-none w-[calc(50%-12px)]"
                >
                  <Card 
                    className="p-6 hover:shadow-lg transition-all duration-300 cursor-pointer bg-white/10 backdrop-blur-sm border-0 h-full"
                    onClick={() => setSelectedNews(announcement)}
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
            </div>
            <button
              onClick={() => handleScroll('right')}
              className="absolute right-0 top-1/2 -translate-y-1/2 z-10 bg-white/10 hover:bg-white/20 text-white p-2 rounded-full backdrop-blur-sm transition-all duration-300"
              aria-label="Scroll right"
            >
              <ChevronRight className="w-6 h-6" />
            </button>
          </div>
        </motion.div>
      </div>
      
      {/* Search and View Toggle */}
      <motion.div 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.2 }}
          className="flex items-center gap-4 py-4 mb-8"
        >
          {/* Search bar - center */}
          <div className="flex-1 max-w-2xl mx-auto">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={18} />
              <input
                type="search"
                placeholder="Search events"
                className="w-full pl-10 pr-16 py-2 bg-white/5 border border-white/10 rounded-lg text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                value={search}
                onChange={(e) => setSearch(e.target.value)}
              />
              <div className="absolute right-3 top-1/2 transform -translate-y-1/2 flex items-center gap-1">
                <kbd className="px-2 py-1 text-xs rounded bg-white/5 text-gray-400">ctrl</kbd>
                <kbd className="px-2 py-1 text-xs rounded bg-white/5 text-gray-400">K</kbd>
              </div>
            </div>
          </div>

          {/* View toggle - right */}
          <button 
            onClick={toggleView} 
            className="px-4 py-2 bg-white/5 hover:bg-white/10 text-white rounded-lg transition-colors flex items-center gap-2 border border-white/10"
          >
            {isGridView ? (
              <>
                <LayoutList size={18} /> List
              </>
            ) : (
              <>
                <LayoutGrid size={18} /> Grid
              </>
            )}
          </button>
        </motion.div>
        
      {/* Main Content */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">

        
        {/* Announcements List */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.2 }}
          className="space-y-6"
        >
          {announcements.map((announcement) => (
            <motion.div
              key={announcement.id}
              whileHover={{ y: -5 }}
              transition={{ duration: 0.2 }}
            >
              <Card 
                className="p-6 hover:shadow-lg transition-all duration-300 cursor-pointer bg-white/10 backdrop-blur-sm border-0"
                onClick={() => setSelectedNews(announcement)}
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
        isOpen={!!selectedNews}
        onClose={() => setSelectedNews(null)}
        announcement={selectedNews}
      />

      {/* Footer */}
      <motion.footer 
        initial={{ opacity: 0 }}
        whileInView={{ opacity: 1 }}
        transition={{ duration: 1 }}
        viewport={{ once: true }}
        className="bg-[#1a237e] border-t border-white/10 p-8 text-center text-sm text-white"
      >
        <div className="max-w-4xl mx-auto">
          {/* CAS & UPLB Logos */}
          <motion.div 
            initial={{ y: 20, opacity: 0 }}
            whileInView={{ y: 0, opacity: 1 }}
            transition={{ duration: 0.8 }}
            viewport={{ once: true }}
            className="flex justify-center space-x-8 mb-6"
          >
            <Image src="/assets/cas.png" alt="CAS Logo" width={60} height={60} className="opacity-90" priority/>
            <Image src="/assets/uplb.png" alt="UPLB Logo" width={60} height={60} className="opacity-90" priority/>
          </motion.div>
        
          {/* Contact Info */}
          <motion.div 
            initial={{ y: 20, opacity: 0 }}
            whileInView={{ y: 0, opacity: 1 }}
            transition={{ duration: 0.8, delay: 0.2 }}
            viewport={{ once: true }}
            className="space-y-2 text-gray-300"
          >
            <p className="font-medium">College of Arts and Sciences</p>
            <p>University of the Philippines Los Baños</p>
            <p>Laguna, Philippines 4031</p>
            <p className="mt-4">(049) 536-2021 | +63-49-536-2322</p>
            <p>ics.uplb@up.edu.ph</p>
          </motion.div>
        </div>
      </motion.footer>
    </div>

    
  );
} 