'use client';

import { useEffect, useState } from 'react';
import { createBrowserClient } from '@supabase/ssr';
import type { User } from '@supabase/supabase-js';
import type { AuthUser, AuthState, UserType } from '@/types';

export function useClientAuth(): AuthState {
  const [authState, setAuthState] = useState<AuthState>({
    isAuthenticated: false,
    user: null,
    userType: null,
    loading: true,
  });

  const supabase = createBrowserClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
  );

  useEffect(() => {
    // Initial session check
    const checkSession = async () => {
      try {
        const {
          data: { session },
          error,
        } = await supabase.auth.getSession();

        if (error || !session?.user) {
          setAuthState({
            isAuthenticated: false,
            user: null,
            userType: null,
            loading: false,
          });
          return;
        }

        const user = session.user;
        const userType = (user.user_metadata?.user_type ||
          'candidate') as UserType;

        const authUser: AuthUser = {
          id: user.id,
          email: user.email || '',
          userType,
          name: user.user_metadata?.full_name || user.user_metadata?.name,
          emailConfirmed: user.email_confirmed_at != null,
          lastSignIn: user.last_sign_in_at || undefined,
          user_metadata: user.user_metadata,
        };

        setAuthState({
          isAuthenticated: true,
          user: authUser,
          userType,
          loading: false,
        });
      } catch (error) {
        console.error('Auth check failed:', error);
        setAuthState({
          isAuthenticated: false,
          user: null,
          userType: null,
          loading: false,
        });
      }
    };

    checkSession();

    // Listen for auth changes
    const {
      data: { subscription },
    } = supabase.auth.onAuthStateChange(async (event, session) => {
      if (event === 'SIGNED_OUT' || !session?.user) {
        setAuthState({
          isAuthenticated: false,
          user: null,
          userType: null,
          loading: false,
        });

        // Force refresh navigation after sign out
        setTimeout(() => {
          window.dispatchEvent(new Event('auth-state-changed'));
        }, 100);
      } else if (
        event === 'SIGNED_IN' ||
        event === 'TOKEN_REFRESHED' ||
        event === 'USER_UPDATED'
      ) {
        const user = session.user;
        const userType = (user.user_metadata?.user_type ||
          'candidate') as UserType;

        const authUser: AuthUser = {
          id: user.id,
          email: user.email || '',
          userType,
          name: user.user_metadata?.full_name || user.user_metadata?.name,
          emailConfirmed: user.email_confirmed_at != null,
          lastSignIn: user.last_sign_in_at || undefined,
          user_metadata: user.user_metadata,
        };

        setAuthState({
          isAuthenticated: true,
          user: authUser,
          userType,
          loading: false,
        });

        // Force refresh navigation after sign in
        if (event === 'SIGNED_IN') {
          // Trigger a small delay to ensure state propagation
          setTimeout(() => {
            window.dispatchEvent(new Event('auth-state-changed'));
          }, 100);
        }
      }
    });

    return () => subscription.unsubscribe();
  }, [supabase.auth]);

  return authState;
}

// Utility hooks for specific user types
export function useCandidateAuth() {
  const auth = useClientAuth();
  return {
    ...auth,
    isCandidate: auth.isAuthenticated && auth.userType === 'candidate',
    candidateUser:
      auth.isAuthenticated && auth.userType === 'candidate' ? auth.user : null,
  };
}

export function useCompanyAuth() {
  const auth = useClientAuth();
  return {
    ...auth,
    isCompany: auth.isAuthenticated && auth.userType === 'company_user',
    companyUser:
      auth.isAuthenticated && auth.userType === 'company_user'
        ? auth.user
        : null,
  };
}

export function useAdminAuth() {
  const auth = useClientAuth();
  return {
    ...auth,
    isAdmin: auth.isAuthenticated && auth.userType === 'admin',
    adminUser:
      auth.isAuthenticated && auth.userType === 'admin' ? auth.user : null,
  };
}
