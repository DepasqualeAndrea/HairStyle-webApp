import { create } from 'zustand';
import { Service, Staff, TimeSlot } from '@/types';
import { calculateTotalPrice, calculateTotalDuration } from '@/utils/booking';

interface BookingState {
    selectedServices: Service[];
    selectedStaff: Staff | null;
    selectedDate: string | null;
    selectedTimeSlot: TimeSlot | null;
    paymentMethod: 'online' | 'in_person';

    // Actions
    addService: (service: Service) => void;
    removeService: (serviceId: string) => void;
    toggleService: (service: Service) => void;
    clearServices: () => void;
    setStaff: (staff: Staff) => void;
    setDate: (date: string) => void;
    setTimeSlot: (slot: TimeSlot) => void;
    setPaymentMethod: (method: 'online' | 'in_person') => void;
    resetBooking: () => void;

    // Computed
    getTotalPrice: () => number;
    getTotalDuration: () => number;
    isServiceSelected: (serviceId: string) => boolean;
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

    toggleService: (service) => {
        const { selectedServices } = get();
        const isSelected = selectedServices.some((s) => s.id === service.id);

        if (isSelected) {
            set({
                selectedServices: selectedServices.filter((s) => s.id !== service.id),
            });
        } else {
            set({
                selectedServices: [...selectedServices, service],
            });
        }
    },

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
        return calculateTotalPrice(selectedServices);
    },

    getTotalDuration: () => {
        const { selectedServices } = get();
        return calculateTotalDuration(selectedServices);
    },

    isServiceSelected: (serviceId) => {
        const { selectedServices } = get();
        return selectedServices.some((s) => s.id === serviceId);
    },
}));
