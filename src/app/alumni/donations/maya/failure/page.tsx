"use client";

import { motion } from "framer-motion";
import Link from 'next/link';
import { XCircle } from 'lucide-react';
import ConstellationBackground from "@/app/components/constellationBackground";

export default function MayaDonationFailure() {
    return (
        <div className="min-h-screen">
            {/* Hero Section */}
            <div className="relative text-white -mt-16 pt-16 overflow-hidden">
                <div className="absolute inset-0 bg-gradient-to-r from-[#1a1f4d]/90 to-[#2a3f8f]/90"></div>
                <ConstellationBackground />
                <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 z-10">
                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.5 }}
                        className="text-center"
                    >
                        <h1 className="text-4xl md:text-5xl font-bold mb-4">
                            Payment Failed
                        </h1>
                        <p className="text-xl text-gray-200">
                            We couldn't process your donation
                        </p>
                    </motion.div>
                </div>
            </div>

            {/* Main Content */}
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.5, delay: 0.2 }}
                    className="bg-gradient-to-br from-red-500/20 to-red-600/20 p-8 rounded-xl border border-white/10 max-w-2xl mx-auto text-center"
                >
                    <div className="flex justify-center mb-6">
                        <XCircle className="text-red-500" size={64} />
                    </div>
                    
                    <h2 className="text-2xl font-bold mb-4 text-white">Payment Unsuccessful</h2>
                    <p className="text-gray-200 mb-8">
                        We encountered an issue processing your payment. Please try again or contact support if the problem persists.
                    </p>
                    
                    <div className="flex justify-center gap-4">
                        <Link 
                            href="/alumni/donations/maya" 
                            className="inline-block bg-green-600 hover:bg-green-700 text-white font-medium py-2 px-6 rounded transition-colors"
                        >
                            Try Again
                        </Link>
                        <Link 
                            href="/alumni/donations" 
                            className="inline-block bg-gray-600 hover:bg-gray-700 text-white font-medium py-2 px-6 rounded transition-colors"
                        >
                            Return to Donations
                        </Link>
                    </div>
                </motion.div>
            </div>
        </div>
    );
} 