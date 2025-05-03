"use client";

import { motion } from "framer-motion";
import Link from 'next/link';
import { CheckCircle } from 'lucide-react';
import ConstellationBackground from "@/app/components/constellationBackground";

export default function StripeDonationSuccess() {
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
                            Payment Successful!
                        </h1>
                        <p className="text-xl text-gray-200">
                            Thank you for your generous contribution
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
                    className="bg-gradient-to-br from-green-500/20 to-green-600/20 p-8 rounded-xl border border-white/10 max-w-2xl mx-auto text-center"
                >
                    <div className="flex justify-center mb-6">
                        <CheckCircle className="text-green-500" size={64} />
                    </div>
                    
                    <h2 className="text-2xl font-bold mb-4 text-white">Thank You for Your Donation</h2>
                    <p className="text-gray-200 mb-8">
                        Your contribution will help us continue our mission and support our alumni community initiatives. A receipt has been sent to your email.
                    </p>
                    
                    <div className="flex justify-center gap-4">
                        <Link 
                            href="/alumni/donations" 
                            className="inline-block bg-purple-600 hover:bg-purple-700 text-white font-medium py-2 px-6 rounded transition-colors"
                        >
                            Return to Donations
                        </Link>
                        <Link 
                            href="/" 
                            className="inline-block bg-gray-600 hover:bg-gray-700 text-white font-medium py-2 px-6 rounded transition-colors"
                        >
                            Back to Home
                        </Link>
                    </div>
                </motion.div>
            </div>
        </div>
    );
} 