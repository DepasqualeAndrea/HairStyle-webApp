import React, { useState } from 'react';
import { View, Text, ScrollView, Pressable, ActivityIndicator } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useRouter } from 'expo-router';
import { ChevronRight, User, CreditCard, Shield, LogOut, Award, TrendingUp } from 'lucide-react-native';
import { Avatar } from '@/components/ui/Avatar';
import { Badge } from '@/components/ui/Badge';
import { Card } from '@/components/ui/Card';
import { Toggle } from '@/components/ui/Toggle';
import { Button } from '@/components/ui/Button';
import { useAuth } from '@/context/auth';
import { useLoyalty } from '@/hooks/useLoyalty';
import {
    getUserTier,
    getNextTierInfo,
    getTierBadge,
    formatPoints,
    getTierBenefits,
} from '@/lib/loyalty';

export default function Profile() {
    const router = useRouter();
    const { user, signOut } = useAuth();
    const { points, history, loading: loyaltyLoading } = useLoyalty();
    const [appointmentReminders, setAppointmentReminders] = useState(true);
    const [promotionsEnabled, setPromotionsEnabled] = useState(false);

    const currentTier = getUserTier(points);
    const tierBadge = getTierBadge(currentTier);
    const nextTierInfo = getNextTierInfo(points);
    const tierBenefits = getTierBenefits(currentTier);

    const handleLogout = async () => {
        await signOut();
        router.replace('/(auth)/login');
    };

    const handleSaveChanges = () => {
        alert('Modifiche salvate! (TODO: Salvare su Supabase)');
    };

    const SettingsItem = ({
        icon,
        title,
        subtitle,
        onPress,
        showChevron = true,
    }: {
        icon: React.ReactNode;
        title: string;
        subtitle?: string;
        onPress?: () => void;
        showChevron?: boolean;
    }) => (
        <Pressable
            onPress={onPress}
            className="flex-row items-center py-4 border-b border-bg-tertiary active:bg-bg-tertiary/30"
        >
            <View className="h-10 w-10 bg-accent-pink/20 rounded-full items-center justify-center mr-3">
                {icon}
            </View>
            <View className="flex-1">
                <Text className="text-text-primary font-semibold text-base">{title}</Text>
                {subtitle && <Text className="text-text-tertiary text-sm mt-0.5">{subtitle}</Text>}
            </View>
            {showChevron && <ChevronRight size={20} color="#9CA3AF" />}
        </Pressable>
    );

    return (
        <SafeAreaView className="flex-1 bg-bg-primary" edges={['top']}>
            <ScrollView className="flex-1" contentContainerStyle={{ paddingBottom: 100 }}>
                {/* Header */}
                <View className="px-5 py-6 border-b border-bg-tertiary">
                    <Text className="text-h2 text-text-primary font-bold mb-6">Il Mio Profilo</Text>

                    {/* Profile Card */}
                    <Card variant="glass" className="p-5">
                        <View className="items-center">
                            <View className="relative mb-4">
                                <Avatar
                                    name={user?.email || 'User'}
                                    size="xl"
                                    showStatus
                                    statusColor="#10B981"
                                />
                                <View className="absolute -bottom-2 -right-2">
                                    <Badge label={tierBadge.name} variant="gold" size="md" />
                                </View>
                            </View>
                            <Text className="text-text-primary font-bold text-xl mb-1">
                                {user?.user_metadata?.full_name || user?.email?.split('@')[0] || 'User'}
                            </Text>
                            <Text className="text-text-secondary text-sm mb-1">{user?.email}</Text>
                            <Text className="text-text-tertiary text-xs">
                                {tierBadge.emoji} {tierBadge.name} Member
                            </Text>
                        </View>
                    </Card>
                </View>

                {/* LOYALTY PROGRAM Section */}
                <View className="px-5 pt-6">
                    <View className="flex-row items-center mb-4">
                        <View className="h-1 w-1 rounded-full bg-accent-pink mr-2" />
                        <Text className="text-text-primary font-bold text-base uppercase tracking-wider">
                            Programma Fedeltà
                        </Text>
                    </View>

                    <Card variant="glass" className="p-5">
                        {/* Points Display */}
                        <View className="items-center mb-6">
                            <Text className="text-5xl font-bold text-accent-pink mb-2">
                                {points}
                            </Text>
                            <Text className="text-text-secondary text-sm">Punti Disponibili</Text>
                        </View>

                        {/* Tier Progress */}
                        {nextTierInfo ? (
                            <>
                                <View className="mb-4">
                                    <View className="flex-row justify-between mb-2">
                                        <Text className="text-text-secondary text-sm">
                                            Prossimo livello: {getTierBadge(nextTierInfo.nextTier).emoji} {nextTierInfo.nextTier}
                                        </Text>
                                        <Text className="text-accent-pink text-sm font-semibold">
                                            {nextTierInfo.pointsNeeded} punti
                                        </Text>
                                    </View>
                                    {/* Progress Bar */}
                                    <View className="h-2 bg-bg-tertiary rounded-full overflow-hidden">
                                        <View
                                            className="h-full bg-accent-pink rounded-full"
                                            style={{ width: `${nextTierInfo.progressPercent}%` }}
                                        />
                                    </View>
                                    <Text className="text-text-tertiary text-xs mt-1">
                                        {nextTierInfo.progressPercent}% completato
                                    </Text>
                                </View>
                            </>
                        ) : (
                            <View className="mb-4 items-center">
                                <Text className="text-accent-pink font-bold text-lg">🎉 Livello Massimo!</Text>
                                <Text className="text-text-secondary text-sm mt-1">
                                    Hai raggiunto il livello Platinum
                                </Text>
                            </View>
                        )}

                        <View className="h-[1px] bg-bg-tertiary mb-4" />

                        {/* Tier Benefits */}
                        <View>
                            <Text className="text-text-primary font-semibold text-base mb-3">
                                I Tuoi Vantaggi {tierBadge.emoji}
                            </Text>
                            {tierBenefits.map((benefit, index) => (
                                <View key={index} className="flex-row items-start mb-2">
                                    <Text className="text-accent-pink mr-2">•</Text>
                                    <Text className="text-text-secondary text-sm flex-1">{benefit}</Text>
                                </View>
                            ))}
                        </View>
                    </Card>
                </View>

                {/* ACCOUNT Section */}
                <View className="px-5 pt-6">
                    <View className="flex-row items-center mb-4">
                        <View className="h-1 w-1 rounded-full bg-accent-pink mr-2" />
                        <Text className="text-text-primary font-bold text-base uppercase tracking-wider">
                            Account
                        </Text>
                    </View>

                    <Card className="overflow-hidden">
                        <SettingsItem
                            icon={<User size={20} color="#FF4D6D" />}
                            title="Dati Personali"
                            subtitle="Nome, email, telefono"
                            onPress={() => alert('Modifica dati personali')}
                        />
                        <SettingsItem
                            icon={<CreditCard size={20} color="#FF4D6D" />}
                            title="Metodi di Pagamento"
                            subtitle="Gestisci carte e pagamenti"
                            onPress={() => alert('Gestisci pagamenti')}
                        />
                        <SettingsItem
                            icon={<Shield size={20} color="#FF4D6D" />}
                            title="Sicurezza"
                            subtitle="Password e autenticazione"
                            onPress={() => alert('Impostazioni sicurezza')}
                        />
                    </Card>
                </View>

                {/* NOTIFICATION PREFERENCES Section */}
                <View className="px-5 pt-6">
                    <View className="flex-row items-center mb-4">
                        <View className="h-1 w-1 rounded-full bg-accent-pink mr-2" />
                        <Text className="text-text-primary font-bold text-base uppercase tracking-wider">
                            Preferenze Notifiche
                        </Text>
                    </View>

                    <Card className="p-5">
                        {/* Appointment Reminders */}
                        <View className="flex-row items-center justify-between mb-5">
                            <View className="flex-1 mr-4">
                                <Text className="text-text-primary font-semibold text-base mb-1">
                                    Promemoria Appuntamenti
                                </Text>
                                <Text className="text-text-tertiary text-sm">
                                    Ricevi notifiche prima dei tuoi appuntamenti
                                </Text>
                            </View>
                            <Toggle
                                value={appointmentReminders}
                                onValueChange={setAppointmentReminders}
                            />
                        </View>

                        <View className="h-[1px] bg-bg-tertiary mb-5" />

                        {/* Promotions */}
                        <View className="flex-row items-center justify-between">
                            <View className="flex-1 mr-4">
                                <Text className="text-text-primary font-semibold text-base mb-1">
                                    Offerte e Promozioni
                                </Text>
                                <Text className="text-text-tertiary text-sm">
                                    Ricevi aggiornamenti su offerte speciali
                                </Text>
                            </View>
                            <Toggle value={promotionsEnabled} onValueChange={setPromotionsEnabled} />
                        </View>
                    </Card>
                </View>

                {/* APP INFO Section */}
                <View className="px-5 pt-6">
                    <View className="flex-row items-center mb-4">
                        <View className="h-1 w-1 rounded-full bg-accent-pink mr-2" />
                        <Text className="text-text-primary font-bold text-base uppercase tracking-wider">
                            Informazioni
                        </Text>
                    </View>

                    <Card className="overflow-hidden">
                        <SettingsItem
                            icon={<Text className="text-lg">📋</Text>}
                            title="Termini e Condizioni"
                            onPress={() => alert('Termini e Condizioni')}
                        />
                        <SettingsItem
                            icon={<Text className="text-lg">🔒</Text>}
                            title="Privacy Policy"
                            onPress={() => alert('Privacy Policy')}
                        />
                        <SettingsItem
                            icon={<Text className="text-lg">ℹ️</Text>}
                            title="Info App"
                            subtitle="Versione 1.0.0"
                            onPress={() => alert('Hair Style v1.0.0')}
                        />
                    </Card>
                </View>

                {/* Logout Button */}
                <View className="px-5 pt-6 pb-6">
                    <Pressable
                        onPress={handleLogout}
                        className="flex-row items-center justify-center py-4 bg-red-500/10 rounded-2xl border border-red-500/30 active:bg-red-500/20"
                    >
                        <LogOut size={20} color="#EF4444" />
                        <Text className="text-red-500 font-bold ml-2">Esci dall'Account</Text>
                    </Pressable>
                </View>
            </ScrollView>

            {/* Save Changes Button - Fixed Bottom */}
            <View className="absolute bottom-0 left-0 right-0 bg-bg-secondary border-t border-bg-tertiary px-5 py-4">
                <Button
                    label="Salva Modifiche"
                    onPress={handleSaveChanges}
                    variant="primary"
                />
            </View>
        </SafeAreaView>
    );
}
