'use client';

import React, { useMemo, useState } from 'react';
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
  initialCandidates?: any[];
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
  initialCandidates = [],
}: Props) {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [savedSearches] = useState<any[]>(initialSavedSearches);

  // Server-side candidates を CandidateData 形式に変換
  const candidates = useMemo(() => {
    console.log(
      '[SavedSearchRecommendationsClient] Processing server candidates:',
      {
        initialCandidatesCount: initialCandidates?.length || 0,
        sampleCandidate: initialCandidates?.[0],
      }
    );

    return (initialCandidates || []).map((candidate: any, index: number) => {
      const age = candidate.birth_date
        ? new Date().getFullYear() -
          new Date(candidate.birth_date).getFullYear()
        : null;
      const lastLogin = candidate.last_login_at
        ? new Date(candidate.last_login_at).toLocaleDateString('ja-JP', {
            year: 'numeric',
            month: 'numeric',
            day: 'numeric',
          })
        : '未ログイン';

      return {
        id: index + 1,
        candidateId: candidate.candidateId || candidate.id,
        isPickup: false,
        isHidden: false,
        isAttention: index % 3 === 0,
        lastLogin,
        companyName:
          candidate.companyName || candidate.current_company || '企業名未設定',
        department:
          candidate.position || candidate.current_position || '部署名未設定',
        position:
          candidate.position || candidate.current_position || '役職未設定',
        location: candidate.location || candidate.prefecture || '未設定',
        age: age ? `${age}歳` : '年齢未設定',
        gender:
          candidate.gender === 'male'
            ? '男性'
            : candidate.gender === 'female'
              ? '女性'
              : '未設定',
        salary: candidate.salary || candidate.desired_salary || '未設定',
        university: '未設定',
        degree: '未設定',
        experienceJobs: (
          candidate.experienceJobs ||
          candidate.desired_job_types ||
          candidate.skills ||
          []
        ).slice(0, 3),
        experienceIndustries: (
          candidate.experienceIndustries ||
          candidate.desired_industries ||
          []
        ).slice(0, 3),
        careerHistory: [
          {
            period: '現在',
            company:
              candidate.companyName ||
              candidate.current_company ||
              '企業名未設定',
            role:
              candidate.position || candidate.current_position || '役職未設定',
          },
        ],
        selectionCompanies: [],
      } as CandidateData;
    });
  }, [initialCandidates]);

  // クライアント側でマッチングして先出（フック順を安定させるため、条件分岐より前に配置）
  // 条件一つに対してグループ一つ：グループ名で重複除去
  const sections = useMemo(() => {
    const uniqueByGroup = new Map<string, any>();

    // グループ名で重複除去（最初に見つかったもののみ保持）
    savedSearches.forEach(history => {
      if (!uniqueByGroup.has(history.group_name)) {
        uniqueByGroup.set(history.group_name, history);
      }
    });

    return Array.from(uniqueByGroup.values()).map(history => {
      const conditions = normalizeConditions(history.search_conditions || {});
      console.log(
        `[おすすめ候補者] グループ: ${history.group_name}, 検索条件:`,
        conditions
      );

      let matched = searchCandidatesWithMockData(conditions, candidates);
      console.log(`[おすすめ候補者] 条件マッチ結果: ${matched.length}件`);

      // 条件にマッチした候補者を優先し、足りない場合は最新ログイン順で補填
      if (matched.length < 3) {
        const matchedIds = new Set(matched.map(c => c.candidateId));
        const additional = candidates
          .filter(c => !matchedIds.has(c.candidateId))
          .slice(0, 3 - matched.length);
        matched = [...matched, ...additional];
      }

      return {
        id: history.id,
        groupName: history.group_name,
        title: history.search_title,
        candidates: matched.slice(0, 3),
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
