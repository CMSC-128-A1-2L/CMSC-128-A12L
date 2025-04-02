/*
 * Stripe Test Donation Page.
 */

"use client";

import StripeDonate from "../components/stripe_donate";

export default function StripeDonation() {
    return (
        <>  
            <h1>
                Test Stripe Donate Page
            </h1>
            
            {/* Default Test. (checkout.stripe.com) Uses api/stripe-checkout */}
            <form action='/api/stripe-checkout' method="POST">
                <section>
                    <button type="submit" role="link">
                        Donate
                    </button>
                </section>
            </form>

            {/* Alt test. Opens new tab (buy.stripe.com) still has Stripe's default success redirect page */}
            {/* <StripeDonate></StripeDonate> */}
        </>
    );
}