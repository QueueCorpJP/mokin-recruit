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
import { saveSearchConditions } from './actions';
import { saveSearchHistory } from '@/lib/actions/search-history';
import { generateSearchTitle } from '@/lib/utils/search-history';

interface SearchFormProps {
  companyId: string;
}

export default function SearchForm({ companyId }: SearchFormProps) {
  const router = useRouter();
  
  const searchStore = useSearchStore();

  const handleSave = async () => {
    if (!searchStore.saveSearchName.trim()) {
      searchStore.setSaveError('検索条件名を入力してください');
      return;
    }

    if (!searchStore.searchGroup) {
      searchStore.setSaveError('グループを選択してください');
      return;
    }

    searchStore.setIsSaveLoading(true);
    searchStore.setSaveError('');

    const searchData = {
      searchGroup: searchStore.searchGroup,
      keyword: searchStore.keyword,
      experienceJobTypes: searchStore.experienceJobTypes,
      experienceIndustries: searchStore.experienceIndustries,
      jobTypeAndSearch: searchStore.jobTypeAndSearch,
      industryAndSearch: searchStore.industryAndSearch,
      currentSalaryMin: searchStore.currentSalaryMin,
      currentSalaryMax: searchStore.currentSalaryMax,
      currentCompany: searchStore.currentCompany,
      education: searchStore.education,
      englishLevel: searchStore.englishLevel,
      otherLanguage: searchStore.otherLanguage,
      otherLanguageLevel: searchStore.otherLanguageLevel,
      qualifications: searchStore.qualifications,
      ageMin: searchStore.ageMin,
      ageMax: searchStore.ageMax,
      desiredJobTypes: searchStore.desiredJobTypes,
      desiredIndustries: searchStore.desiredIndustries,
      desiredSalaryMin: searchStore.desiredSalaryMin,
      desiredSalaryMax: searchStore.desiredSalaryMax,
      desiredLocations: searchStore.desiredLocations,
      transferTime: searchStore.transferTime,
      workStyles: searchStore.workStyles,
      selectionStatus: searchStore.selectionStatus,
      similarCompanyIndustry: searchStore.similarCompanyIndustry,
      similarCompanyLocation: searchStore.similarCompanyLocation,
      lastLoginMin: searchStore.lastLoginMin,
    };

    try {
      const result = await saveSearchConditions(
        companyId,
        searchStore.searchGroup,
        searchStore.saveSearchName.trim(),
        searchData
      );

      if (result.success) {
        searchStore.setIsSaveModalOpen(false);
        searchStore.setSaveSearchName('');
        alert('検索条件を保存しました');
      } else {
        searchStore.setSaveError(result.error || '保存に失敗しました');
      }
    } catch (error) {
      searchStore.setSaveError('保存に失敗しました');
      console.error('Save error:', error);
    } finally {
      searchStore.setIsSaveLoading(false);
    }
  };

  return (
    <>
      <div className="bg-white rounded-[10px]">
        {/* 検索条件名表示エリア */}
        {/* <div className="flex items-center justify-between p-10 border-b border-gray-200">
          <div className="flex-1 flex gap-6 overflow-hidden items-center">
            <span
              className="text-[20px] font-bold text-[#323232] tracking-[1.4px] flex-shrink-0"
              style={{ fontFamily: 'Noto Sans JP, sans-serif' }}
            >
              設定中の検索条件
            </span>
            <span
              className="truncate"
              style={{
                fontFamily: 'Noto Sans JP, sans-serif',
                maxWidth: '1020px',
              }}
            >
              <span className="text-[16px] font-medium text-[#323232] tracking-[1.6px]">
                {(() => {
                  const conditions = [];
                  
                  if (searchStore.keyword && searchStore.keyword.trim() && searchStore.keyword !== 'undefined') {
                    conditions.push(`キーワード検索：${searchStore.keyword}`);
                  }
                  
                  if (searchStore.experienceJobTypes && searchStore.experienceJobTypes.length > 0) {
                    const jobTypeTexts = searchStore.experienceJobTypes
                      .slice(0, 3)
                      .filter((job: any) => job && job.name && job.name !== 'undefined')
                      .map((job: any) => `${job.name}${job.experienceYears && job.experienceYears !== 'undefined' ? ` ${job.experienceYears}年` : ''}`);
                    if (jobTypeTexts.length > 0) {
                      const moreText = searchStore.experienceJobTypes.length > 3 ? '/他' : '';
                      conditions.push(`経験職種：${jobTypeTexts.join('/')}${moreText}`);
                    }
                  }
                  
                  if (searchStore.experienceIndustries && searchStore.experienceIndustries.length > 0) {
                    const industryTexts = searchStore.experienceIndustries
                      .slice(0, 3)
                      .filter((industry: any) => industry && industry.name && industry.name !== 'undefined')
                      .map((industry: any) => `${industry.name}${industry.experienceYears && industry.experienceYears !== 'undefined' ? ` ${industry.experienceYears}年` : ''}`);
                    if (industryTexts.length > 0) {
                      const moreText = searchStore.experienceIndustries.length > 3 ? '/他' : '';
                      conditions.push(`経験業種：${industryTexts.join('/')}${moreText}`);
                    }
                  }
                  
                  const hasValidSalaryMin = searchStore.currentSalaryMin && searchStore.currentSalaryMin !== 'undefined' && searchStore.currentSalaryMin !== '';
                  const hasValidSalaryMax = searchStore.currentSalaryMax && searchStore.currentSalaryMax !== 'undefined' && searchStore.currentSalaryMax !== '';
                  if (hasValidSalaryMin || hasValidSalaryMax) {
                    const min = hasValidSalaryMin ? `${searchStore.currentSalaryMin}万円` : '';
                    const max = hasValidSalaryMax ? `${searchStore.currentSalaryMax}万円` : '';
                    const separator = min && max ? '〜' : '';
                    conditions.push(`現在の年収：${min}${separator}${max}`);
                  }
                  
                  return conditions.length > 0 
                    ? conditions.join('、') 
                    : 'キーワード検索：テキストが入ります、経験職種：職種テキスト ○年/職種テキスト ○年/職種テキスト ○年、経験業種：職種テキスト ○年/職種テキスト ○年/職種テキスト ○年、現在の年収：〇〇万円〜〇〇万円';
                })()}
              </span>
            </span>
          </div>
        </div> */}
        
        <div className="p-10">
          <div className="flex flex-col gap-2">
            {/* <h3 className="text-[#323232] text-[20px] font-bold tracking-[2px] leading-[32px] mb-2">検索条件</h3> */}
            
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
                onClick={() => {
                  // タッチ済みにしてバリデーションをトリガー
                  searchStore.setSearchGroupTouched(true);

                  // バリデーションチェック
                  if (searchStore.validateForm()) {
                    // モーダルを開く
                    searchStore.setIsSaveModalOpen(true);
                  } else {
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
            
      {/* 保存モーダル */}
      {searchStore.isSaveModalOpen && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white p-6 rounded-lg w-96">
            <h3 className="text-lg font-bold mb-4">検索条件を保存</h3>
            
            <div className="mb-4">
              <label className="block text-sm font-medium mb-2">
                検索条件名
              </label>
              <input
                type="text"
                value={searchStore.saveSearchName}
                onChange={(e) => searchStore.setSaveSearchName(e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                placeholder="検索条件名を入力"
                disabled={searchStore.isSaveLoading}
              />
            </div>

            {searchStore.saveError && (
              <div className="mb-4 text-red-600 text-sm">
                {searchStore.saveError}
              </div>
            )}

            <div className="flex gap-3">
              <button
                onClick={handleSave}
                disabled={searchStore.isSaveLoading}
                className="flex-1 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
              >
                {searchStore.isSaveLoading ? '保存中...' : '保存'}
              </button>
              <button
                onClick={() => {
                  searchStore.setIsSaveModalOpen(false);
                  searchStore.setSaveSearchName('');
                  searchStore.setSaveError('');
                }}
                disabled={searchStore.isSaveLoading}
                className="flex-1 px-4 py-2 bg-gray-500 text-white rounded-lg hover:bg-gray-600 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
              >
                キャンセル
              </button>
            </div>
          </div>
        </div>
      )}


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