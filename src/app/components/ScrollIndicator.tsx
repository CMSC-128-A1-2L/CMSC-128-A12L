"use client"
import React, { useState, useEffect } from "react";
import { motion, AnimatePresence } from 'framer-motion';

interface ScrollIndicatorProps {
  className?: string;
  threshold?: number;
  targetId?: string;
  scrollToBottom?: boolean;
}

const ScrollIndicator: React.FC<ScrollIndicatorProps> = ({
  className = "",
  threshold = 100,
  targetId,
  scrollToBottom = true
}) => {
  const [showScrollIndicator, setShowScrollIndicator] = useState(true);
  const [lastScrollY, setLastScrollY] = useState(0);

  useEffect(() => {
    const handleScroll = () => {
      const currentScrollY = window.scrollY;
      
      // Show indicator when scrolling up or at the top
      if (currentScrollY < lastScrollY || currentScrollY < threshold) {
        setShowScrollIndicator(true);
      } else {
        setShowScrollIndicator(false);
      }
      
      setLastScrollY(currentScrollY);
    };

    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, [lastScrollY, threshold]);

  const handleClick = () => {
    if (scrollToBottom) {
      window.scrollTo({
        top: document.documentElement.scrollHeight,
        behavior: 'smooth'
      });
    } else if (targetId) {
      const targetElement = document.getElementById(targetId);
      targetElement?.scrollIntoView({ behavior: 'smooth' });
    }
  };

  return (
    <AnimatePresence>
      {showScrollIndicator && (
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: 20 }}
          transition={{ duration: 0.3 }}
          className={`fixed bottom-8 left-1/2 transform -translate-x-1/2 z-50 ${className}`}
        >
          <motion.button
            onClick={handleClick}
            className="bg-white/10 backdrop-blur-sm p-4 rounded-full border-2 border-white/20 hover:bg-white/20 transition-colors cursor-pointer group shadow-lg"
            whileHover={{ scale: 1.1 }}
            whileTap={{ scale: 0.95 }}
          >
            <motion.div
              animate={{ y: [0, 8, 0] }}
              transition={{ duration: 1.5, repeat: Infinity, ease: "easeInOut" }}
              className="text-white"
            >
              <svg 
                xmlns="http://www.w3.org/2000/svg" 
                className="h-6 w-6" 
                fill="none" 
                viewBox="0 0 24 24" 
                stroke="currentColor"
              >
                <path 
                  strokeLinecap="round" 
                  strokeLinejoin="round" 
                  strokeWidth={2} 
                  d="M19 14l-7 7m0 0l-7-7m7 7V3" 
                />
              </svg>
            </motion.div>
          </motion.button>
        </motion.div>
      )}
    </AnimatePresence>
  );
};

export default ScrollIndicator; 