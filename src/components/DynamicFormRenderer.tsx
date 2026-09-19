import React, { useState } from 'react';
import { FormSchema, UploadedMediaItem, SubmissionResult } from '../types/form';
import { DynamicField } from './DynamicField';
import { submitRegistrationForm } from '../services/api';
import { useFormDraft } from '../hooks/useFormDraft';
import { AppSnackbar } from './common/AppSnackbar';
import {
  ChevronRight,
  ChevronLeft,
  Check,
  Send,
  Loader2,
  Sparkles,
  Info,
  Clock,
} from 'lucide-react';

interface DynamicFormRendererProps {
  schema: FormSchema;
  onSuccess: (result: SubmissionResult, formData: Record<string, any>) => void;
}

export const DynamicFormRenderer: React.FC<DynamicFormRendererProps> = ({ schema, onSuccess }) => {
  const { version, sections } = schema;

  const {
    draft,
    updateField,
    isDraftRestored,
    setIsDraftRestored,
    clearDraft,
  } = useFormDraft(version.id);

  const [currentStep, setCurrentStep] = useState(0);
  const [uploadedMedia, setUploadedMedia] = useState<UploadedMediaItem[]>([]);
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [snackbar, setSnackbar] = useState<{ isOpen: boolean; message: string; type: 'success' | 'error' | 'info' }>({
    isOpen: false,
    message: '',
    type: 'info',
  });

  const activeSection = sections[currentStep];

  // Validate fields in a specific section
  const validateSection = (sectionIndex: number): boolean => {
    const sec = sections[sectionIndex];
    if (!sec) return true;

    const newErrors: Record<string, string> = {};

    for (const field of sec.fields) {
      if (!field.is_active) continue;

      const val = draft[field.field_key];
      const rules = field.validation_rules || {};

      // Required Check
      if (field.is_required) {
        if (field.field_type === 'photos') {
          const count = uploadedMedia.filter((m) => m.field_key === field.field_key && m.media_type === 'photo').length;
          if (count === 0) {
            newErrors[field.field_key] = 'Please upload at least 1 property photo.';
          }
        } else if (field.field_type === 'consent') {
          if (!val) {
            newErrors[field.field_key] = 'You must confirm the owner declaration to proceed.';
          }
        } else if (val === undefined || val === null || (typeof val === 'string' && val.trim() === '')) {
          newErrors[field.field_key] = `${field.label} is required.`;
          continue;
        }
      }

      if (val === undefined || val === null || val === '') continue;

      // Type validations
      if (field.field_type === 'phone') {
        const clean = String(val).replace(/\D/g, '');
        if (!/^(91)?[6-9]\d{9}$/.test(clean)) {
          newErrors[field.field_key] = 'Please enter a valid 10-digit Indian mobile number.';
        }
      } else if (field.field_type === 'email') {
        if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(String(val).trim())) {
          newErrors[field.field_key] = 'Please enter a valid email address.';
        }
      } else if (['number', 'currency', 'area'].includes(field.field_type)) {
        const num = Number(val);
        if (isNaN(num)) {
          newErrors[field.field_key] = 'Must be a valid number.';
        } else {
          if (rules.min_value !== undefined && num < rules.min_value) {
            newErrors[field.field_key] = `Minimum value is ${rules.min_value}.`;
          }
          if (rules.max_value !== undefined && num > rules.max_value) {
            newErrors[field.field_key] = `Maximum value is ${rules.max_value}.`;
          }
        }
      } else if (['text', 'textarea', 'name', 'direction'].includes(field.field_type)) {
        const len = String(val).trim().length;
        if (rules.min_length !== undefined && len < rules.min_length) {
          newErrors[field.field_key] = `Must be at least ${rules.min_length} characters.`;
        }
      } else if (field.field_type === 'google_location') {
        let locUrl = typeof val === 'object' ? (val.url || val.location_url) : val;
        const hasCoords = typeof val === 'object' && val.lat && val.lng;
        if (rules.url_required && !hasCoords && (!locUrl || !String(locUrl).startsWith('http'))) {
          newErrors[field.field_key] = 'Please provide a valid Google Maps location link or use GPS.';
        }
      }
    }

    setErrors(newErrors);

    if (Object.keys(newErrors).length > 0) {
      setSnackbar({
        isOpen: true,
        message: 'Please complete the required fields marked in red.',
        type: 'error',
      });
      return false;
    }

    return true;
  };

  const handleNext = () => {
    if (validateSection(currentStep)) {
      if (currentStep < sections.length - 1) {
        setCurrentStep((prev) => prev + 1);
        window.scrollTo({ top: 0, behavior: 'smooth' });
      }
    }
  };

  const handlePrev = () => {
    if (currentStep > 0) {
      setCurrentStep((prev) => prev - 1);
      window.scrollTo({ top: 0, behavior: 'smooth' });
    }
  };

  const handleSubmit = async () => {
    // Validate current and previous sections
    for (let i = 0; i <= currentStep; i++) {
      if (!validateSection(i)) {
        setCurrentStep(i);
        return;
      }
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

  const isLastStep = currentStep === sections.length - 1;

  return (
    <div className="max-w-3xl mx-auto px-4 py-6 sm:py-10 space-y-6">
      {/* Draft Restored Banner */}
      {isDraftRestored && (
        <div className="flex items-center justify-between gap-3 px-4 py-3 bg-emerald-50 border border-emerald-200 rounded-2xl text-xs text-emerald-900 shadow-2xs animate-in fade-in duration-200">
          <div className="flex items-center gap-2">
            <Clock className="w-4 h-4 text-emerald-600 shrink-0" />
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

      {/* Step Wizard Progress Bar */}
      <div className="bg-white rounded-2xl border border-slate-200/90 p-4 shadow-sm">
        <div className="flex items-center justify-between gap-2 overflow-x-auto pb-1 scrollbar-none">
          {sections.map((sec, idx) => {
            const isDone = idx < currentStep;
            const isCurrent = idx === currentStep;

            return (
              <div
                key={sec.id}
                onClick={() => idx < currentStep && setCurrentStep(idx)}
                className={`flex items-center gap-2.5 shrink-0 ${
                  idx < currentStep ? 'cursor-pointer' : ''
                }`}
              >
                <div
                  className={`w-8 h-8 rounded-full flex items-center justify-center text-xs font-bold transition-all ${
                    isDone
                      ? 'bg-brand-600 text-white shadow-xs'
                      : isCurrent
                      ? 'bg-brand-50 border-2 border-brand-600 text-brand-700 ring-4 ring-brand-500/10'
                      : 'bg-slate-100 text-slate-400 border border-slate-200'
                  }`}
                >
                  {isDone ? <Check className="w-4 h-4" /> : idx + 1}
                </div>

                <div className="hidden md:block text-left">
                  <div className={`text-xs font-semibold leading-tight ${isCurrent ? 'text-slate-900' : 'text-slate-500'}`}>
                    {sec.title}
                  </div>
                  <div className="text-[10px] text-slate-400">Step {idx + 1} of {sections.length}</div>
                </div>

                {idx < sections.length - 1 && (
                  <div className="w-6 sm:w-8 h-0.5 bg-slate-200 ml-2 hidden sm:block" />
                )}
              </div>
            );
          })}
        </div>
      </div>

      {/* Form Content Card */}
      <div className="bg-white rounded-3xl border border-slate-200/80 shadow-sm p-6 sm:p-9 space-y-7">
        {/* Section Header */}
        <div className="border-b border-slate-100 pb-5">
          <div className="flex items-center gap-2 text-brand-600 text-xs font-bold tracking-wider uppercase">
            <Sparkles className="w-3.5 h-3.5" />
            <span>Step {currentStep + 1} of {sections.length}</span>
          </div>
          <h2 className="text-xl sm:text-2xl font-bold font-display text-slate-900 tracking-tight mt-1">
            {activeSection.title}
          </h2>
          {activeSection.description && (
            <p className="text-xs sm:text-sm text-slate-500 mt-1 leading-relaxed">
              {activeSection.description}
            </p>
          )}
        </div>

        {/* Dynamic Fields Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
          {activeSection.fields
            .filter((f) => f.is_active)
            .map((field) => {
              // Full width for long inputs, textareas, media, and location
              const isFullWidth = [
                'textarea',
                'remarks',
                'google_location',
                'photos',
                'videos',
                'consent',
                'multiselect',
              ].includes(field.field_type);

              return (
                <div
                  key={field.field_key}
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

        {/* Footer Navigation Buttons */}
        <div className="pt-6 border-t border-slate-100 flex items-center justify-between gap-4">
          <button
            type="button"
            onClick={handlePrev}
            disabled={currentStep === 0 || isSubmitting}
            className={`inline-flex items-center gap-2 px-4 py-2.5 rounded-xl border border-slate-300 text-slate-700 text-xs font-semibold hover:bg-slate-50 active:scale-95 transition-all ${
              currentStep === 0 ? 'invisible' : ''
            }`}
          >
            <ChevronLeft className="w-4 h-4" />
            <span>Previous Step</span>
          </button>

          {isLastStep ? (
            <button
              type="button"
              onClick={handleSubmit}
              disabled={isSubmitting}
              className="inline-flex items-center justify-center gap-2.5 px-6 py-3 rounded-xl bg-brand-600 hover:bg-brand-700 text-white font-semibold text-sm shadow-md hover:shadow-lg active:scale-98 transition-all disabled:opacity-50"
            >
              {isSubmitting ? (
                <>
                  <Loader2 className="w-4 h-4 animate-spin" />
                  <span>Submitting Registration...</span>
                </>
              ) : (
                <>
                  <Send className="w-4 h-4" />
                  <span>Submit Property Registration</span>
                </>
              )}
            </button>
          ) : (
            <button
              type="button"
              onClick={handleNext}
              className="inline-flex items-center justify-center gap-2 px-5 py-2.5 rounded-xl bg-brand-600 hover:bg-brand-700 text-white font-semibold text-xs shadow-sm hover:shadow active:scale-98 transition-all"
            >
              <span>Next Step</span>
              <ChevronRight className="w-4 h-4" />
            </button>
          )}
        </div>
      </div>

      {/* Snackbar feedback */}
      <AppSnackbar
        message={snackbar.message}
        type={snackbar.type}
        isOpen={snackbar.isOpen}
        onClose={() => setSnackbar((s) => ({ ...s, isOpen: false }))}
      />
    </div>
  );
};
