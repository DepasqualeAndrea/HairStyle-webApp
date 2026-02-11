import React from 'react';
import { View, Text } from 'react-native';

interface BadgeProps {
    label: string;
    variant?: 'success' | 'warning' | 'error' | 'info' | 'gold' | 'default';
    size?: 'sm' | 'md' | 'lg';
    className?: string;
}

export function Badge({
    label,
    variant = 'default',
    size = 'md',
    className,
}: BadgeProps) {
    const variants = {
        success: 'bg-accent-green/20 border-accent-green/30',
        warning: 'bg-accent-yellow/20 border-accent-yellow/30',
        error: 'bg-accent-red/20 border-accent-red/30',
        info: 'bg-blue-500/20 border-blue-500/30',
        gold: 'bg-accent-pink/20 border-accent-pink/30',
        default: 'bg-bg-tertiary border-bg-tertiary',
    };

    const textColors = {
        success: 'text-accent-green',
        warning: 'text-accent-yellow',
        error: 'text-accent-red',
        info: 'text-blue-400',
        gold: 'text-accent-pink',
        default: 'text-text-secondary',
    };

    const sizes = {
        sm: 'px-2 py-0.5 text-xs',
        md: 'px-3 py-1 text-sm',
        lg: 'px-4 py-1.5 text-base',
    };

    return (
        <View
            className={`
        ${variants[variant]}
        ${sizes[size]}
        rounded-pill border items-center justify-center
        ${className || ''}
      `}
        >
            <Text className={`${textColors[variant]} font-bold uppercase tracking-wider`}>
                {label}
            </Text>
        </View>
    );
}
