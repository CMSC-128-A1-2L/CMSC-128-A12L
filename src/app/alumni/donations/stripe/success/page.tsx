"use client";

import Link from 'next/link';
import { CheckCircle } from 'lucide-react';

export default function StripeDonationSuccess() {
    return (
        <div className="container mx-auto px-4 py-16">
            <div className="bg-white rounded-lg shadow-lg p-8 max-w-2xl mx-auto text-center">
                <div className="flex justify-center mb-6">
                    <CheckCircle className="text-green-500" size={64} />
                </div>
                
                <h1 className="text-3xl font-bold mb-4 text-gray-800">Payment Successful!</h1>
                <p className="text-gray-600 mb-8">
                    Thank you for your donation. Your contribution helps us continue our mission.
                </p>
                
                <Link 
                    href="/donations" 
                    className="inline-block bg-purple-600 hover:bg-purple-700 text-white font-medium py-2 px-6 rounded transition-colors"
                >
                    Return to Donations
                </Link>
            </div>
        </div>
    );
} 