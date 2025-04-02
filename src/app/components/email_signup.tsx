"use client"

import { redirect } from "next/navigation"
import { motion } from "framer-motion"

export default function EmailSignUp() {
  return (
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
  )
}
