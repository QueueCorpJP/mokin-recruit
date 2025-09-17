'use client';

import React, { useEffect, useMemo, useState } from 'react';
import { createClient } from '@/lib/supabase/client';
import { RecommendedCandidatesSection } from '@/components/company/RecommendedCandidatesSection';
import type { CandidateData } from '@/components/company/CandidateCard';
import { searchCandidatesWithMockData } from '@/lib/utils/candidateSearch';

interface Props {
  companyGroupId?: string;
  jobOptions?: Array<{ value: string; label: string; groupId?: string }>;
  initialSavedSearches?: Array<{
    id: string;
    group_name: string;
    search_title: string;
    search_conditions: any;
  }>;
}

// search/result 相当の緩さに合わせて、保存済み検索条件を検索関数の期待キーへ正規化
function normalizeConditions(raw: any): any {
  if (!raw || typeof raw !== 'object') return {};

  const normalized: any = { ...raw };

  // 複数形・別名を candidateSearch の期待キーへ寄せる
  if (raw.desired_job_types && !raw.job_types)
    normalized.job_types = raw.desired_job_types;
  if (raw.desired_industries && !raw.industries)
    normalized.industries = raw.desired_industries;
  if (raw.desired_locations && !raw.locations)
    normalized.locations = raw.desired_locations;
  if (raw.education_levels && !raw.education_level)
    normalized.education_level = raw.education_levels;
  if (raw.language_skills && !raw.languages)
    normalized.languages = raw.language_skills;

  // 年齢・年収などの数値は安全に数値化（不正なら未設定扱い）
  const toNum = (v: any) =>
    typeof v === 'string'
      ? parseInt(v, 10)
      : typeof v === 'number'
        ? v
        : undefined;
  const ageMin = toNum(raw.age_min);
  const ageMax = toNum(raw.age_max);
  const salaryMin = toNum(raw.salary_min);
  const salaryMax = toNum(raw.salary_max);
  if (ageMin !== undefined) normalized.age_min = ageMin;
  if (ageMax !== undefined) normalized.age_max = ageMax;
  if (salaryMin !== undefined) normalized.salary_min = salaryMin;
  if (salaryMax !== undefined) normalized.salary_max = salaryMax;

  return normalized;
}

export function SavedSearchRecommendationsClient({
  companyGroupId,
  jobOptions = [],
  initialSavedSearches = [],
}: Props) {
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [savedSearches, setSavedSearches] =
    useState<any[]>(initialSavedSearches);
  const [candidates, setCandidates] = useState<CandidateData[]>([]);

  useEffect(() => {
    let mounted = true;
    const supabase = createClient();

    const fetchAll = async () => {
      try {
        setLoading(true);

        // 1) 保存済み検索履歴（上位3）: サーバーから初期値がある場合はそれを優先
        if (!initialSavedSearches.length) {
          const { data: histories, error: shError } = await supabase
            .from('search_history')
            .select('*')
            .order('searched_at', { ascending: false })
            .limit(20);

          if (shError) {
            console.error(
              '[SavedSearchRecommendationsClient] search_history error:',
              shError
            );
          }

          const saved = (histories || [])
            .filter((h: any) => {
              const v = h.is_saved;
              return (
                v === true ||
                v === 'true' ||
                v === 'TRUE' ||
                String(v).toLowerCase() === 'true'
              );
            })
            .slice(0, 3);

          if (mounted) setSavedSearches(saved);
        }

        // 2) 候補者（表示に必要なフィールドのみ）
        const { data: rows, error: cError } = await supabase
          .from('candidates')
          .select(
            `
            id,
            last_name,
            first_name,
            current_company,
            current_position,
            prefecture,
            gender,
            birth_date,
            desired_salary,
            skills,
            experience_years,
            desired_industries,
            desired_job_types,
            last_login_at
          `
          )
          .eq('status', 'ACTIVE')
          .order('last_login_at', { ascending: false })
          .limit(50);

        if (cError) {
          console.error(
            '[SavedSearchRecommendationsClient] candidates error:',
            cError
          );
          if (mounted) setCandidates([]);
        } else {
          const mapped: CandidateData[] = (rows || []).map(
            (candidate: any, index: number) => {
              const age = candidate.birth_date
                ? new Date().getFullYear() -
                  new Date(candidate.birth_date).getFullYear()
                : null;
              const lastLogin = candidate.last_login_at
                ? new Date(candidate.last_login_at).toLocaleDateString(
                    'ja-JP',
                    { year: 'numeric', month: 'numeric', day: 'numeric' }
                  )
                : '未ログイン';

              return {
                id: index + 1,
                candidateId: candidate.id,
                isPickup: false,
                isHidden: false,
                isAttention: index % 3 === 0,
                lastLogin,
                companyName: candidate.current_company || '企業名未設定',
                department: candidate.current_position || '部署名未設定',
                position: candidate.current_position || '役職未設定',
                location: candidate.prefecture || '未設定',
                age: age ? `${age}歳` : '年齢未設定',
                gender:
                  candidate.gender === 'male'
                    ? '男性'
                    : candidate.gender === 'female'
                      ? '女性'
                      : '未設定',
                salary: candidate.desired_salary || '未設定',
                university: '未設定',
                degree: '未設定',
                experienceJobs: (
                  candidate.desired_job_types ||
                  candidate.skills ||
                  []
                ).slice(0, 3),
                experienceIndustries: (
                  candidate.desired_industries || []
                ).slice(0, 3),
                careerHistory: [
                  {
                    period: '現在',
                    company: candidate.current_company || '企業名未設定',
                    role: candidate.current_position || '役職未設定',
                  },
                ],
                selectionCompanies: [],
              } as CandidateData;
            }
          );

          if (mounted) setCandidates(mapped);
        }
      } catch (e) {
        console.error(
          '[SavedSearchRecommendationsClient] unexpected error:',
          e
        );
        if (mounted) setError('データ取得に失敗しました');
      } finally {
        if (mounted) setLoading(false);
      }
    };

    fetchAll();
    return () => {
      mounted = false;
    };
  }, [initialSavedSearches.length]);

  // クライアント側でマッチングして先出（フック順を安定させるため、条件分岐より前に配置）
  const sections = useMemo(() => {
    return savedSearches.map(history => {
      const conditions = normalizeConditions(history.search_conditions || {});
      let matched = searchCandidatesWithMockData(conditions, candidates).slice(
        0,
        3
      );
      if (!matched.length) {
        matched = candidates.slice(0, 3);
      }
      return {
        id: history.id,
        groupName: history.group_name,
        title: history.search_title,
        candidates: matched,
      };
    });
  }, [savedSearches, candidates]);

  // ローディング時のスケルトン
  if (loading) {
    return (
      <div className='space-y-6'>
        {[0, 1].map(i => (
          <div key={i} className='bg-[#EFEFEF] p-6 rounded-[24px]'>
            <div className='flex gap-6 items-start mb-6'>
              <div className='w-40 h-8 bg-[#d9ead3] rounded-[8px] animate-pulse' />
              <div className='flex-1 h-6 bg-gray-200 rounded animate-pulse' />
            </div>
            <div className='space-y-4'>
              {[0, 1, 2].map(j => (
                <div key={j} className='bg-white p-6 rounded-[10px] shadow-sm'>
                  <div className='h-5 bg-gray-200 rounded w-1/3 mb-2 animate-pulse' />
                  <div className='h-4 bg-gray-100 rounded w-2/3 animate-pulse' />
                </div>
              ))}
            </div>
          </div>
        ))}
      </div>
    );
  }

  if (!savedSearches.length) {
    return (
      <div className='bg-[#EFEFEF] p-6 rounded-[24px] text-center'>
        <p
          className='text-[#666] text-[16px]'
          style={{
            fontFamily: 'Noto Sans JP, sans-serif',
            letterSpacing: '0.04em',
            lineHeight: 1.6,
          }}
        >
          現在おすすめの候補者はいません。
        </p>
      </div>
    );
  }

  return (
    <div className='space-y-6'>
      {sections.map(sec => (
        <RecommendedCandidatesSection
          key={sec.id}
          searchCondition={{
            id: sec.id,
            groupName: sec.groupName,
            title: sec.title,
            conditions:
              savedSearches.find(s => s.id === sec.id)?.search_conditions || {},
          }}
          candidates={sec.candidates}
          companyGroupId={companyGroupId}
          jobOptions={jobOptions}
        />
      ))}
    </div>
  );
}

export default SavedSearchRecommendationsClient;
