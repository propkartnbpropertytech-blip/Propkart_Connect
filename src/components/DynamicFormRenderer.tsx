import React, { useState, useEffect } from 'react';
import { FormSchema, UploadedMediaItem, SubmissionResult } from '../types/form';
import { DynamicField } from './DynamicField';
import { submitRegistrationForm, checkPhoneDuplicate } from '../services/api';
import { useFormDraft } from '../hooks/useFormDraft';
import { AppSnackbar } from './common/AppSnackbar';
import {
  Send,
  Loader2,
  Building2,
  Lock,
  CheckCircle2,
} from 'lucide-react';

interface DynamicFormRendererProps {
  schema: FormSchema;
  onSuccess: (result: SubmissionResult, formData: Record<string, any>) => void;
}

export const DynamicFormRenderer: React.FC<DynamicFormRendererProps> = ({ schema, onSuccess }) => {
  const { version, sections, title, description } = schema;
  const assistancePhone = schema.assistance_phone || '+91 9879458308';
  const assistanceDigits = assistancePhone.replace(/\D/g, '').slice(-10);

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

      // Type-specific Validations
      if (field.field_type === 'phone') {
        const phoneDigits = String(val).replace(/\D/g, '').slice(-10);
        if (phoneDigits.length !== 10 || !/^[6-9]\d{9}$/.test(phoneDigits)) {
          newErrors[field.field_key] = 'Please enter a valid 10-digit mobile number.';
          if (!firstErrorFieldKey) firstErrorFieldKey = field.field_key;
        } else if (phoneDigits === assistanceDigits) {
          newErrors[field.field_key] = `Mobile number cannot be the same as the PropKart assistance number (${assistanceDigits}). Please enter your personal number.`;
          if (!firstErrorFieldKey) firstErrorFieldKey = field.field_key;
        }
      } else if (field.field_type === 'email') {
        const emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        if (!emailPattern.test(String(val).trim())) {
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

      // Rent Price Validation: If purpose is Rent, cannot exceed 10 Lakhs (1,000,000)
      if (field.field_key === 'expected_price' || field.field_type === 'number' || field.field_type === 'currency') {
        const purpose = String(draft.property_for_rent_or_sale || draft.listing_type || '').trim().toLowerCase();
        if (purpose === 'rent' || purpose.includes('rent')) {
          const rentVal = Number(val);
          if (!isNaN(rentVal) && rentVal > 1000000) {
            newErrors[field.field_key] = 'Expected rent cannot exceed ₹10,00,000 (10 Lakhs). Please enter a valid rent amount.';
            if (!firstErrorFieldKey) firstErrorFieldKey = field.field_key;
          }
        }
      }
    }

    setErrors(newErrors);

    if (firstErrorFieldKey) {
      const el = document.getElementById(`field_container_${firstErrorFieldKey}`);
      if (el) {
        el.scrollIntoView({ behavior: 'smooth', block: 'center' });
      }
      return false;
    }

    return true;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!validateForm()) {
      setSnackbar({
        isOpen: true,
        message: 'Please complete all required fields correctly.',
        type: 'error',
      });
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
    <div className="max-w-3xl mx-auto px-4 sm:px-6 py-6 sm:py-12 space-y-6">
      {/* Draft Restored Banner */}
      {isDraftRestored && (
        <div className="flex items-center justify-between gap-3 px-4 py-3 bg-white border border-black/[0.06] rounded-2xl text-xs text-slate-800 shadow-apple-sm animate-in fade-in duration-200">
          <div className="flex items-center gap-2">
            <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
            <span className="font-medium">Previous draft restored</span>
          </div>
          <button
            type="button"
            onClick={() => setIsDraftRestored(false)}
            className="font-medium text-slate-500 hover:text-slate-900 px-2 py-1 rounded-md transition-colors"
          >
            Dismiss
          </button>
        </div>
      )}

      {/* Main Single Page Form Card */}
      <div className="bg-white rounded-3xl border border-black/[0.06] shadow-apple sm:shadow-apple-lg p-5 sm:p-8 md:p-10 space-y-6 sm:space-y-8">
        {/* Clean Apple Form Header */}
        <div className="border-b border-black/[0.06] pb-6 text-center space-y-1.5">
          <h1 className="text-2xl sm:text-3xl font-semibold text-slate-900 tracking-tight">
            {title || 'Instant Property Registration'}
          </h1>
          {description && (
            <p className="text-xs sm:text-sm text-slate-500 max-w-md mx-auto leading-relaxed">
              {description}
            </p>
          )}
        </div>

        {/* Dynamic Fields Form */}
        <form onSubmit={handleSubmit} className="space-y-6">
          {allFields.length === 0 ? (
            <div className="text-center py-12 text-slate-400 space-y-2">
              <Building2 className="w-8 h-8 mx-auto text-slate-300" />
              <p className="text-xs">No active fields configured.</p>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 sm:gap-5">
              {allFields.map((field) => {
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

          {/* Submit Action */}
          <div className="pt-6 border-t border-black/[0.06] space-y-3">
            <button
              type="submit"
              disabled={isSubmitting || allFields.length === 0}
              className="w-full py-3.5 sm:py-4 px-6 rounded-full bg-[#1d1d1f] hover:bg-black active:scale-[0.98] transition-all text-white font-semibold text-sm sm:text-base shadow-apple flex items-center justify-center gap-2.5 disabled:opacity-40 cursor-pointer"
            >
              {isSubmitting ? (
                <>
                  <Loader2 className="w-4 h-4 animate-spin text-white" />
                  <span>Submitting...</span>
                </>
              ) : (
                <>
                  <Send className="w-4 h-4 text-white" />
                  <span>Submit Property Registration</span>
                </>
              )}
            </button>

            <div className="flex items-center justify-center gap-1.5 text-[11px] text-slate-400">
              <Lock className="w-3 h-3 text-slate-400" />
              <span>Encrypted submission</span>
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
