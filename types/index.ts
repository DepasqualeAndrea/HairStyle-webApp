export interface Service {
    id: string;
    name: string;
    price: number;
    duration_min: number; // Active work time (e.g. applying color)
    processing_time_min?: number; // Idle time (e.g. color setting) - Staff is free here!
    category: 'Hair' | 'Beard' | 'Color' | 'Treatment' | 'Styling';
    target_gender: 'Male' | 'Female' | 'Unisex';
    description?: string;
    image_url?: string;
}

export interface Product {
    id: string;
    name: string;
    description: string;
    price: number;
    image_url: string;
    stock_qty: number;
}

export interface Appointment {
    id: string;
    user_id: string;
    date: string;
    start_time: string;
    services: Service[];
    products: Product[];
    total_price: number;
    status: 'pending' | 'confirmed' | 'cancelled' | 'completed' | 'no_show';
}

export interface UserProfile {
    id: string;
    full_name: string;
    phone: string;
    email: string;
    avatar_url?: string;
    loyalty_points: number;
    technical_notes?: string; // Admin only: "Formula colore: 5.0 Wella..."
}
