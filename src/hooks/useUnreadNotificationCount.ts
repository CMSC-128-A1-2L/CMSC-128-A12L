import { useState, useEffect } from 'react';
import { useSession } from 'next-auth/react';

export function useUnreadNotificationCount() {
  const { data: session } = useSession();
  const [unreadCount, setUnreadCount] = useState(0);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchUnreadCount = async () => {
      if (!session) {
        setLoading(false);
        return;
      }

      try {
        const response = await fetch('/api/notifications/unread-count');
        if (!response.ok) {
          throw new Error('Failed to fetch unread notifications count');
        }
        const data = await response.json();
        setUnreadCount(data.unreadCount);
      } catch (err) {
        setError(err instanceof Error ? err.message : 'An error occurred');
      } finally {
        setLoading(false);
      }
    };

    fetchUnreadCount();

    // Set up polling every 30 seconds
    const interval = setInterval(fetchUnreadCount, 30000);

    return () => clearInterval(interval);
  }, [session]);

  return { unreadCount, loading, error };
} 