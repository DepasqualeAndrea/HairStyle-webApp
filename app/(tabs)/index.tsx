import { View, Text, ScrollView } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { t } from '@/lib/i18n';

export default function Home() {
    return (
        <SafeAreaView className="flex-1 bg-bg-primary">
            <ScrollView className="flex-1 px-6">
                <View className="py-6">
                    <Text className="text-h2 text-text-primary font-bold mb-2">
                        {t('home.greeting', { name: 'Guest' })}
                    </Text>
                    <Text className="text-base text-text-secondary">
                        Benvenuto in Hair Style
                    </Text>
                </View>

                {/* Placeholder per contenuti futuri */}
                <View className="bg-bg-secondary rounded-card p-6 mb-4">
                    <Text className="text-xl text-text-primary font-semibold mb-2">
                        {t('home.lastAppointment')}
                    </Text>
                    <Text className="text-text-secondary">
                        {t('home.noAppointments')}
                    </Text>
                </View>

                <View className="bg-bg-secondary rounded-card p-6">
                    <Text className="text-xl text-text-primary font-semibold mb-2">
                        {t('home.popularServices')}
                    </Text>
                    <Text className="text-text-secondary">
                        Caricamento servizi...
                    </Text>
                </View>
            </ScrollView>
        </SafeAreaView>
    );
}
