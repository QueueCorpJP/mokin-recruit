// Form Field Base
export interface FormField<T = unknown> {
  name: string;
  value: T;
  error?: string;
  touched: boolean;
  required: boolean;
  disabled: boolean;
}

// Form State
export interface FormState<T = Record<string, unknown>> {
  values: T;
  errors: Partial<Record<keyof T, string>>;
  touched: Partial<Record<keyof T, boolean>>;
  isSubmitting: boolean;
  isValid: boolean;
  isDirty: boolean;
}

// Form Validation Rule
export interface ValidationRule<T = unknown> {
  message: string;
  validator: (value: T) => boolean;
}

// Form Field Config
export interface FormFieldConfig<T = unknown> {
  name: string;
  type: 'text' | 'email' | 'password' | 'number' | 'date' | 'select' | 'checkbox' | 'radio' | 'textarea' | 'file';
  label: string;
  placeholder?: string;
  required?: boolean;
  disabled?: boolean;
  options?: FormOption[];
  validationRules?: ValidationRule<T>[];
  defaultValue?: T;
}

// Form Option (for select, radio, checkbox)
export interface FormOption {
  value: string | number;
  label: string;
  disabled?: boolean;
}

// Form Step (for multi-step forms)
export interface FormStep {
  id: string;
  title: string;
  description?: string;
  fields: FormFieldConfig[];
  isValid: boolean;
  isCompleted: boolean;
}

// Multi-step Form State
export interface MultiStepFormState<T = Record<string, unknown>> {
  currentStep: number;
  totalSteps: number;
  steps: FormStep[];
  values: T;
  errors: Partial<Record<keyof T, string>>;
  canGoNext: boolean;
  canGoPrevious: boolean;
}

// Form Submission Result
export interface FormSubmissionResult<T = unknown> {
  success: boolean;
  data?: T;
  errors?: Record<string, string>;
  message?: string;
}

// File Upload Field
export interface FileUploadField {
  name: string;
  files: File[] | null;
  maxSize: number;
  allowedTypes: string[];
  multiple: boolean;
  error?: string;
}

// File interface for environments without DOM
export interface File {
  name: string;
  size: number;
  type: string;
  lastModified: number;
} 