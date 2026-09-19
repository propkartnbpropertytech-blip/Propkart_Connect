import { FormSchema, FormSubmissionPayload, SubmissionResult, UploadedMediaItem } from '../types/form';

// Fallback to live HTTPS domain
const BASE_URL = import.meta.env.VITE_API_URL || 'https://api-propkart.nbpropertytech.com/api/v1';

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
