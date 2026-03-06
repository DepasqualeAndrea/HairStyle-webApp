# 💇 Hair Style - Luxury Barber App

Applicazione universale (iOS, Android, Web) per barbieri di lusso con sistema di prenotazione intelligente.

## 🚀 Quick Start

### Installazione

Le dipendenze sono già installate. Se necessario:

```bash
npm install --legacy-peer-deps
```

### Avvio Development Server

```bash
# Avvia il server di sviluppo
npm start

# Oppure direttamente su una piattaforma:
npm run ios      # iOS (richiede macOS)
npm run android  # Android (richiede Android Studio)
npm run web      # Browser
```

## 🏗️ Stack Tecnologico

- **Framework**: React Native con Expo SDK 54
- **Routing**: Expo Router (file-based routing)
- **Styling**: NativeWind v4 (Tailwind CSS per React Native)
- **State Management**: Zustand
- **Backend**: Supabase (PostgreSQL + Auth + Storage)
- **Payments**: Stripe
- **Icons**: Lucide React Native
- **i18n**: expo-localization + i18n-js (IT/EN)

## 📁 Struttura Progetto

```
HairStyle-webApp/
├── app/                    # Expo Router screens
│   ├── (tabs)/            # Tab navigation
│   │   ├── index.tsx      # Home
│   │   ├── explore.tsx    # Servizi
│   │   ├── bookings.tsx   # Appuntamenti
│   │   └── profile.tsx    # Profilo
│   ├── _layout.tsx        # Root layout
│   └── index.tsx          # Welcome screen
├── components/            # Componenti riutilizzabili
│   └── ui/               # Design system components
├── lib/                   # Core libraries
│   ├── supabase.ts       # Supabase client
│   └── i18n.ts           # Localization
├── store/                 # Zustand stores
│   └── booking.ts        # Booking state
├── utils/                 # Utility functions
│   └── booking.ts        # Smart booking logic
├── types/                 # TypeScript definitions
│   └── index.ts
├── locales/              # Traduzioni
│   ├── it-IT.json        # Italiano (base)
│   └── en-US.json        # English
└── .env                  # Environment variables
```

## 🎨 Design System

### Colori

- **Background Primary**: `#0F0F0F` (Deep Matte Black)
- **Background Secondary**: `#1C1C1E` (Dark Charcoal)
- **Accent Gold**: `#DCCAAB` (Champagne Gold)
- **Text Primary**: `#FFFFFF`
- **Text Secondary**: `#9CA3AF`

### Utilizzo Tailwind

```tsx
<View className="bg-bg-primary rounded-card p-6">
  <Text className="text-h2 text-text-primary font-bold">
    Titolo
  </Text>
</View>
```

## 🔐 Configurazione

### Variabili d'Ambiente

Il file `.env` contiene:

- ✅ Supabase URL e Anon Key
- ✅ Stripe Publishable Key (test mode)
- ✅ Stripe Secret Key (solo backend)
- ✅ Locale di default (it-IT)

**Importante**: `.env` è già in `.gitignore` per sicurezza.

## 🗄️ Database Supabase

### Schema Creato

- ✅ `users` - Utenti dell'app (estende auth.users)
- ✅ `staff` - Barbieri del salone
- ✅ `services` - Servizi offerti
- ✅ `appointments` - Prenotazioni

### Dati di Esempio

Il database contiene già:
- 3 barbieri (Marco, Luca, Giuseppe)
- 7 servizi (tagli, barba, trattamenti)

### Row Level Security (RLS)

- ✅ Gli utenti vedono solo i PROPRI appuntamenti
- ✅ Staff e servizi sono pubblici (solo lettura)
- ✅ Políticas configurate per sicurezza

## 🧠 Smart Booking Engine

Logica implementata in `utils/booking.ts`:

```typescript
import { getAvailableSlots } from '@/utils/booking';

// Calcola slot disponibili basandosi su:
// - Durata totale servizi selezionati
// - Orari di lavoro staff
// - Appuntamenti esistenti
// - Pause programmate

const slots = getAvailableSlots(
  selectedServices,
  staffSchedule,
  15 // intervallo slot in minuti
);
```

## 🌍 Internazionalizzazione

### Lingue Supportate

- 🇮🇹 Italiano (default)
- 🇬🇧 English

### Utilizzo

```tsx
import { t } from '@/lib/i18n';

// In componente
<Text>{t('common.welcome')}</Text>
<Text>{t('home.greeting', { name: 'Mario' })}</Text>
```

### Cambiare Lingua

```tsx
import { changeLanguage } from '@/lib/i18n';

changeLanguage('en-US'); // Switch to English
```

## 💳 Integrazione Stripe

### Test Mode

L'app è configurata in modalità test. Usa queste card per testare:

- **Successo**: `4242 4242 4242 4242`
- **Declino**: `4000 0000 0000 0002`
- **3D Secure**: `4000 0025 0000 3155`

CVC: qualsiasi 3 cifre  
Scadenza: qualsiasi data futura

### Sconto Online

Il sistema applica automaticamente il 5% di sconto per pagamenti online (implementare in logica checkout).

## 🛠️ Prossimi Step

### Componenti UI da Creare

1. **Button** (components/ui/Button.tsx)
2. **Card** con glassmorphism
3. **Input** per form
4. **ServiceCard** per lista servizi
5. **AppointmentCard** per prenotazioni

### Schermate da Sviluppare

1. **Auth Flow** (login/register)
2. **Service Selection** con multi-select
3. **Booking Wizard** (servizi → staff → data/ora → checkout)
4. **Appointment Detail** con azioni
5. **Admin Dashboard** (calendario timeline)

### Integrazioni

- [ ] Stripe Payment Intent per checkout
- [ ] Supabase Auth (email + social)
- [ ] Push notifications (Expo Notifications)
- [ ] Image upload (Supabase Storage)

## 📱 Testing

### Expo Go

Per testare su dispositivo fisico:

1. Installa Expo Go (iOS/Android)
2. Scansiona QR code da `npm start`
3. L'app si aggiorna automaticamente

### Build Locali

```bash
npx expo run:ios     # Build iOS locale
npx expo run:android # Build Android locale
```

## 🐛 Troubleshooting

### Errori TypeScript con className

Normale durante sviluppo - NativeWind processa i className a runtime. Se persistenti:

```bash
rm -rf node_modules .expo
npm install --legacy-peer-deps
npm start -- --clear
```

### Problemi Supabase

Verifica le credenziali in `.env` e che il progetto sia attivo:

```bash
# Testa connessione
curl https://iieqbljnxkfcmpipjner.supabase.co
```

## 📖 Risorse

- [Expo Docs](https://docs.expo.dev/)
- [Expo Router](https://docs.expo.dev/router/introduction/)
- [NativeWind](https://www.nativewind.dev/)
- [Supabase](https://supabase.com/docs)
- [Stripe](https://stripe.com/docs)

## 👨‍💻 Sviluppatore

Progetto inizializzato Da Andrea de Pasquale - 10 Febbraio 2026

---

**Status**: ✅ Base inizializzata | 🚧 UI in sviluppo | ⏳ Features avanzate
