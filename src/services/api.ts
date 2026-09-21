import { FormSchema, FormSubmissionPayload, SubmissionResult, UploadedMediaItem } from '../types/form';

const BASE_URL = import.meta.env.VITE_API_URL || '/api/v1';

export async function fetchActiveForm(slug = 'property-registration'): Promise<FormSchema> {
  const res = await fetch(`${BASE_URL}/forms/active?slug=${encodeURIComponent(slug)}`, {
    headers: { 'Accept': 'application/json' },
  });

  if (!res.ok) {
    const errData = await res.json().catch(() => ({}));
    throw new Error(errData.message || `Failed to fetch form (Status ${res.status})`);
  }

  const json = await res.json();
  return json.data;
}

export async function uploadMediaFiles(files: File[]): Promise<UploadedMediaItem[]> {
  const formData = new FormData();
  for (const file of files) {
    formData.append('files', file);
  }

  const res = await fetch(`${BASE_URL}/form-submissions/upload-media`, {
    method: 'POST',
    body: formData,
  });

  if (!res.ok) {
    const errData = await res.json().catch(() => ({}));
    throw new Error(errData.message || `Media upload failed (Status ${res.status})`);
  }

  const json = await res.json();
  return json.data;
}

export async function submitRegistrationForm(payload: FormSubmissionPayload): Promise<SubmissionResult> {
  const res = await fetch(`${BASE_URL}/form-submissions`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'Accept': 'application/json',
    },
    body: JSON.stringify(payload),
  });

  const json = await res.json();
  if (!res.ok) {
    const err = new Error(json.message || 'Failed to submit registration');
    (err as any).fields = json.errors;
    (err as any).errorCode = json.errorCode;
    throw err;
  }

  return json.data;
}

export async function verifyRegistrationCode(code: string): Promise<any> {
  const res = await fetch(`${BASE_URL}/form-submissions/verify/${encodeURIComponent(code)}`);
  if (!res.ok) throw new Error('Registration not found');
  const json = await res.json();
  return json.data;
}

export async function checkPhoneDuplicate(phone: string): Promise<{ exists: boolean; message?: string }> {
  const clean = phone.replace(/\D/g, '').slice(-10);
  if (clean.length < 10) return { exists: false };
  const res = await fetch(`${BASE_URL}/form-submissions/check-phone?phone=${encodeURIComponent(clean)}`);
  if (!res.ok) return { exists: false };
  const json = await res.json();
  return json;
}

export async function fetchPublicProperty(code: string): Promise<any> {
  const res = await fetch(`${BASE_URL}/form-submissions/public-property/${encodeURIComponent(code)}`);
  if (!res.ok) {
    const err = await res.json().catch(() => ({}));
    throw new Error(err.message || 'Property details not found');
  }
  const json = await res.json();
  return json.data;
}

