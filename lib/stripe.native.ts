import { Alert } from 'react-native';
import { useStripe } from '@stripe/stripe-react-native';
import { supabase } from './supabase';

// Stripe publishable key (from Expo env)
export const STRIPE_PUBLISHABLE_KEY = process.env.EXPO_PUBLIC_STRIPE_PUBLISHABLE_KEY || '';

/**
 * Hook per gestire i pagamenti Stripe (Native implementation)
 */
export function usePayment() {
    const { initPaymentSheet, presentPaymentSheet } = useStripe();

    /**
     * Inizializza il Payment Sheet di Stripe
     * @param amount Importo in centesimi (es. 5000 = €50.00)
     * @param metadata Metadata opzionali per il payment intent
     */
    const initializePaymentSheet = async (
        amount: number,
        metadata?: Record<string, string>
    ): Promise<string> => {
        try {
            // 1. Chiama Supabase Edge Function per creare Payment Intent
            const { data, error } = await supabase.functions.invoke('create-payment-intent', {
                body: {
                    amount,
                    metadata,
                },
            });

            if (error) throw error;

            if (!data?.clientSecret || !data?.paymentIntentId) {
                throw new Error('Invalid response from payment service');
            }

            // 2. Inizializza Payment Sheet con il client secret
            const { error: initError } = await initPaymentSheet({
                paymentIntentClientSecret: data.clientSecret,
                merchantDisplayName: 'Hair Style',
                applePay: {
                    merchantCountryCode: 'IT',
                },
                googlePay: {
                    merchantCountryCode: 'IT',
                    testEnv: __DEV__,
                },
                style: 'automatic', // Dark mode supportato automaticamente
                defaultBillingDetails: {
                    // Puoi pre-compilare con i dati dell'utente se disponibili
                },
            });

            if (initError) throw initError;

            return data.paymentIntentId;
        } catch (error: any) {
            console.error('Payment initialization error:', error);
            throw new Error(error.message || 'Failed to initialize payment');
        }
    };

    /**
     * Presenta il Payment Sheet all'utente
     * @returns Oggetto con success flag e canceled flag
     */
    const processPayment = async (): Promise<{ success: boolean; canceled?: boolean }> => {
        try {
            const { error } = await presentPaymentSheet();

            if (error) {
                // Se l'utente ha cancellato, non mostrare errore
                if (error.code === 'Canceled') {
                    return { success: false, canceled: true };
                }
                throw error;
            }

            return { success: true };
        } catch (error: any) {
            console.error('Payment processing error:', error);
            throw new Error(error.message || 'Payment failed');
        }
    };

    return { initializePaymentSheet, processPayment };
}

/**
 * Utility per formattare prezzi in EUR
 * @param cents Importo in centesimi
 * @returns Stringa formattata (es. "€50.00")
 */
export function formatPrice(cents: number): string {
    return `€${(cents / 100).toFixed(2)}`;
}

/**
 * Utility per convertire EUR in centesimi
 * @param euros Importo in euro
 * @returns Importo in centesimi
 */
export function eurosToCents(euros: number): number {
    return Math.round(euros * 100);
}
