"use client";

import { motion } from "framer-motion";
import Image from "next/image";
import Link from "next/link";
import { Montserrat } from "next/font/google";
import { Facebook, Twitter, Youtube } from "lucide-react";

const montserrat = Montserrat({ subsets: ["latin"] });

export default function Footer() {
  return (
    <motion.footer 
      initial={{ opacity: 0 }}
      whileInView={{ opacity: 1 }}
      transition={{ duration: 1 }}
      viewport={{ once: true }}
      className={`bg-[#1a237e] border-t border-white/10 p-8 text-start text-sm text-white ${montserrat.className}`}
    >
      <div className="max-w-7xl mx-auto">
        {/* CAS & UPLB Logos */}
        <motion.div 
          initial={{ y: 20, opacity: 0 }}
          whileInView={{ y: 0, opacity: 1 }}
          transition={{ duration: 0.8 }}
          viewport={{ once: true }}
          className="flex justify-start space-x-5 mb-6"
        >
          <Image 
            src="/assets/ics.png" 
            alt="CAS Logo" 
            width={60} 
            height={60} 
            className="opacity-90 hover:opacity-100 transition-opacity" 
          />
          <Image 
            src="/assets/cas.png" 
            alt="CAS Logo" 
            width={60} 
            height={60} 
            className="opacity-90 hover:opacity-100 transition-opacity" 
          />
          <Image 
            src="/assets/uplb.png" 
            alt="UPLB Logo" 
            width={60} 
            height={60} 
            className="opacity-90 hover:opacity-100 transition-opacity" 
          />
        </motion.div>

        {/* Contact Info */}
        <motion.div 
          initial={{ y: 20, opacity: 0 }}
          whileInView={{ y: 0, opacity: 1 }}
          transition={{ duration: 0.8, delay: 0.2 }}
          viewport={{ once: true }}
          className="space-y-2 text-gray-300 text-base-100"
        >
          <p className="font-bold text-lg">Institute of Computer Science</p>
          <p>College of Arts and Sciences, UPLB Los Baños</p>
          <p>Laguna, Philippines 4031</p>
          <p className="mt-4">(049) 536-2021 | +63-49-536-2322</p>
          <p>ics.uplb@up.edu.ph</p>
          <div className="flex items-center space-x-6 mt-4">
            <Link href="https://www.facebook.com/ICS.UPLB/" target="_blank" className="text-gray-300 hover:text-white transition-colors">
              <Facebook size={20} />
            </Link>
            <Link href="https://ics.uplb.edu.ph/#" target="_blank" className="text-gray-300 hover:text-white transition-colors">
              <Twitter size={20} />
            </Link>
            <Link href="https://www.youtube.com/@ics-uplb" target="_blank" className="text-gray-300 hover:text-white transition-colors">
              <Youtube size={20} />
            </Link>
          </div>
        </motion.div>

        {/* Quick Links and Copyright */}
        <motion.div 
          initial={{ y: 20, opacity: 0 }}
          whileInView={{ y: 0, opacity: 1 }}
          transition={{ duration: 0.8, delay: 0.4 }}
          viewport={{ once: true }}
          className="mt-8 pt-4 border-t border-gray-400/30 text-gray-400 text-xs"
        >
          <div className="flex flex-col md:flex-row md:justify-between md:items-center space-y-4 md:space-y-0">
            <div className="flex flex-wrap gap-x-6 gap-y-2">
              <Link href="/about" className="hover:text-white transition-colors">
                About
              </Link>
              <Link href="/contact" className="hover:text-white transition-colors">
                Contact
              </Link>
              <Link href="/privacy" className="hover:text-white transition-colors">
                Privacy Policy
              </Link>
              <Link href="/terms" className="hover:text-white transition-colors">
                Terms of Service
              </Link>
            </div>
            <div className="text-center md:text-right">
              © {new Date().getFullYear()} AEGIS. All rights reserved.
            </div>
          </div>
        </motion.div>
      </div>
    </motion.footer>
  );
}
