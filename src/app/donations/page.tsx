"use client";
import { motion } from "framer-motion";
import Link from "next/link";
import { CreditCard, ArrowRight } from "lucide-react";
import Image from "next/image";

export default function DonationsPage() {
  const paymentOptions = [
    {
      description: "Make donations using Maya, a popular digital payment solution in the Philippines.",
      icon: <Image src="/assets/Maya_logo.svg" alt="Maya Logo" width={100} height={30} className="h-8 w-auto " />,
      path: "/donations/maya",
      color: "from-green-500 to-green-600",
    },
    {
      description: "Secure international payments powered by Stripe's trusted payment infrastructure.",
      icon: <Image src="/assets/Stripe_logo.svg" alt="Stripe Logo" width={100} height={30} className="h-8 w-auto" />,
      path: "/donations/stripe",
      color: "from-purple-500 to-purple-600",
    },
  ];

  return (
    <div className="w-full max-w-4xl mx-auto px-4">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="text-center mb-12"
      >
        <h1 className="text-4xl font-bold text-gray-900 mb-4">Support Our Cause</h1>
        <p className="text-lg text-gray-600 max-w-2xl mx-auto">
          Your generous donations help us continue our mission and make a difference in the lives of many.
          Choose your preferred payment method below to contribute.
        </p>
      </motion.div>

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
                className={`bg-gradient-to-br ${option.color} p-6 rounded-xl shadow-lg hover:shadow-xl transition-shadow duration-300 h-full`}
                whileHover={{ y: -5 }}
                transition={{ type: "spring", stiffness: 400, damping: 10 }}
              >
                <div className="bg-white rounded-lg p-6 h-full flex flex-col">
                  <div className="flex items-center mb-4">
                    <div className="p-3 rounded-lg">
                      {option.icon}
                    </div>
                  </div>
                  <p className="text-gray-600 mb-6 flex-grow">{option.description}</p>
                  <div className="flex items-center text-[#1a1f4d] font-medium">
                    <div className="relative group">
                      <span className="mr-2">Get Started</span>
                      <span className="absolute -bottom-1 left-0 w-0 h-0.5 bg-[#1a1f4d] transition-all duration-300 group-hover:w-full"></span>
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
        <p className="text-sm text-gray-500">
          All transactions are secure and encrypted. Your payment information is never stored on our servers.
        </p>
      </motion.div>
    </div>
  );
} 