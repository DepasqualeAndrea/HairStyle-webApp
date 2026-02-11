import { useEffect, useState } from 'react';
import { supabase } from '@/lib/supabase';
import { Service, Product } from '@/types';

export function useCatalog() {
    const [services, setServices] = useState<Service[]>([]);
    const [products, setProducts] = useState<Product[]>([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        async function fetchCatalog() {
            try {
                const { data: servicesData, error: servicesError } = await supabase
                    .from('services')
                    .select('*')
                    .eq('is_active', true);

                const { data: productsData, error: productsError } = await supabase
                    .from('products')
                    .select('*')
                    .eq('is_active', true);

                if (servicesError) console.error('Error fetching services:', servicesError);
                if (productsError) console.error('Error fetching products:', productsError);

                setServices(servicesData || []);
                setProducts(productsData || []);
            } catch (e) {
                console.error('Unexpected error:', e);
            } finally {
                setLoading(false);
            }
        }

        fetchCatalog();
    }, []);

    return { services, products, loading };
}
