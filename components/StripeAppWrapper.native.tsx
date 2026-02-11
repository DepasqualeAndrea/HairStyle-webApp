import React from 'react';
import { StripeProvider } from '@stripe/stripe-react-native';
import { STRIPE_PUBLISHABLE_KEY } from '@/lib/stripe.native';

export function StripeAppWrapper({ children }: { children: React.ReactNode }) {
    return (
        <StripeProvider publishableKey={STRIPE_PUBLISHABLE_KEY}>
            {children}
        </StripeProvider>
    );
}
