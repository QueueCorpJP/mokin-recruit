import React from 'react';
import { SectionHeading } from '@/components/ui/SectionHeading';
import { Button } from '@/components/ui/button';
import { NewMessageList } from './NewMessageList';
import { Message } from './NewMessageItem';
import { CandidateCard, CandidateData } from '@/components/company/CandidateCard';
import { CompanyTaskSidebar } from '@/components/company/CompanyTaskSidebar';
import { CandidateListClient } from './CandidateListClient';
import { RecommendedCandidatesSection } from '@/components/company/RecommendedCandidatesSection';
import { createClient } from '@/lib/supabase/server';
import { unstable_cache } from 'next/cache';
import { searchCandidatesWithMockData } from '@/lib/utils/candidateSearch';
import searchConditionsData from '@/data/mockSearchConditions.json';
import { getPublishedNotices } from '@/lib/utils/noticeHelpers';

// キャッシュ付きの候補者データ取得関数
const getCandidatesData = unstable_cache(
  async (): Promise<CandidateData[]> => {
    try {
      const supabase = await createClient();
    
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
      console.error('Error fetching candidates:', error);
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
        ?.filter(entry => entry.progress_status && !entry.is_private)
        .map(entry => ({
          company: entry.company_name || '企業名未設定',
          detail: Array.isArray(entry.industries) 
            ? entry.industries.join('、') 
            : '業界情報なし'
        })) || [{
          company: '選考状況未登録',
          detail: '選考詳細未登録'
        }];

      // 実際の職歴データから構築
      const careerHistory = [
        {
          period: candidate.recent_job_company_name ? '現在' : '経歴情報未入力',
          company: candidate.current_company || candidate.recent_job_company_name || '企業名未設定',
          role: candidate.current_position || candidate.recent_job_department_position || '役職未設定',
        }
      ];

      return {
        id: index + 1,
        isPickup: false,
        isHidden: false,
        isAttention: index % 3 === 0, // 一時的なロジック、将来的にはユーザー設定に基づく
        badgeType: experienceJobs.length > 2 ? 'multiple' as const :
                  candidate.recent_job_types && candidate.recent_job_types.length > 0 
                    ? 'change' as const 
                    : candidate.experience_years && candidate.experience_years > 1
                      ? 'professional' as const
                      : 'change' as const, // フォールバック値として全候補者にタグを表示
        badgeText: experienceJobs.length > 2 ? '複数職種経験' :
                  candidate.recent_job_types && candidate.recent_job_types.length > 0 
                    ? 'キャリアチェンジ志向'
                    : candidate.experience_years && candidate.experience_years > 1
                      ? 'エキスパート'
                      : 'キャリアチェンジ志向', // フォールバック値
        lastLogin,
        companyName: candidate.current_company || candidate.recent_job_company_name || '企業名未登録',
        department: candidate.recent_job_department_position || '部署名未登録',
        position: candidate.current_position || '役職未登録',
        location: candidate.prefecture || '未設定',
        age: age ? `${age}歳` : '年齢未設定',
        gender: candidate.gender === 'male' ? '男性' : 
                candidate.gender === 'female' ? '女性' : '未設定',
        salary: candidate.desired_salary || candidate.current_income || '未設定',
        university: candidate.education?.[0]?.school_name || '未設定',
        degree: candidate.education?.[0]?.final_education || '未設定',
        experienceJobs: experienceJobs.slice(0, 3), // 表示用に最大3つまで
        experienceIndustries: experienceIndustries.slice(0, 3),
        careerHistory,
        selectionCompanies: selectionCompanies.slice(0, 3), // 表示用に最大3つまで
      };
    });
    } catch (error) {
      console.error('Error in getCandidatesData:', error);
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
  const diffMins = Math.floor(diffMs / (1000 * 60));
  const diffHours = Math.floor(diffMs / (1000 * 60 * 60));
  const diffDays = Math.floor(diffMs / (1000 * 60 * 60 * 24));

  if (diffMins < 60) {
    return diffMins <= 1 ? '1分前' : `${diffMins}分前`;
  } else if (diffHours < 24) {
    return `${diffHours}時間前`;
  } else if (diffDays < 7) {
    return `${diffDays}日前`;
  } else {
    return date.toLocaleDateString('ja-JP', {
      month: 'numeric',
      day: 'numeric'
    });
  }
}

// キャッシュ付きのメッセージデータ取得関数
const getRecentMessages = unstable_cache(
  async (): Promise<Message[]> => {
    try {
      const supabase = await createClient();
    
    // 効率的なメッセージ取得クエリ - 必要なデータのみを取得し関連テーブルを結合
    const { data: messages, error } = await supabase
      .from('messages')
      .select(`
        id,
        subject,
        content,
        sent_at,
        message_type,
        status,
        sender_company_group_id,
        company_groups!inner(
          group_name,
          company_account_id,
          company_accounts(
            company_name
          )
        )
      `)
      .eq('status', 'SENT') // 送信済みメッセージのみ
      .not('subject', 'is', null) // 件名があるメッセージを優先
      .order('sent_at', { ascending: false })
      .limit(3);

    if (error) {
      console.error('Error fetching messages:', error);
      return [];
    }

    return (messages || []).map(message => ({
      id: message.id,
      date: new Date(message.sent_at).toLocaleDateString('ja-JP', {
        year: 'numeric',
        month: 'numeric',
        day: 'numeric'
      }),
      group: message.company_groups?.group_name || 'グループ名未設定',
      user: message.company_groups?.company_accounts?.company_name || 'システム',
      content: message.subject || 
               (message.content?.length > 50 
                 ? message.content.substring(0, 50) + '...' 
                 : message.content) || 
               'メッセージ内容なし'
    }));
    } catch (error) {
      console.error('Error in getRecentMessages:', error);
      // エラー時も空配列を返してページ表示を継続
      return [];
    }
  },
  ['messages-mypage'], // キャッシュキー
  {
    revalidate: 60, // 1分間キャッシュ（メッセージは頻繁に更新される）
    tags: ['messages', 'mypage']
  }
);

export default async function CompanyMypage() {
  const [candidates, messages, notices] = await Promise.all([
    getCandidatesData(),
    getRecentMessages(),
    getPublishedNotices(3) // 最新3件まで取得
  ]);

  // おすすめ候補者データの生成
  const recommendedSections = searchConditionsData.map(condition => {
    const matchingCandidates = searchCandidatesWithMockData(condition.conditions, candidates);
    return {
      searchCondition: condition,
      candidates: matchingCandidates.slice(0, 3) // 3名まで表示
    };
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
              <Button
                variant='green-outline'
                size='lg'
                style={{
                  paddingLeft: 40,
                  paddingRight: 40,
                  height: 60,
                  borderRadius: '999px',
                }}
              >
                メッセージ一覧
              </Button>
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
                    style={{ display: 'block' }}
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
                      className='w-4 h-4 hover:opacity-70 filter grayscale' 
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
              {recommendedSections.map((section, index) => (
                <RecommendedCandidatesSection
                  key={`recommended-section-${section.searchCondition.id}-${index}`}
                  searchCondition={section.searchCondition}
                  candidates={section.candidates}
                />
              ))}
            </div>
          </div>
          {/* 右カラム（サブ） */}
          <CompanyTaskSidebar className="md:flex-none" showTodoAndNews={true} notices={notices} />
        </div>
      </main>
    </div>
  );
}
