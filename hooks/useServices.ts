import { useEffect, useState } from 'react';
import { getServices } from '@/lib/supabase-queries';
import type { Service } from '@/types';

export function useServices(gender?: 'uomo' | 'donna') {
  const [services, setServices] = useState<Service[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<Error | null>(null);

  useEffect(() => {
    getServices(gender)
      .then(({ data, error }) => {
        if (error) throw error;
        setServices(data || []);
      })
      .catch(setError)
      .finally(() => setLoading(false));
  }, [gender]);

  const refetch = () => {
    setLoading(true);
    getServices(gender)
      .then(({ data, error }) => {
        if (error) throw error;
        setServices(data || []);
      })
      .catch(setError)
      .finally(() => setLoading(false));
  };

  return { services, loading, error, refetch };
}
