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
  // Transform userInfo to match Footer's expected format
  const footerUserInfo = userInfo ? {
    userName: userInfo.name,
    companyName: userInfo.userType === 'company_user' ? userInfo.name : undefined
  } : undefined;

  return (
    <Footer
      variant={variant}
      isLoggedIn={isLoggedIn}
      userInfo={footerUserInfo}
    />
  );
}