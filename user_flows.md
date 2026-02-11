Hair Style - User Flows Documentation
🎯 Overview
Documentation of all user journeys extracted from mockup screens for both Client App and Admin Dashboard.

👤 CLIENT FLOWS
1. Onboarding Flow
Screens: welcome_splash_screen_1, welcome_splash_screen_2, app_onboarding_slide

Flow Steps:
Splash Screen 1 - Brand introduction

Logo icon (gold scissors)
Brand name "Atelier Noir" / "Hair Style"
Tagline "ESPERIENZA UNICA"
Action: Auto-advance or tap to continue
Splash Screen 2 - Value proposition

Hero image with overlay
Headline: "Luxe Cuts"
Copy: "Discover top barbers and book your look instantly"
CTA: "Get Started" button (gold)
Onboarding Slides - Feature education

Slide 1: "Masterful Cuts. Timeless Style."
"Experience premium grooming tailored to your unique persona..."
Progress indicators (3 dots, gold active)
Actions: SKIP button, Arrow button to next, Swipe gesture
Navigate to: Authentication screen

2. Authentication Flow
Screen: client_auth_&_registration

Login Flow:
Segmented control: "Accedi" (active) / "Registrati"
Input: Email o Telefono
Input: Password (with show/hide toggle)
Checkbox: "Ricordami"
Link: "Password dimenticata?"
CTA: "Entra nel Salone" (gold button)
Divider: "Oppure accedi con"
Social login: GitHub icon, Google icon buttons
Footer: Terms and Privacy Policy links
Registration Flow:
Switch to "Registrati" tab
Input: Name
Input: Email/Phone
Input: Password
Input: Confirm Password
Checkbox: Terms agreement
CTA: "Create Account"
Navigate to: Home Dashboard
3. Home Dashboard
Screen: client_home_dashboard

Initial View:
Header:

User avatar (left) with green status dot
Greeting: "Hello 👋"
User name: "Ryan Cole"
Bell icon (notifications)
Settings icon (gear)
Hero Section:

Headline: "Upgrade Your Style"
Subtext: "Search barbers, explore trending styles, or book your favorite artist."
Search:

Search bar: "Search barbers..."
Filter icon button (right)
Last Appointment Card:

Section title: "Your Last Appointment"
Barber image (with "Pro" badge)
Name: "Fade Master Tony"
Rating: 4.8 ⭐ (128 reviews)
CTA: "Book" button (gold)
Barbershops Near You:

Horizontal scrollable cards
Card content:
Shop photo
Rating badge (top-left)
Heart icon (favorite toggle)
Status: "Open Now" (green) / "Closes Soon" (red)
Hours: "10:00 - 22:00"
Shop name
Distance: "0.5 km away from you"
CTA: "Book Appointment" button
"See all" link
Bottom Navigation:

Home (active, gold)
Explore icon
Calendar icon
Profile icon
Center: + FAB (gold circle)
Interactions:
Tap search → Navigate to Explore
Tap "Book" → Navigate to Booking Wizard
Tap barbershop card → Shop detail page
Tap + FAB → Quick book action
4. Service Selection & Explore
Screens: client_home_&_service_selection

Initial View:
Header:

Greeting: "Buonasera, Bentornato, Alessandro"
User avatar
Featured Service Card:

Large image card with overlay
Badge: "CONSIGLIATO PER TE"
Service name: "Taglio d'Autore"
Description: "L'esperienza signature..."
Duration: 45 min
Price: 35€
Arrow icon to view details
Service Categories:

"Capelli" (3 SERVIZI)
"Trattamenti" (2 SERVIZI)
"Styling" (1 SERVIZIO)
Service List Items:

Service name (e.g., "Taglio Uomo")
Description
Duration icon + time (e.g., 30min)
Price
Circular checkbox (select)
Sticky Bottom Bar:

Left: "RIEPILOGO" label
Total price: "43€"
Total duration: "50 min"
Right: "Continua →" button (gold)
Interactions:
Select/deselect services (multi-select allowed)
Bottom bar auto-updates with total
Tap "Continua" → Navigate to Staff Selection
5. Booking Wizard
Flow: Service → Staff → Date/Time → Checkout

Step 1: Service Selection
See "Service Selection & Explore" above

Step 2: Staff Selection
Grid/List of available staff
Each card shows:
Photo
Name
Specialties
Rating
Availability indicator
Select staff → Auto-filter available times
Step 3: Date & Time Selection
Key Feature: Smart Slot Validation

Calendar View:
Horizontal date scroller
Current selection highlighted (gold)
Time Slots:
Only show slots where continuous block ≥ totalDuration
Example: If user needs 90min, don't show 30min gaps
Slots displayed in grid (e.g., 10:00, 10:30, 11:00...)
Selected slot highlighted (gold)
Logic:
totalDuration = sum(selected_services.duration)
availableSlots = filter(staffSchedule, slot => 
  hasContiguousTime(slot, totalDuration)
)
Step 4: Checkout & Payment
Screen: client_booking_checkout

Summary Card:

Date badge: "OTT 24 Martedì"
Time: "14:30 - 16:00"
Divider
Service 1: "Taglio & Piega Premium" - €45.00
Detail: "Stilista: Marco Rossi"
Service 2: "Trattamento Gloss" - €20.00
Detail: "Lucentezza estrema"
Divider
Total: "€65.00"
Payment Method Section:

Title: "METODO DI PAGAMENTO"
Option 1: "Paga Ora" (selected)
Badge: "-5% Sconto" (green)
Subtext: "Apple Pay, Google Pay, Carta"
Radio button (selected)
Gold accent border
Option 2: "Paga in Struttura"
Subtext: "Contanti o POS all'arrivo"
Radio button (unselected)
Payment trust: "Pagamento sicuro" with lock icon
Cancellation policy: "La cancellazione è gratuita fino a 24 ore prima"
CTA:

"Conferma Prenotazione →" (gold button, full-width)
Interactions:
Select payment method
Apply promo code (optional)
Tap "Conferma" → Process payment → Confirmation screen
6. Appointments Management
Screen: client_appointments_management

Initial View:
Header:

Back button
Title: "My Appointments"
Subtitle: "Manage your upcoming visits"
Notebook icon (top-right)
Tabs:

"Upcoming" (active, gold underline)
"History" (inactive, gray)
Appointment Cards (Upcoming):

Barber photo (with badge if applicable)
Barber name: "Daniel Brooks"
Role: "Master Barber"
Status badge: "CONFIRMED" (green)
Date badge: "DATE - Today, Oct 24"
Time badge: "TIME - 10:00 AM"
Services:
"Skin Fade & Line Up" - $35.00
"Beard Trim" - $20.00
Actions:
"Reschedule" button (outlined)
"Cancel" button (text, red)
Appointment Cards (Pending):

Similar layout
Status: "PENDING" (yellow)
Barber: "Tony Fade - Stylist"
Bottom Navigation with FAB

Interactions:
Tap "Reschedule" → Re-enter booking wizard at date/time step
Tap "Cancel" → Confirmation dialog → Cancel appointment
Swipe tabs to switch Upcoming/History
7. Appointment History
Screen: welcome_splash_screen_1 (shows history cards)

History Card:
Barber photo
Barber name
Date & Time
Services with prices
Total paid
Checkmark (completed)
CTA: "Prenota di nuovo" (Rebook button)
Interactions:
Tap history card → View details
Tap "Prenota di nuovo" → Copy services to new booking
Leave review (if not reviewed)
8. Profile & Settings
Screen: client_profile_settings

Profile Header:
Large avatar with gold border
Camera icon (edit photo)
User name: "Sofia Rossi"
Badge: "GOLD MEMBER"
Account Section:
"ACCOUNT" label
"Dati Personali" → Personal info screen
"Metodi di Pagamento" → Saved cards
"Sicurezza" → Password, 2FA
Notification Preferences:
"PREFERENZE NOTIFICHE" label
"Promemoria Appuntamenti" - Toggle ON
"Ricevi avvisi 24h prima"
"Offerte Esclusive" - Toggle OFF
"Promo e novità sui servizi"
Danger Zone:
"Esci dall'account" (red text)
CTA:
"Salva Modifiche" button (gold, full-width)
🔧 ADMIN FLOWS
9. Admin Calendar Dashboard
Screens: admin_calendar_dashboard, admin_staff_schedule_dashboard_1-5

Initial View:
Header:

"TODAY'S SCHEDULE"
Date: "Oct 24, Wed" with dropdown
Bell icon (notifications)
Admin avatar
Date Scroller:

Horizontal scroll of dates
Current date highlighted (gold circle)
Shows: Day, Date number
Timeline View:

Left column: Time labels (09:00, 10:00, 11:00...)
Main area: Appointment blocks
Appointment Block:
Client name (e.g., "Sarah Jenkins")
Service name (uppercase)
Avatar icon
Duration + Price
Status indicator (green check, yellow dot)
Left border accent (color-coded by status/staff)
Break Blocks:
Dashed border
"LUNCH BREAK" with coffee icon
Gray background
Empty Slots:

Clickable to add appointment
Show time range available
FAB:

Gold + button
Floating bottom-right
Quick add appointment
Bottom Navigation:

Schedule (active)
Clients
Reports
Settings
Interactions:
Tap appointment → View/Edit details
Tap empty slot → Quick add appointment
Drag appointment to reschedule (optional)
Tap + FAB → Add appointment wizard
10. Service Management
Screen: admin_service_management_v1

Header:
Title: "Services"
Subtitle: "Manage your salon menu"
Hamburger menu icon
Category Tabs:
"All Services" (active, gold pill)
"Haircuts" (inactive)
"Shaves" (inactive)
Horizontal scroll for more categories
Service Cards:
Card Layout:
Service name: "Executive Cut"
Badge: "POPULAR" (if applicable)
Description
Price: "$ 55.00"
Duration: "45 min" with clock icon
Toggle: ON/OFF (gold when active)
Edit icon (pencil)
Actions:
Toggle service active/inactive
Tap edit icon → Edit service modal
Tap + "Add Service" → New service form
Bottom Navigation:
Home
Calendar
Services (active, gold)
Settings
Service Form Fields:
Service name
Category
Description
Price
Duration
Photo upload
Active toggle
11. Staff Schedule Management
Screens: admin_staff_schedule_dashboard_2-5

Multi-Staff View:
Column layout (tablet/desktop)
Each column = one staff member
Header: Staff name + photo
Timeline for each staff
Color-coded appointments
Overlap detection
Break time indicators
Week View:
Grid layout
Rows: Staff members
Columns: Days of week
Cell: Appointment count or hours booked
Click cell → Day detail view
12. Analytics & Revenue Dashboard
Screen: admin_analytics_&_revenue_dashboard

Header:
"Panoramica"
Subtitle: "Bentornato, Admin"
Date filter: "Ottobre 2023" dropdown
KPI Cards:
Total Revenue:
"ENTRATE TOTALI"
Amount: "€4.250,00"
Change: "+12%" (green)
Total Appointments:
"APPUNTAMENTI"
Count: "48"
Change: "+5%" (green)
Charts Section:
Monthly Performance Chart:

Title: "Andamento Mensile"
Line chart (gold color)
X-axis: Sett 1, 2, 3, 4
Smooth curved line
Data points marked
Horizontal grid lines
Three-dot menu (top-right)
Payment Methods:

Title: "Metodo di Pagamento"
Horizontal bar chart
"Online" - 60% - €2.550
"In Struttura" - 40% - €1.700
Bar colors: Gold + Navy blue
Top Services:

Title: "Servizi Top"
Ranked list with (#1, #2, #3 badges)
Service name
Booking count
Revenue
Link: "Vedi tutti"
Bottom Navigation:
Agenda
Analytics (active, gold)
Clients
Settings
Center: + FAB
🔄 Navigation Patterns
Client App Navigation:
Bottom Tabs (Primary):
├── Home (Dashboard)
├── Explore (Service Search)
├── [FAB] (Quick Book)
├── Bookings (Appointments)
└── Profile (Settings)
Stack Navigators:
├── Auth Stack
│   ├── Onboarding
│   ├── Login
│   └── Register
├── Booking Stack
│   ├── Select Services
│   ├── Select Staff
│   ├── Select Date/Time
│   └── Checkout
└── Profile Stack
    ├── Profile Overview
    ├── Personal Info
    ├── Payment Methods
    └── Security
Admin App Navigation:
Bottom Tabs (Primary):
├── Schedule (Calendar)
├── Clients (Client List)
├── Reports (Analytics)
├── [FAB] (Quick Add)
└── Settings
Stack Navigators:
├── Schedule Stack
│   ├── Day View
│   ├── Week View
│   └── Appointment Detail
├── Management Stack
│   ├── Services
│   ├── Staff
│   └── Business Settings
└── Analytics Stack
    ├── Overview
    ├── Revenue Reports
    └── Performance Metrics
⚙️ Key Business Logic
Smart Booking Algorithm
typescript
interface Service {
  id: string;
  name: string;
  duration: number; // in minutes
  price: number;
}
interface TimeSlot {
  startTime: Date;
  endTime: Date;
  isAvailable: boolean;
}
interface StaffSchedule {
  staffId: string;
  date: Date;
  slots: TimeSlot[];
}
function getAvailableSlots(
  selectedServices: Service[],
  staffSchedule: StaffSchedule
): TimeSlot[] {
  // Calculate total duration needed
  const totalDuration = selectedServices.reduce(
    (sum, service) => sum + service.duration,
    0
  );
  // Filter slots with continuous availability
  return staffSchedule.slots.filter((slot) => {
    const slotDuration = 
      (slot.endTime.getTime() - slot.startTime.getTime()) / 60000;
    return slot.isAvailable && slotDuration >= totalDuration;
  });
}
Multi-Service Booking:
User selects multiple services (e.g., Cut + Color + Beard Trim)
System calculates: totalDuration = 30 + 120 + 20 = 170 minutes
System finds continuous blocks ≥ 170 minutes in staff schedule
Display only valid start times to user
Block entire duration on confirmation
📱 Screen Transitions
Client Transitions:
Onboarding → Auth: Fade
Auth → Home: Slide from bottom
Home → Booking: Slide from right
Booking steps: Horizontal slide
Modal views: Scale + fade from center
Admin Transitions:
Tab switches: Cross-fade
Detail views: Slide from right
Modals: Slide from bottom
Calendar navigation: Horizontal slide
🎨 Interaction Patterns
Touch Gestures:
Swipe left/right: Navigate between tabs, dates
Pull to refresh: Update lists and calendars
Long press: Quick actions menu (admin)
Pinch to zoom: Calendar week/month view (admin)
Feedback:
Haptic: On selection, confirmation actions
Visual: Button press states, loading skeletons
Audio: (Optional) Confirmation sounds
🚨 Error & Edge Cases
No Available Slots:
Show message: "No available times for selected duration"
Suggest: "Try selecting fewer services" or "Choose different date"
Scheduling Conflicts:
Admin: Highlight overlapping appointments in red
Warn before double-booking
Payment Failure:
Show error message
Keep booking in "Pending" state
Allow retry or alternative payment method
Late Cancellation:
Show cancellation fee if < 24h notice
Require confirmation with fee amount
📊 Data Synchronization
Real-Time Updates (Supabase):
Appointment status changes
Calendar availability
New bookings (admin alert)
Payment confirmations
Optimistic UI:
Service selection: Instant UI update
Favorite shops: Toggle immediately
Cart updates: No loading states
This completes the comprehensive user flow documentation!