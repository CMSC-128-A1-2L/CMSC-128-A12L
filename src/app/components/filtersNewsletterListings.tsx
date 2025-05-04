"use client";
import { useState, useEffect } from "react";

export default function FilterSidebar({
  isOpen,
  setIsOpen,
  onFilterChange,
  activeFilters
}: {
  isOpen: boolean;
  setIsOpen: (isOpen: boolean) => void;
  onFilterChange: (filters: any) => void;
  activeFilters?: any;
}) {

  const [filters, setFilters] = useState(activeFilters);

  useEffect(() => {
    if (activeFilters) {
      setFilters(activeFilters);
    }
  }, [activeFilters]);

  const clearFilters = () => {
    const clearedFilters = {
      sort: 'newest'
    };
    
    setFilters(clearedFilters);
    onFilterChange(clearedFilters);
  };

  const handleSortChange = (value: string) => {
    const newFilters = {
      sort: value
    };
    setFilters(newFilters);
    onFilterChange(newFilters);
  };

  return (
    <div className="flex-grow">
      <div
        className={`flex flex-col flex-start gap-2 sm:gap-3 
          w-full xs:w-72 sm:w-64 
          bg-gradient-to-r from-[#1a1f4d]/90 to-[#2a3f8f]/90
          p-3 sm:p-4 
          rounded-xl shadow-lg 
          ${isOpen ? "block" : "hidden"}
          sticky top-0 h-full overflow-y-auto
          transition-all duration-300`}
      >
        <div className="bg-black/10 rounded-xl border border-white/10 p-4 space-y-6">
          <div className="flex items-center justify-between">
            <h2 className="text-lg font-bold text-white">Filters</h2>
            <button 
              onClick={clearFilters}
              className="btn btn-sm btn-ghost text-sm text-white/70 hover:text-white hover:bg-white/10 transition-colors"
            >
              Clear all
            </button>
          </div>

          {/* Sort Options */}
          <fieldset className="space-y-2">
            <h3 className="font-semibold mb-2 text-white/90">Sort By</h3>
            <select
              value={filters.sort}
              onChange={(e) => handleSortChange(e.target.value)}
              className="w-full p-2 rounded-lg bg-white/5 text-white border border-white/20 focus:border-blue-500 focus:ring-1 focus:ring-blue-500 [&>option]:bg-[#1a1f4d] [&>option]:text-white"
            >
              <option value="newest" className="bg-[#1a1f4d] text-white">Newest First</option>
              <option value="oldest" className="bg-[#1a1f4d] text-white">Oldest First</option>
              <option value="a-z" className="bg-[#1a1f4d] text-white">A-Z</option>
              <option value="z-a" className="bg-[#1a1f4d] text-white">Z-A</option>
            </select>
          </fieldset>
        </div>
      </div>
    </div>
  );
} 