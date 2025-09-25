import { SignupProvider } from '@/contexts/SignupContext';
import { AuthAwareNavigationServer } from '@/components/layout/AuthAwareNavigationServer';
import dynamic from 'next/dynamic';

const AuthAwareFooter = dynamic(
  () =>
    import('@/components/layout/AuthAwareFooter').then(mod => ({
      default: mod.AuthAwareFooter,
    })),
  {
    loading: () => <div className='min-h-[200px] bg-[#323232]' />,
  }
);

export default function SignupLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <SignupProvider>
      <div
        className='md:min-h-screen flex flex-col signup-layout'
        data-signup-section
      >
        <AuthAwareNavigationServer variant='candidate' />
        {children}
        <AuthAwareFooter />
      </div>
    </SignupProvider>
  );
}
