import { headers } from 'next/headers';
import { AuthAwareNavigationServer } from './AuthAwareNavigationServer';
import { AuthAwareFooterServer } from './AuthAwareFooterServer';

export async function AuthAwareLayoutServer({ 
  children 
}: { 
  children: React.ReactNode 
}) {
  // リクエストヘッダーからパスを取得
  const headersList = await headers();
  const pathname = headersList.get('x-pathname') || '';
  
  // パスに基づいてvariantを決定
  let variant: 'default' | 'candidate' | 'company' = 'default';
  if (pathname.startsWith('/candidate')) {
    variant = 'candidate';
  } else if (pathname.startsWith('/company')) {
    variant = 'company';
  }

  return (
    <>
      <AuthAwareNavigationServer variant={variant} />
      {children}
      <AuthAwareFooterServer variant={variant} />
    </>
  );
}