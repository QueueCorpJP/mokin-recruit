'use client';

import React, { useState, useEffect, useMemo } from 'react';
import { useSearchParams, useRouter } from 'next/navigation';
import { Checkbox } from '@/components/ui/checkbox';
import { SelectInput } from '@/components/ui/select-input';
import { Button } from '@/components/ui/button';
import { Pagination } from '@/components/ui/Pagination';
import JobTypeSelectModal from '@/components/career-status/JobTypeSelectModal';
import IndustrySelectModal from '@/components/career-status/IndustrySelectModal';
import WorkLocationSelectModal from '@/components/career-status/WorkLocationSelectModal';
import WorkStyleSelectModal from '@/components/career-status/WorkStyleSelectModal';
import { CandidateCard } from '@/components/company/CandidateCard';
import { filterCandidatesByConditions } from '@/lib/utils/candidateSearch';
import { getCandidatesFromDatabase, loadSearchParamsToStore, searchCandidatesWithConditions } from './actions';
import { saveCandidateAction, unsaveCandidateAction, getSavedCandidatesAction, toggleCandidateHiddenAction, getHiddenCandidatesAction } from './candidate-actions';
import { useSearchStore } from '../../../../stores/searchStore';
import ExperienceSearchConditionForm from '../components/ExperienceSearchConditionForm';
import SelectableTagWithYears from '../components/SelectableTagWithYears';
import { JOB_TYPE_GROUPS } from '@/constants/job-type-data';
import { INDUSTRY_GROUPS } from '@/constants/industry-data';
import { SALARY_OPTIONS, getFilteredMaxOptions, getFilteredMinOptions } from '@/lib/utils/salary-options';
import { AGE_OPTIONS, getFilteredMaxAgeOptions, getFilteredMinAgeOptions } from '@/lib/utils/age-options';
import type { JobType } from '@/constants/job-type-data';
import type { Industry } from '@/constants/industry-data';
import type { CandidateData } from '@/components/company/CandidateCard';


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


// 検索条件から表示用テキストを生成する関数
function generateSearchConditionText(searchStore: any): { title: string; description: string } {
  const conditions: string[] = [];
  
  
  // キーワード検索
  if (searchStore.keyword && searchStore.keyword.trim() && searchStore.keyword !== 'undefined') {
    conditions.push(`キーワード検索：${searchStore.keyword}`);
  }
  
  // 経験職種
  if (searchStore.experienceJobTypes && searchStore.experienceJobTypes.length > 0) {
    const jobTypeTexts = searchStore.experienceJobTypes
      .slice(0, 3) // 最大3つまで表示
      .filter((job: any) => job && job.name && job.name !== 'undefined')
      .map((job: any) => `${job.name}${job.experienceYears && job.experienceYears !== 'undefined' ? ` ${job.experienceYears}年` : ''}`);
    if (jobTypeTexts.length > 0) {
      const moreText = searchStore.experienceJobTypes.length > 3 ? '他' : '';
      conditions.push(`経験職種：${jobTypeTexts.join('/')}${moreText}`);
    }
  }
  
  // 経験業種
  if (searchStore.experienceIndustries && searchStore.experienceIndustries.length > 0) {
    const industryTexts = searchStore.experienceIndustries
      .slice(0, 3)
      .filter((industry: any) => industry && industry.name && industry.name !== 'undefined')
      .map((industry: any) => `${industry.name}${industry.experienceYears && industry.experienceYears !== 'undefined' ? ` ${industry.experienceYears}年` : ''}`);
    if (industryTexts.length > 0) {
      const moreText = searchStore.experienceIndustries.length > 3 ? '他' : '';
      conditions.push(`経験業種：${industryTexts.join('/')}${moreText}`);
    }
  }
  
  // 現在の年収
  const hasValidSalaryMin = searchStore.currentSalaryMin && searchStore.currentSalaryMin !== 'undefined' && searchStore.currentSalaryMin !== '';
  const hasValidSalaryMax = searchStore.currentSalaryMax && searchStore.currentSalaryMax !== 'undefined' && searchStore.currentSalaryMax !== '';
  if (hasValidSalaryMin || hasValidSalaryMax) {
    const min = hasValidSalaryMin ? `${searchStore.currentSalaryMin}万円` : '';
    const max = hasValidSalaryMax ? `${searchStore.currentSalaryMax}万円` : '';
    const separator = min && max ? '〜' : '';
    conditions.push(`現在の年収：${min}${separator}${max}`);
  }
  
  // 希望職種
  if (searchStore.desiredJobTypes && searchStore.desiredJobTypes.length > 0) {
    const jobTypeTexts = searchStore.desiredJobTypes
      .slice(0, 3)
      .filter((job: any) => job && job.name && job.name !== 'undefined')
      .map((job: any) => job.name);
    if (jobTypeTexts.length > 0) {
      const moreText = searchStore.desiredJobTypes.length > 3 ? '他' : '';
      conditions.push(`希望職種：${jobTypeTexts.join('/')}${moreText}`);
    }
  }
  
  // 希望業界
  if (searchStore.desiredIndustries && searchStore.desiredIndustries.length > 0) {
    const industryTexts = searchStore.desiredIndustries
      .slice(0, 3)
      .filter((industry: any) => industry && industry.name && industry.name !== 'undefined')
      .map((industry: any) => industry.name);
    if (industryTexts.length > 0) {
      const moreText = searchStore.desiredIndustries.length > 3 ? '他' : '';
      conditions.push(`希望業界：${industryTexts.join('/')}${moreText}`);
    }
  }

  // 年齢
  const hasValidAgeMin = searchStore.ageMin && searchStore.ageMin !== 'undefined' && searchStore.ageMin !== '';
  const hasValidAgeMax = searchStore.ageMax && searchStore.ageMax !== 'undefined' && searchStore.ageMax !== '';
  if (hasValidAgeMin || hasValidAgeMax) {
    const min = hasValidAgeMin ? `${searchStore.ageMin}歳` : '';
    const max = hasValidAgeMax ? `${searchStore.ageMax}歳` : '';
    const separator = min && max ? '〜' : '';
    conditions.push(`年齢：${min}${separator}${max}`);
  }

  // 勤務地
  if (searchStore.workLocations && searchStore.workLocations.length > 0) {
    const validLocations = searchStore.workLocations.filter((loc: any) => loc && loc !== 'undefined');
    if (validLocations.length > 0) {
      const locationText = validLocations.length > 2 
        ? `${validLocations.slice(0, 2).join('/')}他`
        : validLocations.join('/');
      conditions.push(`勤務地：${locationText}`);
    }
  }
  
  // 条件が何もない場合
  if (conditions.length === 0) {
    return {
      title: '条件を指定して検索',
      description: '検索条件を指定してください'
    };
  }
  
  // 最初の条件をタイトル、残りを説明にする
  return {
    title: conditions[0],
    description: conditions.slice(1).join('、')
  };
}

// 候補者データを取得する関数

interface SearchClientProps {
  initialCandidates?: CandidateData[];
  initialSearchParams?: any;
  initialCompanyGroups?: { value: string; label: string }[];
}

export default function SearchClient({ initialCandidates = [], initialSearchParams, initialCompanyGroups = [] }: SearchClientProps = {}) {
  const searchParams = useSearchParams();
  const router = useRouter();
  const searchStore = useSearchStore();
  const [isSearchBoxOpen, setIsSearchBoxOpen] = useState(false);
  const [selectedSort, setSelectedSort] = useState<SortType>('featured');
  const [openSelectId, setOpenSelectId] = useState<string | null>(null);
  const [candidates, setCandidates] = useState<CandidateData[]>([]);
  const [allCandidates, setAllCandidates] = useState<CandidateData[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [filters, setFilters] = useState({
    pickup: false,
    newUser: false,
    lastLogin: false,
    working: false,
    hideHidden: false,
  });
  const [companyGroups, setCompanyGroups] = useState<{ value: string; label: string }[]>(initialCompanyGroups);
  const [groupsLoading, setGroupsLoading] = useState(false);
  const [isHydrated, setIsHydrated] = useState(false);
  const [savedCandidateIds, setSavedCandidateIds] = useState<string[]>([]);
  const [hiddenCandidateIds, setHiddenCandidateIds] = useState<string[]>([]);

  // ページネーション関連のstate
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage] = useState(12); // 12件に戻す
  
  // フィルター処理
  const filteredCandidates = useMemo(() => {
    if (!candidates || candidates.length === 0) {
      return [];
    }
    
    return candidates.filter((candidate) => {
      // ピックアップフィルター
      if (filters.pickup && !candidate.isPickup) {
        return false;
      }
      
      // 新規ユーザーフィルター（例：1週間以内に登録）
      if (filters.newUser) {
        if (!candidate.lastLogin.includes('日前') && !candidate.lastLogin.includes('時間前')) {
          return false;
        }
      }
      
      // 最終ログインフィルター（例：1日以内）
      if (filters.lastLogin) {
        if (!candidate.lastLogin.includes('時間前') && !candidate.lastLogin.includes('1日前')) {
          return false;
        }
      }
      
      // 在職中フィルター
      if (filters.working) {
        const latestCareer = candidate.careerHistory?.[0];
        if (!latestCareer || !latestCareer.period.includes('〜現在')) {
          return false;
        }
      }
      
      // 非表示の候補者を除外するフィルター
      if (filters.hideHidden && hiddenCandidateIds.includes(candidate.id.toString())) {
        return false;
      }
      
      return true;
    });
  }, [candidates, filters.pickup, filters.newUser, filters.lastLogin, filters.working, filters.hideHidden, hiddenCandidateIds]);

  // ソート処理
  const sortedCandidates = useMemo(() => {
    const candidatesToSort = [...filteredCandidates];
    
    // 最終ログイン日時をパースする共通関数
    const parseLastLogin = (loginStr: string) => {
      if (loginStr.includes('時間前')) {
        const hours = parseInt(loginStr.replace('時間前', ''));
        return new Date(Date.now() - hours * 60 * 60 * 1000);
      }
      if (loginStr.includes('日前')) {
        const days = parseInt(loginStr.replace('日前', ''));
        return new Date(Date.now() - days * 24 * 60 * 60 * 1000);
      }
      if (loginStr.includes('週間前')) {
        const weeks = parseInt(loginStr.replace('週間前', ''));
        return new Date(Date.now() - weeks * 7 * 24 * 60 * 60 * 1000);
      }
      // 日本語の日付形式 "2024年1月15日" を解析
      const dateMatch = loginStr.match(/(\d{4})年(\d{1,2})月(\d{1,2})日/);
      if (dateMatch) {
        return new Date(parseInt(dateMatch[1]), parseInt(dateMatch[2]) - 1, parseInt(dateMatch[3]));
      }
      return new Date(0); // fallback
    };
    
    switch (selectedSort) {
      case 'featured':
        // 注目順：注目タブがついている候補者ユーザーを優先表示
        // いずれも上記条件内で、会員登録日時降順で表示
        return candidatesToSort.sort((a, b) => {
          // まず注目タブで分ける
          if (a.isAttention && !b.isAttention) return -1;
          if (!a.isAttention && b.isAttention) return 1;
          // 同じカテゴリ内では会員登録日時（ID）降順
          return b.id - a.id;
        });
        
      case 'newest':
        // 新着順：会員登録日時降順で候補者ユーザーを表示
        return candidatesToSort.sort((a, b) => b.id - a.id);
        
      case 'updated':
        // 更新順：会員情報の更新日時降順で候補者ユーザーを表示
        // いずれも上記条件内で、会員登録日時降順で表示
        return candidatesToSort.sort((a, b) => {
          // updatedAtがある場合はそれを使用、なければlastLoginを使用（暫定的に更新日時として扱う）
          const dateA = a.updatedAt ? new Date(a.updatedAt) : parseLastLogin(a.lastLogin);
          const dateB = b.updatedAt ? new Date(b.updatedAt) : parseLastLogin(b.lastLogin);
          const timeDiff = dateB.getTime() - dateA.getTime();
          // 更新日時が同じ場合は会員登録日時（ID）降順
          return timeDiff !== 0 ? timeDiff : b.id - a.id;
        });
        
      case 'lastLogin':
        // 最終ログイン日順：最終ログイン日時降順で候補者ユーザーを表示
        // いずれも上記条件内で、会員登録日時降順で表示
        return candidatesToSort.sort((a, b) => {
          const dateA = parseLastLogin(a.lastLogin);
          const dateB = parseLastLogin(b.lastLogin);
          const timeDiff = dateB.getTime() - dateA.getTime();
          // 最終ログイン日時が同じ場合は会員登録日時（ID）降順
          return timeDiff !== 0 ? timeDiff : b.id - a.id;
        });
        
      default:
        return candidatesToSort;
    }
  }, [filteredCandidates, selectedSort]);

  // ページネーション計算
  const totalPages = Math.ceil(sortedCandidates.length / itemsPerPage);
  const startIndex = (currentPage - 1) * itemsPerPage;
  const endIndex = startIndex + itemsPerPage;
  const paginatedCandidates = sortedCandidates.slice(startIndex, endIndex);

  // 検索条件表示テキスト生成 - searchStoreの値が変更されたら再計算
  const searchConditionText = useMemo(() => {
    return generateSearchConditionText(searchStore);
  }, [
    searchStore.keyword,
    searchStore.experienceJobTypes,
    searchStore.experienceIndustries,
    searchStore.currentSalaryMin,
    searchStore.currentSalaryMax,
    searchStore.workLocations,
    searchStore.desiredJobTypes,
    searchStore.desiredIndustries,
    searchStore.ageMin,
    searchStore.ageMax,
    searchStore.lastLoginMin,
    searchStore.lastLoginMax
  ]);

  // 検索実行ハンドラー
  const handleSearch = async () => {
    try {
      setLoading(true);
      setError(null);
      setCurrentPage(1); // ページを最初に戻す
      
      // URLパラメータを構築
      const params = new URLSearchParams();
      
      // 検索グループを必ず含める
      if (searchStore.searchGroup) {
        params.set('search_group', searchStore.searchGroup);
      }
      
      // 検索条件をURLパラメータに追加
      if (searchStore.keyword?.trim()) {
        params.set('keyword', searchStore.keyword.trim());
      }
      
      if (searchStore.experienceJobTypes?.length > 0) {
        const jobTypes = searchStore.experienceJobTypes
          .filter(jt => jt.name && jt.name !== 'undefined')
          .map(jt => jt.name);
        if (jobTypes.length > 0) {
          params.set('experience_job_types', jobTypes.join(','));
        }
      }
      
      if (searchStore.experienceIndustries?.length > 0) {
        const industries = searchStore.experienceIndustries
          .filter(ind => ind.name && ind.name !== 'undefined')
          .map(ind => ind.name);
        if (industries.length > 0) {
          params.set('experience_industries', industries.join(','));
        }
      }
      
      if (searchStore.currentSalaryMin) {
        params.set('current_salary_min', searchStore.currentSalaryMin);
      }
      
      if (searchStore.currentSalaryMax) {
        params.set('current_salary_max', searchStore.currentSalaryMax);
      }
      
      if (searchStore.ageMin) {
        params.set('age_min', searchStore.ageMin);
      }
      
      if (searchStore.ageMax) {
        params.set('age_max', searchStore.ageMax);
      }
      
      if (searchStore.desiredJobTypes?.length > 0) {
        const desiredJobTypes = searchStore.desiredJobTypes
          .filter(jt => jt.name && jt.name !== 'undefined')
          .map(jt => jt.name);
        if (desiredJobTypes.length > 0) {
          params.set('desired_job_types', desiredJobTypes.join(','));
        }
      }
      
      if (searchStore.desiredIndustries?.length > 0) {
        const desiredIndustries = searchStore.desiredIndustries
          .filter(ind => ind.name && ind.name !== 'undefined')
          .map(ind => ind.name);
        if (desiredIndustries.length > 0) {
          params.set('desired_industries', desiredIndustries.join(','));
        }
      }
      
      if (searchStore.desiredLocations?.length > 0) {
        const desiredLocations = searchStore.desiredLocations
          .filter(loc => loc.name && loc.name !== 'undefined')
          .map(loc => loc.name);
        if (desiredLocations.length > 0) {
          params.set('desired_locations', desiredLocations.join(','));
        }
      }
      
      if (searchStore.education) {
        params.set('education', searchStore.education);
      }
      
      if (searchStore.englishLevel) {
        params.set('english_level', searchStore.englishLevel);
      }
      
      if (searchStore.qualifications) {
        params.set('qualifications', searchStore.qualifications);
      }
      
      // URLを更新
      const newUrl = `${window.location.pathname}?${params.toString()}`;
      router.replace(newUrl);
      
      // 検索条件を構築
      const searchConditions = {
        keyword: searchStore.keyword,
        experienceJobTypes: searchStore.experienceJobTypes,
        experienceIndustries: searchStore.experienceIndustries,
        currentSalaryMin: searchStore.currentSalaryMin,
        currentSalaryMax: searchStore.currentSalaryMax,
        ageMin: searchStore.ageMin,
        ageMax: searchStore.ageMax,
        desiredJobTypes: searchStore.desiredJobTypes,
        desiredIndustries: searchStore.desiredIndustries,
        desiredLocations: searchStore.desiredLocations,
        education: searchStore.education,
        englishLevel: searchStore.englishLevel,
        qualifications: searchStore.qualifications,
      };
      
      const results = await searchCandidatesWithConditions(searchConditions);
      setCandidates(results);
      
      // 検索ボックスを閉じる
      setIsSearchBoxOpen(false);
      
      // ページトップにスクロール
      window.scrollTo({ top: 0, behavior: 'smooth' });
      
    } catch (err) {
      setError('検索に失敗しました。もう一度お試しください。');
      console.error('Search error:', err);
    } finally {
      setLoading(false);
    }
  };


  // Hydration完了のマーク
  useEffect(() => {
    setIsHydrated(true);
  }, []);

  // 初期検索パラメータを適用
  useEffect(() => {
    if (initialSearchParams && initialSearchParams.searchGroup) {
      searchStore.setSearchGroup(initialSearchParams.searchGroup);
    }
  }, [initialSearchParams]);

  // 保存された候補者を取得
  useEffect(() => {
    if (!isHydrated) return;
    
    
    if (!searchStore.searchGroup) return;
    
    const loadSavedCandidates = async () => {
      try {
        console.log('[DEBUG] Loading saved candidates for group:', searchStore.searchGroup);
        const result = await getSavedCandidatesAction(searchStore.searchGroup);
        if (result.success) {
          setSavedCandidateIds(result.data);
          console.log('[DEBUG] Loaded saved candidate IDs:', result.data);
        } else {
          console.error('Failed to load saved candidates');
        }
      } catch (error) {
        console.error('Error loading saved candidates:', error);
      }
    };

    const loadHiddenCandidates = async () => {
      try {
        console.log('[DEBUG] Loading hidden candidates for group:', searchStore.searchGroup);
        const result = await getHiddenCandidatesAction(searchStore.searchGroup);
        if (result.success) {
          setHiddenCandidateIds(result.data);
          console.log('[DEBUG] Loaded hidden candidate IDs:', result.data);
        } else {
          console.error('Failed to load hidden candidates');
        }
      } catch (error) {
        console.error('Error loading hidden candidates:', error);
      }
    };

    loadSavedCandidates();
    loadHiddenCandidates();
  }, [isHydrated, searchStore.searchGroup, companyGroups]);

  // 候補者データが変更された際に保存状態を反映
  useEffect(() => {
    if (savedCandidateIds.length === 0 || candidates.length === 0) return;
    
    setCandidates(prev => 
      prev.map(candidate => ({
        ...candidate,
        isPickup: savedCandidateIds.includes(String(candidate.id))
      }))
    );
  }, [savedCandidateIds]);

  // 初期データ読み込み
  useEffect(() => {
    if (!isHydrated) return;
    
    const loadInitialData = async () => {
      try {
        setLoading(true);
        setError(null);
        
        // 初期候補者データを設定
        if (initialCandidates.length > 0) {
          setAllCandidates(initialCandidates);
          setCandidates(initialCandidates);
        } else {
          const candidatesData = await getCandidatesFromDatabase();
          setAllCandidates(candidatesData);
          setCandidates(candidatesData);
        }
        
        // グループ情報は初期データで設定済み
      } catch (error) {
        console.error('Failed to load initial data:', error);
        setError('データの読み込みに失敗しました');
      } finally {
        setLoading(false);
      }
    };

    // URLパラメータから検索条件をストアに復元
    loadSearchParamsToStore(searchParams, searchStore);
    loadInitialData();
  }, [isHydrated]);

  // URLパラメータが変更された時の処理
  useEffect(() => {
    if (!isHydrated) return;
    
    // URLパラメータから検索条件をストアに復元
    loadSearchParamsToStore(searchParams, searchStore);
    console.log('[DEBUG] URL parameters changed, reloading search params');
  }, [searchParams, isHydrated]);

  // 初回のみ外部パラメータで検索実行
  useEffect(() => {
    if (!isHydrated || allCandidates.length === 0) return;
    
    // URLパラメータに検索条件がある場合（外部ページからのリンク）のみ自動検索
    const hasUrlParams = searchParams.get('keyword') || 
                        searchParams.get('experience_job_types') || 
                        searchParams.get('experience_industries') ||
                        searchParams.get('current_salary_min') ||
                        searchParams.get('current_salary_max') ||
                        searchParams.get('age_min') ||
                        searchParams.get('age_max') ||
                        searchParams.get('education');
    
    if (hasUrlParams) {
      // 外部パラメータがある場合は自動検索実行
      handleSearch();
    } else {
      // パラメータがない場合は全候補者を表示
      setCandidates(allCandidates);
      setCurrentPage(1);
    }
  }, [isHydrated, allCandidates]); // 依存関係を最小限に


  const togglePickup = async (id: string | number) => {
    const candidateId = String(id);
    const currentGroupId = searchStore.searchGroup;
    
    console.log('[DEBUG] togglePickup called with:', { candidateId, currentGroupId });
    
    if (!currentGroupId) {
      console.error('No group selected');
      return;
    }

    try {
      const currentCandidate = candidates.find(c => c.id === candidateId);
      const isSaved = savedCandidateIds.includes(candidateId);
      
      if (isSaved) {
        const result = await unsaveCandidateAction(candidateId, currentGroupId);
        if (result.success) {
          setSavedCandidateIds(prev => prev.filter(id => id !== candidateId));
        } else {
          console.error('Failed to unsave candidate:', result.error);
        }
      } else {
        const result = await saveCandidateAction(candidateId, currentGroupId);
        if (result.success) {
          setSavedCandidateIds(prev => [...prev, candidateId]);
        } else {
          console.error('Failed to save candidate:', result.error);
        }
      }

      setCandidates((prev) =>
        prev.map((candidate) =>
          candidate.id === candidateId
            ? { ...candidate, isPickup: !candidate.isPickup }
            : candidate,
        ),
      );
    } catch (error) {
      console.error('Error toggling pickup:', error);
    }
  };

  const toggleHidden = async (candidateId: string) => {
    const currentGroupId = searchStore.searchGroup;
    if (!currentGroupId) {
      console.error('No group selected');
      return;
    }
    
    // Optimistic update - update UI immediately
    const isCurrentlyHidden = hiddenCandidateIds.includes(candidateId);
    const newHiddenState = !isCurrentlyHidden;
    
    if (newHiddenState) {
      setHiddenCandidateIds(prev => [...prev, candidateId]);
    } else {
      setHiddenCandidateIds(prev => prev.filter(id => id !== candidateId));
    }
    
    try {
      const result = await toggleCandidateHiddenAction(candidateId, currentGroupId);
      if (!result.success) {
        // Revert on failure
        if (newHiddenState) {
          setHiddenCandidateIds(prev => prev.filter(id => id !== candidateId));
        } else {
          setHiddenCandidateIds(prev => [...prev, candidateId]);
        }
        console.error('Failed to toggle hidden status:', result.error);
      }
    } catch (error) {
      // Revert on error
      if (newHiddenState) {
        setHiddenCandidateIds(prev => prev.filter(id => id !== candidateId));
      } else {
        setHiddenCandidateIds(prev => [...prev, candidateId]);
      }
      console.error('Error toggling hidden:', error);
    }
  };

  // hydration前は基本的なレイアウトのみ表示
  if (!isHydrated) {
    return (
      <div className="min-h-screen bg-gray-100">
        <div className="bg-gradient-to-t from-[#17856f] to-[#229a4e] px-20 py-10">
          <div className="text-white">読み込み中...</div>
        </div>
      </div>
    );
  }

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
                    {searchConditionText.title}
                  </strong>
                  {searchConditionText.description && (
                    <span className="text-[14px] font-medium text-[#323232] tracking-[1.4px] ">
                      {searchConditionText.description}
                    </span>
                  )}
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
              <div className="p-10 pt-0">
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
                          value={searchStore.searchGroup}
                          onChange={(value) => {
                            searchStore.setSearchGroup(value);
                          }}
                          onBlur={() => {
                            searchStore.setSearchGroupTouched(true);
                          }}
                          className="w-[400px]"
                          error={searchStore.searchGroupTouched && (!searchStore.searchGroup || searchStore.searchGroup === '')}
                          options={[
                            { value: '', label: '未選択' },
                            ...companyGroups
                          ]}
                        />
                        {searchStore.searchGroupTouched && (!searchStore.searchGroup || searchStore.searchGroup === '') && (
                          <p className="text-[#ff0000] text-[12px] mt-2">
                            グループを選択してください。
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
                        value={searchStore.keyword}
                        onChange={(e) => searchStore.setKeyword(e.target.value)}
                        placeholder="検索したいワードを入力"
                        className="w-[400px] px-4 py-3 border border-[#999] rounded-[4px] text-[14px] tracking-[1.4px] text-[#323232] placeholder:text-[#999]"
                        style={{ fontFamily: 'Noto Sans JP, sans-serif' }}
                      />
                    </div>
                  </div>

                  {/* Experience conditions - using shared component */}
                  <ExperienceSearchConditionForm />

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
                          value={searchStore.currentSalaryMin}
                          className="min-w-60"
                          onChange={(value: string) =>
                            searchStore.setCurrentSalaryMin(value)
                          }
                          options={getFilteredMinOptions(searchStore.currentSalaryMax)}
                          placeholder="指定なし"
                        />
                        <span className="text-[#323232]">〜</span>
                        <SelectInput
                          value={searchStore.currentSalaryMax}
                          className="min-w-60"
                          onChange={(value: string) =>
                            searchStore.setCurrentSalaryMax(value)
                          }
                          options={getFilteredMaxOptions(searchStore.currentSalaryMin)}
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
                        value={searchStore.currentCompany}
                        onChange={(e) => searchStore.setCurrentCompany(e.target.value)}
                        placeholder="在籍企業を入力"
                        className="w-[400px] px-4 py-3 border border-[#999] rounded-[4px] text-[14px] tracking-[1.4px] text-[#323232] placeholder:text-[#999]"
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
                          value={searchStore.education}
                          className="w-[358px]"
                          onChange={(value: string) => searchStore.setEducation(value)}
                          options={[
                            { value: '', label: '指定なし' },
                            { value: 'middle', label: '中学校卒業' },
                            { value: 'high', label: '高等学校卒業' },
                            { value: 'technical_college', label: '高等専門学校卒業' },
                            { value: 'junior', label: '短期大学卒業' },
                            { value: 'vocational', label: '専門学校卒業' },
                            { value: 'university', label: '大学卒業（学士）' },
                            { value: 'master', label: '大学院修士課程修了（修士）' },
                            { value: 'doctorate', label: '大学院博士課程修了（博士）' },
                            { value: 'overseas_university', label: '海外大学卒業（学士）' },
                            { value: 'overseas_master', label: '海外大学院修了（修士）' },
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
                            value={searchStore.englishLevel}
                            onChange={(value: string) => searchStore.setEnglishLevel(value)}
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
                              value={searchStore.otherLanguage}
                              onChange={(value: string) =>
                                searchStore.setOtherLanguage(value)
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
                              value={searchStore.otherLanguageLevel}
                              onChange={(value: string) =>
                                searchStore.setOtherLanguageLevel(value)
                              }
                              options={[
                                { value: '', label: 'レベルの指定なし' },
                                { value: 'native', label: 'ネイティブ' },
                                { value: 'business', label: 'ビジネスレベル' },
                                { value: 'conversation', label: '日常会話' },
                                { value: 'basic', label: '基礎会話' },
                              ]}
                              placeholder="レベルの指定なし"
                              style={!searchStore.otherLanguageLevel || searchStore.otherLanguageLevel === '' 
                                ? { backgroundColor: '#EFEFEF', color: '#999', border: 'none' } 
                                : undefined}
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
                        value={searchStore.qualifications}
                        onChange={(e) => searchStore.setQualifications(e.target.value)}
                        placeholder="保有資格を入力"
                        className="w-[400px] font-medium px-4 py-3 border border-[#999] rounded-[4px] text-[14px] tracking-[1.4px] text-[#323232] placeholder:text-[#999]"
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
                          value={searchStore.ageMin}
                          onChange={(value: string) => searchStore.setAgeMin(value)}
                          className="w-60"
                          options={getFilteredMinAgeOptions(searchStore.ageMax)}
                          placeholder="指定なし"
                        />
                        <span className="text-[#323232]">〜</span>
                        <SelectInput
                          value={searchStore.ageMax}
                          className="w-60"
                          onChange={(value: string) => searchStore.setAgeMax(value)}
                          options={getFilteredMaxAgeOptions(searchStore.ageMin)}
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
                          onClick={() => searchStore.setIsDesiredJobTypeModalOpen(true)}
                          className="w-[170px] py-[12px] bg-white border border-[#999999] rounded-[32px] text-[14px] font-bold text-[#323232] tracking-[1.4px]"
                          style={{ fontFamily: 'Noto Sans JP, sans-serif' }}
                        >
                          職種を選択
                        </button>
                        {searchStore.desiredJobTypes.length > 0 && (
                          <div className="flex flex-wrap gap-2 mt-4">
                            {searchStore.desiredJobTypes.map((job) => (
                              <div
                                key={job.id}
                                className="inline-flex bg-[#d2f1da] gap-2.5 h-10 items-center justify-center px-6 py-0 rounded-[10px] cursor-pointer"
                                onClick={() => {
                                  searchStore.setDesiredJobTypes(
                                    searchStore.desiredJobTypes.filter(
                                      (j) => j.id !== job.id,
                                    ),
                                  );
                                }}
                              >
                                <span className="font-['Noto_Sans_JP'] font-medium text-[14px] leading-[1.6] tracking-[1.4px] text-[#0f9058]">
                                  {job.name}
                                </span>
                                <svg className="w-3 h-3" fill="none" viewBox="0 0 12 12">
                                  <path
                                    d="M0.207031 0.207031C0.482709 -0.0685565 0.929424 -0.0685933 1.20508 0.207031L6.00098 5.00195L10.7949 0.208984C11.0706 -0.0666642 11.5173 -0.0666642 11.793 0.208984C12.0685 0.48464 12.0686 0.931412 11.793 1.20703L6.99902 6L11.793 10.7939L11.8184 10.8203C12.0684 11.0974 12.0599 11.5251 11.793 11.792C11.5259 12.0589 11.0984 12.0667 10.8213 11.8164L10.7949 11.792L6.00098 6.99805L1.20508 11.7939L1.17871 11.8193C0.9016 12.0693 0.473949 12.0608 0.207031 11.7939C-0.0598942 11.527 -0.0683679 11.0994 0.181641 10.8223L0.207031 10.7959L5.00195 6L0.207031 1.20508C-0.0686416 0.929435 -0.0686416 0.482674 0.207031 0.207031Z"
                                    fill="#0F9058"
                                  />
                                </svg>
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
                          onClick={() => searchStore.setIsDesiredIndustryModalOpen(true)}
                          className="w-[170px] py-[12px] bg-white border border-[#999999] rounded-[32px] text-[14px] font-bold text-[#323232] tracking-[1.4px]"
                          style={{ fontFamily: 'Noto Sans JP, sans-serif' }}
                        >
                          業種を選択
                        </button>
                        {searchStore.desiredIndustries.length > 0 && (
                          <div className="flex flex-wrap gap-2 mt-4">
                            {searchStore.desiredIndustries.map((industry) => (
                              <div
                                key={industry.id}
                                className="inline-flex bg-[#d2f1da] gap-2.5 h-10 items-center justify-center px-6 py-0 rounded-[10px] cursor-pointer"
                                onClick={() => {
                                  searchStore.setDesiredIndustries(
                                    searchStore.desiredIndustries.filter(
                                      (i) => i.id !== industry.id,
                                    ),
                                  );
                                }}
                              >
                                <span className="font-['Noto_Sans_JP'] font-medium text-[14px] leading-[1.6] tracking-[1.4px] text-[#0f9058]">
                                  {industry.name}
                                </span>
                                <svg className="w-3 h-3" fill="none" viewBox="0 0 12 12">
                                  <path
                                    d="M0.207031 0.207031C0.482709 -0.0685565 0.929424 -0.0685933 1.20508 0.207031L6.00098 5.00195L10.7949 0.208984C11.0706 -0.0666642 11.5173 -0.0666642 11.793 0.208984C12.0685 0.48464 12.0686 0.931412 11.793 1.20703L6.99902 6L11.793 10.7939L11.8184 10.8203C12.0684 11.0974 12.0599 11.5251 11.793 11.792C11.5259 12.0589 11.0984 12.0667 10.8213 11.8164L10.7949 11.792L6.00098 6.99805L1.20508 11.7939L1.17871 11.8193C0.9016 12.0693 0.473949 12.0608 0.207031 11.7939C-0.0598942 11.527 -0.0683679 11.0994 0.181641 10.8223L0.207031 10.7959L5.00195 6L0.207031 1.20508C-0.0686416 0.929435 -0.0686416 0.482674 0.207031 0.207031Z"
                                    fill="#0F9058"
                                  />
                                </svg>
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
                          value={searchStore.desiredSalaryMin}
                          className="w-60"
                          onChange={(value: string) =>
                            searchStore.setDesiredSalaryMin(value)
                          }
                          options={getFilteredMinOptions(searchStore.desiredSalaryMax)}
                          placeholder="指定なし"
                        />
                        <span className="text-[#323232]">〜</span>
                        <SelectInput
                          value={searchStore.desiredSalaryMax}
                          className="w-60"
                          onChange={(value: string) =>
                            searchStore.setDesiredSalaryMax(value)
                          }
                          options={getFilteredMaxOptions(searchStore.desiredSalaryMin)}
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
                          onClick={() => searchStore.setIsDesiredLocationModalOpen(true)}
                          className="w-[170px] py-[12px] bg-white border border-[#999999] rounded-[32px] text-[14px] font-bold text-[#323232] tracking-[1.4px]"
                          style={{ fontFamily: 'Noto Sans JP, sans-serif' }}
                        >
                          勤務地を選択
                        </button>
                        {searchStore.desiredLocations.length > 0 && (
                          <div className="flex flex-wrap gap-2">
                            {searchStore.desiredLocations.map((location) => (
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
                                    searchStore.setDesiredLocations(
                                      searchStore.desiredLocations.filter(
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
                        value={searchStore.transferTime}
                        className="w-[400px]"
                        onChange={(value: string) => searchStore.setTransferTime(value)}
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
                  <div className="flex gap-6 items-strech pt-6 mt-5">
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
                          onClick={() => searchStore.setIsWorkStyleModalOpen(true)}
                          className="w-[170px] py-[12px] bg-white border border-[#999999] rounded-[32px] text-[14px] font-bold text-[#323232] tracking-[1.4px]"
                          style={{ fontFamily: 'Noto Sans JP, sans-serif' }}
                        >
                          働き方を選択
                        </button>
                        {searchStore.workStyles.length > 0 && (
                          <div className="flex flex-wrap gap-2">
                            {searchStore.workStyles.map((style) => (
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
                                    searchStore.setWorkStyles(
                                      searchStore.workStyles.filter(
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
                  <div className="border-t-[2px] border-[#EFEFEF] mt-5 mb-5"></div>

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
                        value={searchStore.selectionStatus}
                        className="w-[400px]"
                        onChange={(value: string) => searchStore.setSelectionStatus(value)}
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
                              value={searchStore.similarCompanyIndustry}
                              onChange={(value: string) =>
                                searchStore.setSimilarCompanyIndustry(value)
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
                              value={searchStore.similarCompanyLocation}
                              onChange={(value: string) =>
                                searchStore.setSimilarCompanyLocation(value)
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
                          value={searchStore.lastLoginMin}
                          onChange={(value: string) => searchStore.setLastLoginMin(value)}
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
                      onClick={async () => {
                        // タッチ済みにしてバリデーションをトリガー
                        searchStore.setSearchGroupTouched(true);

                        // バリデーションチェック
                        if (!searchStore.searchGroup || searchStore.searchGroup === '') {
                          searchStore.setSearchGroupError('グループを選択してください。');
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
                          await handleSearch();
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
                        searchStore.setSearchGroupTouched(true);

                        // バリデーションチェック
                        if (!searchStore.searchGroup || searchStore.searchGroup === '') {
                          searchStore.setSearchGroupError('グループを選択してください。');
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
                    onChange={(checked: boolean) => {
                      setFilters((prev) => ({ ...prev, pickup: checked }));
                      setCurrentPage(1);
                    }}
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
                    checked={filters.hideHidden}
                    onChange={(checked: boolean) => {
                      setFilters((prev) => ({ ...prev, hideHidden: checked }));
                      setCurrentPage(1);
                    }}
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
                    checked={filters.newUser}
                    onChange={(checked: boolean) => {
                      setFilters((prev) => ({ ...prev, newUser: checked }));
                      setCurrentPage(1);
                    }}
                  />
                  <span
                    className="text-[16px] font-medium text-[#323232] tracking-[1.6px]"
                    style={{ fontFamily: 'Noto Sans JP, sans-serif' }}
                  >
                    新規ユーザー
                  </span>
                </div>
                <div className="flex items-center gap-2">
                  <Checkbox
                    checked={filters.lastLogin}
                    onChange={(checked: boolean) => {
                      setFilters((prev) => ({ ...prev, lastLogin: checked }));
                      setCurrentPage(1);
                    }}
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
                    onChange={(checked: boolean) => {
                      setFilters((prev) => ({ ...prev, working: checked }));
                      setCurrentPage(1);
                    }}
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
                    type="button"
                    onClick={(e) => {
                      e.preventDefault();
                      e.stopPropagation();
                      setSelectedSort(sort);
                      setCurrentPage(1); // ソート変更時にページを最初に戻す
                    }}
                    className={`relative px-4 py-1 text-[14px] font-bold tracking-[1.4px] transition-colors border solid border-[#EFEFEF] cursor-pointer select-none ${
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
                {sortedCandidates.length > 0 ? `${startIndex + 1}〜${Math.min(endIndex, sortedCandidates.length)}件` : '0件'} / {sortedCandidates.length}件
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
            ) : sortedCandidates.length === 0 ? (
              <div className="flex items-center justify-center py-20">
                <div className="text-gray-500">該当する候補者が見つかりませんでした</div>
              </div>
            ) : (
              paginatedCandidates.map((candidate) => (
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
                      {savedCandidateIds.includes(candidate.id.toString()) ? (
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
                      onClick={() => toggleHidden(candidate.id.toString())}
                      className="w-8 h-8 flex items-center justify-center"
                    >
                      {hiddenCandidateIds.includes(candidate.id.toString()) ? (
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
                              d="M10.75 0H15.25C15.6656 0 16 0.334375 16 0.75V5.25C16 5.55312 15.8188 5.82812 15.5375 5.94375C15.2563 6.05937 14.9344 5.99687 14.7188 5.78125L13.5 4.5625L10.7812 7.28125C10.4875 7.575 10.0125 7.575 9.72188 7.28125L8.72188 6.28125C8.42813 5.9875 8.42813 5.5125 8.72188 5.22188L11.4406 2.50312L10.2188 1.28125C10.0031 1.06562 9.94062 0.74375 10.0562 0.4625C10.1719 0.18125 10.4469 0 10.75 0ZM5.25 16H0.75C0.334375 16 0 15.6656 0 15.25V10.75C0 10.4469 0.18125 10.1719 0.4625 10.0562C0.74375 9.94062 1.06562 10.0031 1.28125 10.2188L2.5 11.4375L5.21875 8.71875C5.5125 8.425 5.9875 8.425 6.27812 8.71875L7.27812 9.71875C7.57187 10.0125 7.57187 10.4875 7.27812 10.7781L4.55937 13.4969L5.77812 14.7156C5.99375 14.9312 6.05625 15.2531 5.94063 15.5344C5.825 15.8156 5.55 15.9969 5.24687 15.9969L5.25 16Z"
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
                            英語／{candidate.languageLevel}
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

          {/* ページネーション */}
          <Pagination
            currentPage={currentPage}
            totalPages={totalPages}
            onPageChange={setCurrentPage}
            className="mt-10"
          />
        </div>
      </div>

      {/* Modal Components */}
      <JobTypeSelectModal
        isOpen={searchStore.isJobTypeModalOpen}
        onClose={() => searchStore.setIsJobTypeModalOpen(false)}
        onConfirm={(selected) => {
          searchStore.setExperienceJobTypes(
            selected.map((name) => ({ id: name, name, experienceYears: '' })),
          );
          searchStore.setIsJobTypeModalOpen(false);
        }}
        initialSelected={searchStore.experienceJobTypes.map(j => j.name)}
        maxSelections={10}
      />

      <IndustrySelectModal
        isOpen={searchStore.isIndustryModalOpen}
        onClose={() => searchStore.setIsIndustryModalOpen(false)}
        onConfirm={(selected) => {
          searchStore.setExperienceIndustries(
            selected.map((name) => ({ id: name, name, experienceYears: '' })),
          );
          searchStore.setIsIndustryModalOpen(false);
        }}
        initialSelected={searchStore.experienceIndustries.map(i => i.name)}
        maxSelections={10}
      />

      <JobTypeSelectModal
        isOpen={searchStore.isDesiredJobTypeModalOpen}
        onClose={() => searchStore.setIsDesiredJobTypeModalOpen(false)}
        onConfirm={(selected) => {
          searchStore.setDesiredJobTypes(
            selected.map((name) => ({ id: name, name }))
          );
          searchStore.setIsDesiredJobTypeModalOpen(false);
        }}
        initialSelected={searchStore.desiredJobTypes.map(j => j.name)}
        maxSelections={10}
      />

      <IndustrySelectModal
        isOpen={searchStore.isDesiredIndustryModalOpen}
        onClose={() => searchStore.setIsDesiredIndustryModalOpen(false)}
        onConfirm={(selected) => {
          searchStore.setDesiredIndustries(
            selected.map((name) => ({ id: name, name }))
          );
          searchStore.setIsDesiredIndustryModalOpen(false);
        }}
        initialSelected={searchStore.desiredIndustries.map(i => i.name)}
        maxSelections={10}
      />

      <WorkLocationSelectModal
        isOpen={searchStore.isDesiredLocationModalOpen}
        onClose={() => searchStore.setIsDesiredLocationModalOpen(false)}
        onConfirm={(selected) => {
          searchStore.setDesiredLocations(selected);
          searchStore.setIsDesiredLocationModalOpen(false);
        }}
        initialSelected={searchStore.desiredLocations}
      />

      <WorkStyleSelectModal
        isOpen={searchStore.isWorkStyleModalOpen}
        onClose={() => searchStore.setIsWorkStyleModalOpen(false)}
        onConfirm={(selected) => {
          searchStore.setWorkStyles(selected);
          searchStore.setIsWorkStyleModalOpen(false);
        }}
        initialSelected={searchStore.workStyles}
        maxSelections={6}
      />
    </>
  );
}
