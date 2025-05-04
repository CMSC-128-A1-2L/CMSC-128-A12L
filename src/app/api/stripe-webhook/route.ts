import { headers } from 'next/headers';
import { NextResponse } from 'next/server';
import Stripe from 'stripe';
import { getEducationRepository } from '@/repositories/donation_repository';
import { getUserRepository } from '@/repositories/user_repository';

export const config = {
  api: {
    bodyParser: false,
  },
};

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY!, {
  apiVersion: '2023-10-16',
});
const webhookSecret = process.env.STRIPE_WEBHOOK_SECRET!;

export async function POST(req: Request) {
  const body = await req.text();
  const signature = headers().get('stripe-signature') as string;

  let event: Stripe.Event;

  try {
    event = stripe.webhooks.constructEvent(
      body,
      signature,
      webhookSecret
    );
  } catch (err) {
    return NextResponse.json({ error: `Webhook Error: ${err instanceof Error ? err.message : 'Unknown error'}` }, { status: 400 });
  }

  if (event.type !== 'checkout.session.completed') {
    return NextResponse.json({ received: true });
  }

  const session = event.data.object as Stripe.Checkout.Session;
  const customerEmail = session.customer_details?.email;
  const amount = session.amount_total ? session.amount_total / 100 : 0; // Convert from cents to dollars
  const metadata = session.metadata || {};
  const eventId = metadata.eventId;

  if (!customerEmail) {
    console.warn('No customer email found in session');
    return NextResponse.json({ received: true });
  }

  // Find user by email
  const userRepo = getUserRepository();
  const user = await userRepo.getUserByEmail(customerEmail);

  if (!user) {
    console.warn(`No user found with email: ${customerEmail}`);
    return NextResponse.json({ received: true });
  }

  const donationRepo = getEducationRepository();
  const donation = {
    donationName: eventId ? "Event Sponsorship" : "Stripe Donation",
    description: "Stripe",
    type: "Cash",
    monetaryValue: amount,
    donorID: [user.id],
    receiveDate: new Date(),
    eventId: eventId || undefined
  };

  // Create the donation record
  const donationId = await donationRepo.createDonation(donation);

  // If this is an event sponsorship, update the sponsorship amount
  if (eventId) {
    await donationRepo.addSponsorshipContribution(eventId, donation);
  }

  return NextResponse.json({ received: true });
}
