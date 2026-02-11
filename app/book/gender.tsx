import React from 'react';
import { View, Text, Pressable, Image } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useRouter } from 'expo-router';
import { ArrowLeft, User } from 'lucide-react-native';
import { Card } from '@/components/ui/Card';
import { BookingSteps } from '@/components/ui/BookingSteps';

export default function SelectGender() {
    const router = useRouter();

    const handleSelectGender = (gender: 'uomo' | 'donna') => {
        // Salva la scelta nel query params o nello store
        router.push(`/(tabs)/explore?gender=${gender}`);
    };

    return (
        <SafeAreaView className="flex-1 bg-bg-primary">
            {/* Header */}
            <View className="flex-row items-center px-5 py-4 border-b border-bg-tertiary">
                <Pressable
                    onPress={() => router.back()}
                    className="h-10 w-10 bg-bg-secondary rounded-full items-center justify-center mr-3"
                >
                    <ArrowLeft size={20} color="#FF4D6D" />
                </Pressable>
                <Text className="text-h2 text-text-primary font-bold">Seleziona Categoria</Text>
            </View>

            {/* Booking Steps Indicator */}
            <BookingSteps currentStep={1} />

            <View className="flex-1 px-5 pt-12 justify-center">
                <Text className="text-h1 text-text-primary font-bold text-center mb-4">
                    Per chi è il servizio?
                </Text>
                <Text className="text-text-secondary text-center text-base mb-12">
                    Scegli la categoria per vedere i servizi disponibili
                </Text>

                {/* Gender Cards */}
                <View className="gap-4">
                    {/* UOMO */}
                    <Pressable
                        onPress={() => handleSelectGender('uomo')}
                        className="active:opacity-80"
                    >
                        <Card variant="glass" className="overflow-hidden">
                            <View className="flex-row items-center p-6">
                                <View className="h-20 w-20 bg-blue-500/20 rounded-full items-center justify-center mr-5">
                                    <Text className="text-5xl">👨</Text>
                                </View>
                                <View className="flex-1">
                                    <Text className="text-text-primary font-bold text-2xl mb-2">
                                        Servizi Uomo
                                    </Text>
                                    <Text className="text-text-secondary text-sm">
                                        Tagli, barba, trattamenti e styling maschile
                                    </Text>
                                </View>
                                <View className="h-10 w-10 bg-accent-pink rounded-full items-center justify-center">
                                    <Text className="text-bg-primary text-xl font-bold">→</Text>
                                </View>
                            </View>
                        </Card>
                    </Pressable>

                    {/* DONNA */}
                    <Pressable
                        onPress={() => handleSelectGender('donna')}
                        className="active:opacity-80"
                    >
                        <Card variant="glass" className="overflow-hidden">
                            <View className="flex-row items-center p-6">
                                <View className="h-20 w-20 bg-pink-500/20 rounded-full items-center justify-center mr-5">
                                    <Text className="text-5xl">👩</Text>
                                </View>
                                <View className="flex-1">
                                    <Text className="text-text-primary font-bold text-2xl mb-2">
                                        Servizi Donna
                                    </Text>
                                    <Text className="text-text-secondary text-sm">
                                        Tagli, pieghe, colore, trattamenti e acconciature
                                    </Text>
                                </View>
                                <View className="h-10 w-10 bg-accent-pink rounded-full items-center justify-center">
                                    <Text className="text-bg-primary text-xl font-bold">→</Text>
                                </View>
                            </View>
                        </Card>
                    </Pressable>
                </View>

                {/* Info Card */}
                <Card className="p-4 bg-bg-tertiary/30 mt-8">
                    <Text className="text-text-tertiary text-xs text-center leading-5">
                        💡 Potrai selezionare uno o più servizi dalla categoria scelta.{'\n'}
                        Se hai bisogno di servizi di entrambe le categorie, completa prima una prenotazione e poi creane un'altra.
                    </Text>
                </Card>
            </View>
        </SafeAreaView>
    );
}
