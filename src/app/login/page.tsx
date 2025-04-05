"use client"
import SignIn from "@/app/components/sign_in"; 
import EmailSignUp from "@/app/components/email_signup";
import { motion, AnimatePresence } from 'framer-motion';
import Image from 'next/image';
import ConstellationBackground from '../components/constellation_background';
import { useState } from 'react';
import { signIn } from "next-auth/react";
import { redirect, useRouter } from "next/navigation";
import { Eye, EyeOff } from "lucide-react";

export default function Login() {
	const router = useRouter();
	const [isFlipped, setIsFlipped] = useState(false);
	const [isLoading, setIsLoading] = useState(false);
	const [error, setError] = useState("");
	const [isPasswordVisible, setIsPasswordVisible] = useState(false);
	

	const handleEmailClick = () => {
		setIsFlipped(true);
	};

	const togglePasswordVisibility = () => {
		setIsPasswordVisible(!isPasswordVisible);
	  };

	const handleBackClick = () => {
		setIsFlipped(false);
		setError("");
	};

	const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
		e.preventDefault();
		setIsLoading(true);
		setError("");

		const formData = new FormData(e.currentTarget);
		const email = formData.get('email') as string;
		const password = formData.get('password') as string;

		try {
			// use email-password provider since we are currently using it, we pass the email and password as parameters,
			// so we won't need to go to the custom page made by NEXT AUTH
			const result = await signIn('email-password', {
				email,
				password,
				redirect: false,
			});
			console.log("The result is", result);
			if (result?.error) {
				setError("Invalid email or password");
				setIsLoading(false);
				return;
			} 
		} catch (error) {
			console.error('Login error:', error);
			setError("An error occurred. Please try again.");
			setIsLoading(false);
		}
		// when all is well, we redirect the user. redirect only works outside a try catch (i should probably stop using redirect and instead use routers lol)
		redirect(`${process.env.NEXT_PUBLIC_CALLBACK_URL}/redirect`)

	};

	return (
		<div className="min-h-screen flex items-center justify-center bg-[#1a237e] p-4 sm:px-6 lg:px-8 relative overflow-hidden">
			{/* Constellation Background */}
			<ConstellationBackground />

			{/* Main Content */}
			<div className="w-full max-w-4xl relative perspective-[2000px] flex items-center justify-center my-8">
				<motion.div 
					className="w-full relative preserve-3d"
					animate={{ rotateY: isFlipped ? 180 : 0 }}
					transition={{ duration: 0.8, ease: "easeInOut" }}
					style={{ 
						transformStyle: "preserve-3d",
						transformOrigin: "center center",
					}}
				>
					{/* Front of Card */}
					<motion.div 
						className="w-full backface-hidden"
						style={{ 
							backfaceVisibility: "hidden",
							WebkitBackfaceVisibility: "hidden",
							transform: "rotateY(0deg)",
							zIndex: isFlipped ? 0 : 1,
							position: "relative",
							transformOrigin: "center center",
						}}
					>
						<div className="w-full flex flex-col md:flex-row shadow-lg overflow-hidden relative rounded-lg">
							{/* Left Section with Logo Animation */}
							<motion.div
								initial={{ x: -100, opacity: 0 }}
								animate={{ x: 0, opacity: 1 }}
								transition={{ duration: 0.7, ease: "easeOut" }}
								className="flex flex-col items-center justify-center p-6 w-full md:w-[45%] min-h-[400px] md:h-[640px] relative"
								style={{ backgroundColor: "rgba(11, 1, 67, 0.8)" }}
							>
								{/* Logo Animation Container */}
								<motion.div
									className="relative w-32 h-32 md:w-48 md:h-48 mb-6 md:mb-8"
									initial={{ scale: 0 }}
									animate={{ scale: 1 }}
									transition={{ duration: 1.4, delay: 0.2 }}
								>
									{/* Logo with Animation */}
									<motion.div
										className="absolute inset-0"
										initial={{ rotateX: 90 }}
										animate={{ rotateX: 0 }}
										transition={{ duration: 0.8, delay: 0.5 }}
									>
										<motion.div
											className="relative w-full h-full"
											initial={{ opacity: 0 }}
											animate={{ opacity: 1 }}
											transition={{ duration: 0.6, delay: 0.6 }}
										>
											<Image
												src="/assets/LOGO_NAME.svg"
												alt="AEGIS Logo"
												fill
												className="object-contain"
												priority
											/>
										</motion.div>
									</motion.div>
								</motion.div>

								<motion.h2
									initial={{ y: 20, opacity: 0 }}
									animate={{ y: 0, opacity: 1 }}
									transition={{ duration: 0.6, delay: 0.7, ease: "easeOut" }}
									className="text-xl sm:text-2xl lg:text-3xl font-bold text-center text-white mb-2 lg:mb-4"
									style={{ fontFamily: "Montserrat, sans-serif" }}
								>
									Welcome Back
								</motion.h2>
								<motion.p
									initial={{ y: 20, opacity: 0 }}
									animate={{ y: 0, opacity: 1 }}
									transition={{ duration: 0.6, delay: 0.8, ease: "easeOut" }}
									className="text-white/70 text-sm lg:text-base text-center px-4"
									style={{ fontFamily: "Montserrat, sans-serif" }}
								>
									Connect with your alma mater.
								</motion.p>
							</motion.div>

							{/* Right Section */}
							<motion.div
								initial={{ x: 100, opacity: 0 }}
								animate={{ x: 0, opacity: 1 }}
								transition={{ duration: 0.7, delay: 0.7, ease: "easeOut" }}
								className="w-full md:w-[65%] p-6 sm:p-8 lg:p-12 text-[#0C0051] flex flex-col items-center justify-center bg-white"
							>
								{/* Back to Home Button */}
								<motion.button
									onClick={() => router.push('/')}
									className="self-start mb-4 md:mb-6 flex items-center text-gray-600 hover:text-gray-800 transition-colors cursor-pointer"
									style={{ fontFamily: "Montserrat, sans-serif" }}
									whileHover={{ x: -5 }}
									>
									<svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-1" viewBox="0 0 20 20" fill="currentColor">
										<path
										fillRule="evenodd"
										d="M9.707 16.707a1 1 0 01-1.414 0l-6-6a1 1 0 010-1.414l6-6a1 1 0 011.414 1.414L5.414 9H17a1 1 0 110 2H5.414l4.293 4.293a1 1 0 010 1.414z"
										clipRule="evenodd"
										/>
									</svg>
									Back to home
								</motion.button>
								<div className="w-full max-w-md">
									<div className="mb-6 md:mb-8">
										{/* Welcome Heading */}
										<motion.h2
											initial={{ y: 20, opacity: 0 }}
											animate={{ y: 0, opacity: 1 }}
											transition={{ duration: 0.6, delay: 0.8, ease: "easeOut" }}
											className="text-xl sm:text-2xl lg:text-3xl font-bold text-gray-800 mb-3"
											style={{ fontFamily: "Montserrat, sans-serif" }}
										>
											<div className="flex items-center gap-2">
												<span>Sign in to</span>
												<motion.div 
													initial={{ scale: 0.9, opacity: 0 }} 
													animate={{ scale: 1, opacity: 1 }}
													transition={{ duration: 0.5, delay: 0.9 }}
													className="h-6 sm:h-8 w-[100px] sm:w-[135px] inline-flex items-center pl-1 -mt-1"
												>
													<svg viewBox="0 14.3 135.35 32.5" className="w-full h-full text-black">
														<motion.path
														initial={{ pathLength: 0 }}
														animate={{ pathLength: 1 }}
														transition={{ duration: 6, ease: "easeInOut" }}
														d="M11.50 28.30L21.80 28.30L22.15 29.25L10.75 29.25L11.50 28.30M34.85 45.60Q35.05 45.60 35.05 45.90Q35.05 46.20 34.85 46.20Q33.95 46.20 31.95 46.10Q30.05 46 29.15 46Q28.10 46 26.40 46.10Q24.80 46.20 24 46.20Q23.80 46.20 23.80 45.90Q23.80 45.60 24 45.60Q26.05 45.60 26.95 45.23Q27.85 44.85 27.85 43.95Q27.85 43.25 27.30 42L16 17.70L16.95 16.85L7.30 40.05Q6.60 41.75 6.60 42.85Q6.60 44.30 7.80 44.95Q9 45.60 11.55 45.60Q11.80 45.60 11.80 45.90Q11.80 46.20 11.55 46.20Q10.65 46.20 8.95 46.10Q7.05 46 5.65 46Q4.40 46 2.70 46.10Q1.20 46.20 0.25 46.20Q0 46.20 0 45.90Q0 45.60 0.25 45.60Q1.65 45.60 2.63 45.10Q3.60 44.60 4.48 43.30Q5.35 42 6.35 39.60L16.80 14.45Q16.90 14.30 17.13 14.30Q17.35 14.30 17.40 14.45L29 39.35Q30.15 41.90 31.05 43.23Q31.95 44.55 32.83 45.08Q33.70 45.60 34.85 45.60ZM37.25 46.20Q37.15 46.20 37.15 45.90Q37.15 45.60 37.25 45.60Q39.20 45.60 40.13 45.35Q41.05 45.10 41.38 44.38Q41.70 43.65 41.70 42.15L41.70 19Q41.70 17.50 41.38 16.80Q41.05 16.10 40.13 15.83Q39.20 15.55 37.25 15.55Q37.15 15.55 37.15 15.25Q37.15 14.95 37.25 14.95L57.05 14.95Q57.50 14.95 57.50 15.40L57.60 21.45Q57.60 21.60 57.33 21.60Q57.05 21.60 57.05 21.45Q57.05 18.90 55.70 17.40Q54.35 15.90 52.15 15.90L48.70 15.90Q46.80 15.90 45.90 16.15Q45 16.40 44.67 17.10Q44.35 17.80 44.35 19.30L44.35 41.95Q44.35 43.40 44.67 44.08Q45 44.75 45.88 45Q46.75 45.25 48.70 45.25L53.30 45.25Q55.30 45.25 56.72 43.50Q58.15 41.75 58.55 38.90Q58.55 38.75 58.85 38.78Q59.15 38.80 59.15 38.95Q58.70 42.10 58.70 45.45Q58.70 45.85 58.52 46.03Q58.35 46.20 57.90 46.20L37.25 46.20M55.10 34.45Q55.10 32.20 54.15 31.30Q53.20 30.40 50.80 30.40L43.10 30.40L43.10 29.45L50.95 29.45Q53.25 29.45 54.15 28.68Q55.05 27.90 55.05 26Q55.05 25.90 55.35 25.90Q55.65 25.90 55.65 26L55.60 29.95Q55.60 31.40 55.65 32.10L55.70 34.45Q55.70 34.55 55.40 34.55Q55.10 34.55 55.10 34.45ZM81.90 46.80Q76.45 46.80 72.43 44.70Q68.40 42.60 66.28 39Q64.15 35.40 64.15 30.95Q64.15 26.10 66.63 22.35Q69.10 18.60 73.43 16.50Q77.75 14.40 83.20 14.40Q85.65 14.40 87.83 14.90Q90 15.40 91.45 16.30Q91.80 16.55 91.88 16.73Q91.95 16.90 91.98 17.13Q92 17.35 92 17.45L92.60 22.70Q92.60 22.85 92.33 22.88Q92.05 22.90 92 22.75Q91.05 19.20 88.25 17.33Q85.45 15.45 81.15 15.45Q74.55 15.45 70.90 19.10Q67.25 22.75 67.25 29.20Q67.25 34 69.30 37.83Q71.35 41.65 74.98 43.80Q78.60 45.95 83.10 45.95Q85.80 45.95 87.28 45.50Q88.75 45.05 89.43 43.75Q90.10 42.45 90.10 39.90Q90.10 37.30 89.75 36.28Q89.40 35.25 88.25 34.90Q87.10 34.55 84.25 34.55Q83.95 34.55 83.95 34.15Q83.95 34 84.03 33.88Q84.10 33.75 84.20 33.75Q88.05 34 90.40 34Q92.65 34 95.20 33.85Q95.30 33.85 95.38 33.98Q95.45 34.10 95.45 34.20Q95.45 34.55 95.20 34.55Q93.90 34.50 93.35 34.88Q92.80 35.25 92.65 36.40Q92.50 37.55 92.50 40.40Q92.50 42.65 92.68 43.60Q92.85 44.55 92.85 44.80Q92.85 45.10 92.75 45.20Q92.65 45.30 92.30 45.40Q86.45 46.80 81.90 46.80ZM106.95 42.15Q106.95 43.70 107.27 44.40Q107.60 45.10 108.50 45.35Q109.40 45.60 111.40 45.60Q111.50 45.60 111.50 45.90Q111.50 46.20 111.40 46.20Q109.90 46.20 109.05 46.15L105.55 46.10L102.20 46.15Q101.30 46.20 99.75 46.20Q99.60 46.20 99.60 45.90Q99.60 45.60 99.75 45.60Q101.70 45.60 102.63 45.35Q103.55 45.10 103.90 44.38Q104.25 43.65 104.25 42.15L104.25 19Q104.25 17.50 103.90 16.80Q103.55 16.10 102.63 15.83Q101.70 15.55 99.75 15.55Q99.60 15.55 99.60 15.25Q99.60 14.95 99.75 14.95L102.20 15Q104.30 15.10 105.55 15.10Q106.95 15.10 109.05 15L111.40 14.95Q111.50 14.95 111.50 15.25Q111.50 15.55 111.40 15.55Q109.45 15.55 108.52 15.85Q107.60 16.15 107.27 16.88Q106.95 17.60 106.95 19.10L106.95 42.15ZM120.75 21Q120.75 23 121.70 24.45Q122.65 25.90 124.02 26.88Q125.40 27.85 127.85 29.30Q130.45 30.85 131.88 31.88Q133.30 32.90 134.32 34.50Q135.35 36.10 135.35 38.35Q135.35 40.70 134.20 42.63Q133.05 44.55 130.78 45.68Q128.50 46.80 125.20 46.80Q123.45 46.80 121.88 46.43Q120.30 46.05 118.40 45.10Q118.15 44.95 118.07 44.75Q118 44.55 117.95 44.15L117.20 37.65L117.20 37.60Q117.20 37.40 117.45 37.38Q117.70 37.35 117.75 37.55Q118.25 41 120.40 43.55Q122.55 46.10 126.30 46.10Q128.95 46.10 130.78 44.65Q132.60 43.20 132.60 40.10Q132.60 37.85 131.60 36.23Q130.60 34.60 129.17 33.53Q127.75 32.45 125.30 31Q122.90 29.60 121.52 28.55Q120.15 27.50 119.17 25.93Q118.20 24.35 118.20 22.15Q118.20 19.65 119.47 17.90Q120.75 16.15 122.80 15.28Q124.85 14.40 127.20 14.40Q129.95 14.40 132.90 15.60Q133.65 15.90 133.65 16.45L134.10 21.75Q134.10 21.95 133.82 21.95Q133.55 21.95 133.50 21.75Q133.30 19.15 131.55 17.10Q129.80 15.05 126.55 15.05Q123.55 15.05 122.15 16.80Q120.75 18.55 120.75 21Z"
														stroke="currentColor"
														strokeWidth="1"
														fill="none"
														/>
													</svg>
												</motion.div>
											</div>
										</motion.h2>

										{/* Description */}
										<motion.p
											initial={{ y: 20, opacity: 0 }}
											animate={{ y: 0, opacity: 1 }}
											transition={{ duration: 0.6, delay: 0.9, ease: "easeOut" }}
											className="text-gray-600 text-sm lg:text-base"
											style={{ fontFamily: "Montserrat, sans-serif" }}
										>
											<strong>Sign in</strong> to reconnect with fellow alumni, access exclusive resources, and stay connected with your alma mater.
										</motion.p>
									</div>
									
									{/* Buttons Section */}
									<motion.div
										initial={{ y: 20, opacity: 0 }}
										animate={{ y: 0, opacity: 1 }}
										transition={{ duration: 0.6, delay: 1, ease: "easeOut" }}
										className="mt-8 sm:mt-12 space-y-4 px-2 sm:px-4"
									>
										<div className="space-y-3">
											<motion.button
												onClick={() => signIn("google", {
													callbackUrl: `${process.env.NEXT_PUBLIC_CALLBACK_URL}/redirect`,
												})}
												className="w-full bg-white text-gray-800 py-3 px-4 rounded-lg flex items-center justify-center gap-3 shadow-md hover:shadow-lg border border-gray-300 transition-all duration-200"
												style={{ fontFamily: "Montserrat, sans-serif", cursor: "pointer" }}
												whileHover={{ scale: 1.02 }}
												whileTap={{ scale: 0.98 }}
											>
												<img src="/assets/google.png" alt="Google Icon" className="w-5 h-5" />
												<span className="text-sm font-medium">Continue with Google</span>
											</motion.button>

											<motion.button
												onClick={handleEmailClick}
												className="w-full bg-white text-gray-800 py-3 px-4 rounded-lg flex items-center justify-center gap-3 shadow-md hover:shadow-lg border border-gray-300 transition-all duration-200"
												style={{ fontFamily: "Montserrat, sans-serif", cursor: "pointer" }}
												whileHover={{ scale: 1.02 }}
												whileTap={{ scale: 0.98 }}
											>
												<img src="/assets/email_logo_but_black.png" alt="Email Icon" className="w-5 h-5" />
												<span className="text-sm font-medium">Continue with Email</span>
											</motion.button>
										</div>

										<motion.button 
											onClick={() => redirect("/register")}
											className="w-full bg-[#0C0051] text-white py-3 px-4 rounded-lg flex items-center justify-center gap-3 shadow-md hover:shadow-lg border border-[#0C0051] transition-all duration-200 hover:bg-[#0A0041] mt-4"
											style={{ fontFamily: "Montserrat, sans-serif", cursor: "pointer" }}
											whileHover={{ scale: 1.02 }}
											whileTap={{ scale: 0.98 }}
										>
											<img src="/assets/email_logo_but_white.png" alt="Email Icon" className="w-5 h-5" />
											<span className="text-sm font-medium">Sign up with Email</span>
										</motion.button>
									</motion.div>

									{/* Support Text */}
									<motion.p
										initial={{ y: 20, opacity: 0 }}
										animate={{ y: 0, opacity: 1 }}
										transition={{ duration: 0.6, delay: 1.1, ease: "easeOut" }}
										className="mt-6 sm:mt-8 text-sm text-center text-gray-500 hover:text-gray-600 transition-colors cursor-pointer"
										style={{ fontFamily: "Montserrat, sans-serif" }}
									>
										Need help? Contact our support team for assistance.
									</motion.p>
								</div>
							</motion.div>
						</div>
					</motion.div>

					{/* Back of Card (Login Form) */}
					<motion.div 
						className="w-full absolute top-0 left-0 backface-hidden"
						style={{ 
							backfaceVisibility: "hidden",
							WebkitBackfaceVisibility: "hidden",
							transform: "rotateY(180deg)",
							zIndex: isFlipped ? 1 : 0,
							transformOrigin: "center center",
						}}
					>
						<div className="w-full flex flex-col md:flex-row shadow-lg overflow-hidden rounded-lg">
							{/* Left Section with Logo */}
							<div className="flex flex-col items-center justify-center p-6 w-full md:w-[45%] min-h-[400px] md:h-[660px] relative"
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
									Email Login
								</h2>
								<p className="text-white/70 text-sm lg:text-base text-center px-4"
									style={{ fontFamily: "Montserrat, sans-serif" }}
								>
									Enter your credentials to sign in.
								</p>
							</div>

							{/* Right Section - Login Form */}
							<div className="w-full md:w-[65%] p-6 sm:p-8 lg:p-12 text-[#0C0051] flex flex-col items-center justify-center bg-white">
								<div className="w-full max-w-md">
									<div className="mb-6 md:mb-8">
										{/* Back to options Button*/}
										<motion.button
											onClick={handleBackClick}
											className="mb-4 md:mb-6 flex items-center text-gray-600 hover:text-gray-800 transition-colors cursor-pointer"
											style={{ fontFamily: "Montserrat, sans-serif" }}
											whileHover={{ x: -5 }}
											>
											<svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-1" viewBox="0 0 20 20" fill="currentColor">
												<path
												fillRule="evenodd"
												d="M9.707 16.707a1 1 0 01-1.414 0l-6-6a1 1 0 010-1.414l6-6a1 1 0 011.414 1.414L5.414 9H17a1 1 0 110 2H5.414l4.293 4.293a1 1 0 010 1.414z"
												clipRule="evenodd"
												/>
											</svg>
											Back to options
										</motion.button>
										{/* Login Form Heading */}
										<h2 className="text-xl sm:text-2xl lg:text-3xl font-bold text-gray-800 mb-3"
											style={{ fontFamily: "Montserrat, sans-serif" }}
										>
											Sign in with Email
										</h2>

										{/* Description */}
										<p className="text-gray-600 text-sm lg:text-base"
											style={{ fontFamily: "Montserrat, sans-serif" }}
										>
											Enter your email and password to access your account.
										</p>
									</div>
									
									{/* Login Form */}
									<div className="mt-6 sm:mt-8">
										<form className="space-y-4 sm:space-y-6" onSubmit={handleSubmit}>
											{error && (
												<div className="bg-red-50 border border-red-200 text-red-600 px-4 py-3 rounded-lg text-sm">
													{error}
												</div>
											)}
											<div>
												<label htmlFor="email" className="block text-sm font-medium text-gray-700 mb-1">
													Email Address
												</label>
												<input
													type="email"
													id="email"
													name="email"
													className="w-full px-4 py-3 rounded-lg border border-gray-300 focus:ring-2 focus:ring-[#0C0051] focus:border-transparent transition-all duration-200"
													placeholder="Enter your email"
													required
													disabled={isLoading}
												/>
											</div>
											<div>
												<label htmlFor="password" className="block text-sm font-medium text-gray-700 mb-1">
													Password
												</label>
												<div className="relative">
													<input
													type={isPasswordVisible ? "text" : "password"} // Toggles between text and password
													id="password"
													name="password"
													className="w-full px-4 py-3 rounded-lg border border-gray-300 focus:ring-2 focus:ring-[#0C0051] focus:border-transparent transition-all duration-200"
													placeholder="Enter your password"
													required
													disabled={isLoading}
													/>
													<button
													type="button"
													onClick={togglePasswordVisibility}
													className="absolute inset-y-0 right-2 flex items-center text-gray-500"
													>
													{isPasswordVisible ? (
														<Eye className="h-5 w-5" /> // Lucide Eye icon for visible password
													) : (
														<EyeOff className="h-5 w-5" /> // Lucide EyeOff icon for hidden password
													)}
													</button>
												</div>
											</div>
											<div className="flex flex-col sm:flex-row sm:items-center sm:justify-between space-y-2 sm:space-y-0">
											<div className="flex items-center">
												<input
													id="remember-me"
													name="remember-me"
													type="checkbox"
													className="h-4 w-4 text-gray-400 focus:ring-[#0C0051] border-gray-300 rounded" // Updated text-gray-400 for light gray color
													disabled={isLoading}
												/>
												<label htmlFor="remember-me" className="ml-2 block text-sm text-gray-700">
													Remember me
												</label>
											</div>
												<div className="text-sm">
													<a href="#" className="font-medium text-[#0C0051] hover:text-[#0A0041]">
														Forgot password?
													</a>
												</div>
											</div>
											<motion.button
												type="submit"
												className="w-full bg-[#0C0051] text-white py-3 px-4 rounded-lg shadow-md hover:shadow-lg transition-all duration-200 hover:bg-[#0A0041] mt-2 flex items-center justify-center cursor-pointer"
												style={{ fontFamily: "Montserrat, sans-serif" }}
												whileHover={{ scale: isLoading ? 1 : 1.02 }}
												whileTap={{ scale: isLoading ? 1 : 0.98 }}
												disabled={isLoading}
												>
												{isLoading ? (
													<>
													<svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
														<circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
														<path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
													</svg>
													Signing in...
													</>
												) : (
													"Sign In"
												)}
											</motion.button>
										</form>
									</div>

									{/* Support Text */}
									<p className="mt-6 sm:mt-8 text-sm text-center text-gray-500 hover:text-gray-600 transition-colors cursor-pointer"
										style={{ fontFamily: "Montserrat, sans-serif" }}
									>
										Need help? Contact our support team for assistance.
									</p>
								</div>
							</div>
						</div>
					</motion.div>
				</motion.div>
			</div>
		</div>
	);
}
  