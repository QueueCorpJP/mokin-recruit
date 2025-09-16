'use client';

import { useEffect, useState } from 'react';
import { Navigation } from '@/components/ui/navigation';
import { useCandidateAuth } from '@/hooks/useClientAuth';

interface AuthAwareNavigationServerProps {
  variant?: 'default' | 'candidate' | 'company';
  customCTAButton?: {
    label: string;
    href: string;
    onClick?: (e: React.MouseEvent<HTMLAnchorElement>) => void;
  };
}

export function AuthAwareNavigationServer({
  variant = 'default',
  customCTAButton,
}: AuthAwareNavigationServerProps) {
  const { isAuthenticated, candidateUser, loading } = useCandidateAuth();
  const [authKey, setAuthKey] = useState(0);

  // Listen for auth state changes to force re-render
  useEffect(() => {
    const handleAuthChange = () => {
      setAuthKey(prev => prev + 1);
    };

    window.addEventListener('auth-state-changed', handleAuthChange);
    return () =>
      window.removeEventListener('auth-state-changed', handleAuthChange);
  }, []);

  // ローディング中は認証なしで表示
  if (loading) {
    return (
      <Navigation
        variant={variant}
        isLoggedIn={false}
        customCTAButton={customCTAButton}
      />
    );
  }

  // Transform candidateUser to match Navigation's expected format
  const navigationUserInfo = candidateUser
    ? {
        userName: candidateUser.name || candidateUser.email,
        companyName: undefined, // 候補者の場合は会社名なし
      }
    : undefined;

  return (
    <Navigation
      key={authKey}
      variant={variant}
      isLoggedIn={isAuthenticated}
      userInfo={navigationUserInfo}
      customCTAButton={customCTAButton}
    />
  );
}
