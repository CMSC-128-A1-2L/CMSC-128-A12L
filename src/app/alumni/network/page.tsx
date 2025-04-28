"use client";

import { useState, useRef, useEffect, useMemo } from "react";
import { FiFilter, FiUsers, FiMapPin, FiBriefcase, FiCalendar } from "react-icons/fi";
import { IoIosArrowForward, IoIosArrowBack } from "react-icons/io";
import userData from "@/dummy_data/user.json";
import { motion } from "framer-motion";
import { useRouter } from "next/navigation";



type Alumni = {
  id: string;
  role: string[];
  name: string;
  lastName: string;
  suffix?: string | null;
  gender?: string;
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
    role: "",
    gender: "",
  });
  const [currentPage, setCurrentPage] = useState(1);
  const [pageInput, setPageInput] = useState("1");
  const [showFilter, setShowFilter] = useState(false);
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
        setShowFilter(false);
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

  // filters based on role and gender
  const filteredAlumni = alumni.filter((alumni) => {
    const fullName = `${alumni.name}`.toLowerCase();
    const searchMatch = fullName.includes(search.toLowerCase());
    const roleMatch =
      selectedFilter.role === "" || alumni.role.includes(selectedFilter.role);
    const genderMatch =
      selectedFilter.gender === "" || alumni.gender === selectedFilter.gender;

    return searchMatch && roleMatch && genderMatch;
  });

  // clear filter
  const clearFilters = () => {
    setSelectedFilter({ role: "", gender: "" });
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
      <div className="relative text-white -mt-16 pt-16">
        <div className="absolute inset-0 bg-gradient-to-r from-[#1a1f4d]/90 to-[#2a3f8f]/90"></div>
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
        <div className="flex items-center gap-4 py-4">
          {/* Search bar - center */}
          <div className="flex-1 max-w-2xl mx-auto">
            <div className="relative">
              <input
                type="text"
                placeholder="Search"
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                className="input input-bordered w-full pl-10 pr-16 bg-white/10 backdrop-blur-sm border-white/20 text-white placeholder-gray-300"
              />
              <div className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-300">
                <FiFilter size={18} />
              </div>
            </div>
          </div>

          {/* Filter Dropdown */}
          <div className="relative" ref={dropdownRef}>
            <button
              onClick={() => setShowFilter(!showFilter)}
              className="btn btn-outline flex items-center bg-white/10 backdrop-blur-sm border-white/20 text-white hover:bg-white/20"
            >
              <FiFilter className="mr-1" /> Filter
            </button>

            {showFilter && (
              <ul className="absolute z-10 mt-2 bg-white/10 backdrop-blur-sm shadow-lg rounded-md w-40 border border-white/20">
                {/* Role Filter */}
                <li className="p-2 font-bold text-white">Role</li>
                <li>
                  <button
                    onClick={() => setSelectedFilter({ ...selectedFilter, role: "" })}
                    className="block w-full text-left px-4 py-2 hover:bg-white/20 cursor-pointer text-gray-200"
                  >
                    All {selectedFilter.role === "" && "✓"}
                  </button>
                </li>
                <li>
                  <button
                    onClick={() =>
                      setSelectedFilter({ ...selectedFilter, role: "alumni" })
                    }
                    className="block w-full text-left px-4 py-2 hover:bg-white/20 cursor-pointer text-gray-200"
                  >
                    Alumni {selectedFilter.role === "alumni" && "✓"}
                  </button>
                </li>

                {/* Gender Filter */}
                <li className="p-2 font-bold text-white">Gender</li>
                <li>
                  <button
                    onClick={() =>
                      setSelectedFilter({ ...selectedFilter, gender: "" })
                    }
                    className="block w-full text-left px-4 py-2 hover:bg-white/20 cursor-pointer text-gray-200"
                  >
                    All {selectedFilter.gender === "" && "✓"}
                  </button>
                </li>
                <li>
                  <button
                    onClick={() =>
                      setSelectedFilter({ ...selectedFilter, gender: "Male" })
                    }
                    className="block w-full text-left px-4 py-2 hover:bg-white/20 cursor-pointer text-gray-200"
                  >
                    Male {selectedFilter.gender === "Male" && "✓"}
                  </button>
                </li>
                <li>
                  <button
                    onClick={() =>
                      setSelectedFilter({ ...selectedFilter, gender: "Female" })
                    }
                    className="block w-full text-left px-4 py-2 hover:bg-white/20 cursor-pointer text-gray-200"
                  >
                    Female {selectedFilter.gender === "Female" && "✓"}
                  </button>
                </li>

                {/* Clear Filter */}
                <li className="p-2">
                  <button
                    onClick={clearFilters}
                    className="w-full text-center px-4 py-2 bg-white/20 hover:bg-white/30 text-white rounded-md cursor-pointer"
                  >
                    Clear
                  </button>
                </li>
              </ul>
            )}
          </div>
        </div>

        {/* Content area */}
        <div className="flex gap-6 -mt-[5px]">
          {/* Main content */}
          <main className="flex-1">
            {/* Active filters */}
            <div className="flex flex-wrap items-center gap-2 mb-4">
              {Object.entries(selectedFilter).map(([key, value]) =>
                value ? (
                  <div
                    key={key}
                    className="badge badge-lg gap-2 px-3 py-3 bg-white/20 backdrop-blur-sm text-white border-white/20"
                  >
                    {value}
                    <button
                      className="text-white opacity-60 hover:opacity-100 cursor-pointer"
                      onClick={() => {
                        const newFilters = { ...selectedFilter };
                        newFilters[key as keyof typeof selectedFilter] = "";
                        setSelectedFilter(newFilters);
                      }}
                    >
                      ✕
                    </button>
                  </div>
                ) : null
              )}

              {/* Results count */}
              {filteredAlumni.length > 0 && (
                <div className="ml-auto text-sm text-gray-300">
                  Showing {filteredAlumni.length} results
                </div>
              )}
            </div>

            {/* Alumni Grid */}
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-4">
              {loading ? (
                <div className="col-span-full text-center py-8">
                  <p className="text-gray-400">Loading alumni data...</p>
                </div>
              ) : displayedAlumni.length > 0 ? (
                displayedAlumni.map((alumni, index) => (
                  <div
                    key={alumni.id}
                    className="w-full h-88 bg-white/10 backdrop-blur-sm rounded-lg overflow-hidden shadow-md flex flex-col relative group transition-all duration-300 border border-white/20"
                  >
                    {/* Front View - Default */}
                    <div className="absolute inset-0 flex flex-col items-center justify-between opacity-100 group-hover:opacity-0 transition-all duration-300">
                      <div className="w-full h-[85%] bg-white/20 overflow-hidden">
                        {alumni.imageUrl ? (
                          <img
                            src={alumni.imageUrl}
                            alt={alumni.name}
                            className="w-full h-full object-cover"
                          />
                        ) : (
                          <div className="w-full h-full flex items-center justify-center bg-white/5">
                            <FiUsers className="text-gray-400" size={64} />
                          </div>
                        )}
                      </div>
                      <div className="w-full py-3 px-2 text-center bg-black/20 backdrop-blur-sm">
                        <p className="text-white font-medium">{alumni.name}</p>
                        <p className="text-gray-300 text-sm">Batch {alumni.graduationYear || "N/A"}</p>
                      </div>
                    </div>

                    {/* Hover View - Detailed Info */}
                    <div className="absolute inset-0 flex flex-col justify-center items-center bg-[#1a1f4d]/90 backdrop-blur-md opacity-0 group-hover:opacity-100 transition-all duration-300 p-6">
                      <div className="w-full space-y-4">
                        <div className="text-center mb-2">
                          <h3 className="text-xl font-semibold text-white">{alumni.name}</h3>
                          <p className="text-gray-300">Class of {alumni.graduationYear || "N/A"}</p>
                        </div>
                        
                        {/* Academic Info */}
                        <div className="text-gray-200 text-sm">
                          <p className="mb-1 text-center">{alumni.department || "Department not specified"}</p>
                        </div>

                        {/* Professional Info */}
                        {(alumni.currentPosition || alumni.currentCompany) && (
                          <div className="text-gray-200 text-center border-t border-white/10 pt-4">
                            <p>{alumni.currentPosition}</p>
                            <p className="text-gray-300">{alumni.currentCompany}</p>
                          </div>
                        )}

                        {/* Contact Links */}
                        <div className="flex justify-center gap-2 pt-4">
                          {alumni.linkedIn && (
                            <a
                              href={alumni.linkedIn}
                              target="_blank"
                              rel="noopener noreferrer"
                              className="text-blue-400 hover:text-blue-300 underline text-sm"
                              onClick={(e) => e.stopPropagation()}
                            >
                              LinkedIn Profile
                            </a>
                          )}
                        </div>
                      </div>
                      
                      <button 
                        onClick={() => router.push(`/alumni/network/${alumni.id}`)}
                        className="mt-6 px-6 py-2 bg-white/10 hover:bg-white/20 border border-white/40 rounded-lg text-white transition-colors"
                      >
                        View Full Profile
                      </button>
                    </div>
                  </div>
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
            </div>

            {/* Pagination */}
            {totalPages > 1 && (
              <div className="flex items-center justify-center space-x-4 mt-4">
                <button
                  onClick={() => setCurrentPage(currentPage - 1)}
                  disabled={currentPage === 1}
                  className="btn btn-sm bg-white/10 backdrop-blur-sm text-white border-none"
                >
                  <IoIosArrowBack />
                </button>
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
                <button
                  onClick={() => setCurrentPage(currentPage + 1)}
                  disabled={currentPage === totalPages}
                  className="btn btn-sm bg-white/10 backdrop-blur-sm text-white border-none"
                >
                  <IoIosArrowForward />
                </button>
              </div>
            )}
          </main>
        </div>
      </div>
    </div>
  );
}