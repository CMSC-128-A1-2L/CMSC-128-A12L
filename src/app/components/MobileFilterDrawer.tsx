"use client";

import { motion, AnimatePresence } from 'framer-motion';
import { X, Plus } from 'lucide-react';
import { useState } from 'react';

interface MobileFilterDrawerProps {
  isOpen: boolean;
  onClose: () => void;
  onFilter: (filters: any) => void;
  onCreateJob: () => void;
  activeFilters: any;
}

export default function MobileFilterDrawer({
  isOpen,
  onClose,
  onFilter,
  onCreateJob,
  activeFilters
}: MobileFilterDrawerProps) {
  const [filters, setFilters] = useState(activeFilters);

  const handleFilterChange = (category: string, option: string) => {
    const newFilters = {
      ...filters,
      [category]: {
        ...filters[category],
        [option]: !filters[category][option]
      }
    };
    setFilters(newFilters);
    onFilter(newFilters);
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <>
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black/50 z-30"
            onClick={onClose}
          />
          <motion.div
            initial={{ x: '-100%' }}
            animate={{ x: 0 }}
            exit={{ x: '-100%' }}
            transition={{ type: 'tween', duration: 0.3 }}
            className="fixed left-0 top-0 bottom-0 w-80 bg-[#1a1f4d] z-30 flex flex-col"
          >
            {/* Header */}
            <div className="p-4 border-b border-white/10 flex items-center justify-between">
              <h2 className="text-lg font-semibold text-white">Filters</h2>
              <button onClick={onClose} className="p-2 text-white/70 hover:text-white">
                <X size={20} />
              </button>
            </div>

            {/* Filter Content */}
            <div className="flex-1 overflow-y-auto p-4">
              {/* Create Job Button */}
              <button
                onClick={() => {
                  onClose();
                  onCreateJob();
                }}
                className="w-full px-4 py-3 bg-blue-600 hover:bg-blue-700 text-white rounded-lg transition-colors flex items-center justify-center gap-2 mb-6"
              >
                <Plus size={18} />
                Post a New Job
              </button>

              {/* Work Mode Filters */}
              <div className="space-y-4">
                <h3 className="font-medium text-white">Work Mode</h3>
                <div className="space-y-2">
                  {['onSite', 'remote', 'hybrid'].map((mode) => (
                    <label
                      key={mode}
                      className="flex items-center gap-3 text-white/70 hover:text-white cursor-pointer p-2 hover:bg-white/5 rounded-lg"
                    >
                      <input
                        type="checkbox"
                        checked={filters.workMode[mode]}
                        onChange={() => handleFilterChange('workMode', mode)}
                        className="checkbox checkbox-sm border-white/20 bg-white/5"
                      />
                      {mode === 'onSite' ? 'On-site' : mode.charAt(0).toUpperCase() + mode.slice(1)}
                    </label>
                  ))}
                </div>
              </div>
            </div>

            {/* Apply Button */}
            <div className="p-4 border-t border-white/10">
              <button
                onClick={onClose}
                className="w-full px-4 py-2 bg-white/10 hover:bg-white/20 text-white rounded-lg transition-colors"
              >
                Apply Filters
              </button>
            </div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
}
