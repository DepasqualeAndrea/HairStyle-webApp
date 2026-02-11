import React, { useState } from 'react';
import { View, Text, ScrollView, Pressable } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Plus, Edit, Trash2, Eye, EyeOff } from 'lucide-react-native';
import { Card } from '@/components/ui/Card';
import { Badge } from '@/components/ui/Badge';
import { Button } from '@/components/ui/Button';
import { SearchBar } from '@/components/ui/SearchBar';
import { Toggle } from '@/components/ui/Toggle';
import { MOCK_SERVICES } from '@/data/mock';

export default function AdminServices() {
    const [searchQuery, setSearchQuery] = useState('');
    const [services, setServices] = useState(MOCK_SERVICES);

    const filteredServices = services.filter(
        (service) =>
            service.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
            service.description.toLowerCase().includes(searchQuery.toLowerCase())
    );

    const toggleServiceActive = (serviceId: string) => {
        setServices(
            services.map((s) => (s.id === serviceId ? { ...s, isActive: !s.isActive } : s))
        );
    };

    const handleAddService = () => {
        alert('Aggiungi nuovo servizio');
        // TODO: Open modal with form
    };

    const handleEditService = (serviceId: string) => {
        alert(`Modifica servizio ${serviceId}`);
        // TODO: Open modal with form pre-filled
    };

    const handleDeleteService = (serviceId: string) => {
        alert(`Elimina servizio ${serviceId}`);
        // TODO: Show confirmation dialog then delete from Supabase
    };

    const formatPrice = (cents: number) => `€${(cents / 100).toFixed(2)}`;

    const getCategoryLabel = (category: string) => {
        switch (category) {
            case 'capelli':
                return 'Capelli';
            case 'barba':
                return 'Barba';
            case 'trattamenti':
                return 'Trattamenti';
            case 'styling':
                return 'Styling';
            default:
                return category;
        }
    };

    const getCategoryColor = (category: string) => {
        switch (category) {
            case 'capelli':
                return '#3B82F6';
            case 'barba':
                return '#10B981';
            case 'trattamenti':
                return '#F59E0B';
            case 'styling':
                return '#8B5CF6';
            default:
                return '#9CA3AF';
        }
    };

    return (
        <SafeAreaView className="flex-1 bg-bg-primary" edges={['top']}>
            {/* Header */}
            <View className="px-5 py-4 border-b border-bg-tertiary">
                <View className="flex-row items-center justify-between mb-4">
                    <Text className="text-h2 text-text-primary font-bold">Gestione Servizi</Text>
                    <Pressable
                        onPress={handleAddService}
                        className="flex-row items-center bg-accent-pink px-4 py-2 rounded-pill active:opacity-80"
                    >
                        <Plus size={18} color="#0F0F0F" />
                        <Text className="text-bg-primary font-bold ml-2">Nuovo</Text>
                    </Pressable>
                </View>

                <SearchBar
                    value={searchQuery}
                    onChangeText={setSearchQuery}
                    placeholder="Cerca servizi..."
                />
            </View>

            <ScrollView className="flex-1 px-5 pt-4" contentContainerStyle={{ paddingBottom: 20 }}>
                {/* Stats Card */}
                <Card variant="glass" className="p-5 mb-6">
                    <View className="flex-row justify-between">
                        <View className="flex-1">
                            <Text className="text-text-tertiary text-xs mb-1">Totale Servizi</Text>
                            <Text className="text-text-primary font-bold text-2xl">
                                {services.length}
                            </Text>
                        </View>
                        <View className="flex-1">
                            <Text className="text-text-tertiary text-xs mb-1">Attivi</Text>
                            <Text className="text-accent-pink font-bold text-2xl">
                                {services.filter((s) => s.isActive).length}
                            </Text>
                        </View>
                        <View className="flex-1">
                            <Text className="text-text-tertiary text-xs mb-1">Popolari</Text>
                            <Text className="text-accent-pink font-bold text-2xl">
                                {services.filter((s) => s.isPopular).length}
                            </Text>
                        </View>
                    </View>
                </Card>

                {/* Services List */}
                {filteredServices.length === 0 ? (
                    <View className="items-center justify-center py-20">
                        <Text className="text-text-primary font-semibold text-lg mb-2">
                            Nessun Servizio
                        </Text>
                        <Text className="text-text-secondary text-center">
                            Nessun servizio trovato con i criteri di ricerca
                        </Text>
                    </View>
                ) : (
                    filteredServices.map((service) => (
                        <Card key={service.id} className="mb-3 p-4">
                            {/* Header */}
                            <View className="flex-row items-start justify-between mb-3">
                                <View className="flex-1 mr-3">
                                    <View className="flex-row items-center mb-2">
                                        <Text className="text-text-primary font-bold text-lg mr-2">
                                            {service.name}
                                        </Text>
                                        {service.isPopular && (
                                            <Badge label="POPULAR" variant="gold" size="sm" />
                                        )}
                                    </View>
                                    <View className="flex-row items-center mb-3">
                                        <View
                                            className="px-2 py-1 rounded"
                                            style={{ backgroundColor: `${getCategoryColor(service.category)}20` }}
                                        >
                                            <Text
                                                className="text-xs font-semibold"
                                                style={{ color: getCategoryColor(service.category) }}
                                            >
                                                {getCategoryLabel(service.category)}
                                            </Text>
                                        </View>
                                    </View>
                                    <Text className="text-text-secondary text-sm leading-5">
                                        {service.description}
                                    </Text>
                                </View>

                                {/* Active Toggle */}
                                <View className="items-center">
                                    <Toggle
                                        value={service.isActive}
                                        onValueChange={() => toggleServiceActive(service.id)}
                                    />
                                    <Text className="text-text-tertiary text-xs mt-1">
                                        {service.isActive ? 'Attivo' : 'Disattivo'}
                                    </Text>
                                </View>
                            </View>

                            <View className="h-[1px] bg-bg-tertiary mb-3" />

                            {/* Info Row */}
                            <View className="flex-row items-center justify-between mb-4">
                                <View>
                                    <Text className="text-text-tertiary text-xs mb-1">Durata</Text>
                                    <Text className="text-text-primary font-semibold">
                                        {service.duration} min
                                    </Text>
                                </View>
                                <View>
                                    <Text className="text-text-tertiary text-xs mb-1">Prezzo</Text>
                                    <Text className="text-accent-pink font-bold text-lg">
                                        {formatPrice(service.price)}
                                    </Text>
                                </View>
                                <View>
                                    <Text className="text-text-tertiary text-xs mb-1">Stato</Text>
                                    <Badge
                                        label={service.isActive ? 'ATTIVO' : 'DISATTIVO'}
                                        variant={service.isActive ? 'success' : 'error'}
                                        size="sm"
                                    />
                                </View>
                            </View>

                            {/* Actions */}
                            <View className="flex-row gap-2">
                                <Pressable
                                    onPress={() => handleEditService(service.id)}
                                    className="flex-1 flex-row items-center justify-center bg-accent-pink/10 py-3 rounded-xl active:bg-accent-pink/20"
                                >
                                    <Edit size={16} color="#FF4D6D" />
                                    <Text className="text-accent-pink font-semibold ml-2">
                                        Modifica
                                    </Text>
                                </Pressable>
                                <Pressable
                                    onPress={() => handleDeleteService(service.id)}
                                    className="flex-row items-center justify-center bg-red-500/10 px-4 py-3 rounded-xl active:bg-red-500/20"
                                >
                                    <Trash2 size={16} color="#EF4444" />
                                </Pressable>
                            </View>
                        </Card>
                    ))
                )}

                {/* Add Service Button (Bottom) */}
                <View className="pt-4">
                    <Button
                        label="Aggiungi Nuovo Servizio"
                        onPress={handleAddService}
                        variant="outline"
                    />
                </View>
            </ScrollView>
        </SafeAreaView>
    );
}
