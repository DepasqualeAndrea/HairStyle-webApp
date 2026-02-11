import React from 'react';
import { View, Text, ScrollView, Image, Pressable } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useBookingStore } from '@/store/booking';
import { MOCK_STAFF } from '@/data/mock';
import { Button } from '@/components/ui/Button';
import { BookingSteps } from '@/components/ui/BookingSteps';
import { useRouter } from 'expo-router';
import { Star } from 'lucide-react-native';

export default function SelectStaff() {
    const router = useRouter();
    const { setStaff, selectedStaff } = useBookingStore();

    const handleSelect = (staff: typeof MOCK_STAFF[0]) => {
        setStaff(staff);
    };

    const handleContinue = () => {
        if (selectedStaff) {
            router.push('/book/datetime');
        }
    };

    return (
        <SafeAreaView className="flex-1 bg-bg-primary">
            <BookingSteps currentStep={3} />

            <View className="flex-1 p-5">
                <Text className="text-h3 text-text-primary font-bold mb-6">
                    Chi preferisci?
                </Text>

            <ScrollView>
                {MOCK_STAFF.map((staff) => {
                    const isSelected = selectedStaff?.id === staff.id;
                    return (
                        <Pressable
                            key={staff.id}
                            onPress={() => handleSelect(staff)}
                            className={`
                bg-bg-secondary rounded-card p-4 mb-4 border-2 flex-row items-center
                ${isSelected ? 'border-accent-pink' : 'border-transparent'}
              `}
                        >
                            <View className="h-16 w-16 bg-bg-tertiary rounded-full mr-4 overflow-hidden items-center justify-center">
                                {/* Placeholder Avatar */}
                                <Text className="text-2xl font-bold text-text-secondary">
                                    {staff.name.charAt(0)}
                                </Text>
                            </View>

                            <View className="flex-1">
                                <Text className="text-lg font-bold text-text-primary">
                                    {staff.name}
                                </Text>
                                <Text className="text-text-secondary text-sm">
                                    {staff.role}
                                </Text>
                                <View className="flex-row items-center mt-1">
                                    <Star size={14} color="#FF4D6D" fill="#FF4D6D" />
                                    <Text className="text-accent-pink ml-1 font-bold">
                                        {staff.rating}
                                    </Text>
                                    <Text className="text-text-secondary text-xs ml-1">
                                        ({staff.reviewCount} recensioni)
                                    </Text>
                                </View>
                            </View>

                            {isSelected && (
                                <View className="h-6 w-6 bg-accent-pink rounded-full items-center justify-center">
                                    <Text className="text-bg-primary font-bold">✓</Text>
                                </View>
                            )}
                        </Pressable>
                    );
                })}
            </ScrollView>

            <Button
                label="Continua"
                onPress={handleContinue}
                disabled={!selectedStaff}
                className="mt-4"
            />
            </View>
        </SafeAreaView>
    );
}
