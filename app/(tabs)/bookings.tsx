import { View, Text } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { t } from '@/lib/i18n';

export default function Bookings() {
    return (
        <SafeAreaView className="flex-1 bg-bg-primary">
            <View className="flex-1 px-6 py-6">
                <Text className="text-h2 text-text-primary font-bold mb-4">
                    {t('appointments.title')}
                </Text>
                <Text className="text-text-secondary">
                    I tuoi appuntamenti appariranno qui
                </Text>
            </View>
        </SafeAreaView>
    );
}
