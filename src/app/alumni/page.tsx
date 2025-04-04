"use client";

import { signOut, useSession } from "next-auth/react";
import { useState, useEffect, useRef } from "react";
import { FiFilter } from "react-icons/fi";
import { IoIosArrowForward, IoIosArrowBack } from "react-icons/io";
import userData from "@/dummy_data/user.json";
import Navbar from "@/app/components/navBar";
import AlumniSidebar from "@/app/components/alumniSideBar";

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
  const { data: session, status } = useSession();
  const [search, setSearch] = useState("");
  const [selectedFilter, setSelectedFilter] = useState({
    role: "",
    gender: "",
  });
  const [currentPage, setCurrentPage] = useState(1);
  const [showFilter, setShowFilter] = useState(false); // for filter
  const itemsPerPage = 12;

  // For Navbar and Sidebar integration
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const menuButtonRef = useRef<HTMLButtonElement>(null!);
  const sidebarRef = useRef<HTMLDivElement>(null!);

  useEffect(() => {
    if (status === "unauthenticated") {
      console.log("You've been logged out due to inactivity");
      signOut();
    }
  }, [status]);

  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (
        sidebarOpen &&
        sidebarRef.current &&
        !sidebarRef.current.contains(event.target as Node) &&
        menuButtonRef.current &&
        !menuButtonRef.current.contains(event.target as Node)
      ) {
        setSidebarOpen(false);
      }
    }

    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, [sidebarOpen]);

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

  // for the pages
  const totalPages = Math.ceil(filteredAlumni.length / itemsPerPage);
  const displayedAlumni = filteredAlumni.slice(
    (currentPage - 1) * itemsPerPage,
    currentPage * itemsPerPage
  );

  if (!session) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-white">
        <h2
          className="text-3xl font-bold text-center text-gray-800"
          style={{ fontFamily: "Montserrat, sans-serif" }}
        >
          Not Authenticated
        </h2>
      </div>
    );
  }

  return (
    <div className="min-h-screen flex flex-col bg-gray-100">
      {/* Navbar with fixed layout */}
      <div className="w-full">
        <Navbar
          setSidebarOpen={setSidebarOpen}
          menuButtonRef={menuButtonRef}
          homePath="/alumni-landing"
        />
      </div>

      {/* Alumni Sidebar */}
      <AlumniSidebar
        sidebarOpen={sidebarOpen}
        setSidebarOpen={setSidebarOpen}
        sidebarRef={sidebarRef}
        role={session.user.role}
      />

      {/* Main Content */}
      <div className="flex-grow flex flex-col items-center w-full">
        {/* Search and Filter - Centered */}
        <div className="flex justify-center space-x-2 my-4 px-6 w-full">
          <div className="flex space-x-2 max-w-7xl">
            <input
              type="text"
              placeholder="Search"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="input input-bordered w-96 bg-white"
            />

            {/* Filter Dropdown */}
            <div className="relative">
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
                      className="block w-full text-left px-4 py-2 hover:bg-gray-200"
                    >
                      All
                    </button>
                  </li>
                  <li>
                    <button
                      onClick={() =>
                        setSelectedFilter({ ...selectedFilter, role: "alumni" })
                      }
                      className="block w-full text-left px-4 py-2 hover:bg-gray-200"
                    >
                      Alumni
                    </button>
                  </li>

                  {/* Gender Filter */}
                  <li className="p-2 font-bold text-gray-700">Gender</li>
                  <li>
                    <button
                      onClick={() =>
                        setSelectedFilter({ ...selectedFilter, gender: "" })
                      }
                      className="block w-full text-left px-4 py-2 hover:bg-gray-200"
                    >
                      All
                    </button>
                  </li>
                  <li>
                    <button
                      onClick={() =>
                        setSelectedFilter({ ...selectedFilter, gender: "Male" })
                      }
                      className="block w-full text-left px-4 py-2 hover:bg-gray-200"
                    >
                      Male
                    </button>
                  </li>
                  <li>
                    <button
                      onClick={() =>
                        setSelectedFilter({ ...selectedFilter, gender: "Female" })
                      }
                      className="block w-full text-left px-4 py-2 hover:bg-gray-200"
                    >
                      Female
                    </button>
                  </li>

                  {/* Clear Filter */}
                  <li className="p-2">
                    <button
                      onClick={clearFilters}
                      className="w-full text-left px-4 py-2 bg-red-100 hover:bg-red-200 text-red-600"
                    >
                      Clear Filter
                    </button>
                  </li>
                </ul>
              )}
            </div>
          </div>
        </div>

        {/* Alumni List - Center grid with fixed width */}
        <div className="w-full flex justify-center px-6">
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-6 gap-4 max-w-7xl">
            {displayedAlumni.length > 0 ? (
              displayedAlumni.map((alumni, index) => (
                <div
                  key={index}
                  className="w-48 h-72 bg-gray-100 rounded-lg shadow-md flex flex-col justify-end p-2 relative group transition-all duration-300 hover:bg-gray-200"
                >
                  {/* Front View - Default */}
                  <div className="absolute inset-0 flex flex-col items-center justify-end opacity-100 group-hover:opacity-0 transition-opacity duration-300">
                    <div className="w-full h-60 bg-gray-400 rounded-lg mb-2"></div>
                    <p className="bg-gray-500 text-white px-3 py-1 rounded-lg text-sm mb-2">
                      {alumni.firstName} {alumni.lastName}
                    </p>
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
              <p className="text-gray-500 text-center w-full col-span-full">
                No alumni found.
              </p>
            )}
          </div>
        </div>

        {/* Pagination - Centered */}
        {totalPages > 1 && (
          <div className="flex justify-center items-center space-x-4 my-4 px-6 w-full">
            <button
              onClick={() => setCurrentPage(currentPage - 1)}
              disabled={currentPage === 1}
              className="btn btn-outline btn-sm"
            >
              <IoIosArrowBack />
            </button>
            <span>
              {currentPage} / {totalPages}
            </span>
            <button
              onClick={() => setCurrentPage(currentPage + 1)}
              disabled={currentPage === totalPages}
              className="btn btn-outline btn-sm"
            >
              <IoIosArrowForward />
            </button>
          </div>
        )}
      </div>
    </div>
  );
}