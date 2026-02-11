import React, { useState } from 'react';
import { View, Text, ScrollView, Pressable, TextInput, Alert, ActivityIndicator } from 'react-native';
import { useRouter } from 'expo-router';
import { Scissors, Mail, Lock, Eye, EyeOff, Github } from 'lucide-react-native';
import { Button } from '@/components/ui/Button';
import { Input } from '@/components/ui/Input';
import { signIn, signUp } from '@/lib/supabase-queries';

export default function Auth() {
    const router = useRouter();
    const [isLogin, setIsLogin] = useState(true);
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [fullName, setFullName] = useState('');
    const [phone, setPhone] = useState('');
    const [showPassword, setShowPassword] = useState(false);
    const [rememberMe, setRememberMe] = useState(false);
    const [loading, setLoading] = useState(false);

    const handleSubmit = async () => {
        // Validation
        if (!email || !password) {
            Alert.alert('Errore', 'Inserisci email e password');
            return;
        }

        if (!isLogin && (!fullName || !phone)) {
            Alert.alert('Errore', 'Compila tutti i campi per registrarti');
            return;
        }

        if (password.length < 6) {
            Alert.alert('Errore', 'La password deve essere di almeno 6 caratteri');
            return;
        }

        setLoading(true);
        console.log('Auth:', { email, password, isLogin });

        try {
            if (isLogin) {
                // LOGIN
                const { error } = await signIn(email, password);
                if (error) {
                    Alert.alert('Login fallito', error.message);
                    return;
                }
                router.replace('/(tabs)');
            } else {
                // REGISTRAZIONE
                const { session } = await signUp(email, password, fullName, phone);

                if (session) {
                    router.replace('/(tabs)');
                } else {
                    Alert.alert(
                        'Registrazione completata!',
                        'Account creato con successo. Accedi ora.',
                        [{ text: 'OK', onPress: () => setIsLogin(true) }]
                    );
                    // Pulisci i campi
                    setPassword('');
                    setFullName('');
                    setPhone('');
                }
            }
        } catch (err: any) {
            Alert.alert('Errore', err.message || 'Si è verificato un errore');
        } finally {
            setLoading(false);
        }
    };

    const handleSocialLogin = (provider: 'google' | 'github') => {
        console.log('Social login:', provider);
        // TODO: Implementare social auth
        router.replace('/(tabs)');
    };

    return (
        <ScrollView className="flex-1 bg-bg-primary">
            <View className="flex-1 px-6 pt-16 pb-8">
                {/* Logo */}
                <View className="items-center mb-12">
                    <View className="h-20 w-20 rounded-full bg-bg-secondary items-center justify-center border-2 border-accent-pink/30 mb-4">
                        <Scissors size={36} color="#FF4D6D" />
                    </View>
                    <Text className="text-3xl font-bold text-text-primary">Hair Style</Text>
                    <Text className="text-text-secondary text-sm tracking-widest uppercase mt-1">
                        Esperienza Unica
                    </Text>
                </View>

                {/* Tab Switcher */}
                <View className="flex-row bg-bg-secondary rounded-pill p-1 mb-8">
                    <Pressable
                        onPress={() => setIsLogin(true)}
                        className={`flex-1 py-3 rounded-pill items-center ${isLogin ? 'bg-accent-pink' : ''
                            }`}
                    >
                        <Text
                            className={`font-semibold ${isLogin ? 'text-bg-primary' : 'text-text-secondary'
                                }`}
                        >
                            Accedi
                        </Text>
                    </Pressable>
                    <Pressable
                        onPress={() => setIsLogin(false)}
                        className={`flex-1 py-3 rounded-pill items-center ${!isLogin ? 'bg-accent-pink' : ''
                            }`}
                    >
                        <Text
                            className={`font-semibold ${!isLogin ? 'text-bg-primary' : 'text-text-secondary'
                                }`}
                        >
                            Registrati
                        </Text>
                    </Pressable>
                </View>

                {/* Nome Completo (solo per registrazione) */}
                {!isLogin && (
                    <View className="mb-4">
                        <View className="flex-row items-center bg-bg-secondary rounded-2xl px-4 py-4 border border-bg-tertiary">
                            <Text className="text-2xl">👤</Text>
                            <TextInput
                                value={fullName}
                                onChangeText={setFullName}
                                placeholder="Nome Completo"
                                placeholderTextColor="#6B7280"
                                className="flex-1 ml-3 text-text-primary text-base"
                                style={{ outlineStyle: 'none' } as any}
                            />
                        </View>
                    </View>
                )}

                {/* Telefono (solo per registrazione) */}
                {!isLogin && (
                    <View className="mb-4">
                        <View className="flex-row items-center bg-bg-secondary rounded-2xl px-4 py-4 border border-bg-tertiary">
                            <Text className="text-2xl">📱</Text>
                            <TextInput
                                value={phone}
                                onChangeText={setPhone}
                                placeholder="+39 333 1234567"
                                placeholderTextColor="#6B7280"
                                keyboardType="phone-pad"
                                className="flex-1 ml-3 text-text-primary text-base"
                                style={{ outlineStyle: 'none' } as any}
                            />
                        </View>
                    </View>
                )}

                {/* Email Input */}
                <View className="mb-4">
                    <View className="flex-row items-center bg-bg-secondary rounded-2xl px-4 py-4 border border-bg-tertiary">
                        <Mail size={20} color="#9CA3AF" />
                        <TextInput
                            value={email}
                            onChangeText={setEmail}
                            placeholder="Email"
                            placeholderTextColor="#6B7280"
                            keyboardType="email-address"
                            autoCapitalize="none"
                            className="flex-1 ml-3 text-text-primary text-base"
                            style={{ outlineStyle: 'none' } as any}
                        />
                    </View>
                </View>

                {/* Password Input */}
                <View className="mb-4">
                    <View className="flex-row items-center bg-bg-secondary rounded-2xl px-4 py-4 border border-bg-tertiary">
                        <Lock size={20} color="#9CA3AF" />
                        <TextInput
                            value={password}
                            onChangeText={setPassword}
                            placeholder="Password"
                            placeholderTextColor="#6B7280"
                            secureTextEntry={!showPassword}
                            className="flex-1 ml-3 text-text-primary text-base"
                            style={{ outlineStyle: 'none' } as any}
                        />
                        <Pressable onPress={() => setShowPassword(!showPassword)}>
                            {showPassword ? (
                                <EyeOff size={20} color="#9CA3AF" />
                            ) : (
                                <Eye size={20} color="#9CA3AF" />
                            )}
                        </Pressable>
                    </View>
                </View>

                {/* Remember Me & Forgot Password */}
                {isLogin && (
                    <View className="flex-row items-center justify-between mb-6">
                        <Pressable
                            onPress={() => setRememberMe(!rememberMe)}
                            className="flex-row items-center"
                        >
                            <View
                                className={`h-5 w-5 rounded border-2 items-center justify-center mr-2 ${rememberMe
                                    ? 'bg-accent-pink border-accent-pink'
                                    : 'border-bg-tertiary'
                                    }`}
                            >
                                {rememberMe && <Text className="text-bg-primary text-xs font-bold">✓</Text>}
                            </View>
                            <Text className="text-text-secondary text-sm">Ricordami</Text>
                        </Pressable>

                        <Pressable>
                            <Text className="text-accent-pink text-sm font-medium">
                                Password dimenticata?
                            </Text>
                        </Pressable>
                    </View>
                )}

                {/* Submit Button */}
                <Button
                    label={loading ? 'Attendere...' : (isLogin ? 'Entra nel Salone' : 'Crea Account')}
                    onPress={handleSubmit}
                    disabled={loading}
                    className="mb-6"
                />
                {loading && (
                    <View className="items-center mb-4">
                        <ActivityIndicator size="small" color="#FF4D6D" />
                    </View>
                )}

                {/* Divider */}
                <View className="flex-row items-center mb-6">
                    <View className="flex-1 h-[1px] bg-bg-tertiary" />
                    <Text className="text-text-tertiary text-sm mx-4">Oppure accedi con</Text>
                    <View className="flex-1 h-[1px] bg-bg-tertiary" />
                </View>

                {/* Social Login */}
                <View className="flex-row gap-4 mb-8">
                    <Pressable
                        onPress={() => handleSocialLogin('github')}
                        className="flex-1 flex-row items-center justify-center bg-bg-secondary rounded-2xl py-4 border border-bg-tertiary active:bg-bg-tertiary"
                    >
                        <Github size={20} color="#FFFFFF" />
                    </Pressable>
                    <Pressable
                        onPress={() => handleSocialLogin('google')}
                        className="flex-1 flex-row items-center justify-center bg-bg-secondary rounded-2xl py-4 border border-bg-tertiary active:bg-bg-tertiary"
                    >
                        <Text className="text-2xl">G</Text>
                    </Pressable>
                </View>

                {/* Terms */}
                <Text className="text-text-tertiary text-xs text-center">
                    Continuando, accetti i nostri{' '}
                    <Text className="text-accent-pink underline">Termini</Text> e{' '}
                    <Text className="text-accent-pink underline">Privacy Policy</Text>
                </Text>
            </View>
        </ScrollView>
    );
}
