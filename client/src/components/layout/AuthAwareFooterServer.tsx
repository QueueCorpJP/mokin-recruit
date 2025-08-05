import { Footer } from '@/components/ui/footer';

interface UserInfo {
  name: string;
  email: string;
  userType: string | null;
}

interface AuthAwareFooterServerProps {
  variant?: 'default' | 'candidate' | 'company';
  isLoggedIn?: boolean;
  userInfo?: UserInfo;
}

export function AuthAwareFooterServer({ 
  variant = 'default',
  isLoggedIn = false,
  userInfo
}: AuthAwareFooterServerProps) {
  return (
    <Footer
      variant={variant}
      isLoggedIn={isLoggedIn}
      userInfo={userInfo}
    />
  );
}