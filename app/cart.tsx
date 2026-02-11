import { View, Text, FlatList, TouchableOpacity, StatusBar } from 'react-native';
import { useCartStore } from '@/store/cartStore';
import { useRouter } from 'expo-router';
import { Trash2, Calendar, CreditCard } from 'lucide-react-native';
import clsx from 'clsx';

export default function CartScreen() {
    const router = useRouter();
    const { services, products, cartTotal, totalDuration, removeService, removeProduct } = useCartStore();
    const isEmpty = services.length === 0 && products.length === 0;

    const renderItem = ({ item, type }: { item: any, type: 'service' | 'product' }) => (
        <View className="flex-row items-center justify-between bg-bg-secondary p-4 rounded-xl mb-3 border border-white/5">
            <View className="flex-1">
                <Text className="text-white font-bold">{item.name}</Text>
                <Text className="text-text-secondary text-sm">€{item.price}</Text>
            </View>
            <TouchableOpacity
                onPress={() => type === 'service' ? removeService(item.id) : removeProduct(item.id)}
                className="p-2 bg-red-500/10 rounded-full"
            >
                <Trash2 size={16} color="#EF4444" />
            </TouchableOpacity>
        </View>
    );

    return (
        <View className="flex-1 bg-bg-primary px-6 pt-16">
            <StatusBar barStyle="light-content" />

            <View className="flex-row justify-between items-center mb-8">
                <Text className="text-white text-3xl font-display font-bold">Your Cart</Text>
                <TouchableOpacity onPress={() => router.back()}>
                    <Text className="text-accent-pink font-bold">Close</Text>
                </TouchableOpacity>
            </View>

            {isEmpty ? (
                <View className="flex-1 justify-center items-center">
                    <Text className="text-text-secondary text-lg mb-4">Your cart is empty.</Text>
                    <TouchableOpacity
                        className="bg-accent-pink px-6 py-3 rounded-full"
                        onPress={() => router.back()}
                    >
                        <Text className="text-white font-bold">Add Services</Text>
                    </TouchableOpacity>
                </View>
            ) : (
                <>
                    <View className="flex-1">
                        <Text className="text-text-secondary uppercase text-xs tracking-widest mb-4">Selected Items</Text>

                        {/* Services */}
                        {services.map(s => (
                            <View key={s.id}>{renderItem({ item: s, type: 'service' })}</View>
                        ))}

                        {/* Products */}
                        {products.map(p => (
                            <View key={p.id}>{renderItem({ item: p, type: 'product' })}</View>
                        ))}
                    </View>

                    {/* Summary Footer */}
                    <View className="bg-bg-secondary p-6 rounded-t-3xl border-t border-white/10 -mx-6">
                        <View className="flex-row justify-between mb-2">
                            <Text className="text-text-secondary">Duration Estimate</Text>
                            <Text className="text-white font-medium">{totalDuration} min</Text>
                        </View>
                        <View className="flex-row justify-between mb-6">
                            <Text className="text-text-secondary">Total</Text>
                            <Text className="text-accent-pink text-2xl font-bold">€{cartTotal}</Text>
                        </View>

                        <TouchableOpacity
                            className="bg-accent-pink w-full py-4 rounded-xl items-center flex-row justify-center space-x-2 shadow-lg shadow-accent-pink/20"
                            onPress={() => router.push('/book')}
                        >
                            <Calendar color="white" size={20} />
                            <Text className="text-white font-bold text-lg uppercase tracking-wider ml-2">Checkout</Text>
                        </TouchableOpacity>
                    </View>
                </>
            )}
        </View>
    );
}
