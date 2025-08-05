import { Navigation } from '@/components/ui/navigation';

interface UserInfo {
  name: string;
  email: string;
  userType: string | null;
}

interface AuthAwareNavigationServerProps {
  variant?: 'default' | 'candidate' | 'company';
  isLoggedIn?: boolean;
  userInfo?: UserInfo;
}

export function AuthAwareNavigationServer({ 
  variant = 'default',
  isLoggedIn = false,
  userInfo
}: AuthAwareNavigationServerProps) {
  return (
    <Navigation
      variant={variant}
      isLoggedIn={isLoggedIn}
      userInfo={userInfo}
    />
  );
}