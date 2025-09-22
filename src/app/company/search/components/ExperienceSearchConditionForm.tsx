'use client';

import React from 'react';
import { Checkbox } from '@/components/ui/checkbox';
import { useSearchStore } from '@/stores/searchStore';
import SelectableTagWithYears from './SelectableTagWithYears';

export default function ExperienceSearchConditionForm() {
  const experienceJobTypes = useSearchStore(state => state.experienceJobTypes);
  const experienceIndustries = useSearchStore(
    state => state.experienceIndustries
  );
  const jobTypeAndSearch = useSearchStore(state => state.jobTypeAndSearch);
  const industryAndSearch = useSearchStore(state => state.industryAndSearch);
  const setIsJobTypeModalOpen = useSearchStore(
    state => state.setIsJobTypeModalOpen
  );
  const setIsIndustryModalOpen = useSearchStore(
    state => state.setIsIndustryModalOpen
  );
  const setJobTypeAndSearch = useSearchStore(
    state => state.setJobTypeAndSearch
  );
  const setIndustryAndSearch = useSearchStore(
    state => state.setIndustryAndSearch
  );
  const setExperienceJobTypes = useSearchStore(
    state => state.setExperienceJobTypes
  );
  const setExperienceIndustries = useSearchStore(
    state => state.setExperienceIndustries
  );
  const updateExperienceJobTypeYears = useSearchStore(
    state => state.updateExperienceJobTypeYears
  );
  const updateExperienceIndustryYears = useSearchStore(
    state => state.updateExperienceIndustryYears
  );

  return (
    <>
      {/* 経験職種 */}
      <div className='flex gap-6 items-strech'>
        <div className='w-[201px] bg-[#f9f9f9] rounded-[5px] px-6 py-0 flex items-center justify-start min-h-[102px]'>
          <span
            className='text-[#323232] text-[16px] font-bold tracking-[1.6px] leading-[32px]'
            style={{ fontFamily: 'Noto Sans JP, sans-serif' }}
          >
            経験職種
          </span>
        </div>
        <div className='flex-1 py-6'>
          <div className='flex items-center gap-4'>
            <button
              onClick={() => setIsJobTypeModalOpen(true)}
              className='w-[160px] py-[12px] bg-white border border-[#999999] rounded-[32px] text-[14px] font-bold text-[#323232] tracking-[1.4px]'
              style={{ fontFamily: 'Noto Sans JP, sans-serif' }}
            >
              職種を選択
            </button>
            <div className='flex items-center gap-2'>
              <Checkbox
                checked={jobTypeAndSearch}
                onChange={(checked: boolean) => setJobTypeAndSearch(checked)}
              />
              <label
                className='text-[#323232] text-[14px] font-medium tracking-[1.4px]'
                style={{ fontFamily: 'Noto Sans JP, sans-serif' }}
              >
                選択した職種すべてが当てはまる
              </label>
            </div>
          </div>

          {/* 選択された職種のタグ表示 */}
          {experienceJobTypes.length > 0 && (
            <div className='flex flex-wrap gap-2 mt-4'>
              {experienceJobTypes
                .filter(job => job && job.id && job.name)
                .map(job => (
                  <SelectableTagWithYears
                    key={job?.id || job?.name || 'unknown'}
                    id={job?.id || job?.name || 'unknown'}
                    name={job?.name || 'Unknown Job'}
                    experienceYears={job.experienceYears}
                    onYearsChange={(id, years) =>
                      updateExperienceJobTypeYears(id, years)
                    }
                    onRemove={id => {
                      setExperienceJobTypes(
                        experienceJobTypes.filter(j => j.id !== id)
                      );
                    }}
                    selectIdPrefix='job'
                  />
                ))}
            </div>
          )}
        </div>
      </div>

      {/* 経験業種 */}
      <div className='flex gap-6 items-strech'>
        <div className='w-[201px] bg-[#f9f9f9] rounded-[5px] px-6 py-0 flex items-center justify-start min-h-[102px]'>
          <span
            className='text-[#323232] text-[16px] font-bold tracking-[1.6px] leading-[32px]'
            style={{ fontFamily: 'Noto Sans JP, sans-serif' }}
          >
            経験業種
          </span>
        </div>
        <div className='flex-1 py-6'>
          <div className='flex items-center gap-4'>
            <button
              onClick={() => setIsIndustryModalOpen(true)}
              className='w-[160px] py-[12px] bg-white border border-[#999999] rounded-[32px] text-[14px] font-bold text-[#323232] tracking-[1.4px]'
              style={{ fontFamily: 'Noto Sans JP, sans-serif' }}
            >
              業種を選択
            </button>
            <div className='flex items-center gap-2'>
              <Checkbox
                checked={industryAndSearch}
                onChange={(checked: boolean) => setIndustryAndSearch(checked)}
              />
              <label
                className='text-[#323232] text-[14px] font-medium tracking-[1.4px]'
                style={{ fontFamily: 'Noto Sans JP, sans-serif' }}
              >
                選択した業種すべてが当てはまる
              </label>
            </div>
          </div>

          {/* 選択された業種のタグ表示 */}
          {experienceIndustries.length > 0 && (
            <div className='flex flex-wrap gap-2 mt-4'>
              {experienceIndustries
                .filter(industry => industry && industry.id && industry.name)
                .map(industry => (
                  <SelectableTagWithYears
                    key={industry?.id || industry?.name || 'unknown'}
                    id={industry?.id || industry?.name || 'unknown'}
                    name={industry?.name || 'Unknown Industry'}
                    experienceYears={industry.experienceYears}
                    onYearsChange={(id, years) =>
                      updateExperienceIndustryYears(id, years)
                    }
                    onRemove={id => {
                      setExperienceIndustries(
                        experienceIndustries.filter(i => i.id !== id)
                      );
                    }}
                    selectIdPrefix='industry'
                  />
                ))}
            </div>
          )}
        </div>
      </div>
    </>
  );
}
