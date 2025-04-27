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
        className={`flex flex-col flex-start gap-3 w-64 bg-[#0f172a] p-4 rounded-xl shadow-lg ${
          isOpen ? "block" : "hidden"
        } sticky top-0 h-full overflow-y-auto`}
      >
        <div className="bg-white/5 rounded-xl border border-white/10 p-4 space-y-6">
          {/* Add Job Button - Add this at the top */}
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

          {/* Job Type Filter */}
          <fieldset className="fieldset p-4 bg-white/5 rounded-box gap-3">
            <h3 className="font-semibold mb-2 text-white/90">Job Type</h3>

            <label className="fieldset-label text-white/70 flex items-center gap-2 hover:bg-white/10 p-2 rounded-lg transition-colors">
              <input 
                type="checkbox" 
                className="checkbox border border-white/20 bg-white/5 [&:checked]:bg-blue-600 [&:checked]:border-blue-600" 
                checked={filters.jobType.fullTime}
                onChange={() => handleFilterChange('jobType', 'fullTime')}
              /> 
              Full-time
            </label>
            <label className="fieldset-label text-white/70 flex items-center gap-2 hover:bg-white/10 p-2 rounded-lg transition-colors">
              <input 
                type="checkbox" 
                className="checkbox border border-white/20 bg-white/5 [&:checked]:bg-blue-600 [&:checked]:border-blue-600" 
                checked={filters.jobType.partTime}
                onChange={() => handleFilterChange('jobType', 'partTime')}
              /> 
              Part-time
            </label>
            <label className="fieldset-label text-white/70 flex items-center gap-2 hover:bg-white/10 p-2 rounded-lg transition-colors">
              <input 
                type="checkbox" 
                className="checkbox border border-white/20 bg-white/5 [&:checked]:bg-blue-600 [&:checked]:border-blue-600" 
                checked={filters.jobType.contract}
                onChange={() => handleFilterChange('jobType', 'contract')}
              /> 
              Contract
            </label>
          </fieldset>

          {/* Work Type Filter */}
          <fieldset className="fieldset p-4 bg-white/5 rounded-box gap-3">
            <h3 className="font-semibold mb-2 text-white/90">Work Type</h3>

            <label className="fieldset-label text-white/70 flex items-center gap-2 hover:bg-white/10 p-2 rounded-lg transition-colors">
              <input 
                type="checkbox" 
                className="checkbox border border-white/20 bg-white/5 [&:checked]:bg-blue-600 [&:checked]:border-blue-600" 
                checked={filters.workType.onSite}
                onChange={() => handleFilterChange('workType', 'onSite')}
              /> 
              On-site
            </label>
            <label className="fieldset-label text-white/70 flex items-center gap-2 hover:bg-white/10 p-2 rounded-lg transition-colors">
              <input 
                type="checkbox" 
                className="checkbox border border-white/20 bg-white/5 [&:checked]:bg-blue-600 [&:checked]:border-blue-600" 
                checked={filters.workType.remote}
                onChange={() => handleFilterChange('workType', 'remote')}
              /> 
              Remote
            </label>
            <label className="fieldset-label text-white/70 flex items-center gap-2 hover:bg-white/10 p-2 rounded-lg transition-colors">
              <input 
                type="checkbox" 
                className="checkbox border border-white/20 bg-white/5 [&:checked]:bg-blue-600 [&:checked]:border-blue-600" 
                checked={filters.workType.hybrid}
                onChange={() => handleFilterChange('workType', 'hybrid')}
              /> 
              Hybrid
            </label>
          </fieldset>

          {/* Experience Level Filter */}
          <fieldset className="fieldset p-4 bg-white/5 rounded-box gap-3">
            <h3 className="font-semibold mb-2 text-white/90">Experience Level</h3>

            <label className="fieldset-label text-white/70 flex items-center gap-2 hover:bg-white/10 p-2 rounded-lg transition-colors">
              <input 
                type="checkbox" 
                className="checkbox border border-white/20 bg-white/5 [&:checked]:bg-blue-600 [&:checked]:border-blue-600" 
                checked={filters.experienceLevel.entry}
                onChange={() => handleFilterChange('experienceLevel', 'entry')}
              /> 
              Entry Level
            </label>
            <label className="fieldset-label text-white/70 flex items-center gap-2 hover:bg-white/10 p-2 rounded-lg transition-colors">
              <input 
                type="checkbox" 
                className="checkbox border border-white/20 bg-white/5 [&:checked]:bg-blue-600 [&:checked]:border-blue-600" 
                checked={filters.experienceLevel.midLevel}
                onChange={() => handleFilterChange('experienceLevel', 'midLevel')}
              /> 
              Mid-Level
            </label>
            <label className="fieldset-label text-white/70 flex items-center gap-2 hover:bg-white/10 p-2 rounded-lg transition-colors">
              <input 
                type="checkbox" 
                className="checkbox border border-white/20 bg-white/5 [&:checked]:bg-blue-600 [&:checked]:border-blue-600" 
                checked={filters.experienceLevel.senior}
                onChange={() => handleFilterChange('experienceLevel', 'senior')}
              /> 
              Senior
            </label>
          </fieldset>

          {/* Salary Range Filter */}
          <fieldset className="fieldset p-4 bg-white/5 rounded-box gap-3">
            <h3 className="font-semibold mb-2 text-white/90">Salary Range</h3>
            <input 
              type="range" 
              min="0" 
              max="100000" 
              className="range range-primary" 
              step="10000"
            />
            <div className="w-full flex justify-between text-xs px-2 text-white/70">
              <span>₱0</span>
              <span>₱50k</span>
              <span>₱100k+</span>
            </div>
          </fieldset>
        </div>
      </div>
    </div>
  );
}