'use client';

import { Footer } from '@/components/ui/footer';
import { useCandidateAuth } from '@/hooks/useClientAuth';

interface AuthAwareFooterServerProps {
  variant?: 'default' | 'candidate' | 'company';
}

export function AuthAwareFooterServer({ 
  variant = 'default'
}: AuthAwareFooterServerProps) {
  const { isAuthenticated, candidateUser, loading } = useCandidateAuth();

  // ローディング中は認証なしで表示
  if (loading) {
    return (
      <Footer
        variant={variant}
        isLoggedIn={false}
      />
    );
  }

  // Transform candidateUser to match Footer's expected format
  const footerUserInfo = candidateUser ? {
    userName: candidateUser.name || candidateUser.email,
    companyName: undefined // 候補者の場合は会社名なし
  } : undefined;

  return (
    <Footer
      variant={variant}
      isLoggedIn={isAuthenticated}
      userInfo={footerUserInfo}
    />
  );
}