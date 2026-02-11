import { create } from 'zustand';
import { Service, Product } from '@/types';

interface CartState {
    services: Service[];
    products: Product[];
    selectedDate: string | null;
    selectedTimeSlot: string | null;

    // Actions
    addService: (service: Service) => void;
    removeService: (serviceId: string) => void;
    addProduct: (product: Product) => void;
    removeProduct: (productId: string) => void;
    setDateAndTime: (date: string, time: string) => void;
    resetCart: () => void;

    // Computed (handled via getters or selectors usually, but Zustand handles state updates directly)
    totalDuration: number;
    cartTotal: number;
}

export const useCartStore = create<CartState>((set) => ({
    services: [],
    products: [],
    selectedDate: null,
    selectedTimeSlot: null,
    totalDuration: 0,
    cartTotal: 0,

    addService: (service) =>
        set((state) => {
            const exists = state.services.find((s) => s.id === service.id);
            if (exists) return state; // Prevent duplicates for services
            const newServices = [...state.services, service];
            return {
                services: newServices,
                totalDuration: state.totalDuration + service.duration_min,
                cartTotal: state.cartTotal + service.price,
            };
        }),

    removeService: (serviceId) =>
        set((state) => {
            const service = state.services.find((s) => s.id === serviceId);
            if (!service) return state;
            const newServices = state.services.filter((s) => s.id !== serviceId);
            return {
                services: newServices,
                totalDuration: state.totalDuration - service.duration_min,
                cartTotal: state.cartTotal - service.price,
            };
        }),

    addProduct: (product) =>
        set((state) => {
            // Allow duplicates for products? Assuming yes for quantity, but simple list for now
            const newProducts = [...state.products, product];
            return {
                products: newProducts,
                cartTotal: state.cartTotal + product.price,
            };
        }),

    removeProduct: (productId) =>
        set((state) => {
            const productIndex = state.products.findIndex((p) => p.id === productId);
            if (productIndex === -1) return state;

            const product = state.products[productIndex];
            const newProducts = [...state.products];
            newProducts.splice(productIndex, 1); // Remove only one instance if duplicates allowed

            return {
                products: newProducts,
                cartTotal: state.cartTotal - product.price,
            };
        }),

    setDateAndTime: (date, time) =>
        set(() => ({
            selectedDate: date,
            selectedTimeSlot: time,
        })),

    resetCart: () =>
        set({
            services: [],
            products: [],
            selectedDate: null,
            selectedTimeSlot: null,
            totalDuration: 0,
            cartTotal: 0,
        }),
}));
