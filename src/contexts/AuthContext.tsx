// Server-side auth exports - these functions are now handled server-side
export type { UserType } from '../lib/auth/server';

// Note: Client-side auth hooks are no longer available in server components
// Use getServerAuth() in server components instead 