import { useEffect, useState } from 'react';
import { getLoyaltyHistory, getUserProfile } from '@/lib/supabase-queries';
import { useAuth } from '@/context/auth';

export function useLoyalty() {
  const { user } = useAuth();
  const [points, setPoints] = useState(0);
  const [history, setHistory] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<Error | null>(null);

  useEffect(() => {
    if (!user) {
      setPoints(0);
      setHistory([]);
      setLoading(false);
      return;
    }

    fetchLoyalty();
  }, [user]);

  const fetchLoyalty = async () => {
    if (!user) return;

    setLoading(true);
    try {
      // Fetch profile for points
      const { data: profile, error: profileError } = await getUserProfile(user.id);
      if (profileError) throw profileError;
      setPoints(profile?.loyalty_points || 0);

      // Fetch history
      const { data: historyData, error: historyError } = await getLoyaltyHistory(user.id);
      if (historyError) throw historyError;
      setHistory(historyData || []);
    } catch (err) {
      setError(err as Error);
    } finally {
      setLoading(false);
    }
  };

  return { points, history, loading, error, refetch: fetchLoyalty };
}
