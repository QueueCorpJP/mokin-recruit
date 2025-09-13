import { AuthAwareNavigationServer } from '@/components/layout/AuthAwareNavigationServer';
import dynamic from 'next/dynamic';

const AuthAwareFooterServer = dynamic(
  () => import('@/components/layout/AuthAwareFooterServer').then(mod => ({ default: mod.AuthAwareFooterServer })),
  {
    loading: () => <div className='min-h-[200px] bg-[#323232]' />,
  }
);

export default function AuthLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <>
      <AuthAwareNavigationServer variant="default" />
      {children}
      <AuthAwareFooterServer variant="default" />
    </>
  );
}