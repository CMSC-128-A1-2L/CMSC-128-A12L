"use client";
import { useSession } from "next-auth/react";
import { UserRole } from "@/entities/user";

import { useState, useRef, useEffect } from "react";
import { FiFilter } from "react-icons/fi";
import { IoIosArrowForward, IoIosArrowBack } from "react-icons/io";
import userData from "@/dummy_data/user.json";

import CreateJL from "@/app/components/createJL";
import CreateEvent from "@/pages/createEvent"; 



type Alumni = {
  role: string;
  studentId: string;
  firstName: string;
  middleName?: string | null;
  lastName: string;
  suffix?: string | null;
  gender?: string;
  bio?: string;
  linkedIn?: string;
  contactNumbers?: string[];
};

export default function AlumniPage() {
  const [search, setSearch] = useState("");
  const [selectedFilter, setSelectedFilter] = useState({
    role: "",
    gender: "",
  });
  const [currentPage, setCurrentPage] = useState(1);
  const [pageInput, setPageInput] = useState("1");
  const [showFilter, setShowFilter] = useState(false); // for filter
  const itemsPerPage = 10;
  const [showModal, setShowModal] = useState(false);
  const [showEventModal, setShowEventModal] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);

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
  const filteredAlumni = userData.filter((alumni) => {
    const fullName = `${alumni.firstName} ${alumni.lastName}`.toLowerCase();
    const searchMatch = fullName.includes(search.toLowerCase());
    const roleMatch =
      selectedFilter.role === "" || alumni.role === selectedFilter.role;
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
    <div className="flex flex-col min-h-screen bg-gray-100">
      {/* Main container */}
      <div className="flex-1 container mx-auto px-6">
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
                className="input input-bordered w-full pl-10 pr-16 bg-white border-gray-300 text-gray-800"
              />
              <div className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400">
                <FiFilter size={18} />
              </div>
            </div>
          </div>

          {/* Filter Dropdown */}
          <div className="relative" ref={dropdownRef}>
            <button
              onClick={() => setShowFilter(!showFilter)}
              className="btn btn-outline flex items-center"
            >
              <FiFilter className="mr-1" /> Filter
            </button>

            {showFilter && (
              <ul className="absolute z-10 mt-2 bg-white shadow-lg rounded-md w-40">
                {/* Role Filter */}
                <li className="p-2 font-bold text-gray-700">Role</li>
                <li>
                  <button
                    onClick={() => setSelectedFilter({ ...selectedFilter, role: "" })}
                    className="block w-full text-left px-4 py-2 hover:bg-gray-200 cursor-pointer"
                  >
                    All {selectedFilter.role === "" && "✓"}
                  </button>
                </li>
                <li>
                  <button
                    onClick={() =>
                      setSelectedFilter({ ...selectedFilter, role: "alumni" })
                    }
                    className="block w-full text-left px-4 py-2 hover:bg-gray-200 cursor-pointer"
                  >
                    Alumni {selectedFilter.role === "alumni" && "✓"}
                  </button>
                </li>

                {/* Gender Filter */}
                <li className="p-2 font-bold text-gray-700">Gender</li>
                <li>
                  <button
                    onClick={() =>
                      setSelectedFilter({ ...selectedFilter, gender: "" })
                    }
                    className="block w-full text-left px-4 py-2 hover:bg-gray-200 cursor-pointer"
                  >
                    All {selectedFilter.gender === "" && "✓"}
                  </button>
                </li>
                <li>
                  <button
                    onClick={() =>
                      setSelectedFilter({ ...selectedFilter, gender: "Male" })
                    }
                    className="block w-full text-left px-4 py-2 hover:bg-gray-200 cursor-pointer"
                  >
                    Male {selectedFilter.gender === "Male" && "✓"}
                  </button>
                </li>
                <li>
                  <button
                    onClick={() =>
                      setSelectedFilter({ ...selectedFilter, gender: "Female" })
                    }
                    className="block w-full text-left px-4 py-2 hover:bg-gray-200 cursor-pointer"
                  >
                    Female {selectedFilter.gender === "Female" && "✓"}
                  </button>
                </li>

                {/* Clear Filter */}
                <li className="p-2">
                  <button
                    onClick={clearFilters}
                    className="w-full text-center px-4 py-2 bg-[#1b1f4e] hover:bg-[#15183d] text-white rounded-md cursor-pointer"
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
                    className="badge badge-lg gap-2 px-3 py-3 bg-[#1b1f4e] text-white border-none"
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
                <div className="ml-auto text-sm text-gray-400">
                  Showing {filteredAlumni.length} results
                </div>
              )}
            </div>

            {/* Alumni Grid */}
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-4">
              {displayedAlumni.length > 0 ? (
                displayedAlumni.map((alumni, index) => (
                  <div
                    key={index}
                    className="w-full h-88 bg-white rounded-lg shadow-md flex flex-col justify-end p-2 relative group transition-all duration-300"
                  >
                    {/* Front View - Default */}
                    <div className="absolute inset-0 flex flex-col items-center justify-end opacity-100 group-hover:opacity-0 transition-opacity duration-300">
                      <div className="w-full h-[85%] bg-gray-400 rounded-t-lg absolute top-0"></div>
                      <div className="absolute bottom-1 flex flex-col items-center">
                        <p className="text-black font-medium">
                          {alumni.firstName} {alumni.lastName}
                        </p>
                        <p className="text-gray-600 text-sm -mt-1">
                          Batch 2022
                        </p>
                      </div>
                    </div>

                    {/* Hover View - Detailed Info */}
                    <div className="absolute inset-0 flex flex-col justify-center items-center bg-white rounded-lg shadow-md opacity-0 group-hover:opacity-100 transition-opacity duration-300 p-4">
                      <p className="text-gray-700 mb-1">
                        <strong>Role:</strong> {alumni.role || "N/A"}
                      </p>
                      <p className="text-gray-700 mb-1">
                        <strong>Gender:</strong> {alumni.gender || "N/A"}
                      </p>
                      <p className="text-gray-700 mb-3">
                        <strong>LinkedIn:</strong>{" "}
                        <a
                          href={alumni.linkedIn || "#"}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="text-blue-500 underline"
                        >
                          Profile
                        </a>
                      </p>
                      <button className="btn btn-outline btn-sm">View Profile</button>
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
                  className="btn btn-outline btn-sm"
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
                  <span>/ {totalPages}</span>
                </div>
                <button
                  onClick={() => setCurrentPage(currentPage + 1)}
                  disabled={currentPage === totalPages}
                  className="btn btn-outline btn-sm"
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
