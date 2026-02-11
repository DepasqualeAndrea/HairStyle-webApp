import { View, Text, FlatList, Image, TouchableOpacity, StatusBar } from 'react-native';
import { useCatalog } from '@/hooks/useCatalog';
import { useCartStore } from '@/store/cartStore';
import { useAuth } from '@/context/auth';
import { Link, useRouter } from 'expo-router';
// Import Icons
import { ShoppingBag, Scissors, Droplet, Star } from 'lucide-react-native'; // Assuming lucide-react-native icons

// Temporary local hook if useCatalog fails
import { useState, useEffect } from 'react';

export default function HomeScreen() {
    const { user } = useAuth();
    const router = useRouter();
    // Using direct Supabase fetch via hook created previously
    // If hook is not working, we can use local state

    // Real implementation:
    const allServices = [
        { id: '1', name: 'Fade Cut', price: 30, duration_min: 45, category: 'Hair', target_gender: 'Male', image: 'https://images.unsplash.com/photo-1599351431202-1e0f0137899a?w=800' },
        { id: '2', name: 'Beard Trim', price: 20, duration_min: 30, category: 'Beard', target_gender: 'Male', image: 'https://images.unsplash.com/photo-1621605815971-fbc98d665033?w=800' },
        { id: '3', name: 'Taglio & Piega', price: 60, duration_min: 60, category: 'Hair', target_gender: 'Female', image: 'https://images.unsplash.com/photo-1562322140-8baeececf3df?w=800' },
        { id: '4', name: 'Colore Completo', price: 80, duration_min: 120, category: 'Color', target_gender: 'Female', image: 'https://images.unsplash.com/photo-1560869713-7d0a29430803?w=800' },
        { id: '5', name: 'Royal Shave', price: 45, duration_min: 60, category: 'Treatment', target_gender: 'Male', image: 'https://images.unsplash.com/photo-1503951914875-452162b0f3f1?w=800' },
    ];

    const [selectedGender, setSelectedGender] = useState<'All' | 'Male' | 'Female'>('All');
    const [services, setServices] = useState(allServices);

    useEffect(() => {
        if (selectedGender === 'All') {
            setServices(allServices);
        } else {
            setServices(allServices.filter(s => s.target_gender === selectedGender || s.target_gender === 'Unisex'));
        }
    }, [selectedGender]);

    const { services: cartServices, addService } = useCartStore();

    const handleBook = (service: any) => {
        addService({ ...service, id: service.id }); // Add to cart
        router.push('/book'); // Go to booking flow
    };

    const renderServiceItem = ({ item }: { item: any }) => (
        <View className="mb-4 bg-bg-secondary p-4 rounded-card border border-gray-800/50 flex-row items-center">
            {/* Image - Square & Compact */}
            <Image source={{ uri: item.image }} className="w-20 h-20 rounded-xl bg-gray-900" resizeMode="cover" />

            {/* Content */}
            <View className="flex-1 ml-4 justify-between h-20 py-1">
                <View>
                    <Text className="text-white font-bold text-lg leading-tight">{item.name}</Text>
                    <View className="flex-row items-center mt-1">
                        <Text className="text-text-secondary text-xs uppercase tracking-wide mr-3">{item.category}</Text>
                        <View className="flex-row items-center">
                            <Scissors size={12} color="#94A3B8" />
                            <Text className="text-text-secondary text-xs ml-1">{item.duration_min} min</Text>
                        </View>
                    </View>
                </View>

                <Text className="text-accent-pink font-bold text-lg">€{item.price}</Text>
            </View>

            {/* Action */}
            <TouchableOpacity
                className="bg-accent-pink px-4 py-2 rounded-full shadow-lg shadow-accent-pink/20 active:scale-95 transition-all"
                onPress={() => handleBook(item)}
            >
                <Text className="text-white font-bold text-xs uppercase">Prenota</Text>
            </TouchableOpacity>
        </View>
    );

    return (
        <View className="flex-1 bg-bg-primary h-full">
            <StatusBar barStyle="light-content" />

            {/* Premium Header - Glassmorphism */}
            <View className="px-6 pt-14 pb-4 bg-bg-primary/80 blur-xl border-b border-white/5 z-20 flex-row justify-between items-center sticky top-0">
                <View>
                    <Text className="text-accent-pink text-xs font-bold tracking-widest uppercase mb-0.5">Hair</Text>
                    <Text className="text-white text-3xl font-display font-bold tracking-tighter">Style</Text>
                </View>
                <TouchableOpacity
                    className="p-3 bg-white/5 rounded-full border border-white/10 relative"
                    onPress={() => router.push('/cart')}
                >
                    <ShoppingBag color="#FFFFFF" size={20} />
                    {cartServices.length > 0 && (
                        <View className="absolute top-0 right-0 bg-accent-pink w-4 h-4 rounded-full justify-center items-center border border-bg-primary">
                            <Text className="text-white text-[9px] font-bold">{cartServices.length}</Text>
                        </View>
                    )}
                </TouchableOpacity>
            </View>

            <FlatList
                data={services}
                renderItem={renderServiceItem}
                keyExtractor={item => item.id}
                contentContainerStyle={{ paddingHorizontal: 24, paddingBottom: 100, paddingTop: 20 }}
                showsVerticalScrollIndicator={false}
                ListHeaderComponent={
                    <>
                        {/* Hero Section - More subtle, less noise */}
                        <View className="mb-10 w-full aspect-[2/1] rounded-3xl overflow-hidden relative shadow-2xl shadow-black">
                            <Image
                                source={{ uri: 'https://images.unsplash.com/photo-1621605815971-fbc98d665033?w=1200' }}
                                className="w-full h-full opacity-60"
                                resizeMode="cover"
                            />
                            <View className="absolute inset-0 bg-gradient-to-t from-bg-primary via-bg-primary/20 to-transparent" />

                            <View className="absolute bottom-6 left-6 right-6">
                                <Text className="text-white/80 text-sm font-medium mb-1 tracking-wider uppercase">Benvenuto, {user?.user_metadata?.full_name?.split(' ')[0] || 'Guest'}</Text>
                                <Text className="text-white text-3xl font-bold leading-tight mb-4">Il tuo stile,{'\n'}elevato al quadrato.</Text>
                            </View>
                        </View>

                        {/* Elegant Filter - Segmented Control */}
                        <View className="flex-row mb-8 bg-bg-secondary/50 p-1.5 rounded-2xl border border-white/5 mx-4">
                            {['All', 'Male', 'Female'].map((gender) => (
                                <TouchableOpacity
                                    key={gender}
                                    className={`flex-1 py-3 items-center rounded-xl transition-all ${selectedGender === gender ? 'bg-bg-secondary border border-white/10 shadow-lg' : 'bg-transparent'}`}
                                    onPress={() => setSelectedGender(gender as any)}
                                >
                                    <Text className={`font-bold text-xs tracking-widest uppercase ${selectedGender === gender ? 'text-accent-pink' : 'text-text-secondary'}`}>
                                        {gender === 'All' ? 'Tutti' : gender === 'Male' ? 'Uomo' : 'Donna'}
                                    </Text>
                                </TouchableOpacity>
                            ))}
                        </View>

                        <View className="flex-row justify-between items-end mb-6 border-b border-white/10 pb-2">
                            <Text className="text-white text-xl font-bold">Listino Servizi</Text>
                            <Text className="text-text-secondary text-xs uppercase tracking-wide mb-1">{services.length} Servizi</Text>
                        </View>
                    </>
                }
            />
        </View>
    );
}
