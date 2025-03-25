'use client';

import { useState } from 'react';

export default function MayaDonationPage() {
  const [response, setResponse] = useState<any>(null);
  const [error, setError] = useState<string | null>(null);
  const [invoices, setInvoices] = useState<any>(null);

  const testMayaAPI = async () => {
    try {
      // Call the checkout API route
      const checkoutRes = await fetch('/api/maya-checkout', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          "description": "A ONE TWO EL DESCRIPTION",
          "totalAmount": {
            "value": 1000,
            "currency": "PHP"
          },
          "requestReferenceNumber": `TEST-${Date.now()}`,
          "redirectUrl": {
            "success": "https://example.com/success",
            "failure": "https://example.com/failure",
            "cancel": "https://example.com/cancel"
          }
        })
      });
      const checkoutData = await checkoutRes.json();
      setResponse(checkoutData);

      // Call the invoice API route
      const invoiceRes = await fetch('/api/maya-invoice');
      const invoiceData = await invoiceRes.json();
      setInvoices(invoiceData);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'An error occurred');
    }
  };

  return (
    <div>
      <h1>Maya Payment API Test</h1>
      <button onClick={testMayaAPI}>Test API</button>

      {error && (
        <div>
          <h2>Error:</h2>
          <p>{error}</p>
        </div>
      )}

      {response && (
        <div>
          <h2>Checkout Response:</h2>
          <pre>{JSON.stringify(response, null, 2)}</pre>
        </div>
      )}

      {invoices && (
        <div>
          <h2>Invoices Response:</h2>
          <pre>{JSON.stringify(invoices, null, 2)}</pre>
        </div>
      )}
    </div>
  );
}