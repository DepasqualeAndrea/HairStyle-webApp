import { useState } from 'react';
import { View, Text, TouchableOpacity, ScrollView, Alert, Platform, StatusBar } from 'react-native';
import { useCartStore } from '@/store/cartStore';
import { useRouter } from 'expo-router';
import { Calendar as CalendarIcon, Clock, ChevronRight } from 'lucide-react-native';
import DateTimePicker, { DateTimePickerEvent } from '@react-native-community/datetimepicker';
import { format, addMinutes, isAfter, startOfToday, setHours, setMinutes } from 'date-fns';

export default function BookingDateScreen() {
    const router = useRouter();
    const { totalDuration, date, time, setDateAndTime } = useCartStore();
    const [selectedDate, setSelectedDate] = useState(new Date());
    const [showDatePicker, setShowDatePicker] = useState(false);

    // Mock Availability Slots (In real app, fetch from Supabase based on selectedDate)
    const generateSlots = () => {
        const slots = [];
        let startTime = setHours(setMinutes(new Date(), 0), 10); // Start at 10:00 AM
        const endTime = setHours(setMinutes(new Date(), 0), 20); // End at 8:00 PM

        while (isAfter(endTime, startTime)) {
            slots.push({
                time: format(startTime, 'HH:mm'),
                available: Math.random() > 0.3, // Random availability for demo
            });
            startTime = addMinutes(startTime, 30); // 30 min slots
        }
        return slots;
    };

    const slots = generateSlots();
    const [selectedSlot, setSelectedSlot] = useState<string | null>(null);

    const onDateChange = (event: DateTimePickerEvent, date?: Date) => {
        const currentDate = date || selectedDate;
        setShowDatePicker(Platform.OS === 'ios');
        setSelectedDate(currentDate);
    };

    const handleConfirm = () => {
        if (!selectedSlot) {
            Alert.alert('Select a Time', 'Please choose a time slot for your appointment.');
            return;
        }
        // Save to store
        // setDateAndTime(format(selectedDate, 'yyyy-MM-dd'), selectedSlot);
        router.push('/checkout');
    };

    return (
        <View className="flex-1 bg-bg-primary px-6 pt-16">
            <StatusBar barStyle="light-content" />

            <View className="flex-row justify-between items-center mb-8">
                <Text className="text-white text-3xl font-display font-bold">Select Date</Text>
                <TouchableOpacity onPress={() => router.back()}>
                    <Text className="text-text-secondary">Back</Text>
                </TouchableOpacity>
            </View>

            {/* Date Picker Trigger */}
            <TouchableOpacity
                className="bg-bg-secondary p-4 rounded-xl flex-row items-center justify-between mb-8 border border-white/10"
                onPress={() => setShowDatePicker(true)}
            >
                <View className="flex-row items-center">
                    <CalendarIcon color="#FF4D6D" size={24} />
                    <Text className="text-white text-lg font-bold ml-4">
                        {format(selectedDate, 'EEEE, MMM d')}
                    </Text>
                </View>
                <Text className="text-accent-pink font-medium">Change</Text>
            </TouchableOpacity>

            {showDatePicker && (
                <DateTimePicker
                    testID="dateTimePicker"
                    value={selectedDate}
                    mode="date"
                    is24Hour={true}
                    display="default"
                    onChange={onDateChange}
                    minimumDate={new Date()}
                    textColor="white"
                    themeVariant="dark"
                />
            )}

            <Text className="text-text-secondary uppercase text-xs tracking-widest mb-4">Available Slots ({totalDuration} min)</Text>

            <ScrollView className="bg-bg-secondary/30 rounded-2xl p-4 border border-white/5 flex-1 mb-24">
                <View className="flex-row flex-wrap justify-between">
                    {slots.map((slot, index) => (
                        <TouchableOpacity
                            key={index}
                            className={`w-28 p-3 rounded-lg border mb-3 flex-row justify-center items-center ${slot.available
                                    ? selectedSlot === slot.time
                                        ? 'bg-accent-pink border-accent-pink'
                                        : 'bg-bg-secondary border-gray-700'
                                    : 'bg-transparent border-transparent opacity-20'
                                }`}
                            disabled={!slot.available}
                            onPress={() => setSelectedSlot(slot.time)}
                        >
                            <Clock size={14} color={selectedSlot === slot.time ? 'white' : '#94A3B8'} />
                            <Text className={`ml-2 font-medium ${selectedSlot === slot.time ? 'text-white' : 'text-text-secondary'}`}>
                                {slot.time}
                            </Text>
                        </TouchableOpacity>
                    ))}
                </View>
            </ScrollView>

            <TouchableOpacity
                className={`absolute bottom-8 left-6 right-6 py-4 rounded-xl items-center flex-row justify-center shadow-lg ${selectedSlot ? 'bg-white shadow-white/10' : 'bg-gray-800 opacity-50'
                    }`}
                disabled={!selectedSlot}
                onPress={handleConfirm}
            >
                <Text className="text-bg-primary font-bold text-lg uppercase tracking-wider mr-2">Continue</Text>
                <ChevronRight color="#0F172A" size={20} />
            </TouchableOpacity>
        </View>
    );
}
