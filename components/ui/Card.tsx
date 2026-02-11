import React from 'react';
import { View, ViewProps } from 'react-native';

interface CardProps extends ViewProps {
    variant?: 'default' | 'glass' | 'outlined';
}

export function Card({
    variant = 'default',
    className,
    children,
    ...props
}: CardProps) {
    const baseStyles = 'rounded-card p-4';

    const variants = {
        default: 'bg-bg-secondary',
        glass: 'bg-bg-secondary/80 border-t border-white/5', // Simula glassmorphism semplice
        outlined: 'bg-transparent border border-bg-tertiary',
    };

    return (
        <View
            className={`${baseStyles} ${variants[variant]} ${className || ''}`}
            {...props}
        >
            {children}
        </View>
    );
}
