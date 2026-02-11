import { useEffect } from 'react';
import { useRouter, useRootNavigationState } from 'expo-router';
import { View, ActivityIndicator } from 'react-native';

export default function Index() {
    const router = useRouter();
    const navigationState = useRootNavigationState();

    useEffect(() => {
        // Aspetta che il router sia pronto prima di navigare
        if (!navigationState?.key) return;

        // Check se l'utente è già loggato (TODO: implementare con Supabase)
        const checkAuth = async () => {
            // Piccolo delay per assicurarsi che tutto sia montato
            await new Promise(resolve => setTimeout(resolve, 100));

            // Per ora simuliamo: se non è loggato, vai a welcome
            // In produzione: controllare supabase.auth.getSession()
            const isLoggedIn = false;

            if (isLoggedIn) {
                router.replace('/(tabs)');
            } else {
                router.replace('/welcome');
            }
        };

        checkAuth();
    }, [navigationState?.key]);

    return (
        <View className="flex-1 bg-bg-primary items-center justify-center">
            <ActivityIndicator size="large" color="#FF4D6D" />
        </View>
    );
}
