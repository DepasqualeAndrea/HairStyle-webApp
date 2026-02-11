import React from 'react';
import { View, TextInput, Pressable } from 'react-native';
import { Search, SlidersHorizontal } from 'lucide-react-native';

interface SearchBarProps {
    value: string;
    onChangeText: (text: string) => void;
    placeholder?: string;
    onFilterPress?: () => void;
    showFilter?: boolean;
    className?: string;
}

export function SearchBar({
    value,
    onChangeText,
    placeholder = 'Cerca...',
    onFilterPress,
    showFilter = false,
    className,
}: SearchBarProps) {
    return (
        <View className={`flex-row items-center ${className || ''}`}>
            <View className="flex-1 flex-row items-center bg-bg-secondary rounded-pill px-4 py-3 border border-bg-tertiary">
                <Search size={20} color="#9CA3AF" />
                <TextInput
                    value={value}
                    onChangeText={onChangeText}
                    placeholder={placeholder}
                    placeholderTextColor="#6B7280"
                    className="flex-1 ml-3 text-text-primary text-base"
                    style={{ outlineStyle: 'none' } as any}
                />
            </View>

            {showFilter && onFilterPress && (
                <Pressable
                    onPress={onFilterPress}
                    className="ml-3 h-12 w-12 bg-bg-secondary rounded-full items-center justify-center border border-bg-tertiary active:bg-bg-tertiary"
                >
                    <SlidersHorizontal size={20} color="#FF4D6D" />
                </Pressable>
            )}
        </View>
    );
}
