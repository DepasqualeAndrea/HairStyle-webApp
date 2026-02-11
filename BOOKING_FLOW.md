# 🗓️ Booking Flow - Guida al Test

Abbiamo implementato l'intero flusso di prenotazione con dati mock intelligenti.

## 🚀 Come Testare

1. **Home Screen (`/`)**
   - Vedrai il saluto personalizzato e l'ultimo appuntamento (mock).
   - Clicca sulla tab **"Servizi"** in basso o sull'input di ricerca.

2. **Selezione Servizi (`/explore`)**
   - Scegli uno o più servizi (es. "Taglio Premium" + "Barba").
   - Vedrai la barra inferiore aggiornarsi con **Totale Prezzo** e **Durata**.
   - Clicca **"Continua"**.

3. **Selezione Staff (`/book/staff`)**
   - Scegli tra "Marco Rossi" e "Luca Bianchi".
   - Clicca **"Continua"**.

4. **Data e Ora (`/book/datetime`)**
   - Il sistema calcolerà gli slot disponibili per OGGI.
   - Usa `getAvailableSlots` per mostrare solo orari compatibili con la durata totale.
   - Seleziona un orario (es. 10:30).
   - Clicca **"Continua"**.

5. **Riepilogo (`/book/checkout`)**
   - Controlla i servizi, staff e prezzo totale.
   - Il tasto "Conferma e Paga" è pronto per l'integrazione Stripe.

## 🛠️ Cosa c'è "sotto il cofano"

### Smart Booking Logic (`utils/booking.ts`)
- Calcola durata totale (es. 45min + 20min = 1h 05min)
- Controlla la disponibilità dello staff selezionato
- Filtra pause pranzo e appuntamenti esistenti (vedi `data/mock.ts`)

### State Management (`store/booking.ts`)
- Mantiene lo stato attraverso i vari step
- Calcola totali in tempo reale

### UI Components (`components/ui`)
- Pulsanti e Card riutilizzabili con supporto Dark Mode
- Design System applicato (colori, spacing)

---

**Prossimo Step**: Collegare il checkout a Stripe vero e proprio! 💳
