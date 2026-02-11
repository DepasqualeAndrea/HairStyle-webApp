import React from 'react';
import { Pressable, View, Animated } from 'react-native';

interface ToggleProps {
    value: boolean;
    onValueChange: (value: boolean) => void;
    disabled?: boolean;
    activeColor?: string;
    inactiveColor?: string;
}

export function Toggle({
    value,
    onValueChange,
    disabled = false,
    activeColor = '#FF4D6D', // accent-pink
    inactiveColor = '#2C2C2E', // bg-tertiary
}: ToggleProps) {
    const [animatedValue] = React.useState(new Animated.Value(value ? 1 : 0));

    React.useEffect(() => {
        Animated.spring(animatedValue, {
            toValue: value ? 1 : 0,
            useNativeDriver: false,
            friction: 6,
        }).start();
    }, [value]);

    const translateX = animatedValue.interpolate({
        inputRange: [0, 1],
        outputRange: [2, 22],
    });

    const backgroundColor = animatedValue.interpolate({
        inputRange: [0, 1],
        outputRange: [inactiveColor, activeColor],
    });

    return (
        <Pressable
            onPress={() => !disabled && onValueChange(!value)}
            disabled={disabled}
            className={disabled ? 'opacity-50' : ''}
        >
            <Animated.View
                className="w-12 h-7 rounded-pill p-0.5 justify-center"
                style={{ backgroundColor }}
            >
                <Animated.View
                    className="w-6 h-6 rounded-full bg-white shadow-md"
                    style={{ transform: [{ translateX }] }}
                />
            </Animated.View>
        </Pressable>
    );
}
