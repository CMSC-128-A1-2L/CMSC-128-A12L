import { NextResponse } from 'next/server';
import { Buffer } from 'buffer';
import { getEducationRepository } from '@/repositories/donation_repository';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/app/api/auth/[...nextauth]/route';
import { DonationType } from '@/models/donation';

export async function POST(request: Request) {
  try {
    // Get the current user session
    const session = await getServerSession(authOptions);
    if (!session?.user?.id) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    // Parse the incoming request data
    const body = await request.json();

    // Validate essential fields
    if (!process.env.MAYA_PRIMARYKEY) {
      throw new Error('MAYA_PRIMARYKEY environment variable is not defined');
    }

    // Call the Maya checkout endpoint
    const checkoutRes = await fetch('https://pg-sandbox.paymaya.com/checkout/v1/checkouts', {
      method: 'POST',
      headers: {
        'accept': 'application/json',            
        'content-type': 'application/json',
        'Authorization': 'Basic ' + Buffer.from(process.env.MAYA_PRIMARYKEY).toString('base64'),
      },
      body: JSON.stringify(body),
    });

    // Handle non-200 responses from Maya
    if (!checkoutRes.ok) {
      const errorBody = await checkoutRes.text();
      throw new Error(`PayMaya API Error: ${checkoutRes.status} - ${errorBody}`);
    }

    const checkoutData = await checkoutRes.json();

    // Validate that checkoutId exists
    if (!checkoutData.checkoutId) {
      throw new Error('Missing checkoutId in PayMaya response');
    }

    // Create donation repository
    const donationRepo = getEducationRepository();
    
    const donation = {
      donationName: "Maya Donation",
      description: "Maya",
      type: "Cash" as DonationType,
      monetaryValue: parseFloat(body.totalAmount.value),
      donorID: [session.user.id.toString()], // Current authenticated user as donor
      receiveDate: new Date(),

    };

    // Save donation to database
    const donationId = await donationRepo.createDonation(donation);

    // Simulate an invoice using the data from the checkout payload
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
      metadata: {
        ...body.metadata || {},
        donationId: donationId, // Link the donation record
        donorId: session.user.id // Link the donor
      },
    };

    // Return the combined response
    return NextResponse.json({
      checkout: checkoutData,
      invoice: simulatedInvoice,
      donation: {
        id: donationId,
        ...donation
      }
    });
  } catch (error: any) {
    console.error('Error processing checkout and invoice:', error.message, error.stack);
    return NextResponse.json(
      { error: error.message || 'Failed to process checkout and invoice' },
      { status: 500 }
    );
  }
}
