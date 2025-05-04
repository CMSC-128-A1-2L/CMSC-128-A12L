"use client";

import { motion, AnimatePresence } from 'framer-motion';
import { X } from 'lucide-react';
import { useEffect, useState } from 'react';

interface MobileNewslettersFilterDrawerProps {
  isOpen: boolean;
  onClose: () => void;
  onFilter: (filters: {sort: string}) => void;
  activeFilters: {sort: string};
}

export default function MobileNewslettersFilterDrawer({
  isOpen,
  onClose,
  onFilter,
  activeFilters
}: MobileNewslettersFilterDrawerProps) {
  const [selectedSort, setSelctedSort] = useState("newest");

  useEffect(() => {
    setSelctedSort(activeFilters.sort);
  }, [activeFilters]);

  const handleSortChange = (sort: string) => {
    setSelctedSort(sort);
  };

  const applyFilters = () => {
    onFilter({sort: selectedSort});
    onClose();
  }

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

            <div className="flex-1 overflow-y-auto p-4">
              <div className="space-y-4">
                <h3 className="font-medium text-white">Sort</h3>
                <div className="space-y-2">
                  {['newest', 'oldest', 'a-z', 'z-a'].map((sort) => (
                    <label
                      key={sort}
                      className="flex items-center gap-3 text-white/70 hover:text-white p-2 hover:bg-white/5 rounded-lg"
                    >
                      <input
                        type="radio"
                        name="sort"
                        value={sort}
                        checked={selectedSort===sort}
                        onChange={() => handleSortChange(sort)}
                        className="accent-blue-700"
                      />
                      <span className="text-white">{sort.toUpperCase()}</span>
                    </label>
                  ))}
                </div>
              </div>
            </div>

            {/* Apply Button */}
            <div className="p-4 border-t border-white/10">
              <button
                onClick={applyFilters}
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
