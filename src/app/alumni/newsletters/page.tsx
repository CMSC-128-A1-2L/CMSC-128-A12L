"use client";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { ArrowRight, ChevronLeft, ChevronRight, Search, LayoutList, LayoutGrid, Filter, Newspaper } from "lucide-react";
import { motion, useInView } from "framer-motion";
import { useState, useRef, useEffect } from "react";
import { Newsletter } from "@/entities/newsletters";
import { useRouter } from "next/navigation";
import FilterSidebar from "@/app/components/filtersNewsletterListings";
import ConstellationBackground from "@/app/components/constellationBackground";
import { sortBy } from "lodash";
import NewsletterCard from "@/app/components/newslettersContentCard";
import NewsletterRow from "@/app/components/newslettersContentRow";
import useIsMobile from "@/hooks/useIsMobile";
import MobileNewslettersView from "@/app/components/MobileNewslettersView";

export default function NewslettersPage() {
  const router = useRouter();
  const [newsletters, setNewsletters] = useState<Newsletter[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");
  const [isGridView, setIsGridView] = useState(true);
  const [filterSidebarOpen, setFilterSidebarOpen] = useState(true);

  const [activeFilters, setActiveFilters] = useState({
    sort: 'newest'
  });

  useEffect(() => {
    const fetchNewsletters = async () => {
      try {
        setLoading(true);
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
      }finally{
        setLoading(false);
      }
    };

    fetchNewsletters();
  }, []);

  const toggleView = () => setIsGridView(!isGridView);

  const handleFilterChange = (filters: {sort: string}) => {
    setActiveFilters(filters);
    setSearch("");
  };

  const filteredNewsletters = newsletters.filter((newsletter) => {
    const searchMatch =
      newsletter.title.toLowerCase().includes(search.toLowerCase()) ||
      newsletter.content.toLowerCase().includes(search.toLowerCase());

    return searchMatch;
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

  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = filterSidebarOpen ? 12 : 15;

  const totalPages = Math.ceil(filteredNewsletters.length / itemsPerPage);
  const displayedNewsletters = filteredNewsletters.slice(
    (currentPage - 1) * itemsPerPage,
    currentPage * itemsPerPage
  );

  useEffect(() => {
    setCurrentPage(1);
  }, [filterSidebarOpen]);

  const carouselRef = useRef<HTMLDivElement>(null);

  const handleScroll = (direction: 'left' | 'right') => {
    if (carouselRef.current) {
      if(direction==='left'){
        carouselRef.current.scrollBy({
          left: -carouselRef.current.offsetWidth,
          behavior: "smooth"
        });
      }else{
        carouselRef.current.scrollBy({
          left: carouselRef.current.offsetWidth,
          behavior: "smooth"
        });
      }
    }
  };

  const handleNewsletterDetails = (newsletter: any) => {
    router.push(`/alumni/newsletters/${newsletter._id.toString()}`);
  };

  const isMobile = useIsMobile();

  if (isMobile) {
    return (
      <MobileNewslettersView
        newsletters={newsletters}
        filteredNewsletters={filteredNewsletters}
        loading={loading}
        onNewsletterClick={handleNewsletterDetails}
        carouselRef={carouselRef}
        onFilter={handleFilterChange}
        onSearch={(query) => setSearch(query)}
        activeFilters
      />
    );
  }

  return (
    <div className="min-h-screen text-white">
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
                <div className="absolute inset-0 p-8 flex flex-row justify-end">
                  <div className="p-1">
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
                    <div className="flex items-start gap-6">
                      <p className="text-lg text-gray-200 flex-1 line-clamp-3">
                        {newsletters[0].content.split(' ').slice(0, 20).join(' ')}...
                      </p>
                      <Button 
                        variant="secondary" 
                        className="bg-white text-[#1a1f4d] hover:bg-gray-300 cursor-pointer flex-shrink-0"
                        onClick={() => handleNewsletterDetails(newsletters[0])}
                      >
                        Learn More
                      </Button>
                    </div>
                  </div>
                </div>

              </div>
            </Card>
          )}
        </motion.div>
      </div>

      {/* Carousel Section/Pinned News */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 bg-white/5 rounded-2xl">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.2 }}
          className="relative"
        >
          <h2 className="text-2xl font-bold text-white mb-6">Pinned News</h2>
          <div className="relative px-12 rounded-xl">
            {newsletters.filter(newsletter => newsletter.isPinned).length > 0 ? (
              <>
                <button
                  onClick={() => handleScroll('left')}
                  className="absolute left-1 top-1/2 -translate-y-1/2 z-10 bg-white/10 hover:bg-white/20 text-white p-2 rounded-full backdrop-blur-sm transition-all duration-300 cursor-pointer"
                  aria-label="Scroll left"
                >
                  <ChevronLeft className="w-6 h-6" />
                </button>
                <div 
                  ref={carouselRef}
                  className="flex overflow-x-auto scroll-smooth space-x-4"
                >
                  {newsletters.filter(newsletter => newsletter.isPinned).map((newsletter) => (
                    <motion.div
                      key={newsletter._id}
                      whileHover={{ y: -5 }}
                      transition={{ duration: 0.2 }}
                      className="flex-none snap-center"
                      style={{ width: '520px' }}
                    >
                      <div className="p-2 h-full">
                        <NewsletterCard 
                          _id={newsletter._id}
                          thumbnail={newsletter.thumbnail}
                          title={newsletter.title}
                          tags={newsletter.tags}
                          publishDate={newsletter.publishDate}
                          handleNewsletterDetails={() => handleNewsletterDetails(newsletter)}
                        />
                      </div>
                    </motion.div>
                  ))}
                </div>
                <button
                  onClick={() => handleScroll('right')}
                  className="absolute right-1 top-1/2 -translate-y-1/2 z-10 bg-white/10 hover:bg-white/20 text-white p-2 rounded-full backdrop-blur-sm transition-all duration-300 cursor-pointer"
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
        
      {/* Main Content */}
      <h1 className="text-3xl text-center font-bold text-white mb-6 pt-30">
        See what's going on in the community!
      </h1>
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pb-12">
        {/* Search and View Toggle */}
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.2 }}
          className="flex items-center gap-4 py-4"
        >
          {/* Search bar - center */}
          <div className="flex-1">
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
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
          className="flex flex-wrap items-center gap-2 mb-4"
        >
          <div className="flex items-center gap-3">
            {/* Filter button */}
            <button
              className="px-4 py-2 bg-white/5 hover:bg-white/10 text-white rounded-lg transition-colors border border-white/10 flex items-center gap-2 cursor-pointer"
              onClick={() => setFilterSidebarOpen(!filterSidebarOpen)}
            >
              <Filter size={18} />
              <span>Filter</span>
            </button>
          </div>
          {/* Results count */}
          {filteredNewsletters.length > 0 && (
            <div className="ml-auto text-sm text-gray-400">
              Showing {filteredNewsletters.length} results
            </div>
          )}
        </motion.div>

        <div className="flex gap-8">
          {/* Sidebar */}
          <motion.aside 
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.1 }}
            className={`w-64 flex-shrink-0 ${filterSidebarOpen ? 'block' : 'hidden'}`}
          >
            <div className={`${filterSidebarOpen ? 'block' : 'hidden'} lg:block`}>
              <FilterSidebar
                isOpen={filterSidebarOpen}
                setIsOpen={setFilterSidebarOpen}
                onFilterChange={handleFilterChange}
                activeFilters={activeFilters}
              />
            </div>
          </motion.aside>

          <main className={`flex-1 transition-all duration-300 ${filterSidebarOpen ? '' : 'w-full'}`}>
            {loading ? (
              <div className="flex items-center justify-center py-12">
                <div className="text-white/80">Loading newsletters...</div>
              </div>
            ) : (
              <>
                <motion.div
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  transition={{ delay: 0.3 }}
                  className={`grid ${
                    isGridView
                      ? `grid-cols-1 min-[400px]:grid-cols-1 ${
                          filterSidebarOpen 
                            ? 'sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4' 
                            : 'sm:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5'
                        }`
                      : 'grid-cols-1'
                  } gap-4 xs:gap-4 md:gap-4`}
                >
                  {displayedNewsletters.length > 0 ? (
                    displayedNewsletters.map((newsletter, index) => (
                      <motion.div
                        key={index}
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.3, delay: index * 0.05 }}
                        className="transition-colors"
                      >
                        {isGridView ? (
                          <NewsletterCard 
                            _id={newsletter._id}
                            thumbnail={newsletter.thumbnail}
                            title={newsletter.title}
                            tags={newsletter.tags}
                            publishDate={newsletter.publishDate}
                            handleNewsletterDetails={() => handleNewsletterDetails(newsletter)}
                          />
                        ) : (
                          <NewsletterRow
                            _id={newsletter._id}
                            thumbnail={newsletter.thumbnail}
                            title={newsletter.title}
                            content={newsletter.content}
                            tags={newsletter.tags}
                            publishDate={newsletter.publishDate}
                            handleNewsletterDetails={() => handleNewsletterDetails(newsletter)}
                          />
                        )}
                      </motion.div>
                    ))
                  ) : (
                    <div className="col-span-full text-center py-8">
                      <p className="text-gray-400">
                        No newsletters found matching your filters.
                      </p>
                      {/* Clear filters button */}
                      <button
                        className="px-4 py-2 bg-white/5 hover:bg-white/10 text-white rounded-lg transition-colors mt-4 border border-white/10 cursor-pointer"
                        onClick={() =>
                          handleFilterChange({
                            sort: 'newest'
                          })
                        }
                      >
                        Clear all filters
                      </button>
                    </div>
                  )}
                </motion.div>

                {/* Pagination */}
                {totalPages > 1 && (
                  <motion.div 
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.4 }}
                    className="flex justify-center items-center space-x-4 my-8"
                  >
                    {/* Pagination buttons */}
                    <button
                      onClick={() => setCurrentPage(currentPage - 1)}
                      disabled={currentPage === 1}
                      className="px-4 py-2 bg-white/5 hover:bg-white/10 text-white rounded-lg transition-colors disabled:opacity-50 border border-white/10 cursor-pointer disabled:cursor-not-allowed"
                    >
                      <ChevronLeft />
                    </button>
                    <span className="text-gray-400">
                      {currentPage} / {totalPages}
                    </span>
                    <button
                      onClick={() => setCurrentPage(currentPage + 1)}
                      disabled={currentPage === totalPages}
                      className="px-4 py-2 bg-white/5 hover:bg-white/10 text-white rounded-lg transition-colors disabled:opacity-50 border border-white/10 cursor-pointer disabled:cursor-not-allowed"
                    >
                      <ChevronRight />
                    </button>
                  </motion.div>
                )}
              </>
            )}
          </main>
        </div>
      </div>
    </div>
  );
} 