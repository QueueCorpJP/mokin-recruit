import React from 'react';
import Image from 'next/image';
import { SectionHeading } from '@/components/ui/SectionHeading';
import { MessageButton } from './MessageButton';
import { getPublishedNotices } from '@/lib/utils/noticeHelpers';
import { getCompanyAccountData } from '@/lib/actions/company-task-data';
import dynamic from 'next/dynamic';

const CompanyTaskSidebar = dynamic(
  () =>
    import('@/components/company/CompanyTaskSidebar').then(mod => ({
      default: mod.CompanyTaskSidebar,
    })),
  {
    loading: () => (
      <div className='md:flex-none'>
        <div className='bg-white rounded-[10px] p-6 shadow-[0px_0px_20px_0px_rgba(0,0,0,0.05)]'>
          <div className='animate-pulse'>
            <div className='h-6 bg-gray-200 rounded w-32 mb-6'></div>
            <div className='space-y-4'>
              {Array.from({ length: 3 }).map((_, i) => (
                <div key={i} className='h-16 bg-gray-200 rounded'></div>
              ))}
            </div>
          </div>
        </div>
      </div>
    ),
  }
);

const NewMessagesSectionClient = dynamic(
  () => import('./NewMessagesSectionClient'),
  {
    loading: () => (
      <div className='bg-white rounded-[10px] p-6 shadow-[0px_0px_20px_0px_rgba(0,0,0,0.05)]'>
        <div className='animate-pulse space-y-4'>
          {Array.from({ length: 3 }).map((_, i) => (
            <div
              key={i}
              className='flex items-center p-4 border border-gray-200 rounded'
            >
              <div className='w-8 h-8 bg-gray-200 rounded-full mr-4'></div>
              <div className='flex-1'>
                <div className='h-4 bg-gray-200 rounded w-3/4 mb-2'></div>
                <div className='h-3 bg-gray-200 rounded w-1/2'></div>
              </div>
              <div className='w-16 h-4 bg-gray-200 rounded'></div>
            </div>
          ))}
        </div>
      </div>
    ),
  }
);

const SavedSearchRecommendationsClient = dynamic(
  () => import('./SavedSearchRecommendationsClient'),
  {
    loading: () => (
      <div className='bg-white rounded-[10px] p-6 shadow-[0px_0px_20px_0px_rgba(0,0,0,0.05)]'>
        <div className='animate-pulse'>
          <div className='grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6'>
            {Array.from({ length: 6 }).map((_, i) => (
              <div key={i} className='border border-gray-200 rounded-lg p-4'>
                <div className='h-6 bg-gray-200 rounded w-3/4 mb-3'></div>
                <div className='space-y-2'>
                  <div className='h-4 bg-gray-200 rounded w-full'></div>
                  <div className='h-4 bg-gray-200 rounded w-2/3'></div>
                </div>
                <div className='flex gap-2 mt-4'>
                  <div className='h-3 bg-gray-200 rounded w-16'></div>
                  <div className='h-3 bg-gray-200 rounded w-20'></div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    ),
  }
);

// サーバー側での重い候補者データ取得は行わない（RLSのためクライアントで取得・先出）

// 相対時間表示のヘルパー関数
function _formatRelativeTime(date: Date): string {
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
      day: 'numeric',
    });
  }
}

// メッセージはクライアントセクション（NewMessagesSectionClient）で取得する

export default async function CompanyMypage() {
  // 企業ユーザー認証情報を取得（1回のみ）
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

  // cookiesとSupabase設定を外部で取得
  const { cookies } = await import('next/headers');
  const cookieStore = await cookies();
  const cookiesData = cookieStore.getAll();
  const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!;
  const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!;

  // 認証済みのユーザー情報を各関数に渡すため、個別にインポート
  const { getJobOptions } = await import(
    '@/lib/server/candidate/recruitment-queries'
  );

  // 軽量データのみを並行取得（重い処理は分離）
  const [
    notices,
    companyAccountData,
    jobOptions,
    savedSearchResult,
    candidatesData,
  ] = await Promise.all([
    getPublishedNotices(3, supabaseUrl, supabaseAnonKey, cookiesData),
    getCompanyAccountData(authResult.data.companyUserId),
    getJobOptions(),
    (async () => {
      const { getSavedSearchHistory } = await import(
        '@/lib/actions/search-history'
      );
      return getSavedSearchHistory(undefined, 3); // 最大3件の保存済み検索条件を取得
    })(),
    (async () => {
      // 一時的にSupabaseから直接全候補者を取得
      const supabase = await import('@/lib/supabase/server-client').then(m =>
        m.getSupabaseServerClient()
      );
      const client = await supabase;
      const { data: candidates, error } = await client
        .from('candidates')
        .select(
          `
          id,
          first_name,
          last_name,
          recent_job_company_name,
          prefecture,
          birth_date,
          gender,
          current_salary,
          skills,
          last_login_at,
          recent_job_department_position,
          recent_job_industries,
          recent_job_types,
          education(
            final_education,
            school_name,
            department,
            graduation_year,
            graduation_month
          )
        `
        )
        .limit(50); // 最大50件に制限

      console.log('[DEBUG mypage] Direct candidates query result:', {
        candidatesCount: candidates?.length || 0,
        error,
        sampleCandidate: candidates?.[0],
      });

      return candidates || [];
    })(),
  ]);

  // 重複する認証処理を避けるため、認証済み情報を直接使用
  console.log('[DEBUG mypage] Auth result:', {
    companyUserId: authResult.data.companyUserId,
    companyAccountId: authResult.data.companyAccountId,
    companyGroupId: authResult.data.companyGroupId,
  });

  console.log('[DEBUG] Notices fetched:', notices);
  console.log('[DEBUG] Company Account Data:', companyAccountData);
  console.log('[DEBUG] Saved search result:', savedSearchResult);
  console.log('[DEBUG] Candidates data:', {
    candidatesCount: candidatesData?.length || 0,
    sampleCandidate: candidatesData?.[0],
  });

  // 認証済み情報から直接グループIDを使用（追加認証なし）
  const companyGroupId =
    authResult.data.companyGroupId || authResult.data.companyUserId;

  // 保存済み検索条件を取得
  const initialSavedSearches = savedSearchResult.success
    ? savedSearchResult.data.map((item: any) => ({
        id: item.id,
        group_name: item.group_name,
        search_title: item.search_title,
        search_conditions: item.search_conditions,
      }))
    : [];

  // 候補者データを実際のデータに更新
  const candidates = candidatesData || [];

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
            <NewMessagesSectionClient
              companyUserId={authResult.data.companyUserId}
              companyGroupId={companyGroupId}
            />
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
                  <Image
                    src='/images/user-1.svg'
                    alt='おすすめの候補者アイコン'
                    width={24}
                    height={25}
                    loading='lazy'
                  />
                  <span
                    className='text-[18px] font-bold text-[#222]'
                    style={{
                      fontFamily: 'Noto Sans JP, sans-serif',
                      letterSpacing: '0.04em',
                      lineHeight: 1.4,
                    }}
                  >
                    おすすめの候補者
                  </span>
                </div>
                <div className='relative ml-2 group'>
                  <div className='flex items-center justify-center cursor-pointer'>
                    <Image
                      src='/images/question.svg'
                      alt='クエスチョンアイコン'
                      width={16}
                      height={16}
                      className='hover:opacity-70 filter grayscale'
                      loading='lazy'
                    />
                  </div>
                  <div
                    className='absolute left-8 -top-2 z-10 w-80 flex flex-col items-start justify-center rounded-[5px] bg-[#F0F9F3] p-4 opacity-0 pointer-events-none group-hover:opacity-100 group-hover:pointer-events-auto transition-opacity duration-200'
                    style={{
                      boxShadow: '0 0 20px 0 rgba(0, 0, 0, 0.05)',
                      border: '1px solid #E5E5E5',
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
              companyUserId={authResult.data.companyUserId}
              companyGroupId={companyGroupId}
              jobOptions={jobOptions}
              initialSavedSearches={initialSavedSearches}
              initialCandidates={candidates}
            />
          </div>
          {/* 右カラム（サブ） */}
          <CompanyTaskSidebar
            className='md:flex-none'
            showTodoAndNews={true}
            notices={notices}
            companyAccountData={companyAccountData}
          />
        </div>
      </main>
    </div>
  );
}
