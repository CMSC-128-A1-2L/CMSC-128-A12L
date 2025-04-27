"use client";
import { motion, AnimatePresence } from "framer-motion";
import { X } from "lucide-react";

interface AnnouncementModalProps {
  isOpen: boolean;
  onClose: () => void;
  announcement: {
    id: number;
    title: string;
    description: string;
    date: string;
    category: string;
    icon: any;
    color: string;
  } | null;
}

export default function AnnouncementModal({ isOpen, onClose, announcement }: AnnouncementModalProps) {
  if (!announcement) return null;

  const Icon = announcement.icon;

  return (
    <AnimatePresence>
      {isOpen && (
        <>
          {/* Backdrop */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black/50 z-50"
            onClick={onClose}
          />

          {/* Modal */}
          <motion.div
            initial={{ opacity: 0, scale: 0.95, y: 20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.95, y: 20 }}
            className="fixed top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-full max-w-2xl bg-white rounded-xl shadow-xl z-50 overflow-hidden"
          >
            {/* Header */}
            <div className="flex items-center justify-between p-6 border-b">
              <div className="flex items-center gap-3">
                <div className={`p-2 rounded-lg ${announcement.color}`}>
                  <Icon className="w-5 h-5 text-white" />
                </div>
                <h2 className="text-xl font-semibold text-gray-900">{announcement.title}</h2>
              </div>
              <button
                onClick={onClose}
                className="p-2 hover:bg-gray-100 rounded-full transition-colors"
              >
                <X className="w-5 h-5 text-gray-500" />
              </button>
            </div>

            {/* Content */}
            <div className="p-6">
              <div className="flex items-center gap-2 text-sm text-gray-500 mb-4">
                <span>{announcement.category}</span>
                <span>•</span>
                <span>{new Date(announcement.date).toLocaleDateString()}</span>
              </div>
              <p className="text-gray-700 leading-relaxed whitespace-pre-wrap">
                {announcement.description}
              </p>
            </div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
} 