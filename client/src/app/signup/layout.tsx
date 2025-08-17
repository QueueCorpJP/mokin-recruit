import { Navigation } from '@/components/ui/navigation';
import { AuthAwareFooter } from '@/components/layout/AuthAwareFooter';

export default function SignupLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="min-h-screen flex flex-col">
      <Navigation variant="candidate" isLoggedIn={false} userInfo={undefined} />
      {children}
      <AuthAwareFooter />
    </div>
  );
}