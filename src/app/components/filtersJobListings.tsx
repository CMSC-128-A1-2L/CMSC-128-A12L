"use client";
import { useState } from "react";
import { SlidersHorizontal } from "lucide-react";

export default function FilterSidebar() {
  const [isOpen, setIsOpen] = useState(true); // Sidebar toggle

  return (
    <div className="flex m-4 rounded">
      {/* Sidebar */}
      <div className={`w-64 h-100 bg-base-200 p-4 rounded-3xl ${isOpen ? "block" : "hidden"} md:block sticky top-0 h-screen overflow-y-auto`}>
        <h2 className="text-lg font-bold mb-4">Filters</h2>

        {/* Job Type Filter */}
        <div className="card bg-base-100 shadow p-4 mb-4">
          <h3 className="font-semibold mb-2">Job Type</h3>
          <label className="flex items-center gap-2">
            <input type="checkbox" className="checkbox" /> Full-time
          </label>
          <label className="flex items-center gap-2">
            <input type="checkbox" className="checkbox" /> Part-time
          </label>
          <label className="flex items-center gap-2">
            <input type="checkbox" className="checkbox" /> Contract
          </label>
        </div>

        {/* Work Type Filter */}
        <div className="card bg-base-100 shadow p-4">
          <h3 className="font-semibold mb-2">Work Type</h3>
          <label className="flex items-center gap-2">
            <input type="checkbox" className="checkbox" /> On-site
          </label>
          <label className="flex items-center gap-2">
            <input type="checkbox" className="checkbox" /> Remote
          </label>
          <label className="flex items-center gap-2">
            <input type="checkbox" className="checkbox" /> Hybrid
          </label>
        </div>
      </div>

      {/* Toggle Button for Mobile */}
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="btn btn-ghost md:hidden fixed top-4 left-4 z-50"
      >
        <SlidersHorizontal size={24} />
      </button>
    </div>
  );
}
