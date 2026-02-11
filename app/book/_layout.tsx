import { Stack } from 'expo-router';

export default function BookingLayout() {
    return (
        <Stack
            screenOptions={{
                headerStyle: {
                    backgroundColor: '#0F0F0F',
                },
                headerTintColor: '#FFFFFF',
                headerTitleStyle: {
                    fontWeight: 'bold',
                },
                contentStyle: {
                    backgroundColor: '#0F0F0F',
                },
                animation: 'slide_from_right',
            }}
        >
            <Stack.Screen name="staff" options={{ title: 'Scegli Barbiere' }} />
            <Stack.Screen name="datetime" options={{ title: 'Data e Ora' }} />
            <Stack.Screen name="checkout" options={{ title: 'Riepilogo' }} />
        </Stack>
    );
}
