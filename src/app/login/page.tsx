"use client"
import SignIn from "@/app/components/sign_in"; 
import EmailSignUp from "@/app/components/email_signup";
import { motion } from 'framer-motion';
import Image from 'next/image';

// Letter animation variants
const letterVariants = {
	hidden: { opacity: 0, y: 50 },
	visible: (i: number) => ({
		opacity: 1,
		y: 0,
		transition: {
			delay: 0.5 + i * 0.1,
			duration: 0.5,
			ease: [0.2, 0.65, 0.3, 0.9],
		},
	}),
};

export default function Login() {
	return (
		<div className="min-h-screen flex items-center justify-center bg-gray-100 px-4 relative overflow-hidden">
			{/* Animated Background */}
			<motion.div
				className="absolute inset-0 z-0"
				initial={{ opacity: 0 }}
				animate={{ opacity: 1 }}
				transition={{ duration: 1 }}
			>
				<motion.div
					className="absolute inset-0"
					style={{
						backgroundImage: "url('/assets/bg.jpg')",
						backgroundSize: "cover",
						backgroundPosition: "center",
					}}
				/>
				<motion.div
					className="absolute inset-0 bg-gradient-to-r from-[#0C0051]/30 via-transparent to-[#0C0051]/30"
					animate={{
						backgroundPosition: ["0% 50%", "100% 50%", "0% 50%"],
					}}
					transition={{
						duration: 15,
						repeat: Infinity,
						ease: "linear",
					}}
				/>
			</motion.div>

			{/* Main Content */}
			<motion.div 
				className="w-full max-w-4xl flex flex-col md:flex-row shadow-lg overflow-hidden relative z-10"
				initial={{ y: 20, opacity: 0 }}
				animate={{ y: 0, opacity: 1 }}
				transition={{ duration: 0.8, delay: 0.4 }}
			>
				
				{/* Left Section with Logo Animation */}
				<motion.div
					initial={{ x: -100, opacity: 0 }}
					animate={{ x: 0, opacity: 1 }}
					transition={{ duration: 0.8, ease: "easeOut" }}
					className="flex flex-col items-center justify-center p-6 w-full md:w-[50%] h-[510px] relative"
					style={{ backgroundColor: "rgba(11, 1, 67, 0.8)" }}
				>
					{/* Logo Animation Container */}
					<motion.div
						className="relative w-48 h-48 mb-8"
						initial={{ scale: 0 }}
						animate={{ scale: 1 }}
						transition={{ duration: 1, delay: 0.5 }}
					>
						{/* Logo with Animation */}
						<motion.div
							className="absolute inset-0"
							initial={{ rotateX: 90 }}
							animate={{ rotateX: 0 }}
							transition={{ duration: 1.5, delay: 0.8 }}
						>
							<motion.div
								className="relative w-full h-full"
								initial={{ opacity: 0 }}
								animate={{ opacity: 1 }}
								transition={{ duration: 1, delay: 1.2 }}
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
						transition={{ duration: 0.8, delay: 2.5, ease: "easeOut" }}
						className="text-2xl lg:text-3xl font-bold text-center text-white mb-2 lg:mb-4"
						style={{ fontFamily: "Montserrat, sans-serif" }}
					>
						Lorem Ipsum Dolor Sit Amet
					</motion.h2>
					<motion.p
						initial={{ y: 20, opacity: 0 }}
						animate={{ y: 0, opacity: 1 }}
						transition={{ duration: 0.8, delay: 2.7, ease: "easeOut" }}
						className="text-white/70 text-sm lg:text-base"
						style={{ fontFamily: "Montserrat, sans-serif" }}
					>
						Connect with your alma mater.
					</motion.p>
				</motion.div>

				{/* Right Section */}
				<motion.div
					initial={{ x: 100, opacity: 0 }}
					animate={{ x: 0, opacity: 1 }}
					transition={{ duration: 0.8, delay: 2.5, ease: "easeOut" }}
					className="w-full md:w-[65%] p-8 lg:p-12 text-[#0C0051] flex flex-col justify-start"
					style={{ backgroundColor: "rgba(255, 255, 255, 0.5)" }}  
				>
					<div className="mb-8">
						{/* Welcome Heading */}
						<motion.h2
							initial={{ y: 20, opacity: 0 }}
							animate={{ y: 0, opacity: 1 }}
							transition={{ duration: 0.8, delay: 2.7, ease: "easeOut" }}
							className="text-2xl lg:text-3xl font-bold text-gray-800 mb-3"
							style={{ fontFamily: "Montserrat, sans-serif" }}
						>
							<div className="flex items-center gap-2">
								<span>Welcome to</span>
								<motion.div 
									initial={{ scale: 0.9, opacity: 0 }} 
									animate={{ scale: 1, opacity: 1 }}
									transition={{ duration: 0.5 }}
									className="h-8 w-[135px] inline-flex items-center pl-1 -mt-1"
								>
									<Image
										src="/assets/AEGIS.svg"
										alt="AEGIS"
										width={135}
										height={32}
										className="object-contain"
									/>
								</motion.div>
							</div>
						</motion.h2>

						{/* Description */}
						<motion.p
							initial={{ y: 20, opacity: 0 }}
							animate={{ y: 0, opacity: 1 }}
							transition={{ duration: 0.8, delay: 2.9, ease: "easeOut" }}
							className="text-gray-600 text-sm lg:text-base"
							style={{ fontFamily: "Montserrat, sans-serif" }}
						>
							<strong>Sign in</strong> to reconnect with fellow alumni, access exclusive resources, and stay connected with your alma mater.
						</motion.p>
					</div>
					
					<motion.div
						initial={{ y: 20, opacity: 0 }}
						animate={{ y: 0, opacity: 1 }}
						transition={{ duration: 0.8, delay: 3.1, ease: "easeOut" }}
						className="mt-12 ml-4 mr-4"
					>
						<SignIn />
						<EmailSignUp/>
					</motion.div>

					{/* Support Text */}
					<motion.p
						initial={{ y: 20, opacity: 0 }}
						animate={{ y: 0, opacity: 1 }}
						transition={{ duration: 0.8, delay: 3.5, ease: "easeOut" }}
						className="mt-8 text-sm text-center text-gray-500 hover:text-gray-600 transition-colors cursor-pointer"
						style={{ fontFamily: "Montserrat, sans-serif" }}
					>
						Need help? Contact our support team for assistance.
					</motion.p>

				</motion.div>
			</motion.div>
		</div>
	);
}
  