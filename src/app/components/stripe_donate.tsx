/*
 * This file contains the stripe-buy-button component. 
 * Check https://docs.stripe.com/payment-links/buy-button for more info.
 */

"use client";

import { useEffect } from "react";

export default function StripeDonate() {
    useEffect(() => {
        const script = document.createElement('script');
        script.src = 'https://js.stripe.com/v3/buy-button.js';
        script.async = true;
        script.onload = () => {
            console.log('Stripe Buy Button script is loaded!');
        }
        document.body.appendChild(script);
    }, []);
    
    return (
        <>  
            {/* Uncomment component to use. Shows error on my end (Property 'stripe-buy-button' does not exist on type 'JSX.IntrinsicElements), but is functional. */}
            {/* <stripe-buy-button
                buy-button-id="buy_btn_1R7nVbQo2B8ACqzD3UV3kyR2"
                publishable-key="pk_test_51R6PDDQo2B8ACqzDiS7AWgpoEboAUhQA0lbTJwEe1yU8z9oFCiKu3U3RjdEfIRpwWcindN2ERbyYH4Sq9yWg9RJx00E6Z7RJ90"
                >
            </stripe-buy-button> */}
        </>
    );
}