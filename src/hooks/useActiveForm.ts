import { useState, useEffect, useCallback } from 'react';
import { FormSchema } from '../types/form';
import { fetchActiveForm } from '../services/api';

export function useActiveForm(slug = 'property-registration') {
  const [form, setForm] = useState<FormSchema | null>(null);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  const loadForm = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const data = await fetchActiveForm(slug);
      setForm(data);
    } catch (err: any) {
      console.error('Failed to load active form:', err);
      setError(err.message || 'Unable to connect to server. Please check your internet connection.');
    } finally {
      setLoading(false);
    }
  }, [slug]);

  useEffect(() => {
    loadForm();
  }, [loadForm]);

  return { form, loading, error, retry: loadForm };
}
