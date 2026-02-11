import React from 'react';
import { View, Text, ScrollView, Pressable } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useRouter } from 'expo-router';
import {
    TrendingUp,
    Users,
    Calendar,
    DollarSign,
    Clock,
    CheckCircle,
    XCircle,
    AlertCircle,
} from 'lucide-react-native';
import { Card } from '@/components/ui/Card';
import { Badge } from '@/components/ui/Badge';

// Mock stats
const STATS = {
    today: {
        revenue: 45000, // €450.00
        appointments: 12,
        completed: 8,
        pending: 3,
        cancelled: 1,
    },
    week: {
        revenue: 280000, // €2,800.00
        appointments: 67,
        newClients: 8,
    },
    month: {
        revenue: 1200000, // €12,000.00
        appointments: 285,
        avgPerAppointment: 4210, // €42.10
    },
};

const UPCOMING_APPOINTMENTS = [
    {
        id: '1',
        time: '10:30',
        client: 'Mario Bianchi',
        service: 'Taglio Premium',
        duration: 45,
        price: 5000,
        status: 'confirmed',
    },
    {
        id: '2',
        time: '11:30',
        client: 'Luca Rossi',
        service: 'Barba Completa',
        duration: 30,
        price: 3000,
        status: 'pending',
    },
    {
        id: '3',
        time: '14:00',
        client: 'Giovanni Verdi',
        service: 'Taglio + Barba',
        duration: 60,
        price: 7000,
        status: 'confirmed',
    },
];

export default function AdminDashboard() {
    const router = useRouter();

    const formatPrice = (cents: number) => `€${(cents / 100).toFixed(2)}`;

    const StatCard = ({
        icon,
        title,
        value,
        subtitle,
        trend,
        color = '#FF4D6D',
    }: {
        icon: React.ReactNode;
        title: string;
        value: string;
        subtitle?: string;
        trend?: string;
        color?: string;
    }) => (
        <Card className="p-4 flex-1">
            <View className="flex-row items-center justify-between mb-3">
                <View
                    className="h-10 w-10 rounded-full items-center justify-center"
                    style={{ backgroundColor: `${color}20` }}
                >
                    {icon}
                </View>
                {trend && (
                    <View className="flex-row items-center">
                        <TrendingUp size={14} color="#10B981" />
                        <Text className="text-green-500 text-xs font-bold ml-1">{trend}</Text>
                    </View>
                )}
            </View>
            <Text className="text-text-tertiary text-xs mb-1">{title}</Text>
            <Text className="text-text-primary font-bold text-2xl mb-1">{value}</Text>
            {subtitle && <Text className="text-text-tertiary text-xs">{subtitle}</Text>}
        </Card>
    );

    return (
        <SafeAreaView className="flex-1 bg-bg-primary" edges={['top']}>
            <ScrollView className="flex-1" contentContainerStyle={{ paddingBottom: 20 }}>
                {/* Header */}
                <View className="px-5 py-6 border-b border-bg-tertiary">
                    <Text className="text-h1 text-text-primary font-bold mb-2">Admin Dashboard</Text>
                    <Text className="text-text-secondary">Hair Style • {new Date().toLocaleDateString('it-IT', { day: 'numeric', month: 'long', year: 'numeric' })}</Text>
                </View>

                {/* Quick Stats - Today */}
                <View className="px-5 pt-6">
                    <Text className="text-text-primary font-bold text-lg mb-4">📊 Oggi</Text>
                    <View className="flex-row gap-3 mb-3">
                        <StatCard
                            icon={<DollarSign size={20} color="#FF4D6D" />}
                            title="Incasso"
                            value={formatPrice(STATS.today.revenue)}
                            color="#FF4D6D"
                        />
                        <StatCard
                            icon={<Calendar size={20} color="#3B82F6" />}
                            title="Appuntamenti"
                            value={STATS.today.appointments.toString()}
                            subtitle={`${STATS.today.completed} completati`}
                            color="#3B82F6"
                        />
                    </View>
                    <View className="flex-row gap-3">
                        <StatCard
                            icon={<CheckCircle size={20} color="#10B981" />}
                            title="Completati"
                            value={STATS.today.completed.toString()}
                            color="#10B981"
                        />
                        <StatCard
                            icon={<AlertCircle size={20} color="#F59E0B" />}
                            title="In Attesa"
                            value={STATS.today.pending.toString()}
                            color="#F59E0B"
                        />
                        <StatCard
                            icon={<XCircle size={20} color="#EF4444" />}
                            title="Cancellati"
                            value={STATS.today.cancelled.toString()}
                            color="#EF4444"
                        />
                    </View>
                </View>

                {/* Weekly & Monthly Stats */}
                <View className="px-5 pt-6">
                    <Text className="text-text-primary font-bold text-lg mb-4">📈 Performance</Text>
                    <Card variant="glass" className="p-5 mb-3">
                        <View className="flex-row items-center justify-between mb-3">
                            <Text className="text-text-secondary text-sm">Settimana Corrente</Text>
                            <Badge label="+12%" variant="success" size="sm" />
                        </View>
                        <Text className="text-accent-pink font-bold text-3xl mb-4">
                            {formatPrice(STATS.week.revenue)}
                        </Text>
                        <View className="flex-row justify-between">
                            <View>
                                <Text className="text-text-tertiary text-xs mb-1">Appuntamenti</Text>
                                <Text className="text-text-primary font-semibold">
                                    {STATS.week.appointments}
                                </Text>
                            </View>
                            <View>
                                <Text className="text-text-tertiary text-xs mb-1">Nuovi Clienti</Text>
                                <Text className="text-text-primary font-semibold">
                                    {STATS.week.newClients}
                                </Text>
                            </View>
                            <View>
                                <Text className="text-text-tertiary text-xs mb-1">Media/App.</Text>
                                <Text className="text-text-primary font-semibold">
                                    {formatPrice(STATS.week.revenue / STATS.week.appointments)}
                                </Text>
                            </View>
                        </View>
                    </Card>

                    <Card variant="outlined" className="p-5">
                        <View className="flex-row items-center justify-between mb-3">
                            <Text className="text-text-secondary text-sm">Mese Corrente</Text>
                            <Badge label="+8%" variant="success" size="sm" />
                        </View>
                        <Text className="text-accent-pink font-bold text-3xl mb-4">
                            {formatPrice(STATS.month.revenue)}
                        </Text>
                        <View className="flex-row justify-between">
                            <View>
                                <Text className="text-text-tertiary text-xs mb-1">Appuntamenti</Text>
                                <Text className="text-text-primary font-semibold">
                                    {STATS.month.appointments}
                                </Text>
                            </View>
                            <View>
                                <Text className="text-text-tertiary text-xs mb-1">Ticket Medio</Text>
                                <Text className="text-text-primary font-semibold">
                                    {formatPrice(STATS.month.avgPerAppointment)}
                                </Text>
                            </View>
                        </View>
                    </Card>
                </View>

                {/* Upcoming Appointments */}
                <View className="px-5 pt-6">
                    <View className="flex-row items-center justify-between mb-4">
                        <Text className="text-text-primary font-bold text-lg">
                            🕐 Prossimi Appuntamenti
                        </Text>
                        <Pressable onPress={() => router.push('/admin/appointments')}>
                            <Text className="text-accent-pink text-sm font-medium">Vedi tutti</Text>
                        </Pressable>
                    </View>

                    {UPCOMING_APPOINTMENTS.map((appointment) => (
                        <Card key={appointment.id} className="mb-3 p-4">
                            <View className="flex-row items-start justify-between mb-3">
                                <View className="flex-1">
                                    <View className="flex-row items-center mb-2">
                                        <Clock size={16} color="#FF4D6D" />
                                        <Text className="text-accent-pink font-bold text-lg ml-2">
                                            {appointment.time}
                                        </Text>
                                        <View className="ml-auto">
                                            <Badge
                                                label={
                                                    appointment.status === 'confirmed'
                                                        ? 'CONFERMATO'
                                                        : 'IN ATTESA'
                                                }
                                                variant={
                                                    appointment.status === 'confirmed'
                                                        ? 'success'
                                                        : 'warning'
                                                }
                                                size="sm"
                                            />
                                        </View>
                                    </View>
                                    <Text className="text-text-primary font-semibold text-base mb-1">
                                        {appointment.client}
                                    </Text>
                                    <Text className="text-text-secondary text-sm mb-2">
                                        {appointment.service} • {appointment.duration} min
                                    </Text>
                                    <Text className="text-accent-pink font-bold">
                                        {formatPrice(appointment.price)}
                                    </Text>
                                </View>
                            </View>
                        </Card>
                    ))}
                </View>

                {/* Quick Actions */}
                <View className="px-5 pt-6 pb-6">
                    <Text className="text-text-primary font-bold text-lg mb-4">⚡ Azioni Rapide</Text>
                    <View className="flex-row gap-3">
                        <Pressable
                            onPress={() => router.push('/admin/calendar')}
                            className="flex-1"
                        >
                            <Card className="p-4 items-center active:bg-accent-pink/5">
                                <View className="h-12 w-12 bg-accent-pink/20 rounded-full items-center justify-center mb-3">
                                    <Calendar size={24} color="#FF4D6D" />
                                </View>
                                <Text className="text-text-primary font-semibold text-center">
                                    Calendario
                                </Text>
                            </Card>
                        </Pressable>

                        <Pressable
                            onPress={() => router.push('/admin/services')}
                            className="flex-1"
                        >
                            <Card className="p-4 items-center active:bg-accent-pink/5">
                                <View className="h-12 w-12 bg-accent-pink/20 rounded-full items-center justify-center mb-3">
                                    <Scissors size={24} color="#FF4D6D" />
                                </View>
                                <Text className="text-text-primary font-semibold text-center">
                                    Servizi
                                </Text>
                            </Card>
                        </Pressable>
                    </View>
                </View>
            </ScrollView>
        </SafeAreaView>
    );
}
