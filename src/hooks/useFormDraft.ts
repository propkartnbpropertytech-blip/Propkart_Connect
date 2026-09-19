import { useState, useEffect, useRef } from 'react';

const DRAFT_KEY_PREFIX = 'propkart_connect_draft_';

export function useFormDraft(versionId: string) {
  const [draft, setDraft] = useState<Record<string, any>>({});
  const [isDraftRestored, setIsDraftRestored] = useState<boolean>(false);
  const isInitialMount = useRef(true);

  const storageKey = `${DRAFT_KEY_PREFIX}${versionId}`;

  // Load draft on mount / versionId change
  useEffect(() => {
    if (!versionId) return;
    try {
      const saved = localStorage.getItem(storageKey);
      if (saved) {
        const parsed = JSON.parse(saved);
        if (Object.keys(parsed).length > 0) {
          setDraft(parsed);
          setIsDraftRestored(true);
        }
      }
    } catch (e) {
      console.warn('Failed to load form draft from localStorage:', e);
    }
  }, [versionId, storageKey]);

  // Save draft on change with debounce
  useEffect(() => {
    if (isInitialMount.current) {
      isInitialMount.current = false;
      return;
    }
    if (!versionId) return;

    const timer = setTimeout(() => {
      try {
        if (Object.keys(draft).length > 0) {
          localStorage.setItem(storageKey, JSON.stringify(draft));
        }
      } catch (e) {
        console.warn('Failed to persist draft to localStorage:', e);
      }
    }, 400);

    return () => clearTimeout(timer);
  }, [draft, versionId, storageKey]);

  const clearDraft = () => {
    try {
      localStorage.removeItem(storageKey);
      setDraft({});
      setIsDraftRestored(false);
    } catch (e) {
      console.warn('Failed to clear draft:', e);
    }
  };

  const updateField = (key: string, value: any) => {
    setDraft((prev) => ({ ...prev, [key]: value }));
  };

  return {
    draft,
    setDraft,
    updateField,
    isDraftRestored,
    setIsDraftRestored,
    clearDraft,
  };
}
