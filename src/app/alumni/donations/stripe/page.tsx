"use client";

import Link from 'next/link';
import { ArrowLeft } from 'lucide-react';
import StripeDonate from "@/app/components/stripe_donate";
import { usePathname } from 'next/navigation';
export default function StripeDonation() {
  const pathname = usePathname();
  const parentPath = pathname ? pathname.split('/').slice(0, -1).join('/') : '/alumni/donations';

    return (
        <div className="container mx-auto px-4 py-8">
            <div className="mb-6">
                <Link href={parentPath} className="flex items-center text-purple-600 hover:text-purple-800">
                    <ArrowLeft className="mr-2" size={18} />
                    Back to Donation Options
                </Link>
            </div>
            
            <div className="bg-white rounded-lg shadow-lg p-6 max-w-3xl mx-auto">
                <h1 className="text-2xl font-bold mb-6 text-gray-900">Stripe Payment Donation</h1>
                
                <div className="mb-6">
                    {/* Default Test. (checkout.stripe.com) Uses api/stripe-checkout */}
                    <form action='/api/stripe-checkout' method="POST">
                        <button 
                            type="submit" 
                            role="link"
                            className="bg-purple-600 hover:bg-purple-700 text-white font-medium py-2 px-4 rounded transition-colors"
                        >
                            Donate with Stripe
                        </button>
                    </form>
                </div>
                
                <div className="mt-8 p-4 bg-gray-50 rounded">
                    <h2 className="text-lg font-semibold mb-2 text-gray-900">Alternative Payment Method</h2>
                    <p className="text-gray-600 mb-4">
                        This opens in a new tab and uses Stripe's default success redirect page.
                    </p>
                    <StripeDonate />
                </div>
            </div>
        </div>
    );
} 