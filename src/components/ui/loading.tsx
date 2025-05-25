"use client"

import { motion } from 'framer-motion';
import Image from 'next/image';
import ConstellationBackground from '@/app/components/constellation_background';

export default function LoadingScreen() {
    return (
        <div className="fixed inset-0 bg-[#1a237e] z-50 flex items-center justify-center">
            <ConstellationBackground />
            <div className="relative z-10 flex flex-col items-center justify-center">
                {/* Logo */}
                <motion.div
                    initial={{ scale: 0.8, opacity: 0 }}
                    animate={{ scale: 1, opacity: 1 }}
                    transition={{ duration: 0.5 }}
                    className="mb-8"
                >
                    <div className="relative w-32 h-32 bg-white/5 rounded-full p-4 shadow-lg border border-white/10">
                        <Image
                            src="/assets/LOGO_NAME.svg"
                            alt="AEGIS Logo"
                            fill
                            className="object-contain p-2"
                            priority
                        />
                    </div>
                </motion.div>

                {/* Loading Animation */}
                <motion.div
                    initial={{ y: 20, opacity: 0 }}
                    animate={{ y: 0, opacity: 1 }}
                    transition={{ duration: 0.5, delay: 0.2 }}
                    className="flex flex-col items-center"
                >
                    <div className="relative w-16 h-16">
                        <div className="absolute inset-0 rounded-full border-t-2 border-b-2 border-white/20"></div>
                        <div className="absolute inset-0 rounded-full border-t-2 border-white animate-spin"></div>
                    </div>
                    <p className="mt-4 text-white/70 text-sm">Loading...</p>
                </motion.div>
            </div>
        </div>
    );
}