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
