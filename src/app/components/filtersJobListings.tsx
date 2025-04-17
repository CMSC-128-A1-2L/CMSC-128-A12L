"use client";
import { useState } from "react";
import { SlidersHorizontal } from "lucide-react";

export default function FilterSidebar({
  isOpen,
  setIsOpen,
  onFilterChange
}: {
  isOpen: boolean;
  setIsOpen: (isOpen: boolean) => void;
  onFilterChange: (filters: any) => void;
}) {
  // Initialize filter state
  const [filters, setFilters] = useState({
    jobType: {
      fullTime: false,
      partTime: false,
      contract: false
    },
    workType: {
      onSite: false,
      remote: false,
      hybrid: false
    }
  });

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
    // Pass the updated filters to parent component
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
          <h2 className="text-lg font-bold">Filters</h2>
          <button 
            onClick={clearFilters}
            className="btn btn-sm btn-ghost text-sm"
          >
            Clear all
          </button>
        </div>

        {/* Job Type Filter */}
        <fieldset className="fieldset p-4 bg-base-100 border border-base-300 rounded-box gap-3">
          <h3 className="font-semibold mb-2">Job Type</h3>

          <label className="fieldset-label text-black flex items-center gap-2">
            <input 
              type="checkbox" 
              className="checkbox" 
              checked={filters.jobType.fullTime}
              onChange={() => handleFilterChange('jobType', 'fullTime')}
            /> 
            Full-time
          </label>
          <label className="fieldset-label text-black flex items-center gap-2">
            <input 
              type="checkbox" 
              className="checkbox" 
              checked={filters.jobType.partTime}
              onChange={() => handleFilterChange('jobType', 'partTime')}
            /> 
            Part-time
          </label>
          <label className="fieldset-label text-black flex items-center gap-2">
            <input 
              type="checkbox" 
              className="checkbox" 
              checked={filters.jobType.contract}
              onChange={() => handleFilterChange('jobType', 'contract')}
            /> 
            Contract
          </label>
        </fieldset>

        {/* Work Type Filter */}
        <fieldset className="fieldset p-4 bg-base-100 border border-base-300 rounded-box gap-3">
          <h3 className="font-semibold mb-2">Work Type</h3>

          <label className="fieldset-label text-black flex items-center gap-2">
            <input 
              type="checkbox" 
              className="checkbox" 
              checked={filters.workType.onSite}
              onChange={() => handleFilterChange('workType', 'onSite')}
            /> 
            On-site
          </label>
          <label className="fieldset-label text-black flex items-center gap-2">
            <input 
              type="checkbox" 
              className="checkbox" 
              checked={filters.workType.remote}
              onChange={() => handleFilterChange('workType', 'remote')}
            /> 
            Remote
          </label>
          <label className="fieldset-label text-black flex items-center gap-2">
            <input 
              type="checkbox" 
              className="checkbox" 
              checked={filters.workType.hybrid}
              onChange={() => handleFilterChange('workType', 'hybrid')}
            /> 
            Hybrid
          </label>
        </fieldset>

        <fieldset className="fieldset p-4 bg-base-100 border border-base-300 rounded-box gap-3">
          <h3 className="font-semibold mb-2">Experience Level</h3>

          <label className="fieldset-label text-black flex items-center gap-2">
            <input type="checkbox" className="checkbox" /> Entry Level
          </label>
          <label className="fieldset-label text-black flex items-center gap-2">
            <input type="checkbox" className="checkbox" /> Mid-Level
          </label>
          <label className="fieldset-label text-black flex items-center gap-2">
            <input type="checkbox" className="checkbox" /> Senior
          </label>
        </fieldset>

        {/* Salary Range Filter */}
        <fieldset className="fieldset p-4 bg-base-100 border border-base-300 rounded-box gap-3">
          <h3 className="font-semibold mb-2">Salary Range</h3>
          <input 
            type="range" 
            min="0" 
            max="100000" 
            className="range range-primary" 
            step="10000"
          />
          <div className="w-full flex justify-between text-xs px-2">
            <span>₱0</span>
            <span>₱50k</span>
            <span>₱100k+</span>
          </div>
        </fieldset>
      </div>
    </div>
  );
}