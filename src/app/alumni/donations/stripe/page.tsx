"use client";

import { motion } from "framer-motion";
import Link from 'next/link';
import { ArrowLeft } from 'lucide-react';
import StripeDonate from "@/app/components/stripe_donate";
import { usePathname, useSearchParams } from 'next/navigation';
import ConstellationBackground from "@/app/components/constellationBackground";

export default function StripeDonation() {
  const pathname = usePathname();
  const searchParams = useSearchParams();
  const parentPath = pathname ? pathname.split('/').slice(0, -1).join('/') : '/alumni/donations';

  // Get event details from URL parameters
  const eventId = searchParams.get('eventId');
  const eventName = searchParams.get('eventName');
  const sponsorshipGoal = searchParams.get('sponsorshipGoal');

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
              {eventId ? 'Event Sponsorship' : 'Stripe Donation'}
            </h1>
            <p className="text-xl text-gray-200">
              {eventId ? `Support ${eventName || 'this event'}` : 'Secure international payments'}
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
          className="bg-gradient-to-br from-purple-500/20 to-purple-600/20 p-8 rounded-xl border border-white/10 max-w-3xl mx-auto"
        >
          <div className="mb-6">
            <Link href={eventId ? `/alumni/events` : parentPath} className="flex items-center text-white hover:text-gray-200">
              <ArrowLeft className="mr-2" size={18} />
              {eventId ? 'Back to Events' : 'Back to Donation Options'}
            </Link>
          </div>
          
          <div className="mb-8">
            <h2 className="text-2xl font-bold mb-6 text-white">
              {eventId ? `Sponsor ${eventName || 'Event'}` : 'Make a Donation'}
            </h2>
            
            <div className="mb-8">
              <form action='/api/stripe-checkout' method="POST">
                <input type="hidden" name="success_url" value={`${window.location.origin}/alumni/donations/stripe/success`} />
                <input type="hidden" name="cancel_url" value={`${window.location.origin}/alumni/donations/stripe/failure`} />
                {eventId && <input type="hidden" name="eventId" value={eventId} />}
                {eventName && <input type="hidden" name="eventName" value={eventName} />}
                {sponsorshipGoal && <input type="hidden" name="sponsorshipGoal" value={sponsorshipGoal} />}
                {eventId && sponsorshipGoal && (
                  <p className="mb-4 text-sm text-gray-300">
                    Sponsorship goal: ₱{parseInt(sponsorshipGoal).toLocaleString()}
                  </p>
                )}
                <button 
                  type="submit" 
                  role="link"
                  className="bg-purple-600 hover:bg-purple-700 text-white font-medium py-3 px-6 rounded transition-colors w-full"
                >
                  {eventId ? 'Sponsor with Stripe' : 'Donate with Stripe'}
                </button>
              </form>
            </div>
            
            <div className="p-6 bg-white/10 rounded-lg">
              <h3 className="text-lg font-semibold mb-2 text-white">Alternative Payment Method</h3>
              <p className="text-gray-200 mb-4">
                This opens in a new tab and uses Stripe's default success redirect page.
              </p>
              <StripeDonate />
            </div>
          </div>
        </motion.div>
      </div>
    </div>
  );
}