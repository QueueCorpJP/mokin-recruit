'use client';

import React from 'react';
import { SelectInput } from '@/components/ui/select-input';
import { useSearchStore } from '@/stores/searchStore';
import { SALARY_OPTIONS, getFilteredMaxOptions, getFilteredMinOptions } from '@/lib/utils/salary-options';
import { AGE_OPTIONS, getFilteredMaxAgeOptions, getFilteredMinAgeOptions } from '@/lib/utils/age-options';

export default function DesiredConditionForm() {
  const searchStore = useSearchStore();

  return (
    <div className="flex flex-col gap-2">
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
                    { value: 'インドネシア語', label: 'インドネシア語' },
                    { value: 'イタリア語', label: 'イタリア語' },
                    { value: 'マレーシア語', label: 'マレーシア語' },
                    { value: 'オランダ語', label: 'オランダ語' },
                    { value: 'ノルウェー語', label: 'ノルウェー語' },
                    { value: 'ポルトガル語', label: 'ポルトガル語' },
                    { value: 'ロシア語', label: 'ロシア語' },
                    { value: 'スウェーデン語', label: 'スウェーデン語' },
                    { value: 'スワヒリ語', label: 'スワヒリ語' },
                    { value: 'タイ語', label: 'タイ語' },
                    { value: 'タガログ語', label: 'タガログ語' },
                    { value: 'ベトナム語', label: 'ベトナム語' },
                    { value: '日本語', label: '日本語' },
                    { value: '北京語', label: '北京語' },
                    { value: '韓国語・朝鮮語', label: '韓国語・朝鮮語' },
                    { value: 'アラビア語', label: 'アラビア語' },
                    { value: '広東語', label: '広東語' },
                    { value: 'スペイン語', label: 'スペイン語' },
                    { value: 'フィンランド語', label: 'フィンランド語' },
                    { value: '台湾語', label: '台湾語' },
                    { value: 'フランス語', label: 'フランス語' },
                    { value: 'ドイツ語', label: 'ドイツ語' },
                    { value: 'ヘブライ語', label: 'ヘブライ語' },
                    { value: 'ヒンディー語', label: 'ヒンディー語' },
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
                    className="inline-flex items-center gap-1"
                  >
                    <span className="bg-[#d2f1da] text-[#0f9058] text-[14px] font-bold tracking-[1.4px] h-[40px] flex items-center px-6 rounded-l-[10px] overflow-hidden max-w-[200px]">
                      <span className="line-clamp-1 break-all">{job.name}</span>
                    </span>
                    <button
                      type="button"
                      onClick={() => {
                        searchStore.setDesiredJobTypes(
                          searchStore.desiredJobTypes.filter(
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
                    className="inline-flex items-center gap-1"
                  >
                    <span className="bg-[#d2f1da] text-[#0f9058] text-[14px] font-bold tracking-[1.4px] h-[40px] flex items-center px-6 rounded-l-[10px] overflow-hidden max-w-[200px]">
                      <span className="line-clamp-1 break-all">{industry.name}</span>
                    </span>
                    <button
                      type="button"
                      onClick={() => {
                        searchStore.setDesiredIndustries(
                          searchStore.desiredIndustries.filter(
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
              { value: 'information-gathering', label: '情報収集中' },
              { value: 'document-screening', label: '書類選考に進んでいる企業がある' },
              { value: 'interview', label: '面接・面談を受けている企業がある' },
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
                    { value: 'same-industry', label: '業種・業界が同一' },
                  ]}
                  placeholder="選択してください"
                />
              </div>
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
                    { value: 'same-area', label: 'エリア区分が同一' },
                    { value: 'same-prefecture', label: '都道府県が同一' },
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
    </div>
  );
}