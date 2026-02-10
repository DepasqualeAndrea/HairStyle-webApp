export interface Service {
    id: string;
    name: string;
    description: string;
    duration: number; // minuti
    price: number; // centesimi (es: 3500 = €35.00)
    category: 'capelli' | 'barba' | 'trattamenti' | 'styling';
    isActive: boolean;
    imageUrl?: string;
    isPopular?: boolean;
}

export interface Staff {
    id: string;
    name: string;
    role: string;
    bio?: string;
    photoUrl?: string;
    rating: number;
    reviewCount: number;
    specialties: string[];
    isActive: boolean;
}

export interface TimeSlot {
    startTime: Date;
    endTime: Date;
    isAvailable: boolean;
}

export interface StaffSchedule {
    staffId: string;
    date: string; // YYYY-MM-DD
    workingHours: {
        start: string; // HH:mm
        end: string;
    };
    breaks: {
        start: string;
        end: string;
        label: string;
    }[];
    bookedSlots: {
        start: string;
        end: string;
        appointmentId: string;
    }[];
}

export interface Appointment {
    id: string;
    userId: string;
    staffId: string;
    serviceIds: string[];
    date: string;
    startTime: string;
    endTime: string;
    status: 'pending' | 'confirmed' | 'completed' | 'cancelled';
    totalPrice: number;
    totalDuration: number;
    paymentMethod: 'online' | 'in_person';
    paymentStatus: 'paid' | 'pending' | 'failed';
    notes?: string;
    createdAt: Date;
    updatedAt: Date;
}

export interface User {
    id: string;
    email: string;
    name: string;
    phone?: string;
    photoUrl?: string;
    membershipTier?: 'standard' | 'gold' | 'platinum';
    notificationPreferences: {
        appointmentReminders: boolean;
        promotions: boolean;
    };
    createdAt: Date;
}

export interface Database {
    public: {
        Tables: {
            services: {
                Row: Service;
                Insert: Omit<Service, 'id'>;
                Update: Partial<Omit<Service, 'id'>>;
            };
            staff: {
                Row: Staff;
                Insert: Omit<Staff, 'id'>;
                Update: Partial<Omit<Staff, 'id'>>;
            };
            appointments: {
                Row: Appointment;
                Insert: Omit<Appointment, 'id' | 'createdAt' | 'updatedAt'>;
                Update: Partial<Omit<Appointment, 'id' | 'createdAt' | 'updatedAt'>>;
            };
            users: {
                Row: User;
                Insert: Omit<User, 'id' | 'createdAt'>;
                Update: Partial<Omit<User, 'id' | 'createdAt'>>;
            };
        };
    };
}
