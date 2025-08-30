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

export function CompanyNavigationWrapper({ isLoggedIn, userInfo }: CompanyNavigationWrapperProps) {
  return <AuthAwareNavigation isLoggedIn={isLoggedIn} userInfo={transformUserInfo(userInfo)} />;
}