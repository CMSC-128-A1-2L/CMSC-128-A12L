"use client";
import { useState } from "react";
import { SlidersHorizontal } from "lucide-react";

export default function FilterSidebar() {
  const [isOpen, setIsOpen] = useState(true); // Sidebar toggle

  return (
    <div className="flex-grow">
      {/* Sidebar */}
      <div className={`flex flex-col flex-start gap-3 w-64 bg-base-200 p-4 rounded-2xl ${isOpen ? "block" : "hidden"} md:block sticky top-0 h-full overflow-y-auto`}>

        <h2 className="text-lg font-bold mb-4">Filters</h2>

        {/* Job Type Filter */}
        <fieldset className="fieldset p-4 bg-base-100 border border-base-300 rounded-box gap-3">
          <h3 className="font-semibold mb-2">Job Type</h3>

          <label className="fieldset-label text-black">
            <input type="checkbox" className="checkbox" /> Full-time
          </label>
          <label className="fieldset-label text-black">
            <input type="checkbox" className="checkbox" /> Part-time
          </label>
          <label className="fieldset-label text-black">
            <input type="checkbox" className="checkbox" /> Contract
          </label>

        </fieldset>

        {/* Work Type Filter */}
        <fieldset className="fieldset p-4 bg-base-100 border border-base-300 rounded-box gap-3">

          <h3 className="font-semibold mb-2">Work Type</h3>

          <label className="fieldset-label text-black">
            <input type="checkbox" className="checkbox" /> On-site
          </label>
          <label className="fieldset-label text-black">
            <input type="checkbox" className="checkbox" /> Remote
          </label>
          <label className="fieldset-label text-black">
            <input type="checkbox" className="checkbox" /> Hybrid
          </label>
        </fieldset>
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
