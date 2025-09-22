'use client';

import React from 'react';
import { Checkbox } from '@/components/ui/checkbox';
import { useSearchStore } from '@/stores/searchStore';
import SelectableTagWithYears from './SelectableTagWithYears';

export default function ExperienceSearchConditionForm() {
  const searchStore = useSearchStore();

  console.log('[DEBUG] ExperienceSearchConditionForm render:', {
    experienceJobTypes: searchStore.experienceJobTypes,
    experienceIndustries: searchStore.experienceIndustries,
  });

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
              onClick={() => searchStore.setIsJobTypeModalOpen(true)}
              className='w-[160px] py-[12px] bg-white border border-[#999999] rounded-[32px] text-[14px] font-bold text-[#323232] tracking-[1.4px]'
              style={{ fontFamily: 'Noto Sans JP, sans-serif' }}
            >
              職種を選択
            </button>
            <div className='flex items-center gap-2'>
              <Checkbox
                checked={searchStore.jobTypeAndSearch}
                onChange={(checked: boolean) =>
                  searchStore.setJobTypeAndSearch(checked)
                }
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
          {searchStore.experienceJobTypes.length > 0 && (
            <div className='flex flex-wrap gap-2 mt-4'>
              {console.log(
                '[DEBUG] experienceJobTypes:',
                searchStore.experienceJobTypes
              )}
              {searchStore.experienceJobTypes
                .filter(job => job && job.id && job.name)
                .map(job => (
                  <SelectableTagWithYears
                    key={job.id}
                    id={job.id}
                    name={job.name}
                    experienceYears={job.experienceYears}
                    onYearsChange={(id, years) =>
                      searchStore.updateExperienceJobTypeYears(id, years)
                    }
                    onRemove={id => {
                      searchStore.setExperienceJobTypes(
                        searchStore.experienceJobTypes.filter(j => j.id !== id)
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
              onClick={() => searchStore.setIsIndustryModalOpen(true)}
              className='w-[160px] py-[12px] bg-white border border-[#999999] rounded-[32px] text-[14px] font-bold text-[#323232] tracking-[1.4px]'
              style={{ fontFamily: 'Noto Sans JP, sans-serif' }}
            >
              業種を選択
            </button>
            <div className='flex items-center gap-2'>
              <Checkbox
                checked={searchStore.industryAndSearch}
                onChange={(checked: boolean) =>
                  searchStore.setIndustryAndSearch(checked)
                }
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
          {searchStore.experienceIndustries.length > 0 && (
            <div className='flex flex-wrap gap-2 mt-4'>
              {console.log(
                '[DEBUG] experienceIndustries:',
                searchStore.experienceIndustries
              )}
              {searchStore.experienceIndustries
                .filter(industry => industry && industry.id && industry.name)
                .map(industry => (
                  <SelectableTagWithYears
                    key={industry.id}
                    id={industry.id}
                    name={industry.name}
                    experienceYears={industry.experienceYears}
                    onYearsChange={(id, years) =>
                      searchStore.updateExperienceIndustryYears(id, years)
                    }
                    onRemove={id => {
                      searchStore.setExperienceIndustries(
                        searchStore.experienceIndustries.filter(
                          i => i.id !== id
                        )
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
