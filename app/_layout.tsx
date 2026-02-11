import { Stack } from 'expo-router';
import { StatusBar } from 'expo-status-bar';
import { GestureHandlerRootView } from 'react-native-gesture-handler';
import { StripeAppWrapper } from '@/components/StripeAppWrapper';
import { AuthProvider } from '@/context/auth';

export default function RootLayout() {
    return (
        <GestureHandlerRootView style={{ flex: 1 }}>
            <StripeAppWrapper>
                <AuthProvider>
                    <StatusBar style="light" />
                    <Stack
                        screenOptions={{
                            headerShown: false,
                            contentStyle: { backgroundColor: '#0F0F0F' },
                            animation: 'fade',
                        }}
                    >
                        <Stack.Screen name="index" />
                        <Stack.Screen name="(tabs)" />
                    </Stack>
                </AuthProvider>
            </StripeAppWrapper>
        </GestureHandlerRootView>
    );
}
