import { useState, useEffect, useCallback, useRef } from 'react';
import { FormSchema } from '../types/form';
import { fetchActiveForm } from '../services/api';

export function useActiveForm(slug = 'property-registration') {
  const [form, setForm] = useState<FormSchema | null>(null);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);
  const hasLoadedOnce = useRef(false);

  const loadForm = useCallback(
    async (isInitial = false) => {
      if (isInitial) setLoading(true);
      try {
        const data = await fetchActiveForm(slug);
        setForm(data);
        setError(null);
        hasLoadedOnce.current = true;
      } catch (err: any) {
        console.error('Failed to load active form:', err);
        if (!hasLoadedOnce.current) {
          setError(err.message || 'Unable to connect to server. Please check your internet connection.');
        }
      } finally {
        if (isInitial) setLoading(false);
      }
    },
    [slug]
  );

  useEffect(() => {
    // 1. Initial Load
    loadForm(true);

    // 2. Immediate refetch on tab focus (when user switches from Panel to Connect)
    const handleFocus = () => {
      loadForm(false);
    };
    window.addEventListener('focus', handleFocus);

    // 3. Instant cross-tab broadcast synchronization
    let channel: BroadcastChannel | null = null;
    try {
      channel = new BroadcastChannel('propkart_sync');
      channel.onmessage = (event) => {
        if (event.data?.type === 'ASSISTANCE_PHONE_UPDATED') {
          if (event.data.phone) {
            setForm((prev) => (prev ? { ...prev, assistance_phone: event.data.phone } : prev));
          }
          loadForm(false);
        }
      };
    } catch (e) {}

    // 4. Storage event listener (fallback cross-tab communication)
    const handleStorage = (e: StorageEvent) => {
      if (e.key === 'propkart_assistance_phone' || e.key === 'propkart_assistance_phone_updated_at') {
        if (e.key === 'propkart_assistance_phone' && e.newValue) {
          setForm((prev) => (prev ? { ...prev, assistance_phone: e.newValue! } : prev));
        }
        loadForm(false);
      }
    };
    window.addEventListener('storage', handleStorage);

    // 5. Periodic polling (every 5 seconds) to ensure fresh schema
    const timer = setInterval(() => {
      loadForm(false);
    }, 5000);

    return () => {
      window.removeEventListener('focus', handleFocus);
      window.removeEventListener('storage', handleStorage);
      if (channel) channel.close();
      clearInterval(timer);
    };
  }, [loadForm]);

  return { form, loading, error, retry: () => loadForm(true) };
}
