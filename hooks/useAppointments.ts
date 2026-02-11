import { useEffect, useState } from 'react';
import { getUserAppointments } from '@/lib/supabase-queries';
import { useAuth } from '@/context/auth';
import type { Appointment } from '@/types';

export function useAppointments() {
  const { user } = useAuth();
  const [appointments, setAppointments] = useState<Appointment[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<Error | null>(null);

  useEffect(() => {
    if (!user) {
      setAppointments([]);
      setLoading(false);
      return;
    }

    fetchAppointments();
  }, [user]);

  const fetchAppointments = () => {
    if (!user) return;

    setLoading(true);
    getUserAppointments(user.id)
      .then(({ data, error }) => {
        if (error) throw error;
        setAppointments(data || []);
      })
      .catch(setError)
      .finally(() => setLoading(false));
  };

  return { appointments, loading, error, refetch: fetchAppointments };
}
