'use client';

import React, { useState } from 'react';
import { useRouter } from 'next/navigation';
import { Button } from '@/components/ui/button';
import SearchConditionForm from './components/SearchConditionForm';
import DesiredConditionForm from './components/DesiredConditionForm';
import JobTypeSelectModal from '@/components/career-status/JobTypeSelectModal';
import IndustrySelectModal from '@/components/career-status/IndustrySelectModal';
import WorkLocationSelectModal from '@/components/career-status/WorkLocationSelectModal';
import WorkStyleSelectModal from '@/components/career-status/WorkStyleSelectModal';
import { useSearchStore } from '@/stores/searchStore';
import { saveSearchHistory } from '@/lib/actions/search-history';
import { generateSearchTitle } from '@/lib/utils/search-history';

interface SearchFormProps {
  companyId: string;
}

export default function SearchForm({ companyId: _companyId }: SearchFormProps) {
  const router = useRouter();
  const [isSearching, setIsSearching] = useState(false);
  const [isSaving, setIsSaving] = useState(false);

  // Modal states (moved from searchStore)
  const [isJobTypeModalOpen, setIsJobTypeModalOpen] = useState(false);
  const [isIndustryModalOpen, setIsIndustryModalOpen] = useState(false);
  const [isDesiredJobTypeModalOpen, setIsDesiredJobTypeModalOpen] =
    useState(false);
  const [isDesiredIndustryModalOpen, setIsDesiredIndustryModalOpen] =
    useState(false);
  const [isDesiredLocationModalOpen, setIsDesiredLocationModalOpen] =
    useState(false);
  const [isWorkStyleModalOpen, setIsWorkStyleModalOpen] = useState(false);

  // Validation states (moved from searchStore)
  const [searchGroupTouched, setSearchGroupTouched] = useState(false);
  const [searchGroupError, setSearchGroupError] = useState('');

  const searchStore = useSearchStore();

  return (
    <>
      <div className='bg-white rounded-[10px]'>
        <div className='p-10'>
          <div className='flex flex-col gap-2'>
            {/* Search condition form */}
            <SearchConditionForm
              searchGroupTouched={searchGroupTouched}
              searchGroupError={searchGroupError}
              setSearchGroupTouched={setSearchGroupTouched}
              setSearchGroupError={setSearchGroupError}
              isJobTypeModalOpen={isJobTypeModalOpen}
              setIsJobTypeModalOpen={setIsJobTypeModalOpen}
              isIndustryModalOpen={isIndustryModalOpen}
              setIsIndustryModalOpen={setIsIndustryModalOpen}
            />

            {/* Desired condition form */}
            <DesiredConditionForm
              setIsDesiredJobTypeModalOpen={setIsDesiredJobTypeModalOpen}
              setIsDesiredIndustryModalOpen={setIsDesiredIndustryModalOpen}
              setIsDesiredLocationModalOpen={setIsDesiredLocationModalOpen}
              setIsWorkStyleModalOpen={setIsWorkStyleModalOpen}
            />

            {/* 下部ボタン */}
            <div className='flex justify-start gap-4 border-t-[2px] border-[#EFEFEF] pt-6 mt-5'>
              <Button
                variant='green-gradient'
                size='figma-default'
                style={{ fontFamily: 'Noto Sans JP, sans-serif' }}
                disabled={isSearching || isSaving}
                onClick={async () => {
                  console.log('[DEBUG SearchForm] Search button clicked');
                  console.log(
                    '[DEBUG SearchForm] searchGroup before validation:',
                    searchStore.searchGroup
                  );

                  setIsSearching(true);

                  // タッチ済みにしてバリデーションをトリガー
                  setSearchGroupTouched(true);

                  // バリデーションチェック
                  const isValid =
                    !!searchStore.searchGroup && searchStore.searchGroup !== '';
                  if (!isValid) {
                    setSearchGroupError('検索グループを選択してください');
                  } else {
                    setSearchGroupError('');
                  }
                  console.log('[DEBUG SearchForm] Validation result:', isValid);
                  if (isValid) {
                    try {
                      console.log(
                        '[DEBUG SearchForm] About to save search history from form'
                      );
                      console.log('[DEBUG SearchForm] Search store values:', {
                        searchGroup: searchStore.searchGroup,
                        keyword: searchStore.keyword,
                        experienceJobTypes: searchStore.experienceJobTypes,
                        experienceIndustries: searchStore.experienceIndustries,
                      });

                      // SearchConditions型に合わせたフォーマット
                      const searchConditions = {
                        keywords: searchStore.keyword
                          ? [searchStore.keyword]
                          : [],
                        age_min: searchStore.ageMin
                          ? parseInt(searchStore.ageMin)
                          : undefined,
                        age_max: searchStore.ageMax
                          ? parseInt(searchStore.ageMax)
                          : undefined,
                        job_types: searchStore.experienceJobTypes.map(
                          j => j.name
                        ),
                        industries: searchStore.experienceIndustries.map(
                          i => i.name
                        ),
                        locations: searchStore.desiredLocations.map(
                          l => l.name
                        ),
                        work_styles: searchStore.workStyles.map(w => w.name),
                        education_levels: searchStore.education
                          ? [searchStore.education]
                          : [],
                        skills: searchStore.qualifications
                          ? searchStore.qualifications
                              .split(',')
                              .filter(Boolean)
                          : [],
                        salary_min: searchStore.currentSalaryMin
                          ? parseInt(searchStore.currentSalaryMin)
                          : undefined,
                        salary_max: searchStore.currentSalaryMax
                          ? parseInt(searchStore.currentSalaryMax)
                          : undefined,
                        language_skills: [],
                        // その他の検索条件
                        desired_job_types: searchStore.desiredJobTypes.map(
                          j => j.name
                        ),
                        desired_industries: searchStore.desiredIndustries.map(
                          i => i.name
                        ),
                        desired_salary_min: searchStore.desiredSalaryMin
                          ? parseInt(searchStore.desiredSalaryMin)
                          : undefined,
                        desired_salary_max: searchStore.desiredSalaryMax
                          ? parseInt(searchStore.desiredSalaryMax)
                          : undefined,
                        current_company: searchStore.currentCompany,
                        english_level: searchStore.englishLevel,
                        other_language: searchStore.otherLanguage,
                        other_language_level: searchStore.otherLanguageLevel,
                        transfer_time: searchStore.transferTime,
                        selection_status: searchStore.selectionStatus,
                        similar_company_industry:
                          searchStore.similarCompanyIndustry,
                        similar_company_location:
                          searchStore.similarCompanyLocation,
                        last_login_min: searchStore.lastLoginMin,
                        job_type_and_search: searchStore.jobTypeAndSearch,
                        industry_and_search: searchStore.industryAndSearch,
                      };

                      const searchTitle = generateSearchTitle(searchConditions);
                      console.log(
                        '[DEBUG SearchForm] Generated search title:',
                        searchTitle
                      );
                      console.log(
                        '[DEBUG SearchForm] About to call saveSearchHistory'
                      );

                      await saveSearchHistory({
                        group_id: searchStore.searchGroup,
                        search_conditions: searchConditions,
                        search_title: searchTitle,
                        is_saved: false,
                      });

                      console.log(
                        '[DEBUG SearchForm] saveSearchHistory completed'
                      );
                    } catch (error) {
                      console.error('Failed to save search history:', error);
                      // エラーが発生しても検索は続行
                    }

                    // 検索条件をURLパラメータとして結果ページに遷移
                    const searchParams = new URLSearchParams();

                    // 基本検索条件
                    if (searchStore.searchGroup)
                      searchParams.set('search_group', searchStore.searchGroup);
                    if (searchStore.keyword)
                      searchParams.set('keyword', searchStore.keyword);

                    // 経験職種・業界
                    if (searchStore.experienceJobTypes.length > 0) {
                      searchParams.set(
                        'experience_job_types',
                        searchStore.experienceJobTypes
                          .map(j => j.name)
                          .join(',')
                      );
                    }
                    if (searchStore.experienceIndustries.length > 0) {
                      searchParams.set(
                        'experience_industries',
                        searchStore.experienceIndustries
                          .map(i => i.name)
                          .join(',')
                      );
                    }

                    // 給与
                    if (searchStore.currentSalaryMin)
                      searchParams.set(
                        'current_salary_min',
                        searchStore.currentSalaryMin
                      );
                    if (searchStore.currentSalaryMax)
                      searchParams.set(
                        'current_salary_max',
                        searchStore.currentSalaryMax
                      );

                    // 企業・学歴
                    if (searchStore.currentCompany)
                      searchParams.set(
                        'current_company',
                        searchStore.currentCompany
                      );
                    if (searchStore.education)
                      searchParams.set('education', searchStore.education);
                    if (searchStore.englishLevel)
                      searchParams.set(
                        'english_level',
                        searchStore.englishLevel
                      );
                    if (searchStore.qualifications)
                      searchParams.set(
                        'qualifications',
                        searchStore.qualifications
                      );
                    if (searchStore.otherLanguage)
                      searchParams.set(
                        'other_language',
                        searchStore.otherLanguage
                      );
                    if (searchStore.otherLanguageLevel)
                      searchParams.set(
                        'other_language_level',
                        searchStore.otherLanguageLevel
                      );

                    // 年齢
                    if (searchStore.ageMin)
                      searchParams.set('age_min', searchStore.ageMin);
                    if (searchStore.ageMax)
                      searchParams.set('age_max', searchStore.ageMax);

                    // 希望条件
                    if (searchStore.desiredJobTypes.length > 0) {
                      searchParams.set(
                        'desired_job_types',
                        searchStore.desiredJobTypes.map(j => j.name).join(',')
                      );
                    }
                    if (searchStore.desiredIndustries.length > 0) {
                      searchParams.set(
                        'desired_industries',
                        searchStore.desiredIndustries.map(i => i.name).join(',')
                      );
                    }
                    if (searchStore.desiredLocations.length > 0) {
                      searchParams.set(
                        'desired_locations',
                        searchStore.desiredLocations.map(l => l.name).join(',')
                      );
                    }
                    if (searchStore.workStyles.length > 0) {
                      searchParams.set(
                        'work_styles',
                        searchStore.workStyles.map(w => w.name).join(',')
                      );
                    }

                    // その他条件
                    if (searchStore.transferTime)
                      searchParams.set(
                        'transfer_time',
                        searchStore.transferTime
                      );
                    if (searchStore.selectionStatus)
                      searchParams.set(
                        'selection_status',
                        searchStore.selectionStatus
                      );
                    if (searchStore.lastLoginMin)
                      searchParams.set(
                        'last_login_min',
                        searchStore.lastLoginMin
                      );
                    if (searchStore.similarCompanyIndustry)
                      searchParams.set(
                        'similar_company_industry',
                        searchStore.similarCompanyIndustry
                      );
                    if (searchStore.similarCompanyLocation)
                      searchParams.set(
                        'similar_company_location',
                        searchStore.similarCompanyLocation
                      );

                    // 希望給与
                    if (searchStore.desiredSalaryMin)
                      searchParams.set(
                        'desired_salary_min',
                        searchStore.desiredSalaryMin
                      );
                    if (searchStore.desiredSalaryMax)
                      searchParams.set(
                        'desired_salary_max',
                        searchStore.desiredSalaryMax
                      );

                    router.push(
                      `/company/search/result?${searchParams.toString()}`
                    );
                  } else {
                    console.log(
                      '[DEBUG SearchForm] Validation failed - not navigating to results'
                    );
                    console.log(
                      '[DEBUG SearchForm] searchGroup error:',
                      searchGroupError
                    );
                    // エラーフィールドまでスクロール
                    const element = document.querySelector(
                      '[data-field="search-group"]'
                    );
                    if (element) {
                      element.scrollIntoView({
                        behavior: 'smooth',
                        block: 'center',
                      });
                    }
                    setIsSearching(false);
                  }
                }}
              >
                {isSearching ? '検索中...' : 'この条件で検索'}
              </Button>
              <Button
                variant='green-outline'
                size='figma-outline'
                style={{ fontFamily: 'Noto Sans JP, sans-serif' }}
                disabled={isSearching || isSaving}
                onClick={async () => {
                  console.log('[DEBUG SearchForm] Save button clicked');
                  console.log(
                    '[DEBUG SearchForm] searchGroup before validation:',
                    searchStore.searchGroup
                  );

                  setIsSaving(true);

                  // タッチ済みにしてバリデーションをトリガー
                  setSearchGroupTouched(true);

                  // バリデーションチェック
                  const isValid =
                    !!searchStore.searchGroup && searchStore.searchGroup !== '';
                  if (!isValid) {
                    setSearchGroupError('検索グループを選択してください');
                  } else {
                    setSearchGroupError('');
                  }
                  console.log('[DEBUG SearchForm] Validation result:', isValid);
                  if (isValid) {
                    try {
                      console.log(
                        '[DEBUG SearchForm] About to save search history from save button'
                      );
                      console.log('[DEBUG SearchForm] Search store values:', {
                        searchGroup: searchStore.searchGroup,
                        keyword: searchStore.keyword,
                        experienceJobTypes: searchStore.experienceJobTypes,
                        experienceIndustries: searchStore.experienceIndustries,
                      });

                      // SearchConditions型に合わせたフォーマット
                      const searchConditions = {
                        keywords: searchStore.keyword
                          ? [searchStore.keyword]
                          : [],
                        age_min: searchStore.ageMin
                          ? parseInt(searchStore.ageMin)
                          : undefined,
                        age_max: searchStore.ageMax
                          ? parseInt(searchStore.ageMax)
                          : undefined,
                        job_types: searchStore.experienceJobTypes.map(
                          j => j.name
                        ),
                        industries: searchStore.experienceIndustries.map(
                          i => i.name
                        ),
                        locations: searchStore.desiredLocations.map(
                          l => l.name
                        ),
                        work_styles: searchStore.workStyles.map(w => w.name),
                        education_levels: searchStore.education
                          ? [searchStore.education]
                          : [],
                        skills: searchStore.qualifications
                          ? searchStore.qualifications
                              .split(',')
                              .filter(Boolean)
                          : [],
                        salary_min: searchStore.currentSalaryMin
                          ? parseInt(searchStore.currentSalaryMin)
                          : undefined,
                        salary_max: searchStore.currentSalaryMax
                          ? parseInt(searchStore.currentSalaryMax)
                          : undefined,
                        language_skills: [],
                        // その他の検索条件
                        desired_job_types: searchStore.desiredJobTypes.map(
                          j => j.name
                        ),
                        desired_industries: searchStore.desiredIndustries.map(
                          i => i.name
                        ),
                        desired_salary_min: searchStore.desiredSalaryMin
                          ? parseInt(searchStore.desiredSalaryMin)
                          : undefined,
                        desired_salary_max: searchStore.desiredSalaryMax
                          ? parseInt(searchStore.desiredSalaryMax)
                          : undefined,
                        current_company: searchStore.currentCompany,
                        english_level: searchStore.englishLevel,
                        other_language: searchStore.otherLanguage,
                        other_language_level: searchStore.otherLanguageLevel,
                        transfer_time: searchStore.transferTime,
                        selection_status: searchStore.selectionStatus,
                        similar_company_industry:
                          searchStore.similarCompanyIndustry,
                        similar_company_location:
                          searchStore.similarCompanyLocation,
                        last_login_min: searchStore.lastLoginMin,
                        job_type_and_search: searchStore.jobTypeAndSearch,
                        industry_and_search: searchStore.industryAndSearch,
                      };

                      const searchTitle = generateSearchTitle(searchConditions);
                      console.log(
                        '[DEBUG SearchForm] Generated search title:',
                        searchTitle
                      );
                      console.log(
                        '[DEBUG SearchForm] About to call saveSearchHistory with is_saved: true'
                      );

                      await saveSearchHistory({
                        group_id: searchStore.searchGroup,
                        search_conditions: searchConditions,
                        search_title: searchTitle,
                        is_saved: true,
                      });

                      console.log(
                        '[DEBUG SearchForm] saveSearchHistory completed'
                      );
                    } catch (error) {
                      console.error('Failed to save search history:', error);
                      // エラーが発生しても検索は続行
                    }

                    // 検索条件をURLパラメータとして結果ページに遷移
                    const searchParams = new URLSearchParams();

                    // 基本検索条件
                    if (searchStore.searchGroup)
                      searchParams.set('search_group', searchStore.searchGroup);
                    if (searchStore.keyword)
                      searchParams.set('keyword', searchStore.keyword);

                    // 経験職種・業界
                    if (searchStore.experienceJobTypes.length > 0) {
                      searchParams.set(
                        'experience_job_types',
                        searchStore.experienceJobTypes
                          .map(j => j.name)
                          .join(',')
                      );
                    }
                    if (searchStore.experienceIndustries.length > 0) {
                      searchParams.set(
                        'experience_industries',
                        searchStore.experienceIndustries
                          .map(i => i.name)
                          .join(',')
                      );
                    }

                    // 給与
                    if (searchStore.currentSalaryMin)
                      searchParams.set(
                        'current_salary_min',
                        searchStore.currentSalaryMin
                      );
                    if (searchStore.currentSalaryMax)
                      searchParams.set(
                        'current_salary_max',
                        searchStore.currentSalaryMax
                      );

                    // 企業・学歴
                    if (searchStore.currentCompany)
                      searchParams.set(
                        'current_company',
                        searchStore.currentCompany
                      );
                    if (searchStore.education)
                      searchParams.set('education', searchStore.education);
                    if (searchStore.englishLevel)
                      searchParams.set(
                        'english_level',
                        searchStore.englishLevel
                      );
                    if (searchStore.qualifications)
                      searchParams.set(
                        'qualifications',
                        searchStore.qualifications
                      );
                    if (searchStore.otherLanguage)
                      searchParams.set(
                        'other_language',
                        searchStore.otherLanguage
                      );
                    if (searchStore.otherLanguageLevel)
                      searchParams.set(
                        'other_language_level',
                        searchStore.otherLanguageLevel
                      );

                    // 年齢
                    if (searchStore.ageMin)
                      searchParams.set('age_min', searchStore.ageMin);
                    if (searchStore.ageMax)
                      searchParams.set('age_max', searchStore.ageMax);

                    // 希望条件
                    if (searchStore.desiredJobTypes.length > 0) {
                      searchParams.set(
                        'desired_job_types',
                        searchStore.desiredJobTypes.map(j => j.name).join(',')
                      );
                    }
                    if (searchStore.desiredIndustries.length > 0) {
                      searchParams.set(
                        'desired_industries',
                        searchStore.desiredIndustries.map(i => i.name).join(',')
                      );
                    }
                    if (searchStore.desiredLocations.length > 0) {
                      searchParams.set(
                        'desired_locations',
                        searchStore.desiredLocations.map(l => l.name).join(',')
                      );
                    }
                    if (searchStore.workStyles.length > 0) {
                      searchParams.set(
                        'work_styles',
                        searchStore.workStyles.map(w => w.name).join(',')
                      );
                    }

                    // その他条件
                    if (searchStore.transferTime)
                      searchParams.set(
                        'transfer_time',
                        searchStore.transferTime
                      );
                    if (searchStore.selectionStatus)
                      searchParams.set(
                        'selection_status',
                        searchStore.selectionStatus
                      );
                    if (searchStore.lastLoginMin)
                      searchParams.set(
                        'last_login_min',
                        searchStore.lastLoginMin
                      );
                    if (searchStore.similarCompanyIndustry)
                      searchParams.set(
                        'similar_company_industry',
                        searchStore.similarCompanyIndustry
                      );
                    if (searchStore.similarCompanyLocation)
                      searchParams.set(
                        'similar_company_location',
                        searchStore.similarCompanyLocation
                      );

                    // 希望給与
                    if (searchStore.desiredSalaryMin)
                      searchParams.set(
                        'desired_salary_min',
                        searchStore.desiredSalaryMin
                      );
                    if (searchStore.desiredSalaryMax)
                      searchParams.set(
                        'desired_salary_max',
                        searchStore.desiredSalaryMax
                      );

                    router.push(
                      `/company/search/result?${searchParams.toString()}`
                    );
                  } else {
                    console.log(
                      '[DEBUG SearchForm] Validation failed - not navigating to results'
                    );
                    console.log(
                      '[DEBUG SearchForm] searchGroup error:',
                      searchGroupError
                    );
                    // エラーフィールドまでスクロール
                    const element = document.querySelector(
                      '[data-field="search-group"]'
                    );
                    if (element) {
                      element.scrollIntoView({
                        behavior: 'smooth',
                        block: 'center',
                      });
                    }
                    setIsSaving(false);
                  }
                }}
              >
                {isSaving ? '保存中...' : '検索条件を保存'}
              </Button>
            </div>
          </div>
        </div>
      </div>

      {/* 希望職種モーダル */}
      <JobTypeSelectModal
        isOpen={isDesiredJobTypeModalOpen}
        onClose={() => setIsDesiredJobTypeModalOpen(false)}
        onConfirm={jobNames => {
          const jobTypes = jobNames.map(name => ({
            id: name.toLowerCase().replace(/[^a-z0-9]/g, '_'),
            name,
          }));
          searchStore.setDesiredJobTypes(jobTypes);
          setIsDesiredJobTypeModalOpen(false);
        }}
        initialSelected={searchStore.desiredJobTypes.map(j => j.name)}
        maxSelections={3}
      />

      {/* 希望業種モーダル */}
      <IndustrySelectModal
        isOpen={isDesiredIndustryModalOpen}
        onClose={() => setIsDesiredIndustryModalOpen(false)}
        onConfirm={industryNames => {
          const industries = industryNames.map(name => ({
            id: name.toLowerCase().replace(/[^a-z0-9]/g, '_'),
            name,
          }));
          searchStore.setDesiredIndustries(industries);
          setIsDesiredIndustryModalOpen(false);
        }}
        initialSelected={searchStore.desiredIndustries.map(i => i.name)}
        maxSelections={3}
      />

      {/* 希望勤務地モーダル */}
      <WorkLocationSelectModal
        isOpen={isDesiredLocationModalOpen}
        onClose={() => setIsDesiredLocationModalOpen(false)}
        onConfirm={selectedLocations => {
          searchStore.setDesiredLocations(selectedLocations);
          setIsDesiredLocationModalOpen(false);
        }}
        initialSelected={searchStore.desiredLocations}
      />

      <WorkStyleSelectModal
        isOpen={isWorkStyleModalOpen}
        onClose={() => setIsWorkStyleModalOpen(false)}
        onConfirm={selected => {
          searchStore.setWorkStyles(selected);
          setIsWorkStyleModalOpen(false);
        }}
        initialSelected={searchStore.workStyles}
        maxSelections={6}
      />
    </>
  );
}
