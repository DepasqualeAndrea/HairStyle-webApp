import { Alert } from 'react-native';

// Stripe publishable key (from Expo env)
export const STRIPE_PUBLISHABLE_KEY = process.env.EXPO_PUBLIC_STRIPE_PUBLISHABLE_KEY || '';

/**
 * Hook per gestire i pagamenti Stripe (Web implementation)
 */
export function usePayment() {
    const initializePaymentSheet = async (
        amount: number,
        metadata?: Record<string, string>
    ): Promise<string> => {
        console.warn('Stripe Payment Sheet not supported on web yet.');
        Alert.alert('Not Supported', 'Payments are not currently supported on the web version.');
        return '';
    };

    const processPayment = async (): Promise<{ success: boolean; canceled?: boolean }> => {
        console.warn('Stripe Payment Sheet not supported on web yet.');
        Alert.alert('Not Supported', 'Payments are not currently supported on the web version.');
        return { success: false, canceled: true };
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
