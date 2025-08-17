import { Navigation } from '@/components/ui/navigation';
import { AuthAwareFooter } from '@/components/layout/AuthAwareFooter';
import { SignupProvider } from '@/contexts/SignupContext';

export default function SignupLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <SignupProvider>
      <div className="min-h-screen flex flex-col">
        <Navigation variant="candidate" isLoggedIn={false} userInfo={undefined} />
        {children}
        <AuthAwareFooter />
      </div>
    </SignupProvider>
  );
}