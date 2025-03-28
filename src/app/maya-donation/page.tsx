// 'use client';

// import { useState } from 'react';

// export default function MayaDonationPage() {
//   const [response, setResponse] = useState<any>(null);
//   const [error, setError] = useState<string | null>(null);
//   const [invoices, setInvoices] = useState<any>(null);

//   const testMayaAPI = async () => {
//     try {
//       // Call the checkout API route
//       const checkoutRes = await fetch('/api/maya-checkout', {
//         method: 'POST',
//         headers: {
//           'Content-Type': 'application/json',
//         },
//         body: JSON.stringify({
//           "description": "A ONE TWO EL DESCRIPTION",
//           "totalAmount": {
//             "value": 1000,
//             "currency": "PHP"
//           },
//           "requestReferenceNumber": `TEST-${Date.now()}`,
//           "redirectUrl": {
//             "success": "https://example.com/success",
//             "failure": "https://example.com/failure",
//             "cancel": "https://example.com/cancel"
//           }
//         })
//       });
//       const checkoutData = await checkoutRes.json();
//       setResponse(checkoutData);

//       // Call the invoice API route
//       const invoiceRes = await fetch('/api/maya-invoice');
//       const invoiceData = await invoiceRes.json();
//       setInvoices(invoiceData);
//     } catch (err) {
//       setError(err instanceof Error ? err.message : 'An error occurred');
//     }
//   };

//   return (
//     <div>
//       <h1>Maya Payment API Test</h1>
//       <button onClick={testMayaAPI}>Test API</button>

//       {error && (
//         <div>
//           <h2>Error:</h2>
//           <p>{error}</p>
//         </div>
//       )}

//       {response && (
//         <div>
//           <h2>Checkout Response:</h2>
//           <pre>{JSON.stringify(response, null, 2)}</pre>
//         </div>
//       )}

//       {invoices && (
//         <div>
//           <h2>Invoices Response:</h2>
//           <pre>{JSON.stringify(invoices, null, 2)}</pre>
//         </div>
//       )}
//     </div>
//   );
// }

////////////////////////////////////////////

// 'use client';

// import { useState } from 'react';

// export default function MayaDonationPage() {
//   const [data, setData] = useState<any>(null);
//   const [error, setError] = useState<string | null>(null);
//   const [loading, setLoading] = useState(false);

//   const testMayaAPI = async () => {
//     setLoading(true);
//     setError(null);
//     setData(null);
//     try {
//       const res = await fetch('/api/maya-checkout', {
//         method: 'POST',
//         headers: { 'Content-Type': 'application/json' },
//         body: JSON.stringify({
//           "description": "A ONE TWO EL DESCRIPTION",
//           "totalAmount": { "value": 1000, "currency": "PHP" },
//           "requestReferenceNumber": `TEST-${Date.now()}`,
//           "redirectUrl": {
//             "success": "https://example.com/success",
//             "failure": "https://example.com/failure",
//             "cancel": "https://example.com/cancel"
//           }
//         })
//       });
//       const responseData = await res.json();
//       setData(responseData);
//     } catch (err) {
//       setError(err instanceof Error ? err.message : 'An error occurred');
//     }
//     setLoading(false);
//   };

//   return (
//     <div>
//       <h1>Maya Payment API Test</h1>
//       <button onClick={testMayaAPI} disabled={loading}>
//         {loading ? 'Processing...' : 'Test API'}
//       </button>

//       {error && (
//         <div>
//           <h2>Error:</h2>
//           <p>{error}</p>
//         </div>
//       )}

//       {data && (
//         <>
//           <div>
//             <h2>Checkout Response:</h2>
//             <pre>{JSON.stringify(data.checkout, null, 2)}</pre>
//           </div>
//           <div>
//             <h2>Invoice Response:</h2>
//             <pre>{JSON.stringify(data.invoice, null, 2)}</pre>
//           </div>
//         </>
//       )}
//     </div>
//   );
// }

///////////////////////////////////////////

'use client';

import { useState } from 'react';

export default function MayaDonationPage() {
  const [data, setData] = useState<any>(null);
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

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
    <div>
      <h1>Maya Payment API Test</h1>
      <button onClick={testMayaAPI} disabled={loading}>
        {loading ? 'Processing...' : 'Test API'}
      </button>

      {error && (
        <div>
          <h2>Error:</h2>
          <p>{error}</p>
        </div>
      )}

      {data && (
        <>
          <div>
            <h2>Checkout Response:</h2>
            <pre>{JSON.stringify(data.checkout, null, 2)}</pre>
          </div>
          <div>
            <h2>Simulated Invoice Response:</h2>
            <pre>{JSON.stringify(data.invoice, null, 2)}</pre>
          </div>
        </>
      )}
    </div>
  );
}
