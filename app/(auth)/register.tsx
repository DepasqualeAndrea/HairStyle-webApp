import { useState } from 'react';
import { View, Text, TextInput, TouchableOpacity, Alert, ScrollView } from 'react-native';
import { signUp } from '@/lib/supabase-queries';
import { router } from 'expo-router';
import { clsx } from 'clsx';

export default function RegisterScreen() {
    const [name, setName] = useState('');
    const [phone, setPhone] = useState('');
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [loading, setLoading] = useState(false);

    const handleSignUp = async () => {
        // Validation
        if (!name || !phone || !email || !password) {
            Alert.alert('Error', 'Please fill in all fields');
            return;
        }

        if (password.length < 6) {
            Alert.alert('Error', 'Password must be at least 6 characters');
            return;
        }

        setLoading(true);
        try {
            await signUp(email, password, name, phone);

            Alert.alert(
                'Success',
                'Account created successfully! Please check your email for verification.',
                [{ text: 'OK', onPress: () => router.replace('/(auth)/login') }]
            );
        } catch (err: any) {
            Alert.alert('Registration Failed', err.message || 'An error occurred during registration');
        } finally {
            setLoading(false);
        }
    };

    return (
        <ScrollView className="flex-1 bg-bg-primary" contentContainerStyle={{ padding: 24, justifyContent: 'center', minHeight: '100%' }}>
            <View className="mb-8">
                <Text className="text-white text-3xl font-bold mb-2">Create Account</Text>
                <Text className="text-text-secondary">Join the exclusive club.</Text>
            </View>

            <View className="space-y-4">
                {/* Full Name */}
                <View>
                    <Text className="text-text-secondary mb-2 text-sm uppercase">Full Name</Text>
                    <TextInput
                        className="w-full bg-bg-secondary text-white px-4 py-3 rounded-input border border-gray-800 focus:border-accent-pink"
                        placeholder="John Doe"
                        placeholderTextColor="#64748B"
                        value={name}
                        onChangeText={setName}
                    />
                </View>

                {/* Phone */}
                <View>
                    <Text className="text-text-secondary mb-2 text-sm uppercase">Phone Number</Text>
                    <TextInput
                        className="w-full bg-bg-secondary text-white px-4 py-3 rounded-input border border-gray-800 focus:border-accent-pink"
                        placeholder="+39 333 1234567"
                        placeholderTextColor="#64748B"
                        keyboardType="phone-pad"
                        value={phone}
                        onChangeText={setPhone}
                    />
                </View>

                {/* Email */}
                <View>
                    <Text className="text-text-secondary mb-2 text-sm uppercase">Email Address</Text>
                    <TextInput
                        className="w-full bg-bg-secondary text-white px-4 py-3 rounded-input border border-gray-800 focus:border-accent-pink"
                        placeholder="john@example.com"
                        placeholderTextColor="#64748B"
                        autoCapitalize="none"
                        keyboardType="email-address"
                        value={email}
                        onChangeText={setEmail}
                    />
                </View>

                {/* Password */}
                <View>
                    <Text className="text-text-secondary mb-2 text-sm uppercase">Password</Text>
                    <TextInput
                        className="w-full bg-bg-secondary text-white px-4 py-3 rounded-input border border-gray-800 focus:border-accent-pink"
                        placeholder="At least 6 characters"
                        placeholderTextColor="#64748B"
                        secureTextEntry
                        value={password}
                        onChangeText={setPassword}
                    />
                </View>

                <TouchableOpacity
                    className={clsx(
                        "w-full bg-accent-pink py-4 rounded-button items-center mt-6 shadow-lg shadow-accent-pink/20",
                        loading && "opacity-70"
                    )}
                    onPress={handleSignUp}
                    disabled={loading}
                >
                    <Text className="text-white font-bold text-lg uppercase">
                        {loading ? "Creating..." : "Sign Up"}
                    </Text>
                </TouchableOpacity>

                <View className="flex-row justify-center mt-4">
                    <Text className="text-text-secondary">Already have an account? </Text>
                    <TouchableOpacity onPress={() => router.push('/(auth)/login')}>
                        <Text className="text-accent-pink font-bold ml-1">Log In</Text>
                    </TouchableOpacity>
                </View>
            </View>
        </ScrollView>
    );
}
