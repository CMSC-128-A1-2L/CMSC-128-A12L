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
    jobType: {
      fullTime: false,
      partTime: false,
      contract: false
    },
    workType: {
      onSite: false,
      remote: false,
      hybrid: false
    },
    experienceLevel: {
      entry: false,
      midLevel: false,
      senior: false
    }
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
      jobType: {
        fullTime: false,
        partTime: false,
        contract: false
      },
      workType: {
        onSite: false,
        remote: false,
        hybrid: false
      },
      experienceLevel: {
        entry: false,
        midLevel: false,
        senior: false
      }
    };
    
    setFilters(clearedFilters);
    onFilterChange(clearedFilters);
  };

  return (
    <div className="flex-grow">
      {/* Sidebar */}
      <div
        className={`flex flex-col flex-start gap-3 w-64 bg-white p-4 rounded-xl shadow-lg ${
          isOpen ? "block" : "hidden"
        } sticky top-0 h-full overflow-y-auto`}
      >
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-lg font-bold text-black">Filters</h2>
          <button 
            onClick={clearFilters}
            className="btn btn-sm btn-ghost text-sm text-black hover:bg-[#605dff] hover:text-white hover:border-transparent transition-colors"
          >
            Clear all
          </button>
        </div>

        {/* Job Type Filter */}
        <fieldset className="fieldset p-4 bg-gray-50 rounded-box gap-3">
          <h3 className="font-semibold mb-2 text-black">Job Type</h3>

          <label className="fieldset-label text-black flex items-center gap-2 hover:bg-gray-100 p-2 rounded-lg transition-colors">
            <input 
              type="checkbox" 
              className="checkbox border border-black bg-white [&:checked]:bg-[#242937]" 
              checked={filters.jobType.fullTime}
              onChange={() => handleFilterChange('jobType', 'fullTime')}
            /> 
            Full-time
          </label>
          <label className="fieldset-label text-black flex items-center gap-2 hover:bg-gray-100 p-2 rounded-lg transition-colors">
            <input 
              type="checkbox" 
              className="checkbox border border-black bg-white [&:checked]:bg-[#242937]" 
              checked={filters.jobType.partTime}
              onChange={() => handleFilterChange('jobType', 'partTime')}
            /> 
            Part-time
          </label>
          <label className="fieldset-label text-black flex items-center gap-2 hover:bg-gray-100 p-2 rounded-lg transition-colors">
            <input 
              type="checkbox" 
              className="checkbox border border-black bg-white [&:checked]:bg-[#242937]" 
              checked={filters.jobType.contract}
              onChange={() => handleFilterChange('jobType', 'contract')}
            /> 
            Contract
          </label>
        </fieldset>

        {/* Work Type Filter */}
        <fieldset className="fieldset p-4 bg-gray-50 rounded-box gap-3">
          <h3 className="font-semibold mb-2 text-black">Work Type</h3>

          <label className="fieldset-label text-black flex items-center gap-2 hover:bg-gray-100 p-2 rounded-lg transition-colors">
            <input 
              type="checkbox" 
              className="checkbox border border-black bg-white [&:checked]:bg-[#242937]" 
              checked={filters.workType.onSite}
              onChange={() => handleFilterChange('workType', 'onSite')}
            /> 
            On-site
          </label>
          <label className="fieldset-label text-black flex items-center gap-2 hover:bg-gray-100 p-2 rounded-lg transition-colors">
            <input 
              type="checkbox" 
              className="checkbox border border-black bg-white [&:checked]:bg-[#242937]" 
              checked={filters.workType.remote}
              onChange={() => handleFilterChange('workType', 'remote')}
            /> 
            Remote
          </label>
          <label className="fieldset-label text-black flex items-center gap-2 hover:bg-gray-100 p-2 rounded-lg transition-colors">
            <input 
              type="checkbox" 
              className="checkbox border border-black bg-white [&:checked]:bg-[#242937]" 
              checked={filters.workType.hybrid}
              onChange={() => handleFilterChange('workType', 'hybrid')}
            /> 
            Hybrid
          </label>
        </fieldset>

        <fieldset className="fieldset p-4 bg-gray-50 rounded-box gap-3">
          <h3 className="font-semibold mb-2 text-black">Experience Level</h3>

          <label className="fieldset-label text-black flex items-center gap-2 hover:bg-gray-100 p-2 rounded-lg transition-colors">
            <input 
              type="checkbox" 
              className="checkbox border border-black bg-white [&:checked]:bg-[#242937]" 
              checked={filters.experienceLevel.entry}
              onChange={() => handleFilterChange('experienceLevel', 'entry')}
            /> 
            Entry Level
          </label>
          <label className="fieldset-label text-black flex items-center gap-2 hover:bg-gray-100 p-2 rounded-lg transition-colors">
            <input 
              type="checkbox" 
              className="checkbox border border-black bg-white [&:checked]:bg-[#242937]" 
              checked={filters.experienceLevel.midLevel}
              onChange={() => handleFilterChange('experienceLevel', 'midLevel')}
            /> 
            Mid-Level
          </label>
          <label className="fieldset-label text-black flex items-center gap-2 hover:bg-gray-100 p-2 rounded-lg transition-colors">
            <input 
              type="checkbox" 
              className="checkbox border border-black bg-white [&:checked]:bg-[#242937]" 
              checked={filters.experienceLevel.senior}
              onChange={() => handleFilterChange('experienceLevel', 'senior')}
            /> 
            Senior
          </label>
        </fieldset>

        {/* Salary Range Filter */}
        <fieldset className="fieldset p-4 bg-gray-50 rounded-box gap-3">
          <h3 className="font-semibold mb-2 text-black">Salary Range</h3>
          <input 
            type="range" 
            min="0" 
            max="100000" 
            className="range range-primary" 
            step="10000"
          />
          <div className="w-full flex justify-between text-xs px-2 text-black">
            <span>₱0</span>
            <span>₱50k</span>
            <span>₱100k+</span>
          </div>
        </fieldset>

        {/* Add Job Button */}
        <button
          onClick={showModal}
          className="btn btn-primary btn-sm rounded-lg w-[75%] mx-auto py-1 mt-4 text-sm"
        >
          <Plus size={16} /> Add Job
        </button>
      </div>
    </div>
  );
}