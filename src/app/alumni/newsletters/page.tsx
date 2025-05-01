"use client";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { ArrowRight, ChevronLeft, ChevronRight, Search, LayoutList, LayoutGrid, Filter } from "lucide-react";
import { motion } from "framer-motion";
import Image from "next/image";
import ConstellationBackground from "@/app/components/constellationBackground";
import { useState, useRef, useEffect } from "react";
import { Newsletter } from "@/entities/newsletters";
import { useRouter } from "next/navigation";
import FilterSidebar from "@/app/components/filtersNewsletterListings";

export default function NewslettersPage() {
  const router = useRouter();
  const [newsletters, setNewsletters] = useState<Newsletter[]>([]);
  const [search, setSearch] = useState("");
  const [isGridView, setIsGridView] = useState(true);
  const [filterSidebarOpen, setFilterSidebarOpen] = useState(true);
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 12;

  const [activeFilters, setActiveFilters] = useState({
    newsletterType: {
      event: false,
      program: false,
      survey: false,
      other: false
    },
    sort: 'newest'
  });

  useEffect(() => {
    const fetchNewsletters = async () => {
      try {
        const response = await fetch("/api/alumni/newsletters", {
          method: 'GET',
          headers: {
            'Content-Type': 'application/json',
          },
        });

        if (!response.ok) {
          throw new Error("Failed to fetch newsletters");
        }

        const data = await response.json();
        const newslettersArray: Newsletter[] = Array.isArray(data) ? data : [];
        
        const sortedNewsletters = newslettersArray.sort(
          (a, b) => new Date(b.publishDate).getTime() - new Date(a.publishDate).getTime()
        );

        setNewsletters(sortedNewsletters);
      } catch (error) {
        console.error("Error fetching newsletters:", error);
        setNewsletters([]);
      }
    };

    fetchNewsletters();
  }, []);

  const toggleView = () => setIsGridView(!isGridView);

  const handleFilterChange = (filters: any) => {
    const newFilters = JSON.parse(JSON.stringify(filters));
    setActiveFilters(newFilters);
    setCurrentPage(1);
  };

  const filteredNewsletters = newsletters.filter((newsletter) => {
    const searchMatch =
      newsletter.title.toLowerCase().includes(search.toLowerCase()) ||
      newsletter.content.toLowerCase().includes(search.toLowerCase());

    const typeFiltersActive =
      activeFilters.newsletterType.event ||
      activeFilters.newsletterType.program ||
      activeFilters.newsletterType.survey ||
      activeFilters.newsletterType.other;

    const typeMatch =
      !typeFiltersActive ||
      (activeFilters.newsletterType.event && newsletter.tags?.toLowerCase().includes('event')) ||
      (activeFilters.newsletterType.program && newsletter.tags?.toLowerCase().includes('program')) ||
      (activeFilters.newsletterType.survey && newsletter.tags?.toLowerCase().includes('survey')) ||
      (activeFilters.newsletterType.other && newsletter.tags?.toLowerCase().includes('other'));

    return searchMatch && typeMatch;
  }).sort((a, b) => {
    switch (activeFilters.sort) {
      case 'newest':
        return new Date(b.publishDate).getTime() - new Date(a.publishDate).getTime();
      case 'oldest':
        return new Date(a.publishDate).getTime() - new Date(b.publishDate).getTime();
      case 'a-z':
        return a.title.localeCompare(b.title);
      case 'z-a':
        return b.title.localeCompare(a.title);
      default:
        return 0;
    }
  });

  const displayedNewsletters = filteredNewsletters.slice(
    (currentPage - 1) * itemsPerPage,
    currentPage * itemsPerPage
  );

  const [scrollPosition, setScrollPosition] = useState(0);
  const carouselRef = useRef<HTMLDivElement>(null);

  const handleScroll = (direction: 'left' | 'right') => {
    if (carouselRef.current) {
      const container = carouselRef.current;
      const isMobile = window.innerWidth < 768; // md breakpoint
      const cardWidth = isMobile ? container.clientWidth - 64 : 520; // Account for padding
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
        const maxCards = Math.floor((scrollWidth - containerWidth) / cardWidth);
        if (cardsScrolled >= maxCards) {
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

  const handleNewsletterDetails = (newsletter: any) => {
    router.push(`/alumni/newsletters/${newsletter._id.toString()}`);
  };

  const NewsletterCard = ({ newsletter }: { newsletter: any }) => (
    <Card 
      className="hover:shadow-lg transition-all duration-300 cursor-pointer bg-white/10 backdrop-blur-sm border-0 flex flex-col"
      onClick={() => handleNewsletterDetails(newsletter)}
    >
      <div className="relative h-48 overflow-hidden">
        {newsletter.thumbnail ? (
          <>
            <img
              src={newsletter.thumbnail}
              alt={newsletter.title}
              className="w-full h-full object-cover"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent" />
          </>
        ) : (
          <div className="relative h-full bg-gradient-to-br from-blue-500/20 to-purple-500/20 flex items-center justify-center">
            <div className="text-center">
              <h3 className="text-xl font-bold text-white/80 line-clamp-2">{newsletter.title}</h3>
            </div>
            <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent" />
          </div>
        )}
      </div>
      <div className="p-6">
        <div className="flex items-center justify-between mb-4">
          <span className="text-sm text-gray-300">{newsletter.tags || 'News'}</span>
        </div>
        <h3 className="text-xl font-semibold text-white mb-2">
          {newsletter.title}
        </h3>
        <div className="flex items-center justify-between">
          <span className="text-sm text-gray-400">
            {new Date(newsletter.publishDate).toLocaleDateString()}
          </span>
          <ArrowRight className="w-5 h-5 text-gray-400" />
        </div>
      </div>
    </Card>
  );

  const NewsletterRow = ({ newsletter }: { newsletter: any }) => (
    <Card 
      className="hover:shadow-lg transition-all duration-300 cursor-pointer bg-white/10 backdrop-blur-sm border-0"
      onClick={() => handleNewsletterDetails(newsletter)}
    >
      <div className="flex gap-6 p-6">
        <div className="relative w-48 h-32 flex-shrink-0 overflow-hidden rounded-lg">
          {newsletter.thumbnail ? (
            <>
              <img
                src={newsletter.thumbnail}
                alt={newsletter.title}
                className="w-full h-full object-cover"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent" />
            </>
          ) : (
            <div className="relative h-full bg-gradient-to-br from-blue-500/20 to-purple-500/20 flex items-center justify-center">
              <div className="text-center">
                <h3 className="text-sm font-bold text-white/80 line-clamp-2">{newsletter.title}</h3>
              </div>
              <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent" />
            </div>
          )}
        </div>
        <div className="flex-1">
          <div className="flex items-center justify-between mb-2">
            <span className="text-sm text-gray-300">{newsletter.tags || 'News'}</span>
            <span className="text-sm text-gray-400">
              {new Date(newsletter.publishDate).toLocaleDateString()}
            </span>
          </div>
          <h3 className="text-xl font-semibold text-white mb-2">
            {newsletter.title}
          </h3>
          <div className="flex justify-end">
            <ArrowRight className="w-5 h-5 text-gray-400" />
          </div>
        </div>
      </div>
    </Card>
  );

  return (
    <div className="min-h-screen bg-[#0a0f2e] text-white">
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
              See the latest news from the alumni association
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
          {newsletters.length > 0 && (
            <Card className="overflow-hidden border-0">
              <div className="relative h-96">
                {newsletters[0].thumbnail ? (
                  <>
                    <img
                      src={newsletters[0].thumbnail}
                      alt={newsletters[0].title}
                      className="w-full h-full object-cover"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-[#1a1f4d] via-[#1a1f4d]/80 to-transparent" />
                  </>
                ) : (
                  <div className="relative h-full bg-gradient-to-br from-blue-500/20 to-purple-500/20 flex items-center justify-center">
                    <div className="text-center">
                      <h3 className="text-3xl font-bold text-white/80">{newsletters[0].title}</h3>
                    </div>
                    <div className="absolute inset-0 bg-gradient-to-t from-[#1a1f4d] via-[#1a1f4d]/80 to-transparent" />
                  </div>
                )}
                <div className="absolute inset-0 p-8 flex flex-col justify-end">
                  <div className="flex items-center justify-between mb-6">
                    <span className="text-sm text-gray-300">
                      {new Date(newsletters[0].publishDate).toLocaleDateString()}
                    </span>
                    <span className="text-sm bg-white/20 px-4 py-2 rounded-full">Latest News</span>
                  </div>
                  <h2 className="text-3xl font-bold mb-4 text-white">
                    {newsletters[0].title}
                  </h2>
                  <div className="flex items-start gap-6">
                    <p className="text-lg text-gray-200 flex-1 line-clamp-3">
                      {newsletters[0].content.split(' ').slice(0, 20).join(' ')}...
                    </p>
                    <Button 
                      variant="secondary" 
                      className="bg-white text-[#1a1f4d] hover:bg-gray-100 cursor-pointer flex-shrink-0"
                      onClick={() => handleNewsletterDetails(newsletters[0])}
                    >
                      Learn More
                    </Button>
                  </div>
                </div>
              </div>
            </Card>
          )}
        </motion.div>
      </div>

      {/* Carousel Section/Pinned News */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.2 }}
          className="relative"
        >
          <h2 className="text-2xl font-bold text-white mb-6">Pinned News</h2>
          <div className="relative px-12">
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
                  className="flex overflow-x-hidden pb-4 md:px-0 px-8 snap-x snap-mandatory"
                >
                  {newsletters.filter(newsletter => newsletter.isPinned).map((newsletter) => (
                    <motion.div
                      key={newsletter._id}
                      whileHover={{ y: -5 }}
                      transition={{ duration: 0.2 }}
                      className="flex-none w-full md:w-[calc(50%-32px)] md:mx-0 mx-auto snap-center"
                    >
                      <div className="p-1 sm:p-2 md:p-4">
                        <NewsletterCard newsletter={newsletter} />
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
              <div className="text-center py-12 bg-white/5 rounded-lg">
                <p className="text-gray-400 text-lg">No pinned news at the moment</p>
              </div>
            )}
          </div>
        </motion.div>
      </div>
        
      {/* Main Content */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
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
                placeholder="Search newsletters"
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
        
        {/* Content area */}
        <div className="flex flex-col sm:flex-row gap-8">
          {/* Sidebar */}
          <motion.aside 
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.1 }}
            className="w-64 flex-shrink-0"
          >
            <div className="flex items-center gap-3 mb-4">
              <button
                className="px-4 py-2 bg-white/5 hover:bg-white/10 text-white rounded-lg transition-colors border border-white/10"
                onClick={() => setFilterSidebarOpen(!filterSidebarOpen)}
              >
                <Filter size={18} />
              </button>
            </div>
            <div className={`${filterSidebarOpen ? 'block' : 'hidden'} lg:block`}>
              <FilterSidebar
                isOpen={filterSidebarOpen}
                setIsOpen={setFilterSidebarOpen}
                onFilterChange={handleFilterChange}
                showModal={() => {}}
                activeFilters={activeFilters}
              />
            </div>
          </motion.aside>

          {/* Main content */}
          <div className="flex-1">
            {/* Active filters */}
            <motion.div 
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.2 }}
              className="flex flex-wrap items-center gap-2 mb-4"
            >
              {Object.entries(activeFilters.newsletterType).map(([key, value]) =>
                value ? (
                  <div
                    key={key}
                    className="px-3 py-2 bg-white/5 rounded-lg text-white border border-white/10 flex items-center gap-2"
                  >
                    {key.charAt(0).toUpperCase() + key.slice(1)}
                    <button
                      className="opacity-60 hover:opacity-100 cursor-pointer"
                      onClick={() => {
                        const newFilters = { ...activeFilters };
                        newFilters.newsletterType[key as keyof typeof newFilters.newsletterType] = false;
                        handleFilterChange(newFilters);
                      }}
                    >
                      ✕
                    </button>
                  </div>
                ) : null
              )}

              {/* Results count */}
              {filteredNewsletters.length > 0 && (
                <div className="ml-auto text-sm text-gray-400">
                  Showing {filteredNewsletters.length} results
                </div>
              )}
            </motion.div>

            {/* Grid/List View */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.3 }}
              className={`grid ${isGridView ? 'grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4' : 'grid-cols-1'} gap-4`}
            >
              {displayedNewsletters.length > 0 ? (
                displayedNewsletters.map((newsletter, index) => (
                  <motion.div
                    key={newsletter._id}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.3, delay: index * 0.05 }}
                    className="transition-colors"
                  >
                    {isGridView ? (
                      <NewsletterCard newsletter={newsletter} />
                    ) : (
                      <NewsletterRow newsletter={newsletter} />
                    )}
                  </motion.div>
                ))
              ) : (
                <div className="col-span-full text-center py-8">
                  <p className="text-gray-400">
                    No newsletters found matching your filters.
                  </p>
                  <button
                    className="px-4 py-2 bg-white/5 hover:bg-white/10 text-white rounded-lg transition-colors mt-4 border border-white/10"
                    onClick={() =>
                      handleFilterChange({
                        newsletterType: {
                          event: false,
                          program: false,
                          survey: false,
                          other: false
                        },
                        sort: 'newest'
                      })
                    }
                  >
                    Clear all filters
                  </button>
                </div>
              )}
            </motion.div>
          </div>
        </div>
      </div>

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