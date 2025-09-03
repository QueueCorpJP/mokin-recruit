'use client';

import React from 'react';
import { useRouter } from 'next/navigation';
import { SelectInput } from '@/components/ui/select-input';
import { Checkbox } from '@/components/ui/checkbox';
import { Button } from '@/components/ui/button';
import JobTypeSelectModal from '@/components/career-status/JobTypeSelectModal';
import IndustrySelectModal from '@/components/career-status/IndustrySelectModal';
import WorkLocationSelectModal from '@/components/career-status/WorkLocationSelectModal';
import WorkStyleSelectModal from '@/components/career-status/WorkStyleSelectModal';
import { useSearchStore } from '@/stores/searchStore';
import { saveSearchConditions } from './actions';

interface SearchFormProps {
  companyId: string;
}

export default function SearchForm({ companyId }: SearchFormProps) {
  const router = useRouter();
  
  const {
    // Form data
    searchGroup,
    keyword,
    experienceJobTypes,
    experienceIndustries,
    jobTypeAndSearch,
    industryAndSearch,
    currentSalaryMin,
    currentSalaryMax,
    currentCompany,
    education,
    englishLevel,
    otherLanguage,
    otherLanguageLevel,
    qualifications,
    ageMin,
    ageMax,
    desiredJobTypes,
    desiredIndustries,
    desiredSalaryMin,
    desiredSalaryMax,
    desiredLocations,
    transferTime,
    workStyles,
    selectionStatus,
    similarCompanyIndustry,
    similarCompanyLocation,
    lastLoginMin,
    
    // Modal states
    isJobTypeModalOpen,
    isIndustryModalOpen,
    isDesiredJobTypeModalOpen,
    isDesiredIndustryModalOpen,
    isDesiredLocationModalOpen,
    isWorkStyleModalOpen,
    isSaveModalOpen,
    
    // Save modal states
    saveSearchName,
    saveError,
    isSaveLoading,
    
    // Validation states
    searchGroupTouched,
    searchGroupError,
    
    // Actions
    setSearchGroup,
    setKeyword,
    setExperienceJobTypes,
    setExperienceIndustries,
    setJobTypeAndSearch,
    setIndustryAndSearch,
    setCurrentSalaryMin,
    setCurrentSalaryMax,
    setCurrentCompany,
    setEducation,
    setEnglishLevel,
    setOtherLanguage,
    setOtherLanguageLevel,
    setQualifications,
    setAgeMin,
    setAgeMax,
    setDesiredJobTypes,
    setDesiredIndustries,
    setDesiredSalaryMin,
    setDesiredSalaryMax,
    setDesiredLocations,
    setTransferTime,
    setWorkStyles,
    setSelectionStatus,
    setSimilarCompanyIndustry,
    setSimilarCompanyLocation,
    setLastLoginMin,
    
    // Modal actions
    setIsJobTypeModalOpen,
    setIsIndustryModalOpen,
    setIsDesiredJobTypeModalOpen,
    setIsDesiredIndustryModalOpen,
    setIsDesiredLocationModalOpen,
    setIsWorkStyleModalOpen,
    setIsSaveModalOpen,
    
    // Save modal actions
    setSaveSearchName,
    setSaveError,
    setIsSaveLoading,
    
    // Validation actions
    setSearchGroupTouched,
    setSearchGroupError,
    
    // Utility actions
    validateForm,
  } = useSearchStore();

  const handleSave = async () => {
    if (!saveSearchName.trim()) {
      setSaveError('検索条件名を入力してください');
      return;
    }

    if (!searchGroup) {
      setSaveError('グループを選択してください');
      return;
    }

    setIsSaveLoading(true);
    setSaveError('');

    const searchData = {
      searchGroup,
      keyword,
      experienceJobTypes,
      experienceIndustries,
      jobTypeAndSearch,
      industryAndSearch,
      currentSalaryMin,
      currentSalaryMax,
      currentCompany,
      education,
      englishLevel,
      otherLanguage,
      otherLanguageLevel,
      qualifications,
      ageMin,
      ageMax,
      desiredJobTypes,
      desiredIndustries,
      desiredSalaryMin,
      desiredSalaryMax,
      desiredLocations,
      transferTime,
      workStyles,
      selectionStatus,
      similarCompanyIndustry,
      similarCompanyLocation,
      lastLoginMin,
    };

    try {
      const result = await saveSearchConditions(
        companyId,
        searchGroup,
        saveSearchName.trim(),
        searchData
      );

      if (result.success) {
        setIsSaveModalOpen(false);
        setSaveSearchName('');
        alert('検索条件を保存しました');
      } else {
        setSaveError(result.error || '保存に失敗しました');
      }
    } catch (error) {
      setSaveError('保存に失敗しました');
      console.error('Save error:', error);
    } finally {
      setIsSaveLoading(false);
    }
  };

  return (
    <>
      <div className="bg-white rounded-[10px]">

     <div className="p-10">
                <div className="flex flex-col gap-2">
                  {/* 検索履歴保存グループ */}
                  <h3 className="text-[#323232] text-[20px] font-bold tracking-[2px] leading-[32px] mb-2">  検索条件</h3> 
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
                        <div className="flex flex-wrap gap-2 mt-4">
                          {experienceJobTypes.map((job) => (
                            <span key={job.id} className="inline-block px-3 py-1 text-xs font-medium text-[#198D76] bg-[#E8F5F0] rounded-full">
                              {job.name}
                            </span>
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
                        <div className="flex flex-wrap gap-2 mt-4">
                          {experienceIndustries.map((industry) => (
                            <span key={industry.id} className="inline-block px-3 py-1 text-xs font-medium text-[#198D76] bg-[#E8F5F0] rounded-full">
                              {industry.name}
                            </span>
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
                              <span key={job.id} className="inline-block px-3 py-1 text-xs font-medium text-[#198D76] bg-[#E8F5F0] rounded-full">
                                {job.name}
                              </span>
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
                              <span key={industry.id} className="inline-block px-3 py-1 text-xs font-medium text-[#198D76] bg-[#E8F5F0] rounded-full">
                                {industry.name}
                              </span>
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
                        if (validateForm()) {
                          // 検索条件をURLパラメータとして結果ページに遷移
                          const searchParams = new URLSearchParams();
                          
                          // 基本検索条件
                          if (searchGroup) searchParams.set('search_group', searchGroup);
                          if (keyword) searchParams.set('keyword', keyword);
                          
                          // 経験職種・業界
                          if (experienceJobTypes.length > 0) {
                            searchParams.set('experience_job_types', experienceJobTypes.map(j => j.name).join(','));
                          }
                          if (experienceIndustries.length > 0) {
                            searchParams.set('experience_industries', experienceIndustries.map(i => i.name).join(','));
                          }
                          
                          // 給与
                          if (currentSalaryMin) searchParams.set('current_salary_min', currentSalaryMin);
                          if (currentSalaryMax) searchParams.set('current_salary_max', currentSalaryMax);
                          
                          // 企業・学歴
                          if (currentCompany) searchParams.set('current_company', currentCompany);
                          if (education) searchParams.set('education', education);
                          if (englishLevel) searchParams.set('english_level', englishLevel);
                          
                          // 年齢
                          if (ageMin) searchParams.set('age_min', ageMin);
                          if (ageMax) searchParams.set('age_max', ageMax);
                          
                          // 希望条件
                          if (desiredJobTypes.length > 0) {
                            searchParams.set('desired_job_types', desiredJobTypes.map(j => j.name).join(','));
                          }
                          if (desiredIndustries.length > 0) {
                            searchParams.set('desired_industries', desiredIndustries.map(i => i.name).join(','));
                          }
                          if (desiredLocations.length > 0) {
                            searchParams.set('desired_locations', desiredLocations.map(l => l.name).join(','));
                          }
                          if (workStyles.length > 0) {
                            searchParams.set('work_styles', workStyles.map(w => w.name).join(','));
                          }
                          
                          // その他条件
                          if (transferTime) searchParams.set('transfer_time', transferTime);
                          if (selectionStatus) searchParams.set('selection_status', selectionStatus);
                          if (lastLoginMin) searchParams.set('last_login_min', lastLoginMin);
                          
                          router.push(`/company/search/result?${searchParams.toString()}`);
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
                        if (validateForm()) {
                          // モーダルを開く
                          setIsSaveModalOpen(true);
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
      {isSaveModalOpen && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white p-6 rounded-lg w-96">
            <h3 className="text-lg font-bold mb-4">検索条件を保存</h3>
            
            <div className="mb-4">
              <label className="block text-sm font-medium mb-2">
                検索条件名
              </label>
              <input
                type="text"
                value={saveSearchName}
                onChange={(e) => setSaveSearchName(e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                placeholder="検索条件名を入力"
                disabled={isSaveLoading}
              />
            </div>

            {saveError && (
              <div className="mb-4 text-red-600 text-sm">
                {saveError}
              </div>
            )}

            <div className="flex gap-3">
              <button
                onClick={handleSave}
                disabled={isSaveLoading}
                className="flex-1 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
              >
                {isSaveLoading ? '保存中...' : '保存'}
              </button>
              <button
                onClick={() => {
                  setIsSaveModalOpen(false);
                  setSaveSearchName('');
                  setSaveError('');
                }}
                disabled={isSaveLoading}
                className="flex-1 px-4 py-2 bg-gray-500 text-white rounded-lg hover:bg-gray-600 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
              >
                キャンセル
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Modal Components */}
      <JobTypeSelectModal
        isOpen={isJobTypeModalOpen}
        onClose={() => setIsJobTypeModalOpen(false)}
        onConfirm={(selected) => {
          setExperienceJobTypes(selected);
          setIsJobTypeModalOpen(false);
        }}
        initialSelected={experienceJobTypes}
      />

      <IndustrySelectModal
        isOpen={isIndustryModalOpen}
        onClose={() => setIsIndustryModalOpen(false)}
        onConfirm={(selected) => {
          setExperienceIndustries(selected);
          setIsIndustryModalOpen(false);
        }}
        initialSelected={experienceIndustries}
      />

      <JobTypeSelectModal
        isOpen={isDesiredJobTypeModalOpen}
        onClose={() => setIsDesiredJobTypeModalOpen(false)}
        onConfirm={(selected) => {
          setDesiredJobTypes(selected);
          setIsDesiredJobTypeModalOpen(false);
        }}
        initialSelected={desiredJobTypes}
      />

      <IndustrySelectModal
        isOpen={isDesiredIndustryModalOpen}
        onClose={() => setIsDesiredIndustryModalOpen(false)}
        onConfirm={(selected) => {
          setDesiredIndustries(selected);
          setIsDesiredIndustryModalOpen(false);
        }}
        initialSelected={desiredIndustries}
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
      />
    </>
  );
}