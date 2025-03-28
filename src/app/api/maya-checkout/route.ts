// import { NextResponse } from 'next/server';

// export async function POST(request: Request) {
//   try {
//     const body = await request.json();

//     const response = await fetch('https://pg-sandbox.paymaya.com/checkout/v1/checkouts', {
//       method: 'POST',
//       headers: {
//         'accept': 'application/json',
//         'content-type': 'application/json',
//         'Authorization': 'Basic ' + Buffer.from('pk-eo4sL393CWU5KmveJUaW8V730TTei2zY8zE4dHJDxkF').toString('base64')
//       },
//       body: JSON.stringify(body)
//     });

//     const data = await response.json();
//     return NextResponse.json(data);
//   } catch (error) {
//     return NextResponse.json({ error: 'Failed to create checkout' }, { status: 500 });
//   }
// } 

///////////////////////////////

// import { NextResponse } from 'next/server';

// export async function POST(request: Request) {
//   try {
//     const body = await request.json();

//     // Initiate the checkout request to Maya using the public key
//     const checkoutRes = await fetch('https://pg-sandbox.paymaya.com/checkout/v1/checkouts', {
//       method: 'POST',
//       headers: {
//         'accept': 'application/json',
//         'content-type': 'application/json',
//         'Authorization': 'Basic ' + Buffer.from(process.env.MAYA_PRIMARYKEY!).toString('base64')
//       },
//       body: JSON.stringify(body)
//     });
//     const checkoutData = await checkoutRes.json();

//     // Wait 5 seconds to allow Maya to update the invoice status (adjust if needed)
//     await new Promise(resolve => setTimeout(resolve, 5000));

//     // Fetch the latest invoice details from Maya using the secret key
//     const invoiceRes = await fetch('https://pg-sandbox.paymaya.com/invoice/v2/invoices', {
//       method: 'GET',
//       headers: {
//         'accept': 'application/json',
//         'content-type': 'application/json',
//         'Authorization': 'Basic ' + Buffer.from(process.env.MAYA_SECRETKEY!).toString('base64')
//       }
//     });
//     const invoiceData = await invoiceRes.json();

//     // Return a combined response containing both checkout and invoice details
//     return NextResponse.json({
//       checkout: checkoutData,
//       invoice: invoiceData
//     });
//   } catch (error) {
//     console.error('Error processing checkout and invoice:', error);
//     return NextResponse.json({ error: 'Failed to process checkout and invoice' }, { status: 500 });
//   }
// }


///////////////////////////////

import { NextResponse } from 'next/server';

export async function POST(request: Request) {
  try {
    // Parse the incoming request data (including custom fields)
    const body = await request.json();

    // Call the Maya checkout endpoint using your public key
    const checkoutRes = await fetch('https://pg-sandbox.paymaya.com/checkout/v1/checkouts', {
      method: 'POST',
      headers: {
        'accept': 'application/json',
        'content-type': 'application/json',
        'Authorization': 'Basic ' + Buffer.from(process.env.MAYA_PRIMARYKEY!).toString('base64')
      },
      body: JSON.stringify(body)
    });
    const checkoutData = await checkoutRes.json();

    // Simulate an invoice using the provided data from the checkout payload.
    // This allows you to pass custom values (invoiceNumber, items, metadata, etc.) through.
    const simulatedInvoice = {
      id: "simulated-" + checkoutData.checkoutId,
      invoiceNumber: body.invoiceNumber || "SIMULATED-INVOICE",
      type: body.type || "SINGLE",
      totalAmount: body.totalAmount,
      items: body.items || [],
      requestReferenceNumber: body.requestReferenceNumber,
      merchant: "sandbox-simulated",
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
      completedAt: new Date().toISOString(),
      status: "COMPLETED",
      redirectUrl: body.redirectUrl,
      metadata: body.metadata || {}
    };

    // Return a combined response containing both the actual checkout response and your simulated invoice.
    return NextResponse.json({
      checkout: checkoutData,
      invoice: simulatedInvoice
    });
  } catch (error) {
    console.error('Error processing checkout and invoice:', error);
    return NextResponse.json({ error: 'Failed to process checkout and invoice' }, { status: 500 });
  }
}