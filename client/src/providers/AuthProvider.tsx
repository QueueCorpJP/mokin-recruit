'use client';

import React, { createContext, useContext, useEffect, useState } from 'react';
import { createClient } from '@/lib/supabase/client';
import { type User } from '@supabase/supabase-js';

interface AuthContextType {
  user: User | null;
  loading: boolean;
  sessionToken: string | null;
}

const AuthContext = createContext<AuthContextType>({ user: null, loading: true, sessionToken: null });

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);
  const [sessionToken, setSessionToken] = useState<string | null>(null);
  
  useEffect(() => {
    async function initializeAuth() {
      try {
        console.log('🔍 [AUTH PROVIDER] Initializing authentication...');
        
        // First, try to get server session using existing API
        const response = await fetch('/api/auth/session', {
          method: 'GET',
          credentials: 'include', // Include cookies
        });
        
        if (response.ok) {
          const serverAuth = await response.json();
          console.log('🔍 [AUTH PROVIDER] Server auth response:', serverAuth);
          
          if (serverAuth.success && serverAuth.user) {
            console.log('🔍 [AUTH PROVIDER] Server authentication found, creating client session...');
            
            // Create a user object for the auth context based on server response
            const mockUser: User = {
              id: serverAuth.user.id,
              email: serverAuth.user.email,
              user_metadata: {
                userType: serverAuth.user.userType,
                name: serverAuth.user.name,
                ...serverAuth.user.user_metadata
              },
              app_metadata: {},
              aud: 'authenticated',
              created_at: serverAuth.user.lastSignIn || new Date().toISOString(),
              updated_at: new Date().toISOString(),
              email_confirmed_at: serverAuth.user.emailConfirmed ? (serverAuth.user.lastSignIn || new Date().toISOString()) : null,
              last_sign_in_at: serverAuth.user.lastSignIn || new Date().toISOString(),
              role: 'authenticated'
            };
            
            // Get the token from cookies
            const cookies = document.cookie.split(';');
            const authCookie = cookies.find(cookie => cookie.trim().startsWith('supabase-auth-token='));
            const token = authCookie ? authCookie.split('=')[1] : null;
            
            setUser(mockUser);
            setSessionToken(token);
            console.log('🔍 [AUTH PROVIDER] Client session created for user:', mockUser.email);
            
            // Now create or update the Supabase client session
            const supabase = createClient();
            
            // Try to manually set the auth state if possible
            // This is a workaround since we can't directly set a session
            try {
              // Check if there's already a Supabase session
              const { data: { session } } = await supabase.auth.getSession();
              if (!session) {
                console.log('🔍 [AUTH PROVIDER] No existing Supabase session, session synced via context');
              } else {
                console.log('🔍 [AUTH PROVIDER] Existing Supabase session found');
                setUser(session.user);
              }
            } catch (sessionError) {
              console.log('🔍 [AUTH PROVIDER] Supabase session check failed:', sessionError);
            }
          } else {
            console.log('🔍 [AUTH PROVIDER] No server authentication found');
          }
        } else {
          console.log('🔍 [AUTH PROVIDER] Server auth check failed:', response.status);
        }
      } catch (error) {
        console.error('🔍 [AUTH PROVIDER] Auth initialization error:', error);
      } finally {
        setLoading(false);
      }
    }
    
    initializeAuth();
  }, []);
  
  // Listen for Supabase auth state changes
  useEffect(() => {
    const supabase = createClient();
    
    const { data: { subscription } } = supabase.auth.onAuthStateChange((event, session) => {
      console.log('🔍 [AUTH PROVIDER] Supabase auth state change:', event, session?.user?.email);
      if (session?.user) {
        setUser(session.user);
      }
    });
    
    return () => subscription.unsubscribe();
  }, []);
  
  return (
    <AuthContext.Provider value={{ user, loading, sessionToken }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  return useContext(AuthContext);
}