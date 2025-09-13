import React from 'react';
import Image from 'next/image';
import { SectionHeading } from '@/components/ui/SectionHeading';
import { MessageButton } from './MessageButton';
import { NewMessageList } from './NewMessageList';
import { Message } from './NewMessageItem';
import { CandidateCard, CandidateData } from '@/components/company/CandidateCard';
import { CompanyTaskSidebar } from '@/components/company/CompanyTaskSidebar';
import { CandidateListClient } from './CandidateListClient';
import { RecommendedCandidatesSection } from '@/components/company/RecommendedCandidatesSection';
import { createClient } from '@/lib/supabase/server';
import { unstable_cache } from 'next/cache';
import { searchCandidatesWithMockData } from '@/lib/utils/candidateSearch';
import { getSearchHistory } from '@/lib/actions/search-history';
import { getPublishedNotices } from '@/lib/utils/noticeHelpers';
import { getRooms } from '@/lib/rooms';

// キャッシュ付きの候補者データ取得関数
const getCandidatesData = unstable_cache(
  async (url: string, anonKey: string, cookiesData: any): Promise<CandidateData[]> => {
    try {
      const { createServerClient } = await import('@supabase/ssr');
      const supabase = createServerClient(url, anonKey, {
        cookies: {
          getAll() {
            return cookiesData;
          },
          setAll() {
            // キャッシュ内では何もしない
          },
        },
      });
    
    // 複数のテーブルから必要なデータを1回のクエリで効率的に取得
    // N+1問題を防ぐため、関連テーブルのJOINを活用
    const { data: candidates, error } = await supabase
      .from('candidates')
      .select(`
        id,
        last_name,
        first_name,
        current_company,
        current_position,
        prefecture,
        gender,
        birth_date,
        current_income,
        desired_salary,
        skills,
        experience_years,
        desired_industries,
        desired_job_types,
        last_login_at,
        recent_job_company_name,
        recent_job_department_position,
        recent_job_industries,
        recent_job_types,
        recent_job_description,
        education(
          final_education,
          school_name
        ),
        work_experience(
          industry_name,
          experience_years
        ),
        job_type_experience(
          job_type_name,
          experience_years
        ),
        career_status_entries(
          company_name,
          industries,
          progress_status
        )
      `)
      .eq('status', 'ACTIVE')
      .not('last_login_at', 'is', null) // ログイン履歴があるユーザーのみ
      .order('last_login_at', { ascending: false })
      .limit(10);

    if (error) {
      if (process.env.NODE_ENV === 'development') console.error('Error fetching candidates:', error);
      return [];
    }

    // データ変換処理を最適化
    return (candidates || []).map((candidate, index) => {
      // 年齢計算を最適化
      const age = candidate.birth_date 
        ? new Date().getFullYear() - new Date(candidate.birth_date).getFullYear()
        : null;

      // 最終ログイン時間の表示を改善
      const lastLogin = candidate.last_login_at 
        ? formatRelativeTime(new Date(candidate.last_login_at))
        : '未ログイン';

      // 実際の職歴・業界経験データを活用
      const experienceJobs = candidate.job_type_experience?.map(exp => exp.job_type_name) || 
                            candidate.desired_job_types || 
                            candidate.skills || 
                            [];

      const experienceIndustries = candidate.work_experience?.map(exp => exp.industry_name) || 
                                  candidate.desired_industries || 
                                  [];

      // 選考中企業の実データを反映
      const selectionCompanies = candidate.career_status_entries
        ?.filter(entry => entry.progress_status)
        .map(entry => ({
          company: entry.company_name || '企業名未設定',
          detail: Array.isArray(entry.industries) 
            ? entry.industries.join('、') 
            : '業界情報なし',
          jobTypes: [] // job_typesプロパティが存在しないため空配列にする
        })) || [{
          company: '選考状況未登録',
          detail: '選考詳細未登録',
          jobTypes: []
        }];

      // 実際の職歴データから構築
      const careerHistory = [
        {
          period: candidate.recent_job_company_name ? '現在' : '経歴情報未入力',
          company: candidate.current_company || candidate.recent_job_company_name || '企業名未設定',
          role: candidate.current_position || candidate.recent_job_department_position || '役職未設定',
        }
      ];

      // 思考ラベルのアルゴリズム実装
      let badgeType: 'change' | 'professional' | 'multiple' = 'change';
      let badgeText = 'キャリアチェンジ志向';

      // 直近の職種を取得
      const currentJobTypes = candidate.recent_job_types || [];
      
      // 選考中の求人の職種を取得
      const selectionJobTypes = new Set<string>();
      selectionCompanies.forEach(company => {
        if (company.jobTypes && Array.isArray(company.jobTypes)) {
          company.jobTypes.forEach((jobType: string | unknown) => {
            if (typeof jobType === 'string') {
              selectionJobTypes.add(jobType);
            }
          });
        }
      });

      // 希望職種を取得
      const desiredJobTypes = candidate.desired_job_types || [];

      // 多職種志向：選考中の求人の種類が3種類以上ある
      if (selectionJobTypes.size >= 3) {
        badgeType = 'multiple';
        badgeText = '多職種志向';
      }
      // 専門性追求志向：直近の在籍企業と同一職種の求人のみ選考中
      else if (
        currentJobTypes.length > 0 && 
        selectionJobTypes.size > 0 &&
        Array.from(selectionJobTypes).every(jobType => 
          currentJobTypes.some((currentJob: string | unknown) => 
            String(currentJob).toLowerCase() === String(jobType).toLowerCase()
          )
        )
      ) {
        badgeType = 'professional';
        badgeText = '専門性追求志向';
      }
      // キャリアチェンジ志向：直近の在籍企業と希望職種が違うものが含まれる
      else if (
        currentJobTypes.length > 0 &&
        desiredJobTypes.length > 0 &&
        desiredJobTypes.some((desiredJob: string | unknown) => 
          !currentJobTypes.some((currentJob: string | unknown) => 
            String(currentJob).toLowerCase() === String(desiredJob).toLowerCase()
          )
        )
      ) {
        badgeType = 'change';
        badgeText = 'キャリアチェンジ志向';
      }

      return {
        id: index + 1,
        isPickup: false,
        isHidden: false,
        isAttention: index % 3 === 0, // 一時的なロジック、将来的にはユーザー設定に基づく
        badgeType,
        badgeText,
        lastLogin,
        companyName: candidate.current_company || candidate.recent_job_company_name || '企業名未設定',
        department: candidate.recent_job_department_position || '部署名未設定',
        position: candidate.current_position || '役職未設定',
        location: candidate.prefecture || '未設定',
        age: age ? `${age}歳` : '年齢未設定',
        gender: candidate.gender === 'male' ? '男性' : 
                candidate.gender === 'female' ? '女性' : '未設定',
        salary: candidate.desired_salary || candidate.current_salary || candidate.current_income || '未設定',
        university: candidate.education?.[0]?.school_name || '未設定',
        degree: candidate.education?.[0]?.final_education || '未設定',
        experienceJobs: experienceJobs.slice(0, 3), // 表示用に最大3つまで
        experienceIndustries: experienceIndustries.slice(0, 3),
        careerHistory,
        selectionCompanies: selectionCompanies.slice(0, 3), // 表示用に最大3つまで
      };
    });
    } catch (error) {
      if (process.env.NODE_ENV === 'development') console.error('Error in getCandidatesData:', error);
      // エラー時も空配列を返して、ページ表示を継続
      return [];
    }
  },
  ['candidates-mypage'], // キャッシュキー
  {
    revalidate: 300, // 5分間キャッシュ
    tags: ['candidates', 'mypage']
  }
);

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

// 企業アカウント情報取得関数
async function getCompanyAccountData(companyUserId: string) {
  try {
    const supabase = await createClient();
    
    // company_usersから企業アカウントIDを取得し、company_accountsの情報を取得
    const { data: companyAccountData, error } = await supabase
      .from('company_users')
      .select(`
        company_account_id,
        company_accounts!company_account_id (
          id,
          company_name,
          plan,
          scout_limit,
          created_at
        )
      `)
      .eq('id', companyUserId)
      .single();

    if (error) {
      console.error('Error fetching company account data:', error);
      return null;
    }

    const account = companyAccountData?.company_accounts;
    if (!account) {
      console.error('Company account not found');
      return null;
    }

    // 次回更新日の計算（作成日から1ヶ月後）
    const createdAt = new Date(account.created_at);
    const nextUpdateDate = new Date(createdAt);
    nextUpdateDate.setMonth(nextUpdateDate.getMonth() + 1);

    return {
      plan: account.plan,
      scoutLimit: account.scout_limit,
      nextUpdateDate: nextUpdateDate.toLocaleDateString('ja-JP', {
        year: 'numeric',
        month: '2-digit',
        day: '2-digit'
      }).replace(/\//g, '/')
    };
  } catch (error) {
    console.error('Error in getCompanyAccountData:', error);
    return null;
  }
}

// キャッシュなしのメッセージデータ取得関数
async function getRecentMessagesUncached(companyUserId: string): Promise<Message[]> {
  try {
    const supabase = await createClient();
    
    // まず、企業ユーザーがアクセス権限を持つルームIDを取得
    const rooms = await getRooms(companyUserId, 'company');
    const accessibleRoomIds = rooms.map(room => room.id);
    
    if (accessibleRoomIds.length === 0) {
      if (process.env.NODE_ENV === 'development') console.log('No accessible rooms found for user:', companyUserId);
      return [];
    }
    
    // アクセス権限のあるルームの未読メッセージのみ取得
    const { data: messages, error } = await supabase
      .from('messages')
      .select(`
        id,
        content,
        sent_at,
        room_id,
        status,
        rooms!room_id (
          id,
          candidate_id,
          related_job_posting_id,
          candidates!candidate_id (
            first_name,
            last_name
          ),
          job_postings!related_job_posting_id (
            title
          ),
          company_groups!company_group_id (
            group_name,
            company_accounts!company_account_id (
              company_name
            )
          )
        )
      `)
      .eq('sender_type', 'CANDIDATE')
      .eq('status', 'SENT') 
      .in('room_id', accessibleRoomIds) 
      .order('sent_at', { ascending: false })
      .limit(3);

    if (error || !messages) {
      if (process.env.NODE_ENV === 'development') console.error('Error fetching messages:', error);
      return [];
    }

    if (process.env.NODE_ENV === 'development') console.log('Recent unread messages fetched:', {
      companyUserId,
      accessibleRoomsCount: accessibleRoomIds.length,
      unreadMessagesCount: messages.length
    });

    return messages.map((msg) => ({
      id: msg.id,
      date: new Date(msg.sent_at).toLocaleDateString('ja-JP', {
        year: 'numeric',
        month: '2-digit',
        day: '2-digit'
      }),
      group: (msg.rooms as { company_groups?: { group_name?: string } })?.company_groups?.group_name || '不明なグループ',
      user: `${(msg.rooms as { candidates?: { last_name?: string; first_name?: string } })?.candidates?.last_name || ''} ${(msg.rooms as { candidates?: { last_name?: string; first_name?: string } })?.candidates?.first_name || ''}`.trim() || '候補者',
      content: msg.content && msg.content.length > 50 ? msg.content.substring(0, 50) + '...' : msg.content || '',
      room_id: msg.room_id
    }));
  } catch (error) {
    if (process.env.NODE_ENV === 'development') console.error('Error in getRecentMessages:', error);
    return [];
  }
}

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

  const { companyUserId } = authResult.data;

  // cookiesを外部で取得
  const { cookies } = await import('next/headers');
  const cookieStore = await cookies();
  const cookiesData = cookieStore.getAll();
  const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!;
  const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!;

  // 基本データを並列取得（検索は後で並列処理）
  const [candidates, messages, notices, companyAccountData] = await Promise.all([
    getCandidatesData(supabaseUrl, supabaseAnonKey, cookiesData),
    getRecentMessagesUncached(companyUserId),
    getPublishedNotices(3, supabaseUrl, supabaseAnonKey, cookiesData), // 最新3件まで取得
    getCompanyAccountData(companyUserId)
  ]);

  // ユーザーのデフォルトグループIDを取得
  const { getUserDefaultGroupId } = await import('@/lib/actions/search-history');
  const defaultGroupResult = await getUserDefaultGroupId();
  console.log('[DEBUG] Default group result:', defaultGroupResult);
  
  // デバッグ: 全ての検索履歴を取得（グループフィルタなし）
  const allSearchHistoryResult = await getSearchHistory();
  console.log('[DEBUG] All search history (no group filter):', allSearchHistoryResult);
  if (allSearchHistoryResult.success) {
    console.log('[DEBUG] All search history items found:', allSearchHistoryResult.data.length);
    allSearchHistoryResult.data.forEach((item, index) => {
      console.log(`[DEBUG] All history item ${index}:`, {
        id: item.id,
        title: item.search_title,
        is_saved: item.is_saved,
        group_id: item.group_id,
        group_name: item.group_name
      });
    });
  }

  // 保存された検索条件を取得（is_saved=true、3件まで）
  const searchHistoryResult = await getSearchHistory();
  console.log('[DEBUG] Search history result (without group filter):', searchHistoryResult);
  console.log('[DEBUG] Search history data length:', searchHistoryResult.success ? searchHistoryResult.data.length : 0);
  // 取得された検索履歴の詳細をログ出力
  if (searchHistoryResult.success && searchHistoryResult.data.length > 0) {
    console.log('[DEBUG] Detailed search history items:');
    searchHistoryResult.data.forEach((item, index) => {
      console.log(`[DEBUG] Item ${index}:`, {
        id: item.id,
        title: item.search_title,
        is_saved: item.is_saved,
        is_saved_type: typeof item.is_saved,
        group_id: item.group_id,
        group_name: item.group_name,
        conditions: item.search_conditions
      });
    });
  } else {
    console.log('[DEBUG] No search history data available:', {
      success: searchHistoryResult.success,
      error: searchHistoryResult.success ? null : searchHistoryResult.error,
      dataLength: searchHistoryResult.success ? searchHistoryResult.data?.length : null
    });
  }
  
  // まず全レコードを表示してデバッグ（一時的）
  console.log('[DEBUG] 全検索履歴の詳細確認:');
  if (searchHistoryResult.success && searchHistoryResult.data.length > 0) {
    searchHistoryResult.data.forEach((item, index) => {
      console.log(`[DEBUG] 全件チェック ${index}:`, {
        id: item.id,
        title: item.search_title,
        is_saved: item.is_saved,
        is_saved_type: typeof item.is_saved,
        is_saved_string: String(item.is_saved),
        raw_value: JSON.stringify(item.is_saved)
      });
    });
  }

  const savedSearchConditions = searchHistoryResult.success 
    ? searchHistoryResult.data
        .filter(history => {
          const isSaved = history.is_saved;
          const passes = isSaved === true || 
                        isSaved === 'true' || 
                        isSaved === 'TRUE' ||
                        String(isSaved).toLowerCase() === 'true';
          console.log('[DEBUG] フィルタリング結果:', {
            id: history.id,
            title: history.search_title,
            is_saved: isSaved,
            passes_filter: passes
          });
          return passes;
        })
        .slice(0, 3) // 最大3件まで
    : [];
    
  console.log('[DEBUG] Saved search conditions count:', savedSearchConditions.length);
  console.log('[DEBUG] Saved search conditions:', savedSearchConditions.map(item => ({
    id: item.id,
    title: item.search_title,
    is_saved: item.is_saved
  })));
  console.log('[DEBUG] Candidates available:', candidates.length);
  
  // 保存された検索条件の詳細をログ出力
  savedSearchConditions.forEach((condition, index) => {
    console.log(`[DEBUG] Saved condition ${index}:`, {
      title: condition.search_title,
      group_name: condition.group_name,
      conditions: condition.search_conditions
    });
  });

  // おすすめ候補者データの並列生成
  const candidateSearchPromises = savedSearchConditions.map(async (searchHistory, index) => {
    return new Promise(resolve => {
      // 非同期で検索処理を実行
      setTimeout(() => {
        console.log(`[DEBUG] Processing search condition ${index}:`, {
          title: searchHistory.search_title,
          conditions: searchHistory.search_conditions,
          totalCandidates: candidates.length
        });
        
        const matchingCandidates = searchCandidatesWithMockData(searchHistory.search_conditions, candidates);
        console.log(`[DEBUG] Search condition "${searchHistory.search_title}" matched:`, matchingCandidates.length, 'candidates');
        
        if (matchingCandidates.length > 0) {
          console.log(`[DEBUG] First matching candidate for "${searchHistory.search_title}":`, {
            name: `${matchingCandidates[0].companyName} - ${matchingCandidates[0].position}`,
            location: matchingCandidates[0].location,
            age: matchingCandidates[0].age
          });
        }
        
        resolve({
          searchCondition: {
            id: searchHistory.id,
            groupName: searchHistory.group_name,
            title: searchHistory.search_title,
            conditions: searchHistory.search_conditions
          },
          candidates: matchingCandidates.slice(0, 3) // 3名まで表示
        });
      }, 0);
    });
  });

  // 検索処理を並列実行
  const recommendedSections = await Promise.all(candidateSearchPromises);
  console.log('[DEBUG] Final recommended sections count:', recommendedSections.length);
  
  // 各セクションの詳細をログ出力
  recommendedSections.forEach((section, index) => {
    console.log(`[DEBUG] Section ${index}:`, {
      title: section.searchCondition.title,
      groupName: section.searchCondition.groupName,
      candidateCount: section.candidates.length,
      candidateNames: section.candidates.map(c => `${c.companyName} - ${c.position}`)
    });
  });

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
            <NewMessageList messages={messages} />
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
            {/* おすすめ候補者セクション */}
            <div className="space-y-6">
              {recommendedSections.length > 0 ? (
                recommendedSections.map((section, index) => (
                  <RecommendedCandidatesSection
                    key={`recommended-section-${section.searchCondition.id}-${index}`}
                    searchCondition={section.searchCondition}
                    candidates={section.candidates}
                  />
                ))
              ) : (
                <div className="bg-[#EFEFEF] p-6 rounded-[24px] text-center">
                  <p
                    className="text-[#666] text-[16px]"
                    style={{ 
                      fontFamily: 'Noto Sans JP, sans-serif',
                      letterSpacing: '0.04em',
                      lineHeight: 1.6
                    }}
                  >
                    現在おすすめの候補者はいません。
                  </p>
                </div>
              )}
            </div>
          </div>
          {/* 右カラム（サブ） */}
          <CompanyTaskSidebar className="md:flex-none" showTodoAndNews={true} notices={notices} companyAccountData={companyAccountData} />
        </div>
      </main>
    </div>
  );
}
