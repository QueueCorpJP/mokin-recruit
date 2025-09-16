'use client';

import { useEffect, useState } from 'react';
import { AuthAwareNavigation } from './AuthAwareNavigation';
import { useCompanyAuth } from '@/hooks/useClientAuth';

interface CompanyNavigationWrapperProps {
  isLoggedIn: boolean;
  userInfo?: {
    name: string;
    email: string;
    userType: string | null;
  };
}

const transformUserInfo = (userInfo?: {
  name: string;
  email: string;
  userType: string | null;
}) => {
  if (!userInfo) return undefined;
  return {
    companyName:
      userInfo.userType === 'company_user' ? userInfo.name : undefined,
    userName: userInfo.name,
  };
};

export function CompanyNavigationWrapper({
  isLoggedIn: initialIsLoggedIn,
  userInfo: initialUserInfo,
}: CompanyNavigationWrapperProps) {
  const { isAuthenticated, companyUser, loading } = useCompanyAuth();
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

  // Use client-side auth state when available, otherwise use initial server state
  const isLoggedIn = loading ? initialIsLoggedIn : isAuthenticated;
  const userInfo = loading
    ? initialUserInfo
    : companyUser
      ? {
          name: companyUser.name || companyUser.email,
          email: companyUser.email,
          userType: companyUser.userType,
        }
      : undefined;

  return (
    <AuthAwareNavigation
      key={authKey}
      isLoggedIn={isLoggedIn}
      userInfo={transformUserInfo(userInfo)}
    />
  );
}
