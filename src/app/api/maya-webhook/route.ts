import { NextResponse } from 'next/server';
import { headers } from 'next/headers';
import { getEducationRepository } from '@/repositories/donation_repository';
import { getEventRepository } from '@/repositories/event_repository';

export const config = {
  api: {
    bodyParser: false,
  },
};

export async function POST(req: Request) {
  try {
    const signature = headers().get('maya-signature');
    const webhookSecret = process.env.MAYA_WEBHOOK_SECRET;

    if (!webhookSecret) {
      throw new Error('Maya webhook secret is not configured');
    }

    if (!signature) {
      return NextResponse.json({ error: 'No signature provided' }, { status: 401 });
    }

    const body = await req.text();
    const payload = JSON.parse(body);

    // Validate webhook payload
    if (!payload.data || !payload.data.requestReferenceNumber) {
      return NextResponse.json({ error: 'Invalid payload' }, { status: 400 });
    }

    // Extract metadata from the reference number
    const [prefix, timestamp, userId] = payload.data.requestReferenceNumber.split('-');
    
    if (prefix !== 'DON') {
      return NextResponse.json({ received: true }); // Ignore non-donation webhooks
    }

    // Process based on payment status
    if (payload.data.status === 'PAYMENT_SUCCESS') {
      const donationRepo = getEducationRepository();
      const eventRepo = getEventRepository();

      // Find the donation by reference number
      const donation = await donationRepo.getDonationByReference(payload.data.requestReferenceNumber);
      
      if (!donation) {
        throw new Error('Donation record not found');
      }

      // Update donation status
      await donationRepo.updateDonationStatus(donation._id!, 'completed');

      // If this was an event sponsorship, update the event's sponsorship amount
      if (donation.eventId) {
        await eventRepo.updateSponsorshipContribution(
          donation.eventId,
          donation.monetaryValue
        );
      }
    }

    return NextResponse.json({ received: true });
  } catch (error) {
    console.error('Error processing Maya webhook:', error);
    return NextResponse.json(
      { error: 'Webhook processing failed' },
      { status: 500 }
    );
  }
}