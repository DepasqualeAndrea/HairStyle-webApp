Hair Style - Design System Specification
📋 Design Overview
Extracted from 18 mockup screens in stitch_admin_salon_schedule folder.

Brand Name: Hair Style (also appears as "Atelier Noir" in auth screens)
Design Philosophy: Premium Dark - Luxury barbershop with sophisticated, modern aesthetics
Key Visual Elements: Glassmorphism, High contrast, Gold accents, Rounded components, Dark elegance

🎨 Color Palette
Primary Colors
css
--bg-primary: #0F0F0F        /* Deep Matte Black - Main background */
--bg-secondary: #1C1C1E      /* Dark Charcoal - Card backgrounds */
--bg-tertiary: #2C2C2E       /* Lighter Charcoal - Elevated cards */
Accent Colors
css
--accent-gold: #DCCAAB       /* Champagne Gold - Primary accent */
--accent-gold-dark: #C4B093  /* Darker gold for hover states */
--accent-green: #10B981      /* Success green (for "Open Now", confirmations) */
--accent-red: #EF4444        /* Error/Cancel red */
--accent-yellow: #F59E0B     /* Warning/Pending yellow */
Text Colors
css
--text-primary: #FFFFFF      /* Pure white - Main text */
--text-secondary: #9CA3AF   /* Light Gray - Secondary text, descriptions */
--text-tertiary: #6B7280    /* Medium Gray - Placeholder, disabled */
Border & Overlay Colors
css
--border-subtle: rgba(255, 255, 255, 0.1)   /* Subtle white border */
--overlay-dark: rgba(0, 0, 0, 0.6)           /* Dark overlay for glassmorphism */
--overlay-gold: rgba(220, 202, 171, 0.15)   /* Gold tinted overlay */
🔤 Typography
Font Families
iOS: San Francisco (System Default)
Android: Roboto (System Default)
Web: Inter (Google Fonts fallback)
Type Scale
Headings
css
--font-h1: 48px / 1.2 / Bold        /* Onboarding hero text */
--font-h2: 32px / 1.3 / Bold        /* Section headers */
--font-h3: 24px / 1.4 / Semibold    /* Card titles */
--font-h4: 20px / 1.5 / Semibold    /* List item titles */
Body Text
css
--font-body-lg: 18px / 1.6 / Medium   /* Important descriptions */
--font-body: 16px / 1.5 / Regular     /* Standard body text */
--font-body-sm: 14px / 1.5 / Regular  /* Secondary info */
--font-caption: 12px / 1.4 / Regular  /* Captions, labels */
Special
css
--font-price: 20px / 1 / Bold         /* Pricing display */
--font-button: 16px / 1 / Semibold    /* Button labels */
--font-badge: 12px / 1 / Bold         /* Status badges */
🧩 Component Specifications
Buttons
Primary Button (Gold CTA)
Background: Linear gradient (#DCCAAB → #C4B093) OR solid #DCCAAB
Text Color: #000000 (Black)
Height: 56px
Border Radius: 28px (Pill-shaped)
Font: 16px Semibold
Padding: 16px 32px
Shadow: none (flat design)
States:

Hover: Slightly darker gradient
Active: Scale 0.98
Disabled: Opacity 0.5
Secondary Button (Outlined)
Background: Transparent
Border: 1.5px solid rgba(255,255,255,0.2)
Text Color: #FFFFFF
Border Radius: 28px
Rest: Same as Primary
Icon Button
Size: 48px × 48px
Background: rgba(255,255,255,0.1)
Border Radius: 24px (circular)
Icon Size: 20px
Cards
Standard Card
Background: #1C1C1E
Border Radius: 24px
Border: 1px solid rgba(255,255,255,0.1)
Padding: 20px
Shadow: none
Elevated Card (with glassmorphism)
Background: rgba(28, 28, 30, 0.8)
Backdrop Filter: blur(20px)
Border Radius: 24px
Border: 1px solid rgba(255,255,255,0.15)
Padding: 24px
Appointment Card (Client History)
Background: #1C1C1E
Border Radius: 20px
Border: none
Padding: 16px
Contains: Avatar (60px), Staff Name, Service Labels, Date/Time badges, Action buttons
Input Fields
Text Input
Background: rgba(255,255,255,0.05)
Border: 1.5px solid rgba(255,255,255,0.1)
Border Radius: 16px
Height: 56px
Padding: 16px 20px
Font: 16px Regular
Placeholder Color: #6B7280
States:

Focus: Border color #DCCAAB (gold)
Error: Border color #EF4444 (red)
Search Input
Background: #2C2C2E
Border Radius: 24px (pill)
Height: 48px
Padding: 12px 20px
Icon: Left-aligned, 20px
Tabs
Segmented Control Style
Background: rgba(255,255,255,0.05)
Border Radius: 24px
Padding: 4px
Height: 48px
Active Tab:
  Background: #DCCAAB (gold)
  Text Color: #000000
  Border Radius: 20px
Inactive Tab:
  Background: Transparent
  Text Color: #9CA3AF
Bottom Navigation
Height: 80px
Background: #0F0F0F
Border Top: 1px solid rgba(255,255,255,0.05)
Safe Area Inset: Included
Tab Item:
  Icon Size: 24px
  Label: 12px Regular
  Active Color: #DCCAAB (gold)
  Inactive Color: #6B7280
  Spacing: 8px vertical
FAB (Center):
  Size: 56px circle
  Background: #DCCAAB (gold)
  Icon: + (24px black)
  Elevation: 8px shadow
Date/Time Display Badges
Background: #2C2C2E
Border Radius: 12px
Padding: 12px 16px
Icon: 16px (clock/calendar)
Text: 14px Medium
Status Badges
Border Radius: 12px
Padding: 6px 12px
Font: 12px Bold uppercase
CONFIRMED: Background #10B981/20, Text #10B981
PENDING: Background #F59E0B/20, Text #F59E0B
CANCELLED: Background #EF4444/20, Text #EF4444
Rating Display
Star Icon: 16px
Text: 14px Semibold
Color: #F59E0B (Gold/Yellow)
Review Count: #9CA3AF
📐 Spacing & Layout
Grid System
Mobile Padding: 20px horizontal
Tablet/Desktop: 32px horizontal
Max Content Width: 1200px (web)
Spacing Scale
xs: 4px
sm: 8px
md: 12px
lg: 16px
xl: 20px
2xl: 24px
3xl: 32px
4xl: 48px
5xl: 64px
Item Spacing
Between sections: 32px
Between cards: 16px
Between list items: 12px
Between form fields: 16px
🖼️ Iconography
Icon Set: Lucide React Native
Sizes:

Small: 16px (badges, inline)
Medium: 20px (buttons, inputs)
Large: 24px (navigation, headers)
XL: 32px (feature icons)
Key Icons Used:

Scissors: Logo/Brand
Home: Home tab
Search: Explore/Search
Calendar: Bookings/Schedule
User: Profile
Clock: Time/Duration
Euro: Pricing
ChevronRight: Navigation arrows
Check: Confirmation
X: Close/Cancel
Plus: Add action
✨ Special Effects
Glassmorphism
css
background: rgba(28, 28, 30, 0.8);
backdrop-filter: blur(20px);
-webkit-backdrop-filter: blur(20px); /* Safari */
border: 1px solid rgba(255, 255, 255, 0.15);
Used in:

Modal overlays
Date/time selection cards
Floating action cards
Gradients
Gold Button Gradient
css
linear-gradient(135deg, #DCCAAB 0%, #C4B093 100%)
Subtle Card Gradient (optional)
css
linear-gradient(180deg, rgba(255,255,255,0.05) 0%, transparent 100%)
Shadows
css
--shadow-sm: 0 2px 8px rgba(0,0,0,0.2)
--shadow-md: 0 4px 16px rgba(0,0,0,0.3)
--shadow-lg: 0 8px 24px rgba(0,0,0,0.4)
Usage: Minimal - only for FAB and modals

🎯 Component States & Interactions
Hover States (Web/Tablet)
Buttons: Opacity 0.9 + slight scale
Cards: Border brightness increase
Links: Color change to gold
Active/Pressed States
Buttons: Scale 0.98
Cards: Slight background darken
List items: Background #2C2C2E
Transitions
css
transition: all 0.2s ease-in-out
Micro-animations
Page transitions: Slide from right (200ms)
Modal: Fade + scale up (250ms)
Cards: Fade in stagger (100ms delay between items)
📱 Screen-Specific Patterns
Onboarding
Full-screen background image with dark overlay
White hero text with gold accent word (italic)
Progress indicators: Gold active, gray inactive
Bottom-aligned CTA button
Service Selection
Hero card with image overlay at top
Categorized service lists (Capelli, Trattamenti, Styling)
Circular checkboxes (outlined when inactive, gold filled when active)
Sticky bottom bar showing total price + duration + CTA
Booking Flow
Wizard pattern with back button
Large date badges: Rounded squares for calendar dates
Time slots: Pill-shaped buttons in grid
Summary card with glassmorphism
Admin Calendar
Horizontal date scroller at top
Timeline view with hourly slots (left-aligned times)
Appointment cards with color-coded left border
Status indicators (green check, yellow dot)
Admin Analytics
KPI cards in 2-column grid
Line chart with gold accent color
Horizontal bar charts for payment methods
Ranked list with numbered badges
🔄 Responsive Behavior
Mobile (< 768px)
Single column layout
Full-width cards
Bottom sheet modals
Tab bar navigation
Tablet (768px - 1024px)
2-column layouts for cards
Side-by-side booking wizard
Drawer navigation option
Desktop/Web (> 1024px)
3-column card grids
Sidebar navigation for admin
Modal dialogs instead of bottom sheets
Hover states enabled
📝 Notes for Implementation
Dark Mode Only: No light mode variant in mockups
Italian Language: Screens use Italian, but generate English as primary with i18n structure
Images: Use placeholder images or generation for barber/service photos
Fonts: Load Inter from Google Fonts for web, use system fonts for native
Accessibility: Ensure minimum 16px font size, 4.5:1 contrast ratios
Safe Areas: Account for iOS notch and Android navigation bars
🎬 Animation Specifications
Page Transitions
Enter: translateX(100%) → 0, opacity 0 → 1 (200ms)
Exit: translateX(0) → -30%, opacity 1 → 0 (200ms)
Card Reveal
On scroll: translateY(20px) → 0, opacity 0 → 1 (300ms)
Stagger: 100ms delay between cards
Button Press
Scale: 1 → 0.98 (100ms)
Release: 0.98 → 1 (150ms ease-out)