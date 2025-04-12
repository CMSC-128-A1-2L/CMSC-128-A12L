"use client"
import { motion } from 'framer-motion';
import Image from 'next/image';
import { useRouter } from "next/navigation";
import ConstellationBackground from '../components/constellation_background';
import { useEffect } from 'react';
import { signOut } from 'next-auth/react';

export default function VerificationPending() {
    const router = useRouter();
    return (
        <div className="min-h-screen bg-[#1a237e] relative overflow-hidden">
            <ConstellationBackground />
            
            {/* Mobile Layout */}
            <div className="md:hidden min-h-screen flex flex-col relative z-10">
                <div className="absolute inset-0 bg-gradient-to-b from-[#1a237e]/80 to-[#0a0041]/80"></div>
                
                {/* Header */}
                <div className="p-4 border-b border-white/10 relative z-10">
                    <button
                        onClick={() => router.push('/')}
                        className="flex items-center text-white/80 hover:text-white transition-colors"
                    >
                        <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-1" viewBox="0 0 20 20" fill="currentColor">
                            <path fillRule="evenodd" d="M9.707 16.707a1 1 0 01-1.414 0l-6-6a1 1 0 010-1.414l6-6a1 1 0 011.414 1.414L5.414 9H17a1 1 0 110 2H5.414l4.293 4.293a1 1 0 010 1.414z" clipRule="evenodd" />
                        </svg>
                        <span className="text-sm">Back to home</span>
                    </button>
                </div>

                {/* Main Content */}
                <div className="flex-1 flex flex-col items-center justify-center p-6 relative z-10">
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

                    {/* Status Message */}
                    <motion.div
                        initial={{ y: 20, opacity: 0 }}
                        animate={{ y: 0, opacity: 1 }}
                        transition={{ duration: 0.5, delay: 0.2 }}
                        className="text-center mb-8"
                    >
                        <h1 className="text-2xl font-bold text-white mb-2">Verification Pending</h1>
                        <p className="text-white/70 text-sm">Your alumni status is being verified</p>
                    </motion.div>

                    {/* Info Card */}
                    <motion.div
                        initial={{ y: 20, opacity: 0 }}
                        animate={{ y: 0, opacity: 1 }}
                        transition={{ duration: 0.5, delay: 0.3 }}
                        className="w-full max-w-sm bg-white/5 backdrop-blur-sm rounded-xl p-6 shadow-xl border border-white/10"
                    >
                        <div className="space-y-4">
                            <div className="flex items-center justify-center">
                                <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-white"></div>
                            </div>
                            <p className="text-white/70 text-center">
                                We are currently reviewing your alumni status. This process may take a few days. We will notify you once your verification is complete.
                            </p>
                            <button
                                onClick={() => router.push('/')}
                                className="w-full bg-white text-[#1a237e] py-3 rounded-lg font-medium hover:bg-white/90 transition-colors shadow-md"
                            >
                                Return to Home
                            </button>
                        </div>
                    </motion.div>
                </div>
            </div>

            {/* Desktop Layout */}
            <div className="hidden md:flex min-h-screen items-center justify-center p-4 sm:px-6 lg:px-8">
                <div className="w-full max-w-4xl relative perspective-[2000px] flex items-center justify-center my-8">
                    <div className="w-full flex flex-col md:flex-row shadow-lg overflow-hidden rounded-lg">
                        {/* Left Section with Logo */}
                        <div className="flex flex-col items-center justify-center p-6 w-full md:w-[45%] min-h-[400px] md:h-[640px] relative"
                            style={{ backgroundColor: "rgba(11, 1, 67, 0.8)" }}
                        >
                            <div className="relative w-32 h-32 md:w-48 md:h-48 mb-6 md:mb-8">
                                <Image
                                    src="/assets/LOGO_NAME.svg"
                                    alt="AEGIS Logo"
                                    fill
                                    className="object-contain"
                                    priority
                                />
                            </div>

                            <h2 className="text-xl sm:text-2xl lg:text-3xl font-bold text-center text-white mb-2 lg:mb-4"
                                style={{ fontFamily: "Montserrat, sans-serif" }}
                            >
                                Verification Pending
                            </h2>
                            <p className="text-white/70 text-sm lg:text-base text-center px-4"
                                style={{ fontFamily: "Montserrat, sans-serif" }}
                            >
                                Your alumni status is being verified.
                            </p>
                        </div>

                        {/* Right Section */}
                        <div className="w-full md:w-[55%] p-6 sm:p-8 lg:p-12 text-[#0C0051] flex flex-col items-center justify-center bg-white">
                            <div className="w-full max-w-md">
                                <div className="mb-6 md:mb-8">
                                    <button
                                        onClick={() => router.push('/')}
                                        className="mb-4 md:mb-6 flex items-center text-gray-600 hover:text-gray-800 transition-colors cursor-pointer"
                                        style={{ fontFamily: "Montserrat, sans-serif" }}
                                    >
                                        <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-1" viewBox="0 0 20 20" fill="currentColor">
                                            <path fillRule="evenodd" d="M9.707 16.707a1 1 0 01-1.414 0l-6-6a1 1 0 010-1.414l6-6a1 1 0 011.414 1.414L5.414 9H17a1 1 0 110 2H5.414l4.293 4.293a1 1 0 010 1.414z" clipRule="evenodd" />
                                        </svg>
                                        Back to home
                                    </button>

                                    <h2 className="text-xl sm:text-2xl lg:text-3xl font-bold text-gray-800 mb-3"
                                        style={{ fontFamily: "Montserrat, sans-serif" }}
                                    >
                                        Status Update
                                    </h2>

                                    <p className="text-gray-600 text-sm lg:text-base"
                                        style={{ fontFamily: "Montserrat, sans-serif" }}
                                    >
                                        We are currently reviewing your alumni status
                                    </p>
                                </div>

                                <div className="space-y-6">
                                    <div className="flex items-center justify-center">
                                        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-[#0C0051]"></div>
                                    </div>

                                    <div className="bg-gray-50 p-4 rounded-lg">
                                        <p className="text-gray-600 text-sm">
                                            Your alumni status verification is in progress. This process may take a few days to complete. We will notify you once your verification is finished.
                                        </p>
                                    </div>

                                    <button
                                        onClick={() => router.push('/')}
                                        className="w-full bg-[#0C0051] text-white py-3 px-4 rounded-lg shadow-md hover:shadow-lg transition-all duration-200 hover:bg-[#0A0041] mt-2 flex items-center justify-center cursor-pointer"
                                        style={{ fontFamily: "Montserrat, sans-serif" }}
                                    >
                                        Return to Home
                                    </button>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
} 