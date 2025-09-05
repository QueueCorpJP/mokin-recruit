'use client';

import React, { useState, useEffect } from 'react';
import { SelectInput } from '@/components/ui/select-input';
import { Checkbox } from '@/components/ui/checkbox';
import JobTypeSelectModal from '@/components/career-status/JobTypeSelectModal';
import IndustrySelectModal from '@/components/career-status/IndustrySelectModal';
import { useSearchStore } from '@/stores/searchStore';
import { JOB_TYPE_GROUPS } from '@/constants/job-type-data';
import { INDUSTRY_GROUPS } from '@/constants/industry-data';
import { getCompanyGroups } from '@/lib/actions/search-history';

export default function SearchConditionForm() {
  const searchStore = useSearchStore();
  const [openSelectId, setOpenSelectId] = React.useState<string | null>(null);
  const [groupOptions, setGroupOptions] = useState<Array<{value: string, label: string}>>([
    { value: '', label: '未選択' }
  ]);
  const [loadingGroups, setLoadingGroups] = useState(true);
  
  console.log('=== SearchConditionForm RENDER START ===');
  console.log('SearchConditionForm render - experienceJobTypes:', searchStore.experienceJobTypes);
  console.log('SearchConditionForm render - experienceJobTypes length:', searchStore.experienceJobTypes.length);
  console.log('SearchConditionForm render - experienceJobTypes JSON:', JSON.stringify(searchStore.experienceJobTypes, null, 2));
  console.log('SearchConditionForm render - experienceIndustries:', searchStore.experienceIndustries);
  console.log('SearchConditionForm render - experienceIndustries length:', searchStore.experienceIndustries.length);
  console.log('SearchConditionForm render - experienceIndustries JSON:', JSON.stringify(searchStore.experienceIndustries, null, 2));
  console.log('=== SearchConditionForm RENDER END ===');

  // グループ一覧を取得
  useEffect(() => {
    const fetchGroups = async () => {
      try {
        setLoadingGroups(true);
        const result = await getCompanyGroups();
        if (result.success) {
          const options = [
            { value: '', label: '未選択' },
            ...result.data.map(group => ({
              value: group.id,
              label: group.name
            }))
          ];
          setGroupOptions(options);
        } else {
          console.error('Failed to fetch company groups:', result.error);
        }
      } catch (error) {
        console.error('Error fetching company groups:', error);
      } finally {
        setLoadingGroups(false);
      }
    };

    fetchGroups();
  }, []);

  return (
    <>
    <div className="flex flex-col gap-2">
      {/* 検索履歴保存グループ */}
      <h3 className="text-[#323232] text-[20px] font-bold tracking-[2px] leading-[32px] mb-2">
        検索条件
      </h3>
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
              onChange={(value: string) => {
                searchStore.setSearchGroup(value);
                searchStore.setSearchGroupError('');
              }}
              onBlur={() => {
                searchStore.setSearchGroupTouched(true);
                if (!searchStore.searchGroup) {
                  searchStore.setSearchGroupError(
                    'グループを選択してください。',
                  );
                }
              }}
              options={groupOptions}
              placeholder={loadingGroups ? 'グループを読み込み中...' : '未選択'}
              className="w-[400px]"
              disabled={loadingGroups}
            />
            {searchStore.searchGroupTouched && searchStore.searchGroupError && (
              <p className="text-[#ff0000] text-[12px] mt-2">
                {searchStore.searchGroupError}
              </p>
            )}
          </div>
        </div>
      </div>

      <div className="flex gap-6 items-strech border-t-[2px] border-[#EFEFEF] pt-6 mt-5">
        <div className="w-[201px] bg-[#f9f9f9] rounded-[5px] px-6 py-0 flex items-center justify-start min-h-[102px]">
          <span
            className="text-[#323232] text-[16px] font-bold tracking-[1.6px] leading-[32px]"
            style={{ fontFamily: 'Noto Sans JP, sans-serif' }}
          >
            キーワード検索
          </span>
        </div>
        <div className="flex-1 py-6 flex items-center">
          <input
            type="text"
            value={searchStore.keyword}
            onChange={(e) => searchStore.setKeyword(e.target.value)}
            placeholder="検索したいワードを入力"
            className="w-[400px] px-4 py-3 border border-[#999] font-medium rounded-[4px] text-[14px] tracking-[1.4px] text-[#323232] placeholder:text-[#999]"
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
          <div className="flex items-center gap-4">
            <button
              onClick={() => searchStore.setIsJobTypeModalOpen(true)}
              className="w-[160px] py-[12px] bg-white border border-[#999999] rounded-[32px] text-[14px] font-bold text-[#323232] tracking-[1.4px]"
              style={{ fontFamily: 'Noto Sans JP, sans-serif' }}
            >
              職種を選択
            </button>
            <div className="flex items-center gap-2">
              <Checkbox
                checked={searchStore.jobTypeAndSearch}
                onChange={(checked: boolean) =>
                  searchStore.setJobTypeAndSearch(checked)
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

          {(() => {
            console.log('=== TAG RENDER CHECK - experienceJobTypes ===');
            console.log('SearchConditionForm: experienceJobTypes for tag display:', searchStore.experienceJobTypes);
            console.log('SearchConditionForm: experienceJobTypes length for tag display:', searchStore.experienceJobTypes.length);
            console.log('SearchConditionForm: experienceJobTypes JSON for tag display:', JSON.stringify(searchStore.experienceJobTypes, null, 2));
            console.log('SearchConditionForm: Will render tags?', searchStore.experienceJobTypes.length > 0);
            return null;
          })()}
          {searchStore.experienceJobTypes.length > 0 && (
            <div className="flex flex-col items-start gap-2 mt-4">
              {searchStore.experienceJobTypes.map((job) => {
                console.log('SearchConditionForm: Rendering tag for job:', job);
                return (
                  <div
                  key={job.id}
                  className="inline-flex items-center gap-1"
                >
                  <span className="bg-[#d2f1da] text-[#0f9058] text-[14px] font-bold tracking-[1.4px] h-[40px] flex items-center px-6 rounded-l-[10px] overflow-hidden max-w-[200px]">
                    <span className="line-clamp-1 break-all">{job.name}</span>
                  </span>
                  <div className="bg-[#d2f1da] h-[40px] flex items-center px-4 relative">
                    <select
                      className="bg-transparent text-[#0f9058] text-[14px] font-medium tracking-[1.4px] appearance-none pr-8 cursor-pointer focus:outline-none border-none w-full"
                      value={job.experienceYears || ''}
                      onFocus={() => setOpenSelectId(`job-${job.id}`)}
                      onBlur={() => setOpenSelectId(null)}
                      onChange={(e) => {
                        searchStore.updateExperienceJobTypeYears(
                          job.id,
                          e.target.value,
                        );
                        setOpenSelectId(null);
                      }}
                    >
                      <option value="">経験年数：指定なし</option>
                      <option value="1年以上">経験年数：1年以上</option>
                      <option value="3年以上">経験年数：3年以上</option>
                      <option value="5年以上">経験年数：5年以上</option>
                      <option value="7年以上">経験年数：7年以上</option>
                      <option value="10年以上">経験年数：10年以上</option>
                      <option value="15年以上">経験年数：15年以上</option>
                      <option value="20年以上">経験年数：20年以上</option>
                    </select>
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      width="14"
                      height="10"
                      viewBox="0 0 14 10"
                      fill="none"
                      className={`absolute right-2 pointer-events-none transition-transform duration-300 ${openSelectId === `job-${job.id}` ? 'rotate-180' : ''}`}
                    >
                      <path
                        d="M6.07178 8.90462L0.234161 1.71483C-0.339509 1.00828 0.206262 0 1.16238 0H12.8376C13.7937 0 14.3395 1.00828 13.7658 1.71483L7.92822 8.90462C7.46411 9.47624 6.53589 9.47624 6.07178 8.90462Z"
                        fill="#0F9058"
                      />
                    </svg>
                  </div>
                  <button
                    type="button"
                    onClick={() => {
                      searchStore.setExperienceJobTypes(
                        searchStore.experienceJobTypes.filter(
                          (j) => j.id !== job.id,
                        ),
                      );
                    }}
                    className="bg-[#d2f1da] flex items-center justify-center w-10 h-[40px] rounded-r-[10px]"
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
                );
              })}
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
          <div className="flex items-center gap-4">
            <button
              onClick={() => searchStore.setIsIndustryModalOpen(true)}
              className="w-[160px] py-[12px] bg-white border border-[#999999] rounded-[32px] text-[14px] font-bold text-[#323232] tracking-[1.4px]"
              style={{ fontFamily: 'Noto Sans JP, sans-serif' }}
            >
              業種を選択
            </button>
            <div className="flex items-center gap-2">
              <Checkbox
                checked={searchStore.industryAndSearch}
                onChange={(checked: boolean) =>
                  searchStore.setIndustryAndSearch(checked)
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

          {searchStore.experienceIndustries.length > 0 && (
            <div className="flex flex-col items-start gap-2 mt-4">
              {searchStore.experienceIndustries.map((industry) => (
                <div
                  key={industry.id}
                  className="inline-flex items-center gap-1"
                >
                  <span className="bg-[#d2f1da] text-[#0f9058] text-[14px] font-bold tracking-[1.4px] h-[40px] flex items-center px-6 rounded-l-[10px] overflow-hidden max-w-[200px]">
                    <span className="line-clamp-1 break-all">{industry.name}</span>
                  </span>
                  <div className="bg-[#d2f1da] h-[40px] flex items-center px-4 relative">
                    <select
                      className="bg-transparent text-[#0f9058] text-[14px] font-medium tracking-[1.4px] appearance-none pr-8 cursor-pointer focus:outline-none border-none w-full"
                      value={industry.experienceYears || ''}
                      onFocus={() => setOpenSelectId(`industry-${industry.id}`)}
                      onBlur={() => setOpenSelectId(null)}
                      onChange={(e) => {
                        searchStore.updateExperienceIndustryYears(
                          industry.id,
                          e.target.value,
                        );
                        setOpenSelectId(null);
                      }}
                    >
                      <option value="">経験年数：指定なし</option>
                      <option value="1年以上">経験年数：1年以上</option>
                      <option value="3年以上">経験年数：3年以上</option>
                      <option value="5年以上">経験年数：5年以上</option>
                      <option value="7年以上">経験年数：7年以上</option>
                      <option value="10年以上">経験年数：10年以上</option>
                      <option value="15年以上">経験年数：15年以上</option>
                      <option value="20年以上">経験年数：20年以上</option>
                    </select>
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      width="14"
                      height="10"
                      viewBox="0 0 14 10"
                      fill="none"
                      className={`absolute right-2 pointer-events-none transition-transform duration-300 ${openSelectId === `industry-${industry.id}` ? 'rotate-180' : ''}`}
                    >
                      <path
                        d="M6.07178 8.90462L0.234161 1.71483C-0.339509 1.00828 0.206262 0 1.16238 0H12.8376C13.7937 0 14.3395 1.00828 13.7658 1.71483L7.92822 8.90462C7.46411 9.47624 6.53589 9.47624 6.07178 8.90462Z"
                        fill="#0F9058"
                      />
                    </svg>
                  </div>
                  <button
                    type="button"
                    onClick={() => {
                      searchStore.setExperienceIndustries(
                        searchStore.experienceIndustries.filter(
                          (i) => i.id !== industry.id,
                        ),
                      );
                    }}
                    className="bg-[#d2f1da] flex items-center justify-center w-10 h-[40px] rounded-r-[10px]"
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
              value={searchStore.currentSalaryMin}
              className="min-w-60"
              onChange={(value: string) =>
                searchStore.setCurrentSalaryMin(value)
              }
              options={[
                { value: '', label: '指定なし' },
                { value: '500', label: '500万円' },
                { value: '600', label: '600万円' },
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
              value={searchStore.currentSalaryMax}
              className="min-w-60"
              onChange={(value: string) =>
                searchStore.setCurrentSalaryMax(value)
              }
              options={[
                { value: '', label: '指定なし' },
                { value: '500', label: '500万円' },
                { value: '600', label: '600万円' },
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
        <div className="flex-1 py-6 flex items-center w-full">
          <input
            type="text"
            value={searchStore.currentCompany}
            onChange={(e) => searchStore.setCurrentCompany(e.target.value)}
            placeholder="在籍企業を入力"
            className="w-[400px] font-medium px-4 py-3 border border-[#999] rounded-[4px] text-[14px] tracking-[1.4px] text-[#323232] placeholder:text-[#999]"
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
              className=" w-[358px]"
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
              className="text-[#323232] text-[14px] font-bold tracking-[1.6px]"
              style={{ fontFamily: 'Noto Sans JP, sans-serif' }}
            >
              以上
            </span>
          </div>
        </div>
      </div>
    </div>

    {/* 経験職種モーダル */}
    <JobTypeSelectModal
      isOpen={searchStore.isJobTypeModalOpen}
      onClose={() => {
        console.log('🔥 JobType Modal onClose called');
        searchStore.setIsJobTypeModalOpen(false);
      }}
      onConfirm={(jobNames) => {
        try {
        console.log('🔥 JobType Modal onConfirm CALLED!');
        console.log('=== JobType Modal onConfirm START ===');
        console.log('SearchConditionForm: JobType onConfirm called with:', jobNames);
        console.log('SearchConditionForm: JobType onConfirm jobNames type:', typeof jobNames);
        console.log('SearchConditionForm: JobType onConfirm jobNames length:', jobNames?.length);
        console.log('SearchConditionForm: JobType onConfirm jobNames JSON:', JSON.stringify(jobNames, null, 2));
        console.log('SearchConditionForm: Current experienceJobTypes before update:', searchStore.experienceJobTypes);
        console.log('SearchConditionForm: Current experienceJobTypes JSON:', JSON.stringify(searchStore.experienceJobTypes, null, 2));
        
        // signup/educationと同じ方式でIDを生成
        const jobTypes = jobNames.map((jobName) => {
          const existing = searchStore.experienceJobTypes.find((j) => j.name === jobName);
          const newJobType = {
            id: jobName, // 名前をそのままIDとして使用
            name: jobName,
            experienceYears: existing?.experienceYears || '',
          };
          console.log('SearchConditionForm: Creating jobType:', newJobType);
          return newJobType;
        });
        console.log('SearchConditionForm: Final jobTypes array:', jobTypes);
        console.log('SearchConditionForm: Final jobTypes JSON:', JSON.stringify(jobTypes, null, 2));
        console.log('SearchConditionForm: About to call setExperienceJobTypes...');
        
        searchStore.setExperienceJobTypes(jobTypes);
        
        console.log('SearchConditionForm: setExperienceJobTypes called, immediate check:', searchStore.experienceJobTypes);
        
        // モーダルを閉じる
        console.log('SearchConditionForm: About to close modal...');
        searchStore.setIsJobTypeModalOpen(false);
        
        setTimeout(() => {
          console.log('SearchConditionForm: After timeout, experienceJobTypes:', searchStore.experienceJobTypes);
          console.log('SearchConditionForm: After timeout, experienceJobTypes JSON:', JSON.stringify(searchStore.experienceJobTypes, null, 2));
        }, 100);
        
        setTimeout(() => {
          console.log('SearchConditionForm: After 500ms timeout, experienceJobTypes:', searchStore.experienceJobTypes);
          console.log('SearchConditionForm: After 500ms timeout, experienceJobTypes JSON:', JSON.stringify(searchStore.experienceJobTypes, null, 2));
        }, 500);
        console.log('=== JobType Modal onConfirm END ===');
        } catch (error) {
          console.error('🚨 Error in JobType Modal onConfirm:', error);
        }
      }}
      initialSelected={searchStore.experienceJobTypes.map(j => j.name)}
      maxSelections={3}
    />

    {/* 経験業種モーダル */}
    <IndustrySelectModal
      isOpen={searchStore.isIndustryModalOpen}
      onClose={() => {
        const store = useSearchStore.getState();
        store.setIsIndustryModalOpen(false);
      }}
      onConfirm={(industryNames) => {
        const industries = industryNames.map((industryName) => ({
          id: industryName,
          name: industryName,
        }));
        searchStore.setExperienceIndustries(industries);
        searchStore.setIsIndustryModalOpen(false);
      }}
      initialSelected={searchStore.experienceIndustries.map(i => i.name)}
      maxSelections={3}
    />
    </>
  );
}