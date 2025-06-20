// Validation Result
export interface ValidationResult {
  isValid: boolean;
  errors: string[];
}

// Field Validation Result
export interface FieldValidationResult {
  field: string;
  isValid: boolean;
  error?: string;
}

// Validation Schema
export type ValidationSchema<T = Record<string, unknown>> = {
  [K in keyof T]?: FieldValidator<T[K]>;
}

// Field Validator
export interface FieldValidator<T = unknown> {
  required?: boolean;
  minLength?: number;
  maxLength?: number;
  pattern?: RegExp;
  customValidator?: (value: T) => boolean | string;
  errorMessages?: {
    required?: string;
    minLength?: string;
    maxLength?: string;
    pattern?: string;
    custom?: string;
  };
}

// Common Validation Patterns
export const ValidationPatterns = {
  EMAIL: /^[^\s@]+@[^\s@]+\.[^\s@]+$/,
  PHONE_JP: /^0\d{1,4}-\d{1,4}-\d{4}$/,
  POSTAL_CODE_JP: /^\d{3}-\d{4}$/,
  PASSWORD_STRONG: /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,}$/,
  HIRAGANA: /^[ひらがな\s]+$/,
  KATAKANA: /^[カタカナ\s]+$/,
  ALPHANUMERIC: /^[a-zA-Z0-9]+$/,
  NUMERIC: /^\d+$/,
} as const;

// Common Validation Rules
export const ValidationRules = {
  required: (message = 'This field is required') => ({
    required: true,
    errorMessages: { required: message }
  }),
  
  email: (message = 'Please enter a valid email address') => ({
    pattern: ValidationPatterns.EMAIL,
    errorMessages: { pattern: message }
  }),
  
  minLength: (min: number, message?: string) => ({
    minLength: min,
    errorMessages: { 
      minLength: message || `Must be at least ${min} characters long` 
    }
  }),
  
  maxLength: (max: number, message?: string) => ({
    maxLength: max,
    errorMessages: { 
      maxLength: message || `Must be no more than ${max} characters long` 
    }
  }),
  
  phoneJP: (message = 'Please enter a valid Japanese phone number') => ({
    pattern: ValidationPatterns.PHONE_JP,
    errorMessages: { pattern: message }
  }),
  
  strongPassword: (message = 'Password must contain at least 8 characters with uppercase, lowercase, number and special character') => ({
    pattern: ValidationPatterns.PASSWORD_STRONG,
    errorMessages: { pattern: message }
  })
} as const;

// Validation Error Types
export type ValidationErrorType = 
  | 'required'
  | 'minLength'
  | 'maxLength'
  | 'pattern'
  | 'custom'
  | 'type'
  | 'range';

// Validation Context
export interface ValidationContext {
  field: string;
  value: unknown;
  allValues: Record<string, unknown>;
  touched: boolean;
} 