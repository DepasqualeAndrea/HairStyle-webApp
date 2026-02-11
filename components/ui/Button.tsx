import React from 'react';
import { Text, Pressable, ActivityIndicator, View } from 'react-native';
import { cn } from '@/lib/utils'; // Creerò questa utility a breve

interface ButtonProps extends React.ComponentProps<typeof Pressable> {
    variant?: 'primary' | 'secondary' | 'outline' | 'ghost';
    size?: 'sm' | 'md' | 'lg';
    label: string;
    loading?: boolean;
    icon?: React.ReactNode;
}

export function Button({
    variant = 'primary',
    size = 'md',
    label,
    loading = false,
    icon,
    className,
    disabled,
    ...props
}: ButtonProps) {
    const baseStyles = 'rounded-button flex-row items-center justify-center';

    const variants = {
        primary: 'bg-accent-pink active:opacity-90',
        secondary: 'bg-bg-tertiary active:bg-bg-secondary',
        outline: 'border border-accent-pink bg-transparent active:bg-accent-pink/10',
        ghost: 'bg-transparent active:bg-bg-tertiary/50',
    };

    const sizes = {
        sm: 'px-4 py-2',
        md: 'px-6 py-3',
        lg: 'px-8 py-4',
    };

    const textStyles = {
        primary: 'text-bg-primary font-bold',
        secondary: 'text-text-primary font-semibold',
        outline: 'text-accent-pink font-semibold',
        ghost: 'text-text-secondary font-medium',
    };

    const textSizes = {
        sm: 'text-sm',
        md: 'text-base',
        lg: 'text-lg',
    };

    return (
        <Pressable
            className={`${baseStyles} ${variants[variant]} ${sizes[size]} ${disabled || loading ? 'opacity-50' : ''} ${className || ''}`}
            disabled={disabled || loading}
            {...props}
        >
            {loading ? (
                <ActivityIndicator color={variant === 'primary' ? '#0F0F0F' : '#FF4D6D'} />
            ) : (
                <View className="flex-row items-center space-x-2">
                    {icon && <View className="mr-2">{icon}</View>}
                    <Text className={`${textStyles[variant]} ${textSizes[size]}`}>
                        {label}
                    </Text>
                </View>
            )}
        </Pressable>
    );
}
