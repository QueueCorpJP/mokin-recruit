import { getServerAuth } from '@/lib/auth/server';
import { redirect } from 'next/navigation';
import CompanyClient from './CompanyClient';

export default async function CompanyPage() {
  const auth = await getServerAuth();
  if (!auth.isAuthenticated || auth.userType !== 'admin') {
    redirect('/admin/auth/login');
  }
  return <CompanyClient />;
}
