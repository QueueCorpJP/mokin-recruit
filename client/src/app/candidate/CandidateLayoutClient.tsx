'use client';

import { useCandidateAuth } from '@/hooks/useClientAuth';
import { AuthAwareNavigationServer } from '@/components/layout/AuthAwareNavigationServer';
import { AuthAwareFooterServer } from '@/components/layout/AuthAwareFooterServer';
import { UserProvider } from '@/contexts/UserContext';
import { useEffect } from 'react';
import { useRouter } from 'next/navigation';

export default function CandidateLayoutClient({
  children,
}: {
  children: React.ReactNode;
}) {
  const { isAuthenticated, candidateUser, loading } = useCandidateAuth();
  const router = useRouter();

  // 認証情報を整理
  const userInfo = isAuthenticated && candidateUser ? {
    name: candidateUser.name || candidateUser.email || '',
    email: candidateUser.email || '',
    userType: candidateUser.userType
  } : undefined;

  // UserContext用のユーザー情報
  const contextUser = isAuthenticated && candidateUser ? {
    id: candidateUser.id,
    email: candidateUser.email || '',
    role: 'candidate' as const,
    profile: candidateUser
  } : null;

  // Loading state
  if (loading) {
    return (
      <div className="min-h-screen bg-white">
        <div className="h-[80px] bg-white border-b border-gray-200" />
        <div className="animate-pulse bg-gray-100 h-4 w-full" />
        <div className="min-h-[200px] bg-[#323232]" />
      </div>
    );
  }

  return (
    <UserProvider user={contextUser}>
      <AuthAwareNavigationServer 
        variant="candidate" 
        isLoggedIn={isAuthenticated}
        userInfo={userInfo}
      />
      {children}
      <AuthAwareFooterServer 
        variant="candidate" 
        isLoggedIn={isAuthenticated}
        userInfo={userInfo}
      />
    </UserProvider>
  );
}