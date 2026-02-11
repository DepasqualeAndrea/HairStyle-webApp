import React from 'react';
import { TextInput, View, Text, TextInputProps } from 'react-native';

interface InputProps extends TextInputProps {
    label?: string;
    error?: string;
    leftIcon?: React.ReactNode;
    rightIcon?: React.ReactNode;
}

export function Input({
    label,
    error,
    leftIcon,
    rightIcon,
    className,
    ...props
}: InputProps) {
    return (
        <View className={`w-full mb-4 ${className || ''}`}>
            {label && (
                <Text className="text-text-secondary text-sm mb-1.5 font-medium ml-1">
                    {label}
                </Text>
            )}

            <View className={`
        flex-row items-center bg-bg-tertiary rounded-xl px-4 py-3 border
        ${error ? 'border-accent-red' : 'border-transparent focus:border-accent-pink'}
      `}>
                {leftIcon && <View className="mr-3">{leftIcon}</View>}

                <TextInput
                    className="flex-1 text-text-primary text-base min-h-[24px]"
                    placeholderTextColor="#6B7280"
                    selectionColor="#FF4D6D"
                    {...props}
                />

                {rightIcon && <View className="ml-3">{rightIcon}</View>}
            </View>

            {error && (
                <Text className="text-accent-red text-xs mt-1 ml-1">
                    {error}
                </Text>
            )}
        </View>
    );
}
