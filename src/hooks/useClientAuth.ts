'use client';

import { useEffect, useState } from 'react';
import { createBrowserClient } from '@supabase/ssr';
import type { User } from '@supabase/supabase-js';

export type UserType = 'candidate' | 'company_user' | 'admin';

interface AuthUser {
  id: string;
  email: string;
  userType: UserType;
  name?: string;
  emailConfirmed: boolean;
  lastSignIn?: string;
  user_metadata?: {
    user_type?: string;
    company_account_id?: string;
    company_user_id?: string;
    [key: string]: any;
  };
}

interface AuthState {
  isAuthenticated: boolean;
  user: AuthUser | null;
  userType: UserType | null;
  loading: boolean;
}

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
        const { data: { user }, error } = await supabase.auth.getUser();
        
        if (error || !user) {
          setAuthState({
            isAuthenticated: false,
            user: null,
            userType: null,
            loading: false,
          });
          return;
        }

        const userType = (user.user_metadata?.user_type || 'candidate') as UserType;
        
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
      } else if (event === 'SIGNED_IN' || event === 'TOKEN_REFRESHED') {
        const user = session.user;
        const userType = (user.user_metadata?.user_type || 'candidate') as UserType;
        
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
    candidateUser: auth.isAuthenticated && auth.userType === 'candidate' ? auth.user : null,
  };
}

export function useCompanyAuth() {
  const auth = useClientAuth();
  return {
    ...auth,
    isCompany: auth.isAuthenticated && auth.userType === 'company_user',
    companyUser: auth.isAuthenticated && auth.userType === 'company_user' ? auth.user : null,
  };
}

export function useAdminAuth() {
  const auth = useClientAuth();
  return {
    ...auth,
    isAdmin: auth.isAuthenticated && auth.userType === 'admin',
    adminUser: auth.isAuthenticated && auth.userType === 'admin' ? auth.user : null,
  };
}