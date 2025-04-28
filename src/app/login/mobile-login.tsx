"use client"
import { motion } from 'framer-motion';
import Image from 'next/image';
import { Eye, EyeOff, ArrowLeft } from "lucide-react";
import { signIn } from "next-auth/react";
import { redirect, useRouter } from "next/navigation";
import ConstellationBackground from '../components/constellation_background';

interface MobileLoginProps {
    error: string;
    isLoading: boolean;
    isPasswordVisible: boolean;
    togglePasswordVisibility: () => void;
    handleSubmit: (e: React.FormEvent<HTMLFormElement>) => void;
}

export default function MobileLogin({
    error,
    isLoading,
    isPasswordVisible,
    togglePasswordVisibility,
    handleSubmit
}: MobileLoginProps) {
    const router = useRouter();

    return (
        <div className="md:hidden min-h-screen flex flex-col relative z-10">
            <ConstellationBackground />
            <div className="absolute inset-0 bg-gradient-to-b from-[#1a237e]/80 to-[#0a0041]/80"></div>
            
            {/* Header */}
            <motion.div 
                initial={{ y: -50, opacity: 0 }}
                animate={{ y: 0, opacity: 1 }}
                transition={{ duration: 0.5 }}
                className="p-4 border-b border-white/10 relative z-10"
            >
                <motion.button
                    onClick={() => router.push('/')}
                    className="flex items-center text-white/80 hover:text-white transition-colors"
                    whileHover={{ x: -5 }}
                    whileTap={{ scale: 0.95 }}
                >
                    <ArrowLeft className="w-5 h-5 mr-1" />
                    <span className="text-sm">Back to home</span>
                </motion.button>
            </motion.div>

            {/* Main Content */}
            <div className="flex-1 flex flex-col items-center justify-center px-4 sm:px-6 pb-8 sm:pb-12 relative z-10">
                {/* Logo */}
                <motion.div
                    initial={{ scale: 0.8, opacity: 0 }}
                    animate={{ scale: 1, opacity: 1 }}
                    transition={{ duration: 0.5 }}
                    className="mb-6 sm:mb-8"
                >
                    <div className="relative w-28 h-28 sm:w-32 sm:h-32 bg-white/5 rounded-full p-3 sm:p-4 shadow-lg border border-white/10">
                        <Image
                            src="/assets/LOGO_NAME.svg"
                            alt="AEGIS Logo"
                            fill
                            className="object-contain p-2"
                            priority
                        />
                    </div>
                </motion.div>

                {/* Welcome Text */}
                <motion.div
                    initial={{ y: 20, opacity: 0 }}
                    animate={{ y: 0, opacity: 1 }}
                    transition={{ duration: 0.5, delay: 0.2 }}
                    className="text-center mb-6 sm:mb-8"
                >
                    <h1 className="text-xl sm:text-2xl font-bold text-white mb-2">Welcome Back</h1>
                    <p className="text-white/70 text-sm">Sign in to continue</p>
                </motion.div>

                {/* Login Form */}
                <motion.div
                    initial={{ y: 20, opacity: 0 }}
                    animate={{ y: 0, opacity: 1 }}
                    transition={{ duration: 0.5, delay: 0.3 }}
                    className="w-full max-w-sm bg-white/5 backdrop-blur-sm rounded-xl p-4 sm:p-6 shadow-xl border border-white/10"
                >
                    <form onSubmit={handleSubmit} className="space-y-4">
                        {error && (
                            <motion.div 
                                initial={{ opacity: 0, y: -10 }}
                                animate={{ opacity: 1, y: 0 }}
                                className="bg-red-50 border border-red-200 text-red-600 px-4 py-3 rounded-lg text-sm"
                            >
                                {error}
                            </motion.div>
                        )}

                        <div>
                            <label htmlFor="email" className="block text-sm font-medium text-white mb-1">
                                Email Address
                            </label>
                            <input
                                type="email"
                                id="email"
                                name="email"
                                className="w-full px-4 py-3 rounded-lg bg-white/10 border border-white/20 text-white placeholder-white/50 focus:outline-none focus:ring-2 focus:ring-white/30 transition-colors"
                                placeholder="Enter your email"
                                required
                                disabled={isLoading}
                            />
                        </div>

                        <div>
                            <label htmlFor="password" className="block text-sm font-medium text-white mb-1">
                                Password
                            </label>
                            <div className="relative">
                                <input
                                    type={isPasswordVisible ? "text" : "password"}
                                    id="password"
                                    name="password"
                                    className="w-full px-4 py-3 rounded-lg bg-white/10 border border-white/20 text-white placeholder-white/50 focus:outline-none focus:ring-2 focus:ring-white/30 transition-colors"
                                    placeholder="Enter your password"
                                    required
                                    disabled={isLoading}
                                />
                                <motion.button
                                    type="button"
                                    onClick={togglePasswordVisibility}
                                    className="absolute right-3 top-1/2 -translate-y-1/2 text-white/50 hover:text-white transition-colors"
                                    whileTap={{ scale: 0.9 }}
                                >
                                    {isPasswordVisible ? (
                                        <EyeOff className="w-5 h-5" />
                                    ) : (
                                        <Eye className="w-5 h-5" />
                                    )}
                                </motion.button>
                            </div>
                        </div>

                        <div className="flex items-center justify-between">
                            <label className="flex items-center">
                                <input
                                    type="checkbox"
                                    className="w-4 h-4 rounded border-white/20 bg-white/10 text-blue-600 focus:ring-blue-500"
                                    disabled={isLoading}
                                />
                                <span className="ml-2 text-sm text-white/70">Remember me</span>
                            </label>
                            <a href="#" className="text-sm text-white hover:text-white/80 transition-colors">
                                Forgot password?
                            </a>
                        </div>

                        <motion.button
                            type="submit"
                            disabled={isLoading}
                            className="w-full bg-white text-[#1a237e] py-3 rounded-lg font-medium hover:bg-white/90 transition-colors disabled:opacity-50 disabled:cursor-not-allowed shadow-md"
                            whileHover={{ scale: 1.02 }}
                            whileTap={{ scale: 0.98 }}
                        >
                            {isLoading ? (
                                <div className="flex items-center justify-center">
                                    <svg className="animate-spin -ml-1 mr-2 h-5 w-5" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                                        <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                                        <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                                    </svg>
                                    Signing in...
                                </div>
                            ) : (
                                "Sign In"
                            )}
                        </motion.button>
                    </form>

                    <div className="mt-6 space-y-3">
                        <motion.button
                            onClick={() => signIn("google", {
                                callbackUrl: `${process.env.NEXT_PUBLIC_CALLBACK_URL}/redirect`,
                            })}
                            className="w-full bg-white/10 text-white py-3 rounded-lg font-medium hover:bg-white/20 transition-colors flex items-center justify-center gap-2 border border-white/20 shadow-sm"
                            whileHover={{ scale: 1.02 }}
                            whileTap={{ scale: 0.98 }}
                        >
                            <img src="/assets/google.png" alt="Google" className="w-5 h-5" />
                            Continue with Google
                        </motion.button>

                        <motion.button
                            onClick={() => router.push('/register')}
                            className="w-full bg-white/10 text-white py-3 rounded-lg font-medium hover:bg-white/20 transition-colors flex items-center justify-center gap-2 border border-white/20 shadow-sm"
                            whileHover={{ scale: 1.02 }}
                            whileTap={{ scale: 0.98 }}
                        >
                            <img src="/assets/email_logo_but_white.png" alt="Email" className="w-5 h-5" />
                            Sign up with Email
                        </motion.button>
                    </div>
                </motion.div>
            </div>
        </div>
    );
} 