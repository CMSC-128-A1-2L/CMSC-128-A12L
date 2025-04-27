"use client";
import { motion } from "framer-motion";
import Link from "next/link";
import { CreditCard, ArrowRight } from "lucide-react";
import Image from "next/image";
import { usePathname } from "next/navigation";
import ConstellationBackground from "@/app/components/constellationBackground";

export default function DonationsPage() {
  const pathname = usePathname();
  
  const paymentOptions = [
    {
      description: "Make donations using Maya, a popular digital payment solution in the Philippines.",
      icon: <Image src="/assets/Maya_logo.svg" alt="Maya Logo" width={100} height={30} className="h-8 w-auto" />,
      path: `${pathname}/maya`,
      color: "from-green-500/20 to-green-600/20",
    },
    {
      description: "Secure international payments powered by Stripe's trusted payment infrastructure.",
      icon: <Image src="/assets/Stripe_logo.svg" alt="Stripe Logo" width={100} height={30} className="h-8 w-auto" />,
      path: `${pathname}/stripe`,
      color: "from-purple-500/20 to-purple-600/20",
    },
  ];

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
              Donations
            </h1>
            <p className="text-xl text-gray-200">
              Support our alumni community initiatives
            </p>
          </motion.div>
        </div>
      </div>

      {/* Main Content */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="grid md:grid-cols-2 gap-6">
          {paymentOptions.map((option, index) => (
            <motion.div
              key={index}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: index * 0.1 }}
            >
              <Link href={option.path}>
                <motion.div 
                  className={`bg-gradient-to-br ${option.color} p-6 rounded-xl border border-white/10 hover:border-white/20 transition-all duration-300 h-full`}
                  whileHover={{ y: -5 }}
                  transition={{ type: "spring", stiffness: 400, damping: 10 }}
                >
                  <div className="h-full flex flex-col">
                    <div className="flex items-center mb-4">
                      <div className="p-3">
                        {option.icon}
                      </div>
                    </div>
                    <p className="text-gray-200 mb-6 flex-grow">{option.description}</p>
                    <div className="flex items-center text-white font-medium">
                      <div className="relative group">
                        <span className="mr-2">Get Started</span>
                        <span className="absolute -bottom-1 left-0 w-0 h-0.5 bg-white transition-all duration-300 group-hover:w-full"></span>
                        <ArrowRight className="w-5 h-5 ml-2 inline-block" />
                      </div>
                    </div>
                  </div>
                </motion.div>
              </Link>
            </motion.div>
          ))}
        </div>

        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.5, delay: 0.4 }}
          className="mt-12 text-center"
        >
          <p className="text-sm text-gray-300">
            All transactions are secure and encrypted. Your payment information is never stored on our servers.
          </p>
        </motion.div>
      </div>
    </div>
  );
} 