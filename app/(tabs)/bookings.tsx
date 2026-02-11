import React, { useState } from 'react';
import { View, Text, ScrollView, Pressable } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useRouter } from 'expo-router';
import { Calendar, Clock, RefreshCw } from 'lucide-react-native';
import { Card } from '@/components/ui/Card';
import { Badge } from '@/components/ui/Badge';
import { Button } from '@/components/ui/Button';
import { Avatar } from '@/components/ui/Avatar';

// Mock appointments
const MOCK_UPCOMING = [
    {
        id: '1',
        date: '2026-02-15',
        time: '10:30',
        services: ['Taglio Premium', 'Barba Completa'],
        stylist: {
            name: 'Marco Rossi',
            role: 'Master Stylist',
        },
        duration: 75,
        price: 8000,
        status: 'confirmed',
    },
    {
        id: '2',
        date: '2026-02-22',
        time: '14:00',
        services: ['Taglio Classico'],
        stylist: {
            name: 'Marco Rossi',
            role: 'Master Stylist',
        },
        duration: 30,
        price: 3500,
        status: 'pending',
    },
];

const MOCK_PAST = [
    {
        id: '3',
        date: '2026-01-28',
        time: '15:30',
        services: ['Taglio Premium', 'Trattamento Viso'],
        stylist: {
            name: 'Marco Rossi',
            role: 'Master Stylist',
        },
        duration: 70,
        price: 9000,
        status: 'completed',
    },
    {
        id: '4',
        date: '2026-01-10',
        time: '11:00',
        services: ['Barba Completa'],
        stylist: {
            name: 'Marco Rossi',
            role: 'Master Stylist',
        },
        duration: 30,
        price: 3000,
        status: 'completed',
    },
];

export default function Bookings() {
    const router = useRouter();
    const [activeTab, setActiveTab] = useState<'upcoming' | 'past'>('upcoming');

    const appointments = activeTab === 'upcoming' ? MOCK_UPCOMING : MOCK_PAST;

    const formatDate = (dateString: string) => {
        const date = new Date(dateString);
        return date.toLocaleDateString('it-IT', {
            day: 'numeric',
            month: 'short',
            weekday: 'short',
        });
    };

    const formatPrice = (cents: number) => {
        return `€${(cents / 100).toFixed(2)}`;
    };

    const handleModify = (appointmentId: string) => {
        alert(`Modifica appuntamento ${appointmentId}`);
        // TODO: Navigate to modify screen
    };

    const handleCancel = (appointmentId: string) => {
        alert(`Annulla appuntamento ${appointmentId}`);
        // TODO: Show cancellation confirmation dialog
    };

    const handleRebook = (appointmentId: string) => {
        alert(`Riprenota appuntamento ${appointmentId}`);
        // TODO: Pre-fill booking with same services and navigate to datetime selection
        router.push('/book/datetime');
    };

    return (
        <SafeAreaView className="flex-1 bg-bg-primary" edges={['top']}>
            {/* Header */}
            <View className="px-5 py-4 border-b border-bg-tertiary">
                <Text className="text-h2 text-text-primary font-bold mb-4">I Miei Appuntamenti</Text>

                {/* Toggle Tabs */}
                <View className="flex-row bg-bg-secondary rounded-pill p-1">
                    <Pressable
                        onPress={() => setActiveTab('upcoming')}
                        className={`flex-1 py-3 rounded-pill items-center ${
                            activeTab === 'upcoming' ? 'bg-accent-pink' : ''
                        }`}
                    >
                        <Text
                            className={`font-semibold ${
                                activeTab === 'upcoming' ? 'text-bg-primary' : 'text-text-secondary'
                            }`}
                        >
                            Prossimi
                        </Text>
                    </Pressable>
                    <Pressable
                        onPress={() => setActiveTab('past')}
                        className={`flex-1 py-3 rounded-pill items-center ${
                            activeTab === 'past' ? 'bg-accent-pink' : ''
                        }`}
                    >
                        <Text
                            className={`font-semibold ${
                                activeTab === 'past' ? 'text-bg-primary' : 'text-text-secondary'
                            }`}
                        >
                            Passati
                        </Text>
                    </Pressable>
                </View>
            </View>

            <ScrollView className="flex-1" contentContainerStyle={{ paddingBottom: 20 }}>
                {appointments.length === 0 ? (
                    <View className="flex-1 items-center justify-center py-20">
                        <View className="h-20 w-20 bg-bg-secondary rounded-full items-center justify-center mb-4">
                            <Calendar size={32} color="#9CA3AF" />
                        </View>
                        <Text className="text-text-primary font-semibold text-lg mb-2">
                            Nessun Appuntamento
                        </Text>
                        <Text className="text-text-secondary text-center px-8 mb-6">
                            {activeTab === 'upcoming'
                                ? 'Non hai appuntamenti in programma. Prenota ora!'
                                : 'Non hai ancora completato nessun appuntamento.'}
                        </Text>
                        {activeTab === 'upcoming' && (
                            <Button
                                label="Prenota Appuntamento"
                                onPress={() => router.push('/(tabs)/explore')}
                                variant="primary"
                            />
                        )}
                    </View>
                ) : (
                    <View className="px-5 pt-6">
                        {activeTab === 'upcoming' && (
                            <View className="mb-6">
                                <Text className="text-text-primary font-bold text-lg mb-4">
                                    📅 In Arrivo
                                </Text>
                                {appointments.map((appointment) => (
                                    <Card key={appointment.id} variant="glass" className="mb-4 p-5">
                                        {/* Status Badge */}
                                        <View className="absolute top-4 right-4">
                                            <Badge
                                                label={
                                                    appointment.status === 'confirmed'
                                                        ? 'CONFERMATO'
                                                        : 'IN ATTESA'
                                                }
                                                variant={
                                                    appointment.status === 'confirmed' ? 'success' : 'warning'
                                                }
                                                size="sm"
                                            />
                                        </View>

                                        {/* Date & Time */}
                                        <View className="flex-row items-center mb-4">
                                            <View className="h-14 w-14 bg-accent-pink/20 rounded-xl items-center justify-center mr-3">
                                                <Calendar size={24} color="#FF4D6D" />
                                            </View>
                                            <View>
                                                <Text className="text-text-primary font-bold text-lg capitalize">
                                                    {formatDate(appointment.date)}
                                                </Text>
                                                <Text className="text-accent-pink font-semibold text-base">
                                                    {appointment.time}
                                                </Text>
                                            </View>
                                        </View>

                                        <View className="h-[1px] bg-bg-tertiary mb-4" />

                                        {/* Services */}
                                        <Text className="text-text-tertiary text-xs mb-2">Servizi</Text>
                                        {appointment.services.map((service, idx) => (
                                            <Text
                                                key={idx}
                                                className="text-text-primary font-medium mb-1"
                                            >
                                                • {service}
                                            </Text>
                                        ))}

                                        <View className="h-[1px] bg-bg-tertiary my-4" />

                                        {/* Stylist */}
                                        <View className="flex-row items-center mb-4">
                                            <Avatar name={appointment.stylist.name} size="md" className="mr-3" />
                                            <View>
                                                <Text className="text-text-primary font-semibold">
                                                    {appointment.stylist.name}
                                                </Text>
                                                <Text className="text-text-tertiary text-sm">
                                                    {appointment.stylist.role}
                                                </Text>
                                            </View>
                                        </View>

                                        {/* Duration & Price */}
                                        <View className="flex-row items-center justify-between mb-4">
                                            <View className="flex-row items-center">
                                                <Clock size={16} color="#9CA3AF" />
                                                <Text className="text-text-secondary ml-2">
                                                    {appointment.duration} min
                                                </Text>
                                            </View>
                                            <Text className="text-accent-pink font-bold text-lg">
                                                {formatPrice(appointment.price)}
                                            </Text>
                                        </View>

                                        {/* Action Buttons */}
                                        <View className="flex-row gap-3">
                                            <Button
                                                label="Modifica"
                                                onPress={() => handleModify(appointment.id)}
                                                variant="outline"
                                                className="flex-1"
                                            />
                                            <Button
                                                label="Annulla"
                                                onPress={() => handleCancel(appointment.id)}
                                                variant="ghost"
                                                className="flex-1"
                                            />
                                        </View>
                                    </Card>
                                ))}
                            </View>
                        )}

                        {activeTab === 'past' && (
                            <View className="mb-6">
                                <Text className="text-text-primary font-bold text-lg mb-4">
                                    📋 Storico Recente
                                </Text>
                                {appointments.map((appointment) => (
                                    <Card key={appointment.id} className="mb-3 p-4">
                                        <View className="flex-row items-start justify-between mb-3">
                                            <View className="flex-1">
                                                <Text className="text-text-primary font-bold text-base mb-1 capitalize">
                                                    {formatDate(appointment.date)}
                                                </Text>
                                                <Text className="text-text-secondary text-sm mb-2">
                                                    {appointment.time} • {appointment.duration} min
                                                </Text>
                                                {appointment.services.map((service, idx) => (
                                                    <Text
                                                        key={idx}
                                                        className="text-text-tertiary text-xs"
                                                    >
                                                        • {service}
                                                    </Text>
                                                ))}
                                            </View>
                                            <Badge label="COMPLETATO" variant="success" size="sm" />
                                        </View>

                                        <View className="h-[1px] bg-bg-tertiary my-3" />

                                        <View className="flex-row items-center justify-between">
                                            <Text className="text-text-primary font-semibold">
                                                {formatPrice(appointment.price)}
                                            </Text>
                                            <Pressable
                                                onPress={() => handleRebook(appointment.id)}
                                                className="flex-row items-center bg-accent-pink/10 px-4 py-2 rounded-pill active:bg-accent-pink/20"
                                            >
                                                <RefreshCw size={14} color="#FF4D6D" />
                                                <Text className="text-accent-pink font-semibold ml-2 text-sm">
                                                    Riprenota
                                                </Text>
                                            </Pressable>
                                        </View>
                                    </Card>
                                ))}
                            </View>
                        )}
                    </View>
                )}
            </ScrollView>
        </SafeAreaView>
    );
}
