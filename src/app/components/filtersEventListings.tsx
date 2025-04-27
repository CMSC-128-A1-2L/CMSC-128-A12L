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
    eventType: {
      social: false,
      academic: false,
      career: false,
      other: false
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
      eventType: {
        social: false,
        academic: false,
        career: false,
        other: false
      }
    };
    
    setFilters(clearedFilters);
    onFilterChange(clearedFilters);
  };

  return (
    <div className="flex-grow">
      {/* Sidebar */}
      <div
        className={`flex flex-col flex-start gap-3 w-64 
          bg-gradient-to-r from-[#1a1f4d]/90 to-[#2a3f8f]/90
          p-4 rounded-xl shadow-lg ${
          isOpen ? "block" : "hidden"
        } sticky top-0 h-full overflow-y-auto`}
      >
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-lg font-bold text-white">Filters</h2>
          <button 
            onClick={clearFilters}
            className="btn btn-sm btn-ghost text-sm text-white/70 hover:text-white hover:bg-white/10 transition-colors"
          >
            Clear all
          </button>
        </div>

        {/* Event Type Filter */}
        <fieldset className="fieldset p-4 bg-black/10 rounded-box gap-3">
          <h3 className="font-semibold mb-2 text-white/90">Event Type</h3>

          <label className="fieldset-label text-white/70 flex items-center gap-2 hover:bg-white/10 p-2 rounded-lg transition-colors">
            <input 
              type="checkbox" 
              className="checkbox border border-white/20 bg-white/5 [&:checked]:bg-blue-600 [&:checked]:border-blue-600" 
              checked={filters.eventType.social}
              onChange={() => handleFilterChange('eventType', 'social')}
            /> 
            Social
          </label>
          <label className="fieldset-label text-white/70 flex items-center gap-2 hover:bg-white/10 p-2 rounded-lg transition-colors">
            <input 
              type="checkbox" 
              className="checkbox border border-white/20 bg-white/5 [&:checked]:bg-blue-600 [&:checked]:border-blue-600" 
              checked={filters.eventType.academic}
              onChange={() => handleFilterChange('eventType', 'academic')}
            /> 
            Academic
          </label>
          <label className="fieldset-label text-white/70 flex items-center gap-2 hover:bg-white/10 p-2 rounded-lg transition-colors">
            <input 
              type="checkbox" 
              className="checkbox border border-white/20 bg-white/5 [&:checked]:bg-blue-600 [&:checked]:border-blue-600" 
              checked={filters.eventType.career}
              onChange={() => handleFilterChange('eventType', 'career')}
            /> 
            Career
          </label>
          <label className="fieldset-label text-white/70 flex items-center gap-2 hover:bg-white/10 p-2 rounded-lg transition-colors">
            <input 
              type="checkbox" 
              className="checkbox border border-white/20 bg-white/5 [&:checked]:bg-blue-600 [&:checked]:border-blue-600" 
              checked={filters.eventType.other}
              onChange={() => handleFilterChange('eventType', 'other')}
            /> 
            Other
          </label>
        </fieldset>

        {/* Add Event Button */}
        <button
          onClick={showModal}
          className="btn btn-primary btn-sm rounded-lg w-[75%] mx-auto py-1 mt-4 text-sm bg-blue-600 hover:bg-blue-700 text-white border-none"
        >
          <Plus size={16} /> Add Event
        </button>
      </div>
    </div>
  );
} 