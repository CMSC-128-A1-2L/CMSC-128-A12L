"use client";

import { useState, useEffect, useRef } from 'react';
import { Search, Filter, ChevronLeft, ChevronRight, Plus, X } from 'lucide-react';
import { motion } from 'framer-motion';
import NewsletterCard from './newslettersContentCard';

import { useSession } from "next-auth/react";
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import MobileNewslettersFilterDrawer from './MobileNewslettersFilterDrawer';

interface MobileNewslettersViewProps {
  newsletters: any[];
  filteredNewsletters: any[];
  loading: boolean;
  onNewsletterClick: (newsletter: any) => void;
  carouselRef: any;
  onFilter: (filters: any) => void;
  onSearch: (query: string) => void;
  activeFilters: any;
}

export default function MobileNewslettersView({
  newsletters,
  filteredNewsletters,
  loading,
  onNewsletterClick,
  carouselRef,
  onFilter,
  onSearch,
  activeFilters
}: MobileNewslettersViewProps) {
  const [filterDrawerOpen, setFilterDrawerOpen] = useState(false);
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 6;

  useEffect(() => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  }, [currentPage]);

  const handleScroll = (direction: 'left' | 'right') => {
    if (!carouselRef.current) return;
  
    const container = carouselRef.current;
    const containerWidth = container.clientWidth;
  
    const isMobile = window.innerWidth < 768;
    const cardWidth = isMobile ? containerWidth * 0.85 : 520;
    const gap = 16;
    const totalCardWidth = cardWidth + gap;
  
    const scrollLeft = container.scrollLeft;
  
    const currentIndex = Math.round(
      (scrollLeft + (containerWidth - cardWidth) / 2) / totalCardWidth
    );
  
    const totalCards = newsletters.filter(n => n.isPinned).length;
  
    const newIndex =
      direction === 'left'
        ? currentIndex <= 0
          ? totalCards - 1
          : currentIndex - 1
        : currentIndex >= totalCards - 1
          ? 0
          : currentIndex + 1;
  
    const newScrollLeft = newIndex * totalCardWidth - (containerWidth - cardWidth) / 2;
  
    container.scrollTo({
      left: newScrollLeft,
      behavior: 'smooth',
    });
  };
  

  const handleNewsletterClick = (newsletter: any) => {
    onNewsletterClick(newsletter);
  };

  const totalPages = Math.ceil(filteredNewsletters.length / itemsPerPage);
  const displayedNewsletters = filteredNewsletters.slice((currentPage - 1) * itemsPerPage, currentPage * itemsPerPage);



  return (
    <div className="min-h-screen flex flex-col">
      {/* Highlighted News */}
      {newsletters.length > 0 && (
        <div className="flex pt-5 pb-10 items-center justify-center">
          <Card className="overflow-hidden border-0">
            <div className="relative h-120">
              {newsletters[0].thumbnail ? (
                <>
                  <img
                    src={newsletters[0].thumbnail}
                    alt={newsletters[0].title}
                    className="w-full h-full object-cover"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-[#1a1f4d] via-[#1a1f4d]/60 to-transparent" />
                </>
              ) : (
                <div className="relative h-full bg-gradient-to-br from-blue-500/20 to-purple-500/20 flex items-center justify-center">
                  <div className="text-center">
                    <h3 className="text-3xl font-bold text-white/80">{newsletters[0].title}</h3>
                  </div>
                  <div className="absolute inset-0 bg-gradient-to-t from-[#1a1f4d] via-[#1a1f4d]/80 to-transparent" />
                </div>
              )}
              <div className="absolute inset-0 p-6 flex flex-row justify-end">
                  <div className="p-2 ps-1">
                    <span className="text-sm font-bold bg-white/20 px-4 py-2 rounded-full">Latest News</span>
                  </div>
                  <div className="absolute inset-0 p-8 flex flex-col justify-end">
                    <div className="flex items-center justify-between mb-6">
                      <span className="text-sm text-gray-300">
                        {new Date(newsletters[0].publishDate).toLocaleDateString()}
                      </span>
                    </div>
                    <h2 className="text-3xl font-bold mb-4 text-white">
                      {newsletters[0].title}
                    </h2>
                    <div className="flex gap-6">
                  <p className="text-lg text-gray-200 flex-1 line-clamp-3">
                    {newsletters[0].content.split(' ').slice(0, 10).join(' ')}...
                  </p>
                  <div className="flex flex-col justify-end">
                    <Button 
                      variant="secondary" 
                      className="bg-white text-[#1a1f4d] hover:bg-gray-300 cursor-pointer flex-shrink-0"
                      onClick={() => handleNewsletterClick(newsletters[0])}
                    >
                      Learn More
                    </Button>
                  </div>
                </div>
                  </div>
                </div>
            </div>
          </Card>
      </div>
      )}

      {/* Carousel Section/Pinned News */}
      <div className="w-full overflow-hidden pb-5">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 bg-white/5 rounded-2xl">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.2 }}
            className="relative"
          >
            <h2 className="text-2xl font-bold text-white mb-6">Pinned News</h2>
            
            <div className="relative">
              {newsletters.filter(newsletter => newsletter.isPinned).length > 0 ? (
                <>
                  <button
                    onClick={() => handleScroll('left')}
                    className="absolute left-0 top-1/2 -translate-y-1/2 z-10 bg-white/10 hover:bg-white/20 text-white p-2 rounded-full backdrop-blur-sm transition-all duration-300"
                    aria-label="Scroll left"
                  >
                    <ChevronLeft className="w-6 h-6" />
                  </button>
                  <div 
                    ref={carouselRef}
                    className="flex overflow-x-auto scroll-smooth snap-x snap-mandatory space-x-4 px-12 md:px-16 pb-4"
                  >
                    {newsletters.filter(newsletter => newsletter.isPinned).map((newsletter) => (
                      <motion.div
                      key={newsletter._id}
                      transition={{ duration: 0.2 }}
                      className="flex-none snap-center w-full"
                      >
                        <div className="flex p-2 sm:w-[90%] md:p-4">
                          <NewsletterCard 
                            _id={newsletter._id}
                            thumbnail={newsletter.thumbnail}
                            title={newsletter.title}
                            tags={newsletter.tags}
                            publishDate={newsletter.publishDate}
                            handleNewsletterDetails={() => handleNewsletterClick(newsletter)}
                          />
                        </div>
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
                </>
              ) : (
                <div className="text-center py-10">
                  <p className="text-gray-400 text-lg">No pinned news at the moment</p>
                </div>
              )}
            </div>
          </motion.div>
        </div>
      </div>
      
      
      <h2 className="text-2xl text-center font-bold text-white mb-6 pt-25">
        See what's going on in the community!
      </h2>
      <div className="sticky top-15 left-0 right-0 bg-[#1a1f4d]/95 backdrop-blur-sm z-20">
        {/* Search and Filter Bar */}
        <div className="p-4">
          <div className="flex items-center gap-3">
            <button
              onClick={() => setFilterDrawerOpen(true)}
              className="p-2 bg-white/5 hover:bg-white/10 text-white rounded-lg border border-white/10"
            >
              <Filter size={20} />
            </button>
            <div className="relative flex-1">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" size={18} />
              <input
                type="search"
                placeholder="Search newsletters..."
                className="w-full pl-10 pr-4 py-2 bg-white/5 border border-white/10 rounded-lg text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500"
                onChange={(e) => onSearch(e.target.value)}
              />
            </div>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="flex-1 pt-[136px] px-4 pb-24">

        {/* Top Pagination */}
        {totalPages > 1 && (
          <div className="sm:hidden mb-6">
            <div className="flex items-center justify-between">
              <button
                onClick={() => setCurrentPage(Math.max(1, currentPage - 1))}
                className={`btn ${currentPage > 1 ? 'bg-white/10 hover:bg-white/20' : 'bg-white/5 cursor-not-allowed'} backdrop-blur-sm text-white border-none flex items-center justify-center gap-2 px-4 py-2 rounded-lg transition-all duration-300 shadow-lg hover:shadow-xl border border-white/20`}
                disabled={currentPage === 1}
              >
                <ChevronLeft className="text-xl" />
                <span>Prev</span>
              </button>

              <div className="flex items-center space-x-2">
                <input
                  type="number"
                  value={currentPage}
                  onChange={(e) => {
                    const value = parseInt(e.target.value);
                    if (!isNaN(value) && value >= 1 && value <= totalPages) {
                      setCurrentPage(value);
                    }
                  }}
                  min={1}
                  max={totalPages}
                  className="w-12 input input-bordered input-sm text-center text-base bg-white/10 text-white border-white/20"
                />
                <span className="text-gray-300">/ {totalPages}</span>
              </div>

              <button
                onClick={() => setCurrentPage(Math.min(totalPages, currentPage + 1))}
                className={`btn ${currentPage < totalPages ? 'bg-white/10 hover:bg-white/20' : 'bg-white/5 cursor-not-allowed'} backdrop-blur-sm text-white border-none flex items-center justify-center gap-2 px-4 py-2 rounded-lg transition-all duration-300 shadow-lg hover:shadow-xl border border-white/20`}
                disabled={currentPage === totalPages}
              >
                <span>Next</span>
                <ChevronRight className="text-xl" />
              </button>
            </div>
          </div>
        )}

        {loading ? (
          <div className="flex justify-center py-8">
            <div className="text-white/80">Loading newsletters...</div>
          </div>
        ) : (
          <>
            <div className="space-y-4">
              {displayedNewsletters.map((newsletter, index) => (
                <motion.div
                  key={newsletter._id || index}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: index * 0.1 }}
                >
                  <NewsletterCard 
                    _id={newsletter._id}
                    thumbnail={newsletter.thumbnail}
                    title={newsletter.title}
                    tags={newsletter.tags}
                    publishDate={newsletter.publishDate}
                    handleNewsletterDetails={() => handleNewsletterClick(newsletter)}
                  />
                </motion.div>
              ))}
            </div>

            {/* Bottom Pagination */}
            {totalPages > 1 && (
              <div className="sm:hidden mt-6 mb-8">
                <div className="flex items-center justify-between">
                  <button
                    onClick={() => setCurrentPage(Math.max(1, currentPage - 1))}
                    className={`btn ${currentPage > 1 ? 'bg-white/10 hover:bg-white/20' : 'bg-white/5 cursor-not-allowed'} backdrop-blur-sm text-white border-none flex items-center justify-center gap-2 px-4 py-2 rounded-lg transition-all duration-300 shadow-lg hover:shadow-xl border border-white/20`}
                    disabled={currentPage === 1}
                  >
                    <ChevronLeft className="text-xl" />
                    <span>Prev</span>
                  </button>

                  <div className="flex items-center space-x-2">
                    <input
                      type="number"
                      value={currentPage}
                      onChange={(e) => {
                        const value = parseInt(e.target.value);
                        if (!isNaN(value) && value >= 1 && value <= totalPages) {
                          setCurrentPage(value);
                        }
                      }}
                      min={1}
                      max={totalPages}
                      className="w-12 input input-bordered input-sm text-center text-base bg-white/10 text-white border-white/20"
                    />
                    <span className="text-gray-300">/ {totalPages}</span>
                  </div>

                  <button
                    onClick={() => setCurrentPage(Math.min(totalPages, currentPage + 1))}
                    className={`btn ${currentPage < totalPages ? 'bg-white/10 hover:bg-white/20' : 'bg-white/5 cursor-not-allowed'} backdrop-blur-sm text-white border-none flex items-center justify-center gap-2 px-4 py-2 rounded-lg transition-all duration-300 shadow-lg hover:shadow-xl border border-white/20`}
                    disabled={currentPage === totalPages}
                  >
                    <span>Next</span>
                    <ChevronRight className="text-xl" />
                  </button>
                </div>
              </div>
            )}
          </>
        )}

        <MobileNewslettersFilterDrawer
          isOpen={filterDrawerOpen}
          onClose={() => setFilterDrawerOpen(false)}
          onFilter={onFilter}
          activeFilters={activeFilters}
        />
    </div>
    </div>
  );
}
