'use client';

import { AuthAwareNavigation } from './AuthAwareNavigation';

interface CompanyNavigationWrapperProps {
  isLoggedIn: boolean;
  userInfo?: {
    name: string;
    email: string;
    userType: string | null;
  };
}

export function CompanyNavigationWrapper({ isLoggedIn, userInfo }: CompanyNavigationWrapperProps) {
  return <AuthAwareNavigation isLoggedIn={isLoggedIn} userInfo={userInfo} />;
}