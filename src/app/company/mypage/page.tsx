import React from 'react';
import { SectionHeading } from '@/components/ui/SectionHeading';
import { MessageButton } from './MessageButton';
import { CompanyTaskSidebar } from '@/components/company/CompanyTaskSidebar';
import { getPublishedNotices } from '@/lib/utils/noticeHelpers';
import { getCompanyAccountData } from '@/lib/actions/company-task-data';
import NewMessagesSectionClient from './NewMessagesSectionClient';
import SavedSearchRecommendationsClient from './SavedSearchRecommendationsClient';

export const dynamic = 'force-dynamic';

// サーバー側での重い候補者データ取得は行わない（RLSのためクライアントで取得・先出）

// 相対時間表示のヘルパー関数
function formatRelativeTime(date: Date): string {
  const now = new Date();
  const diffMs = now.getTime() - date.getTime();
  const diffHours = Math.floor(diffMs / (1000 * 60 * 60));
  const diffDays = Math.floor(diffMs / (1000 * 60 * 60 * 24));

  // 1日未満（24時間未満）の場合
  if (diffHours < 24) {
    return diffHours <= 0 ? '1時間前' : `${diffHours}時間前`;
  }
  // 1日以上〜6日以内の場合
  else if (diffDays >= 1 && diffDays <= 6) {
    return `${diffDays}日前`;
  }
  // 7日以上〜13日以内の場合
  else if (diffDays >= 7 && diffDays <= 13) {
    return '1週間前';
  }
  // 14日以上〜29日以内の場合
  else if (diffDays >= 14 && diffDays <= 29) {
    const weeks = Math.floor(diffDays / 7);
    return `${weeks}週間前`;
  }
  // 30日以上の場合
  else {
    return date.toLocaleDateString('ja-JP', {
      year: 'numeric',
      month: 'numeric',
      day: 'numeric'
    });
  }
}


// メッセージはクライアントセクション（NewMessagesSectionClient）で取得する

export default async function CompanyMypage() {
  // 企業ユーザー認証情報を取得
  const { requireCompanyAuthForAction } = await import('@/lib/auth/server');
  const authResult = await requireCompanyAuthForAction();
  
  if (!authResult.success) {
    // 認証エラーの場合は空のデータを返す（レイアウトでリダイレクト処理される）
    return (
      <div className='min-h-[60vh] w-full flex flex-col items-center bg-[#F9F9F9] px-4 pt-4 pb-20 md:px-20 md:py-10 md:pb-20'>
        <main className='w-full max-w-[1280px] mx-auto'>
          <p>認証が必要です。</p>
        </main>
      </div>
    );
  }

  // cookiesを外部で取得（サイドバーの軽量データのみサーバーで用意）
  const { cookies } = await import('next/headers');
  const cookieStore = await cookies();
  const cookiesData = cookieStore.getAll();
  const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!;
  const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!;

  const { getCompanyGroups, getUserDefaultGroupId, getSearchHistory } = await import('@/lib/actions/search-history');
  const { getJobOptions } = await import('@/lib/server/candidate/recruitment-queries');

  const [notices, companyAccountData, companyGroupsResult, defaultGroupResult, jobOptions] = await Promise.all([
    getPublishedNotices(3, supabaseUrl, supabaseAnonKey, cookiesData),
    getCompanyAccountData(authResult.data.companyUserId),
    getCompanyGroups(),
    getUserDefaultGroupId(),
    getJobOptions(),
  ]);

  console.log('[DEBUG] Default group result:', defaultGroupResult);
  console.log('[DEBUG] Notices fetched:', notices);
  console.log('[DEBUG] Company Account Data:', companyAccountData);
  
  const companyGroups = companyGroupsResult.success 
    ? companyGroupsResult.data.map(group => ({
        value: group.id,
        label: group.name
      }))
    : [];
    
  const companyGroupId = companyGroups[0]?.value ?? (defaultGroupResult.success && defaultGroupResult.data ? (defaultGroupResult.data as any).id : undefined);

  // おすすめ候補者セクション用にサーバー側で検索履歴（保存済みが0件なら直近履歴でフォールバック）を取得
  let initialSavedSearches: Array<{ id: string; group_name: string; search_title: string; search_conditions: any }> = [];
  try {
    const savedHistoryResult = await getSearchHistory(companyGroupId, 20, 0);
    if (savedHistoryResult.success) {
      const all = (savedHistoryResult.data as any[]) || [];
      const saved = all.filter((h) => h.is_saved === true || String(h.is_saved).toLowerCase() === 'true');
      initialSavedSearches = (saved.length > 0 ? saved : all).slice(0, 3);
    }
  } catch (_) {}

  return (
    <div className='min-h-[60vh] w-full flex flex-col items-center bg-[#F9F9F9] px-4 pt-4 pb-20 md:px-20 md:py-10 md:pb-20'>
      <main className='w-full max-w-[1280px] mx-auto'>
        <div className='flex flex-col md:flex-row gap-10 md:gap-20 w-full justify-center items-stretch md:items-start'>
          {/* 左カラム（メイン） */}
          <div className='w-full max-w-[880px] flex-1 box-border md:px-6 px-0'>
            {/* 新着メッセージ 見出し */}
            <SectionHeading
              iconSrc='/images/mail.svg'
              iconAlt='新着メッセージアイコン'
            >
              新着メッセージ
            </SectionHeading>
            <NewMessagesSectionClient />
            <div
              style={{
                display: 'flex',
                justifyContent: 'center',
                marginTop: 24,
              }}
            >
              <MessageButton />
            </div>
            {/* おすすめの候補者 見出し */}
            <div className='mt-20 mb-6'>
              <div className='flex flex-row items-center pb-2 border-b-2 border-[#DCDCDC]'>
                <div className='flex flex-row items-center gap-3'>
                  <img
                    src='/images/user-1.svg'
                    alt='おすすめの候補者アイコン'
                    width={24}
                    height={25}
                    loading="lazy"
                  />
                  <span 
                    className='text-[18px] font-bold text-[#222]'
                    style={{ 
                      fontFamily: 'Noto Sans JP, sans-serif',
                      letterSpacing: '0.04em',
                      lineHeight: 1.4
                    }}
                  >
                    おすすめの候補者
                  </span>
                </div>
                <div className='relative ml-2 group'>
                  <div className='flex items-center justify-center cursor-pointer'>
                    <img 
                      src='/images/question.svg' 
                      alt='クエスチョンアイコン' 
                      width={16}
                      height={16}
                      className='hover:opacity-70 filter grayscale'
                      loading="lazy" 
                    />
                  </div>
                  <div 
                    className='absolute left-8 -top-2 z-10 w-80 flex flex-col items-start justify-center rounded-[5px] bg-[#F0F9F3] p-4 opacity-0 pointer-events-none group-hover:opacity-100 group-hover:pointer-events-auto transition-opacity duration-200'
                    style={{ 
                      boxShadow: '0 0 20px 0 rgba(0, 0, 0, 0.05)',
                      border: '1px solid #E5E5E5'
                    }}
                  >
                    <h3 
                      className='font-bold text-[14px] text-[#323232] mb-2'
                      style={{ fontFamily: 'Noto Sans JP, sans-serif' }}
                    >
                      おすすめの候補者
                    </h3>
                    <p 
                      className='text-[12px] text-[#323232] leading-relaxed'
                      style={{ fontFamily: 'Noto Sans JP, sans-serif' }}
                    >
                      保存した候補者の検索条件にマッチする候補者を表示しています。
                    </p>
                  </div>
                </div>
              </div>
            </div>
            {/* おすすめ候補者セクション（クライアント先出） */}
            <SavedSearchRecommendationsClient
              companyGroupId={companyGroupId}
              jobOptions={jobOptions}
              initialSavedSearches={initialSavedSearches}
            />
          </div>
          {/* 右カラム（サブ） */}
          <CompanyTaskSidebar className="md:flex-none" showTodoAndNews={true} notices={notices} companyAccountData={companyAccountData} />
        </div>
      </main>
    </div>
  );
}
