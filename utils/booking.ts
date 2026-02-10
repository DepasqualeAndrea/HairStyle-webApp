import { Service, StaffSchedule, TimeSlot } from '@/types';
import { addMinutes, isAfter, isBefore, parseISO, format } from 'date-fns';

/**
 * Calcola gli slot temporali disponibili per un dato staff e servizi selezionati.
 * Mostra SOLO gli orari di inizio dove un blocco CONTINUO di tempo è disponibile.
 * 
 * @param selectedServices - Array di servizi che l'utente vuole prenotare
 * @param staffSchedule - Orario di lavoro dello staff per la data selezionata
 * @param slotInterval - Intervallo tra gli slot in minuti (default: 15)
 * @returns Array di slot temporali disponibili
 */
export function getAvailableSlots(
    selectedServices: Service[],
    staffSchedule: StaffSchedule,
    slotInterval: number = 15
): TimeSlot[] {
    // 1. Calcola la durata totale necessaria
    const totalDuration = selectedServices.reduce(
        (sum, service) => sum + service.duration,
        0
    );

    if (totalDuration === 0) return [];

    // 2. Parse orari di lavoro
    const dateStr = staffSchedule.date;
    const workStart = parseISO(`${dateStr}T${staffSchedule.workingHours.start}`);
    const workEnd = parseISO(`${dateStr}T${staffSchedule.workingHours.end}`);

    // 3. Genera tutti i possibili slot temporali negli orari di lavoro
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

    // 4. Filtra slot che:
    //    - Si estendono oltre l'orario di lavoro
    //    - Sovrappongono con appuntamenti esistenti
    //    - Sovrappongono con pause

    return allSlots.filter((slot) => {
        // Verifica se lo slot finisce prima della fine dell'orario di lavoro
        if (isAfter(slot.endTime, workEnd)) return false;

        // Verifica conflitti con appuntamenti esistenti
        const hasAppointmentConflict = staffSchedule.bookedSlots.some((booked) => {
            const bookedStart = parseISO(`${dateStr}T${booked.start}`);
            const bookedEnd = parseISO(`${dateStr}T${booked.end}`);

            // Verifica se c'è sovrapposizione
            return (
                (isAfter(slot.startTime, bookedStart) && isBefore(slot.startTime, bookedEnd)) ||
                (isAfter(slot.endTime, bookedStart) && isBefore(slot.endTime, bookedEnd)) ||
                (isBefore(slot.startTime, bookedStart) && isAfter(slot.endTime, bookedEnd))
            );
        });

        if (hasAppointmentConflict) return false;

        // Verifica conflitti con pause
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
 * Formatta un TimeSlot per la visualizzazione
 */
export function formatTimeSlot(slot: TimeSlot): string {
    return format(slot.startTime, 'HH:mm');
}

/**
 * Raggruppa gli slot temporali per ora per una migliore organizzazione UI
 */
export function groupSlotsByHour(slots: TimeSlot[]): Record<string, TimeSlot[]> {
    return slots.reduce((groups, slot) => {
        const hour = format(slot.startTime, 'HH:00');
        if (!groups[hour]) groups[hour] = [];
        groups[hour].push(slot);
        return groups;
    }, {} as Record<string, TimeSlot[]>);
}

/**
 * Calcola il prezzo totale dei servizi selezionati
 */
export function calculateTotalPrice(services: Service[]): number {
    return services.reduce((sum, service) => sum + service.price, 0);
}

/**
 * Calcola la durata totale dei servizi selezionati
 */
export function calculateTotalDuration(services: Service[]): number {
    return services.reduce((sum, service) => sum + service.duration, 0);
}

/**
 * Formatta il prezzo in euro
 */
export function formatPrice(cents: number): string {
    return `€${(cents / 100).toFixed(2).replace('.', ',')}`;
}

/**
 * Formatta la durata in formato leggibile
 */
export function formatDuration(minutes: number): string {
    if (minutes < 60) {
        return `${minutes}min`;
    }
    const hours = Math.floor(minutes / 60);
    const mins = minutes % 60;
    if (mins === 0) {
        return `${hours}h`;
    }
    return `${hours}h ${mins}min`;
}
