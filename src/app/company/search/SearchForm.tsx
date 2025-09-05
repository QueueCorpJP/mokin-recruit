'use client';

import React from 'react';
import { useRouter } from 'next/navigation';
import { Button } from '@/components/ui/button';
import SearchConditionForm from './components/SearchConditionForm';
import DesiredConditionForm from './components/DesiredConditionForm';
import JobTypeSelectModal from '@/components/career-status/JobTypeSelectModal';
import IndustrySelectModal from '@/components/career-status/IndustrySelectModal';
import { LocationModal } from '../job/LocationModal';
import WorkStyleSelectModal from '@/components/career-status/WorkStyleSelectModal';
import { useSearchStore } from '@/stores/searchStore';
import { saveSearchHistory } from '@/lib/actions/search-history';
import { generateSearchTitle } from '@/lib/utils/search-history';

interface SearchFormProps {
  companyId: string;
}

export default function SearchForm({ companyId }: SearchFormProps) {
  const router = useRouter();
  
  const searchStore = useSearchStore();


  return (
    <>
      <div className="bg-white rounded-[10px]">
    
        <div className="p-10">
          <div className="flex flex-col gap-2">
            
            {/* Search condition form */}
            <SearchConditionForm />
            
            {/* Desired condition form */}
            <DesiredConditionForm />
            
            {/* 下部ボタン */}
            <div className="flex justify-start gap-4 border-t-[2px] border-[#EFEFEF] pt-6 mt-5">
              <Button
                variant="green-gradient"
                size="figma-default"
                style={{ fontFamily: 'Noto Sans JP, sans-serif' }}
                onClick={async () => {
                  console.log('[DEBUG SearchForm] Search button clicked');
                  console.log('[DEBUG SearchForm] searchGroup before validation:', searchStore.searchGroup);
                  
                  // タッチ済みにしてバリデーションをトリガー
                  searchStore.setSearchGroupTouched(true);

                  // バリデーションチェック
                  const isValid = searchStore.validateForm();
                  console.log('[DEBUG SearchForm] Validation result:', isValid);
                  if (isValid) {
                    try {
                      console.log('[DEBUG SearchForm] About to save search history from form');
                      console.log('[DEBUG SearchForm] Search store values:', {
                        searchGroup: searchStore.searchGroup,
                        keyword: searchStore.keyword,
                        experienceJobTypes: searchStore.experienceJobTypes,
                        experienceIndustries: searchStore.experienceIndustries
                      });
                      
                      // SearchConditions型に合わせたフォーマット
                      const searchConditions = {
                        keywords: searchStore.keyword ? [searchStore.keyword] : [],
                        age_min: searchStore.ageMin ? parseInt(searchStore.ageMin) : undefined,
                        age_max: searchStore.ageMax ? parseInt(searchStore.ageMax) : undefined,
                        job_types: searchStore.experienceJobTypes.map(j => j.name),
                        industries: searchStore.experienceIndustries.map(i => i.name),
                        locations: searchStore.desiredLocations.map(l => l.name),
                        work_styles: searchStore.workStyles.map(w => w.name),
                        education_levels: searchStore.education ? [searchStore.education] : [],
                        skills: searchStore.qualifications ? searchStore.qualifications.split(',').filter(Boolean) : [],
                        salary_min: searchStore.currentSalaryMin ? parseInt(searchStore.currentSalaryMin) : undefined,
                        salary_max: searchStore.currentSalaryMax ? parseInt(searchStore.currentSalaryMax) : undefined,
                        language_skills: [],
                        // その他の検索条件
                        desired_job_types: searchStore.desiredJobTypes.map(j => j.name),
                        desired_industries: searchStore.desiredIndustries.map(i => i.name),
                        desired_salary_min: searchStore.desiredSalaryMin ? parseInt(searchStore.desiredSalaryMin) : undefined,
                        desired_salary_max: searchStore.desiredSalaryMax ? parseInt(searchStore.desiredSalaryMax) : undefined,
                        current_company: searchStore.currentCompany,
                        english_level: searchStore.englishLevel,
                        other_language: searchStore.otherLanguage,
                        other_language_level: searchStore.otherLanguageLevel,
                        transfer_time: searchStore.transferTime,
                        selection_status: searchStore.selectionStatus,
                        similar_company_industry: searchStore.similarCompanyIndustry,
                        similar_company_location: searchStore.similarCompanyLocation,
                        last_login_min: searchStore.lastLoginMin,
                        job_type_and_search: searchStore.jobTypeAndSearch,
                        industry_and_search: searchStore.industryAndSearch,
                      };

                      const searchTitle = generateSearchTitle(searchConditions);
                      console.log('[DEBUG SearchForm] Generated search title:', searchTitle);
                      console.log('[DEBUG SearchForm] About to call saveSearchHistory');

                      await saveSearchHistory({
                        group_id: searchStore.searchGroup,
                        search_conditions: searchConditions,
                        search_title: searchTitle,
                        is_saved: false
                      });
                      
                      console.log('[DEBUG SearchForm] saveSearchHistory completed');
                    } catch (error) {
                      console.error('Failed to save search history:', error);
                      // エラーが発生しても検索は続行
                    }

                    // 検索条件をURLパラメータとして結果ページに遷移
                    const searchParams = new URLSearchParams();
                    
                    // 基本検索条件
                    if (searchStore.searchGroup) searchParams.set('search_group', searchStore.searchGroup);
                    if (searchStore.keyword) searchParams.set('keyword', searchStore.keyword);
                    
                    // 経験職種・業界
                    if (searchStore.experienceJobTypes.length > 0) {
                      searchParams.set('experience_job_types', searchStore.experienceJobTypes.map(j => j.name).join(','));
                    }
                    if (searchStore.experienceIndustries.length > 0) {
                      searchParams.set('experience_industries', searchStore.experienceIndustries.map(i => i.name).join(','));
                    }
                    
                    // 給与
                    if (searchStore.currentSalaryMin) searchParams.set('current_salary_min', searchStore.currentSalaryMin);
                    if (searchStore.currentSalaryMax) searchParams.set('current_salary_max', searchStore.currentSalaryMax);
                    
                    // 企業・学歴
                    if (searchStore.currentCompany) searchParams.set('current_company', searchStore.currentCompany);
                    if (searchStore.education) searchParams.set('education', searchStore.education);
                    if (searchStore.englishLevel) searchParams.set('english_level', searchStore.englishLevel);
                    
                    // 年齢
                    if (searchStore.ageMin) searchParams.set('age_min', searchStore.ageMin);
                    if (searchStore.ageMax) searchParams.set('age_max', searchStore.ageMax);
                    
                    // 希望条件
                    if (searchStore.desiredJobTypes.length > 0) {
                      searchParams.set('desired_job_types', searchStore.desiredJobTypes.map(j => j.name).join(','));
                    }
                    if (searchStore.desiredIndustries.length > 0) {
                      searchParams.set('desired_industries', searchStore.desiredIndustries.map(i => i.name).join(','));
                    }
                    if (searchStore.desiredLocations.length > 0) {
                      searchParams.set('desired_locations', searchStore.desiredLocations.map(l => l.name).join(','));
                    }
                    if (searchStore.workStyles.length > 0) {
                      searchParams.set('work_styles', searchStore.workStyles.map(w => w.name).join(','));
                    }
                    
                    // その他条件
                    if (searchStore.transferTime) searchParams.set('transfer_time', searchStore.transferTime);
                    if (searchStore.selectionStatus) searchParams.set('selection_status', searchStore.selectionStatus);
                    if (searchStore.lastLoginMin) searchParams.set('last_login_min', searchStore.lastLoginMin);
                    
                    router.push(`/company/search/result?${searchParams.toString()}`);
                  } else {
                    console.log('[DEBUG SearchForm] Validation failed - not navigating to results');
                    console.log('[DEBUG SearchForm] searchGroup error:', searchStore.searchGroupError);
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
                  }
                }}
              >
                この条件で検索
              </Button>
              <Button
                variant="green-outline"
                size="figma-outline"
                style={{ fontFamily: 'Noto Sans JP, sans-serif' }}
                onClick={async () => {
                  console.log('[DEBUG SearchForm] Save button clicked');
                  console.log('[DEBUG SearchForm] searchGroup before validation:', searchStore.searchGroup);
                  
                  // タッチ済みにしてバリデーションをトリガー
                  searchStore.setSearchGroupTouched(true);

                  // バリデーションチェック
                  const isValid = searchStore.validateForm();
                  console.log('[DEBUG SearchForm] Validation result:', isValid);
                  if (isValid) {
                    try {
                      console.log('[DEBUG SearchForm] About to save search history from save button');
                      console.log('[DEBUG SearchForm] Search store values:', {
                        searchGroup: searchStore.searchGroup,
                        keyword: searchStore.keyword,
                        experienceJobTypes: searchStore.experienceJobTypes,
                        experienceIndustries: searchStore.experienceIndustries
                      });
                      
                      // SearchConditions型に合わせたフォーマット
                      const searchConditions = {
                        keywords: searchStore.keyword ? [searchStore.keyword] : [],
                        age_min: searchStore.ageMin ? parseInt(searchStore.ageMin) : undefined,
                        age_max: searchStore.ageMax ? parseInt(searchStore.ageMax) : undefined,
                        job_types: searchStore.experienceJobTypes.map(j => j.name),
                        industries: searchStore.experienceIndustries.map(i => i.name),
                        locations: searchStore.desiredLocations.map(l => l.name),
                        work_styles: searchStore.workStyles.map(w => w.name),
                        education_levels: searchStore.education ? [searchStore.education] : [],
                        skills: searchStore.qualifications ? searchStore.qualifications.split(',').filter(Boolean) : [],
                        salary_min: searchStore.currentSalaryMin ? parseInt(searchStore.currentSalaryMin) : undefined,
                        salary_max: searchStore.currentSalaryMax ? parseInt(searchStore.currentSalaryMax) : undefined,
                        language_skills: [],
                        // その他の検索条件
                        desired_job_types: searchStore.desiredJobTypes.map(j => j.name),
                        desired_industries: searchStore.desiredIndustries.map(i => i.name),
                        desired_salary_min: searchStore.desiredSalaryMin ? parseInt(searchStore.desiredSalaryMin) : undefined,
                        desired_salary_max: searchStore.desiredSalaryMax ? parseInt(searchStore.desiredSalaryMax) : undefined,
                        current_company: searchStore.currentCompany,
                        english_level: searchStore.englishLevel,
                        other_language: searchStore.otherLanguage,
                        other_language_level: searchStore.otherLanguageLevel,
                        transfer_time: searchStore.transferTime,
                        selection_status: searchStore.selectionStatus,
                        similar_company_industry: searchStore.similarCompanyIndustry,
                        similar_company_location: searchStore.similarCompanyLocation,
                        last_login_min: searchStore.lastLoginMin,
                        job_type_and_search: searchStore.jobTypeAndSearch,
                        industry_and_search: searchStore.industryAndSearch,
                      };

                      const searchTitle = generateSearchTitle(searchConditions);
                      console.log('[DEBUG SearchForm] Generated search title:', searchTitle);
                      console.log('[DEBUG SearchForm] About to call saveSearchHistory with is_saved: true');

                      await saveSearchHistory({
                        group_id: searchStore.searchGroup,
                        search_conditions: searchConditions,
                        search_title: searchTitle,
                        is_saved: true
                      });
                      
                      console.log('[DEBUG SearchForm] saveSearchHistory completed');
                    } catch (error) {
                      console.error('Failed to save search history:', error);
                      // エラーが発生しても検索は続行
                    }

                    // 検索条件をURLパラメータとして結果ページに遷移
                    const searchParams = new URLSearchParams();
                    
                    // 保存ボタンから来たことを示すフラグ
                    searchParams.set('from_save', 'true');
                    
                    // 基本検索条件
                    if (searchStore.searchGroup) searchParams.set('search_group', searchStore.searchGroup);
                    if (searchStore.keyword) searchParams.set('keyword', searchStore.keyword);
                    
                    // 経験職種・業界
                    if (searchStore.experienceJobTypes.length > 0) {
                      searchParams.set('experience_job_types', searchStore.experienceJobTypes.map(j => j.name).join(','));
                    }
                    if (searchStore.experienceIndustries.length > 0) {
                      searchParams.set('experience_industries', searchStore.experienceIndustries.map(i => i.name).join(','));
                    }
                    
                    // 給与
                    if (searchStore.currentSalaryMin) searchParams.set('current_salary_min', searchStore.currentSalaryMin);
                    if (searchStore.currentSalaryMax) searchParams.set('current_salary_max', searchStore.currentSalaryMax);
                    
                    // 企業・学歴
                    if (searchStore.currentCompany) searchParams.set('current_company', searchStore.currentCompany);
                    if (searchStore.education) searchParams.set('education', searchStore.education);
                    if (searchStore.englishLevel) searchParams.set('english_level', searchStore.englishLevel);
                    
                    // 年齢
                    if (searchStore.ageMin) searchParams.set('age_min', searchStore.ageMin);
                    if (searchStore.ageMax) searchParams.set('age_max', searchStore.ageMax);
                    
                    // 希望条件
                    if (searchStore.desiredJobTypes.length > 0) {
                      searchParams.set('desired_job_types', searchStore.desiredJobTypes.map(j => j.name).join(','));
                    }
                    if (searchStore.desiredIndustries.length > 0) {
                      searchParams.set('desired_industries', searchStore.desiredIndustries.map(i => i.name).join(','));
                    }
                    if (searchStore.desiredLocations.length > 0) {
                      searchParams.set('desired_locations', searchStore.desiredLocations.map(l => l.name).join(','));
                    }
                    if (searchStore.workStyles.length > 0) {
                      searchParams.set('work_styles', searchStore.workStyles.map(w => w.name).join(','));
                    }
                    
                    // その他条件
                    if (searchStore.transferTime) searchParams.set('transfer_time', searchStore.transferTime);
                    if (searchStore.selectionStatus) searchParams.set('selection_status', searchStore.selectionStatus);
                    if (searchStore.lastLoginMin) searchParams.set('last_login_min', searchStore.lastLoginMin);
                    
                    router.push(`/company/search/result?${searchParams.toString()}`);
                  } else {
                    console.log('[DEBUG SearchForm] Validation failed - not navigating to results');
                    console.log('[DEBUG SearchForm] searchGroup error:', searchStore.searchGroupError);
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
                  }
                }}
              >
                検索条件を保存
              </Button>
            </div>
          </div>
        </div>
      </div>
            


      {/* 希望職種モーダル */}
      <JobTypeSelectModal
        isOpen={searchStore.isDesiredJobTypeModalOpen}
        onClose={() => searchStore.setIsDesiredJobTypeModalOpen(false)}
        onConfirm={(jobNames) => {
          const jobTypes = jobNames.map(name => ({
            id: name.toLowerCase().replace(/[^a-z0-9]/g, '_'),
            name
          }));
          searchStore.setDesiredJobTypes(jobTypes);
        }}
        initialSelected={searchStore.desiredJobTypes.map(j => j.name)}
        maxSelections={3}
      />

      {/* 希望業種モーダル */}
      <IndustrySelectModal
        isOpen={searchStore.isDesiredIndustryModalOpen}
        onClose={() => searchStore.setIsDesiredIndustryModalOpen(false)}
        onConfirm={(industryNames) => {
          const industries = industryNames.map(name => ({
            id: name.toLowerCase().replace(/[^a-z0-9]/g, '_'),
            name
          }));
          searchStore.setDesiredIndustries(industries);
        }}
        initialSelected={searchStore.desiredIndustries.map(i => i.name)}
        maxSelections={3}
      />

      {/* 希望勤務地モーダル */}
      {searchStore.isDesiredLocationModalOpen && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 overflow-y-auto">
          <div className="bg-white rounded-lg w-full max-w-4xl max-h-screen overflow-y-auto m-4">
            <div className="flex items-center justify-between p-6 border-b">
              <h2 className="text-xl font-bold">希望勤務地を選択</h2>
              <button
                onClick={() => searchStore.setIsDesiredLocationModalOpen(false)}
                className="text-gray-500 hover:text-gray-700"
              >
                <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12" />
                </svg>
              </button>
            </div>
            <div className="p-6">
              <LocationModal
                selectedLocations={searchStore.desiredLocations.map(l => l.name)}
                onLocationsChange={(locationNames) => {
                  const locations = locationNames.map(name => ({
                    id: name.toLowerCase().replace(/[^a-z0-9]/g, '_'),
                    name
                  }));
                  searchStore.setDesiredLocations(locations);
                }}
              />
            </div>
            <div className="flex justify-end p-6 border-t">
              <button
                onClick={() => searchStore.setIsDesiredLocationModalOpen(false)}
                className="px-6 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700"
              >
                選択完了
              </button>
            </div>
          </div>
        </div>
      )}

      {/* 働き方モーダル */}
      {searchStore.isWorkStyleModalOpen && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 overflow-y-auto">
          <div className="bg-white rounded-lg w-full max-w-4xl max-h-screen overflow-y-auto m-4">
            <div className="flex items-center justify-between p-6 border-b">
              <h2 className="text-xl font-bold">働き方を選択</h2>
              <button
                onClick={() => searchStore.setIsWorkStyleModalOpen(false)}
                className="text-gray-500 hover:text-gray-700"
              >
                <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12" />
                </svg>
              </button>
            </div>
            <div className="p-6">
              <WorkStyleSelectModal
                selectedStyles={searchStore.workStyles.map(w => w.name)}
                onStylesChange={(styleNames) => {
                  const styles = styleNames.map(name => ({
                    id: name.toLowerCase().replace(/[^a-z0-9]/g, '_'),
                    name
                  }));
                  searchStore.setWorkStyles(styles);
                }}
                onClose={() => searchStore.setIsWorkStyleModalOpen(false)}
              />
            </div>
            <div className="flex justify-end p-6 border-t">
              <button
                onClick={() => searchStore.setIsWorkStyleModalOpen(false)}
                className="px-6 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700"
              >
                選択完了
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
}