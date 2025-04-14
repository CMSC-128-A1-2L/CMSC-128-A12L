/*
 * This file is for handling the Stripe Checkout sessions for donations
 */

import Stripe from 'stripe'
import { NextResponse } from 'next/server';
import { headers } from 'next/headers';

const stripeSecret = process.env.STRIPE_SECRET_KEY ?? (() => {
    throw new Error("Missing Stripe secret key in .env file")
})();

const stripe = new Stripe(stripeSecret);

export async function POST() {
    try {
        const headersList = await headers();
        const origin = headersList.get('origin');

        // 'price' field is price ID from created Stripe Product
        const session = await stripe.checkout.sessions.create({
            line_items: [
                {
                    price: 'price_1R7CNJQo2B8ACqzDrHuTdLlp',
                    quantity: 1,
                },
            ],
            mode: 'payment',
            success_url: `${origin}/stripe-donation/success?session_id={CHECKOUT_SESSION_ID}`,
            cancel_url:`${origin}/stripe-donation/?canceled=true`,
            
        });
        return NextResponse.redirect(session.url ?? '', 303);
    } catch (error: any) {
        return NextResponse.json(
            { error: error.message },
            { status: error.status || 500 }
        );
    }
}