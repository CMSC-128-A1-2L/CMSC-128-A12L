"use client";

import { useState, useRef, useEffect, useMemo } from "react";
import { FiFilter, FiUsers, FiMapPin, FiBriefcase, FiCalendar } from "react-icons/fi";
import { IoIosArrowForward, IoIosArrowBack } from "react-icons/io";
import { motion } from "framer-motion";
import { useRouter } from "next/navigation";
import { Search, ChevronDown } from "lucide-react";
import ConstellationBackground from "@/app/components/constellationBackground";

type Alumni = {
  id: string;
  name: string;
  lastName: string;
  suffix?: string | null;
  bio?: string;
  imageUrl?: string;
  linkedIn?: string;
  phoneNumber?: string;
  currentLocation?: string;
  currentCompany?: string;
  currentPosition?: string;
  graduationYear?: number;
  department?: string;
};

export default function AlumniPage() {
  const router = useRouter();
  const [search, setSearch] = useState("");
  const [selectedFilter, setSelectedFilter] = useState({
    department: [] as string[],
    graduationYear: [] as string[],
    currentLocation: [] as string[],
    currentCompany: [] as string[],
  });
  const [currentPage, setCurrentPage] = useState(1);
  const [pageInput, setPageInput] = useState("1");
  const [showFilter, setShowFilter] = useState(false);
  const [activeDropdown, setActiveDropdown] = useState<string | null>(null);
  const [alumni, setAlumni] = useState<Alumni[]>([]);
  const [loading, setLoading] = useState(true);
  const itemsPerPage = 10;
  const dropdownRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const fetchAlumni = async () => {
      try {
        const response = await fetch("/api/users");
        if (!response.ok) {
          throw new Error("Failed to fetch alumni");
        }
        const data = await response.json();
        setAlumni(data);
      } catch (error) {
        console.error("Error fetching alumni:", error);
      } finally {
        setLoading(false);
      }
    };
    fetchAlumni();
  }, []);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setActiveDropdown(null);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, []);

  useEffect(() => {
    setPageInput(currentPage.toString());
  }, [currentPage]);

  // Handle dropdown toggle
  const toggleDropdown = (dropdown: string) => {
    if (activeDropdown === dropdown) {
      setActiveDropdown(null);
    } else {
      setActiveDropdown(dropdown);
    }
  };

  // Handle multi-select for filter options
  const toggleFilterOption = (category: keyof typeof selectedFilter, value: string) => {
    const currentSelections = [...selectedFilter[category]];
    
    if (currentSelections.includes(value)) {
      // Remove if already selected
      const newSelections = currentSelections.filter(item => item !== value);
      setSelectedFilter({
        ...selectedFilter,
        [category]: newSelections
      });
    } else {
      // Add if not selected
      setSelectedFilter({
        ...selectedFilter,
        [category]: [...currentSelections, value]
      });
    }
  };

  // Check if a filter option is selected
  const isOptionSelected = (category: keyof typeof selectedFilter, value: string) => {
    return selectedFilter[category].includes(value);
  };

  // Updated filters logic for multi-select
  const filteredAlumni = alumni.filter((alumni) => {
    const fullName = `${alumni.name}`.toLowerCase();
    const searchMatch = fullName.includes(search.toLowerCase());
    
    const departmentMatch =
      selectedFilter.department.length === 0 || 
      (alumni.department && selectedFilter.department.includes(alumni.department));
    
    const yearMatch =
      selectedFilter.graduationYear.length === 0 ||
      (alumni.graduationYear && selectedFilter.graduationYear.includes(alumni.graduationYear.toString()));
    
    const locationMatch =
      selectedFilter.currentLocation.length === 0 ||
      (alumni.currentLocation && selectedFilter.currentLocation.includes(alumni.currentLocation));
    
    const companyMatch =
      selectedFilter.currentCompany.length === 0 ||
      (alumni.currentCompany && selectedFilter.currentCompany.includes(alumni.currentCompany));
    
    return (
      searchMatch &&
      departmentMatch &&
      yearMatch &&
      locationMatch &&
      companyMatch
    );
  });

  // Clear filter - updated for array values
  const clearFilters = () => {
    setSelectedFilter({ 
      department: [],
      graduationYear: [],
      currentLocation: [],
      currentCompany: [],
    });
    setSearch("");
  };

  const totalPages = Math.ceil(filteredAlumni.length / itemsPerPage);
  const displayedAlumni = filteredAlumni.slice(
    (currentPage - 1) * itemsPerPage,
    currentPage * itemsPerPage
  );

  const handlePageInput = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    setPageInput(value);
    const pageNum = parseInt(value);
    if (!isNaN(pageNum) && pageNum >= 1 && pageNum <= totalPages) {
      setCurrentPage(pageNum);
    }
  };

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
              Alumni Network
            </h1>
            <p className="text-xl text-gray-200">
              Connect with fellow alumni and expand your professional network
            </p>
          </motion.div>
        </div>
      </div>

      {/* Main container */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Search and Filter */}
        <div className="flex items-center justify-center gap-2 sm:gap-4 py-4 max-w-3xl mx-auto w-full">
          {/* Search bar - center */}
          <div className="flex-1 max-w-2xl mx-auto">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={18} />
              <input
                type="search"
                placeholder="Search alumni"
                className="w-full pl-10 pr-16 py-2 bg-white/5 border border-white/10 rounded-lg text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent text-sm sm:text-base"
                value={search}
                onChange={(e) => setSearch(e.target.value)}
              />
              <div className="absolute right-3 top-1/2 transform -translate-y-1/2 flex items-center gap-1">
                <kbd className="hidden sm:inline-block px-2 py-1 text-xs rounded bg-white/5 text-gray-400">ctrl</kbd>
                <kbd className="hidden sm:inline-block px-2 py-1 text-xs rounded bg-white/5 text-gray-400">K</kbd>
              </div>
            </div>
          </div>

          {/* Filter Button */}
          <div className="relative">
            <button
              onClick={() => setShowFilter(!showFilter)}
              className="btn btn-outline flex items-center bg-white/10 backdrop-blur-sm border-white/20 text-white hover:bg-white/20 min-w-[100px]"
            >
              <FiFilter className="mr-1" /> Filter
            </button>
          </div>
        </div>

        {/* Filter Row - New */}
            {showFilter && (
          <div className="flex flex-wrap justify-center gap-2 mb-6 max-w-4xl mx-auto" ref={dropdownRef}>
              {/* Department Filter */}
            <div className="relative">
              <button
                onClick={() => toggleDropdown('department')}
                className="flex items-center gap-2 px-4 py-2 bg-white/10 backdrop-blur-sm hover:bg-white/20 rounded-lg text-white border border-white/20 transition-colors cursor-pointer"
              >
                Department
                <ChevronDown size={16} className={`transition-transform ${activeDropdown === 'department' ? 'rotate-180' : ''}`} />
              </button>
              
              {activeDropdown === 'department' && (
                <div className="absolute z-50 mt-2 bg-gradient-to-r from-[#1a1f4d]/90 to-[#2a3f8f]/90 shadow-lg rounded-md w-56 border border-white/20 max-h-[60vh] overflow-y-auto">
                  <div className="p-2 font-bold text-white sticky top-0 bg-gradient-to-r from-[#1a1f4d]/90 to-[#2a3f8f]/90 z-10 border-b border-white/20">
                <div className="flex items-center justify-between">
                  <span>Department</span>
                  <button
                        onClick={(e) => {
                          e.stopPropagation();
                          setSelectedFilter({ ...selectedFilter, department: [] });
                        }}
                        className="text-sm text-gray-300 hover:text-white cursor-pointer"
                  >
                    Clear
                  </button>
                </div>
                  </div>
              {[...new Set(alumni.map((a) => a.department).filter(Boolean))].map((dept) => (
                  <button
                      key={dept}
                      onClick={() => {
                        toggleFilterOption('department', dept!);
                      }}
                    className="block w-full text-left px-4 py-2 hover:bg-white/20 cursor-pointer text-gray-200"
                  >
                      <div className="flex items-center justify-between">
                        <span className="truncate pr-2">{dept}</span>
                        {isOptionSelected('department', dept!) && <span>✓</span>}
                      </div>
                  </button>
              ))}
                </div>
              )}
            </div>
          
              {/* Graduation Year Filter */}
            <div className="relative">
              <button
                onClick={() => toggleDropdown('graduationYear')}
                className="flex items-center gap-2 px-4 py-2 bg-white/10 backdrop-blur-sm hover:bg-white/20 rounded-lg text-white border border-white/20 transition-colors cursor-pointer"
              >
                Graduation Year
                <ChevronDown size={16} className={`transition-transform ${activeDropdown === 'graduationYear' ? 'rotate-180' : ''}`} />
              </button>
              
              {activeDropdown === 'graduationYear' && (
                <div className="absolute z-50 mt-2 bg-gradient-to-r from-[#1a1f4d]/90 to-[#2a3f8f]/90 shadow-lg rounded-md w-56 border border-white/20 max-h-[60vh] overflow-y-auto">
                  <div className="p-2 font-bold text-white sticky top-0 bg-gradient-to-r from-[#1a1f4d]/90 to-[#2a3f8f]/90 z-10 border-b border-white/20">
                <div className="flex items-center justify-between">
                  <span>Graduation Year</span>
                  <button
                        onClick={(e) => {
                          e.stopPropagation();
                          setSelectedFilter({ ...selectedFilter, graduationYear: [] });
                        }}
                        className="text-sm text-gray-300 hover:text-white cursor-pointer"
                  >
                    Clear
                  </button>
                </div>
                  </div>
              {[...new Set(alumni.map((a) => a.graduationYear).filter(Boolean))]
                .sort((a, b) => (b ?? 0) - (a ?? 0))
                .map((year) => (
                      <button
                        key={year}
                        onClick={() => {
                          toggleFilterOption('graduationYear', year!.toString());
                        }}
                        className="block w-full text-left px-4 py-2 hover:bg-white/20 cursor-pointer text-gray-200"
                      >
                        <div className="flex items-center justify-between">
                          <span className="truncate pr-2">{year}</span>
                          {isOptionSelected('graduationYear', year!.toString()) && <span>✓</span>}
                        </div>
                      </button>
                    ))}
                </div>
              )}
            </div>

            {/* Location Filter */}
            <div className="relative">
              <button
                onClick={() => toggleDropdown('location')}
                className="flex items-center gap-2 px-4 py-2 bg-white/10 backdrop-blur-sm hover:bg-white/20 rounded-lg text-white border border-white/20 transition-colors cursor-pointer"
              >
                Location
                <ChevronDown size={16} className={`transition-transform ${activeDropdown === 'location' ? 'rotate-180' : ''}`} />
              </button>
              
              {activeDropdown === 'location' && (
                <div className="absolute z-50 mt-2 bg-gradient-to-r from-[#1a1f4d]/90 to-[#2a3f8f]/90 shadow-lg rounded-md w-56 border border-white/20 max-h-[60vh] overflow-y-auto">
                  <div className="p-2 font-bold text-white sticky top-0 bg-gradient-to-r from-[#1a1f4d]/90 to-[#2a3f8f]/90 z-10 border-b border-white/20">
                    <div className="flex items-center justify-between">
                      <span>Location</span>
                      <button
                        onClick={(e) => {
                          e.stopPropagation();
                          setSelectedFilter({ ...selectedFilter, currentLocation: [] });
                        }}
                        className="text-sm text-gray-300 hover:text-white cursor-pointer"
                      >
                        Clear
                      </button>
                    </div>
                  </div>
                  {[...new Set(alumni.map((a) => a.currentLocation).filter(Boolean))].map((location) => (
                    <button
                      key={location}
                      onClick={() => {
                        toggleFilterOption('currentLocation', location!);
                      }}
                      className="block w-full text-left px-4 py-2 hover:bg-white/20 cursor-pointer text-gray-200"
                    >
                      <div className="flex items-center justify-between">
                        <span className="truncate pr-2">{location}</span>
                        {isOptionSelected('currentLocation', location!) && <span>✓</span>}
                      </div>
                    </button>
                  ))}
                </div>
              )}
            </div>

            {/* Company Filter */}
            <div className="relative">
                  <button
                onClick={() => toggleDropdown('company')}
                className="flex items-center gap-2 px-4 py-2 bg-white/10 backdrop-blur-sm hover:bg-white/20 rounded-lg text-white border border-white/20 transition-colors cursor-pointer"
                  >
                Company
                <ChevronDown size={16} className={`transition-transform ${activeDropdown === 'company' ? 'rotate-180' : ''}`} />
                  </button>
          
              {activeDropdown === 'company' && (
                <div className="absolute z-50 mt-2 bg-gradient-to-r from-[#1a1f4d]/90 to-[#2a3f8f]/90 shadow-lg rounded-md w-56 border border-white/20 max-h-[60vh] overflow-y-auto">
                  <div className="p-2 font-bold text-white sticky top-0 bg-gradient-to-r from-[#1a1f4d]/90 to-[#2a3f8f]/90 z-10 border-b border-white/20">
                <div className="flex items-center justify-between">
                      <span>Company</span>
                  <button
                        onClick={(e) => {
                          e.stopPropagation();
                          setSelectedFilter({ ...selectedFilter, currentCompany: [] });
                        }}
                        className="text-sm text-gray-300 hover:text-white cursor-pointer"
                  >
                    Clear
                  </button>
                </div>
                  </div>
              {[...new Set(alumni.map((a) => a.currentCompany).filter(Boolean))].map((company) => (
                    <button
                      key={company}
                      onClick={() => {
                        toggleFilterOption('currentCompany', company!);
                      }}
                      className="block w-full text-left px-4 py-2 hover:bg-white/20 cursor-pointer text-gray-200"
                    >
                      <div className="flex items-center justify-between">
                        <span className="truncate pr-2">{company}</span>
                        {isOptionSelected('currentCompany', company!) && <span>✓</span>}
                      </div>
                    </button>
                  ))}
                </div>
              )}
            </div>

            {/* Clear All Button */}
            <button
              onClick={clearFilters}
              className="px-4 py-2 bg-blue-600/30 hover:bg-blue-600/40 rounded-lg text-white border border-blue-400/50 transition-colors cursor-pointer"
            >
              Clear All
            </button>
          </div>
        )}

        {/* Content area */}
        <div className="flex gap-6 -mt-[5px]">
          {/* Main content */}
          <main className="flex-1">
            {/* Active filters */}
            <div className="flex flex-wrap items-center gap-2 mb-4">
              {/* Department filters */}
              {selectedFilter.department.map((dept) => (
                <div
                  key={`dept-${dept}`}
                  className="badge badge-lg gap-2 px-3 py-3 bg-white/20 backdrop-blur-sm text-white border-white/20"
                >
                  <span className="truncate max-w-[150px]">{dept}</span>
                  <button
                    className="text-white opacity-60 hover:opacity-100 cursor-pointer"
                    onClick={() => {
                      const newDepartments = selectedFilter.department.filter(d => d !== dept);
                      setSelectedFilter({
                        ...selectedFilter,
                        department: newDepartments
                      });
                    }}
                  >
                    ✕
                  </button>
                </div>
              ))}

              {/* Graduation Year filters */}
              {selectedFilter.graduationYear.map((year) => (
                <div
                  key={`year-${year}`}
                  className="badge badge-lg gap-2 px-3 py-3 bg-white/20 backdrop-blur-sm text-white border-white/20"
                >
                  <span className="truncate max-w-[150px]">{year}</span>
                  <button
                    className="text-white opacity-60 hover:opacity-100 cursor-pointer"
                    onClick={() => {
                      const newYears = selectedFilter.graduationYear.filter(y => y !== year);
                      setSelectedFilter({
                        ...selectedFilter,
                        graduationYear: newYears
                      });
                    }}
                  >
                    ✕
                  </button>
                </div>
              ))}

              {/* Location filters */}
              {selectedFilter.currentLocation.map((location) => (
                <div
                  key={`location-${location}`}
                    className="badge badge-lg gap-2 px-3 py-3 bg-white/20 backdrop-blur-sm text-white border-white/20"
                >
                  <span className="truncate max-w-[150px]">{location}</span>
                  <button
                    className="text-white opacity-60 hover:opacity-100 cursor-pointer"
                    onClick={() => {
                      const newLocations = selectedFilter.currentLocation.filter(l => l !== location);
                      setSelectedFilter({
                        ...selectedFilter,
                        currentLocation: newLocations
                      });
                    }}
                  >
                    ✕
                  </button>
                </div>
              ))}

              {/* Company filters */}
              {selectedFilter.currentCompany.map((company) => (
                <div
                  key={`company-${company}`}
                  className="badge badge-lg gap-2 px-3 py-3 bg-white/20 backdrop-blur-sm text-white border-white/20"
                >
                  <span className="truncate max-w-[150px]">{company}</span>
                    <button
                      className="text-white opacity-60 hover:opacity-100 cursor-pointer"
                      onClick={() => {
                      const newCompanies = selectedFilter.currentCompany.filter(c => c !== company);
                      setSelectedFilter({
                        ...selectedFilter,
                        currentCompany: newCompanies
                      });
                      }}
                    >
                      ✕
                    </button>
                  </div>
              ))}

              {/* Results count */}
              {filteredAlumni.length > 0 && (
                <div className="ml-auto text-sm text-gray-300">
                  Showing {filteredAlumni.length} results
                </div>
              )}
            </div>

            {/* Alumni Grid with Pagination */}
            <div className="relative">
              {/* Mobile Top Pagination */}
              <div className="sm:hidden mb-6">
                <div className="flex items-center justify-between">
                  <button
                    onClick={() => currentPage > 1 && setCurrentPage(currentPage - 1)}
                    className={`btn ${currentPage > 1 ? 'bg-white/10 hover:bg-white/20' : 'bg-white/5 cursor-not-allowed'} backdrop-blur-sm text-white border-none flex items-center justify-center gap-2 px-4 py-2 rounded-lg transition-all duration-300 shadow-lg hover:shadow-xl border border-white/20`}
                    disabled={currentPage <= 1}
                  >
                    <IoIosArrowBack className="text-xl" />
                    <span>Prev</span>
                  </button>

                  {totalPages > 1 && (
                    <div className="flex items-center space-x-2">
                      <input
                        type="number"
                        value={pageInput}
                        onChange={handlePageInput}
                        min={1}
                        max={totalPages}
                        className="w-12 input input-bordered input-sm text-center text-base bg-white/10 text-white border-white/20"
                      />
                      <span className="text-gray-300">/ {totalPages}</span>
                    </div>
                  )}

                  <button
                    onClick={() => currentPage < totalPages && setCurrentPage(currentPage + 1)}
                    className={`btn ${currentPage < totalPages ? 'bg-white/10 hover:bg-white/20' : 'bg-white/5 cursor-not-allowed'} backdrop-blur-sm text-white border-none flex items-center justify-center gap-2 px-4 py-2 rounded-lg transition-all duration-300 shadow-lg hover:shadow-xl border border-white/20`}
                    disabled={currentPage >= totalPages}
                  >
                    <span>Next</span>
                    <IoIosArrowForward className="text-xl" />
                  </button>
                </div>
              </div>

              {/* Alumni Grid */}
              <motion.div 
                key={currentPage}
                initial={{ opacity: 0, x: currentPage > 1 ? -20 : 20 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: currentPage > 1 ? 20 : -20 }}
                transition={{ duration: 0.3 }}
                className="grid grid-cols-2 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-4 sm:gap-4"
              >
                {loading ? (
                  <div className="col-span-full text-center py-8">
                    <p className="text-gray-400">Loading alumni data...</p>
                  </div>
                ) : displayedAlumni.length > 0 ? (
                  displayedAlumni.map((alumni, index) => (
                    <motion.div
                      key={alumni.id}
                      initial={{ opacity: 0, y: 20 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ duration: 0.3, delay: index * 0.05 }}
                      className="w-full h-[248px] sm:h-88 bg-white/10 backdrop-blur-sm rounded-lg overflow-hidden shadow-md flex flex-col relative group transition-all duration-300 border border-white/20 hover:-translate-y-2"
                    >
                      {/* Front View - Default */}
                      <div className="relative w-full h-full flex flex-col bg-white/10">
                        <div className="w-full h-[85%] bg-white/20 overflow-hidden">
                          {alumni.imageUrl ? (
                            <img
                              src={alumni.imageUrl}
                              alt={alumni.name}
                              className="w-full h-full object-cover"
                            />
                          ) : (
                            <div className="w-full h-full flex items-center justify-center bg-white/5">
                              <FiUsers className="text-gray-400 w-12 h-12 sm:w-16 sm:h-16" />
                            </div>
                          )}
                        </div>
                        <div className="w-full flex-1 py-2 sm:py-3 px-2 text-center bg-black/20 backdrop-blur-sm">
                          <p className="text-white font-medium text-sm sm:text-base truncate">{alumni.name}</p>
                          <p className="text-gray-300 text-xs sm:text-sm">Batch {alumni.graduationYear || "N/A"}</p>
                        </div>
                      </div>

                      {/* Hover View - Detailed Info */}
                      <div className="absolute inset-0 bg-black/80 backdrop-blur-sm p-3 sm:p-4 flex flex-col items-center justify-between opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                        <div className="w-full space-y-2 sm:space-y-4">
                          <div className="text-center mb-1 sm:mb-2">
                            <h3 className="text-base sm:text-xl font-semibold text-white truncate">{alumni.name}</h3>
                            <p className="text-gray-300 text-xs sm:text-sm">Class of {alumni.graduationYear || "N/A"}</p>
                          </div>
                          
                          {/* Academic Info */}
                          <div className="text-gray-200 text-xs sm:text-sm">
                            <p className="mb-1 text-center line-clamp-1">{alumni.department || "Department not specified"}</p>
                          </div>

                          {/* Professional Info */}
                          {(alumni.currentPosition || alumni.currentCompany) && (
                            <div className="text-gray-200 text-center border-t border-white/10 pt-2 sm:pt-4">
                              <p className="text-xs sm:text-sm line-clamp-1">{alumni.currentPosition}</p>
                              <p className="text-gray-300 text-xs sm:text-sm line-clamp-1">{alumni.currentCompany}</p>
                            </div>
                          )}

                          {/* Contact Links */}
                          <div className="flex justify-center space-x-2">
                            {alumni.linkedIn && (
                              <a
                                href={alumni.linkedIn}
                                target="_blank"
                                rel="noopener noreferrer"
                                className="text-blue-400 hover:text-blue-300 underline text-xs sm:text-sm"
                                onClick={(e) => e.stopPropagation()}
                              >
                                LinkedIn Profile
                              </a>
                            )}
                          </div>
                        </div>
                        
                        <button 
                          onClick={() => router.push(`/alumni/network/${alumni.id}`)}
                          className="mt-2 sm:mt-6 px-4 sm:px-6 py-1.5 sm:py-2 bg-white/10 hover:bg-white/20 border border-white/40 rounded-lg text-white transition-colors cursor-pointer text-xs sm:text-sm"
                        >
                          View Full Profile
                        </button>
                      </div>
                    </motion.div>
                  ))
                ) : (
                  <div className="col-span-full text-center py-8">
                    <p className="text-gray-400">
                      No alumni found matching your filters.
                    </p>
                    <button
                      className="btn btn-error btn-sm rounded-lg mt-4"
                      onClick={clearFilters}
                    >
                      Clear all filters
                    </button>
                  </div>
                )}
              </motion.div>

              {/* Mobile Bottom Pagination */}
              <div className="sm:hidden mt-6">
                <div className="flex items-center justify-between">
                  <button
                    onClick={() => currentPage > 1 && setCurrentPage(currentPage - 1)}
                    className={`btn ${currentPage > 1 ? 'bg-white/10 hover:bg-white/20' : 'bg-white/5 cursor-not-allowed'} backdrop-blur-sm text-white border-none flex items-center justify-center gap-2 px-4 py-2 rounded-lg transition-all duration-300 shadow-lg hover:shadow-xl border border-white/20`}
                    disabled={currentPage <= 1}
                  >
                    <IoIosArrowBack className="text-xl" />
                    <span>Prev</span>
                  </button>

                  {totalPages > 1 && (
                    <div className="flex items-center space-x-2">
                      <input
                        type="number"
                        value={pageInput}
                        onChange={handlePageInput}
                        min={1}
                        max={totalPages}
                        className="w-12 input input-bordered input-sm text-center text-base bg-white/10 text-white border-white/20"
                      />
                      <span className="text-gray-300">/ {totalPages}</span>
                    </div>
                  )}

                  <button
                    onClick={() => currentPage < totalPages && setCurrentPage(currentPage + 1)}
                    className={`btn ${currentPage < totalPages ? 'bg-white/10 hover:bg-white/20' : 'bg-white/5 cursor-not-allowed'} backdrop-blur-sm text-white border-none flex items-center justify-center gap-2 px-4 py-2 rounded-lg transition-all duration-300 shadow-lg hover:shadow-xl border border-white/20`}
                    disabled={currentPage >= totalPages}
                  >
                    <span>Next</span>
                    <IoIosArrowForward className="text-xl" />
                  </button>
                </div>
              </div>

              {/* Desktop Pagination Buttons */}
              <div className="hidden sm:block">
                {currentPage > 1 && (
                  <button
                    onClick={() => setCurrentPage(currentPage - 1)}
                    className="btn bg-white/10 backdrop-blur-sm text-white border-none flex-shrink-0 w-16 h-16 text-2xl absolute -left-20 top-1/2 -mt-8 z-10 rounded-full hover:bg-white/20 transition-all duration-300 shadow-lg hover:shadow-xl border border-white/20 hover:border-white/40"
                  >
                    <IoIosArrowBack />
                  </button>
                )}

                {currentPage < totalPages && (
                  <button
                    onClick={() => setCurrentPage(currentPage + 1)}
                    className="btn bg-white/10 backdrop-blur-sm text-white border-none flex-shrink-0 w-16 h-16 text-2xl absolute -right-20 top-1/2 -mt-8 z-10 rounded-full hover:bg-white/20 transition-all duration-300 shadow-lg hover:shadow-xl border border-white/20 hover:border-white/40"
                  >
                    <IoIosArrowForward />
                  </button>
                )}
              </div>
            </div>

            {/* Desktop Page Number Display */}
            {totalPages > 1 && (
              <div className="hidden sm:flex items-center justify-center mt-4">
                <div className="flex items-center space-x-2">
                  <input
                    type="number"
                    value={pageInput}
                    onChange={handlePageInput}
                    min={1}
                    max={totalPages}
                    className="w-8 input input-bordered input-sm text-center text-base pl-0 pr-2 [appearance:textfield] [&::-webkit-outer-spin-button]:appearance-none [&::-webkit-inner-spin-button]:appearance-none"
                  />
                  <span className="text-gray-300">/ {totalPages}</span>
                </div>
              </div>
            )}
          </main>
        </div>
      </div>
    </div>
  );
}