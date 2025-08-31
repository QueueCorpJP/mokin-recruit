'use client';

import React from 'react';
import Link from 'next/link';
import { CandidateCard, CandidateData } from '@/components/company/CandidateCard';

interface SearchCondition {
  id: number;
  groupName: string;
  title: string;
  conditions: {
    job_types?: string[];
    industries?: string[];
    locations?: string[];
    age_min?: number;
    age_max?: number;
    salary_min?: number;
    salary_max?: number;
    experience_years_min?: number;
    skills?: string[];
    languages?: string[];
    career_change?: boolean;
    professional_focus?: boolean;
    education_level?: string[];
  };
}

interface RecommendedCandidatesSectionProps {
  searchCondition: SearchCondition;
  candidates: CandidateData[];
}

export function RecommendedCandidatesSection({
  searchCondition,
  candidates,
}: RecommendedCandidatesSectionProps) {
  // 候補者を最大3名まで表示
  const displayCandidates = candidates.slice(0, 3);

  // 検索条件をURLSearchParamsに変換
  const createSearchParams = () => {
    const params = new URLSearchParams();
    
    if (searchCondition.conditions.job_types?.length) {
      params.set('job_types', searchCondition.conditions.job_types.join(','));
    }
    if (searchCondition.conditions.industries?.length) {
      params.set('industries', searchCondition.conditions.industries.join(','));
    }
    if (searchCondition.conditions.locations?.length) {
      params.set('locations', searchCondition.conditions.locations.join(','));
    }
    if (searchCondition.conditions.age_min) {
      params.set('age_min', searchCondition.conditions.age_min.toString());
    }
    if (searchCondition.conditions.age_max) {
      params.set('age_max', searchCondition.conditions.age_max.toString());
    }
    if (searchCondition.conditions.salary_min) {
      params.set('salary_min', searchCondition.conditions.salary_min.toString());
    }
    if (searchCondition.conditions.salary_max) {
      params.set('salary_max', searchCondition.conditions.salary_max.toString());
    }
    if (searchCondition.conditions.experience_years_min) {
      params.set('experience_years_min', searchCondition.conditions.experience_years_min.toString());
    }
    if (searchCondition.conditions.skills?.length) {
      params.set('skills', searchCondition.conditions.skills.join(','));
    }
    if (searchCondition.conditions.languages?.length) {
      params.set('languages', searchCondition.conditions.languages.join(','));
    }
    if (searchCondition.conditions.career_change) {
      params.set('career_change', 'true');
    }
    if (searchCondition.conditions.professional_focus) {
      params.set('professional_focus', 'true');
    }
    if (searchCondition.conditions.education_level?.length) {
      params.set('education_level', searchCondition.conditions.education_level.join(','));
    }
    
    return params.toString();
  };

  const searchUrl = `/company/search/result?${createSearchParams()}`;

  return (
    <div className="bg-[#EFEFEF] p-6 rounded-[24px]">
      {/* セクションヘッダー */}
      <div className="flex gap-6 items-start mb-6">
        {/* グループ名バッジ */}
        <div 
          className="bg-gradient-to-l from-[#86c36a] to-[#65bdac] px-5 py-2 h-8 rounded-[8px] flex items-center justify-center shrink-0 w-40"
        >
          <span
            className="text-white text-[14px] font-bold tracking-[1.4px] truncate"
            style={{ fontFamily: 'Noto Sans JP, sans-serif' }}
          >
            {searchCondition.groupName}
          </span>
        </div>
        
        {/* 検索条件タイトル */}
        <h3
          className="text-[#0f9058] text-[16px] font-bold tracking-[1.6px] underline decoration-solid flex-1 truncate"
          style={{ 
            fontFamily: 'Noto Sans JP, sans-serif',
            textUnderlinePosition: 'from-font'
          }}
        >
          {searchCondition.title}
        </h3>
      </div>

      {/* 候補者リスト */}
      <div className="space-y-6">
        {displayCandidates.map((candidate, index) => (
          <CandidateCard
            key={`recommended-${searchCondition.id}-${candidate.id}-${index}`}
            candidate={candidate}
            showActions={false}
          />
        ))}
      </div>

      {/* もっと見るボタン */}
      <Link href={searchUrl} className="block mt-6">
        <div 
          className="bg-[#0f9058] hover:bg-[#0d7a4a] transition-colors duration-200 h-[58px] rounded-[10px] shadow-[0px_0px_20px_0px_rgba(0,0,0,0.05)] flex items-center justify-between px-6 py-[15px] cursor-pointer"
        >
          <span
            className="text-white text-[16px] font-bold tracking-[1.6px] flex-1"
            style={{ 
              fontFamily: 'Noto Sans JP, sans-serif',
              lineHeight: 2
            }}
          >
            もっと見る
          </span>
          <div className="w-3 h-3 flex items-center justify-center">
            <svg
              width="12"
              height="12"
              viewBox="0 0 12 12"
              fill="none"
              xmlns="http://www.w3.org/2000/svg"
            >
              <path
                d="M4.5 2.25L8.25 6L4.5 9.75"
                stroke="white"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
              />
            </svg>
          </div>
        </div>
      </Link>
    </div>
  );
}