'use client';

import { useCompanyAuth } from '@/hooks/useClientAuth';
import { AuthAwareNavigationServer } from '@/components/layout/AuthAwareNavigationServer';
import { AuthAwareFooterServer } from '@/components/layout/AuthAwareFooterServer';
import { UserProvider } from '@/contexts/UserContext';

export default function CompanyLayoutClient({
  children,
}: {
  children: React.ReactNode;
}) {
  const { isAuthenticated, companyUser, loading } = useCompanyAuth();

  // 認証情報を整理
  const userInfo = isAuthenticated && companyUser ? {
    name: companyUser.name || companyUser.email || '',
    email: companyUser.email || '',
    userType: companyUser.userType
  } : undefined;

  // UserContext用のユーザー情報
  const contextUser = isAuthenticated && companyUser ? {
    id: companyUser.id,
    email: companyUser.email || '',
    role: 'company' as const,
    profile: companyUser
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
        variant="company" 
        isLoggedIn={isAuthenticated}
        userInfo={userInfo}
      />
      {children}
      <AuthAwareFooterServer 
        variant="company" 
        isLoggedIn={isAuthenticated}
        userInfo={userInfo}
      />
    </UserProvider>
  );
}