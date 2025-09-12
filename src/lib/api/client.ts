// Compatibility shim for legacy imports '../lib/api/client'
// Re-export from the canonical api-client implementation
export { apiClient } from '@/lib/utils/api-client';
export type { ApiResponse, ApiClientOptions } from '@/lib/utils/api-client';
