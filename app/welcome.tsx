import React, { useEffect } from 'react';
import { View, Text, ImageBackground } from 'react-native';
import { useRouter } from 'expo-router';
import { Scissors } from 'lucide-react-native';

export default function WelcomeSplash() {
    const router = useRouter();

    useEffect(() => {
        // Auto-advance dopo 2 secondi
        const timer = setTimeout(() => {
            router.replace('/onboarding');
        }, 2000);

        return () => clearTimeout(timer);
    }, []);

    return (
        <View className="flex-1 bg-bg-primary items-center justify-center">
            {/* Logo con forbici */}
            <View className="h-24 w-24 rounded-full bg-bg-secondary items-center justify-center border-2 border-accent-pink/30 mb-6">
                <Scissors size={40} color="#FF4D6D" />
            </View>

            {/* Brand Name */}
            <Text className="text-h1 text-text-primary font-bold mb-2">
                Hair Style
            </Text>

            {/* Tagline */}
            <Text className="text-text-secondary text-lg tracking-[4px] uppercase">
                Esperienza Unica
            </Text>
        </View>
    );
}
