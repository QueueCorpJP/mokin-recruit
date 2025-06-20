// Pagination Result
export interface PaginationResult<T> {
  data: T[];
  pagination: PaginationInfo;
}

// Pagination Info
export interface PaginationInfo {
  currentPage: number;
  totalPages: number;
  totalItems: number;
  itemsPerPage: number;
  hasNextPage: boolean;
  hasPreviousPage: boolean;
}

// Pagination Request
export interface PaginationRequest {
  page?: number;
  limit?: number;
  sortBy?: string;
  sortOrder?: 'asc' | 'desc';
}

// Cursor Pagination (for large datasets)
export interface CursorPaginationRequest {
  cursor?: string;
  limit?: number;
  sortBy?: string;
  sortOrder?: 'asc' | 'desc';
}

// Cursor Pagination Result
export interface CursorPaginationResult<T> {
  data: T[];
  nextCursor?: string;
  previousCursor?: string;
  hasNextPage: boolean;
  hasPreviousPage: boolean;
} 