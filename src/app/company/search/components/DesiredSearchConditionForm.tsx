'use client';

import React from 'react';
import { useSearchStore } from '@/stores/searchStore';

export default function DesiredSearchConditionForm() {
  const searchStore = useSearchStore();

  return (
    <>
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
              <div className="flex flex-wrap gap-2">
                {searchStore.desiredJobTypes.map((job) => (
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
                        searchStore.setDesiredJobTypes(
                          searchStore.desiredJobTypes.filter(
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
              onClick={() => searchStore.setIsDesiredIndustryModalOpen(true)}
              className="w-[170px] py-[12px] bg-white border border-[#999999] rounded-[32px] text-[14px] font-bold text-[#323232] tracking-[1.4px]"
              style={{ fontFamily: 'Noto Sans JP, sans-serif' }}
            >
              業種を選択
            </button>
            {searchStore.desiredIndustries.length > 0 && (
              <div className="flex flex-wrap gap-2">
                {searchStore.desiredIndustries.map((industry) => (
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
                        searchStore.setDesiredIndustries(
                          searchStore.desiredIndustries.filter(
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
    </>
  );
}