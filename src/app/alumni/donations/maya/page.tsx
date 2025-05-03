'use client';

import { useState } from 'react';
import { motion } from "framer-motion";
import Link from 'next/link';
import { ArrowLeft } from 'lucide-react';
import { usePathname } from 'next/navigation';
import ConstellationBackground from "@/app/components/constellationBackground";

export default function MayaDonationPage() {
  const [data, setData] = useState<any>(null);
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const [donationAmount, setDonationAmount] = useState<string>('1000');
  const pathname = usePathname();
  const parentPath = pathname ? pathname.split('/').slice(0, -1).join('/') : '/alumni/donations';

  const testMayaAPI = async () => {
    const amount = parseFloat(donationAmount);
    if (isNaN(amount) || amount <= 0) {
      setError('Please enter a valid donation amount');
      return;
    }

    setLoading(true);
    setError(null);
    setData(null);
    try {
      const res = await fetch('/api/maya-checkout', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          "description": "Donation for Alumni Community",
          "totalAmount": { "value": amount, "currency": "PHP" },
          "invoiceNumber": `DON-${Date.now()}`,
          "type": "SINGLE",
          "items": [
            { 
              "name": "Alumni Community Donation", 
              "quantity": "1", 
              "amount": { "value": amount, "currency": "PHP" },
              "totalAmount": { "value": amount, "currency": "PHP" }
            }
          ],
          "requestReferenceNumber": `DON-${Date.now()}`,
          "redirectUrl": {
            "success": `${window.location.origin}/alumni/donations/maya/success`,
            "failure": `${window.location.origin}/alumni/donations/maya/failure`,
            "cancel": `${window.location.origin}/alumni/donations/maya/failure`
          },
          "metadata": {
            "type": "donation",
            "source": "alumni_portal"
          }
        })
      });
      const responseData = await res.json();
      if (responseData.checkout?.redirectUrl) {
        window.location.href = responseData.checkout.redirectUrl;
      } else {
        setData(responseData);
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : 'An error occurred');
    }
    setLoading(false);
  };

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
              Maya Payment
            </h1>
            <p className="text-xl text-gray-200">
              Secure local payments
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
          className="bg-gradient-to-br from-green-500/20 to-green-600/20 p-8 rounded-xl border border-white/10 max-w-3xl mx-auto"
        >
          <div className="mb-6">
            <Link href={parentPath} className="flex items-center text-white hover:text-gray-200">
              <ArrowLeft className="mr-2" size={18} />
              Back to Donation Options
            </Link>
          </div>
          
          <div className="mb-8">
            <h2 className="text-2xl font-bold mb-6 text-white">Make a Donation</h2>
            
            <div className="mb-6">
              <label htmlFor="donationAmount" className="block text-white mb-2">
                Amount (PHP)
              </label>
              <input
                type="number"
                id="donationAmount"
                value={donationAmount}
                onChange={(e) => setDonationAmount(e.target.value)}
                min="50"
                step="50"
                className="w-full px-4 py-2 rounded bg-white/10 border border-white/20 text-white focus:outline-none focus:ring-2 focus:ring-green-500"
                placeholder="Enter amount (in multiples of 50)"
              />
            </div>

            <div className="mb-8">
              <button 
                onClick={testMayaAPI} 
                disabled={loading}
                className="bg-green-600 hover:bg-green-700 text-white font-medium py-3 px-6 rounded transition-colors w-full disabled:opacity-50"
              >
                {loading ? 'Processing...' : 'Donate with Maya'}
              </button>
            </div>

            {error && (
              <motion.div
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                className="bg-red-500/20 border border-red-500/30 text-red-200 p-4 rounded mb-6"
              >
                <h2 className="font-semibold mb-2">Error:</h2>
                <p>{error}</p>
              </motion.div>
            )}

            {data && (
              <motion.div
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                className="space-y-6"
              >
                <div className="bg-white/10 p-4 rounded">
                  <h2 className="font-semibold mb-2 text-white">Checkout Response:</h2>
                  <pre className="overflow-auto p-2 bg-white/5 rounded text-sm text-gray-200">{JSON.stringify(data.checkout, null, 2)}</pre>
                </div>
                <div className="bg-white/10 p-4 rounded">
                  <h2 className="font-semibold mb-2 text-white">Invoice Details:</h2>
                  <pre className="overflow-auto p-2 bg-white/5 rounded text-sm text-gray-200">{JSON.stringify(data.invoice, null, 2)}</pre>
                </div>
              </motion.div>
            )}
          </div>
        </motion.div>
      </div>
    </div>
  );
} 