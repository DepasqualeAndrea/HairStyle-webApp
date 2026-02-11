/**
 * Test Script per verificare connessione Supabase
 * Esegui con: npx ts-node test-supabase.ts
 */

import { createClient } from '@supabase/supabase-js';

const supabaseUrl = process.env.EXPO_PUBLIC_SUPABASE_URL || '';
const supabaseAnonKey = process.env.EXPO_PUBLIC_SUPABASE_ANON_KEY || '';

console.log('🔍 Testing Supabase Connection...\n');
console.log('📍 URL:', supabaseUrl);
console.log('🔑 Anon Key (first 20 chars):', supabaseAnonKey.substring(0, 20) + '...');
console.log('🔑 Key format:', supabaseAnonKey.startsWith('eyJ') ? '✅ JWT format (correct)' : '⚠️ Unexpected format');

const supabase = createClient(supabaseUrl, supabaseAnonKey);

async function testConnection() {
  try {
    console.log('\n📡 Testing database connection...');

    // Test 1: Check if we can query the database
    const { data, error } = await supabase.from('profiles').select('count');

    if (error) {
      console.error('❌ Database query failed:', error.message);
      console.error('   Code:', error.code);
      console.error('   Details:', error.details);
      console.error('   Hint:', error.hint);
      return;
    }

    console.log('✅ Database connection successful!');
    console.log('   Profiles table accessible');

    // Test 2: Try to sign up a test user
    console.log('\n📝 Testing user registration...');
    const testEmail = `test_${Date.now()}@example.com`;
    const testPassword = 'Test123456!';

    const { data: authData, error: authError } = await supabase.auth.signUp({
      email: testEmail,
      password: testPassword,
    });

    if (authError) {
      console.error('❌ Registration failed:', authError.message);
      console.error('   Status:', authError.status);

      if (authError.message.includes('Email not confirmed')) {
        console.log('ℹ️  Email confirmation is required in Supabase settings');
      }
      return;
    }

    console.log('✅ Registration successful!');
    console.log('   User ID:', authData.user?.id);
    console.log('   Email:', authData.user?.email);

    // Test 3: Try to sign in
    console.log('\n🔐 Testing login...');
    const { data: loginData, error: loginError } = await supabase.auth.signInWithPassword({
      email: testEmail,
      password: testPassword,
    });

    if (loginError) {
      console.error('❌ Login failed:', loginError.message);
      return;
    }

    console.log('✅ Login successful!');
    console.log('   Access token (first 20 chars):', loginData.session?.access_token.substring(0, 20) + '...');

    // Cleanup
    await supabase.auth.signOut();
    console.log('\n✅ All tests passed! Supabase is configured correctly.');

  } catch (error: any) {
    console.error('\n❌ Unexpected error:', error.message);
    console.error('   Stack:', error.stack);
  }
}

testConnection();
