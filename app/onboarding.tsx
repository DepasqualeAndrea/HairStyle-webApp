import React, { useState, useRef } from 'react';
import { View, Text, ScrollView, Dimensions, Pressable, Image } from 'react-native';
import { useRouter } from 'expo-router';
import { ArrowRight } from 'lucide-react-native';

const { width: SCREEN_WIDTH } = Dimensions.get('window');

const slides = [
    {
        title: 'Masterful Cuts.',
        subtitle: 'Timeless Style.',
        description: 'Experience premium grooming tailored to your unique persona in an atmosphere of refined luxury.',
        image: null, // In produzione: foto barbershop luxury
    },
    {
        title: 'Expert Stylists.',
        subtitle: 'Authentic Care.',
        description: 'Book with top-rated professionals who bring decades of expertise and passion to every service.',
        image: null,
    },
    {
        title: 'Your Time,',
        subtitle: 'Your Way.',
        description: 'Smart booking system finds the perfect slot that fits your schedule. No waiting, no hassle.',
        image: null,
    },
];

export default function Onboarding() {
    const router = useRouter();
    const scrollViewRef = useRef<ScrollView>(null);
    const [currentIndex, setCurrentIndex] = useState(0);

    const handleScroll = (event: any) => {
        const offsetX = event.nativeEvent.contentOffset.x;
        const index = Math.round(offsetX / SCREEN_WIDTH);
        setCurrentIndex(index);
    };

    const handleNext = () => {
        if (currentIndex < slides.length - 1) {
            scrollViewRef.current?.scrollTo({
                x: SCREEN_WIDTH * (currentIndex + 1),
                animated: true,
            });
        } else {
            router.replace('/auth');
        }
    };

    const handleSkip = () => {
        router.replace('/auth');
    };

    return (
        <View className="flex-1 bg-bg-primary">
            {/* Skip Button */}
            <Pressable
                onPress={handleSkip}
                className="absolute top-12 right-6 z-10 px-4 py-2"
            >
                <Text className="text-text-secondary font-semibold">SKIP</Text>
            </Pressable>

            {/* Slides */}
            <ScrollView
                ref={scrollViewRef}
                horizontal
                pagingEnabled
                showsHorizontalScrollIndicator={false}
                onScroll={handleScroll}
                scrollEventThrottle={16}
            >
                {slides.map((slide, index) => (
                    <View
                        key={index}
                        className="items-center justify-center px-8"
                        style={{ width: SCREEN_WIDTH }}
                    >
                        {/* Image Placeholder (in produzione: foto vera) */}
                        <View className="h-80 w-full bg-bg-secondary rounded-card mb-8 items-center justify-center">
                            {slide.image ? (
                                <Image source={slide.image} className="h-full w-full rounded-card" />
                            ) : (
                                <Text className="text-text-tertiary text-sm">Luxury Hair Salon</Text>
                            )}
                        </View>

                        {/* Title */}
                        <Text className="text-h1 text-text-primary font-bold text-center mb-2">
                            {slide.title}
                        </Text>
                        <Text className="text-h2 text-accent-pink font-bold italic text-center mb-6">
                            {slide.subtitle}
                        </Text>

                        {/* Description */}
                        <Text className="text-text-secondary text-center text-base leading-6">
                            {slide.description}
                        </Text>
                    </View>
                ))}
            </ScrollView>

            {/* Bottom Navigation */}
            <View className="flex-row items-center justify-between px-8 pb-12">
                {/* Progress Dots */}
                <View className="flex-row items-center">
                    {slides.map((_, index) => (
                        <View
                            key={index}
                            className={`h-2 rounded-full mr-2 ${index === currentIndex
                                ? 'w-8 bg-accent-pink'
                                : 'w-2 bg-bg-tertiary'
                                }`}
                        />
                    ))}
                </View>

                {/* Next Button */}
                <Pressable
                    onPress={handleNext}
                    className="h-14 w-14 bg-accent-pink rounded-full items-center justify-center active:opacity-80"
                >
                    <ArrowRight size={24} color="#0F0F0F" />
                </Pressable>
            </View>
        </View>
    );
}
