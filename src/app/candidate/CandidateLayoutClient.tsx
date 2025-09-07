'use client';

import { AuthAwareNavigationServer } from '@/components/layout/AuthAwareNavigationServer';
import { AuthAwareFooterServer } from '@/components/layout/AuthAwareFooterServer';
import { UserProvider } from '@/contexts/UserContext';

export default function CandidateLayoutClient({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <UserProvider user={null}>
      <AuthAwareNavigationServer 
        variant="candidate" 
        isLoggedIn={false}
        userInfo={undefined}
      />
      {children}
      <AuthAwareFooterServer 
        variant="candidate" 
        isLoggedIn={false}
        userInfo={undefined}
      />
    </UserProvider>
  );
}
