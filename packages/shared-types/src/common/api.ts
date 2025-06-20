// API Response Base
export interface ApiResponse<T = unknown> {
  success: boolean;
  data?: T;
  error?: ApiError;
  message?: string;
}

// API Error
export interface ApiError {
  code: string;
  message: string;
  details?: Record<string, unknown>;
}

// API Request Base
export interface ApiRequest {
  timestamp: string;
  requestId: string;
}

// HTTP Methods
export type HttpMethod = 'GET' | 'POST' | 'PUT' | 'PATCH' | 'DELETE';

// API Endpoints
export interface ApiEndpoint {
  method: HttpMethod;
  path: string;
  authenticated: boolean;
  roles?: string[];
}

// File Upload
export interface FileUpload {
  fileName: string;
  fileContent: string | ArrayBuffer;
  fieldName: string;
  maxSize?: number;
  allowedTypes?: string[];
}

// Search Parameters
export interface SearchParams {
  query?: string;
  filters?: Record<string, unknown>;
  sort?: SortOption;
  pagination?: PaginationParams;
}

// Sort Option
export interface SortOption {
  field: string;
  direction: 'asc' | 'desc';
}

// Pagination Parameters
export interface PaginationParams {
  page: number;
  limit: number;
  offset?: number;
} 