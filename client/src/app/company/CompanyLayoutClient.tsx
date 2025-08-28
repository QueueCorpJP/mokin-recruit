'use client';

import { useCompanyAuth } from '@/hooks/useClientAuth';
import { AuthAwareNavigationServer } from '@/components/layout/AuthAwareNavigationServer';
import { AuthAwareFooterServer } from '@/components/layout/AuthAwareFooterServer';
import { UserProvider } from '@/contexts/UserContext';
import { usePathname } from 'next/navigation';

export default function CompanyLayoutClient({
  children,
}: {
  children: React.ReactNode;
}) {
  const { isAuthenticated, companyUser, loading } = useCompanyAuth();
  const pathname = usePathname();

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

  // /company ページのみカスタムCTAボタンを設定
  const customCTAButton = pathname === '/company' && !isAuthenticated ? {
    label: '資料請求',
    href: '#contact-form',
    onClick: (e: React.MouseEvent<HTMLAnchorElement>) => {
      e.preventDefault();
      const element = document.getElementById('contact-form');
      if (element) {
        element.scrollIntoView({ behavior: 'smooth', block: 'start' });
      }
    }
  } : undefined;

  return (
    <UserProvider user={contextUser}>
      <AuthAwareNavigationServer 
        variant="company" 
        isLoggedIn={isAuthenticated}
        userInfo={userInfo}
        customCTAButton={customCTAButton}
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