'use client';

import { AuthAwareNavigationServer } from '@/components/layout/AuthAwareNavigationServer';
import { UserProvider } from '@/contexts/UserContext';
import dynamic from 'next/dynamic';

const AuthAwareFooterServer = dynamic(
  () => import('@/components/layout/AuthAwareFooterServer').then(mod => mod.AuthAwareFooterServer),
  {
    loading: () => <div className='min-h-[200px] bg-[#323232]' />,
  }
);

export default function CandidateLayoutClient({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <UserProvider user={null}>
      <AuthAwareNavigationServer variant='candidate' />
      {children}
      <AuthAwareFooterServer variant='candidate' />
    </UserProvider>
  );
}
