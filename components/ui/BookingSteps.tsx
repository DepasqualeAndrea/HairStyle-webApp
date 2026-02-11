import React from 'react';
import { View, Text } from 'react-native';
import { Check } from 'lucide-react-native';

interface BookingStepsProps {
    currentStep: number; // 1-based (1, 2, 3, 4, 5)
    totalSteps?: number;
}

const STEP_LABELS = [
    'Categoria',
    'Servizi',
    'Staff',
    'Data/Ora',
    'Checkout',
];

export function BookingSteps({ currentStep, totalSteps = 5 }: BookingStepsProps) {
    return (
        <View className="px-5 py-4 bg-bg-secondary border-b border-bg-tertiary">
            {/* Step Numbers */}
            <View className="flex-row items-center justify-between mb-3">
                {Array.from({ length: totalSteps }).map((_, index) => {
                    const stepNumber = index + 1;
                    const isCompleted = stepNumber < currentStep;
                    const isCurrent = stepNumber === currentStep;

                    return (
                        <React.Fragment key={stepNumber}>
                            {/* Step Circle */}
                            <View className="items-center">
                                <View
                                    className={`h-10 w-10 rounded-full items-center justify-center border-2 ${
                                        isCompleted
                                            ? 'bg-accent-pink border-accent-pink'
                                            : isCurrent
                                            ? 'border-accent-pink bg-accent-pink/20'
                                            : 'border-bg-tertiary bg-bg-primary'
                                    }`}
                                >
                                    {isCompleted ? (
                                        <Check size={18} color="#0F0F0F" strokeWidth={3} />
                                    ) : (
                                        <Text
                                            className={`font-bold text-sm ${
                                                isCurrent ? 'text-accent-pink' : 'text-text-tertiary'
                                            }`}
                                        >
                                            {stepNumber}
                                        </Text>
                                    )}
                                </View>
                            </View>

                            {/* Connector Line */}
                            {stepNumber < totalSteps && (
                                <View
                                    className={`flex-1 h-[2px] mx-2 ${
                                        isCompleted ? 'bg-accent-pink' : 'bg-bg-tertiary'
                                    }`}
                                />
                            )}
                        </React.Fragment>
                    );
                })}
            </View>

            {/* Current Step Label */}
            <Text className="text-text-secondary text-xs text-center">
                Step {currentStep}/{totalSteps}: {STEP_LABELS[currentStep - 1]}
            </Text>

            {/* Progress Bar */}
            <View className="h-1 bg-bg-tertiary rounded-full mt-3 overflow-hidden">
                <View
                    className="h-full bg-accent-pink"
                    style={{ width: `${(currentStep / totalSteps) * 100}%` }}
                />
            </View>
        </View>
    );
}
