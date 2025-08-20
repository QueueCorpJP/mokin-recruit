import { getServerAuth } from '@/lib/auth/server';
import { redirect } from 'next/navigation';
import AnalyticsClient from './AnalyticsClient';

export default async function AnalyticsPage() {
  const auth = await getServerAuth();
  if (!auth.isAuthenticated || auth.userType !== 'admin') {
    redirect('/admin/auth/login');
  }
  return <AnalyticsClient />;
}
