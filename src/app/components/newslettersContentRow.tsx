"use client";
import React from "react";
import { ArrowRight, Newspaper } from "lucide-react";
import { Card } from "@/components/ui/card";

interface NewsletterCardProps {
    _id?: string,
    thumbnail?: string,
    title: string,
    content: string,
    tags?: string,
    publishDate: Date,
    handleNewsletterDetails: () => void;
}

const NewsletterRow: React.FC<NewsletterCardProps> = ({
    _id,
    thumbnail,
    title,
    content,
    tags,
    publishDate,
    handleNewsletterDetails
  }) => {
    return (
        <Card 
        className="hover:shadow-lg transition-all duration-300 cursor-pointer bg-white/10 backdrop-blur-sm border-0"
        onClick={handleNewsletterDetails}
      >
        <div className="flex gap-6 p-6">
          <div className="relative w-48 h-32 flex-shrink-0 overflow-hidden rounded-lg">
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
          <div className="flex-1">
            <div className="flex items-start">
              <span className="text-sm text-gray-400">
                {new Date(publishDate).toLocaleDateString()}
              </span>
            </div>
            <h3 className="text-xl font-semibold text-white mb-1 pt-3">
              {title}
            </h3>
            <div className="flex items-start">
              <span className="text-sm text-gray-400">{tags || 'News'}</span>
            </div>
            <div className="flex items-start pt-3">
              <span className="text-base text-gray-200">{content.split(' ').slice(0, 10).join(' ')}...</span>
            </div>
            <div className="flex justify-end">
              <ArrowRight className="w-5 h-5 text-gray-400" />
            </div>
          </div>
        </div>
      </Card>
    );
  };
  
  export default NewsletterRow;