import { useState } from 'react';
import { View, Text, TextInput, TouchableOpacity, Alert, Image, StatusBar } from 'react-native';
import { signIn } from '@/lib/supabase-queries';
import { router } from 'expo-router';
import { clsx } from 'clsx';

export default function LoginScreen() {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [loading, setLoading] = useState(false);

    const handleSignIn = async () => {
        if (!email || !password) {
            Alert.alert('Error', 'Please fill in all fields');
            return;
        }

        setLoading(true);
        try {
            const { error } = await signIn(email, password);

            if (error) {
                Alert.alert('Login Failed', error.message);
            }
            // Auth context will handle navigation automatically
        } catch (err: any) {
            Alert.alert('Error', err.message || 'An error occurred during login');
        } finally {
            setLoading(false);
        }
    };

    return (
        <View className="flex-1 bg-bg-primary justify-center px-8 relative">
            <StatusBar barStyle="light-content" />

            {/* Decorative gradient or shape? Using simple solid for now */}

            {/* Brand Title */}
            <View className="mb-12 items-center">
                <Text className="text-white text-4xl font-bold tracking-widest font-display">HAIR</Text>
                <Text className="text-accent-pink text-3xl font-light italic font-serif -mt-2">Style</Text>
            </View>

            <View className="space-y-6">
                <View>
                    <Text className="text-text-secondary mb-2 text-sm font-medium uppercase tracking-wide">Email</Text>
                    <TextInput
                        className="w-full bg-bg-secondary text-white px-5 py-4 rounded-input border border-gray-800 focus:border-accent-pink transition-colors"
                        placeholder="example@email.com"
                        placeholderTextColor="#64748B"
                        autoCapitalize="none"
                        value={email}
                        onChangeText={setEmail}
                    />
                </View>

                <View>
                    <Text className="text-text-secondary mb-2 text-sm font-medium uppercase tracking-wide">Password</Text>
                    <TextInput
                        className="w-full bg-bg-secondary text-white px-5 py-4 rounded-input border border-gray-800 focus:border-accent-pink transition-colors"
                        placeholder="••••••••"
                        placeholderTextColor="#64748B"
                        secureTextEntry
                        value={password}
                        onChangeText={setPassword}
                    />
                </View>

                <TouchableOpacity
                    className={clsx(
                        "w-full bg-accent-pink py-4 rounded-button items-center shadow-lg shadow-accent-pink/30 mt-4 active:bg-accent-pink-dark transform active:scale-95 transition-all",
                        loading && "opacity-70"
                    )}
                    onPress={handleSignIn}
                    disabled={loading}
                >
                    <Text className="text-white font-bold text-lg tracking-wide uppercase">
                        {loading ? "Signing In..." : "Sign In"}
                    </Text>
                </TouchableOpacity>

                <View className="flex-row justify-center mt-6">
                    <Text className="text-text-secondary">New user? </Text>
                    <TouchableOpacity onPress={() => router.push('/(auth)/register')}>
                        <Text className="text-accent-pink font-bold ml-1">Create Account</Text>
                    </TouchableOpacity>
                </View>
            </View>
        </View>
    );
}
