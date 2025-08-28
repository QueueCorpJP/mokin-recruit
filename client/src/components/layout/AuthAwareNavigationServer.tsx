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
  customCTAButton?: {
    label: string;
    href: string;
    onClick?: (e: React.MouseEvent<HTMLAnchorElement>) => void;
  };
}

export function AuthAwareNavigationServer({ 
  variant = 'default',
  isLoggedIn = false,
  userInfo,
  customCTAButton
}: AuthAwareNavigationServerProps) {
  // Transform userInfo to match Navigation's expected format
  const navigationUserInfo = userInfo ? {
    userName: userInfo.name,
    companyName: userInfo.userType === 'company_user' ? userInfo.name : undefined
  } : undefined;

  return (
    <Navigation
      variant={variant}
      isLoggedIn={isLoggedIn}
      userInfo={navigationUserInfo}
      customCTAButton={customCTAButton}
    />
  );
}