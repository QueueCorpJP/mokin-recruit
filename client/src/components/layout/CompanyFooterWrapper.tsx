'use client';

import { AuthAwareFooter } from './AuthAwareFooter';

interface CompanyFooterWrapperProps {
  isLoggedIn: boolean;
  userInfo?: {
    name: string;
    email: string;
    userType: string | null;
  };
}

export function CompanyFooterWrapper({ isLoggedIn, userInfo }: CompanyFooterWrapperProps) {
  return <AuthAwareFooter isLoggedIn={isLoggedIn} userInfo={userInfo} />;
}