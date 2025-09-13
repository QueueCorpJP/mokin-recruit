import React from 'react';
import { ScoutTemplateClient } from './ScoutTemplateClient';
import { getScoutTemplates, getJobPostings } from './actions';
import { redirect } from 'next/navigation';

export const dynamic = 'force-dynamic';

export default async function ScoutTemplatePage() {
  if (process.env.NODE_ENV === 'development') console.log('🚀 ScoutTemplatePage loading...');
  
  // より詳細な認証チェック
  try {
    // クッキーの存在確認
    const { cookies } = await import('next/headers');
    const cookieStore = await cookies();
    const allCookies = cookieStore.getAll();
    console.log('🍪 Available cookies:', allCookies.map(c => c.name));
    
    // Supabaseセッションクッキーの確認
    const sessionCookies = allCookies.filter(c => c.name.includes('supabase'));
    console.log('🔐 Supabase session cookies:', sessionCookies.length);
    
    // Supabaseクライアントを直接作成してセッション確認
    const { createClient } = await import('@/lib/supabase/server');
    const supabase = await createClient();
    const { data: { user }, error: userError } = await supabase.auth.getUser();
    
    console.log('🔐 Direct Supabase session check:', {
      user: user ? { id: user.id, email: user.email, user_metadata: user.user_metadata } : null,
      error: userError?.message
    });
    
    // まずキャッシュなしで認証チェック
    const { requireCompanyAuth } = await import('@/lib/auth/server');
    const companyUser = await requireCompanyAuth();
    
    if (process.env.NODE_ENV === 'development') console.log('👤 Page companyUser (non-cached):', companyUser ? {
      id: companyUser.id,
      email: companyUser.email,
      userType: companyUser.userType,
      company_account_id: companyUser.user_metadata?.company_account_id
    } : 'not found');
    
    if (!companyUser) {
      if (process.env.NODE_ENV === 'development') console.log('🔄 Redirecting to login...');
      redirect('/auth/company/signin');
    }
  } catch (error) {
    console.error('❌ Auth error:', error);
    redirect('/auth/company/signin');
  }

  // サーバーサイドでスカウトテンプレートと求人データを取得
  let initialScoutTemplates: any[] = [];
  let initialJobPostings: any[] = [];
  let error: string | null = null;
  
  try {
    console.log('📡 Calling getScoutTemplates...');
    const templatesResult = await getScoutTemplates(50, 0);
    console.log('📊 getScoutTemplates result:', templatesResult);
    
    if (templatesResult.success) {
      initialScoutTemplates = templatesResult.data;
      console.log('✅ Templates loaded:', initialScoutTemplates.length);
    } else {
      error = templatesResult.error || 'スカウトテンプレートの取得に失敗しました';
      console.error('❌ Failed to fetch scout templates:', templatesResult.error);
    }

    console.log('📡 Calling getJobPostings...');
    const jobPostingsResult = await getJobPostings();
    console.log('📊 getJobPostings result:', jobPostingsResult);
    
    if (jobPostingsResult.success) {
      initialJobPostings = jobPostingsResult.data;
      console.log('✅ Job postings loaded:', initialJobPostings.length);
    } else {
      console.error('❌ Failed to fetch job postings:', jobPostingsResult.error);
      // 求人の取得に失敗してもスカウトテンプレートは表示する
    }
  } catch (err) {
    error = 'サーバーエラーが発生しました';
    if (process.env.NODE_ENV === 'development') console.error('💥 Exception fetching scout templates:', err);
  }

  return (
    <ScoutTemplateClient 
      initialScoutTemplates={initialScoutTemplates}
      initialJobPostings={initialJobPostings}
      initialError={error}
    />
  );
}
