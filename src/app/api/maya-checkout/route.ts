import { NextResponse } from 'next/server';
import { Buffer } from 'buffer';
import { getEducationRepository } from '@/repositories/donation_repository';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/app/api/auth/[...nextauth]/route';
import { DonationType } from '@/models/donation';
import { getEventRepository } from '@/repositories/event_repository';

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

    // Get repositories
    const donationRepo = getEducationRepository();
    let event;
    let eventName = '';
    let sponsorship;

    // If eventId is provided, verify event exists and has sponsorship enabled
    if (body.eventId) {
      const eventRepo = getEventRepository();
      event = await eventRepo.getEventById(body.eventId);
      if (!event) {
        throw new Error('Event not found');
      }

      if (!event.sponsorship?.enabled) {
        throw new Error('Sponsorship is not enabled for this event');
      }

      eventName = event.name;
      sponsorship = event.sponsorship;
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

    const amount = parseFloat(body.totalAmount.value);
    
    // Create donation record - conditionally set fields based on whether this is an event sponsorship
    const donation = {
      eventId: body.eventId, // Will be undefined if not an event donation
      donationName: body.eventId ? `Event Sponsorship - ${eventName}` : body.donationName,
      description: body.eventId ? (body.description || `Sponsorship for ${eventName} thru Maya Service`) : body.description,
      type: "Cash" as DonationType,
      monetaryValue: amount,
      donorID: [session.user.id],
      receiveDate: new Date(),
      isEventSponsorship: !!body.eventId, // true only if this is an event sponsorship
      status: 'FAIL' as 'FAIL' // Default to FAIL until payment is confirmed
    };

    // Save donation to database
    const donationId = await donationRepo.createDonation(donation);

    // If this is an event donation, update event sponsorship records
    if (body.eventId && event && sponsorship) {
      const eventRepo = getEventRepository();
      await eventRepo.updateSponsorshipContribution(body.eventId, amount);

      // Update the event's sponsorship record
      const sponsorshipRecord = await donationRepo.getEventSponsorship(body.eventId);
      if (sponsorshipRecord) {
        await donationRepo.addSponsorshipContribution(body.eventId, donation);
      }
    }

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
        donationId: donationId,
        donorId: session.user.id,
        eventId: body.eventId // Will be undefined if not an event donation
      },
    };

    // Return the combined response
    const response: any = {
      checkout: checkoutData,
      invoice: simulatedInvoice,
      donation: {
        id: donationId,
        ...donation
      }
    };

    // Only include event details if this was an event donation
    if (body.eventId && event && sponsorship) {
      response.event = {
        id: event._id,
        name: eventName,
        currentAmount: sponsorship.currentAmount + amount,
        goal: sponsorship.goal
      };
    }

    return NextResponse.json(response);
  } catch (error: any) {
    console.error('Error processing checkout and invoice:', error.message, error.stack);
    return NextResponse.json(
      { error: error.message || 'Failed to process checkout and invoice' },
      { status: 500 }
    );
  }
}
