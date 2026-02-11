import React from 'react';
import { View, Text, Image, Pressable } from 'react-native';
import { Service } from '@/types';
import { formatDuration, formatPrice } from '@/utils/booking';
import { Clock } from 'lucide-react-native';

interface ServiceCardProps {
    service: Service;
    onPress?: () => void;
    selected?: boolean;
}

export function ServiceCard({ service, onPress, selected }: ServiceCardProps) {
    return (
        <Pressable
            onPress={onPress}
            className={`
        bg-bg-secondary rounded-card p-4 flex-row items-center justify-between mb-3 border
        ${selected ? 'border-accent-pink' : 'border-transparent'}
      `}
        >
            <View className="flex-1 mr-4">
                <View className="flex-row items-center justify-between mb-1">
                    <Text className="text-text-primary font-bold text-lg">
                        {service.name}
                    </Text>
                    {service.isPopular && (
                        <View className="bg-accent-pink/20 px-2 py-0.5 rounded-full">
                            <Text className="text-accent-pink text-xs font-medium">Popular</Text>
                        </View>
                    )}
                </View>

                <Text className="text-text-secondary text-sm mb-2" numberOfLines={2}>
                    {service.description}
                </Text>

                <View className="flex-row items-center">
                    <Text className="text-accent-pink font-semibold mr-4">
                        {formatPrice(service.price)}
                    </Text>
                    <View className="flex-row items-center">
                        <Clock size={14} color="#9CA3AF" />
                        <Text className="text-text-secondary text-xs ml-1">
                            {formatDuration(service.duration)}
                        </Text>
                    </View>
                </View>
            </View>
        </Pressable>
    );
}
