'use client';

import { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { safeLog } from '@/lib/utils/pii-safe-logger';

interface SignupContextType {
  candidateId: string | null;
  setCandidateId: (id: string) => void;
  isLoading: boolean;
}

const SignupContext = createContext<SignupContextType | undefined>(undefined);

export function SignupProvider({ children }: { children: ReactNode }) {
  const [candidateId, setCandidateIdState] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    // Check if candidate ID exists in localStorage
    const storedId = localStorage.getItem('signup_candidate_id');
    if (storedId) {
      setCandidateIdState(storedId);
    }
    setIsLoading(false);
  }, []);

  const setCandidateId = (id: string) => {
    setCandidateIdState(id);
    localStorage.setItem('signup_candidate_id', id);
  };

  return (
    <SignupContext.Provider value={{ candidateId, setCandidateId, isLoading }}>
      {children}
    </SignupContext.Provider>
  );
}

export function useSignup() {
  const context = useContext(SignupContext);
  if (context === undefined) {
    throw new Error('useSignup must be used within a SignupProvider');
  }
  return context;
}

// Server-side function to get candidate ID from cookie
export async function getServerCandidateId(): Promise<string | null> {
  if (typeof window !== 'undefined') {
    // Client-side fallback
    return localStorage.getItem('signup_candidate_id');
  }

  try {
    const { cookies } = await import('next/headers');
    const cookieStore = await cookies();
    return cookieStore.get('signup_candidate_id')?.value || null;
  } catch {
    return null;
  }
}

// Server-side function to set candidate ID cookie
export async function setServerCandidateId(candidateId: string) {
  if (typeof window !== 'undefined') {
    // Client-side fallback
    localStorage.setItem('signup_candidate_id', candidateId);
    return;
  }

  try {
    const { cookies } = await import('next/headers');
    const cookieStore = await cookies();
    cookieStore.set('signup_candidate_id', candidateId, {
      httpOnly: false,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'lax',
      maxAge: 60 * 60 * 24 * 7, // 7 days
    });
  } catch (error) {
    safeLog('error', 'Failed to set candidate ID cookie', { error: error instanceof Error ? error.message : String(error) });
  }
}