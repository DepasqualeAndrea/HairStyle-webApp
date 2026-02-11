-- Hair Style App - Initial Database Schema
-- Created: 2026-02-11

-- Enable UUID extension
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- ============================================================================
-- USERS & PROFILES
-- ============================================================================

-- PROFILES (extends Supabase auth.users)
CREATE TABLE public.profiles (
  id UUID REFERENCES auth.users PRIMARY KEY,
  full_name TEXT NOT NULL,
  phone TEXT NOT NULL,
  avatar_url TEXT,
  loyalty_points INTEGER DEFAULT 0,
  member_since TIMESTAMP DEFAULT NOW(),
  created_at TIMESTAMP DEFAULT NOW(),
  updated_at TIMESTAMP DEFAULT NOW()
);

-- CUSTOMER TECHNICAL NOTES (formule colore, allergie, preferenze)
CREATE TABLE public.customer_notes (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id UUID REFERENCES public.profiles(id) ON DELETE CASCADE,
  note_type TEXT CHECK (note_type IN ('color_formula', 'allergy', 'preference', 'general')),
  content TEXT NOT NULL,
  created_by UUID REFERENCES auth.users, -- admin che ha creato la nota
  created_at TIMESTAMP DEFAULT NOW()
);

-- ============================================================================
-- SERVICES & PRODUCTS
-- ============================================================================

-- SERVICES
CREATE TABLE public.services (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  name TEXT NOT NULL,
  description TEXT,
  duration_min INTEGER NOT NULL,
  processing_time_min INTEGER DEFAULT 0,
  price INTEGER NOT NULL, -- in centesimi (es. 5000 = €50.00)
  category TEXT CHECK (category IN ('capelli', 'barba', 'trattamenti', 'styling')),
  gender TEXT CHECK (gender IN ('uomo', 'donna', 'unisex')),
  is_active BOOLEAN DEFAULT TRUE,
  is_popular BOOLEAN DEFAULT FALSE,
  image_url TEXT,
  created_at TIMESTAMP DEFAULT NOW(),
  updated_at TIMESTAMP DEFAULT NOW()
);

-- PRODUCTS (shop)
CREATE TABLE public.products (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  name TEXT NOT NULL,
  description TEXT,
  price INTEGER NOT NULL, -- in centesimi
  stock_qty INTEGER DEFAULT 0,
  image_url TEXT,
  is_active BOOLEAN DEFAULT TRUE,
  created_at TIMESTAMP DEFAULT NOW(),
  updated_at TIMESTAMP DEFAULT NOW()
);

-- ============================================================================
-- STAFF & SCHEDULING
-- ============================================================================

-- STAFF
CREATE TABLE public.staff (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  name TEXT NOT NULL,
  role TEXT NOT NULL, -- 'Master Stylist', 'Senior Stylist', etc.
  rating DECIMAL(2,1) DEFAULT 5.0,
  review_count INTEGER DEFAULT 0,
  specialties TEXT[], -- Array di specialità
  is_active BOOLEAN DEFAULT TRUE,
  avatar_url TEXT,
  created_at TIMESTAMP DEFAULT NOW()
);

-- STAFF SCHEDULE (orari settimanali)
CREATE TABLE public.staff_schedules (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  staff_id UUID REFERENCES public.staff(id) ON DELETE CASCADE,
  day_of_week INTEGER CHECK (day_of_week BETWEEN 0 AND 6), -- 0=Domenica, 1=Lunedì, etc.
  is_working BOOLEAN DEFAULT TRUE,
  start_time TIME,
  end_time TIME,
  break_start TIME,
  break_end TIME,
  UNIQUE(staff_id, day_of_week)
);

-- BLOCKED DATES (ferie, corsi, chiusure)
CREATE TABLE public.blocked_dates (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  staff_id UUID REFERENCES public.staff(id) ON DELETE CASCADE, -- NULL = tutto il salone chiuso
  date DATE NOT NULL,
  reason TEXT, -- 'Ferie', 'Corso Formazione', etc.
  created_at TIMESTAMP DEFAULT NOW()
);

-- ============================================================================
-- APPOINTMENTS
-- ============================================================================

-- APPOINTMENTS
CREATE TABLE public.appointments (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id UUID REFERENCES public.profiles(id) ON DELETE SET NULL,
  staff_id UUID REFERENCES public.staff(id) ON DELETE SET NULL,
  appointment_date DATE NOT NULL,
  start_time TIME NOT NULL,
  end_time TIME NOT NULL,
  total_price INTEGER NOT NULL, -- in centesimi
  status TEXT CHECK (status IN ('pending', 'confirmed', 'cancelled', 'completed', 'no_show')) DEFAULT 'pending',
  payment_method TEXT CHECK (payment_method IN ('online', 'in_person')),
  payment_status TEXT CHECK (payment_status IN ('pending', 'paid', 'refunded')) DEFAULT 'pending',
  stripe_payment_intent_id TEXT, -- per pagamenti Stripe
  notes TEXT,
  created_at TIMESTAMP DEFAULT NOW(),
  updated_at TIMESTAMP DEFAULT NOW()
);

-- APPOINTMENT SERVICES (many-to-many)
CREATE TABLE public.appointment_services (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  appointment_id UUID REFERENCES public.appointments(id) ON DELETE CASCADE,
  service_id UUID REFERENCES public.services(id) ON DELETE SET NULL,
  service_name TEXT NOT NULL, -- snapshot del nome (caso servizio venga cancellato)
  service_price INTEGER NOT NULL, -- snapshot prezzo
  service_duration INTEGER NOT NULL -- snapshot durata
);

-- APPOINTMENT PRODUCTS (prodotti acquistati con appuntamento)
CREATE TABLE public.appointment_products (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  appointment_id UUID REFERENCES public.appointments(id) ON DELETE CASCADE,
  product_id UUID REFERENCES public.products(id) ON DELETE SET NULL,
  product_name TEXT NOT NULL,
  product_price INTEGER NOT NULL,
  quantity INTEGER DEFAULT 1
);

-- ============================================================================
-- LOYALTY & PACKAGES
-- ============================================================================

-- LOYALTY HISTORY
CREATE TABLE public.loyalty_history (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id UUID REFERENCES public.profiles(id) ON DELETE CASCADE,
  points_change INTEGER NOT NULL, -- +100 earned, -50 redeemed
  reason TEXT,
  appointment_id UUID REFERENCES public.appointments(id) ON DELETE SET NULL,
  created_at TIMESTAMP DEFAULT NOW()
);

-- PACKAGES (pacchetti tipo "5 Pieghe")
CREATE TABLE public.packages (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  name TEXT NOT NULL,
  description TEXT,
  service_id UUID REFERENCES public.services(id) ON DELETE SET NULL,
  quantity INTEGER NOT NULL, -- es. 5 pieghe
  total_price INTEGER NOT NULL,
  discount_percent INTEGER, -- es. 10% di sconto sul totale
  is_active BOOLEAN DEFAULT TRUE,
  created_at TIMESTAMP DEFAULT NOW()
);

-- USER PACKAGES (pacchetti acquistati dall'utente)
CREATE TABLE public.user_packages (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id UUID REFERENCES public.profiles(id) ON DELETE CASCADE,
  package_id UUID REFERENCES public.packages(id) ON DELETE SET NULL,
  remaining_quantity INTEGER NOT NULL,
  purchased_at TIMESTAMP DEFAULT NOW(),
  expires_at TIMESTAMP -- opzionale
);

-- ============================================================================
-- INDEXES for Performance
-- ============================================================================

CREATE INDEX idx_appointments_user ON public.appointments(user_id);
CREATE INDEX idx_appointments_staff_date ON public.appointments(staff_id, appointment_date);
CREATE INDEX idx_appointments_status ON public.appointments(status);
CREATE INDEX idx_customer_notes_user ON public.customer_notes(user_id);
CREATE INDEX idx_loyalty_history_user ON public.loyalty_history(user_id);
CREATE INDEX idx_services_gender ON public.services(gender) WHERE is_active = TRUE;
CREATE INDEX idx_services_category ON public.services(category) WHERE is_active = TRUE;

-- ============================================================================
-- ROW LEVEL SECURITY (RLS)
-- ============================================================================

ALTER TABLE public.profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.customer_notes ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.appointments ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.loyalty_history ENABLE ROW LEVEL SECURITY;

-- ============================================================================
-- RLS POLICIES
-- ============================================================================

-- PROFILES: Users can view/update only their own profile
CREATE POLICY "Users can view own profile"
  ON public.profiles FOR SELECT
  USING (auth.uid() = id);

CREATE POLICY "Users can update own profile"
  ON public.profiles FOR UPDATE
  USING (auth.uid() = id);

CREATE POLICY "Users can insert their own profile"
  ON public.profiles FOR INSERT
  WITH CHECK (auth.uid() = id);

-- APPOINTMENTS: Users can view only their own appointments
CREATE POLICY "Users can view own appointments"
  ON public.appointments FOR SELECT
  USING (auth.uid() = user_id);

CREATE POLICY "Users can create appointments"
  ON public.appointments FOR INSERT
  WITH CHECK (auth.uid() = user_id);

-- CUSTOMER NOTES: Only admin can view/create (implement admin check separately)
CREATE POLICY "Users can view own notes"
  ON public.customer_notes FOR SELECT
  USING (auth.uid() = user_id);

-- LOYALTY HISTORY: Users can view only their own history
CREATE POLICY "Users can view own loyalty history"
  ON public.loyalty_history FOR SELECT
  USING (auth.uid() = user_id);

-- ============================================================================
-- TRIGGERS for updated_at
-- ============================================================================

CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = NOW();
    RETURN NEW;
END;
$$ language 'plpgsql';

CREATE TRIGGER update_profiles_updated_at BEFORE UPDATE ON public.profiles
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_services_updated_at BEFORE UPDATE ON public.services
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_appointments_updated_at BEFORE UPDATE ON public.appointments
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

-- ============================================================================
-- COMMENTS
-- ============================================================================

COMMENT ON TABLE public.profiles IS 'User profiles with loyalty points and member info';
COMMENT ON TABLE public.customer_notes IS 'Technical notes for customers (color formulas, allergies, preferences)';
COMMENT ON TABLE public.services IS 'Salon services with duration and processing time for smart scheduling';
COMMENT ON TABLE public.staff IS 'Salon staff members with ratings and specialties';
COMMENT ON TABLE public.appointments IS 'Customer appointments with payment status';
COMMENT ON TABLE public.loyalty_history IS 'Transaction log for loyalty points';
COMMENT ON TABLE public.packages IS 'Service packages (e.g., 5 haircuts bundle)';
-- Seed Data per Hair Style App
-- Esegui questo DOPO aver applicato 0001_initial_schema.sql

-- ============================================================================
-- STAFF MEMBERS
-- ============================================================================

INSERT INTO public.staff (id, name, role, rating, review_count, specialties, avatar_url) VALUES
  ('11111111-1111-1111-1111-111111111111', 'Marco Rossi', 'Master Stylist', 5.0, 127, ARRAY['taglio', 'colore', 'styling'], null),
  ('22222222-2222-2222-2222-222222222222', 'Giulia Bianchi', 'Senior Stylist', 4.9, 98, ARRAY['taglio donna', 'colore', 'mèches'], null),
  ('33333333-3333-3333-3333-333333333333', 'Luca Verdi', 'Stylist', 4.8, 64, ARRAY['taglio uomo', 'barba', 'styling'], null);

-- ============================================================================
-- STAFF SCHEDULES (Lunedì-Sabato, 9:00-19:00)
-- ============================================================================

-- Marco Rossi - Lunedì a Sabato
INSERT INTO public.staff_schedules (staff_id, day_of_week, is_working, start_time, end_time, break_start, break_end) VALUES
  ('11111111-1111-1111-1111-111111111111', 1, TRUE, '09:00', '19:00', '13:00', '14:00'), -- Lunedì
  ('11111111-1111-1111-1111-111111111111', 2, TRUE, '09:00', '19:00', '13:00', '14:00'), -- Martedì
  ('11111111-1111-1111-1111-111111111111', 3, TRUE, '09:00', '19:00', '13:00', '14:00'), -- Mercoledì
  ('11111111-1111-1111-1111-111111111111', 4, TRUE, '09:00', '19:00', '13:00', '14:00'), -- Giovedì
  ('11111111-1111-1111-1111-111111111111', 5, TRUE, '09:00', '19:00', '13:00', '14:00'), -- Venerdì
  ('11111111-1111-1111-1111-111111111111', 6, TRUE, '09:00', '18:00', '13:00', '14:00'); -- Sabato

-- Giulia Bianchi - Lunedì a Sabato
INSERT INTO public.staff_schedules (staff_id, day_of_week, is_working, start_time, end_time, break_start, break_end) VALUES
  ('22222222-2222-2222-2222-222222222222', 1, TRUE, '09:00', '19:00', '13:00', '14:00'),
  ('22222222-2222-2222-2222-222222222222', 2, TRUE, '09:00', '19:00', '13:00', '14:00'),
  ('22222222-2222-2222-2222-222222222222', 3, TRUE, '09:00', '19:00', '13:00', '14:00'),
  ('22222222-2222-2222-2222-222222222222', 4, TRUE, '09:00', '19:00', '13:00', '14:00'),
  ('22222222-2222-2222-2222-222222222222', 5, TRUE, '09:00', '19:00', '13:00', '14:00'),
  ('22222222-2222-2222-2222-222222222222', 6, TRUE, '09:00', '18:00', '13:00', '14:00');

-- Luca Verdi - Martedì a Sabato (riposo Lunedì)
INSERT INTO public.staff_schedules (staff_id, day_of_week, is_working, start_time, end_time, break_start, break_end) VALUES
  ('33333333-3333-3333-3333-333333333333', 2, TRUE, '10:00', '19:00', '13:00', '14:00'),
  ('33333333-3333-3333-3333-333333333333', 3, TRUE, '10:00', '19:00', '13:00', '14:00'),
  ('33333333-3333-3333-3333-333333333333', 4, TRUE, '10:00', '19:00', '13:00', '14:00'),
  ('33333333-3333-3333-3333-333333333333', 5, TRUE, '10:00', '19:00', '13:00', '14:00'),
  ('33333333-3333-3333-3333-333333333333', 6, TRUE, '10:00', '18:00', '13:00', '14:00');

-- ============================================================================
-- SERVICES (da data/mock.ts)
-- ============================================================================

-- UOMO - Capelli
INSERT INTO public.services (name, description, duration_min, processing_time_min, price, category, gender, is_popular) VALUES
  ('Taglio Uomo', 'Taglio classico o moderno con consulenza styling', 30, 0, 2500, 'capelli', 'uomo', TRUE),
  ('Taglio + Shampoo', 'Taglio completo con lavaggio e styling', 45, 0, 3000, 'capelli', 'uomo', FALSE),
  ('Taglio Kids', 'Taglio per bambini fino a 12 anni', 20, 0, 1800, 'capelli', 'uomo', FALSE);

-- UOMO - Barba
INSERT INTO public.services (name, description, duration_min, processing_time_min, price, category, gender, is_popular) VALUES
  ('Barba Completa', 'Regolazione, rifinitura e trattamento barba', 20, 0, 1500, 'barba', 'uomo', TRUE),
  ('Rasatura Tradizionale', 'Rasatura a mano libera con sapone caldo', 30, 0, 2000, 'barba', 'uomo', FALSE),
  ('Taglio + Barba', 'Pacchetto completo taglio capelli e barba', 50, 0, 4000, 'barba', 'uomo', TRUE);

-- DONNA - Capelli
INSERT INTO public.services (name, description, duration_min, processing_time_min, price, category, gender, is_popular) VALUES
  ('Taglio Donna', 'Taglio con consulenza personalizzata', 45, 0, 3500, 'capelli', 'donna', TRUE),
  ('Piega', 'Piega professionale con styling', 30, 0, 2500, 'capelli', 'donna', TRUE),
  ('Taglio + Piega', 'Servizio completo taglio e piega', 60, 0, 5000, 'capelli', 'donna', TRUE);

-- DONNA - Trattamenti Colore
INSERT INTO public.services (name, description, duration_min, processing_time_min, price, category, gender, is_popular) VALUES
  ('Colore Completo', 'Colorazione completa con prodotti premium', 60, 40, 12000, 'trattamenti', 'donna', TRUE),
  ('Ritocco Ricrescita', 'Ritocco radici e ricrescita', 75, 60, 8000, 'trattamenti', 'donna', FALSE),
  ('Mèches', 'Mèches classiche o california', 90, 75, 15000, 'trattamenti', 'donna', TRUE),
  ('Shatush/Balayage', 'Degradé naturale con tecnica a mano libera', 120, 90, 18000, 'trattamenti', 'donna', TRUE),
  ('Decolorazione', 'Decolorazione completa per colorazioni estreme', 100, 70, 14000, 'trattamenti', 'donna', FALSE);

-- DONNA - Trattamenti
INSERT INTO public.services (name, description, duration_min, processing_time_min, price, category, gender, is_popular) VALUES
  ('Stiratura Brasiliana', 'Trattamento lisciante alla cheratina duraturo', 120, 0, 25000, 'trattamenti', 'donna', FALSE),
  ('Permanente', 'Permanente classica o moderna', 90, 60, 12000, 'trattamenti', 'donna', FALSE);

-- ============================================================================
-- PRODUCTS (esempi)
-- ============================================================================

INSERT INTO public.products (name, description, price, stock_qty, is_active) VALUES
  ('Shampoo Professionale 250ml', 'Shampoo professionale per capelli trattati', 2500, 50, TRUE),
  ('Conditioner Riparatore 250ml', 'Balsamo ristrutturante intensivo', 2800, 45, TRUE),
  ('Maschera Idratante 200ml', 'Maschera nutriente settimanale', 3500, 30, TRUE),
  ('Olio Protettivo Termico', 'Spray termoprotettore pre-piega', 2200, 60, TRUE),
  ('Cera Styling Uomo', 'Cera modellante a tenuta forte', 1800, 40, TRUE),
  ('Hair Spray Extra Strong', 'Lacca fissaggio extra forte', 1500, 55, TRUE);

-- ============================================================================
-- PACKAGES (esempi)
-- ============================================================================

INSERT INTO public.packages (name, description, service_id, quantity, total_price, discount_percent) VALUES
  ('Pacchetto 5 Pieghe', 'Acquista 5 pieghe al prezzo di 4', (SELECT id FROM services WHERE name = 'Piega' LIMIT 1), 5, 10000, 20),
  ('Pacchetto 10 Tagli Uomo', 'Pacchetto fedeltà 10 tagli', (SELECT id FROM services WHERE name = 'Taglio Uomo' LIMIT 1), 10, 22500, 10);

COMMENT ON TABLE public.staff IS 'Initial staff members';
COMMENT ON TABLE public.services IS 'Services imported from mock data';
