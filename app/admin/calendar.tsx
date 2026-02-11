import React, { useState } from 'react';
import { View, Text, ScrollView, Pressable, Platform } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { ChevronLeft, ChevronRight, Plus } from 'lucide-react-native';
import { Card } from '@/components/ui/Card';
import { Badge } from '@/components/ui/Badge';
import { Avatar } from '@/components/ui/Avatar';

// Mock appointments per la week view
const MOCK_WEEK_APPOINTMENTS = [
    {
        id: '1',
        staffId: 's1',
        staffName: 'Marco Rossi',
        date: '2026-02-10',
        startTime: '10:00',
        endTime: '10:45',
        clientName: 'Mario Bianchi',
        service: 'Taglio Premium',
        status: 'confirmed',
    },
    {
        id: '2',
        staffId: 's1',
        staffName: 'Marco Rossi',
        date: '2026-02-10',
        startTime: '14:00',
        endTime: '14:30',
        clientName: 'Luca Rossi',
        service: 'Barba',
        status: 'pending',
    },
    {
        id: '3',
        staffId: 's2',
        staffName: 'Luca Bianchi',
        date: '2026-02-10',
        startTime: '11:00',
        endTime: '12:30',
        clientName: 'Anna Verdi',
        service: 'Colore + Piega',
        status: 'confirmed',
    },
    {
        id: '4',
        staffId: 's1',
        staffName: 'Marco Rossi',
        date: '2026-02-11',
        startTime: '09:00',
        endTime: '09:45',
        clientName: 'Paolo Neri',
        service: 'Taglio Classico',
        status: 'confirmed',
    },
];

const STAFF_MEMBERS = [
    { id: 's1', name: 'Marco Rossi', color: '#3B82F6' },
    { id: 's2', name: 'Luca Bianchi', color: '#10B981' },
];

const WEEK_DAYS = ['Lun', 'Mar', 'Mer', 'Gio', 'Ven', 'Sab', 'Dom'];
const HOURS = Array.from({ length: 11 }, (_, i) => i + 9); // 9:00 - 19:00

export default function AdminCalendar() {
    const [selectedDate, setSelectedDate] = useState(new Date());
    const isWeb = Platform.OS === 'web';

    const getWeekDates = () => {
        const curr = new Date(selectedDate);
        const week = [];

        // Start from Monday
        const first = curr.getDate() - curr.getDay() + 1;

        for (let i = 0; i < 7; i++) {
            const date = new Date(curr.setDate(first + i));
            week.push({
                date: date,
                dateString: date.toISOString().split('T')[0],
                day: WEEK_DAYS[i],
                dayNumber: date.getDate(),
                isToday: date.toDateString() === new Date().toDateString(),
            });
        }
        return week;
    };

    const weekDates = getWeekDates();

    const getAppointmentsForSlot = (staffId: string, dateString: string, hour: number) => {
        return MOCK_WEEK_APPOINTMENTS.filter(apt => {
            if (apt.staffId !== staffId || apt.date !== dateString) return false;

            const startHour = parseInt(apt.startTime.split(':')[0]);
            return startHour === hour;
        });
    };

    const previousWeek = () => {
        const newDate = new Date(selectedDate);
        newDate.setDate(newDate.getDate() - 7);
        setSelectedDate(newDate);
    };

    const nextWeek = () => {
        const newDate = new Date(selectedDate);
        newDate.setDate(newDate.getDate() + 7);
        setSelectedDate(newDate);
    };

    const getMonthYear = () => {
        return selectedDate.toLocaleDateString('it-IT', { month: 'long', year: 'numeric' });
    };

    return (
        <SafeAreaView className="flex-1 bg-bg-primary" edges={['top']}>
            {/* Header */}
            <View className="px-5 py-4 border-b border-bg-tertiary">
                <View className="flex-row items-center justify-between mb-4">
                    <Text className="text-h2 text-text-primary font-bold capitalize">
                        {getMonthYear()}
                    </Text>
                    <View className="flex-row items-center gap-3">
                        <Pressable
                            onPress={previousWeek}
                            className="h-10 w-10 bg-bg-secondary rounded-full items-center justify-center active:bg-bg-tertiary"
                        >
                            <ChevronLeft size={20} color="#FF4D6D" />
                        </Pressable>
                        <Pressable
                            onPress={() => setSelectedDate(new Date())}
                            className="px-4 py-2 bg-accent-pink/20 rounded-pill active:bg-accent-pink/30"
                        >
                            <Text className="text-accent-pink font-semibold">Oggi</Text>
                        </Pressable>
                        <Pressable
                            onPress={nextWeek}
                            className="h-10 w-10 bg-bg-secondary rounded-full items-center justify-center active:bg-bg-tertiary"
                        >
                            <ChevronRight size={20} color="#FF4D6D" />
                        </Pressable>
                    </View>
                </View>

                {/* Legend - Staff Colors */}
                <View className="flex-row items-center gap-4">
                    {STAFF_MEMBERS.map(staff => (
                        <View key={staff.id} className="flex-row items-center">
                            <View
                                className="h-3 w-3 rounded-full mr-2"
                                style={{ backgroundColor: staff.color }}
                            />
                            <Text className="text-text-secondary text-sm">{staff.name}</Text>
                        </View>
                    ))}
                </View>
            </View>

            {/* Calendar Grid */}
            <ScrollView className="flex-1" horizontal showsHorizontalScrollIndicator={false}>
                <View className="flex-1">
                    {/* Week Days Header */}
                    <View className="flex-row border-b border-bg-tertiary bg-bg-secondary">
                        {/* Time Column Header */}
                        <View className="w-16 border-r border-bg-tertiary p-2">
                            <Text className="text-text-tertiary text-xs font-semibold">ORA</Text>
                        </View>

                        {/* Day Columns Headers */}
                        {weekDates.map(day => (
                            <View
                                key={day.dateString}
                                className={`w-48 border-r border-bg-tertiary p-3 ${
                                    day.isToday ? 'bg-accent-pink/10' : ''
                                }`}
                            >
                                <Text className="text-text-tertiary text-xs font-semibold mb-1">
                                    {day.day}
                                </Text>
                                <View
                                    className={`h-8 w-8 rounded-full items-center justify-center ${
                                        day.isToday ? 'bg-accent-pink' : 'bg-transparent'
                                    }`}
                                >
                                    <Text
                                        className={`font-bold ${
                                            day.isToday ? 'text-bg-primary' : 'text-text-primary'
                                        }`}
                                    >
                                        {day.dayNumber}
                                    </Text>
                                </View>
                            </View>
                        ))}
                    </View>

                    {/* Time Slots Grid */}
                    <ScrollView showsVerticalScrollIndicator={false}>
                        {HOURS.map(hour => (
                            <View key={hour} className="flex-row">
                                {/* Time Label */}
                                <View className="w-16 border-r border-b border-bg-tertiary p-2 bg-bg-secondary">
                                    <Text className="text-text-secondary text-xs font-semibold">
                                        {hour}:00
                                    </Text>
                                </View>

                                {/* Day Cells */}
                                {weekDates.map(day => (
                                    <View
                                        key={`${hour}-${day.dateString}`}
                                        className="w-48 border-r border-b border-bg-tertiary p-1 min-h-[80px]"
                                    >
                                        {/* Staff Columns within each day */}
                                        <View className="flex-row flex-1">
                                            {STAFF_MEMBERS.map(staff => {
                                                const appointments = getAppointmentsForSlot(
                                                    staff.id,
                                                    day.dateString,
                                                    hour
                                                );

                                                return (
                                                    <View key={staff.id} className="flex-1 px-1">
                                                        {appointments.map(apt => (
                                                            <Pressable
                                                                key={apt.id}
                                                                className="mb-1 p-2 rounded-lg"
                                                                style={{
                                                                    backgroundColor: `${staff.color}20`,
                                                                    borderLeftWidth: 3,
                                                                    borderLeftColor: staff.color,
                                                                }}
                                                                onPress={() =>
                                                                    alert(`Appointment: ${apt.clientName}`)
                                                                }
                                                            >
                                                                <Text
                                                                    className="text-text-primary font-semibold text-xs mb-1"
                                                                    numberOfLines={1}
                                                                >
                                                                    {apt.clientName}
                                                                </Text>
                                                                <Text
                                                                    className="text-text-tertiary text-xs"
                                                                    numberOfLines={1}
                                                                >
                                                                    {apt.service}
                                                                </Text>
                                                                <Text className="text-text-tertiary text-xs mt-1">
                                                                    {apt.startTime}-{apt.endTime}
                                                                </Text>
                                                                {apt.status === 'pending' && (
                                                                    <Badge
                                                                        label="PENDING"
                                                                        variant="warning"
                                                                        size="sm"
                                                                        className="mt-1"
                                                                    />
                                                                )}
                                                            </Pressable>
                                                        ))}

                                                        {/* Empty slot - can add appointment */}
                                                        {appointments.length === 0 && (
                                                            <Pressable
                                                                className="flex-1 items-center justify-center opacity-0 hover:opacity-100 active:opacity-100"
                                                                onPress={() =>
                                                                    alert(
                                                                        `Add appointment for ${staff.name} on ${day.dateString} at ${hour}:00`
                                                                    )
                                                                }
                                                            >
                                                                <Plus size={16} color="#9CA3AF" />
                                                            </Pressable>
                                                        )}
                                                    </View>
                                                );
                                            })}
                                        </View>
                                    </View>
                                ))}
                            </View>
                        ))}
                    </ScrollView>
                </View>
            </ScrollView>

            {/* Quick Stats - Bottom Info */}
            {isWeb && (
                <View className="px-5 py-3 bg-bg-secondary border-t border-bg-tertiary flex-row items-center justify-between">
                    <Text className="text-text-tertiary text-sm">
                        📊 {MOCK_WEEK_APPOINTMENTS.length} appuntamenti questa settimana
                    </Text>
                    <Pressable className="flex-row items-center bg-accent-pink px-4 py-2 rounded-pill active:opacity-80">
                        <Plus size={16} color="#0F0F0F" />
                        <Text className="text-bg-primary font-semibold ml-2">
                            Nuovo Appuntamento
                        </Text>
                    </Pressable>
                </View>
            )}
        </SafeAreaView>
    );
}
