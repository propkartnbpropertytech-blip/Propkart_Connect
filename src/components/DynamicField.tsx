import React from 'react';
import { FormField, UploadedMediaItem } from '../types/form';
import { LocationPicker } from './LocationPicker';
import { MediaUploader } from './MediaUploader';
import { User, Phone, Mail, IndianRupee, Compass, Layers, Check } from 'lucide-react';

interface DynamicFieldProps {
  field: FormField;
  value: any;
  onChange: (val: any) => void;
  error?: string;
  uploadedMedia: UploadedMediaItem[];
  onMediaChange: (items: UploadedMediaItem[]) => void;
}

export const DynamicField: React.FC<DynamicFieldProps> = ({
  field,
  value,
  onChange,
  error,
  uploadedMedia,
  onMediaChange,
}) => {
  const {
    field_key,
    label,
    field_type,
    placeholder,
    help_text,
    description,
    is_required,
    validation_rules = {},
    options = [],
  } = field;

  // Render Label
  const renderLabel = () => {
    if (field_type === 'consent') return null; // Consent renders label inside checkbox
    return (
      <div className="flex justify-between items-baseline mb-1.5">
        <label htmlFor={field_key} className="block text-xs font-semibold text-slate-700 tracking-tight">
          {label}
          {is_required && <span className="text-rose-500 ml-1 font-bold">*</span>}
        </label>
        {help_text && (
          <span className="text-[11px] text-slate-400 font-normal hidden sm:inline truncate max-w-[240px]">
            {help_text}
          </span>
        )}
      </div>
    );
  };

  // Render Helper and Error Text
  const renderFeedback = () => (
    <div className="mt-1 space-y-0.5">
      {error && <p className="text-xs text-rose-500 font-medium">{error}</p>}
      {description && !error && <p className="text-[11px] text-slate-500">{description}</p>}
    </div>
  );

  // Field type implementations
  switch (field_type) {
    case 'name':
    case 'text': {
      return (
        <div>
          {renderLabel()}
          <div className="relative">
            <input
              id={field_key}
              type="text"
              value={value || ''}
              onChange={(e) => onChange(e.target.value)}
              placeholder={placeholder || `Enter ${label.toLowerCase()}`}
              maxLength={validation_rules.max_length || 200}
              className={`w-full px-3.5 py-2.5 text-sm rounded-xl border bg-white text-slate-900 placeholder:text-slate-400 focus:outline-none focus:ring-2 transition-all ${
                error
                  ? 'border-rose-300 focus:border-rose-500 focus:ring-rose-500/20'
                  : 'border-slate-300 focus:border-brand-600 focus:ring-brand-600/20'
              }`}
            />
            {field_type === 'name' && (
              <User className="w-4 h-4 text-slate-400 absolute right-3 top-1/2 -translate-y-1/2 pointer-events-none" />
            )}
          </div>
          {renderFeedback()}
        </div>
      );
    }

    case 'phone': {
      // Auto strip non-digit
      const rawVal = value ? String(value).replace(/\D/g, '') : '';
      return (
        <div>
          {renderLabel()}
          <div className="relative flex rounded-xl border border-slate-300 focus-within:border-brand-600 focus-within:ring-2 focus-within:ring-brand-600/20 transition-all overflow-hidden bg-white">
            <div className="flex items-center gap-1 px-3 bg-slate-100/80 border-r border-slate-200 text-xs font-semibold text-slate-700 select-none">
              <span>🇮🇳</span>
              <span>+91</span>
            </div>
            <input
              id={field_key}
              type="tel"
              value={rawVal}
              onChange={(e) => {
                const digits = e.target.value.replace(/\D/g, '').slice(0, 10);
                onChange(digits);
              }}
              placeholder={placeholder || '9876543210'}
              maxLength={10}
              className="w-full px-3.5 py-2.5 text-sm bg-transparent text-slate-900 placeholder:text-slate-400 focus:outline-none tracking-wider font-mono"
            />
            <div className="flex items-center pr-3">
              <Phone className="w-4 h-4 text-slate-400 pointer-events-none" />
            </div>
          </div>
          {renderFeedback()}
        </div>
      );
    }

    case 'email': {
      return (
        <div>
          {renderLabel()}
          <div className="relative">
            <input
              id={field_key}
              type="email"
              value={value || ''}
              onChange={(e) => onChange(e.target.value)}
              placeholder={placeholder || 'name@example.com'}
              className={`w-full px-3.5 py-2.5 text-sm rounded-xl border bg-white text-slate-900 placeholder:text-slate-400 focus:outline-none focus:ring-2 transition-all ${
                error
                  ? 'border-rose-300 focus:border-rose-500 focus:ring-rose-500/20'
                  : 'border-slate-300 focus:border-brand-600 focus:ring-brand-600/20'
              }`}
            />
            <Mail className="w-4 h-4 text-slate-400 absolute right-3 top-1/2 -translate-y-1/2 pointer-events-none" />
          </div>
          {renderFeedback()}
        </div>
      );
    }

    case 'currency':
    case 'number':
    case 'area': {
      const isCurrency = field_type === 'currency';
      const isArea = field_type === 'area';
      return (
        <div>
          {renderLabel()}
          <div className="relative flex rounded-xl border border-slate-300 focus-within:border-brand-600 focus-within:ring-2 focus-within:ring-brand-600/20 transition-all overflow-hidden bg-white">
            {isCurrency && (
              <div className="flex items-center px-3 bg-slate-100/80 border-r border-slate-200 text-slate-700 select-none">
                <IndianRupee className="w-3.5 h-3.5" />
              </div>
            )}
            <input
              id={field_key}
              type="number"
              value={value ?? ''}
              onChange={(e) => onChange(e.target.value === '' ? '' : Number(e.target.value))}
              placeholder={placeholder || '0'}
              min={validation_rules.min_value}
              max={validation_rules.max_value}
              className="w-full px-3.5 py-2.5 text-sm bg-transparent text-slate-900 placeholder:text-slate-400 focus:outline-none"
            />
            {isArea && (
              <div className="flex items-center px-3 bg-slate-50 text-slate-500 text-xs font-medium border-l border-slate-200 select-none">
                sq. ft
              </div>
            )}
          </div>
          {renderFeedback()}
        </div>
      );
    }

    case 'textarea':
    case 'remarks': {
      return (
        <div>
          {renderLabel()}
          <textarea
            id={field_key}
            rows={3}
            value={value || ''}
            onChange={(e) => onChange(e.target.value)}
            placeholder={placeholder || `Enter details for ${label.toLowerCase()}...`}
            maxLength={validation_rules.max_length || 1000}
            className={`w-full px-3.5 py-2.5 text-sm rounded-xl border bg-white text-slate-900 placeholder:text-slate-400 focus:outline-none focus:ring-2 transition-all ${
              error
                ? 'border-rose-300 focus:border-rose-500 focus:ring-rose-500/20'
                : 'border-slate-300 focus:border-brand-600 focus:ring-brand-600/20'
            }`}
          />
          <div className="flex justify-between items-center text-[11px] text-slate-400 mt-1">
            {renderFeedback()}
            <span>{(value || '').length} / {validation_rules.max_length || 1000}</span>
          </div>
        </div>
      );
    }

    case 'dropdown': {
      return (
        <div>
          {renderLabel()}
          <div className="relative">
            <select
              id={field_key}
              value={value ?? ''}
              onChange={(e) => onChange(e.target.value)}
              className={`w-full px-3.5 py-2.5 text-sm rounded-xl border bg-white text-slate-900 focus:outline-none focus:ring-2 appearance-none transition-all ${
                error
                  ? 'border-rose-300 focus:border-rose-500 focus:ring-rose-500/20'
                  : 'border-slate-300 focus:border-brand-600 focus:ring-brand-600/20'
              }`}
            >
              <option value="">{placeholder || `Select ${label}`}</option>
              {options.map((opt) => (
                <option key={String(opt.value)} value={opt.value}>
                  {opt.label}
                </option>
              ))}
            </select>
            <div className="absolute right-3.5 top-1/2 -translate-y-1/2 pointer-events-none text-slate-500">
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 9l-7 7-7-7" />
              </svg>
            </div>
          </div>
          {renderFeedback()}
        </div>
      );
    }

    case 'radio': {
      return (
        <div>
          {renderLabel()}
          <div className="grid grid-cols-2 sm:grid-cols-3 gap-2.5">
            {options.map((opt) => {
              const isSelected = value === opt.value;
              return (
                <button
                  type="button"
                  key={String(opt.value)}
                  onClick={() => onChange(opt.value)}
                  className={`flex items-center justify-between px-3.5 py-3 rounded-xl border text-left text-xs font-semibold transition-all ${
                    isSelected
                      ? 'bg-brand-50/80 border-brand-600 text-brand-900 ring-2 ring-brand-600/20 shadow-2xs'
                      : 'bg-white border-slate-200 text-slate-700 hover:border-slate-300 hover:bg-slate-50'
                  }`}
                >
                  <span>{opt.label}</span>
                  <span
                    className={`w-4 h-4 rounded-full border flex items-center justify-center transition-colors ${
                      isSelected ? 'border-brand-600 bg-brand-600' : 'border-slate-300'
                    }`}
                  >
                    {isSelected && <span className="w-1.5 h-1.5 rounded-full bg-white" />}
                  </span>
                </button>
              );
            })}
          </div>
          {renderFeedback()}
        </div>
      );
    }

    case 'multiselect': {
      const selectedArr: any[] = Array.isArray(value) ? value : [];
      const toggleOption = (optVal: any) => {
        if (selectedArr.includes(optVal)) {
          onChange(selectedArr.filter((v) => v !== optVal));
        } else {
          onChange([...selectedArr, optVal]);
        }
      };

      return (
        <div>
          {renderLabel()}
          <div className="flex flex-wrap gap-2 pt-1">
            {options.map((opt) => {
              const isSelected = selectedArr.includes(opt.value);
              return (
                <button
                  type="button"
                  key={String(opt.value)}
                  onClick={() => toggleOption(opt.value)}
                  className={`inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-medium border transition-all ${
                    isSelected
                      ? 'bg-brand-50 border-brand-600 text-brand-800 shadow-2xs'
                      : 'bg-white border-slate-200 text-slate-600 hover:border-slate-300 hover:bg-slate-50'
                  }`}
                >
                  <span
                    className={`w-3.5 h-3.5 rounded flex items-center justify-center border transition-colors ${
                      isSelected ? 'bg-brand-600 border-brand-600 text-white' : 'border-slate-300 bg-white'
                    }`}
                  >
                    {isSelected && <Check className="w-2.5 h-2.5" />}
                  </span>
                  <span>{opt.label}</span>
                </button>
              );
            })}
          </div>
          {renderFeedback()}
        </div>
      );
    }

    case 'google_location': {
      return (
        <LocationPicker
          value={value}
          onChange={onChange}
          error={error}
          required={is_required}
        />
      );
    }

    case 'direction': {
      return (
        <div>
          {renderLabel()}
          <div className="relative">
            <input
              id={field_key}
              type="text"
              value={value || ''}
              onChange={(e) => onChange(e.target.value)}
              placeholder={placeholder || 'e.g. Near Big Bazaar, Opposite Bank of Baroda'}
              className={`w-full px-3.5 py-2.5 text-sm rounded-xl border bg-white text-slate-900 placeholder:text-slate-400 focus:outline-none focus:ring-2 transition-all ${
                error
                  ? 'border-rose-300 focus:border-rose-500 focus:ring-rose-500/20'
                  : 'border-slate-300 focus:border-brand-600 focus:ring-brand-600/20'
              }`}
            />
            <Compass className="w-4 h-4 text-slate-400 absolute right-3 top-1/2 -translate-y-1/2 pointer-events-none" />
          </div>
          {renderFeedback()}
        </div>
      );
    }

    case 'photos': {
      return (
        <div>
          {renderLabel()}
          <MediaUploader
            fieldKey={field_key}
            mediaType="photos"
            maxFiles={validation_rules.max_files || 50}
            maxFileSizeMb={validation_rules.max_file_size_mb || 25}
            uploadedMedia={uploadedMedia}
            onChange={onMediaChange}
            error={error}
            required={is_required}
          />
          {renderFeedback()}
        </div>
      );
    }

    case 'videos': {
      return (
        <div>
          {renderLabel()}
          <MediaUploader
            fieldKey={field_key}
            mediaType="videos"
            maxFiles={validation_rules.max_files || 30}
            maxFileSizeMb={validation_rules.max_file_size_mb || 50}
            uploadedMedia={uploadedMedia}
            onChange={onMediaChange}
            error={error}
            required={is_required}
          />
          {renderFeedback()}
        </div>
      );
    }

    case 'consent': {
      const isChecked = !!value;
      return (
        <div className="pt-2">
          <label className="flex items-start gap-3 cursor-pointer select-none group">
            <input
              type="checkbox"
              checked={isChecked}
              onChange={(e) => onChange(e.target.checked)}
              className="mt-1 w-4 h-4 rounded border-slate-300 text-brand-600 focus:ring-brand-500 focus:ring-offset-0 cursor-pointer"
            />
            <span className="text-xs text-slate-600 leading-relaxed group-hover:text-slate-900 transition-colors">
              {help_text || description || label}
              {is_required && <span className="text-rose-500 ml-1 font-bold">*</span>}
            </span>
          </label>
          {renderFeedback()}
        </div>
      );
    }

    default: {
      return (
        <div>
          {renderLabel()}
          <input
            id={field_key}
            type="text"
            value={value || ''}
            onChange={(e) => onChange(e.target.value)}
            placeholder={placeholder || ''}
            className="w-full px-3.5 py-2.5 text-sm rounded-xl border border-slate-300 bg-white text-slate-900 focus:outline-none focus:ring-2 focus:ring-brand-600/20 focus:border-brand-600"
          />
          {renderFeedback()}
        </div>
      );
    }
  }
};
