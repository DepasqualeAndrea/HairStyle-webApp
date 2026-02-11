import React, { useState } from 'react';
import { View, Text, ScrollView, Pressable } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Calendar, Clock, CheckCircle, XCircle, Edit, Search } from 'lucide-react-native';
import { Card } from '@/components/ui/Card';
import { Badge } from '@/components/ui/Badge';
import { Button } from '@/components/ui/Button';
import { SearchBar } from '@/components/ui/SearchBar';
import { Avatar } from '@/components/ui/Avatar';

type AppointmentStatus = 'pending' | 'confirmed' | 'completed' | 'cancelled';

const MOCK_APPOINTMENTS = [
    {
        id: '1',
        date: '2026-02-15',
        time: '10:30',
        client: {
            name: 'Mario Bianchi',
            phone: '+39 340 123 4567',
            email: 'mario@example.com',
        },
        services: ['Taglio Premium', 'Barba Completa'],
        duration: 75,
        price: 8000,
        status: 'confirmed' as AppointmentStatus,
        paymentMethod: 'online',
        notes: 'Cliente preferisce forbici per il taglio',
    },
    {
        id: '2',
        date: '2026-02-15',
        time: '14:00',
        client: {
            name: 'Luca Rossi',
            phone: '+39 345 987 6543',
            email: 'luca@example.com',
        },
        services: ['Taglio Classico'],
        duration: 30,
        price: 3500,
        status: 'pending' as AppointmentStatus,
        paymentMethod: 'in_store',
        notes: null,
    },
    {
        id: '3',
        date: '2026-02-14',
        time: '11:00',
        client: {
            name: 'Giovanni Verdi',
            phone: '+39 348 111 2222',
            email: 'giovanni@example.com',
        },
        services: ['Trattamento Viso'],
        duration: 25,
        price: 4000,
        status: 'completed' as AppointmentStatus,
        paymentMethod: 'online',
        notes: null,
    },
    {
        id: '4',
        date: '2026-02-14',
        time: '16:00',
        client: {
            name: 'Paolo Neri',
            phone: '+39 347 888 9999',
            email: 'paolo@example.com',
        },
        services: ['Taglio Premium'],
        duration: 45,
        price: 5000,
        status: 'cancelled' as AppointmentStatus,
        paymentMethod: 'in_store',
        notes: 'Cancellato dal cliente',
    },
];

export default function AdminAppointments() {
    const [searchQuery, setSearchQuery] = useState('');
    const [statusFilter, setStatusFilter] = useState<AppointmentStatus | 'all'>('all');

    const filteredAppointments = MOCK_APPOINTMENTS.filter((apt) => {
        const matchesSearch =
            apt.client.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
            apt.client.phone.includes(searchQuery) ||
            apt.services.some((s) => s.toLowerCase().includes(searchQuery.toLowerCase()));

        const matchesStatus = statusFilter === 'all' || apt.status === statusFilter;

        return matchesSearch && matchesStatus;
    });

    const formatPrice = (cents: number) => `€${(cents / 100).toFixed(2)}`;

    const formatDate = (dateString: string) => {
        return new Date(dateString).toLocaleDateString('it-IT', {
            day: 'numeric',
            month: 'short',
            weekday: 'short',
        });
    };

    const handleConfirm = (id: string) => {
        alert(`Conferma appuntamento ${id}`);
        // TODO: Update status to confirmed in Supabase
    };

    const handleCancel = (id: string) => {
        alert(`Annulla appuntamento ${id}`);
        // TODO: Update status to cancelled in Supabase
    };

    const handleComplete = (id: string) => {
        alert(`Segna come completato ${id}`);
        // TODO: Update status to completed in Supabase
    };

    const StatusFilterButton = ({ status, label }: { status: AppointmentStatus | 'all'; label: string }) => (
        <Pressable
            onPress={() => setStatusFilter(status)}
            className={`px-4 py-2 rounded-pill ${
                statusFilter === status ? 'bg-accent-pink' : 'bg-bg-secondary'
            }`}
        >
            <Text
                className={`font-semibold text-sm ${
                    statusFilter === status ? 'text-bg-primary' : 'text-text-secondary'
                }`}
            >
                {label}
            </Text>
        </Pressable>
    );

    const getStatusBadge = (status: AppointmentStatus) => {
        switch (status) {
            case 'confirmed':
                return <Badge label="CONFERMATO" variant="success" size="sm" />;
            case 'pending':
                return <Badge label="IN ATTESA" variant="warning" size="sm" />;
            case 'completed':
                return <Badge label="COMPLETATO" variant="info" size="sm" />;
            case 'cancelled':
                return <Badge label="CANCELLATO" variant="error" size="sm" />;
        }
    };

    return (
        <SafeAreaView className="flex-1 bg-bg-primary" edges={['top']}>
            {/* Header */}
            <View className="px-5 py-4 border-b border-bg-tertiary">
                <Text className="text-h2 text-text-primary font-bold mb-4">
                    Gestione Appuntamenti
                </Text>

                {/* Search */}
                <SearchBar
                    value={searchQuery}
                    onChangeText={setSearchQuery}
                    placeholder="Cerca cliente, servizio..."
                    className="mb-4"
                />

                {/* Status Filters */}
                <ScrollView horizontal showsHorizontalScrollIndicator={false} className="gap-2">
                    <View className="flex-row gap-2">
                        <StatusFilterButton status="all" label="Tutti" />
                        <StatusFilterButton status="pending" label="In Attesa" />
                        <StatusFilterButton status="confirmed" label="Confermati" />
                        <StatusFilterButton status="completed" label="Completati" />
                        <StatusFilterButton status="cancelled" label="Cancellati" />
                    </View>
                </ScrollView>
            </View>

            <ScrollView className="flex-1 px-5 pt-4" contentContainerStyle={{ paddingBottom: 20 }}>
                {filteredAppointments.length === 0 ? (
                    <View className="items-center justify-center py-20">
                        <Search size={48} color="#9CA3AF" />
                        <Text className="text-text-primary font-semibold text-lg mt-4 mb-2">
                            Nessun Risultato
                        </Text>
                        <Text className="text-text-secondary text-center">
                            Nessun appuntamento trovato con i filtri selezionati
                        </Text>
                    </View>
                ) : (
                    filteredAppointments.map((appointment) => (
                        <Card key={appointment.id} variant="glass" className="mb-4 p-5">
                            {/* Status Badge */}
                            <View className="absolute top-4 right-4">
                                {getStatusBadge(appointment.status)}
                            </View>

                            {/* Date & Time */}
                            <View className="flex-row items-center mb-4">
                                <View className="h-12 w-12 bg-accent-pink/20 rounded-xl items-center justify-center mr-3">
                                    <Calendar size={20} color="#FF4D6D" />
                                </View>
                                <View>
                                    <Text className="text-text-primary font-bold text-base capitalize">
                                        {formatDate(appointment.date)}
                                    </Text>
                                    <View className="flex-row items-center mt-1">
                                        <Clock size={14} color="#FF4D6D" />
                                        <Text className="text-accent-pink font-semibold ml-1">
                                            {appointment.time}
                                        </Text>
                                        <Text className="text-text-tertiary text-sm ml-2">
                                            • {appointment.duration} min
                                        </Text>
                                    </View>
                                </View>
                            </View>

                            <View className="h-[1px] bg-bg-tertiary mb-4" />

                            {/* Client Info */}
                            <View className="flex-row items-center mb-4">
                                <Avatar name={appointment.client.name} size="md" className="mr-3" />
                                <View className="flex-1">
                                    <Text className="text-text-primary font-bold text-base mb-1">
                                        {appointment.client.name}
                                    </Text>
                                    <Text className="text-text-secondary text-sm">
                                        {appointment.client.phone}
                                    </Text>
                                    <Text className="text-text-tertiary text-xs">
                                        {appointment.client.email}
                                    </Text>
                                </View>
                            </View>

                            <View className="h-[1px] bg-bg-tertiary mb-4" />

                            {/* Services */}
                            <Text className="text-text-tertiary text-xs mb-2">Servizi</Text>
                            {appointment.services.map((service, idx) => (
                                <Text key={idx} className="text-text-primary font-medium mb-1">
                                    • {service}
                                </Text>
                            ))}

                            {/* Price & Payment */}
                            <View className="flex-row items-center justify-between mt-3 mb-4">
                                <Text className="text-accent-pink font-bold text-xl">
                                    {formatPrice(appointment.price)}
                                </Text>
                                <Badge
                                    label={
                                        appointment.paymentMethod === 'online'
                                            ? 'ONLINE (-5%)'
                                            : 'IN STRUTTURA'
                                    }
                                    variant={appointment.paymentMethod === 'online' ? 'gold' : 'default'}
                                    size="sm"
                                />
                            </View>

                            {/* Notes */}
                            {appointment.notes && (
                                <View className="bg-bg-tertiary/30 p-3 rounded-lg mb-4">
                                    <Text className="text-text-tertiary text-xs mb-1">Note</Text>
                                    <Text className="text-text-primary text-sm">
                                        {appointment.notes}
                                    </Text>
                                </View>
                            )}

                            {/* Actions */}
                            {appointment.status === 'pending' && (
                                <View className="flex-row gap-3">
                                    <Button
                                        label="Conferma"
                                        onPress={() => handleConfirm(appointment.id)}
                                        variant="primary"
                                        className="flex-1"
                                    />
                                    <Button
                                        label="Rifiuta"
                                        onPress={() => handleCancel(appointment.id)}
                                        variant="ghost"
                                        className="flex-1"
                                    />
                                </View>
                            )}

                            {appointment.status === 'confirmed' && (
                                <View className="flex-row gap-3">
                                    <Button
                                        label="Completato"
                                        onPress={() => handleComplete(appointment.id)}
                                        variant="primary"
                                        className="flex-1"
                                    />
                                    <Button
                                        label="Annulla"
                                        onPress={() => handleCancel(appointment.id)}
                                        variant="ghost"
                                        className="flex-1"
                                    />
                                </View>
                            )}
                        </Card>
                    ))
                )}
            </ScrollView>
        </SafeAreaView>
    );
}
