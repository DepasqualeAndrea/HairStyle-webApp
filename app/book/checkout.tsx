import React, { useState } from 'react';
import { View, Text, ScrollView, Pressable, Alert, ActivityIndicator } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useRouter } from 'expo-router';
import { useBookingStore } from '@/store/booking';
import { formatDuration, formatPrice } from '@/utils/booking';
import { usePayment } from '@/lib/stripe';
import { createAppointment } from '@/lib/supabase-queries';
import { addLoyaltyPoints } from '@/lib/supabase-queries';
import { useAuth } from '@/context/auth';
import { useLoyalty } from '@/hooks/useLoyalty';
import { getUserTier, getTierDiscount, getTierBadge } from '@/lib/loyalty';
import { Button } from '@/components/ui/Button';
import { Card } from '@/components/ui/Card';
import { Badge } from '@/components/ui/Badge';
import { BookingSteps } from '@/components/ui/BookingSteps';
import { ArrowLeft, Calendar, Clock, CreditCard, Smartphone, Banknote, Check } from 'lucide-react-native';

type PaymentMethod = 'pay_now' | 'pay_in_store';
type PaymentOption = 'apple_pay' | 'google_pay' | 'card' | 'cash' | 'pos';

export default function Checkout() {
    const router = useRouter();
    const { user } = useAuth();
    const { points } = useLoyalty();
    const { initializePaymentSheet, processPayment } = usePayment();
    const {
        selectedServices,
        selectedStaff,
        selectedDate,
        selectedTimeSlot,
        getTotalPrice,
        getTotalDuration,
        resetBooking,
    } = useBookingStore();

    const [paymentMethod, setPaymentMethod] = useState<PaymentMethod>('pay_now');
    const [selectedPaymentOption, setSelectedPaymentOption] = useState<PaymentOption>('card');
    const [acceptedSecurePayment, setAcceptedSecurePayment] = useState(false);
    const [processing, setProcessing] = useState(false);

    // Calculate discounts
    const totalPrice = getTotalPrice();
    const currentTier = getUserTier(points);
    const tierDiscount = getTierDiscount(currentTier);
    const onlinePaymentDiscount = paymentMethod === 'pay_now' ? 0.05 : 0;

    // Apply both discounts (tier + online payment)
    const totalDiscount = tierDiscount + onlinePaymentDiscount;
    const finalPrice = Math.round(totalPrice * (1 - totalDiscount));

    // Formatta la data come "OTT 24 Martedì"
    const formattedDate = selectedDate
        ? new Date(selectedDate).toLocaleDateString('it-IT', {
              day: 'numeric',
              month: 'short',
              weekday: 'long',
          })
        : 'Data non selezionata';

    const handleConfirmBooking = async () => {
        if (!user) {
            Alert.alert('Error', 'You must be logged in to book an appointment');
            router.replace('/(auth)/login');
            return;
        }

        if (!selectedStaff || !selectedDate || !selectedTimeSlot) {
            Alert.alert('Error', 'Missing booking information. Please try again.');
            return;
        }

        setProcessing(true);

        try {
            let stripePaymentIntentId: string | undefined;

            // PAYMENT FLOW
            if (paymentMethod === 'pay_now') {
                // 1. Initialize Stripe Payment Sheet
                const paymentIntentId = await initializePaymentSheet(finalPrice, {
                    userId: user.id,
                    staffId: selectedStaff.id,
                    date: selectedDate,
                });

                // 2. Present Payment Sheet to user
                const result = await processPayment();

                if (!result.success) {
                    if (result.canceled) {
                        setProcessing(false);
                        return; // User canceled, no error
                    }
                    throw new Error('Payment failed');
                }

                stripePaymentIntentId = paymentIntentId;
            }

            // 3. Create appointment in database
            const appointment = await createAppointment({
                userId: user.id,
                staffId: selectedStaff.id,
                date: selectedDate,
                startTime: selectedTimeSlot.startTime,
                endTime: selectedTimeSlot.endTime,
                services: selectedServices,
                products: [], // TODO: Add products when shop is implemented
                totalPrice: finalPrice,
                paymentMethod: paymentMethod === 'pay_now' ? 'online' : 'in_person',
                stripePaymentIntentId,
            });

            // 4. Add loyalty points (1 point per euro spent)
            const pointsEarned = Math.floor(finalPrice / 100);
            if (pointsEarned > 0) {
                await addLoyaltyPoints(
                    user.id,
                    pointsEarned,
                    'Appointment booking',
                    appointment.id
                );
            }

            // 5. Success! Clear booking and navigate
            resetBooking();

            Alert.alert(
                'Booking Confirmed! 🎉',
                `Your appointment has been confirmed for ${new Date(selectedDate).toLocaleDateString('it-IT')}.${
                    pointsEarned > 0 ? `\n\nYou earned ${pointsEarned} loyalty points!` : ''
                }`,
                [
                    {
                        text: 'View Bookings',
                        onPress: () => router.replace('/(tabs)/bookings'),
                    },
                ]
            );
        } catch (error: any) {
            console.error('Booking error:', error);
            Alert.alert(
                'Booking Failed',
                error.message || 'An error occurred while creating your appointment. Please try again.'
            );
        } finally {
            setProcessing(false);
        }
    };

    const PaymentMethodCard = ({
        method,
        title,
        badge,
        options,
    }: {
        method: PaymentMethod;
        title: string;
        badge?: string;
        options: { id: PaymentOption; label: string; icon: React.ReactNode }[];
    }) => {
        const isSelected = paymentMethod === method;

        return (
            <Pressable onPress={() => setPaymentMethod(method)} className="mb-4">
                <Card
                    variant={isSelected ? 'outlined' : 'default'}
                    className={`p-4 ${isSelected ? 'border-accent-pink bg-accent-pink/5' : ''}`}
                >
                    <View className="flex-row items-center justify-between mb-3">
                        <View className="flex-row items-center flex-1">
                            <View
                                className={`h-6 w-6 rounded-full border-2 mr-3 items-center justify-center ${
                                    isSelected ? 'bg-accent-pink border-accent-pink' : 'border-bg-tertiary'
                                }`}
                            >
                                {isSelected && <View className="h-3 w-3 rounded-full bg-bg-primary" />}
                            </View>
                            <Text className="text-text-primary font-bold text-base">{title}</Text>
                        </View>
                        {badge && <Badge label={badge} variant="gold" size="sm" />}
                    </View>

                    {isSelected && (
                        <View className="ml-9 space-y-2">
                            {options.map((option) => (
                                <Pressable
                                    key={option.id}
                                    onPress={() => setSelectedPaymentOption(option.id)}
                                    className={`flex-row items-center p-3 rounded-lg ${
                                        selectedPaymentOption === option.id
                                            ? 'bg-accent-pink/10 border border-accent-pink'
                                            : 'bg-bg-tertiary border border-transparent'
                                    }`}
                                >
                                    {option.icon}
                                    <Text
                                        className={`ml-3 font-medium ${
                                            selectedPaymentOption === option.id
                                                ? 'text-accent-pink'
                                                : 'text-text-secondary'
                                        }`}
                                    >
                                        {option.label}
                                    </Text>
                                    {selectedPaymentOption === option.id && (
                                        <View className="ml-auto">
                                            <Check size={18} color="#FF4D6D" strokeWidth={3} />
                                        </View>
                                    )}
                                </Pressable>
                            ))}
                        </View>
                    )}
                </Card>
            </Pressable>
        );
    };

    return (
        <SafeAreaView className="flex-1 bg-bg-primary">
            {/* Header */}
            <View className="flex-row items-center px-5 py-4 border-b border-bg-tertiary">
                <Pressable
                    onPress={() => router.back()}
                    className="h-10 w-10 bg-bg-secondary rounded-full items-center justify-center mr-3"
                >
                    <ArrowLeft size={20} color="#FF4D6D" />
                </Pressable>
                <Text className="text-h2 text-text-primary font-bold">Checkout</Text>
            </View>

            {/* Booking Steps */}
            <BookingSteps currentStep={5} />

            <ScrollView className="flex-1" contentContainerStyle={{ paddingBottom: 120 }}>
                {/* Booking Summary Card */}
                <View className="px-5 pt-6 pb-4">
                    <Text className="text-h3 text-text-primary font-bold mb-4">
                        Riepilogo Prenotazione
                    </Text>
                    <Card variant="glass" className="p-5">
                        {/* Date & Time */}
                        <View className="flex-row items-center mb-4">
                            <View className="h-12 w-12 bg-accent-pink/20 rounded-full items-center justify-center mr-3">
                                <Calendar size={20} color="#FF4D6D" />
                            </View>
                            <View>
                                <Text className="text-text-tertiary text-xs mb-1">Data e Ora</Text>
                                <Text className="text-text-primary font-bold text-base capitalize">
                                    {formattedDate}
                                </Text>
                                <Text className="text-accent-pink font-semibold">
                                    {selectedTimeSlot
                                        ? new Date(selectedTimeSlot.startTime).toLocaleTimeString('it-IT', {
                                              hour: '2-digit',
                                              minute: '2-digit',
                                          })
                                        : 'Orario non selezionato'}
                                </Text>
                            </View>
                        </View>

                        <View className="h-[1px] bg-bg-tertiary mb-4" />

                        {/* Services */}
                        <Text className="text-text-tertiary text-xs mb-2">Servizi Selezionati</Text>
                        {selectedServices.map((service) => (
                            <View key={service.id} className="flex-row justify-between mb-2">
                                <View className="flex-1">
                                    <Text className="text-text-primary font-medium">{service.name}</Text>
                                    <Text className="text-text-tertiary text-xs">
                                        {formatDuration(service.duration)}
                                    </Text>
                                </View>
                                <Text className="text-text-primary font-semibold">
                                    {formatPrice(service.price)}
                                </Text>
                            </View>
                        ))}

                        <View className="h-[1px] bg-bg-tertiary my-4" />

                        {/* Stylist */}
                        <View className="flex-row items-center mb-4">
                            <View className="h-12 w-12 bg-accent-pink/20 rounded-full items-center justify-center mr-3">
                                <Text className="text-xl">✂️</Text>
                            </View>
                            <View>
                                <Text className="text-text-tertiary text-xs mb-1">Il tuo Stilista</Text>
                                <Text className="text-text-primary font-bold">
                                    {selectedStaff?.name || 'Hair Style Expert'}
                                </Text>
                            </View>
                        </View>

                        <View className="h-[1px] bg-bg-tertiary mb-4" />

                        {/* Total Duration */}
                        <View className="flex-row items-center justify-between mb-4">
                            <View className="flex-row items-center">
                                <Clock size={16} color="#9CA3AF" />
                                <Text className="text-text-secondary ml-2">Durata totale</Text>
                            </View>
                            <Text className="text-text-primary font-semibold">
                                {formatDuration(getTotalDuration())}
                            </Text>
                        </View>

                        {/* Subtotal */}
                        <View className="flex-row justify-between mb-2">
                            <Text className="text-text-secondary">Subtotale</Text>
                            <Text className="text-text-primary font-semibold">{formatPrice(totalPrice)}</Text>
                        </View>

                        {/* Tier Discount */}
                        {tierDiscount > 0 && (
                            <View className="flex-row justify-between mb-2">
                                <View className="flex-row items-center">
                                    <Text className="text-accent-pink">
                                        Sconto {getTierBadge(currentTier).emoji} {currentTier}
                                    </Text>
                                    <Badge
                                        label={`-${Math.round(tierDiscount * 100)}%`}
                                        variant="gold"
                                        size="sm"
                                        className="ml-2"
                                    />
                                </View>
                                <Text className="text-accent-pink font-semibold">
                                    -{formatPrice(Math.round(totalPrice * tierDiscount))}
                                </Text>
                            </View>
                        )}

                        {/* Online Payment Discount */}
                        {onlinePaymentDiscount > 0 && (
                            <View className="flex-row justify-between mb-2">
                                <View className="flex-row items-center">
                                    <Text className="text-accent-pink">Sconto pagamento online</Text>
                                    <Badge label="-5%" variant="gold" size="sm" className="ml-2" />
                                </View>
                                <Text className="text-accent-pink font-semibold">
                                    -{formatPrice(Math.round(totalPrice * onlinePaymentDiscount))}
                                </Text>
                            </View>
                        )}

                        <View className="h-[1px] bg-bg-tertiary my-3" />

                        {/* Total */}
                        <View className="flex-row justify-between">
                            <Text className="text-text-primary font-bold text-lg">Totale</Text>
                            <Text className="text-accent-pink font-bold text-xl">
                                {formatPrice(finalPrice)}
                            </Text>
                        </View>
                    </Card>
                </View>

                {/* Payment Method */}
                <View className="px-5 pb-4">
                    <Text className="text-h3 text-text-primary font-bold mb-4">
                        Metodo di Pagamento
                    </Text>

                    <PaymentMethodCard
                        method="pay_now"
                        title="Paga Ora Online"
                        badge="-5% SCONTO"
                        options={[
                            {
                                id: 'apple_pay',
                                label: 'Apple Pay',
                                icon: <Smartphone size={20} color="#9CA3AF" />,
                            },
                            {
                                id: 'google_pay',
                                label: 'Google Pay',
                                icon: <Smartphone size={20} color="#9CA3AF" />,
                            },
                            {
                                id: 'card',
                                label: 'Carta di Credito/Debito',
                                icon: <CreditCard size={20} color="#9CA3AF" />,
                            },
                        ]}
                    />

                    <PaymentMethodCard
                        method="pay_in_store"
                        title="Paga in Struttura"
                        options={[
                            {
                                id: 'cash',
                                label: 'Contanti',
                                icon: <Banknote size={20} color="#9CA3AF" />,
                            },
                            {
                                id: 'pos',
                                label: 'Carta (POS)',
                                icon: <CreditCard size={20} color="#9CA3AF" />,
                            },
                        ]}
                    />
                </View>

                {/* Secure Payment Checkbox */}
                <View className="px-5 pb-4">
                    <Pressable
                        onPress={() => setAcceptedSecurePayment(!acceptedSecurePayment)}
                        className="flex-row items-start"
                    >
                        <View
                            className={`h-5 w-5 rounded border-2 items-center justify-center mr-3 mt-0.5 ${
                                acceptedSecurePayment
                                    ? 'bg-accent-pink border-accent-pink'
                                    : 'border-bg-tertiary'
                            }`}
                        >
                            {acceptedSecurePayment && (
                                <Check size={12} color="#0F0F0F" strokeWidth={3} />
                            )}
                        </View>
                        <Text className="flex-1 text-text-secondary text-sm">
                            Confermo di aver letto e accettato la{' '}
                            <Text className="text-accent-pink underline">politica di cancellazione</Text> e
                            che il pagamento è sicuro e protetto
                        </Text>
                    </Pressable>
                </View>

                {/* Cancellation Policy */}
                <View className="px-5 pb-6">
                    <Card className="p-4 bg-bg-tertiary/30">
                        <Text className="text-text-primary font-semibold mb-2">
                            📋 Politica di Cancellazione
                        </Text>
                        <Text className="text-text-secondary text-xs leading-5">
                            • Cancellazione gratuita fino a 24 ore prima dell'appuntamento{'\n'}
                            • Cancellazioni entro 24 ore: penale del 50%{'\n'}
                            • No-show: addebito del 100% del servizio{'\n'}
                            • Modifiche consentite fino a 12 ore prima
                        </Text>
                    </Card>
                </View>
            </ScrollView>

            {/* Bottom CTA */}
            <View className="absolute bottom-0 left-0 right-0 bg-bg-secondary border-t border-bg-tertiary px-5 py-4">
                <Button
                    label={
                        processing
                            ? 'Processing...'
                            : `Conferma Prenotazione • ${formatPrice(finalPrice)}`
                    }
                    onPress={handleConfirmBooking}
                    variant="primary"
                    disabled={!acceptedSecurePayment || processing}
                />
                {processing && (
                    <View className="flex-row items-center justify-center mt-2">
                        <ActivityIndicator size="small" color="#FF4D6D" />
                        <Text className="text-text-secondary text-sm ml-2">
                            {paymentMethod === 'pay_now'
                                ? 'Processing payment...'
                                : 'Creating appointment...'}
                        </Text>
                    </View>
                )}
            </View>
        </SafeAreaView>
    );
}
