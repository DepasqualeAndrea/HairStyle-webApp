import React from 'react';
import { View, Text, ScrollView, Pressable } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useBookingStore } from '@/store/booking';
import { MOCK_SERVICES } from '@/data/mock';
import { Button } from '@/components/ui/Button';
import { Badge } from '@/components/ui/Badge';
import { Card } from '@/components/ui/Card';
import { BookingSteps } from '@/components/ui/BookingSteps';
import { useRouter, useLocalSearchParams } from 'expo-router';
import { formatDuration, formatPrice } from '@/utils/booking';
import { Crown, Check } from 'lucide-react-native';

export default function Explore() {
    const router = useRouter();
    const { gender } = useLocalSearchParams<{ gender?: string }>();
    const {
        selectedServices,
        toggleService,
        getTotalPrice,
        getTotalDuration
    } = useBookingStore();

    const totalServices = selectedServices.length;

    // Filtra servizi per genere selezionato
    const filteredServices = gender
        ? MOCK_SERVICES.filter(s => s.gender === gender || s.gender === 'unisex')
        : MOCK_SERVICES;

    // Organizza servizi per categoria
    const capelliServices = filteredServices.filter(s => s.category === 'capelli');
    const barbaServices = filteredServices.filter(s => s.category === 'barba');
    const trattamentiServices = filteredServices.filter(s => s.category === 'trattamenti');
    const stylingServices = filteredServices.filter(s => s.category === 'styling');

    // Servizio consigliato (primo popolare del genere)
    const recommendedService = filteredServices.find(s => s.isPopular);

    const renderServiceItem = (service: typeof MOCK_SERVICES[0]) => {
        const isSelected = selectedServices.some(s => s.id === service.id);

        return (
            <Pressable
                key={service.id}
                onPress={() => toggleService(service)}
                className="mb-3"
            >
                <Card
                    variant={isSelected ? 'outlined' : 'default'}
                    className={`p-4 flex-row items-center ${isSelected ? 'border-accent-pink bg-accent-pink/5' : ''}`}
                >
                    {/* Circular Checkbox */}
                    <View
                        className={`h-6 w-6 rounded-full border-2 mr-4 items-center justify-center ${
                            isSelected
                                ? 'bg-accent-pink border-accent-pink'
                                : 'border-bg-tertiary'
                        }`}
                    >
                        {isSelected && (
                            <Check size={14} color="#0F0F0F" strokeWidth={3} />
                        )}
                    </View>

                    {/* Service Info */}
                    <View className="flex-1">
                        <View className="flex-row items-center mb-1">
                            <Text className={`font-bold text-base ${isSelected ? 'text-accent-pink' : 'text-text-primary'}`}>
                                {service.name}
                            </Text>
                            {service.isPopular && (
                                <Badge label="POPULAR" variant="gold" size="sm" className="ml-2" />
                            )}
                        </View>
                        <Text className="text-text-secondary text-sm mb-2">
                            {service.description}
                        </Text>
                        <View className="flex-row items-center">
                            <Text className="text-text-tertiary text-xs mr-3">
                                ⏱ {formatDuration(service.duration)}
                            </Text>
                            <Text className={`font-bold text-sm ${isSelected ? 'text-accent-pink' : 'text-text-primary'}`}>
                                {formatPrice(service.price)}
                            </Text>
                        </View>
                    </View>
                </Card>
            </Pressable>
        );
    };

    return (
        <SafeAreaView className="flex-1 bg-bg-primary" edges={['top']}>
            {/* Header */}
            <View className="px-5 py-4 bg-bg-primary border-b border-bg-tertiary">
                <Text className="text-h2 text-text-primary font-bold">
                    Scegli i Servizi
                </Text>
                <Text className="text-text-secondary">
                    Seleziona uno o più trattamenti per il tuo appuntamento
                </Text>
            </View>

            {/* Booking Steps */}
            <BookingSteps currentStep={2} />

            <ScrollView
                className="flex-1"
                contentContainerStyle={{ paddingBottom: 120 }}
                showsVerticalScrollIndicator={false}
            >
                {/* Hero Card - Consigliato per Te */}
                {recommendedService && (
                    <View className="px-5 pt-6 pb-4">
                        <Pressable onPress={() => toggleService(recommendedService)}>
                            <Card variant="glass" className="overflow-hidden">
                                {/* Hero Image Placeholder */}
                                <View className="h-44 bg-gradient-to-b from-accent-pink/20 to-bg-secondary items-center justify-center relative">
                                    <Crown size={48} color="#FF4D6D" />
                                    <View className="absolute top-3 left-3">
                                        <Badge label="CONSIGLIATO PER TE" variant="gold" size="md" />
                                    </View>
                                </View>

                                {/* Hero Content */}
                                <View className="p-5">
                                    <Text className="text-text-primary font-bold text-xl mb-2">
                                        {recommendedService.name}
                                    </Text>
                                    <Text className="text-text-secondary text-sm mb-4">
                                        {recommendedService.description}
                                    </Text>
                                    <View className="flex-row items-center justify-between">
                                        <View className="flex-row items-center">
                                            <Text className="text-text-tertiary text-sm mr-4">
                                                ⏱ {formatDuration(recommendedService.duration)}
                                            </Text>
                                            <Text className="text-accent-pink font-bold text-lg">
                                                {formatPrice(recommendedService.price)}
                                            </Text>
                                        </View>
                                        <View
                                            className={`h-8 w-8 rounded-full border-2 items-center justify-center ${
                                                selectedServices.some(s => s.id === recommendedService.id)
                                                    ? 'bg-accent-pink border-accent-pink'
                                                    : 'border-accent-pink'
                                            }`}
                                        >
                                            {selectedServices.some(s => s.id === recommendedService.id) && (
                                                <Check size={16} color="#0F0F0F" strokeWidth={3} />
                                            )}
                                        </View>
                                    </View>
                                </View>
                            </Card>
                        </Pressable>
                    </View>
                )}

                {/* Capelli Section */}
                {capelliServices.length > 0 && (
                    <View className="px-5 pt-4">
                        <View className="flex-row items-center mb-4">
                            <View className="h-1 w-1 rounded-full bg-accent-pink mr-2" />
                            <Text className="text-text-primary font-bold text-lg uppercase tracking-wider">
                                Capelli
                            </Text>
                            <Text className="text-text-tertiary text-sm ml-2">
                                ({capelliServices.length})
                            </Text>
                        </View>
                        {capelliServices.map(renderServiceItem)}
                    </View>
                )}

                {/* Barba Section */}
                {barbaServices.length > 0 && (
                    <View className="px-5 pt-4">
                        <View className="flex-row items-center mb-4">
                            <View className="h-1 w-1 rounded-full bg-accent-pink mr-2" />
                            <Text className="text-text-primary font-bold text-lg uppercase tracking-wider">
                                Barba
                            </Text>
                            <Text className="text-text-tertiary text-sm ml-2">
                                ({barbaServices.length})
                            </Text>
                        </View>
                        {barbaServices.map(renderServiceItem)}
                    </View>
                )}

                {/* Trattamenti Section */}
                {trattamentiServices.length > 0 && (
                    <View className="px-5 pt-4">
                        <View className="flex-row items-center mb-4">
                            <View className="h-1 w-1 rounded-full bg-accent-pink mr-2" />
                            <Text className="text-text-primary font-bold text-lg uppercase tracking-wider">
                                Trattamenti
                            </Text>
                            <Text className="text-text-tertiary text-sm ml-2">
                                ({trattamentiServices.length})
                            </Text>
                        </View>
                        {trattamentiServices.map(renderServiceItem)}
                    </View>
                )}

                {/* Styling Section */}
                {stylingServices.length > 0 && (
                    <View className="px-5 pt-4">
                        <View className="flex-row items-center mb-4">
                            <View className="h-1 w-1 rounded-full bg-accent-pink mr-2" />
                            <Text className="text-text-primary font-bold text-lg uppercase tracking-wider">
                                Styling
                            </Text>
                            <Text className="text-text-tertiary text-sm ml-2">
                                ({stylingServices.length})
                            </Text>
                        </View>
                        {stylingServices.map(renderServiceItem)}
                    </View>
                )}
            </ScrollView>

            {/* Floating Bottom Bar */}
            {totalServices > 0 && (
                <View className="absolute bottom-0 left-0 right-0 bg-bg-secondary border-t border-bg-tertiary">
                    <View className="px-5 py-4">
                        <View className="flex-row justify-between items-center mb-3">
                            <View>
                                <Text className="text-text-tertiary text-xs mb-1">
                                    {totalServices} {totalServices === 1 ? 'servizio selezionato' : 'servizi selezionati'}
                                </Text>
                                <Text className="text-text-primary font-bold text-2xl">
                                    {formatPrice(getTotalPrice())}
                                </Text>
                            </View>
                            <View className="items-end">
                                <Text className="text-text-tertiary text-xs mb-1">Durata totale</Text>
                                <Text className="text-accent-pink font-semibold text-lg">
                                    {formatDuration(getTotalDuration())}
                                </Text>
                            </View>
                        </View>

                        <Button
                            label="Continua con Staff"
                            onPress={() => router.push('/book/staff')}
                            variant="primary"
                        />
                    </View>
                </View>
            )}
        </SafeAreaView>
    );
}
