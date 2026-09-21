import React from 'react';
import { FormField, UploadedMediaItem } from '../types/form';
import { LocationPicker } from './LocationPicker';
import { MediaUploader } from './MediaUploader';
import { User, Phone, Mail, IndianRupee, Compass, Check } from 'lucide-react';

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

  // Apple-style input baseline class
  const inputBaseClass = `w-full px-4 py-3 text-sm rounded-2xl border bg-slate-50/70 hover:bg-slate-50 focus:bg-white text-slate-900 placeholder:text-slate-400 focus:outline-none focus:ring-4 transition-all duration-150 ${
    error
      ? 'border-rose-300 focus:border-rose-500 focus:ring-rose-500/10'
      : 'border-black/[0.08] hover:border-black/[0.16] focus:border-black/60 focus:ring-black/[0.04]'
  }`;

  // Render Label
  const renderLabel = () => {
    if (field_type === 'consent') return null;
    return (
      <div className="flex justify-between items-baseline mb-1.5">
        <label htmlFor={field_key} className="block text-xs font-semibold text-slate-800 tracking-tight">
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

  // Render Feedback
  const renderFeedback = () => (
    <div className="mt-1 space-y-0.5">
      {error && <p className="text-xs text-rose-500 font-medium">{error}</p>}
      {description && !error && <p className="text-[11px] text-slate-400">{description}</p>}
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
              className={inputBaseClass}
            />
            {field_type === 'name' && (
              <User className="w-4 h-4 text-slate-400 absolute right-3.5 top-1/2 -translate-y-1/2 pointer-events-none" />
            )}
          </div>
          {renderFeedback()}
        </div>
      );
    }

    case 'phone': {
      const rawVal = value ? String(value).replace(/\D/g, '') : '';
      return (
        <div>
          {renderLabel()}
          <div
            className={`relative flex rounded-2xl border bg-slate-50/70 hover:bg-slate-50 focus-within:bg-white focus-within:ring-4 transition-all duration-150 overflow-hidden ${
              error
                ? 'border-rose-300 focus-within:border-rose-500 focus-within:ring-rose-500/10'
                : 'border-black/[0.08] hover:border-black/[0.16] focus-within:border-black/60 focus-within:ring-black/[0.04]'
            }`}
          >
            <div className="flex items-center gap-1 px-3.5 bg-black/[0.02] border-r border-black/[0.06] text-xs font-semibold text-slate-700 select-none">
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
              className="w-full px-3.5 py-3 text-sm bg-transparent text-slate-900 placeholder:text-slate-400 focus:outline-none tracking-wider font-mono"
            />
            <div className="flex items-center pr-3.5">
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
              className={inputBaseClass}
            />
            <Mail className="w-4 h-4 text-slate-400 absolute right-3.5 top-1/2 -translate-y-1/2 pointer-events-none" />
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
          <div
            className={`relative flex rounded-2xl border bg-slate-50/70 hover:bg-slate-50 focus-within:bg-white focus-within:ring-4 transition-all duration-150 overflow-hidden ${
              error
                ? 'border-rose-300 focus-within:border-rose-500 focus-within:ring-rose-500/10'
                : 'border-black/[0.08] hover:border-black/[0.16] focus-within:border-black/60 focus-within:ring-black/[0.04]'
            }`}
          >
            {isCurrency && (
              <div className="flex items-center px-3.5 bg-black/[0.02] border-r border-black/[0.06] text-slate-700 select-none">
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
              className="w-full px-3.5 py-3 text-sm bg-transparent text-slate-900 placeholder:text-slate-400 focus:outline-none font-mono"
            />
            {isArea && (
              <div className="flex items-center px-3.5 bg-black/[0.02] text-slate-500 text-xs font-medium border-l border-black/[0.06] select-none">
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
            className={`${inputBaseClass} leading-relaxed resize-none`}
          />
          <div className="flex justify-between items-center text-[10px] text-slate-400 mt-1 px-1">
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
              className={`${inputBaseClass} appearance-none pr-10 cursor-pointer font-medium`}
            >
              <option value="">{placeholder || `Select ${label}`}</option>
              {options.map((opt) => (
                <option key={String(opt.value)} value={opt.value}>
                  {opt.label}
                </option>
              ))}
            </select>
            <div className="absolute right-4 top-1/2 -translate-y-1/2 pointer-events-none text-slate-400">
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
          <div className="grid grid-cols-2 sm:grid-cols-3 gap-2 sm:gap-3">
            {options.map((opt) => {
              const isSelected = value === opt.value;
              return (
                <button
                  type="button"
                  key={String(opt.value)}
                  onClick={() => onChange(opt.value)}
                  className={`flex items-center justify-between px-4 py-3 rounded-2xl border text-left text-xs font-semibold active:scale-[0.98] transition-all cursor-pointer ${
                    isSelected
                      ? 'bg-slate-900 border-slate-900 text-white shadow-apple-sm'
                      : 'bg-slate-50/70 border-black/[0.08] text-slate-800 hover:border-black/[0.16] hover:bg-slate-50'
                  }`}
                >
                  <span className="truncate">{opt.label}</span>
                  <span
                    className={`w-4 h-4 rounded-full border flex items-center justify-center transition-colors shrink-0 ml-2 ${
                      isSelected ? 'border-white bg-white' : 'border-slate-300'
                    }`}
                  >
                    {isSelected && <span className="w-1.5 h-1.5 rounded-full bg-slate-900" />}
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
                  className={`inline-flex items-center gap-1.5 px-3.5 py-1.5 rounded-full text-xs font-semibold border active:scale-[0.97] transition-all cursor-pointer ${
                    isSelected
                      ? 'bg-slate-900 border-slate-900 text-white shadow-xs'
                      : 'bg-slate-50/70 border-black/[0.08] text-slate-700 hover:border-black/[0.16] hover:bg-slate-50'
                  }`}
                >
                  {isSelected && <Check className="w-3 h-3 text-white" />}
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
      const landmarkSuggestions = [
        'Near Metro Station',
        'Near Main Market',
        'Opposite Garden/Park',
        'Near School/College',
        'Near Hospital',
        'Main Road Facing',
        'Corner Property',
        'Near Highway',
      ];

      const handleAddSuggestion = (sug: string) => {
        const current = String(value || '').trim();
        if (!current) {
          onChange(sug);
        } else if (!current.toLowerCase().includes(sug.toLowerCase())) {
          onChange(`${current}, ${sug}`);
        }
      };

      return (
        <div>
          {renderLabel()}
          <div className="relative">
            <input
              id={field_key}
              type="text"
              value={value || ''}
              onChange={(e) => onChange(e.target.value)}
              placeholder={placeholder || 'e.g. Near City Center, Opposite Metro'}
              className={inputBaseClass}
            />
            <Compass className="w-4 h-4 text-slate-400 absolute right-3.5 top-1/2 -translate-y-1/2 pointer-events-none" />
          </div>

          {/* Landmark Suggestion Chips */}
          <div className="mt-2 flex flex-wrap items-center gap-1.5">
            <span className="text-[11px] font-semibold text-slate-400 mr-1 select-none">Quick Suggestions:</span>
            {landmarkSuggestions.map((sug) => (
              <button
                type="button"
                key={sug}
                onClick={() => handleAddSuggestion(sug)}
                className="px-2.5 py-1 rounded-full text-[11px] font-medium bg-slate-100 hover:bg-emerald-50 hover:text-emerald-700 hover:border-emerald-200 active:scale-95 text-slate-700 transition-all border border-black/[0.04] cursor-pointer"
              >
                + {sug}
              </button>
            ))}
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
              className="mt-0.5 w-4 h-4 rounded-md border-black/[0.15] text-slate-900 focus:ring-0 cursor-pointer"
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
            className={inputBaseClass}
          />
          {renderFeedback()}
        </div>
      );
    }
  }
};
