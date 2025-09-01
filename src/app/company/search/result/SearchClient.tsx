'use client';

import React, { useState, useEffect } from 'react';
import { useSearchParams } from 'next/navigation';
import { Checkbox } from '@/components/ui/checkbox';
import { SelectInput } from '@/components/ui/select-input';
import { Button } from '@/components/ui/button';
import JobTypeSelectModal from '@/components/career-status/JobTypeSelectModal';
import IndustrySelectModal from '@/components/career-status/IndustrySelectModal';
import WorkLocationSelectModal from '@/components/career-status/WorkLocationSelectModal';
import WorkStyleSelectModal from '@/components/career-status/WorkStyleSelectModal';
import { CandidateCard } from '@/components/company/CandidateCard';
import { filterCandidatesByConditions } from '@/lib/utils/candidateSearch';
import { createClient } from '@/lib/supabase/client';
import type { JobType } from '@/constants/job-type-data';
import type { Industry } from '@/constants/industry-data';
import type { CandidateData } from '@/components/company/CandidateCard';

// モックデータ
const mockCandidates = [
  {
    id: 1,
    isPickup: false,
    isHidden: false,
    isAttention: true,
    badgeType: 'change' as const,
    badgeText: 'キャリアチェンジ志向',
    lastLogin: '1時間前',
    companyName: '直近企業名テキスト直近企業名テキスト',
    department: '部署名テキスト部署名テキスト部署名テキスト',
    position: '役職名テキスト役職名テキスト役職名テキスト',
    location: '東京',
    age: '28歳',
    gender: '男性',
    salary: '500〜600万円',
    university: '青山大学',
    degree: '大学卒',
    language: '英語',
    languageLevel: 'ネイティブ',
    experienceJobs: ['職種テキスト', '職種テキスト', '職種テキスト'],
    experienceIndustries: ['業種テキスト', '業種テキスト', '業種テキスト'],
    careerHistory: [
      {
        period: 'yyyy/mm〜現在',
        company: '企業名テキスト企業名テキスト',
        role: '役職名テキスト役職名テキスト',
      },
      {
        period: 'yyyy/mm〜現在',
        company: '企業名テキスト企業名テキスト',
        role: '役職名テキスト役職名テキスト',
      },
      {
        period: 'yyyy/mm〜現在',
        company: '企業名テキスト企業名テキスト',
        role: '役職名テキスト役職名テキスト',
      },
    ],
    selectionCompanies: [
      {
        company: '企業名テキスト企業名テキスト',
        detail: '職種テキスト、職種テキスト、職種テキスト職種テキスト',
      },
      {
        company: '企業名テキスト企業名テキスト',
        detail: '職種テキスト、職種テキスト、職種テキスト職種テキスト',
      },
      {
        company: '企業名テキスト企業名テキスト',
        detail: '職種テキスト、職種テキスト、職種テキスト職種テキスト',
      },
    ],
  },
  {
    id: 2,
    isPickup: true,
    isHidden: false,
    isAttention: true,
    badgeType: 'professional' as const,
    badgeText: '専門性追求志向',
    lastLogin: '1時間前',
    companyName: '直近企業名テキスト直近企業名テキスト',
    department: '部署名テキスト部署名テキスト部署名テキスト',
    position: '役職名テキスト役職名テキスト役職名テキスト',
    location: '東京',
    age: '28歳',
    gender: '男性',
    salary: '500〜600万円',
    university: '青山大学',
    degree: '大学卒',
    language: '英語',
    languageLevel: 'ネイティブ',
    experienceJobs: ['職種テキスト', '職種テキスト', '職種テキスト'],
    experienceIndustries: ['業種テキスト', '業種テキスト', '業種テキスト'],
    careerHistory: [
      {
        period: 'yyyy/mm〜現在',
        company: '企業名テキスト企業名テキスト',
        role: '役職名テキスト役職名テキスト',
      },
      {
        period: 'yyyy/mm〜現在',
        company: '企業名テキスト企業名テキスト',
        role: '役職名テキスト役職名テキスト',
      },
      {
        period: 'yyyy/mm〜現在',
        company: '企業名テキスト企業名テキスト',
        role: '役職名テキスト役職名テキスト',
      },
    ],
    selectionCompanies: [
      {
        company: '企業名テキスト企業名テキスト',
        detail: '職種テキスト、職種テキスト、職種テキスト職種テキスト',
      },
      {
        company: '企業名テキスト企業名テキスト',
        detail: '職種テキスト、職種テキスト、職種テキスト職種テキスト',
      },
      {
        company: '企業名テキスト企業名テキスト',
        detail: '職種テキスト、職種テキスト、職種テキスト職種テキスト',
      },
    ],
  },
  {
    id: 3,
    isPickup: false,
    isHidden: true,
    isAttention: true,
    badgeType: 'multiple' as const,
    badgeText: '多職種志向',
    lastLogin: '1時間前',
    companyName: '直近企業名テキスト直近企業名テキスト',
    department: '部署名テキスト部署名テキスト部署名テキスト',
    position: '役職名テキスト役職名テキスト役職名テキスト',
    location: '東京',
    age: '28歳',
    gender: '男性',
    salary: '500〜600万円',
    university: '青山大学',
    degree: '大学卒',
    language: '英語',
    languageLevel: 'ネイティブ',
    experienceJobs: ['職種テキスト', '職種テキスト', '職種テキスト'],
    experienceIndustries: ['業種テキスト', '業種テキスト', '業種テキスト'],
    careerHistory: [
      {
        period: 'yyyy/mm〜現在',
        company: '企業名テキスト企業名テキスト',
        role: '役職名テキスト役職名テキスト',
      },
      {
        period: 'yyyy/mm〜現在',
        company: '企業名テキスト企業名テキスト',
        role: '役職名テキスト役職名テキスト',
      },
      {
        period: 'yyyy/mm〜現在',
        company: '企業名テキスト企業名テキスト',
        role: '役職名テキスト役職名テキスト',
      },
    ],
    selectionCompanies: [
      {
        company: '企業名テキスト企業名テキスト',
        detail: '職種テキスト、職種テキスト、職種テキスト職種テキスト',
      },
      {
        company: '企業名テキスト企業名テキスト',
        detail: '職種テキスト、職種テキスト、職種テキスト職種テキスト',
      },
      {
        company: '企業名テキスト企業名テキスト',
        detail: '職種テキスト、職種テキスト、職種テキスト職種テキスト',
      },
    ],
  },
];

type SortType = 'featured' | 'newest' | 'updated' | 'lastLogin';

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

// 候補者データを取得する関数
async function getCandidatesFromDatabase(): Promise<CandidateData[]> {
  try {
    const supabase = createClient();
    
    const { data: candidates, error } = await supabase
      .from('candidates')
      .select(`
        id,
        last_name,
        first_name,
        current_company,
        current_position,
        prefecture,
        birth_date,
        gender,
        current_income,
        recent_job_company_name,
        recent_job_department_position,
        recent_job_types,
        desired_job_types,
        last_login_at,
        education!left(
          final_education,
          school_name,
          department,
          graduation_year,
          graduation_month
        ),
        skills!left(
          english_level,
          qualifications,
          skills_list
        ),
        work_experience!left(
          industry_id,
          industry_name,
          experience_years
        ),
        job_type_experience!left(
          job_type_id,
          job_type_name,
          experience_years
        ),
        career_status_entries!left(
          company_name,
          industries,
          job_types,
          progress_status,
          is_private
        )
      `);

    if (error) {
      console.error('Supabase error:', error);
      return [];
    }

    console.log('Raw candidates from DB:', candidates?.length || 0);
    console.log('First raw candidate:', candidates?.[0]);

    return candidates?.map((candidate: any): CandidateData => {
      // 最終ログイン時間の表示
      const lastLogin = candidate.last_login_at 
        ? formatRelativeTime(new Date(candidate.last_login_at))
        : '未ログイン';

      // 選考中企業の実データを反映
      const selectionCompanies = candidate.career_status_entries
        ?.filter((entry: any) => entry.progress_status && !entry.is_private)
        .map((entry: any) => ({
          company: entry.company_name || '企業名未設定',
          detail: Array.isArray(entry.industries) 
            ? entry.industries.join('、') 
            : '業界情報なし',
          jobTypes: entry.job_types || []
        })) || [];

      // 思考ラベルのアルゴリズム実装
      let badgeType: 'change' | 'professional' | 'multiple' = 'change';
      let badgeText = 'キャリアチェンジ志向';

      // 直近の職種を取得
      const currentJobTypes = candidate.recent_job_types || [];
      
      // 選考中の求人の職種を取得
      const selectionJobTypes = new Set<string>();
      selectionCompanies.forEach((company: any) => {
        if (company.jobTypes && Array.isArray(company.jobTypes)) {
          company.jobTypes.forEach((jobType: string) => selectionJobTypes.add(jobType));
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
          currentJobTypes.some((currentJob: string) => 
            currentJob.toLowerCase() === jobType.toLowerCase()
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
        desiredJobTypes.some((desiredJob: string) => 
          !currentJobTypes.some((currentJob: string) => 
            currentJob.toLowerCase() === desiredJob.toLowerCase()
          )
        )
      ) {
        badgeType = 'change';
        badgeText = 'キャリアチェンジ志向';
      }

      return {
        id: candidate.id,
        isPickup: false,
        isHidden: false,
        isAttention: Math.random() > 0.5,
        badgeType,
        badgeText,
        lastLogin,
        companyName: candidate.recent_job_company_name || candidate.current_company || '企業名未設定',
        department: candidate.recent_job_department_position || '部署名未設定',
        position: candidate.current_position || '役職名未設定',
        location: candidate.prefecture || '未設定',
        age: candidate.birth_date ? `${new Date().getFullYear() - new Date(candidate.birth_date).getFullYear()}歳` : '年齢未設定',
        gender: candidate.gender === 'male' ? '男性' : candidate.gender === 'female' ? '女性' : '未設定',
        salary: candidate.current_income ? `${candidate.current_income}万円` : '年収未設定',
        university: candidate.education?.school_name || '学校名未設定',
        degree: candidate.education?.final_education || '学歴未設定',
        language: candidate.skills?.english_level !== 'none' ? '英語' : '言語スキルなし',
        languageLevel: candidate.skills?.english_level || 'なし',
        experienceJobs: candidate.job_type_experience?.map((exp: any) => exp.job_type_name) || ['職種未設定'],
        experienceIndustries: candidate.work_experience?.map((exp: any) => exp.industry_name) || ['業界未設定'],
        careerHistory: [],
        selectionCompanies: selectionCompanies.slice(0, 3) // 表示用に最大3つまで
      };
    }) || [];
  } catch (error) {
    console.error('Database error:', error);
    return [];
  }
}

export default function SearchClient() {
  const searchParams = useSearchParams();
  const [isSearchBoxOpen, setIsSearchBoxOpen] = useState(false);
  const [selectedSort, setSelectedSort] = useState<SortType>('featured');
  const [candidates, setCandidates] = useState<CandidateData[]>([]);
  const [allCandidates, setAllCandidates] = useState<CandidateData[]>([]);
  const [loading, setLoading] = useState(true);
  const [filters, setFilters] = useState({
    pickup: false,
    newUser: false,
    lastLogin: false,
    working: false,
  });

  // 検索条件の状態管理
  const [searchGroup, setSearchGroup] = useState('');
  const [searchGroupError, setSearchGroupError] = useState('');
  const [searchGroupTouched, setSearchGroupTouched] = useState(false);
  const [keyword, setKeyword] = useState('');
  const [experienceJobTypes, setExperienceJobTypes] = useState<
    Array<JobType & { experienceYears?: string }>
  >([]);
  const [jobTypeAndSearch, setJobTypeAndSearch] = useState(false);
  const [experienceIndustries, setExperienceIndustries] = useState<
    Array<Industry & { experienceYears?: string }>
  >([]);
  const [industryAndSearch, setIndustryAndSearch] = useState(false);
  const [currentSalaryMin, setCurrentSalaryMin] = useState('');
  const [currentSalaryMax, setCurrentSalaryMax] = useState('');
  const [currentCompany, setCurrentCompany] = useState('');
  const [education, setEducation] = useState('');
  const [englishLevel, setEnglishLevel] = useState('');
  const [otherLanguage, setOtherLanguage] = useState('');
  const [otherLanguageLevel, setOtherLanguageLevel] = useState('');
  const [qualifications, setQualifications] = useState('');
  const [ageMin, setAgeMin] = useState('');
  const [ageMax, setAgeMax] = useState('');

  // 希望条件の状態管理
  const [desiredJobTypes, setDesiredJobTypes] = useState<JobType[]>([]);
  const [desiredIndustries, setDesiredIndustries] = useState<Industry[]>([]);
  const [desiredSalaryMin, setDesiredSalaryMin] = useState('');
  const [desiredSalaryMax, setDesiredSalaryMax] = useState('');
  interface Location {
    id: string;
    name: string;
  }
  const [desiredLocations, setDesiredLocations] = useState<Location[]>([]);
  const [transferTime, setTransferTime] = useState('');
  interface WorkStyle {
    id: string;
    name: string;
  }
  const [workStyles, setWorkStyles] = useState<WorkStyle[]>([]);
  const [selectionStatus, setSelectionStatus] = useState('');
  const [similarCompanyIndustry, setSimilarCompanyIndustry] = useState('');
  const [similarCompanyLocation, setSimilarCompanyLocation] = useState('');
  const [lastLoginMin, setLastLoginMin] = useState('');

  // モーダルの状態管理
  const [isJobTypeModalOpen, setIsJobTypeModalOpen] = useState(false);
  const [isIndustryModalOpen, setIsIndustryModalOpen] = useState(false);
  const [isDesiredJobTypeModalOpen, setIsDesiredJobTypeModalOpen] =
    useState(false);
  const [isDesiredIndustryModalOpen, setIsDesiredIndustryModalOpen] =
    useState(false);
  const [isDesiredLocationModalOpen, setIsDesiredLocationModalOpen] =
    useState(false);
  const [isWorkStyleModalOpen, setIsWorkStyleModalOpen] = useState(false);

  // 初期データ読み込み
  useEffect(() => {
    const loadCandidates = async () => {
      try {
        setLoading(true);
        const data = await getCandidatesFromDatabase();
        setAllCandidates(data);
        setCandidates(data);
      } catch (error) {
        console.error('Failed to load candidates:', error);
        // エラーの場合はモックデータを使用
        setAllCandidates(mockCandidates as CandidateData[]);
        setCandidates(mockCandidates as CandidateData[]);
      } finally {
        setLoading(false);
      }
    };

    loadCandidates();
  }, []);

  // URLパラメータから検索条件を読み込む
  useEffect(() => {
    if (allCandidates.length === 0) return;
    // 職種の処理
    const jobTypesParam = searchParams.get('job_types');
    if (jobTypesParam) {
      const jobTypes = jobTypesParam.split(',').map((name, index) => ({
        id: `job-${index}`,
        name: name.trim(),
      }));
      setExperienceJobTypes(jobTypes);
    }

    // 業界の処理
    const industriesParam = searchParams.get('industries');
    if (industriesParam) {
      const industries = industriesParam.split(',').map((name, index) => ({
        id: `industry-${index}`,
        name: name.trim(),
      }));
      setExperienceIndustries(industries);
    }

    // 勤務地の処理
    const locationsParam = searchParams.get('locations');
    if (locationsParam) {
      const locations = locationsParam.split(',').map((name, index) => ({
        id: `location-${index}`,
        name: name.trim(),
      }));
      setDesiredLocations(locations);
    }

    // 年齢の処理
    const ageMinParam = searchParams.get('age_min');
    if (ageMinParam) {
      setAgeMin(ageMinParam);
    }

    const ageMaxParam = searchParams.get('age_max');
    if (ageMaxParam) {
      setAgeMax(ageMaxParam);
    }

    // 年収の処理
    const salaryMinParam = searchParams.get('salary_min');
    if (salaryMinParam) {
      setDesiredSalaryMin(salaryMinParam);
    }

    const salaryMaxParam = searchParams.get('salary_max');
    if (salaryMaxParam) {
      setDesiredSalaryMax(salaryMaxParam);
    }

    // スキルの処理
    const skillsParam = searchParams.get('skills');
    if (skillsParam) {
      setKeyword(skillsParam);
    }

    // 言語の処理
    const languagesParam = searchParams.get('languages');
    if (languagesParam) {
      setOtherLanguage(languagesParam);
    }

    // キャリアチェンジ・専門性の処理
    const careerChangeParam = searchParams.get('career_change');
    if (careerChangeParam === 'true') {
      // キャリアチェンジ志向の場合の処理（必要に応じて）
    }

    const professionalFocusParam = searchParams.get('professional_focus');
    if (professionalFocusParam === 'true') {
      // 専門性追求の場合の処理（必要に応じて）
    }

    // 学歴の処理
    const educationLevelParam = searchParams.get('education_level');
    if (educationLevelParam) {
      setEducation(educationLevelParam);
    }

    // 検索ボックスを開く（パラメータがある場合）
    const hasParams = searchParams.toString().length > 0;
    if (hasParams) {
      setIsSearchBoxOpen(true);
      
      // URLパラメータに基づいて候補者をフィルタリング
      const searchConditions = {
        job_types: jobTypesParam?.split(',').map(t => t.trim()),
        industries: industriesParam?.split(',').map(t => t.trim()),
        locations: locationsParam?.split(',').map(t => t.trim()),
        age_min: ageMinParam ? parseInt(ageMinParam) : undefined,
        age_max: ageMaxParam ? parseInt(ageMaxParam) : undefined,
        salary_min: salaryMinParam ? parseInt(salaryMinParam) : undefined,
        salary_max: salaryMaxParam ? parseInt(salaryMaxParam) : undefined,
        skills: skillsParam?.split(',').map(t => t.trim()),
        languages: languagesParam?.split(',').map(t => t.trim()),
        career_change: careerChangeParam === 'true',
        professional_focus: professionalFocusParam === 'true',
        education_level: educationLevelParam?.split(',').map(t => t.trim()),
      };

      // 条件が存在する場合のみフィルタリングを実行
      const hasSearchConditions = Object.values(searchConditions).some(value => 
        Array.isArray(value) ? value.length > 0 : value !== undefined
      );

      console.log('Search conditions:', searchConditions);
      console.log('All candidates count:', allCandidates.length);
      console.log('First candidate:', allCandidates[0]);
      
      if (hasSearchConditions) {
        const filteredCandidates = filterCandidatesByConditions(allCandidates, searchConditions);
        console.log('Filtered candidates count:', filteredCandidates.length);
        
        // デバッグ用：フィルタ結果が0件の場合、全候補者を表示
        if (filteredCandidates.length === 0 && allCandidates.length > 0) {
          console.warn('No filtered results, showing all candidates for debugging');
          setCandidates(allCandidates);
        } else {
          setCandidates(filteredCandidates);
        }
      }
    }
  }, [searchParams, allCandidates]);

  const togglePickup = (id: string | number) => {
    setCandidates((prev) =>
      prev.map((candidate) =>
        candidate.id === id
          ? { ...candidate, isPickup: !candidate.isPickup }
          : candidate,
      ),
    );
  };

  const toggleHidden = (id: string | number) => {
    setCandidates((prev) =>
      prev.map((candidate) =>
        candidate.id === id
          ? { ...candidate, isHidden: !candidate.isHidden }
          : candidate,
      ),
    );
  };

  return (
    <>
      {/* Hero Section */}
      <div
        className="bg-gradient-to-t from-[#17856f] to-[#229a4e] px-20 py-10"
        style={{
          background: 'linear-gradient(to top, #17856f, #229a4e)',
        }}
      >
        <div className="w-full max-w-[1280px] mx-auto">
          <div className="flex items-center gap-4 mb-10">
            <svg
              width="32"
              height="32"
              viewBox="0 0 32 32"
              fill="none"
              xmlns="http://www.w3.org/2000/svg"
            >
              <path
                d="M26.0013 12.9967C26.0013 15.8656 25.07 18.5157 23.5011 20.6659L31.414 28.585C32.1953 29.3663 32.1953 30.6351 31.414 31.4164C30.6327 32.1977 29.3639 32.1977 28.5826 31.4164L20.6698 23.4972C18.5197 25.0723 15.8695 25.9974 13.0006 25.9974C5.81903 25.9974 0 20.1783 0 12.9967C0 5.81513 5.81903 -0.00390625 13.0006 -0.00390625C20.1822 -0.00390625 26.0013 5.81513 26.0013 12.9967ZM13.0006 21.9972C14.1826 21.9972 15.353 21.7644 16.445 21.312C17.5369 20.8597 18.5291 20.1968 19.3649 19.361C20.2007 18.5252 20.8636 17.533 21.316 16.441C21.7683 15.3491 22.0011 14.1787 22.0011 12.9967C22.0011 11.8148 21.7683 10.6444 21.316 9.55241C20.8636 8.46043 20.2007 7.46822 19.3649 6.63246C18.5291 5.79669 17.5369 5.13372 16.445 4.68141C15.353 4.22909 14.1826 3.99629 13.0006 3.99629C11.8187 3.99629 10.6483 4.22909 9.55632 4.68141C8.46433 5.13372 7.47213 5.79669 6.63636 6.63246C5.8006 7.46822 5.13763 8.46043 4.68531 9.55241C4.233 10.6444 4.0002 11.8148 4.0002 12.9967C4.0002 14.1787 4.233 15.3491 4.68531 16.441C5.13763 17.533 5.8006 18.5252 6.63636 19.361C7.47213 20.1968 8.46433 20.8597 9.55632 21.312C10.6483 21.7644 11.8187 21.9972 13.0006 21.9972Z"
                fill="white"
              />
            </svg>

            <h1
              className="text-white text-[24px] font-bold tracking-[2.4px]"
              style={{ fontFamily: 'Noto Sans JP, sans-serif' }}
            >
              候補者検索
            </h1>
          </div>
          {/* Search Box */}
          <div className="bg-white rounded-[10px]">
            <div
              className="flex items-center justify-between p-10 cursor-pointer"
              onClick={() => setIsSearchBoxOpen(!isSearchBoxOpen)}
            >
              <div className="flex-1 flex gap-6 overflow-hidden items-center">
                <span
                  className="text-[20px] font-bold text-[#323232] tracking-[1.4px] flex-shrink-0"
                  style={{ fontFamily: 'Noto Sans JP, sans-serif' }}
                >
                  検索条件
                </span>
                <span
                  className="truncate"
                  style={{
                    fontFamily: 'Noto Sans JP, sans-serif',
                    maxWidth: '1020px',
                  }}
                >
                  <strong className="text-[16px] font-medium text-[#323232] tracking-[1.6px] ">
                    検索条件名テキストが入ります。
                  </strong>
                  <span className="text-[14px] font-medium text-[#323232] tracking-[1.4px] ">
                    検索条件名テキストが入ります。検索条件名テキストが入ります。検索条件名テキストが入ります。検索条件名テキストが入ります。検索条件名テキストが入ります。検索条件名テキストが入ります。検索条件名
                  </span>
                </span>
              </div>
              <button className="p-2">
                {isSearchBoxOpen ? (
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    width="24"
                    height="24"
                    viewBox="0 0 24 24"
                    fill="none"
                  >
                    <path
                      d="M10.4088 3.93415L0.401419 16.2595C-0.582016 17.4707 0.353592 19.1992 1.99265 19.1992H22.0074C23.6464 19.1992 24.582 17.4707 23.5986 16.2595L13.5912 3.93415C12.7956 2.95424 11.2044 2.95424 10.4088 3.93415Z"
                      fill="#0F9058"
                    />
                  </svg>
                ) : (
                  <svg
                    width="24"
                    height="24"
                    viewBox="0 0 24 24"
                    fill="none"
                    xmlns="http://www.w3.org/2000/svg"
                  >
                    <path
                      d="M13.5912 20.0659L23.5986 7.74049C24.582 6.52927 23.6464 4.80078 22.0074 4.80078L1.99265 4.80078C0.353592 4.80078 -0.582015 6.52927 0.401421 7.7405L10.4088 20.0659C11.2044 21.0458 12.7956 21.0458 13.5912 20.0659Z"
                      fill="#0F9058"
                    />
                  </svg>
                )}
              </button>
            </div>

            {isSearchBoxOpen && (
              <div className="p-10">
                <div className="flex flex-col gap-2">
                  {/* 検索履歴保存グループ */}
                  <div
                    className="flex gap-6 items-strech mb-0 border-t-[2px] border-[#EFEFEF] pt-6"
                    data-field="search-group"
                  >
                    <div className="w-[201px] bg-[#f9f9f9] rounded-[5px] py-0 flex items-center justify-center min-h-[102px]">
                      <span
                        className="text-[#323232] text-[16px] font-bold tracking-[1.6px] leading-[32px]"
                        style={{ fontFamily: 'Noto Sans JP, sans-serif' }}
                      >
                        検索履歴を保存する
                        <br />
                        グループ
                      </span>
                    </div>
                    <div className="flex-1 py-6 flex items-center">
                      <div>
                        <SelectInput
                          value={searchGroup}
                          onChange={(value: string) => {
                            setSearchGroup(value);
                            setSearchGroupError('');
                          }}
                          onBlur={() => {
                            setSearchGroupTouched(true);
                            if (!searchGroup) {
                              setSearchGroupError(
                                'グループを選択してください。',
                              );
                            }
                          }}
                          options={[
                            { value: '', label: '未選択' },
                            {
                              value: 'group1',
                              label: 'エンジニア採用グループ',
                            },
                            { value: 'group2', label: '営業職採用グループ' },
                            {
                              value: 'group3',
                              label: 'デザイナー採用グループ',
                            },
                            { value: 'group4', label: '新卒採用グループ' },
                          ]}
                          placeholder="未選択"
                          className="w-[400px]"
                        />
                        {searchGroupTouched && searchGroupError && (
                          <p className="text-[#ff0000] text-[12px] mt-2">
                            {searchGroupError}
                          </p>
                        )}
                      </div>
                    </div>
                  </div>

                  {/* キーワード検索 */}
                  <div className="flex gap-6 items-strech border-t-[2px] border-[#EFEFEF] pt-6 mt-5">
                    <div className="w-[201px] bg-[#f9f9f9] rounded-[5px] px-6 py-0 flex items-center justify-start min-h-[102px]">
                      <span
                        className="text-[#323232] text-[16px] font-bold tracking-[1.6px] leading-[32px]"
                        style={{ fontFamily: 'Noto Sans JP, sans-serif' }}
                      >
                        キーワード検索
                      </span>
                    </div>
                    <div className="flex-1 py-6 flex items-center text-[#999]">
                      <input
                        type="text"
                        value={keyword}
                        onChange={(e) => setKeyword(e.target.value)}
                        placeholder="検索したいワードを入力"
                        className="w-100 px-4 py-3 border border-[#999] rounded-[4px] text-[14px] tracking-[1.4px]"
                        style={{ fontFamily: 'Noto Sans JP, sans-serif' }}
                      />
                    </div>
                  </div>

                  {/* 経験職種 */}
                  <div className="flex gap-6 items-strech">
                    <div className="w-[201px] bg-[#f9f9f9] rounded-[5px] px-6 py-0 flex items-center justify-start min-h-[102px]">
                      <span
                        className="text-[#323232] text-[16px] font-bold tracking-[1.6px] leading-[32px]"
                        style={{ fontFamily: 'Noto Sans JP, sans-serif' }}
                      >
                        経験職種
                      </span>
                    </div>
                    <div className="flex-1 py-6">
                      {/* ボタンとチェックボックスのコンテナ */}
                      <div className="flex items-center gap-4">
                        <button
                          onClick={() => setIsJobTypeModalOpen(true)}
                          className="w-[160px] py-[12px] bg-white border border-[#999999] rounded-[32px] text-[14px] font-bold text-[#323232] tracking-[1.4px]"
                          style={{ fontFamily: 'Noto Sans JP, sans-serif' }}
                        >
                          職種を選択
                        </button>

                        {/* AND検索チェックボックス */}
                        <div className="flex items-center gap-2">
                          <Checkbox
                            checked={jobTypeAndSearch}
                            onChange={(checked: boolean) =>
                              setJobTypeAndSearch(checked)
                            }
                          />
                          <label
                            className="text-[#323232] text-[14px] font-medium tracking-[1.4px]"
                            style={{ fontFamily: 'Noto Sans JP, sans-serif' }}
                          >
                            選択した職種すべてが当てはまる
                          </label>
                        </div>
                      </div>

                      {/* 選択された職種のタグ表示 */}
                      {experienceJobTypes.length > 0 && (
                        <div className="flex flex-col gap-2 mt-4 max-w-[400px] w-full">
                          {experienceJobTypes.map((job) => (
                            <div key={job.id} className="flex flex-row gap-0.5">
                              <div className="inline-flex items-strech gap-1">
                                <div
                                  className="bg-[#d2f1da] px-6 py-[10px] rounded-l-[10px] text-[#0f9058] text-[14px] font-bold tracking-[1.4px]"
                                  style={{
                                    fontFamily: 'Noto Sans JP, sans-serif',
                                  }}
                                >
                                  {job.name}
                                </div>
                                <div className="bg-[#d2f1da] px-6 py-[10px] flex items-center justify-between relative">
                                  <select
                                    value={job.experienceYears || ''}
                                    onChange={(e) => {
                                      const updated = experienceJobTypes.map(
                                        (j) =>
                                          j.id === job.id
                                            ? {
                                                ...j,
                                                experienceYears: e.target.value,
                                              }
                                            : j,
                                      );
                                      setExperienceJobTypes(updated);
                                    }}
                                    className="bg-transparent text-[#0f9058] text-[14px] font-medium tracking-[1.4px] appearance-none pr-6 cursor-pointer focus:outline-none w-full"
                                    style={{
                                      fontFamily: 'Noto Sans JP, sans-serif',
                                    }}
                                  >
                                    <option value="">経験年数：指定なし</option>
                                    <option value="0">
                                      経験年数：経験なし
                                    </option>
                                    <option value="1">経験年数：1年以上</option>
                                    <option value="3">経験年数：3年以上</option>
                                    <option value="5">経験年数：5年以上</option>
                                    <option value="10">
                                      経験年数：10年以上
                                    </option>
                                  </select>
                                  <svg
                                    xmlns="http://www.w3.org/2000/svg"
                                    width="14"
                                    height="10"
                                    viewBox="0 0 14 10"
                                    fill="none"
                                    className="absolute right-4 top-1/2 -translate-y-1/2 pointer-events-none"
                                  >
                                    <path
                                      d="M6.07178 8.90462L0.234161 1.71483C-0.339509 1.00828 0.206262 0 1.16238 0H12.8376C13.7937 0 14.3395 1.00828 13.7658 1.71483L7.92822 8.90462C7.46411 9.47624 6.53589 9.47624 6.07178 8.90462Z"
                                      fill="#0F9058"
                                    />
                                  </svg>
                                </div>
                              </div>
                              <button
                                type="button"
                                onClick={() => {
                                  setExperienceJobTypes(
                                    experienceJobTypes.filter(
                                      (j) => j.id !== job.id,
                                    ),
                                  );
                                }}
                                className="bg-[#d2f1da] p-[14px] rounded-r-[10px] flex items-center hover:bg-[#c2e1ca] transition-colors"
                              >
                                <svg
                                  width="13"
                                  height="12"
                                  viewBox="0 0 13 12"
                                  fill="none"
                                  xmlns="http://www.w3.org/2000/svg"
                                >
                                  <path
                                    d="M0.707031 0.206055C0.98267 -0.0694486 1.42952 -0.0695749 1.70508 0.206055L6.50098 5.00293L11.2969 0.206055C11.5725 -0.0692376 12.0194 -0.0695109 12.2949 0.206055C12.5705 0.481731 12.5705 0.929373 12.2949 1.20508L7.49902 6.00195L12.291 10.7949L12.3154 10.8213C12.5657 11.0984 12.5579 11.5259 12.291 11.793C12.0241 12.06 11.5964 12.0685 11.3193 11.8184L11.293 11.793L6.50098 7L1.70898 11.7939L1.68262 11.8193C1.40561 12.0697 0.977947 12.0609 0.710938 11.7939C0.443995 11.5269 0.4354 11.0994 0.685547 10.8223L0.710938 10.7959L5.50293 6.00098L0.707031 1.2041C0.431408 0.928409 0.431408 0.481747 0.707031 0.206055Z"
                                    fill="#0F9058"
                                  />
                                </svg>
                              </button>
                            </div>
                          ))}
                        </div>
                      )}
                    </div>
                  </div>

                  {/* 経験業種 */}
                  <div className="flex gap-6 items-strech">
                    <div className="w-[201px] bg-[#f9f9f9] rounded-[5px] px-6 py-0 flex items-center justify-start min-h-[102px]">
                      <span
                        className="text-[#323232] text-[16px] font-bold tracking-[1.6px] leading-[32px]"
                        style={{ fontFamily: 'Noto Sans JP, sans-serif' }}
                      >
                        経験業種
                      </span>
                    </div>
                    <div className="flex-1 py-6">
                      {/* ボタンとチェックボックスのコンテナ */}
                      <div className="flex items-center gap-4">
                        <button
                          onClick={() => setIsIndustryModalOpen(true)}
                          className="w-[160px] py-[12px] bg-white border border-[#999999] rounded-[32px] text-[14px] font-bold text-[#323232] tracking-[1.4px]"
                          style={{ fontFamily: 'Noto Sans JP, sans-serif' }}
                        >
                          業種を選択
                        </button>

                        {/* AND検索チェックボックス */}
                        <div className="flex items-center gap-2">
                          <Checkbox
                            checked={industryAndSearch}
                            onChange={(checked: boolean) =>
                              setIndustryAndSearch(checked)
                            }
                          />
                          <label
                            className="text-[#323232] text-[14px] font-medium tracking-[1.4px]"
                            style={{ fontFamily: 'Noto Sans JP, sans-serif' }}
                          >
                            選択した職種すべてが当てはまる
                          </label>
                        </div>
                      </div>

                      {/* 選択された業種のタグ表示 */}
                      {experienceIndustries.length > 0 && (
                        <div className="flex flex-col gap-2 mt-4 max-w-[400px] w-full">
                          {experienceIndustries.map((industry) => (
                            <div
                              key={industry.id}
                              className="flex flex-row gap-0.5"
                            >
                              <div className="inline-flex items-strech gap-1">
                                <div
                                  className="bg-[#d2f1da] px-6 py-[10px] rounded-l-[10px] text-[#0f9058] text-[14px] font-bold tracking-[1.4px]"
                                  style={{
                                    fontFamily: 'Noto Sans JP, sans-serif',
                                  }}
                                >
                                  {industry.name}
                                </div>
                                <div className="bg-[#d2f1da] px-6 py-[10px] flex items-center justify-between relative">
                                  <select
                                    value={industry.experienceYears || ''}
                                    onChange={(e) => {
                                      const updated = experienceIndustries.map(
                                        (ind) =>
                                          ind.id === industry.id
                                            ? {
                                                ...ind,
                                                experienceYears: e.target.value,
                                              }
                                            : ind,
                                      );
                                      setExperienceIndustries(updated);
                                    }}
                                    className="bg-transparent text-[#0f9058] text-[14px] font-medium tracking-[1.4px] appearance-none pr-6 cursor-pointer focus:outline-none w-full"
                                    style={{
                                      fontFamily: 'Noto Sans JP, sans-serif',
                                    }}
                                  >
                                    <option value="">経験年数：指定なし</option>
                                    <option value="0">
                                      経験年数：経験なし
                                    </option>
                                    <option value="1">経験年数：1年以上</option>
                                    <option value="3">経験年数：3年以上</option>
                                    <option value="5">経験年数：5年以上</option>
                                    <option value="10">
                                      経験年数：10年以上
                                    </option>
                                  </select>
                                  <svg
                                    xmlns="http://www.w3.org/2000/svg"
                                    width="14"
                                    height="10"
                                    viewBox="0 0 14 10"
                                    fill="none"
                                    className="absolute right-4 top-1/2 -translate-y-1/2 pointer-events-none"
                                  >
                                    <path
                                      d="M6.07178 8.90462L0.234161 1.71483C-0.339509 1.00828 0.206262 0 1.16238 0H12.8376C13.7937 0 14.3395 1.00828 13.7658 1.71483L7.92822 8.90462C7.46411 9.47624 6.53589 9.47624 6.07178 8.90462Z"
                                      fill="#0F9058"
                                    />
                                  </svg>
                                </div>
                              </div>
                              <button
                                type="button"
                                onClick={() => {
                                  setExperienceIndustries(
                                    experienceIndustries.filter(
                                      (i) => i.id !== industry.id,
                                    ),
                                  );
                                }}
                                className="bg-[#d2f1da] p-[14px] rounded-r-[10px] flex items-center hover:bg-[#c2e1ca] transition-colors"
                              >
                                <svg
                                  width="13"
                                  height="12"
                                  viewBox="0 0 13 12"
                                  fill="none"
                                  xmlns="http://www.w3.org/2000/svg"
                                >
                                  <path
                                    d="M0.707031 0.206055C0.98267 -0.0694486 1.42952 -0.0695749 1.70508 0.206055L6.50098 5.00293L11.2969 0.206055C11.5725 -0.0692376 12.0194 -0.0695109 12.2949 0.206055C12.5705 0.481731 12.5705 0.929373 12.2949 1.20508L7.49902 6.00195L12.291 10.7949L12.3154 10.8213C12.5657 11.0984 12.5579 11.5259 12.291 11.793C12.0241 12.06 11.5964 12.0685 11.3193 11.8184L11.293 11.793L6.50098 7L1.70898 11.7939L1.68262 11.8193C1.40561 12.0697 0.977947 12.0609 0.710938 11.7939C0.443995 11.5269 0.4354 11.0994 0.685547 10.8223L0.710938 10.7959L5.50293 6.00098L0.707031 1.2041C0.431408 0.928409 0.431408 0.481747 0.707031 0.206055Z"
                                    fill="#0F9058"
                                  />
                                </svg>
                              </button>
                            </div>
                          ))}
                        </div>
                      )}
                    </div>
                  </div>

                  {/* 現在の年収 */}
                  <div className="flex gap-6 items-strech">
                    <div className="w-[201px] bg-[#f9f9f9] rounded-[5px] px-6 py-0 flex items-center justify-start min-h-[102px]">
                      <span
                        className="text-[#323232] text-[16px] font-bold tracking-[1.6px] leading-[32px]"
                        style={{ fontFamily: 'Noto Sans JP, sans-serif' }}
                      >
                        現在の年収
                      </span>
                    </div>
                    <div className="flex-1 py-6 flex items-center">
                      <div className="flex items-center gap-2 ">
                        <SelectInput
                          value={currentSalaryMin}
                          className="min-w-60"
                          onChange={(value: string) =>
                            setCurrentSalaryMin(value)
                          }
                          options={[
                            { value: '', label: '指定なし' },
                            { value: '300', label: '300万円' },
                            { value: '400', label: '400万円' },
                            { value: '500', label: '500万円' },
                            { value: '600', label: '600万円' },
                            { value: '700', label: '700万円' },
                            { value: '800', label: '800万円' },
                            { value: '1000', label: '1,000万円' },
                            { value: '1200', label: '1,200万円' },
                            { value: '1500', label: '1,500万円' },
                            { value: '2000', label: '2,000万円' },
                            { value: '3000', label: '3,000万円' },
                            { value: '5000', label: '5,000万円' },
                          ]}
                          placeholder="指定なし"
                        />
                        <span className="text-[#323232]">〜</span>
                        <SelectInput
                          value={currentSalaryMax}
                          className="min-w-60"
                          onChange={(value: string) =>
                            setCurrentSalaryMax(value)
                          }
                          options={[
                            { value: '', label: '指定なし' },
                            { value: '300', label: '300万円' },
                            { value: '400', label: '400万円' },
                            { value: '500', label: '500万円' },
                            { value: '600', label: '600万円' },
                            { value: '700', label: '700万円' },
                            { value: '800', label: '800万円' },
                            { value: '1000', label: '1,000万円' },
                            { value: '1200', label: '1,200万円' },
                            { value: '1500', label: '1,500万円' },
                            { value: '2000', label: '2,000万円' },
                            { value: '3000', label: '3,000万円' },
                            { value: '5000', label: '5,000万円' },
                          ]}
                          placeholder="指定なし"
                        />
                      </div>
                    </div>
                  </div>

                  {/* 在籍企業 */}
                  <div className="flex gap-6 items-strech">
                    <div className="w-[201px] bg-[#f9f9f9] rounded-[5px] px-6 py-0 flex items-center justify-start min-h-[102px]">
                      <span
                        className="text-[#323232] text-[16px] font-bold tracking-[1.6px] leading-[32px]"
                        style={{ fontFamily: 'Noto Sans JP, sans-serif' }}
                      >
                        在籍企業
                      </span>
                    </div>
                    <div className="flex-1 py-6 flex items-center">
                      <input
                        type="text"
                        value={currentCompany}
                        onChange={(e) => setCurrentCompany(e.target.value)}
                        placeholder="在籍企業を入力"
                        className="w-100 px-4 py-3 border text-[#999] border-[#999] rounded-[4px] text-[14px] tracking-[1.4px]"
                        style={{ fontFamily: 'Noto Sans JP, sans-serif' }}
                      />
                    </div>
                  </div>

                  {/* 最終学歴 */}
                  <div className="flex gap-6 items-strech">
                    <div className="w-[201px] bg-[#f9f9f9] rounded-[5px] px-6 py-0 flex items-center justify-start min-h-[102px]">
                      <span
                        className="text-[#323232] text-[16px] font-bold tracking-[1.6px] leading-[32px]"
                        style={{ fontFamily: 'Noto Sans JP, sans-serif' }}
                      >
                        最終学歴
                      </span>
                    </div>
                    <div className="flex-1 py-6 flex items-center">
                      <div className="flex items-center gap-2">
                        <SelectInput
                          value={education}
                          className=" w-[358px]"
                          onChange={(value: string) => setEducation(value)}
                          options={[
                            { value: '', label: '指定なし' },
                            { value: 'middle', label: '中学卒' },
                            { value: 'high', label: '高校卒' },
                            { value: 'vocational', label: '専門学校卒' },
                            { value: 'junior', label: '短大卒' },
                            { value: 'university', label: '大学卒' },
                            { value: 'graduate', label: '大学院卒' },
                            { value: 'mba', label: 'MBA' },
                            { value: 'doctorate', label: '博士号' },
                          ]}
                          placeholder="指定なし"
                        />
                        <span
                          className="text-[#323232] text-[14px] font-bold tracking-[1.4px]"
                          style={{ fontFamily: 'Noto Sans JP, sans-serif' }}
                        >
                          以上
                        </span>
                      </div>
                    </div>
                  </div>

                  {/* 語学力 */}
                  <div className="flex gap-6 items-strech">
                    <div className="w-[201px] bg-[#f9f9f9] rounded-[5px] px-6 py-0 flex items-center justify-start min-h-[102px]">
                      <span
                        className="text-[#323232] text-[16px] font-bold tracking-[1.6px] leading-[32px]"
                        style={{ fontFamily: 'Noto Sans JP, sans-serif' }}
                      >
                        語学力
                      </span>
                    </div>
                    <div className="flex-1 py-6 flex items-center">
                      <div className="grid grid-cols-1 gap-6">
                        <div>
                          <label
                            className="block text-[#323232] text-[14px] font-bold tracking-[1.4px] mb-2"
                            style={{ fontFamily: 'Noto Sans JP, sans-serif' }}
                          >
                            英語
                          </label>
                          <SelectInput
                            value={englishLevel}
                            onChange={(value: string) => setEnglishLevel(value)}
                            className="w-fit"
                            options={[
                              { value: '', label: 'レベルの指定なし' },
                              { value: 'native', label: 'ネイティブ' },
                              { value: 'business', label: 'ビジネスレベル' },
                              { value: 'conversation', label: '日常会話' },
                              { value: 'basic', label: '基礎会話' },
                              { value: 'none', label: 'なし' },
                            ]}
                            placeholder="レベルの指定なし"
                          />
                        </div>
                        <div>
                          <label
                            className="block text-[#323232] text-[14px] font-bold tracking-[1.4px] mb-2"
                            style={{ fontFamily: 'Noto Sans JP, sans-serif' }}
                          >
                            その他の言語
                          </label>
                          <div className="flex items-center gap-2">
                            <SelectInput
                              value={otherLanguage}
                              onChange={(value: string) =>
                                setOtherLanguage(value)
                              }
                              options={[
                                { value: '', label: '指定なし' },
                                { value: 'chinese', label: '中国語' },
                                { value: 'korean', label: '韓国語' },
                                { value: 'spanish', label: 'スペイン語' },
                                { value: 'french', label: 'フランス語' },
                                { value: 'german', label: 'ドイツ語' },
                                { value: 'portuguese', label: 'ポルトガル語' },
                                { value: 'russian', label: 'ロシア語' },
                                { value: 'italian', label: 'イタリア語' },
                                { value: 'vietnamese', label: 'ベトナム語' },
                                { value: 'thai', label: 'タイ語' },
                                {
                                  value: 'indonesian',
                                  label: 'インドネシア語',
                                },
                                { value: 'hindi', label: 'ヒンディー語' },
                                { value: 'japanese', label: '日本語' },
                              ]}
                              placeholder="指定なし"
                            />
                            <SelectInput
                              value={otherLanguageLevel}
                              onChange={(value: string) =>
                                setOtherLanguageLevel(value)
                              }
                              options={[
                                { value: '', label: 'レベルの指定なし' },
                                { value: 'native', label: 'ネイティブ' },
                                { value: 'business', label: 'ビジネスレベル' },
                                { value: 'conversation', label: '日常会話' },
                                { value: 'basic', label: '基礎会話' },
                                { value: 'none', label: 'なし' },
                              ]}
                              placeholder="レベルの指定なし"
                            />
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>

                  {/* 保有資格 */}
                  <div className="flex gap-6 items-strech">
                    <div className="w-[201px] bg-[#f9f9f9] rounded-[5px] px-6 py-0 flex items-center justify-start min-h-[102px]">
                      <span
                        className="text-[#323232] text-[16px] font-bold tracking-[1.6px] leading-[32px]"
                        style={{ fontFamily: 'Noto Sans JP, sans-serif' }}
                      >
                        保有資格
                      </span>
                    </div>
                    <div className="flex-1 py-6 flex items-center">
                      <input
                        type="text"
                        value={qualifications}
                        onChange={(e) => setQualifications(e.target.value)}
                        placeholder="保有資格を入力"
                        className="w-100 px-4 py-3 border text-[#999] border-[#999] rounded-[4px] text-[14px] tracking-[1.4px]"
                        style={{ fontFamily: 'Noto Sans JP, sans-serif' }}
                      />
                    </div>
                  </div>

                  {/* 年齢 */}
                  <div className="flex gap-6 items-strech border-t-[2px] border-[#EFEFEF] pt-6 mt-5">
                    <div className="w-[201px] bg-[#f9f9f9] rounded-[5px] px-6 py-0 flex items-center justify-start min-h-[102px]">
                      <span
                        className="text-[#323232] text-[16px] font-bold tracking-[1.6px] leading-[32px]"
                        style={{ fontFamily: 'Noto Sans JP, sans-serif' }}
                      >
                        年齢
                      </span>
                    </div>
                    <div className="flex-1 py-6 flex items-center">
                      <div className="flex items-center gap-2">
                        <SelectInput
                          value={ageMin}
                          onChange={(value: string) => setAgeMin(value)}
                          className="w-60"
                          options={[
                            { value: '', label: '指定なし' },
                            { value: '18', label: '18歳' },
                            { value: '20', label: '20歳' },
                            { value: '22', label: '22歳' },
                            { value: '25', label: '25歳' },
                            { value: '30', label: '30歳' },
                            { value: '35', label: '35歳' },
                            { value: '40', label: '40歳' },
                            { value: '45', label: '45歳' },
                            { value: '50', label: '50歳' },
                            { value: '55', label: '55歳' },
                            { value: '60', label: '60歳' },
                            { value: '65', label: '65歳' },
                          ]}
                          placeholder="指定なし"
                        />
                        <span className="text-[#323232]">〜</span>
                        <SelectInput
                          value={ageMax}
                          className="w-60"
                          onChange={(value: string) => setAgeMax(value)}
                          options={[
                            { value: '', label: '指定なし' },
                            { value: '18', label: '18歳' },
                            { value: '20', label: '20歳' },
                            { value: '22', label: '22歳' },
                            { value: '25', label: '25歳' },
                            { value: '30', label: '30歳' },
                            { value: '35', label: '35歳' },
                            { value: '40', label: '40歳' },
                            { value: '45', label: '45歳' },
                            { value: '50', label: '50歳' },
                            { value: '55', label: '55歳' },
                            { value: '60', label: '60歳' },
                            { value: '65', label: '65歳' },
                            { value: '70', label: '70歳' },
                            { value: '75', label: '75歳' },
                            { value: '80', label: '80歳' },
                          ]}
                          placeholder="指定なし"
                        />
                      </div>
                    </div>
                  </div>

                  {/* 希望職種 */}
                  <div className="flex gap-6 items-strech">
                    <div className="w-[201px] bg-[#f9f9f9] rounded-[5px] px-6 py-0 flex items-center justify-start min-h-[102px]">
                      <span
                        className="text-[#323232] text-[16px] font-bold tracking-[1.6px] leading-[32px]"
                        style={{ fontFamily: 'Noto Sans JP, sans-serif' }}
                      >
                        希望職種
                      </span>
                    </div>
                    <div className="flex-1 py-6 flex items-center">
                      <div className="flex flex-col gap-2">
                        <button
                          onClick={() => setIsDesiredJobTypeModalOpen(true)}
                          className="w-[170px] py-[12px] bg-white border border-[#999999] rounded-[32px] text-[14px] font-bold text-[#323232] tracking-[1.4px]"
                          style={{ fontFamily: 'Noto Sans JP, sans-serif' }}
                        >
                          職種を選択
                        </button>
                        {desiredJobTypes.length > 0 && (
                          <div className="flex flex-wrap gap-2">
                            {desiredJobTypes.map((job) => (
                              <div
                                key={job.id}
                                className="bg-[#d2f1da] px-6 py-[10px] rounded-[10px] flex items-center gap-2.5"
                              >
                                <span
                                  className="text-[#0f9058] text-[14px] font-medium tracking-[1.4px]"
                                  style={{
                                    fontFamily: 'Noto Sans JP, sans-serif',
                                  }}
                                >
                                  {job.name}
                                </span>
                                <button
                                  onClick={() =>
                                    setDesiredJobTypes(
                                      desiredJobTypes.filter(
                                        (j) => j.id !== job.id,
                                      ),
                                    )
                                  }
                                  className="w-3 h-3"
                                >
                                  <svg
                                    width="12"
                                    height="12"
                                    viewBox="0 0 12 12"
                                    fill="none"
                                  >
                                    <path
                                      d="M1 1L11 11M1 11L11 1"
                                      stroke="#0f9058"
                                      strokeWidth="2"
                                      strokeLinecap="round"
                                    />
                                  </svg>
                                </button>
                              </div>
                            ))}
                          </div>
                        )}
                      </div>
                    </div>
                  </div>

                  {/* 希望業種 */}
                  <div className="flex gap-6 items-strech">
                    <div className="w-[201px] bg-[#f9f9f9] rounded-[5px] px-6 py-0 flex items-center justify-start min-h-[102px]">
                      <span
                        className="text-[#323232] text-[16px] font-bold tracking-[1.6px] leading-[32px]"
                        style={{ fontFamily: 'Noto Sans JP, sans-serif' }}
                      >
                        希望業種
                      </span>
                    </div>
                    <div className="flex-1 py-6 flex items-center">
                      <div className="flex flex-col gap-2">
                        <button
                          onClick={() => setIsDesiredIndustryModalOpen(true)}
                          className="w-[170px] py-[12px] bg-white border border-[#999999] rounded-[32px] text-[14px] font-bold text-[#323232] tracking-[1.4px]"
                          style={{ fontFamily: 'Noto Sans JP, sans-serif' }}
                        >
                          業種を選択
                        </button>
                        {desiredIndustries.length > 0 && (
                          <div className="flex flex-wrap gap-2">
                            {desiredIndustries.map((industry) => (
                              <div
                                key={industry.id}
                                className="bg-[#d2f1da] px-6 py-[10px] rounded-[10px] flex items-center gap-2.5"
                              >
                                <span
                                  className="text-[#0f9058] text-[14px] font-medium tracking-[1.4px]"
                                  style={{
                                    fontFamily: 'Noto Sans JP, sans-serif',
                                  }}
                                >
                                  {industry.name}
                                </span>
                                <button
                                  onClick={() =>
                                    setDesiredIndustries(
                                      desiredIndustries.filter(
                                        (i) => i.id !== industry.id,
                                      ),
                                    )
                                  }
                                  className="w-3 h-3"
                                >
                                  <svg
                                    width="12"
                                    height="12"
                                    viewBox="0 0 12 12"
                                    fill="none"
                                  >
                                    <path
                                      d="M1 1L11 11M1 11L11 1"
                                      stroke="#0f9058"
                                      strokeWidth="2"
                                      strokeLinecap="round"
                                    />
                                  </svg>
                                </button>
                              </div>
                            ))}
                          </div>
                        )}
                      </div>
                    </div>
                  </div>

                  {/* 希望年収 */}
                  <div className="flex gap-6 items-strech">
                    <div className="w-[201px] bg-[#f9f9f9] rounded-[5px] px-6 py-0 flex items-center justify-start min-h-[102px]">
                      <span
                        className="text-[#323232] text-[16px] font-bold tracking-[1.6px] leading-[32px]"
                        style={{ fontFamily: 'Noto Sans JP, sans-serif' }}
                      >
                        希望年収
                      </span>
                    </div>
                    <div className="flex-1 py-6 flex items-center">
                      <div className="flex items-center gap-2">
                        <SelectInput
                          value={desiredSalaryMin}
                          className="w-60"
                          onChange={(value: string) =>
                            setDesiredSalaryMin(value)
                          }
                          options={[
                            { value: '', label: '指定なし' },
                            { value: '300', label: '300万円' },
                            { value: '400', label: '400万円' },
                            { value: '500', label: '500万円' },
                            { value: '600', label: '600万円' },
                            { value: '700', label: '700万円' },
                            { value: '800', label: '800万円' },
                            { value: '1000', label: '1,000万円' },
                            { value: '1200', label: '1,200万円' },
                            { value: '1500', label: '1,500万円' },
                            { value: '2000', label: '2,000万円' },
                            { value: '3000', label: '3,000万円' },
                            { value: '5000', label: '5,000万円' },
                          ]}
                          placeholder="指定なし"
                        />
                        <span className="text-[#323232]">〜</span>
                        <SelectInput
                          value={desiredSalaryMax}
                          className="w-60"
                          onChange={(value: string) =>
                            setDesiredSalaryMax(value)
                          }
                          options={[
                            { value: '', label: '指定なし' },
                            { value: '300', label: '300万円' },
                            { value: '400', label: '400万円' },
                            { value: '500', label: '500万円' },
                            { value: '600', label: '600万円' },
                            { value: '700', label: '700万円' },
                            { value: '800', label: '800万円' },
                            { value: '1000', label: '1,000万円' },
                            { value: '1200', label: '1,200万円' },
                            { value: '1500', label: '1,500万円' },
                            { value: '2000', label: '2,000万円' },
                            { value: '3000', label: '3,000万円' },
                            { value: '5000', label: '5,000万円' },
                          ]}
                          placeholder="指定なし"
                        />
                      </div>
                    </div>
                  </div>

                  {/* 希望勤務地 */}
                  <div className="flex gap-6 items-stretch">
                    <div className="w-[201px] bg-[#f9f9f9] rounded-[5px] px-6 py-0 flex items-center justify-start min-h-[102px]">
                      <span
                        className="text-[#323232] text-[16px] font-bold tracking-[1.6px] leading-[32px]"
                        style={{ fontFamily: 'Noto Sans JP, sans-serif' }}
                      >
                        希望勤務地
                      </span>
                    </div>
                    <div className="flex-1 py-6 flex items-center">
                      <div className="flex flex-col gap-2">
                        <button
                          onClick={() => setIsDesiredLocationModalOpen(true)}
                          className="w-[170px] py-[12px] bg-white border border-[#999999] rounded-[32px] text-[14px] font-bold text-[#323232] tracking-[1.4px]"
                          style={{ fontFamily: 'Noto Sans JP, sans-serif' }}
                        >
                          勤務地を選択
                        </button>
                        {desiredLocations.length > 0 && (
                          <div className="flex flex-wrap gap-2">
                            {desiredLocations.map((location) => (
                              <div
                                key={location.id}
                                className="bg-[#d2f1da] px-6 py-[10px] rounded-[10px] flex items-center gap-2.5"
                              >
                                <span
                                  className="text-[#0f9058] text-[14px] font-medium tracking-[1.4px]"
                                  style={{
                                    fontFamily: 'Noto Sans JP, sans-serif',
                                  }}
                                >
                                  {location.name}
                                </span>
                                <button
                                  onClick={() =>
                                    setDesiredLocations(
                                      desiredLocations.filter(
                                        (l) => l.id !== location.id,
                                      ),
                                    )
                                  }
                                  className="w-3 h-3"
                                >
                                  <svg
                                    width="12"
                                    height="12"
                                    viewBox="0 0 12 12"
                                    fill="none"
                                  >
                                    <path
                                      d="M1 1L11 11M1 11L11 1"
                                      stroke="#0f9058"
                                      strokeWidth="2"
                                      strokeLinecap="round"
                                    />
                                  </svg>
                                </button>
                              </div>
                            ))}
                          </div>
                        )}
                      </div>
                    </div>
                  </div>

                  {/* 転職希望時期 */}
                  <div className="flex gap-6 items-strech">
                    <div className="w-[201px] bg-[#f9f9f9] rounded-[5px] px-6 py-0 flex items-center justify-start min-h-[102px]">
                      <span
                        className="text-[#323232] text-[16px] font-bold tracking-[1.6px] leading-[32px]"
                        style={{ fontFamily: 'Noto Sans JP, sans-serif' }}
                      >
                        転職希望時期
                      </span>
                    </div>
                    <div className="flex-1 py-6 flex items-center">
                      <SelectInput
                        value={transferTime}
                        className="w-100"
                        onChange={(value: string) => setTransferTime(value)}
                        options={[
                          { value: '', label: '指定なし' },
                          { value: 'immediately', label: 'すぐにでも' },
                          { value: '1month', label: '1ヶ月以内' },
                          { value: '3month', label: '3ヶ月以内' },
                          { value: '6month', label: '6ヶ月以内' },
                          { value: '1year', label: '1年以内' },
                          { value: 'good', label: '良い求人があれば' },
                        ]}
                        placeholder="指定なし"
                      />
                    </div>
                  </div>

                  {/* 興味のある働き方 */}
                  <div className="flex gap-6 items-strech border-t-[2px] border-[#EFEFEF] pt-6 mt-5">
                    <div className="w-[201px] bg-[#f9f9f9] rounded-[5px] px-6 py-0 flex items-center justify-start min-h-[102px]">
                      <span
                        className="text-[#323232] text-[16px] font-bold tracking-[1.6px] leading-[32px]"
                        style={{ fontFamily: 'Noto Sans JP, sans-serif' }}
                      >
                        興味のある働き方
                      </span>
                    </div>
                    <div className="flex-1 py-6 flex items-center">
                      <div className="flex flex-col gap-2">
                        <button
                          onClick={() => setIsWorkStyleModalOpen(true)}
                          className="w-[170px] py-[12px] bg-white border border-[#999999] rounded-[32px] text-[14px] font-bold text-[#323232] tracking-[1.4px]"
                          style={{ fontFamily: 'Noto Sans JP, sans-serif' }}
                        >
                          働き方を選択
                        </button>
                        {workStyles.length > 0 && (
                          <div className="flex flex-wrap gap-2">
                            {workStyles.map((style) => (
                              <div
                                key={style.id}
                                className="bg-[#d2f1da] px-6 py-[10px] rounded-[10px] flex items-center gap-2.5"
                              >
                                <span
                                  className="text-[#0f9058] text-[14px] font-medium tracking-[1.4px]"
                                  style={{
                                    fontFamily: 'Noto Sans JP, sans-serif',
                                  }}
                                >
                                  {style.name}
                                </span>
                                <button
                                  onClick={() =>
                                    setWorkStyles(
                                      workStyles.filter(
                                        (s) => s.id !== style.id,
                                      ),
                                    )
                                  }
                                  className="w-3 h-3"
                                >
                                  <svg
                                    width="12"
                                    height="12"
                                    viewBox="0 0 12 12"
                                    fill="none"
                                  >
                                    <path
                                      d="M1 1L11 11M1 11L11 1"
                                      stroke="#0f9058"
                                      strokeWidth="2"
                                      strokeLinecap="round"
                                    />
                                  </svg>
                                </button>
                              </div>
                            ))}
                          </div>
                        )}
                      </div>
                    </div>
                  </div>

                  {/* 選考状況 */}
                  <div className="flex gap-6 items-strech">
                    <div className="w-[201px] bg-[#f9f9f9] rounded-[5px] px-6 py-0 flex items-center justify-start min-h-[102px]">
                      <span
                        className="text-[#323232] text-[16px] font-bold tracking-[1.6px] leading-[32px]"
                        style={{ fontFamily: 'Noto Sans JP, sans-serif' }}
                      >
                        選考状況
                      </span>
                    </div>
                    <div className="flex-1 py-6 flex items-center">
                      <SelectInput
                        value={selectionStatus}
                        className="w-100"
                        onChange={(value: string) => setSelectionStatus(value)}
                        options={[
                          { value: '', label: '指定なし' },
                          { value: 'not-started', label: 'まだ始めていない' },
                          {
                            value: 'information-gathering',
                            label: '情報収集中',
                          },
                          {
                            value: 'document-screening',
                            label: '書類選考に進んでいる企業がある',
                          },
                          {
                            value: 'interview',
                            label: '面接・面談を受けている企業がある',
                          },
                          { value: 'offer', label: '内定をもらっている' },
                        ]}
                        placeholder="指定なし"
                      />
                    </div>
                  </div>

                  {/* 自社に似た企業に応募している */}
                  <div className="flex gap-6 items-strech">
                    <div className="w-[201px] bg-[#f9f9f9] rounded-[5px] px-6 py-0 flex items-center justify-start min-h-[102px]">
                      <div className="flex items-center gap-2">
                        <span
                          className="text-[#323232] text-[16px] font-bold tracking-[1.6px] leading-[32px]"
                          style={{ fontFamily: 'Noto Sans JP, sans-serif' }}
                        >
                          自社に似た企業に応募している
                        </span>
                        {/* Help icon in title column */}
                        <div className="relative group">
                          <svg
                            width="16"
                            height="16"
                            viewBox="0 0 16 16"
                            fill="none"
                            xmlns="http://www.w3.org/2000/svg"
                            className="cursor-help"
                          >
                            <path
                              d="M14.5 8C14.5 6.27609 13.8152 4.62279 12.5962 3.40381C11.3772 2.18482 9.72391 1.5 8 1.5C6.27609 1.5 4.62279 2.18482 3.40381 3.40381C2.18482 4.62279 1.5 6.27609 1.5 8C1.5 9.72391 2.18482 11.3772 3.40381 12.5962C4.62279 13.8152 6.27609 14.5 8 14.5C9.72391 14.5 11.3772 13.8152 12.5962 12.5962C13.8152 11.3772 14.5 9.72391 14.5 8ZM0 8C0 5.87827 0.842855 3.84344 2.34315 2.34315C3.84344 0.842855 5.87827 0 8 0C10.1217 0 12.1566 0.842855 13.6569 2.34315C15.1571 3.84344 16 5.87827 16 8C16 10.1217 15.1571 12.1566 13.6569 13.6569C12.1566 15.1571 10.1217 16 8 16C5.87827 16 3.84344 15.1571 2.34315 13.6569C0.842855 12.1566 0 10.1217 0 8ZM5.30625 5.16563C5.55313 4.46875 6.21563 4 6.95625 4H8.77812C9.86875 4 10.75 4.88438 10.75 5.97188C10.75 6.67813 10.3719 7.33125 9.75937 7.68437L8.75 8.2625C8.74375 8.66875 8.40938 9 8 9C7.58437 9 7.25 8.66563 7.25 8.25V7.82812C7.25 7.55937 7.39375 7.3125 7.62813 7.17812L9.0125 6.38438C9.15937 6.3 9.25 6.14375 9.25 5.975C9.25 5.7125 9.0375 5.50313 8.77812 5.50313H6.95625C6.85 5.50313 6.75625 5.56875 6.72188 5.66875L6.70937 5.70625C6.57187 6.09688 6.14063 6.3 5.75313 6.1625C5.36563 6.025 5.15937 5.59375 5.29688 5.20625L5.30937 5.16875L5.30625 5.16563ZM7 11C7 10.7348 7.10536 10.4804 7.29289 10.2929C7.48043 10.1054 7.73478 10 8 10C8.26522 10 8.51957 10.1054 8.70711 10.2929C8.89464 10.4804 9 10.7348 9 11C9 11.2652 8.89464 11.5196 8.70711 11.7071C8.51957 11.8946 8.26522 12 8 12C7.73478 12 7.48043 11.8946 7.29289 11.7071C7.10536 11.5196 7 11.2652 7 11Z"
                              fill="#999999"
                            />
                          </svg>
                          {/* Tooltip */}
                          <div className="absolute top-[-24px] left-[24px] hidden group-hover:block z-10 min-w-[700px] xl:min-w-[970px] pointer-events-none">
                            <div className="bg-[#F0F9F3] rounded-[5px] p-4 shadow-[0_0_20px_0_rgba(0,0,0,0.05)]">
                              <p
                                className="text-[#323232] text-[14px] font-bold tracking-[1.4px] leading-[20px]"
                                style={{
                                  fontFamily: 'Noto Sans JP, sans-serif',
                                }}
                              >
                                「自社に似た企業に応募している候補者」を絞り込んで検索できます。
                              </p>
                              <p
                                className="text-[#323232] text-[14px] font-medium tracking-[1.4px] leading-[20px] mt-2"
                                style={{
                                  fontFamily: 'Noto Sans JP, sans-serif',
                                }}
                              >
                                設立年、従業員数、業種、所在地、企業フェーズなどの条件をもとに、自社と類似した企業を受けている候補者を探すことが可能です。
                                <br />
                                絞り込みたい条件は自由に設定できます。
                              </p>
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>
                    <div className="flex-1 py-6 flex items-center ">
                      <div className="flex items-center gap-4">
                        <div className="flex items-center gap-6 flex-col xl:flex-row">
                          {/* Industry select */}
                          <div className="flex xl:items-center gap-4 flex-col xl:flex-row">
                            <span
                              className="text-[#323232] text-[16px] font-bold tracking-[1.6px]"
                              style={{ fontFamily: 'Noto Sans JP, sans-serif' }}
                            >
                              業種
                            </span>
                            <SelectInput
                              value={similarCompanyIndustry}
                              onChange={(value: string) =>
                                setSimilarCompanyIndustry(value)
                              }
                              className="w-[350px]"
                              options={[
                                { value: '', label: '指定なし' },
                                {
                                  value: 'same-industry',
                                  label: '業種・業界が同一',
                                },
                              ]}
                              placeholder="選択してください"
                            />
                          </div>
                          {/* Location select */}
                          <div className="flex xl:items-center gap-4 flex-col xl:flex-row">
                            <span
                              className="text-[#323232] text-[16px] font-bold tracking-[1.6px]"
                              style={{ fontFamily: 'Noto Sans JP, sans-serif' }}
                            >
                              所在地
                            </span>
                            <SelectInput
                              value={similarCompanyLocation}
                              onChange={(value: string) =>
                                setSimilarCompanyLocation(value)
                              }
                              className="w-[350px]"
                              options={[
                                { value: '', label: '指定なし' },
                                {
                                  value: 'same-area',
                                  label: 'エリア区分が同一',
                                },
                                {
                                  value: 'same-prefecture',
                                  label: '都道府県が同一',
                                },
                              ]}
                              placeholder="選択してください"
                            />
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>

                  {/* 最終ログイン */}
                  <div className="flex gap-6 items-strech">
                    <div className="w-[201px] bg-[#f9f9f9] rounded-[5px] px-6 py-0 flex items-center justify-start min-h-[102px]">
                      <span
                        className="text-[#323232] text-[16px] font-bold tracking-[1.6px] leading-[32px]"
                        style={{ fontFamily: 'Noto Sans JP, sans-serif' }}
                      >
                        最終ログイン
                      </span>
                    </div>
                    <div className="flex-1 py-6 flex items-center">
                      <div className="flex items-center gap-2">
                        <SelectInput
                          value={lastLoginMin}
                          onChange={(value: string) => setLastLoginMin(value)}
                          className="w-[358px]"
                          options={[
                            { value: '', label: '指定なし' },
                            { value: '1day', label: '1日以内' },
                            { value: '3day', label: '3日以内' },
                            { value: '1week', label: '1週間以内' },
                            { value: '2week', label: '2週間以内' },
                            { value: '1month', label: '1ヶ月以内' },
                            { value: '3month', label: '3ヶ月以内' },
                            { value: '6month', label: '6ヶ月以内' },
                            { value: '1year', label: '1年以内' },
                          ]}
                          placeholder="指定なし"
                        />
                        <span className="text-[#323232] text-[16px] font-bold tracking-[1.6px]">
                          以内
                        </span>
                      </div>
                    </div>
                  </div>

                  {/* 下部ボタン */}
                  <div className="flex justify-start gap-4 border-t-[2px] border-[#EFEFEF] pt-6 mt-5">
                    <Button
                      variant="green-gradient"
                      size="figma-default"
                      style={{ fontFamily: 'Noto Sans JP, sans-serif' }}
                      onClick={() => {
                        // タッチ済みにしてバリデーションをトリガー
                        setSearchGroupTouched(true);

                        // バリデーションチェック
                        if (searchGroup === '') {
                          setSearchGroupError('グループを選択してください。');
                          // エラーフィールドまでスクロール
                          const element = document.querySelector(
                            '[data-field="search-group"]',
                          );
                          if (element) {
                            element.scrollIntoView({
                              behavior: 'smooth',
                              block: 'center',
                            });
                          }
                        } else {
                          // 検索実行処理
                        }
                      }}
                    >
                      この条件で検索
                    </Button>
                    <Button
                      variant="green-outline"
                      size="figma-outline"
                      style={{ fontFamily: 'Noto Sans JP, sans-serif' }}
                      onClick={() => {
                        // タッチ済みにしてバリデーションをトリガー
                        setSearchGroupTouched(true);

                        // バリデーションチェック
                        if (searchGroup === '') {
                          setSearchGroupError('グループを選択してください。');
                          // エラーフィールドまでスクロール
                          const element = document.querySelector(
                            '[data-field="search-group"]',
                          );
                          if (element) {
                            element.scrollIntoView({
                              behavior: 'smooth',
                              block: 'center',
                            });
                          }
                        } else {
                          // 保存処理
                        }
                      }}
                    >
                      検索条件を保存
                    </Button>
                  </div>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="bg-[#f9f9f9] px-20 pt-10 pb-20">
        <div className="w-full max-w-[1280px] mx-auto">
          {/* Filters and Sort */}
          <div className="mb-6">
            <div className="flex items-center justify-between">
              {/* Filters */}
              <div className="flex items-center gap-6">
                <div className="flex items-center gap-2">
                  <Checkbox
                    checked={filters.pickup}
                    onChange={(checked: boolean) =>
                      setFilters((prev) => ({ ...prev, pickup: checked }))
                    }
                  />
                  <span
                    className="text-[16px] font-medium text-[#323232] tracking-[1.6px]"
                    style={{ fontFamily: 'Noto Sans JP, sans-serif' }}
                  >
                    ピックアップ済のみ︎
                  </span>
                </div>
                <div className="flex items-center gap-2">
                  <Checkbox
                    checked={filters.newUser}
                    onChange={(checked: boolean) =>
                      setFilters((prev) => ({ ...prev, newUser: checked }))
                    }
                  />
                  <span
                    className="text-[16px] font-medium text-[#323232] tracking-[1.6px]"
                    style={{ fontFamily: 'Noto Sans JP, sans-serif' }}
                  >
                    非表示を除く
                  </span>
                </div>
                <div className="flex items-center gap-2">
                  <Checkbox
                    checked={filters.lastLogin}
                    onChange={(checked: boolean) =>
                      setFilters((prev) => ({ ...prev, lastLogin: checked }))
                    }
                  />
                  <span
                    className="text-[16px] font-medium text-[#323232] tracking-[1.6px]"
                    style={{ fontFamily: 'Noto Sans JP, sans-serif' }}
                  >
                    スカウト済を除く
                  </span>
                </div>
                <div className="flex items-center gap-2">
                  <Checkbox
                    checked={filters.working}
                    onChange={(checked: boolean) =>
                      setFilters((prev) => ({ ...prev, working: checked }))
                    }
                  />
                  <span
                    className="text-[16px] font-medium text-[#323232] tracking-[1.6px]"
                    style={{ fontFamily: 'Noto Sans JP, sans-serif' }}
                  >
                    業種が同じ企業の選考中
                  </span>
                </div>
              </div>
            </div>
          </div>

          {/* Sort Tabs && Results Count */}
          <div className="flex mb-10 items-center justify-between">
            {/* Sort Tabs */}
            <div className="flex items-center">
              {(['featured', 'newest', 'updated', 'lastLogin'] as const).map(
                (sort) => (
                  <button
                    key={sort}
                    onClick={() => setSelectedSort(sort)}
                    className={`px-4 py-1 text-[14px] font-bold tracking-[1.4px] transition-colors border solid border-[#EFEFEF] ${
                      selectedSort === sort
                        ? 'bg-[#D2F1DA] text-[#0f9058]'
                        : 'bg-[#f9f9f9] text-[#999] hover:bg-[#efefef]'
                    }`}
                    style={{ fontFamily: 'Noto Sans JP, sans-serif' }}
                  >
                    {sort === 'featured' && '注目順'}
                    {sort === 'newest' && '新着順'}
                    {sort === 'updated' && '更新順'}
                    {sort === 'lastLogin' && '最終ログイン日順'}
                  </button>
                ),
              )}
            </div>

            {/* Results Count */}
            <div className="text-right">
              <span
                className="text-[12px] font-bold text-[#323232] tracking-[1.2px] flex items-center gap-2 "
                style={{ fontFamily: 'Noto Sans JP, sans-serif' }}
              >
                <svg
                  width="8"
                  height="8"
                  viewBox="0 0 8 8"
                  fill="none"
                  xmlns="http://www.w3.org/2000/svg"
                >
                  <path
                    d="M1.88172 3.59656C1.65858 3.8197 1.65858 4.18208 1.88172 4.40522L5.30914 7.83264C5.53228 8.05579 5.89466 8.05579 6.1178 7.83264C6.34094 7.60951 6.34094 7.24713 6.1178 7.02399L3.09381 4L6.11602 0.976012C6.33916 0.752873 6.33916 0.390494 6.11602 0.167355C5.89288 -0.0557849 5.5305 -0.0557849 5.30736 0.167355L1.87993 3.59478L1.88172 3.59656Z"
                    fill="#0F9058"
                  />
                </svg>
                1〜10件 / 1,000件
                <svg
                  width="8"
                  height="8"
                  viewBox="0 0 8 8"
                  fill="none"
                  xmlns="http://www.w3.org/2000/svg"
                >
                  <path
                    d="M6.11828 3.59656C6.34142 3.8197 6.34142 4.18208 6.11828 4.40522L2.69086 7.83264C2.46772 8.05579 2.10534 8.05579 1.8822 7.83264C1.65906 7.60951 1.65906 7.24713 1.8822 7.02399L4.90619 4L1.88398 0.976012C1.66084 0.752873 1.66084 0.390494 1.88398 0.167355C2.10712 -0.0557849 2.4695 -0.0557849 2.69264 0.167355L6.12007 3.59478L6.11828 3.59656Z"
                    fill="#0F9058"
                  />
                </svg>
              </span>
            </div>
          </div>

          {/* Candidate Cards */}
          <div className="space-y-2">
            {loading ? (
              <div className="flex items-center justify-center py-20">
                <div className="animate-pulse text-gray-500">読み込み中...</div>
              </div>
            ) : candidates.length === 0 ? (
              <div className="flex items-center justify-center py-20">
                <div className="text-gray-500">該当する候補者が見つかりませんでした</div>
              </div>
            ) : (
              candidates.map((candidate) => (
              <div
                key={candidate.id}
                className={`rounded-[10px] p-6 ${
                  candidate.isHidden
                    ? 'bg-[#efefef]'
                    : 'bg-white shadow-[0px_0px_20px_0px_rgba(0,0,0,0.05)]'
                }`}
              >
                <div className="flex gap-6">
                  {/* Actions */}
                  <div className="flex flex-col gap-6 w-8">
                    <button
                      onClick={() => togglePickup(candidate.id)}
                      className="w-8 h-8 flex items-center justify-center"
                    >
                      {candidate.isPickup ? (
                        <svg
                          width="32"
                          height="32"
                          viewBox="0 0 32 32"
                          fill="none"
                          xmlns="http://www.w3.org/2000/svg"
                        >
                          <path
                            d="M17.7409 1.4809C17.4197 0.809848 16.741 0.382812 15.9956 0.382812C15.2503 0.382812 14.5776 0.809848 14.2504 1.4809L10.3538 9.55188L1.65173 10.8452C0.924534 10.955 0.318538 11.4674 0.0943199 12.169C-0.129899 12.8706 0.0519 13.6453 0.573056 14.1639L6.88753 20.4535L5.39678 29.3419C5.27558 30.074 5.57858 30.8182 6.17852 31.2514C6.77845 31.6845 7.57231 31.7394 8.22678 31.3917L16.0017 27.2128L23.7766 31.3917C24.4311 31.7394 25.225 31.6906 25.8249 31.2514C26.4248 30.8121 26.7278 30.074 26.6066 29.3419L25.1098 20.4535L31.4243 14.1639C31.9455 13.6453 32.1333 12.8706 31.903 12.169C31.6728 11.4674 31.0728 10.955 30.3456 10.8452L21.6375 9.55188L17.7409 1.4809Z"
                            fill="#FFDA5F"
                          />
                        </svg>
                      ) : (
                        <svg
                          width="32"
                          height="32"
                          viewBox="0 0 32 32"
                          fill="none"
                          xmlns="http://www.w3.org/2000/svg"
                        >
                          <path
                            d="M17.7409 1.4809C17.4197 0.809848 16.741 0.382812 15.9956 0.382812C15.2503 0.382812 14.5776 0.809848 14.2504 1.4809L10.3538 9.55188L1.65173 10.8452C0.924534 10.955 0.318538 11.4674 0.0943199 12.169C-0.129898 12.8706 0.0519 13.6453 0.573056 14.1639L6.88753 20.4535L5.39678 29.3419C5.27558 30.074 5.57858 30.8182 6.17852 31.2514C6.77845 31.6845 7.57231 31.7394 8.22678 31.3917L16.0017 27.2128L23.7766 31.3917C24.4311 31.7394 25.225 31.6906 25.8249 31.2514C26.4248 30.8121 26.7278 30.074 26.6066 29.3419L25.1098 20.4535L31.4243 14.1639C31.9455 13.6453 32.1333 12.8706 31.903 12.169C31.6728 11.4674 31.0728 10.955 30.3456 10.8452L21.6375 9.55188L17.7409 1.4809Z"
                            fill="#DCDCDC"
                          />
                        </svg>
                      )}
                    </button>
                    <button
                      onClick={() => toggleHidden(candidate.id)}
                      className="w-8 h-8 flex items-center justify-center"
                    >
                      {candidate.isHidden ? (
                        <svg
                          width="32"
                          height="32"
                          viewBox="0 0 32 32"
                          fill="none"
                          xmlns="http://www.w3.org/2000/svg"
                        >
                          <path
                            d="M1.94025 3.43918C1.42026 3.02869 0.665269 3.1238 0.255277 3.64442C-0.154716 4.16504 -0.0597179 4.92094 0.460273 5.33143L30.0598 28.5591C30.5797 28.9696 31.3347 28.8745 31.7447 28.3538C32.1547 27.8332 32.0597 27.0773 31.5397 26.6668L26.2798 22.5419C28.2598 20.5095 29.5998 18.2318 30.2747 16.6149C30.4397 16.2194 30.4397 15.7789 30.2747 15.3834C29.5298 13.5963 27.9648 10.9932 25.6248 8.82058C23.2749 6.62797 20.0399 4.78578 16 4.78578C12.5901 4.78578 9.75011 6.10235 7.53515 7.8294L1.94025 3.43918ZM11.1551 10.6678C12.4301 9.50139 14.135 8.79055 16 8.79055C19.9749 8.79055 23.1999 12.0194 23.1999 15.9991C23.1999 17.2456 22.8849 18.417 22.3299 19.4382L20.3999 17.9264C20.8199 16.9603 20.9299 15.854 20.6399 14.7576C20.0849 12.6802 18.25 11.2835 16.21 11.1984C15.92 11.1884 15.75 11.5038 15.84 11.7841C15.945 12.1045 16.005 12.4449 16.005 12.8003C16.005 13.3109 15.885 13.7915 15.675 14.217L11.1601 10.6728L11.1551 10.6678ZM18.65 22.7021C17.83 23.0275 16.935 23.2077 16 23.2077C12.0251 23.2077 8.80013 19.9789 8.80013 15.9991C8.80013 15.6537 8.82512 15.3183 8.87012 14.9879L4.15521 11.2685C3.01523 12.7553 2.20024 14.237 1.72525 15.3834C1.56025 15.7789 1.56025 16.2194 1.72525 16.6149C2.47024 18.402 4.03521 21.0051 6.37517 23.1777C8.72513 25.3703 11.9601 27.2125 16 27.2125C18.39 27.2125 20.4949 26.5667 22.3099 25.5855L18.65 22.7021Z"
                            fill="#999999"
                          />
                        </svg>
                      ) : (
                        <svg
                          width="32"
                          height="32"
                          viewBox="0 0 32 32"
                          fill="none"
                          xmlns="http://www.w3.org/2000/svg"
                        >
                          <path
                            d="M1.94025 3.43918C1.42026 3.02869 0.665269 3.1238 0.255277 3.64442C-0.154716 4.16504 -0.0597179 4.92094 0.460273 5.33143L30.0598 28.5591C30.5797 28.9696 31.3347 28.8745 31.7447 28.3538C32.1547 27.8332 32.0597 27.0773 31.5397 26.6668L26.2798 22.5419C28.2598 20.5095 29.5998 18.2318 30.2747 16.6149C30.4397 16.2194 30.4397 15.7789 30.2747 15.3834C29.5298 13.5963 27.9648 10.9932 25.6248 8.82058C23.2749 6.62797 20.0399 4.78578 16 4.78578C12.5901 4.78578 9.75011 6.10235 7.53515 7.8294L1.94025 3.43918ZM11.1551 10.6678C12.4301 9.50139 14.135 8.79055 16 8.79055C19.9749 8.79055 23.1999 12.0194 23.1999 15.9991C23.1999 17.2456 22.8849 18.417 22.3299 19.4382L20.3999 17.9264C20.8199 16.9603 20.9299 15.854 20.6399 14.7576C20.0849 12.6802 18.25 11.2835 16.21 11.1984C15.92 11.1884 15.75 11.5038 15.84 11.7841C15.945 12.1045 16.005 12.4449 16.005 12.8003C16.005 13.3109 15.885 13.7915 15.675 14.217L11.1601 10.6728L11.1551 10.6678ZM18.65 22.7021C17.83 23.0275 16.935 23.2077 16 23.2077C12.0251 23.2077 8.80013 19.9789 8.80013 15.9991C8.80013 15.6537 8.82512 15.3183 8.87012 14.9879L4.15521 11.2685C3.01523 12.7553 2.20024 14.237 1.72525 15.3834C1.56025 15.7789 1.56025 16.2194 1.72525 16.6149C2.47024 18.402 4.03521 21.0051 6.37517 23.1777C8.72513 25.3703 11.9601 27.2125 16 27.2125C18.39 27.2125 20.4949 26.5667 22.3099 25.5855L18.65 22.7021Z"
                            fill="#DCDCDC"
                          />
                        </svg>
                      )}
                    </button>
                  </div>

                  {/* Candidate Info */}
                  <div className="flex-1">
                    {/* Badges */}
                    <div className="flex items-center gap-2 mb-2">
                      {candidate.isAttention && (
                        <div className="bg-[#ff9d00] px-5 py-0 h-8 rounded-[100px] flex items-center justify-center">
                          <span
                            className="text-white text-[12px] font-bold tracking-[1.2px]"
                            style={{ fontFamily: 'Noto Sans JP, sans-serif' }}
                          >
                            注目
                          </span>
                        </div>
                      )}
                      {candidate.badgeType === 'change' && (
                        <div className="bg-[#44b0ef] px-5 py-0 h-8 rounded-[8px] flex items-center gap-2">
                          <svg
                            width="16"
                            height="16"
                            viewBox="0 0 16 16"
                            fill="none"
                            xmlns="http://www.w3.org/2000/svg"
                          >
                            <path
                              d="M2.97062 6.24841C3.22734 5.53293 3.64409 4.86011 4.23088 4.28575C6.31465 2.23448 9.69202 2.23448 11.7758 4.28575L12.3459 4.85026H11.2023C10.6122 4.85026 10.1354 5.3196 10.1354 5.90052C10.1354 6.48144 10.6122 6.95077 11.2023 6.95077H14.9198H14.9331C15.5232 6.95077 16 6.48144 16 5.90052V2.22464C16 1.64372 15.5232 1.17438 14.9331 1.17438C14.343 1.17438 13.8662 1.64372 13.8662 2.22464V3.37991L13.2828 2.80227C10.3655 -0.0695081 5.63784 -0.0695081 2.72057 2.80227C1.90706 3.60309 1.32028 4.54503 0.9602 5.55262C0.763492 6.10072 1.05689 6.69805 1.61034 6.89169C2.16378 7.08533 2.77391 6.79651 2.97062 6.25169V6.24841ZM0.766826 9.09394C0.600125 9.14317 0.440092 9.23178 0.310065 9.36307C0.176703 9.49435 0.0866848 9.65188 0.0400084 9.82255C0.0300063 9.86193 0.0200042 9.9046 0.0133361 9.94727C0.00333401 10.0031 0 10.0589 0 10.1147V13.7774C0 14.3583 0.476766 14.8277 1.06689 14.8277C1.65701 14.8277 2.13378 14.3583 2.13378 13.7774V12.6254L2.72057 13.1998C5.63784 16.0683 10.3655 16.0683 13.2794 13.1998C14.0929 12.3989 14.6831 11.457 15.0431 10.4494C15.2398 9.90132 14.9464 9.30399 14.393 9.11035C13.8396 8.91671 13.2294 9.20553 13.0327 9.75034C12.776 10.4658 12.3592 11.1386 11.7725 11.713C9.68869 13.7643 6.31132 13.7643 4.22755 11.713L4.22421 11.7097L3.65409 11.1518H4.801C5.39112 11.1518 5.86789 10.6824 5.86789 10.1015C5.86789 9.5206 5.39112 9.05127 4.801 9.05127H1.08023C1.02688 9.05127 0.973536 9.05455 0.920192 9.06112C0.866847 9.06768 0.816837 9.07753 0.766826 9.09394Z"
                              fill="white"
                            />
                          </svg>

                          <span
                            className="text-white text-[12px] font-bold tracking-[1.2px]"
                            style={{ fontFamily: 'Noto Sans JP, sans-serif' }}
                          >
                            {candidate.badgeText}
                          </span>
                        </div>
                      )}
                      {candidate.badgeType === 'professional' && (
                        <div className="bg-[#b687e8] px-5 py-0 h-8 rounded-[8px] flex items-center gap-2">
                          <svg
                            width="16"
                            height="16"
                            viewBox="0 0 16 16"
                            fill="none"
                            xmlns="http://www.w3.org/2000/svg"
                          >
                            <path
                              d="M10 8C10 9.10457 9.10457 10 8 10C6.89543 10 6 9.10457 6 8C6 6.89543 6.89543 6 8 6C9.10457 6 10 6.89543 10 8Z"
                              fill="white"
                            />
                            <path
                              fill-rule="evenodd"
                              clip-rule="evenodd"
                              d="M0 8C0 3.58172 3.58172 0 8 0C12.4183 0 16 3.58172 16 8C16 12.4183 12.4183 16 8 16C3.58172 16 0 12.4183 0 8ZM8 1.33333C4.31803 1.33333 1.33333 4.31803 1.33333 8C1.33333 11.682 4.31803 14.6667 8 14.6667C11.682 14.6667 14.6667 11.682 14.6667 8C14.6667 4.31803 11.682 1.33333 8 1.33333Z"
                              fill="white"
                            />
                            <path
                              d="M7.33333 2V4H8.66667V2H7.33333Z"
                              fill="white"
                            />
                            <path
                              d="M7.33333 12V14H8.66667V12H7.33333Z"
                              fill="white"
                            />
                            <path
                              d="M2 7.33333H4V8.66667H2V7.33333Z"
                              fill="white"
                            />
                            <path
                              d="M12 7.33333H14V8.66667H12V7.33333Z"
                              fill="white"
                            />
                          </svg>
                          <span
                            className="text-white text-[12px] font-bold tracking-[1.2px]"
                            style={{ fontFamily: 'Noto Sans JP, sans-serif' }}
                          >
                            {candidate.badgeText}
                          </span>
                        </div>
                      )}
                      {candidate.badgeType === 'multiple' && (
                        <div className="bg-[#f182b4] px-5 py-0 h-8 rounded-[8px] flex items-center gap-2">
                          <svg
                            width="16"
                            height="16"
                            viewBox="0 0 16 16"
                            fill="none"
                            xmlns="http://www.w3.org/2000/svg"
                          >
                            <path
                              d="M0 0V6H2V2.94118L5.52941 6.47059L6.47059 5.52941L2.94118 2H6V0H0Z"
                              fill="white"
                            />
                            <path
                              d="M10 0V2H13.0588L9.52941 5.52941L10.4706 6.47059L14 2.94118V6H16V0H10Z"
                              fill="white"
                            />
                            <path
                              d="M2 13.0588V10H0V16H6V14H2.94118L6.47059 10.4706L5.52941 9.52941L2 13.0588Z"
                              fill="white"
                            />
                            <path
                              d="M13.0588 14H10V16H16V10H14V13.0588L10.4706 9.52941L9.52941 10.4706L13.0588 14Z"
                              fill="white"
                            />
                          </svg>
                          <span
                            className="text-white text-[12px] font-bold tracking-[1.2px]"
                            style={{ fontFamily: 'Noto Sans JP, sans-serif' }}
                          >
                            {candidate.badgeText}
                          </span>
                        </div>
                      )}
                    </div>

                    {/* Main Info */}
                    <div className="flex gap-10">
                      <div className="flex-1">
                        <div className="flex items-center gap-2 flex-wrap">
                          <h3
                            className="text-[#0f9058] text-[18px] font-bold tracking-[1.8px] truncate"
                            style={{
                              fontFamily: 'Noto Sans JP, sans-serif',
                              maxWidth: '323px',
                            }}
                          >
                            {candidate.companyName}
                          </h3>
                          <div className="border-l border-[#dcdcdc] h-7"></div>
                          <span
                            className="text-[#323232] text-[14px] font-medium tracking-[1.4px] truncate"
                            style={{
                              fontFamily: 'Noto Sans JP, sans-serif',
                              maxWidth: '300px',
                            }}
                          >
                            {candidate.department}
                          </span>
                          <div className="border-l border-[#dcdcdc] h-7"></div>
                          <span
                            className="text-[#323232] text-[14px] font-medium tracking-[1.4px] truncate"
                            style={{
                              fontFamily: 'Noto Sans JP, sans-serif',
                              maxWidth: '300px',
                            }}
                          >
                            {candidate.position}
                          </span>
                        </div>
                        <div className="flex gap-10 mt-2">
                          <span
                            className="text-[#323232] text-[12px] font-medium tracking-[1.2px]"
                            style={{ fontFamily: 'Noto Sans JP, sans-serif' }}
                          >
                            {candidate.location}／{candidate.age}／
                            {candidate.gender}／{candidate.salary}
                          </span>
                          <span
                            className="text-[#323232] text-[12px] font-medium tracking-[1.2px]"
                            style={{ fontFamily: 'Noto Sans JP, sans-serif' }}
                          >
                            {candidate.degree}／{candidate.university}
                          </span>
                          <span
                            className="text-[#323232] text-[12px] font-medium tracking-[1.2px]"
                            style={{ fontFamily: 'Noto Sans JP, sans-serif' }}
                          >
                            {candidate.language}／{candidate.languageLevel}
                          </span>
                        </div>
                      </div>
                      <div
                        className="text-[#999999] text-[12px] font-medium tracking-[1.2px]"
                        style={{ fontFamily: 'Noto Sans JP, sans-serif' }}
                      >
                        最終ログイン：{candidate.lastLogin}
                      </div>
                    </div>

                    {/* Experience */}
                    <div className="flex gap-5 xl:gap-10 my-6 flex-col xl:flex-row">
                      <div className="flex-1">
                        <div className="flex gap-6 items-center">
                          <span
                            className="text-[#999999] text-[12px] font-bold tracking-[1.2px] w-[65px]"
                            style={{ fontFamily: 'Noto Sans JP, sans-serif' }}
                          >
                            経験職種
                          </span>
                          <div className="flex gap-2 flex-wrap">
                            {candidate.experienceJobs.map((job, index) => (
                              <div
                                key={index}
                                className="bg-[#d2f1da] px-4 py-1 rounded-[5px]"
                              >
                                <span
                                  className="text-[#0f9058] text-[14px] font-medium tracking-[1.4px]"
                                  style={{
                                    fontFamily: 'Noto Sans JP, sans-serif',
                                  }}
                                >
                                  {job}
                                </span>
                              </div>
                            ))}
                          </div>
                        </div>
                      </div>
                      <div className="flex-1">
                        <div className="flex gap-6 items-center">
                          <span
                            className="text-[#999999] text-[12px] font-bold tracking-[1.2px] w-[65px]"
                            style={{ fontFamily: 'Noto Sans JP, sans-serif' }}
                          >
                            経験業種
                          </span>
                          <div className="flex gap-2 flex-wrap">
                            {candidate.experienceIndustries.map(
                              (industry, index) => (
                                <div
                                  key={index}
                                  className="bg-[#d2f1da] px-4 py-1 rounded-[5px]"
                                >
                                  <span
                                    className="text-[#0f9058] text-[14px] font-medium tracking-[1.4px]"
                                    style={{
                                      fontFamily: 'Noto Sans JP, sans-serif',
                                    }}
                                  >
                                    {industry}
                                  </span>
                                </div>
                              ),
                            )}
                          </div>
                        </div>
                      </div>
                    </div>

                    {/* Separator Line */}
                    <div className="border-t border-[#dcdcdc] mb-6"></div>

                    {/* Career History and Selection Companies */}
                    <div className="flex gap-5 xl:gap-10 flex-col xl:flex-row">
                      <div className="flex-1">
                        <div className="flex gap-6">
                          <span
                            className="text-[#999999] text-[12px] font-bold tracking-[1.2px]"
                            style={{ fontFamily: 'Noto Sans JP, sans-serif' }}
                          >
                            職務経歴
                          </span>
                          <div className="flex flex-col gap-2">
                            {candidate.careerHistory.map((career, index) => (
                              <div
                                key={index}
                                className="flex gap-4 items-start"
                              >
                                <span
                                  className="text-[#323232] text-[12px] font-medium tracking-[1.2px] w-[136px]"
                                  style={{
                                    fontFamily: 'Noto Sans JP, sans-serif',
                                  }}
                                >
                                  {career.period}
                                </span>
                                <span
                                  className="text-[#0f9058] text-[12px] font-bold tracking-[1.2px] underline w-40 truncate"
                                  style={{
                                    fontFamily: 'Noto Sans JP, sans-serif',
                                    maxWidth: '160px',
                                  }}
                                >
                                  {career.company}
                                </span>
                                <span
                                  className="text-[#323232] text-[12px] font-medium tracking-[1.2px] truncate flex-1 truncate xl:max-w-[100px] 2xl:max-w-[160px]"
                                  style={{
                                    fontFamily: 'Noto Sans JP, sans-serif',
                                  }}
                                >
                                  {career.role}
                                </span>
                              </div>
                            ))}
                          </div>
                        </div>
                      </div>
                      <div className="flex-1">
                        <div className="flex gap-4 ">
                          <span
                            className="text-[#999999] text-[12px] font-bold tracking-[1.2px]"
                            style={{ fontFamily: 'Noto Sans JP, sans-serif' }}
                          >
                            選考中企業
                          </span>
                          <div className="flex flex-col gap-2">
                            {candidate.selectionCompanies.map(
                              (selection, index) => (
                                <div
                                  key={index}
                                  className="flex gap-4 items-start"
                                >
                                  <span
                                    className="text-[#0f9058] text-[12px] font-bold tracking-[1.2px] underline w-40 truncate"
                                    style={{
                                      fontFamily: 'Noto Sans JP, sans-serif',
                                    }}
                                  >
                                    {selection.company}
                                  </span>
                                  <span
                                    className="text-[#323232] text-[12px] font-medium tracking-[1.2px] flex-1 truncate xl:max-w-[220px] 2xl:max-w-[300px]"
                                    style={{
                                      fontFamily: 'Noto Sans JP, sans-serif',
                                    }}
                                  >
                                    {selection.detail}
                                  </span>
                                </div>
                              ),
                            )}
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            ))
          )}
        </div>

          {/* Pagination */}
          <div className="flex justify-center items-center gap-4 mt-10">
            {/* Previous Button */}
            <button className="w-14 h-14 rounded-[32px] border border-[#0f9058] flex items-center justify-center hover:bg-[#e8f5ec] transition-colors">
              <svg
                width="16"
                height="16"
                viewBox="0 0 16 16"
                fill="none"
                xmlns="http://www.w3.org/2000/svg"
                className="rotate-180"
              >
                <path
                  d="M6 12L10 8L6 4"
                  stroke="#0f9058"
                  strokeWidth="2"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                />
              </svg>
            </button>

            {/* Page Numbers */}
            {[1, 9, 10, 11, 100].map((page) => (
              <button
                key={page}
                className={`w-14 h-14 rounded-[32px] flex items-center justify-center transition-colors ${
                  page === 10
                    ? 'bg-[#0f9058] text-white'
                    : 'border border-[#0f9058] text-[#0f9058] hover:bg-[#e8f5ec]'
                }`}
              >
                <span
                  className="text-[16px] font-bold tracking-[1.6px]"
                  style={{ fontFamily: 'Noto Sans JP, sans-serif' }}
                >
                  {page}
                </span>
              </button>
            ))}

            {/* Next Button */}
            <button className="w-14 h-14 rounded-[32px] border border-[#0f9058] flex items-center justify-center hover:bg-[#e8f5ec] transition-colors">
              <svg
                width="16"
                height="16"
                viewBox="0 0 16 16"
                fill="none"
                xmlns="http://www.w3.org/2000/svg"
              >
                <path
                  d="M6 12L10 8L6 4"
                  stroke="#0f9058"
                  strokeWidth="2"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                />
              </svg>
            </button>
          </div>
        </div>
      </div>

      {/* Modal Components */}
      <JobTypeSelectModal
        isOpen={isJobTypeModalOpen}
        onClose={() => setIsJobTypeModalOpen(false)}
        onConfirm={(selected) => {
          setExperienceJobTypes(
            selected.map((j) => ({ ...j, experienceYears: '' })),
          );
          setIsJobTypeModalOpen(false);
        }}
        initialSelected={experienceJobTypes}
        maxSelections={10}
      />

      <IndustrySelectModal
        isOpen={isIndustryModalOpen}
        onClose={() => setIsIndustryModalOpen(false)}
        onConfirm={(selected) => {
          setExperienceIndustries(
            selected.map((i) => ({ ...i, experienceYears: '' })),
          );
          setIsIndustryModalOpen(false);
        }}
        initialSelected={experienceIndustries}
        maxSelections={10}
      />

      <JobTypeSelectModal
        isOpen={isDesiredJobTypeModalOpen}
        onClose={() => setIsDesiredJobTypeModalOpen(false)}
        onConfirm={(selected) => {
          setDesiredJobTypes(selected);
          setIsDesiredJobTypeModalOpen(false);
        }}
        initialSelected={desiredJobTypes}
        maxSelections={10}
      />

      <IndustrySelectModal
        isOpen={isDesiredIndustryModalOpen}
        onClose={() => setIsDesiredIndustryModalOpen(false)}
        onConfirm={(selected) => {
          setDesiredIndustries(selected);
          setIsDesiredIndustryModalOpen(false);
        }}
        initialSelected={desiredIndustries}
        maxSelections={10}
      />

      <WorkLocationSelectModal
        isOpen={isDesiredLocationModalOpen}
        onClose={() => setIsDesiredLocationModalOpen(false)}
        onConfirm={(selected) => {
          setDesiredLocations(selected);
          setIsDesiredLocationModalOpen(false);
        }}
        initialSelected={desiredLocations}
      />

      <WorkStyleSelectModal
        isOpen={isWorkStyleModalOpen}
        onClose={() => setIsWorkStyleModalOpen(false)}
        onConfirm={(selected) => {
          setWorkStyles(selected);
          setIsWorkStyleModalOpen(false);
        }}
        initialSelected={workStyles}
        maxSelections={10}
      />
    </>
  );
}
