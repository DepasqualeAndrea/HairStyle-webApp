import React, { useEffect, useState } from 'react';
import { View, Text, ScrollView, Pressable, ActivityIndicator } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Button } from '@/components/ui/Button';
import { BookingSteps } from '@/components/ui/BookingSteps';
import { useRouter } from 'expo-router';
import { useBookingStore } from '@/store/booking';
import { MOCK_SCHEDULE } from '@/data/mock';
import { getAvailableSlots, formatTimeSlot, groupSlotsByHour } from '@/utils/booking';
import { TimeSlot } from '@/types';
import { format } from 'date-fns';
import { it } from 'date-fns/locale';

export default function SelectDateTime() {
    const router = useRouter();
    const { selectedServices, selectedStaff, setTimeSlot, selectedTimeSlot } = useBookingStore();
    const [availableSlots, setAvailableSlots] = useState<TimeSlot[]>([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        // Simuliamo un caricamento API
        const loadSlots = async () => {
            setLoading(true);
            await new Promise(resolve => setTimeout(resolve, 500)); // finto delay

            // Qui chiameremmo l'API Supabase reale
            // Per demo usiamo MOCK_SCHEDULE e getAvailableSlots
            const slots = getAvailableSlots(
                selectedServices,
                MOCK_SCHEDULE,
                15 // intervallo 15 min
            );

            setAvailableSlots(slots);
            setLoading(false);
        };

        loadSlots();
    }, [selectedServices, selectedStaff]);

    const handleSelectSlot = (slot: TimeSlot) => {
        setTimeSlot(slot);
    };

    const handleContinue = () => {
        if (selectedTimeSlot) {
            router.push('/book/checkout');
        }
    };

    const groupedSlots = groupSlotsByHour(availableSlots);

    return (
        <SafeAreaView className="flex-1 bg-bg-primary">
            <BookingSteps currentStep={4} />

            <ScrollView className="flex-1 p-5">
                <Text className="text-h2 text-text-primary font-bold mb-2">
                    Scegli Orario
                </Text>
                <Text className="text-text-secondary mb-6">
                    Disponibilità per {selectedStaff?.name} oggi ({outputDate()})
                </Text>

                {loading ? (
                    <ActivityIndicator size="large" color="#FF4D6D" className="mt-10" />
                ) : availableSlots.length === 0 ? (
                    <View className="items-center mt-10">
                        <Text className="text-text-secondary text-lg">Nessun orario disponibile per oggi.</Text>
                        <Button label="Cambia Data" variant="outline" className="mt-4" onPress={() => alert('Feature calendario prossimamente!')} />
                    </View>
                ) : (
                    Object.entries(groupedSlots).map(([hour, slots]) => (
                        <View key={hour} className="mb-6">
                            <Text className="text-text-primary font-bold text-lg mb-3 pl-1">
                                {hour}
                            </Text>
                            <View className="flex-row flex-wrap">
                                {slots.map((slot, index) => {
                                    const isSelected = selectedTimeSlot?.startTime.getTime() === slot.startTime.getTime();
                                    return (
                                        <Pressable
                                            key={index}
                                            onPress={() => handleSelectSlot(slot)}
                                            className={`
                        mb-3 mr-3 px-4 py-3 rounded-xl border min-w-[80px] items-center justify-center
                        ${isSelected
                                                    ? 'bg-accent-pink border-accent-pink'
                                                    : 'bg-bg-secondary border-bg-tertiary active:bg-bg-tertiary'}
                      `}
                                        >
                                            <Text className={`font-medium ${isSelected ? 'text-bg-primary font-bold' : 'text-text-primary'}`}>
                                                {formatTimeSlot(slot)}
                                            </Text>
                                        </Pressable>
                                    );
                                })}
                            </View>
                        </View>
                    ))
                )}
            </ScrollView>

            <View className="p-5 border-t border-bg-tertiary bg-bg-primary">
                <Button
                    label="Continua al Checkout"
                    onPress={handleContinue}
                    disabled={!selectedTimeSlot}
                />
            </View>
        </SafeAreaView>
    );
}

function outputDate() {
    return format(new Date(), 'EEEE d MMMM', { locale: it });
}
