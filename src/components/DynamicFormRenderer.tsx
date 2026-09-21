import React, { useState } from 'react';
import { FormSchema, UploadedMediaItem, SubmissionResult } from '../types/form';
import { DynamicField } from './DynamicField';
import { submitRegistrationForm } from '../services/api';
import { useFormDraft } from '../hooks/useFormDraft';
import { AppSnackbar } from './common/AppSnackbar';
import {
  Send,
  Loader2,
  Building2,
  ShieldCheck,
  CheckCircle2,
} from 'lucide-react';

interface DynamicFormRendererProps {
  schema: FormSchema;
  onSuccess: (result: SubmissionResult, formData: Record<string, any>) => void;
}

export const DynamicFormRenderer: React.FC<DynamicFormRendererProps> = ({ schema, onSuccess }) => {
  const { version, sections, title, description } = schema;

  const {
    draft,
    updateField,
    isDraftRestored,
    setIsDraftRestored,
    clearDraft,
  } = useFormDraft(version.id);

  const [uploadedMedia, setUploadedMedia] = useState<UploadedMediaItem[]>([]);
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [snackbar, setSnackbar] = useState<{ isOpen: boolean; message: string; type: 'success' | 'error' | 'info' }>({
    isOpen: false,
    message: '',
    type: 'info',
  });

  // Collect all active fields from the schema into a single list
  const allFields = (sections || [])
    .flatMap((sec) => sec.fields || [])
    .filter((f) => f.is_active !== false)
    .sort((a, b) => (a.display_order ?? 0) - (b.display_order ?? 0));

  // Single-page form validation
  const validateForm = (): boolean => {
    const newErrors: Record<string, string> = {};
    let firstErrorFieldKey: string | null = null;

    for (const field of allFields) {
      const val = draft[field.field_key];

      // Required Check
      if (field.is_required) {
        if (field.field_type === 'photos') {
          const count = uploadedMedia.filter((m) => m.media_type === 'photo').length;
          if (count === 0) {
            newErrors[field.field_key] = 'Please upload at least 1 property photo.';
            if (!firstErrorFieldKey) firstErrorFieldKey = field.field_key;
          }
        } else if (field.field_type === 'consent') {
          if (!val) {
            newErrors[field.field_key] = 'Please accept the declaration to proceed.';
            if (!firstErrorFieldKey) firstErrorFieldKey = field.field_key;
          }
        } else if (val === undefined || val === null || (typeof val === 'string' && val.trim() === '')) {
          newErrors[field.field_key] = `${field.label} is required.`;
          if (!firstErrorFieldKey) firstErrorFieldKey = field.field_key;
          continue;
        }
      }

      if (val === undefined || val === null || val === '') continue;

      // Phone validation (at least 10 digits)
      if (field.field_type === 'phone') {
        const clean = String(val).replace(/\D/g, '');
        if (clean.length < 10) {
          newErrors[field.field_key] = 'Please enter a valid 10-digit mobile number.';
          if (!firstErrorFieldKey) firstErrorFieldKey = field.field_key;
        }
      } else if (field.field_type === 'email') {
        if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(String(val).trim())) {
          newErrors[field.field_key] = 'Please enter a valid email address.';
          if (!firstErrorFieldKey) firstErrorFieldKey = field.field_key;
        }
      } else if (field.field_type === 'google_location') {
        const locUrl = typeof val === 'object' ? (val.url || val.location_url) : val;
        if (locUrl && typeof locUrl === 'string') {
          const isGoogleMaps = /^https:\/\/(www\.)?(google\.[a-z.]+\/maps|maps\.google\.[a-z.]+|maps\.app\.goo\.gl|goo\.gl\/maps)/i.test(locUrl.trim());
          if (!isGoogleMaps) {
            newErrors[field.field_key] = 'Only official Google Maps links (e.g. https://maps.app.goo.gl/... or https://maps.google.com/...) are accepted.';
            if (!firstErrorFieldKey) firstErrorFieldKey = field.field_key;
          }
        }
      }
    }

    setErrors(newErrors);

    if (Object.keys(newErrors).length > 0) {
      // Scroll smoothly to the first error input
      if (firstErrorFieldKey) {
        const el = document.getElementById(firstErrorFieldKey);
        if (el) {
          el.scrollIntoView({ behavior: 'smooth', block: 'center' });
          el.focus();
        }
      }
      setSnackbar({
        isOpen: true,
        message: 'Please complete the highlighted required fields.',
        type: 'error',
      });
      return false;
    }

    return true;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!validateForm()) {
      return;
    }

    setIsSubmitting(true);
    try {
      const result = await submitRegistrationForm({
        version_id: version.id,
        fields: draft,
        media: uploadedMedia,
      });

      clearDraft();
      onSuccess(result, draft);
    } catch (err: any) {
      console.error('Submission failed:', err);
      if (err.fields) {
        setErrors(err.fields);
      }
      setSnackbar({
        isOpen: true,
        message: err.message || 'Submission failed. Please check the fields and try again.',
        type: 'error',
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="max-w-3xl mx-auto px-3.5 sm:px-6 py-6 sm:py-12 space-y-6">
      {/* Draft Restored Banner */}
      {isDraftRestored && (
        <div className="flex items-center justify-between gap-3 px-4 py-3 bg-emerald-50 border border-emerald-200 rounded-2xl text-xs text-emerald-900 shadow-2xs animate-in fade-in duration-200">
          <div className="flex items-center gap-2">
            <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
            <span>We restored your previous in-progress registration draft.</span>
          </div>
          <button
            type="button"
            onClick={() => setIsDraftRestored(false)}
            className="font-semibold text-emerald-700 hover:text-emerald-900"
          >
            Dismiss
          </button>
        </div>
      )}

      {/* Main Single Page Form Card */}
      <div className="bg-white rounded-3xl border border-slate-200 shadow-md p-5 sm:p-10 space-y-6 sm:space-y-8">
        {/* Form Header */}
        <div className="border-b border-slate-100 pb-6 text-center space-y-2">
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-brand-50 border border-brand-200 text-brand-700 text-xs font-semibold mb-1">
            <ShieldCheck className="w-3.5 h-3.5 text-brand-600" />
            <span>Verified Direct Owner Registration</span>
          </div>

          <h1 className="text-2xl sm:text-3xl font-bold font-display text-slate-900 tracking-tight">
            {title || 'Instant Property Registration'}
          </h1>

          <p className="text-xs sm:text-sm text-slate-500 max-w-lg mx-auto leading-relaxed">
            {description || 'Complete the fields below to list your property. All data is saved directly and reviewed by our verified property team.'}
          </p>
        </div>

        {/* Dynamic Fields Form */}
        <form onSubmit={handleSubmit} className="space-y-6">
          {allFields.length === 0 ? (
            <div className="text-center py-12 text-slate-400 space-y-2">
              <Building2 className="w-8 h-8 mx-auto text-slate-300" />
              <p className="text-xs">No active fields found in this form.</p>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
              {allFields.map((field) => {
                // Determine full width fields
                const isFullWidth = [
                  'textarea',
                  'remarks',
                  'google_location',
                  'direction',
                  'photos',
                  'videos',
                  'consent',
                  'multiselect',
                ].includes(field.field_type);

                return (
                  <div
                    key={field.field_key}
                    id={`field_container_${field.field_key}`}
                    className={isFullWidth ? 'md:col-span-2' : 'md:col-span-1'}
                  >
                    <DynamicField
                      field={field}
                      value={draft[field.field_key]}
                      onChange={(val) => {
                        updateField(field.field_key, val);
                        if (errors[field.field_key]) {
                          const copy = { ...errors };
                          delete copy[field.field_key];
                          setErrors(copy);
                        }
                      }}
                      error={errors[field.field_key]}
                      uploadedMedia={uploadedMedia}
                      onMediaChange={setUploadedMedia}
                    />
                  </div>
                );
              })}
            </div>
          )}

          {/* Submit Button */}
          <div className="pt-6 border-t border-slate-100">
            <button
              type="submit"
              disabled={isSubmitting || allFields.length === 0}
              className="w-full py-4 px-6 rounded-2xl bg-brand-600 hover:bg-brand-500 text-white font-bold text-sm sm:text-base shadow-lg shadow-brand-600/25 active:scale-98 transition-all flex items-center justify-center gap-3 disabled:opacity-50 cursor-pointer"
            >
              {isSubmitting ? (
                <>
                  <Loader2 className="w-5 h-5 animate-spin" />
                  <span>Submitting Property Registration...</span>
                </>
              ) : (
                <>
                  <Send className="w-5 h-5" />
                  <span>Submit Property Registration</span>
                </>
              )}
            </button>

            <div className="flex items-center justify-center gap-2 mt-4 text-[11px] text-slate-400">
              <ShieldCheck className="w-3.5 h-3.5 text-emerald-600" />
              <span>Safe & Secure • Saved directly into PropKart Database • 100% Free Listing</span>
            </div>
          </div>
        </form>
      </div>

      {/* Snackbar Notification */}
      <AppSnackbar
        message={snackbar.message}
        type={snackbar.type}
        isOpen={snackbar.isOpen}
        onClose={() => setSnackbar((s) => ({ ...s, isOpen: false }))}
      />
    </div>
  );
};
