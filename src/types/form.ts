export type FieldType =
  | 'text'
  | 'textarea'
  | 'name'
  | 'phone'
  | 'email'
  | 'number'
  | 'currency'
  | 'area'
  | 'dropdown'
  | 'radio'
  | 'checkbox'
  | 'multiselect'
  | 'photos'
  | 'videos'
  | 'google_location'
  | 'direction'
  | 'date'
  | 'time'
  | 'datetime'
  | 'url'
  | 'remarks'
  | 'consent';

export interface FieldOption {
  label: string;
  value: string | number;
}

export interface ValidationRules {
  min_length?: number;
  max_length?: number;
  min_value?: number;
  max_value?: number;
  pattern?: string;
  email?: boolean;
  max_files?: number;
  allowed_types?: string[];
  max_file_size_mb?: number;
  url_required?: boolean;
  required_checked?: boolean;
}

export interface FormField {
  id: string;
  section_id?: string;
  field_key: string;
  label: string;
  field_type: FieldType;
  placeholder?: string | null;
  help_text?: string | null;
  description?: string | null;
  is_required: boolean;
  is_active: boolean;
  display_order: number;
  validation_rules: ValidationRules;
  options: FieldOption[];
  conditional_visibility?: Record<string, any> | null;
}

export interface FormSection {
  id: string;
  title: string;
  description?: string | null;
  display_order: number;
  fields: FormField[];
}

export interface FormVersion {
  id: string;
  version_number: number;
  published_at?: string;
}

export interface FormSchema {
  id: string;
  slug: string;
  title: string;
  description?: string | null;
  version: FormVersion;
  sections: FormSection[];
}

export interface UploadedMediaItem {
  id?: string;
  field_key: string;
  media_type: 'photo' | 'video' | 'document';
  storage_path: string;
  public_url: string;
  original_name?: string;
  file_size?: number;
  mime_type?: string;
  display_order?: number;
}

export interface FormSubmissionPayload {
  version_id: string;
  fields: Record<string, any>;
  media: UploadedMediaItem[];
}

export interface SubmissionResult {
  registration_code: string;
  submission_id: string;
  status: string;
  created_at: string;
}
