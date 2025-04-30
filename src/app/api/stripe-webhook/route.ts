import { NextResponse } from 'next/server';
import Stripe from 'stripe';
import { getEducationRepository } from '@/repositories/donation_repository';
import { getUserRepository } from '@/repositories/user_repository'; 

export const config = {
  api: {
    bodyParser: false,
  },
};

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY!);
const endpointSecret = process.env.STRIPE_WEBHOOK_SECRET!;

export async function POST(req: Request) {
  const buf = await req.arrayBuffer();
  const body = Buffer.from(buf);
  const sig = req.headers.get('stripe-signature');

  let event: Stripe.Event;

  try {
    event = stripe.webhooks.constructEvent(body, sig!, endpointSecret);
  } catch (err: any) {
    console.error('Webhook signature verification failed.', err.message);
    return new NextResponse(`Webhook Error: ${err.message}`, { status: 400 });
  }

  // succesful payment
  if (event.type === 'checkout.session.completed') {
    const session = event.data.object as Stripe.Checkout.Session;

    const amount = (session.amount_total ?? 0) / 100;
    const customerEmail = session.customer_details?.email;

    if (!customerEmail) {
      console.warn('No email found in Stripe session.');
      return NextResponse.json({ received: true });
    }

    const userRepo = getUserRepository();
    const user = await userRepo.getUserByEmail(customerEmail);

    if (!user) {
      console.warn(`No user found with email: ${customerEmail}`);
      return NextResponse.json({ received: true });
    }

    const donationRepo = getEducationRepository();
    await donationRepo.createDonation({
      donationName: 'Stripe Donation',
      description: 'stripe',
      type: 'Cash',
      monetaryValue: amount,
      donorID: [user.id], 
      receiveDate: new Date(),
    });
  }

  return NextResponse.json({ received: true });
}
