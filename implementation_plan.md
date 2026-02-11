Implementation Plan: Hair Style Universal Salon App
Goal Description
Create a production-ready universal app (iOS, Android, Web) for "Hair Style" luxury barbershop using React Native + Expo SDK 54. The app features a client-side booking system with intelligent time slot validation and an admin dashboard for managing appointments, services, and analytics.

Key Features:
Client App: Service browsing, multi-service booking wizard, smart slot validation, appointment management, user profiles
Admin Dashboard: Calendar management, service/staff configuration, analytics, revenue tracking
Smart Booking Engine: Validates available time slots based on aggregate service duration
Premium UI: Dark theme with gold accents, glassmorphism effects, responsive design
User Review Required
IMPORTANT

Project Location The app will be initialized in the workspace: c:\Users\coomi\Desktop\stitch_admin_salon_schedule (1)\stitch_admin_salon_schedule

Please confirm this is the correct location, or specify a different directory for the new Expo project.

WARNING

Supabase Configuration Required Before implementation, we need:

Your Supabase project ID (via MCP connection)
Confirmation on database schema approach (create via migrations vs manual setup)
Whether to use Row Level Security (RLS) policies from the start
I can help configure this using the Supabase MCP tools once you confirm.

IMPORTANT

Language & Localization Mockups are in Italian, but I'll implement in English with i18n structure (using i18next or expo-localization). You can add Italian translations later.

If you prefer Italian as the primary language, please confirm.

WARNING

Stripe Integration - Live vs Test Mode For payment integration, we'll start with Stripe Test Mode. You'll need to provide:

Publishable Key (test)
We'll configure webhooks for payment confirmations
Confirm if you already have a Stripe account or need guidance on setup.

Proposed Changes
Core Infrastructure
[NEW] 
Expo Project Initialization
Initialize new Expo project with:

Expo SDK 54
TypeScript configuration
Expo Router for file-based routing
React Native Web support
NativeWind v4 (Tailwind CSS)
Commands:

bash
npx create-expo-app@latest hair-style-app --template tabs@sdk-54
cd hair-style-app
npx expo install nativewind tailwindcss@3
npx expo install react-native-reanimated react-native-gesture-handler
npx expo install lucide-react-native
npx expo install zustand
npx expo install @stripe/stripe-react-native
npx expo install @supabase/supabase-js
[NEW] 
tailwind.config.js
Custom Tailwind configuration with Hair Style design tokens:

Premium dark color palette
Champagne gold accent
Custom spacing scale
Border radius utilities
Typography scale
Glassmorphism utilities
js
module.exports = {
  content: ['./app/**/*.{js,jsx,ts,tsx}', './components/**/*.{js,jsx,ts,tsx}'],
  theme: {
    extend: {
      colors: {
        'bg-primary': '#0F0F0F',
        'bg-secondary': '#1C1C1E',
        'bg-tertiary': '#2C2C2E',
        'accent-gold': '#DCCAAB',
        'accent-gold-dark': '#C4B093',
        // ... complete palette
      },
      fontFamily: {
        sans: ['Inter', 'system-ui', 'sans-serif'],
      },
      borderRadius: {
        'pill': '9999px',
        'card': '24px',
      },
    },
  },
  plugins: [],
};
[NEW] 
app.json
Expo configuration:

App name, slug, version
Icon and splash screen
iOS/Android build settings
Web support configuration
Expo Router setup
Environment variables
Data Layer
[NEW] 
types/index.ts
TypeScript interfaces for all entities:

typescript
export interface Service {
  id: string;
  name: string;
  description: string;
  duration: number; // minutes
  price: number;
  category: 'haircut' | 'shave' | 'treatment' | 'styling';
  isActive: boolean;
  imageUrl?: string;
  isPopular?: boolean;
}
export interface Staff {
  id: string;
  name: string;
  role: string;
  bio?: string;
  photoUrl?: string;
  rating: number;
  reviewCount: number;
  specialties: string[];
  isActive: boolean;
}
export interface TimeSlot {
  startTime: Date;
  endTime: Date;
  isAvailable: boolean;
}
export interface StaffSchedule {
  staffId: string;
  date: string; // YYYY-MM-DD
  workingHours: {
    start: string; // HH:mm
    end: string;
  };
  breaks: {
    start: string;
    end: string;
    label: string;
  }[];
  bookedSlots: {
    start: string;
    end: string;
    appointmentId: string;
  }[];
}
export interface Appointment {
  id: string;
  userId: string;
  staffId: string;
  serviceIds: string[];
  date: string;
  startTime: string;
  endTime: string;
  status: 'pending' | 'confirmed' | 'completed' | 'cancelled';
  totalPrice: number;
  totalDuration: number;
  paymentMethod: 'online' | 'in_person';
  paymentStatus: 'paid' | 'pending' | 'failed';
  notes?: string;
  createdAt: Date;
  updatedAt: Date;
}
export interface User {
  id: string;
  email: string;
  name: string;
  phone?: string;
  photoUrl?: string;
  membershipTier?: 'standard' | 'gold' | 'platinum';
  notificationPreferences: {
    appointmentReminders: boolean;
    promotions: boolean;
  };
  createdAt: Date;
}
Supabase Database Schema
Will create using mcp_supabase-mcp-server_apply_migration tool:

Tables:

users - User profiles (extends Supabase Auth)
services - Service catalog
staff - Staff members
staff_schedules - Working hours and breaks
appointments - Booking records
appointment_services - Many-to-many join table
reviews - User reviews (future)
RLS Policies:

Users can read all services/staff
Users can CRUD own appointments
Admin role can manage everything
Public can read services for browsing
Migration will be created in PLANNING phase and applied after user confirmation.

[NEW] 
lib/supabase.ts
Supabase client initialization:

typescript
import { createClient } from '@supabase/supabase-js';
import { SUPABASE_URL, SUPABASE_ANON_KEY } from '@env';
export const supabase = createClient(SUPABASE_URL, SUPABASE_ANON_KEY);
Business Logic
[NEW] 
utils/booking.ts
Smart Booking Engine - getAvailableSlots function:

typescript
import { Service, StaffSchedule, TimeSlot } from '@/types';
import { addMinutes, isAfter, isBefore, parseISO, format } from 'date-fns';
/**
 * Calculates available time slots for a given staff member and selected services.
 * Only returns start times where a CONTINUOUS block of time is available.
 * 
 * @param selectedServices - Array of services user wants to book
 * @param staffSchedule - Staff member's schedule for the selected date
 * @param slotInterval - Interval between slots in minutes (default: 15)
 * @returns Array of available start time slots
 */
export function getAvailableSlots(
  selectedServices: Service[],
  staffSchedule: StaffSchedule,
  slotInterval: number = 15
): TimeSlot[] {
  // 1. Calculate total duration needed
  const totalDuration = selectedServices.reduce(
    (sum, service) => sum + service.duration,
    0
  );
  if (totalDuration === 0) return [];
  // 2. Parse working hours
  const dateStr = staffSchedule.date;
  const workStart = parseISO(`${dateStr}T${staffSchedule.workingHours.start}`);
  const workEnd = parseISO(`${dateStr}T${staffSchedule.workingHours.end}`);
  // 3. Generate all possible time slots within working hours
  const allSlots: TimeSlot[] = [];
  let currentSlot = workStart;
  while (isBefore(currentSlot, workEnd)) {
    allSlots.push({
      startTime: currentSlot,
      endTime: addMinutes(currentSlot, totalDuration),
      isAvailable: true,
    });
    currentSlot = addMinutes(currentSlot, slotInterval);
  }
  // 4. Filter out slots that:
  //    - Extend beyond working hours
  //    - Overlap with existing appointments
  //    - Overlap with breaks
  return allSlots.filter((slot) => {
    // Check if slot ends before work end time
    if (isAfter(slot.endTime, workEnd)) return false;
    // Check for conflicts with existing appointments
    const hasAppointmentConflict = staffSchedule.bookedSlots.some((booked) => {
      const bookedStart = parseISO(`${dateStr}T${booked.start}`);
      const bookedEnd = parseISO(`${dateStr}T${booked.end}`);
      
      // Check if there's any overlap
      return (
        (isAfter(slot.startTime, bookedStart) && isBefore(slot.startTime, bookedEnd)) ||
        (isAfter(slot.endTime, bookedStart) && isBefore(slot.endTime, bookedEnd)) ||
        (isBefore(slot.startTime, bookedStart) && isAfter(slot.endTime, bookedEnd))
      );
    });
    if (hasAppointmentConflict) return false;
    // Check for conflicts with breaks
    const hasBreakConflict = staffSchedule.breaks.some((breakTime) => {
      const breakStart = parseISO(`${dateStr}T${breakTime.start}`);
      const breakEnd = parseISO(`${dateStr}T${breakTime.end}`);
      
      return (
        (isAfter(slot.startTime, breakStart) && isBefore(slot.startTime, breakEnd)) ||
        (isAfter(slot.endTime, breakStart) && isBefore(slot.endTime, breakEnd)) ||
        (isBefore(slot.startTime, breakStart) && isAfter(slot.endTime, breakEnd))
      );
    });
    return !hasBreakConflict;
  });
}
/**
 * Formats a TimeSlot for display
 */
export function formatTimeSlot(slot: TimeSlot): string {
  return format(slot.startTime, 'HH:mm');
}
/**
 * Groups time slots by hour for better UI organization
 */
export function groupSlotsByHour(slots: TimeSlot[]): Record<string, TimeSlot[]> {
  return slots.reduce((groups, slot) => {
    const hour = format(slot.startTime, 'HH:00');
    if (!groups[hour]) groups[hour] = [];
    groups[hour].push(slot);
    return groups;
  }, {} as Record<string, TimeSlot[]>);
}
Unit Tests:

typescript
// __tests__/utils/booking.test.ts
import { getAvailableSlots } from '@/utils/booking';
import { Service, StaffSchedule } from '@/types';
describe('getAvailableSlots', () => {
  const mockServices: Service[] = [
    { id: '1', name: 'Cut', duration: 30, price: 35, category: 'haircut', isActive: true },
    { id: '2', name: 'Color', duration: 120, price: 85, category: 'treatment', isActive: true },
  ];
  const mockSchedule: StaffSchedule = {
    staffId: 'staff-1',
    date: '2024-10-24',
    workingHours: { start: '09:00', end: '18:00' },
    breaks: [{ start: '12:00', end: '13:00', label: 'Lunch' }],
    bookedSlots: [{ start: '10:00', end: '11:00', appointmentId: 'appt-1' }],
  };
  test('should calculate total duration correctly', () => {
    const slots = getAvailableSlots(mockServices, mockSchedule);
    // Total duration: 30 + 120 = 150 minutes = 2.5 hours
    // Should not show slots from 10:00-11:00 (booked) or 12:00-13:00 (break)
    expect(slots.length).toBeGreaterThan(0);
    expect(slots.every(slot => {
      const start = slot.startTime.getHours() * 60 + slot.startTime.getMinutes();
      return start < 600 || start >= 660; // Not in 10:00-11:00
    })).toBe(true);
  });
  test('should not show slots that extend beyond working hours', () => {
    const slots = getAvailableSlots(mockServices, mockSchedule);
    slots.forEach(slot => {
      expect(slot.endTime.getHours()).toBeLessThanOrEqual(18);
    });
  });
  test('should exclude slots overlapping with breaks', () => {
    const slots = getAvailableSlots(mockServices, mockSchedule);
    const lunchSlots = slots.filter(slot => {
      const start = slot.startTime.getHours();
      const end = slot.endTime.getHours();
      return (start >= 12 && start < 13) || (end > 12 && end <= 13);
    });
    expect(lunchSlots.length).toBe(0);
  });
});
State Management
[NEW] 
store/booking.ts
Zustand store for booking flow state:

typescript
import { create } from 'zustand';
import { Service, Staff, TimeSlot } from '@/types';
interface BookingState {
  selectedServices: Service[];
  selectedStaff: Staff | null;
  selectedDate: string | null;
  selectedTimeSlot: TimeSlot | null;
  paymentMethod: 'online' | 'in_person';
  
  // Actions
  addService: (service: Service) => void;
  removeService: (serviceId: string) => void;
  clearServices: () => void;
  setStaff: (staff: Staff) => void;
  setDate: (date: string) => void;
  setTimeSlot: (slot: TimeSlot) => void;
  setPaymentMethod: (method: 'online' | 'in_person') => void;
  resetBooking: () => void;
  
  // Computed
  getTotalPrice: () => number;
  getTotalDuration: () => number;
}
export const useBookingStore = create<BookingState>((set, get) => ({
  selectedServices: [],
  selectedStaff: null,
  selectedDate: null,
  selectedTimeSlot: null,
  paymentMethod: 'online',
  
  addService: (service) =>
    set((state) => ({
      selectedServices: [...state.selectedServices, service],
    })),
    
  removeService: (serviceId) =>
    set((state) => ({
      selectedServices: state.selectedServices.filter((s) => s.id !== serviceId),
    })),
    
  clearServices: () => set({ selectedServices: [] }),
  
  setStaff: (staff) => set({ selectedStaff: staff }),
  
  setDate: (date) => set({ selectedDate: date }),
  
  setTimeSlot: (slot) => set({ selectedTimeSlot: slot }),
  
  setPaymentMethod: (method) => set({ paymentMethod: method }),
  
  resetBooking: () =>
    set({
      selectedServices: [],
      selectedStaff: null,
      selectedDate: null,
      selectedTimeSlot: null,
      paymentMethod: 'online',
    }),
    
  getTotalPrice: () => {
    const { selectedServices } = get();
    return selectedServices.reduce((sum, service) => sum + service.price, 0);
  },
  
  getTotalDuration: () => {
    const { selectedServices } = get();
    return selectedServices.reduce((sum, service) => sum + service.duration, 0);
  },
}));
UI Component Library
[NEW] 
components/ui/Button.tsx
Reusable button component with variants:

Primary (gold gradient)
Secondary (outlined)
Icon (circular)
States: default, hover, active, disabled
Accessibility: proper labels, touch targets
[NEW] 
components/ui/Card.tsx
Card component with variants:

Standard (solid background)
Elevated (with glassmorphism)
Custom border radius, padding options
[NEW] 
components/ui/Input.tsx
Input field component:

Text input, search input variants
Error states with validation
Icons (left/right positioned)
Passwords with show/hide toggle
[NEW] 
components/ui/Badge.tsx
Status badge component:

Variants: confirmed, pending, cancelled, popular
Color-coded backgrounds and text
[NEW] 
components/ui/BottomNav.tsx
Bottom navigation bar:

Tab items with icons and labels
Active state highlighting (gold)
Center FAB option
Safe area handling
Client App Screens
[NEW] 
app/(auth)/login.tsx
Login screen following mockup client_auth_&_registration:

Segmented control (Login/Register)
Email/Phone input
Password input with toggle
"Remember me" checkbox
"Forgot password" link
Social login buttons (GitHub, Google)
Form validation
Supabase Auth integration
[NEW] 
app/(tabs)/index.tsx
Home dashboard following mockup client_home_dashboard:

User greeting with avatar
Hero section with search bar
"Last Appointment" card
"Barbershops Near You" horizontal scroll
Pull-to-refresh functionality
Navigation to booking flow
[NEW] 
app/(tabs)/explore.tsx
Service selection screen following mockup client_home_&_service_selection:

Featured service hero card
Service categories (Capelli, Trattamenti, Styling)
Service list with checkboxes (multi-select)
Sticky bottom bar with total price/duration
"Continue" button navigation
[NEW] 
app/book/[step].tsx
Booking wizard with dynamic routing:

/book/services - Service selection (redirect from explore if not already selected)
/book/staff - Staff selection grid
/book/datetime - Date picker + time slot grid (uses getAvailableSlots)
/book/checkout - Payment method + confirmation
Implements wizard pattern with:

Progress indicator
Back navigation
State persistence via Zustand
Validation at each step
[NEW] 
app/book/checkout.tsx
Checkout screen following mockup client_booking_checkout:

Booking summary card (date, time, services, staff)
Payment method selection (Paga Ora with 5% discount, Paga in Struttura)
Total price display
Payment trust indicators
Cancellation policy
"Conferma Prenotazione" button
Stripe payment integration (if online payment)
[NEW] 
app/(tabs)/bookings.tsx
Appointments management following mockup client_appointments_management:

Segmented tabs: Upcoming / History
Appointment cards with status badges
Reschedule and Cancel actions
"Book Again" for history items
Real-time updates via Supabase subscriptions
[NEW] 
app/(tabs)/profile.tsx
User profile following mockup client_profile_settings:

Avatar with edit option
Membership tier badge
Account settings (Personal Info, Payment Methods, Security)
Notification preferences with toggles
Logout button
"Save Changes" button
Admin Dashboard Screens
[NEW] 
app/admin/dashboard.tsx
Admin calendar following mockup admin_calendar_dashboard:

Date selector at top
Horizontal date scroller
Timeline view (hourly slots)
Appointment blocks with color coding
Status indicators (confirmed, pending)
Break time blocks
FAB for quick add appointment
Responsive: Single staff on mobile, multi-column on tablet/desktop
[NEW] 
app/admin/services.tsx
Service management following mockup admin_service_management_v1:

Category filter tabs
Service cards with:
Name, description, popular badge
Price and duration display
Active/inactive toggle
Edit button
"Add Service" FAB
CRUD operations via Supabase
[NEW] 
app/admin/analytics.tsx
Analytics dashboard following mockup admin_analytics_&_revenue_dashboard:

KPI cards (revenue, appointment count with % change)
Monthly performance line chart
Payment methods bar chart
Top services ranked list
Date range selector
Real-time data from Supabase
Integration & Configuration
[NEW] 
lib/stripe.ts
Stripe integration:

Initialize Stripe SDK
Create payment intent
Confirm payment
Handle 3D Secure
Webhook handlers for payment status
typescript
import { useStripe } from '@stripe/stripe-react-native';
export async function createPaymentIntent(amount: number, appointmentId: string) {
  // Call backend to create payment intent
  const response = await fetch('/api/create-payment-intent', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ amount, appointmentId }),
  });
  return response.json();
}
[NEW] 
app/api/create-payment-intent+api.ts
Expo API route for payment intent creation:

Server-side Stripe secret key
Create payment intent with metadata
Return clientSecret to client
Verification Plan
Automated Tests
Unit Tests
bash
# Run all unit tests
npm test
# Specific test files:
npm test -- booking.test.ts    # Smart booking logic
npm test -- store.test.ts      # Zustand store
Coverage targets:

utils/booking.ts - getAvailableSlots function: 100% branch coverage
Zustand stores: All actions and selectors
Helper functions: Date formatting, price calculations
Integration Tests
bash
# Test Supabase integration
npm test -- integration/supabase.test.ts
# Test Stripe payment flow (with mocks)
npm test -- integration/payments.test.ts
Test scenarios:

Create appointment in Supabase
Update appointment status
Payment intent creation and confirmation
Real-time subscription updates
Manual Verification
Client App Testing
1. Onboarding & Authentication

 Launch app → See onboarding slides
 Tap "Get Started" → Navigate to login
 Login with test credentials → Navigate to home
 Verify bottom navigation appears
2. Service Selection & Booking Flow

 Tap "Explore" tab → See service categories
 Select 2 services (e.g., "Cut" + "Beard Trim")
 Verify bottom bar shows: Correct total price (€35 + €20 = €55) and duration (30m + 20m = 50m)
 Tap "Continua" → Navigate to staff selection
 Select a staff member → Navigate to date/time
 Select a date → Verify only valid time slots appear
Critical test: If total duration is 90 minutes, slots should not appear in 30-minute gaps
 Select a time slot → Navigate to checkout
 Verify summary shows all selected details
 Select "Paga Ora" → Verify "-5% Sconto" badge appears
 Tap "Conferma Prenotazione" → Payment sheet appears (Stripe)
 Complete payment → See confirmation screen
 Navigate to "Bookings" tab → Verify appointment appears with "CONFIRMED" status
3. Appointment Management

 In "Bookings" tab, tap "Reschedule" button
 Verify booking wizard opens with services pre-filled
 Select new date/time → Confirm
 Verify appointment updates in list
 Tap "Cancel" → See confirmation dialog
 Confirm cancellation → Verify status changes to "CANCELLED"
4. Profile & Settings

 Navigate to "Profile" tab
 Verify user name and avatar display
 Toggle "Promemoria Appuntamenti" → Verify state persists after app restart
 Tap "Dati Personali" → Edit name → Save → Verify changes persist
5. Web Responsive Testing

 Open app in web browser
 Verify layout adapts to desktop width
 Test all flows above in web environment
 Verify bottom navigation becomes sidebar on desktop (if designed)
Admin Dashboard Testing
1. Calendar Management

 Login as admin user
 Navigate to admin dashboard
 Verify today's appointments display in timeline
 Tap date scroller → Select different date → Calendar updates
 Tap an appointment block → See detail modal
 Edit appointment → Save → Verify updates in timeline
 Tap + FAB → Add new appointment → Verify appears in calendar
2. Service Management

 Navigate to Services tab
 Toggle service active/inactive → Verify clients can't see inactive services
 Tap "Add Service" → Fill form → Save
 Verify new service appears in list
 Edit existing service → Update price → Verify new price shows in client app
3. Analytics Dashboard

 Navigate to Analytics tab
 Verify KPI cards show correct totals (cross-check with database)
 Verify charts render correctly
 Change date range → Verify data updates
4. Tablet/Desktop Layout

 Open admin dashboard on tablet/desktop
 Verify multi-column calendar layout appears
 Test side-by-side appointment management
Smart Booking Logic Verification
Test Case 1: Basic Single Service

Select: "Cut" (30 min)
Expected: All 15-minute interval slots from 9:00-17:30 (that fit 30min before work end)
Verify: Last available start time is 17:30 (ends at 18:00)
Test Case 2: Multiple Services

Select: "Cut" (30 min) + "Color" (120 min) = 150 min total
Expected: Only slots where 2.5 hours continuous time is available
Verify: Last available start time is 15:30 (ends at 18:00)
Test Case 3: Existing Appointment Conflict

Existing booking: 10:00-11:00 (60 min)
Select: 90 min service
Expected: No slots from 9:15-11:15 (would overlap with existing)
Verify: First available slot after 10:00 booking is 11:00
Test Case 4: Break Time Conflict

Staff break: 12:00-13:00
Select: 90 min service
Expected: No slots from 11:15-12:45 (would overlap with break)
Verify: Slots jump from 10:45 to 13:00
Test Case 5: No Available Slots

Fully booked day
Expected: Empty slot array
Verify: UI shows "No available times" message with suggestion
Performance Testing
 Test app startup time (< 3 seconds to interactive)
 Scroll performance in service list (60 FPS)
 Calendar rendering with 50+ appointments (no lag)
 Image loading optimization (lazy load, caching)
Accessibility Testing
 VoiceOver (iOS) / TalkBack (Android) navigation
 Minimum font size 16px
 Touch target size ≥ 44x44 points
 Color contrast ratio ≥ 4.5:1 for text
 Keyboard navigation (web)
Cross-Platform Testing
iOS:

 Test on iPhone SE (small screen)
 Test on iPhone 14 Pro (notch handling)
 Test on iPad (responsive layout)
Android:

 Test on Android 10+
 Test with different system fonts/scales
 Test with Android navigation gestures
Web:

 Chrome, Firefox, Safari
 Mobile viewport (DevTools)
 Desktop viewport (1920x1080)
Stripe Payment Testing
Test Mode:

 Use test card: 4242 4242 4242 4242
 Verify payment intent creates successfully
 Complete payment → Verify webhook receives confirmation
 Test 3D Secure card: 4000 0027 6000 3184
 Test declined card: 4000 0000 0000 0002
 Verify appointment status updates correctly for each scenario
Post-Implementation Checklist
 All TypeScript types properly defined
 No any types (strict mode enabled)
 All components have proper prop types
 Accessibility labels on all interactive elements
 Error boundaries implemented
 Loading states for all async operations
 Optimistic UI updates where appropriate
 Analytics events tracked (optional)
 Sentry error tracking configured (optional)
 Environment variables documented in .env.example
Notes
Mock Data: For initial development, will create a mock-data.ts file with sample services, staff, and appointments for testing without Supabase dependency.

Image Assets: Will use placeholders or generate images via generate_image tool for barber photos and service images.

i18n: English will be primary language. Italian translations can be added later by creating translation files.

Testing Strategy: Focus on unit tests for business logic, integration tests for data layer, and manual testing for UI flows.

Deployment: App will be ready for:

iOS: TestFlight distribution
Android: Google Play Internal Testing
Web: Vercel deployment
Phase 2 Features (Future):

Push notifications
In-app chat with staff
Review/rating system
Loyalty program
Multi-location support