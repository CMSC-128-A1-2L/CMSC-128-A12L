'use client';

import { useState } from 'react';
import Link from 'next/link';
import { ArrowLeft } from 'lucide-react';
import { usePathname } from 'next/navigation';

export default function MayaDonationPage() {
  const [data, setData] = useState<any>(null);
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const pathname = usePathname();
  // Get the parent path by removing the last segment
  const parentPath = pathname ? pathname.split('/').slice(0, -1).join('/') : '/alumni/donations';

  const testMayaAPI = async () => {
    setLoading(true);
    setError(null);
    setData(null);
    try {
      // Send a POST request to the unified API route for checkout and simulated invoice.
      const res = await fetch('/api/maya-checkout', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          "description": "Donation for XYZ",
          "totalAmount": { "value": 1000, "currency": "PHP" },
          "invoiceNumber": "INV0001",
          "type": "SINGLE", // or "OPEN" if desired
          "items": [
            { 
              "name": "Donation", 
              "quantity": "1", 
              "amount": { "value": 1000, "currency": "PHP" },
              "totalAmount": { "value": 1000, "currency": "PHP" }
            }
          ],
          "requestReferenceNumber": `TEST-${Date.now()}`,
          "redirectUrl": {
            "success": "https://example.com/success",
            "failure": "https://example.com/failure",
            "cancel": "https://example.com/cancel"
          },
          "metadata": {
            "customField": "Custom Value"
          }
        })
      });
      const responseData = await res.json();
      setData(responseData);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'An error occurred');
    }
    setLoading(false);
  };

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="mb-6">
        <Link href={parentPath} className="flex items-center text-blue-600 hover:text-blue-800">
          <ArrowLeft className="mr-2" size={18} />
          Back to Donation Options
        </Link>
      </div>
      
      <div className="bg-white rounded-lg shadow-lg p-6 max-w-3xl mx-auto">
        <h1 className="text-2xl font-bold mb-6 text-gray-900">Maya Payment Donation</h1>
        
        <div className="mb-6">
          <button 
            onClick={testMayaAPI} 
            disabled={loading}
            className="bg-blue-600 hover:bg-blue-700 text-white font-medium py-2 px-4 rounded transition-colors disabled:opacity-50"
          >
            {loading ? 'Processing...' : 'Donate with Maya'}
          </button>
        </div>

        {error && (
          <div className="bg-red-50 border border-red-200 text-red-700 p-4 rounded mb-6">
            <h2 className="font-semibold mb-2">Error:</h2>
            <p>{error}</p>
          </div>
        )}

        {data && (
          <div className="space-y-6">
            <div className="bg-gray-50 p-4 rounded">
              <h2 className="font-semibold mb-2">Checkout Response:</h2>
              <pre className="overflow-auto p-2 bg-gray-100 rounded text-sm">{JSON.stringify(data.checkout, null, 2)}</pre>
            </div>
            <div className="bg-gray-50 p-4 rounded">
              <h2 className="font-semibold mb-2">Simulated Invoice Response:</h2>
              <pre className="overflow-auto p-2 bg-gray-100 rounded text-sm">{JSON.stringify(data.invoice, null, 2)}</pre>
            </div>
          </div>
        )}
      </div>
    </div>
  );
} 