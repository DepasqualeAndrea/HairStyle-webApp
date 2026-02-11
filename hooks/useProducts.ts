import { useEffect, useState } from 'react';
import { getProducts } from '@/lib/supabase-queries';
import type { Product } from '@/types';

export function useProducts() {
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<Error | null>(null);

  useEffect(() => {
    fetchProducts();
  }, []);

  const fetchProducts = () => {
    setLoading(true);
    getProducts()
      .then(({ data, error }) => {
        if (error) throw error;
        setProducts(data || []);
      })
      .catch(setError)
      .finally(() => setLoading(false));
  };

  return { products, loading, error, refetch: fetchProducts };
}
