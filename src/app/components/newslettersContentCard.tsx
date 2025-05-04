"use client";
import React from "react";
import { ArrowRight, Newspaper } from "lucide-react";
import { motion } from "framer-motion";

interface NewsletterCardProps {
    _id?: string,
    thumbnail?: string,
    title: string,
    tags?: string,
    publishDate: Date,
    handleNewsletterDetails: () => void;
}

const NewsletterCard: React.FC<NewsletterCardProps> = ({
  _id,
  thumbnail,
  title,
  tags,
  publishDate,
  handleNewsletterDetails
}) => {
  return (
    <motion.div
      whileHover={{ y: -5 }}
      transition={{ type: "spring", stiffness: 400, damping: 10 }}
      className="bg-white/5 backdrop-blur-sm rounded-xl overflow-hidden border border-white/10 hover:border-white/20 transition-all duration-300 w-full h-full flex flex-col cursor-pointer"
      onClick={handleNewsletterDetails}
    >
        <div className="relative h-48 overflow-hidden">
          {thumbnail ? (
            <>
              <img
                src={thumbnail}
                alt={title}
                className="w-full h-full object-cover"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent" />
            </>
          ) : (
            <div className="relative h-full bg-gradient-to-br from-blue-500/20 to-purple-500/20 flex items-center justify-center">
                <div className="text-center">
                  <Newspaper className="w-12 h-12 mx-auto mb-2 text-white/40" />
                  <h3 className="text-xl font-bold text-white/80 line-clamp-2">{title}</h3>
                </div>
                <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent" />
            </div>
          )}
        </div>
        <div className="p-6">
          <div className="flex items-center justify-between mb-4">
            <span className="text-sm text-gray-300">{tags || 'News'}</span>
          </div>
          <h3 className="text-xl font-semibold text-white mb-2">
            {title}
          </h3>
          <div className="flex items-center justify-between">
            <span className="text-sm text-gray-400">
              {new Date(publishDate).toLocaleDateString()}
            </span>
            <ArrowRight className="w-5 h-5 text-gray-400" />
          </div>
        </div>
    </motion.div>
  );
};

export default NewsletterCard;