import { View, Text } from 'react-native';
import { Link } from 'expo-router';
import { t } from '@/lib/i18n';

export default function Index() {
    return (
        <View className="flex-1 bg-bg-primary items-center justify-center px-6">
            <Text className="text-h1 text-accent-gold mb-4 text-center font-bold">
                Hair Style
            </Text>
            <Text className="text-lg text-text-secondary mb-8 text-center">
                {t('common.welcome')}
            </Text>
            <Link
                href="/(tabs)"
                className="bg-accent-gold px-8 py-4 rounded-button"
            >
                <Text className="text-bg-primary font-semibold text-base">
                    {t('common.continue')}
                </Text>
            </Link>
        </View>
    );
}
