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

const transformUserInfo = (userInfo?: {
  name: string;
  email: string;
  userType: string | null;
}) => {
  if (!userInfo) return undefined;
  return {
    companyName: userInfo.userType === 'company_user' ? userInfo.name : undefined,
    userName: userInfo.name,
  };
};

export function CompanyFooterWrapper({ isLoggedIn, userInfo }: CompanyFooterWrapperProps) {
  return <AuthAwareFooter isLoggedIn={isLoggedIn} userInfo={transformUserInfo(userInfo)} />;
}