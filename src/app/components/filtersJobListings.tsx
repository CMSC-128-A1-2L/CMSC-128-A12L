"use client";
import { useState, useEffect } from "react";
import { SlidersHorizontal, Plus } from "lucide-react";

export default function FilterSidebar({
  isOpen,
  setIsOpen,
  onFilterChange,
  showModal,
  activeFilters
}: {
  isOpen: boolean;
  setIsOpen: (isOpen: boolean) => void;
  onFilterChange: (filters: any) => void;
  showModal: () => void;
  activeFilters?: any;
}) {
  // Initialize filter state with default values if activeFilters is undefined
  const defaultFilters = {
    workMode: {
      onSite: false,
      remote: false,
      hybrid: false
    },
    sort: 'newest' // Add default sort option
  };

  const [filters, setFilters] = useState(activeFilters || defaultFilters);

  // Update local state when parent state changes
  useEffect(() => {
    if (activeFilters) {
      setFilters(activeFilters);
    }
  }, [activeFilters]);

  // Handle checkbox changes
  const handleFilterChange = (category: string, filter: string) => {
    const newFilters = {
      ...filters,
      [category]: {
        ...filters[category as keyof typeof filters],
        [filter]: !filters[category as keyof typeof filters][filter as keyof typeof filters[keyof typeof filters]]
      }
    };
    
    setFilters(newFilters);
    onFilterChange(newFilters);
  };

  // Clear all filters
  const clearFilters = () => {
    const clearedFilters = {
      workMode: {
        onSite: false,
        remote: false,
        hybrid: false
      },
      sort: 'newest'
    };
    
    setFilters(clearedFilters);
    onFilterChange(clearedFilters);
  };

  // Add sort change handler
  const handleSortChange = (value: string) => {
    const newFilters = {
      ...filters,
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
          {/* Post Job Button */}
          <button
            onClick={showModal}
            className="w-full px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg transition-colors flex items-center justify-center gap-2"
          >
            <Plus size={18} />
            Post a New Job
          </button>

          <div className="flex items-center justify-between">
            <h2 className="text-lg font-bold text-white">Filters</h2>
            <button 
              onClick={clearFilters}
              className="btn btn-sm btn-ghost text-sm text-white/70 hover:text-white hover:bg-white/10 transition-colors"
            >
              Clear all
            </button>
          </div>

          {/* Work Mode Filter */}
          <fieldset className="fieldset p-3 sm:p-4 bg-black/10 rounded-box gap-2 sm:gap-3">
            <h3 className="font-semibold mb-2 text-white/90">Work Mode</h3>
          
            <div className="space-y-1 sm:space-y-2">
              <label className="fieldset-label text-white/70 flex items-center gap-2 hover:bg-white/10 p-1.5 sm:p-2 rounded-lg transition-colors">
                <input 
                  type="checkbox" 
                  className="checkbox checkbox-sm sm:checkbox-md border border-white/20 bg-white/5 [&:checked]:bg-blue-600 [&:checked]:border-blue-600" 
                  checked={filters.workMode.onSite}
                  onChange={() => handleFilterChange('workMode', 'onSite')}
                /> 
                On-site
              </label>
              <label className="fieldset-label text-white/70 flex items-center gap-2 hover:bg-white/10 p-1.5 sm:p-2 rounded-lg transition-colors">
                <input 
                  type="checkbox" 
                  className="checkbox checkbox-sm sm:checkbox-md border border-white/20 bg-white/5 [&:checked]:bg-blue-600 [&:checked]:border-blue-600" 
                  checked={filters.workMode.remote}
                  onChange={() => handleFilterChange('workMode', 'remote')}
                /> 
                Remote
              </label>
              <label className="fieldset-label text-white/70 flex items-center gap-2 hover:bg-white/10 p-1.5 sm:p-2 rounded-lg transition-colors">
                <input 
                  type="checkbox" 
                  className="checkbox checkbox-sm sm:checkbox-md border border-white/20 bg-white/5 [&:checked]:bg-blue-600 [&:checked]:border-blue-600" 
                  checked={filters.workMode.hybrid}
                  onChange={() => handleFilterChange('workMode', 'hybrid')}
                /> 
                Hybrid
              </label>
            </div>
          </fieldset>

          {/* Sort Options */}
          <fieldset className="fieldset p-3 sm:p-4 bg-black/10 rounded-box gap-2 sm:gap-3">
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