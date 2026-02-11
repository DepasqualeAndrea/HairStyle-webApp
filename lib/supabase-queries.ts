import { supabase } from './supabase';
import type { Service, Product, Appointment, UserProfile } from '@/types';

// ============================================================================
// AUTH
// ============================================================================

export async function signUp(email: string, password: string, fullName: string, phone: string) {
  const { data: authData, error: authError } = await supabase.auth.signUp({
    email,
    password,
  });

  if (authError) throw authError;

  if (!authData.user) throw new Error('User creation failed');

  // Crea profile
  const { error: profileError } = await supabase
    .from('profiles')
    .insert({
      id: authData.user.id,
      full_name: fullName,
      phone,
    });

  if (profileError) throw profileError;

  return authData;
}

export async function signIn(email: string, password: string) {
  return await supabase.auth.signInWithPassword({ email, password });
}

export async function signOut() {
  return await supabase.auth.signOut();
}

// ============================================================================
// SERVICES
// ============================================================================

export async function getServices(gender?: 'uomo' | 'donna') {
  let query = supabase
    .from('services')
    .select('*')
    .eq('is_active', true);

  if (gender) {
    query = query.or(`gender.eq.${gender},gender.eq.unisex`);
  }

  return await query.order('category', { ascending: true });
}

export async function getServiceById(id: string) {
  return await supabase
    .from('services')
    .select('*')
    .eq('id', id)
    .single();
}

// ============================================================================
// APPOINTMENTS
// ============================================================================

export async function createAppointment(data: {
  userId: string;
  staffId: string;
  date: string;
  startTime: string;
  endTime: string;
  services: Service[];
  products?: Product[];
  totalPrice: number;
  paymentMethod: 'online' | 'in_person';
  stripePaymentIntentId?: string;
}) {
  const { data: appointment, error } = await supabase
    .from('appointments')
    .insert({
      user_id: data.userId,
      staff_id: data.staffId,
      appointment_date: data.date,
      start_time: data.startTime,
      end_time: data.endTime,
      total_price: data.totalPrice,
      payment_method: data.paymentMethod,
      stripe_payment_intent_id: data.stripePaymentIntentId,
      status: data.paymentMethod === 'online' ? 'confirmed' : 'pending',
      payment_status: data.paymentMethod === 'online' ? 'paid' : 'pending',
    })
    .select()
    .single();

  if (error) throw error;

  // Insert services
  const serviceInserts = data.services.map(s => ({
    appointment_id: appointment.id,
    service_id: s.id,
    service_name: s.name,
    service_price: s.price,
    service_duration: s.duration_min,
  }));

  await supabase.from('appointment_services').insert(serviceInserts);

  // Insert products if any
  if (data.products && data.products.length > 0) {
    const productInserts = data.products.map(p => ({
      appointment_id: appointment.id,
      product_id: p.id,
      product_name: p.name,
      product_price: p.price,
      quantity: 1,
    }));

    await supabase.from('appointment_products').insert(productInserts);
  }

  return appointment;
}

export async function getUserAppointments(userId: string) {
  return await supabase
    .from('appointments')
    .select(`
      *,
      staff:staff_id(*),
      appointment_services(*)
    `)
    .eq('user_id', userId)
    .order('appointment_date', { ascending: false });
}

export async function updateAppointmentStatus(
  appointmentId: string,
  status: 'pending' | 'confirmed' | 'cancelled' | 'completed' | 'no_show'
) {
  return await supabase
    .from('appointments')
    .update({ status })
    .eq('id', appointmentId);
}

// ============================================================================
// PRODUCTS
// ============================================================================

export async function getProducts() {
  return await supabase
    .from('products')
    .select('*')
    .eq('is_active', true);
}

export async function getProductById(id: string) {
  return await supabase
    .from('products')
    .select('*')
    .eq('id', id)
    .single();
}

// ============================================================================
// LOYALTY
// ============================================================================

export async function addLoyaltyPoints(
  userId: string,
  points: number,
  reason: string,
  appointmentId?: string
) {
  // Add to history
  await supabase.from('loyalty_history').insert({
    user_id: userId,
    points_change: points,
    reason,
    appointment_id: appointmentId,
  });

  // Update profile loyalty points
  const { data: profile } = await supabase
    .from('profiles')
    .select('loyalty_points')
    .eq('id', userId)
    .single();

  if (!profile) throw new Error('Profile not found');

  await supabase
    .from('profiles')
    .update({ loyalty_points: (profile.loyalty_points || 0) + points })
    .eq('id', userId);
}

export async function getLoyaltyHistory(userId: string) {
  return await supabase
    .from('loyalty_history')
    .select('*')
    .eq('user_id', userId)
    .order('created_at', { ascending: false });
}

// ============================================================================
// PROFILE
// ============================================================================

export async function getUserProfile(userId: string) {
  return await supabase
    .from('profiles')
    .select('*')
    .eq('id', userId)
    .single();
}

export async function updateUserProfile(
  userId: string,
  updates: { full_name?: string; phone?: string; avatar_url?: string }
) {
  return await supabase
    .from('profiles')
    .update(updates)
    .eq('id', userId);
}

// ============================================================================
// STAFF
// ============================================================================

export async function getStaff() {
  return await supabase
    .from('staff')
    .select('*')
    .eq('is_active', true);
}

export async function getStaffById(id: string) {
  return await supabase
    .from('staff')
    .select('*')
    .eq('id', id)
    .single();
}

// ============================================================================
// CUSTOMER NOTES (Admin)
// ============================================================================

export async function getCustomerNotes(userId: string) {
  return await supabase
    .from('customer_notes')
    .select('*')
    .eq('user_id', userId)
    .order('created_at', { ascending: false});
}

export async function addCustomerNote(
  userId: string,
  noteType: 'color_formula' | 'allergy' | 'preference' | 'general',
  content: string,
  createdBy: string
) {
  return await supabase.from('customer_notes').insert({
    user_id: userId,
    note_type: noteType,
    content,
    created_by: createdBy,
  });
}
