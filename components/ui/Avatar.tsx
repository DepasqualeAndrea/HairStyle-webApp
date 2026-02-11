import React from 'react';
import { View, Text, Image, ImageSourcePropType } from 'react-native';

interface AvatarProps {
    source?: ImageSourcePropType | string;
    name?: string;
    size?: 'sm' | 'md' | 'lg' | 'xl';
    showStatus?: boolean;
    statusColor?: string;
    className?: string;
}

export function Avatar({
    source,
    name,
    size = 'md',
    showStatus = false,
    statusColor = '#10B981', // green by default
    className,
}: AvatarProps) {
    const sizes = {
        sm: 'h-10 w-10 text-sm',
        md: 'h-12 w-12 text-base',
        lg: 'h-16 w-16 text-xl',
        xl: 'h-24 w-24 text-3xl',
    };

    const statusSizes = {
        sm: 'h-2.5 w-2.5',
        md: 'h-3 w-3',
        lg: 'h-4 w-4',
        xl: 'h-5 w-5',
    };

    const getInitials = (fullName?: string) => {
        if (!fullName) return '?';
        const parts = fullName.trim().split(' ');
        if (parts.length >= 2) {
            return `${parts[0][0]}${parts[1][0]}`.toUpperCase();
        }
        return fullName[0].toUpperCase();
    };

    return (
        <View className={`relative ${className || ''}`}>
            <View
                className={`${sizes[size]} rounded-full bg-bg-tertiary items-center justify-center overflow-hidden border-2 border-accent-pink/20`}
            >
                {source ? (
                    typeof source === 'string' ? (
                        <Image
                            source={{ uri: source }}
                            className="h-full w-full"
                            resizeMode="cover"
                        />
                    ) : (
                        <Image
                            source={source}
                            className="h-full w-full"
                            resizeMode="cover"
                        />
                    )
                ) : (
                    <Text className={`${sizes[size].split(' ')[2]} font-bold text-text-secondary`}>
                        {getInitials(name)}
                    </Text>
                )}
            </View>

            {showStatus && (
                <View
                    className={`absolute bottom-0 right-0 ${statusSizes[size]} rounded-full border-2 border-bg-primary`}
                    style={{ backgroundColor: statusColor }}
                />
            )}
        </View>
    );
}
