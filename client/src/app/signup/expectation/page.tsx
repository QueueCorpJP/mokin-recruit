'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { Button } from '@/components/ui/button';
import IndustrySelectModal from '@/components/career-status/IndustrySelectModal';
import JobTypeSelectModal from '@/components/career-status/JobTypeSelectModal';
import WorkLocationSelectModal from '@/components/career-status/WorkLocationSelectModal';
import WorkStyleSelectModal from '@/components/career-status/WorkStyleSelectModal';
import { type Industry } from '@/constants/industry-data';
import { type JobType } from '@/constants/job-type-data';
import { saveExpectationData } from './actions';

interface ExpectationFormData {
  desiredIncome: string;
  industries: Array<{
    id: string;
    name: string;
  }>;
  jobTypes: Array<{
    id: string;
    name: string;
  }>;
  workLocations: Array<{
    id: string;
    name: string;
  }>;
  workStyles: Array<{
    id: string;
    name: string;
  }>;
}

export default function SignupExpectationPage() {
  const router = useRouter();
  const [isIndustryModalOpen, setIsIndustryModalOpen] = useState(false);
  const [isJobTypeModalOpen, setIsJobTypeModalOpen] = useState(false);
  const [isWorkLocationModalOpen, setIsWorkLocationModalOpen] = useState(false);
  const [isWorkStyleModalOpen, setIsWorkStyleModalOpen] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const [formData, setFormData] = useState<ExpectationFormData>({
    desiredIncome: '',
    industries: [],
    jobTypes: [],
    workLocations: [],
    workStyles: [],
  });

  const isFormValid = () => {
    return (
      formData.desiredIncome.trim() !== '' &&
      formData.industries.length > 0 &&
      formData.industries.length <= 3 &&
      formData.jobTypes.length > 0 &&
      formData.jobTypes.length <= 3 &&
      formData.workLocations.length > 0 &&
      formData.workStyles.length > 0
    );
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!isFormValid()) return;

    setIsSubmitting(true);
    try {
      await saveExpectationData(formData);
    } catch (error) {
      console.error('Expectation data save failed:', error);
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleRemoveIndustry = (id: string) => {
    setFormData(prev => ({
      ...prev,
      industries: prev.industries.filter((i) => i.id !== id)
    }));
  };

  const handleRemoveJobType = (id: string) => {
    setFormData(prev => ({
      ...prev,
      jobTypes: prev.jobTypes.filter((j) => j.id !== id)
    }));
  };

  const handleRemoveWorkLocation = (id: string) => {
    setFormData(prev => ({
      ...prev,
      workLocations: prev.workLocations.filter((w) => w.id !== id)
    }));
  };

  const handleRemoveWorkStyle = (id: string) => {
    setFormData(prev => ({
      ...prev,
      workStyles: prev.workStyles.filter((w) => w.id !== id)
    }));
  };

  return (
    <>
      <IndustrySelectModal
        isOpen={isIndustryModalOpen}
        onClose={() => setIsIndustryModalOpen(false)}
        onConfirm={(selected) => {
          setFormData(prev => ({ ...prev, industries: selected.map(s => ({ id: s, name: s })) }));
        }}
        initialSelected={formData.industries.map(i => i.name)}
        maxSelections={3}
      />
      <JobTypeSelectModal
        isOpen={isJobTypeModalOpen}
        onClose={() => setIsJobTypeModalOpen(false)}
        onConfirm={(selected) => {
          setFormData(prev => ({ ...prev, jobTypes: selected.map(s => ({ id: s, name: s })) }));
        }}
        initialSelected={formData.jobTypes.map(j => j.name)}
        maxSelections={3}
      />
      <WorkLocationSelectModal
        isOpen={isWorkLocationModalOpen}
        onClose={() => setIsWorkLocationModalOpen(false)}
        onConfirm={(selected) => {
          setFormData(prev => ({ ...prev, workLocations: selected }));
        }}
        initialSelected={formData.workLocations}
      />
      <WorkStyleSelectModal
        isOpen={isWorkStyleModalOpen}
        onClose={() => setIsWorkStyleModalOpen(false)}
        onConfirm={(selected) => {
          setFormData(prev => ({ ...prev, workStyles: selected }));
        }}
        initialSelected={formData.workStyles}
      />

      <div className="min-h-screen flex flex-col">

        <form onSubmit={handleSubmit}>
          {/* PC Version */}
          <div className="hidden lg:block">
            <main
              className="hidden lg:flex relative py-20 flex-col items-center justify-start"
              style={{
                backgroundImage: "url('/background-pc.svg')",
                backgroundPosition: 'center top',
                backgroundRepeat: 'no-repeat',
                backgroundSize: 'cover',
              }}
            >
              <div className="bg-white rounded-[40px] shadow-[0px_0px_20px_0px_rgba(0,0,0,0.05)] p-20 w-[1000px] flex flex-col gap-10 items-center">
                <div className="flex flex-col gap-6 items-center w-full">
                  <h1 className="text-[#0f9058] text-[32px] font-bold tracking-[3.2px] text-center">
                    会員情報
                  </h1>
                </div>

                {/* Progress Tabs */}
                <div className="flex flex-row w-full h-[45px]">
                  <div className="flex-1 flex flex-row gap-2 items-center justify-center py-2 px-6 border-b-3 border-[#0f9058]">
                    <div className="w-6 h-6 flex items-center justify-center">
                      <svg
                        width="24"
                        height="23"
                        viewBox="0 0 24 23"
                        fill="none"
                      >
                        <path
                          d="M8.625 2.5H15.375C15.5813 2.5 15.75 2.66875 15.75 2.875V4.75H8.25V2.875C8.25 2.66875 8.41875 2.5 8.625 2.5ZM6 2.875V4.75H3C1.34531 4.75 0 6.09531 0 7.75V12.25H9H15H24V7.75C24 6.09531 22.6547 4.75 21 4.75H18V2.875C18 1.42656 16.8234 0.25 15.375 0.25H8.625C7.17656 0.25 6 1.42656 6 2.875ZM24 13.75H15V15.25C15 16.0797 14.3297 16.75 13.5 16.75H10.5C9.67031 16.75 9 16.0797 9 15.25V13.75H0V19.75C0 21.4047 1.34531 22.75 3 22.75H21C22.6547 22.75 24 21.4047 24 19.75V13.75Z"
                          fill="#DCDCDC"
                        />
                      </svg>
                    </div>
                    <span className="text-[#dcdcdc] text-[18px] font-bold tracking-[1.8px]">
                      経歴詳細
                    </span>
                  </div>
                  <div className="flex-1 flex flex-row gap-2 items-center justify-center py-2 px-6 border-b-3 border-[#0f9058]">
                    <div className="w-6 h-6 flex items-center justify-center">
                      <svg
                        width="25"
                        height="21"
                        viewBox="0 0 25 21"
                        fill="none"
                      >
                        <path
                          d="M16.6687 0.458333L22.6582 6.44427C25.1139 8.8979 25.1139 12.8422 22.6582 15.2959L17.4092 20.5411C16.9733 20.9763 16.261 20.9809 15.8204 20.5503C15.3799 20.1198 15.3752 19.4161 15.8111 18.9809L21.0554 13.7357C22.6441 12.1478 22.6441 9.59696 21.0554 8.00904L15.0706 2.0231C14.6347 1.58793 14.6394 0.884246 15.08 0.453703C15.5205 0.0231603 16.2329 0.0277898 16.6687 0.462962V0.458333ZM0.5 9.27289V2.3518C0.5 1.12498 1.50762 0.129639 2.74956 0.129639H9.756C10.5527 0.129639 11.3166 0.439815 11.879 0.995354L19.7525 8.77291C20.9241 9.93028 20.9241 11.8052 19.7525 12.9626L13.4959 19.143C12.3243 20.3004 10.4262 20.3004 9.25454 19.143L1.38108 11.3654C0.814001 10.8099 0.5 10.0599 0.5 9.27289ZM7.24868 5.31467C7.24868 4.92177 7.09068 4.54496 6.80943 4.26714C6.52818 3.98931 6.14672 3.83324 5.74897 3.83324C5.35123 3.83324 4.96977 3.98931 4.68852 4.26714C4.40727 4.54496 4.24927 4.92177 4.24927 5.31467C4.24927 5.70758 4.40727 6.08439 4.68852 6.36221C4.96977 6.64003 5.35123 6.79611 5.74897 6.79611C6.14672 6.79611 6.52818 6.64003 6.80943 6.36221C7.09068 6.08439 7.24868 5.70758 7.24868 5.31467Z"
                          fill="#DCDCDC"
                        />
                      </svg>
                    </div>
                    <span className="text-[#dcdcdc] text-[18px] font-bold tracking-[1.8px]">
                      語学・スキル
                    </span>
                  </div>
                  <div className="flex-1 flex flex-row gap-2 items-center justify-center py-2 px-6 border-b-3 border-[#0f9058]">
                    <div className="w-6 h-6 flex items-center justify-center">
                      <svg
                        width="24"
                        height="25"
                        viewBox="0 0 24 25"
                        fill="none"
                      >
                        <path
                          d="M4.48576 2C4.48576 1.17031 3.81427 0.5 2.98311 0.5C2.15196 0.5 1.48047 1.17031 1.48047 2V3.5V17.75V23C1.48047 23.8297 2.15196 24.5 2.98311 24.5C3.81427 24.5 4.48576 23.8297 4.48576 23V17L7.50514 16.2453C9.4351 15.7625 11.4778 15.9875 13.2575 16.8734C15.333 17.9094 17.7419 18.0359 19.9114 17.2203L21.5408 16.6109C22.1278 16.3906 22.5175 15.8328 22.5175 15.2047V3.59375C22.5175 2.51562 21.3811 1.8125 20.4138 2.29531L19.963 2.52031C17.7889 3.60781 15.2297 3.60781 13.0555 2.52031C11.4073 1.69531 9.51493 1.48906 7.72584 1.93438L4.48576 2.75V2Z"
                          fill="#0F9058"
                        />
                      </svg>
                    </div>
                    <span className="text-[#0f9058] text-[18px] font-bold tracking-[1.8px]">
                      希望条件
                    </span>
                  </div>
                  <div className="flex-1 flex flex-row gap-2 items-center justify-center py-2 px-6 border-b-3 border-[#dcdcdc]">
                    <div className="w-6 h-6 flex items-center justify-center">
                      <svg
                        width="24"
                        height="25"
                        viewBox="0 0 24 25"
                        fill="none"
                      >
                        <path
                          d="M6.26322 0.5H14.2377H14.8552L15.292 0.935984L21.3296 6.97353L21.7656 7.40989V8.02747V20.4734C21.7656 22.6933 19.9593 24.5 17.7391 24.5H6.26317C4.04374 24.5 2.23745 22.6933 2.23745 20.4734V4.52572C2.2375 2.30581 4.04374 0.5 6.26322 0.5ZM3.72827 20.4734C3.72827 21.8738 4.8632 23.0092 6.26317 23.0092H17.7391C19.1395 23.0092 20.2748 21.8738 20.2748 20.4734V8.02752H16.3505C15.1841 8.02752 14.2377 7.08144 14.2377 5.91467V1.99072H6.26317C4.8632 1.99072 3.72827 3.12612 3.72827 4.52567V20.4734Z"
                          fill="#DCDCDC"
                        />
                        <path
                          d="M7.93766 7.97266C8.2971 8.22423 8.73472 8.37283 9.20572 8.37283C9.6771 8.37283 10.1143 8.22423 10.4742 7.97266C11.1032 8.24336 11.4895 8.71806 11.7252 9.13736C12.0383 9.69348 11.7928 10.4807 11.2521 10.4807C10.7107 10.4807 9.20572 10.4807 9.20572 10.4807C9.20572 10.4807 7.70113 10.4807 7.15968 10.4807C6.61865 10.4807 6.37279 9.69348 6.68624 9.13736C6.92197 8.71802 7.30832 8.24336 7.93766 7.97266Z"
                          fill="#DCDCDC"
                        />
                        <path
                          d="M9.20538 7.84598C8.28086 7.84598 7.53222 7.09734 7.53222 6.17325V5.77228C7.53222 4.84903 8.28086 4.09912 9.20538 4.09912C10.1295 4.09912 10.8789 4.84903 10.8789 5.77228V6.17325C10.8789 7.09734 10.1294 7.84598 9.20538 7.84598Z"
                          fill="#DCDCDC"
                        />
                        <path
                          d="M6.65731 12.7046H17.457V13.7532H6.65731V12.7046Z"
                          fill="#DCDCDC"
                        />
                        <path
                          d="M6.60262 15.8508H17.4023V16.8999H6.60262V15.8508Z"
                          fill="#DCDCDC"
                        />
                        <path
                          d="M6.64308 18.9976H14.2031V20.0458H6.64308V18.9976Z"
                          fill="#DCDCDC"
                        />
                      </svg>
                    </div>
                    <span className="text-[#dcdcdc] text-[18px] font-bold tracking-[1.8px]">
                      職務要約
                    </span>
                  </div>
                </div>

                <div className="text-[#323232] text-[16px] leading-8 tracking-[1.6px] text-center font-bold">
                  <p>あなたが求める働き方や希望条件を教えてください。</p>
                </div>

                {/* Form Fields */}
                <div className="flex flex-col gap-6 w-fit mx-auto items-end">
                  {/* Desired Annual Income */}
                  <div className="flex flex-row gap-4 items-start w-full">
                    <div className="pt-[11px] min-w-[130px] text-right">
                      <label className="text-[#323232] text-[16px] font-bold tracking-[1.6px]">
                        希望年収
                      </label>
                    </div>
                    <div className="w-[400px]">
                      <div className="relative">
                        <select
                          value={formData.desiredIncome}
                          onChange={(e) => setFormData(prev => ({ ...prev, desiredIncome: e.target.value }))}
                          className="w-full px-[11px] py-[11px] pr-10 bg-white border border-[#999999] rounded-[5px] text-[16px] text-[#323232] font-bold tracking-[1.6px] appearance-none cursor-pointer"
                        >
                          <option value="">未選択</option>
                          <option value="300-400">300万円〜400万円</option>
                          <option value="400-500">400万円〜500万円</option>
                          <option value="500-600">500万円〜600万円</option>
                          <option value="600-700">600万円〜700万円</option>
                          <option value="700-800">700万円〜800万円</option>
                          <option value="800-900">800万円〜900万円</option>
                          <option value="900-1000">900万円〜1000万円</option>
                          <option value="1000-1200">1000万円〜1200万円</option>
                          <option value="1200-1500">1200万円〜1500万円</option>
                          <option value="1500-2000">1500万円〜2000万円</option>
                          <option value="2000-3000">2000万円〜3000万円</option>
                          <option value="3000+">3000万円以上</option>
                        </select>
                        <div className="absolute right-4 top-1/2 -translate-y-1/2 pointer-events-none">
                          <svg
                            width="14"
                            height="10"
                            viewBox="0 0 14 10"
                            fill="none"
                          >
                            <path
                              d="M6.07178 8.90462L0.234161 1.71483C-0.339509 1.00828 0.206262 0 1.16238 0H12.8376C13.7937 0 14.3395 1.00828 13.7658 1.71483L7.92822 8.90462C7.46411 9.47624 6.53589 9.47624 6.07178 8.90462Z"
                              fill="#0F9058"
                            />
                          </svg>
                        </div>
                      </div>
                    </div>
                  </div>

                  {/* Desired Industry */}
                  <div className="flex flex-row gap-4 items-start w-full">
                    <div className="pt-[11px] min-w-[130px] text-right">
                      <label className="text-[#323232] text-[16px] font-bold tracking-[1.6px]">
                        希望業種
                      </label>
                    </div>
                    <div className="flex flex-col gap-2 w-[400px]">
                      <button
                        type="button"
                        onClick={() => setIsIndustryModalOpen(true)}
                        className="w-[170px] py-[12px] bg-white border border-[#999999] rounded-[32px] text-[16px] text-[#323232] font-bold tracking-[1.6px]"
                      >
                        業種を選択
                      </button>
                      {formData.industries.length > 0 && (
                        <div className="flex flex-wrap gap-2">
                          {formData.industries.map((industry) => (
                            <div
                              key={industry.id}
                              className="bg-[#d2f1da] px-6 py-[10px] rounded-[10px] flex items-center gap-2.5"
                            >
                              <span className="text-[#0f9058] text-[14px] font-medium tracking-[1.4px]">
                                {industry.name}
                              </span>
                              <button
                                type="button"
                                onClick={() =>
                                  handleRemoveIndustry(industry.id)
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

                  {/* Desired Job Type */}
                  <div className="flex flex-row gap-4 items-start w-full">
                    <div className="pt-[11px] min-w-[130px] text-right">
                      <label className="text-[#323232] text-[16px] font-bold tracking-[1.6px]">
                        希望職種
                      </label>
                    </div>
                    <div className="flex flex-col gap-2 w-[400px]">
                      <button
                        type="button"
                        onClick={() => setIsJobTypeModalOpen(true)}
                        className="w-[170px] py-[12px] bg-white border border-[#999999] rounded-[32px] text-[16px] text-[#323232] font-bold tracking-[1.6px]"
                      >
                        職種を選択
                      </button>
                      {formData.jobTypes.length > 0 && (
                        <div className="flex flex-wrap gap-2">
                          {formData.jobTypes.map((jobType) => (
                            <div
                              key={jobType.id}
                              className="bg-[#d2f1da] px-6 py-[10px] rounded-[10px] flex items-center gap-2.5"
                            >
                              <span className="text-[#0f9058] text-[14px] font-medium tracking-[1.4px]">
                                {jobType.name}
                              </span>
                              <button
                                type="button"
                                onClick={() => handleRemoveJobType(jobType.id)}
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

                  {/* Desired Work Location */}
                  <div className="flex flex-row gap-4 items-start w-full">
                    <div className="pt-[11px] min-w-[130px] text-right">
                      <label className="text-[#323232] text-[16px] font-bold tracking-[1.6px]">
                        希望勤務地
                      </label>
                    </div>
                    <div className="flex flex-col gap-2 w-[400px]">
                      <button
                        type="button"
                        onClick={() => setIsWorkLocationModalOpen(true)}
                        className="w-[170px] py-[12px] bg-white border border-[#999999] rounded-[32px] text-[16px] text-[#323232] font-bold tracking-[1.6px]"
                      >
                        勤務地を選択
                      </button>
                      {formData.workLocations.length > 0 && (
                        <div className="flex flex-wrap gap-2">
                          {formData.workLocations.map((location, index) => (
                            <div
                              key={`desktop-${location.id || location.name}-${index}`}
                              className="bg-[#d2f1da] px-6 py-[10px] rounded-[10px] flex items-center gap-2.5"
                            >
                              <span className="text-[#0f9058] text-[14px] font-medium tracking-[1.4px]">
                                {location.name}
                              </span>
                              <button
                                type="button"
                                onClick={() =>
                                  handleRemoveWorkLocation(location.id)
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

                  {/* Interested Work Style */}
                  <div className="flex flex-row gap-3 items-start w-full">
                    <div className="pt-[11px] min-w-[130px] text-right">
                      <label className="text-[#323232] text-[16px] font-bold tracking-[1.6px]">
                        興味のある働き方
                      </label>
                    </div>
                    <div className="flex flex-col gap-2 w-[400px]">
                      <button
                        type="button"
                        onClick={() => setIsWorkStyleModalOpen(true)}
                        className="w-[170px] py-[12px] bg-white border border-[#999999] rounded-[32px] text-[16px] text-[#323232] font-bold tracking-[1.6px]"
                      >
                        働き方を選択
                      </button>
                      {formData.workStyles.length > 0 && (
                        <div className="flex flex-wrap gap-2">
                          {formData.workStyles.map((style) => (
                            <div
                              key={style.id}
                              className="bg-[#d2f1da] px-6 py-[10px] rounded-[10px] flex items-center gap-2.5"
                            >
                              <span className="text-[#0f9058] text-[14px] font-medium tracking-[1.4px]">
                                {style.name}
                              </span>
                              <button
                                type="button"
                                onClick={() => handleRemoveWorkStyle(style.id)}
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

                {/* Submit Button */}
                <Button
                  type="submit"
                  disabled={!isFormValid() || isSubmitting}
                  variant="green-gradient"
                  size="figma-default"
                  className="min-w-[160px] text-[16px] tracking-[1.6px] disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  {isSubmitting ? '送信中...' : '次へ'}
                </Button>
              </div>
            </main>
          </div>
          <div className="lg:hidden">
            {/* SP (Mobile) Version */}
            <main
              className="lg:hidden flex relative pt-6 pb-20 flex-col items-center px-4"
              style={{
                backgroundImage: "url('/background-sp.svg')",
                backgroundPosition: 'center top',
                backgroundRepeat: 'no-repeat',
                backgroundSize: 'cover',
              }}
            >
              <div className="bg-white rounded-3xl shadow-[0px_0px_20px_0px_rgba(0,0,0,0.05)] px-6 py-10 mx-4 w-full flex flex-col gap-10 items-center">
                {/* Progress Indicator */}
                <div className="flex flex-row gap-4 items-center w-full pb-4 border-b border-[#efefef]">
                  <div className="relative w-[72px] h-[72px]">
                    <svg width="72" height="72" viewBox="0 0 72 72" fill="none">
                      <circle
                        cx="36"
                        cy="36"
                        r="28.8"
                        stroke="#e0e0e0"
                        strokeWidth="7.2"
                        fill="none"
                        strokeLinecap="round"
                        transform="rotate(-90 36 36)"
                      />
                      <circle
                        cx="36"
                        cy="36"
                        r="28.8"
                        stroke="#0f9058"
                        strokeWidth="7.2"
                        fill="none"
                        strokeLinecap="round"
                        strokeDasharray="135.72 45.24"
                        transform="rotate(-90 36 36)"
                      />
                    </svg>
                    <div className="absolute inset-0 flex items-center justify-center">
                      <div className="text-center">
                        <span className="text-[#0f9058] text-[24px] font-medium tracking-[2.4px]">
                          3
                        </span>
                        <span className="text-[#999999] text-[17px] font-medium tracking-[1.7px]">
                          /4
                        </span>
                      </div>
                    </div>
                  </div>
                  <div className="flex flex-col">
                    <p className="text-[#999999] text-[16px] font-bold tracking-[1.6px]">
                      会員情報
                    </p>
                    <p className="text-[#0f9058] text-[20px] font-bold tracking-[2px]">
                      希望条件
                    </p>
                  </div>
                </div>

                {/* Description */}
                <div className="text-[#323232] text-[16px] leading-8 tracking-[1.6px] text-center font-bold">
                  <p>あなたが求める働き方や希望条件を</p>
                  <p>教えてください。</p>
                </div>

                {/* Form Fields */}
                <div className="flex flex-col gap-6 w-full">
                  {/* Desired Annual Income */}
                  <div className="flex flex-col gap-2">
                    <label className="text-[#323232] text-[16px] font-bold tracking-[1.6px]">
                      希望年収
                    </label>
                    <div className="relative">
                      <select
                        value={formData.desiredIncome}
                        onChange={(e) => setFormData(prev => ({ ...prev, desiredIncome: e.target.value }))}
                        className="w-full px-[11px] py-[11px] pr-10 bg-white border border-[#999999] rounded-[5px] text-[16px] text-[#323232] font-bold tracking-[1.6px] appearance-none cursor-pointer"
                      >
                        <option value="">未選択</option>
                        <option value="300-400">300万円〜400万円</option>
                        <option value="400-500">400万円〜500万円</option>
                        <option value="500-600">500万円〜600万円</option>
                        <option value="600-700">600万円〜700万円</option>
                        <option value="700-800">700万円〜800万円</option>
                        <option value="800-900">800万円〜900万円</option>
                        <option value="900-1000">900万円〜1000万円</option>
                        <option value="1000-1200">1000万円〜1200万円</option>
                        <option value="1200-1500">1200万円〜1500万円</option>
                        <option value="1500-2000">1500万円〜2000万円</option>
                        <option value="2000-3000">2000万円〜3000万円</option>
                        <option value="3000+">3000万円以上</option>
                      </select>
                      <div className="absolute right-4 top-1/2 -translate-y-1/2 pointer-events-none">
                        <svg
                          width="14"
                          height="10"
                          viewBox="0 0 14 10"
                          fill="none"
                        >
                          <path
                            d="M6.07178 8.90462L0.234161 1.71483C-0.339509 1.00828 0.206262 0 1.16238 0H12.8376C13.7937 0 14.3395 1.00828 13.7658 1.71483L7.92822 8.90462C7.46411 9.47624 6.53589 9.47624 6.07178 8.90462Z"
                            fill="#0F9058"
                          />
                        </svg>
                      </div>
                    </div>
                  </div>

                  {/* Desired Industry */}
                  <div className="flex flex-col gap-2">
                    <label className="text-[#323232] text-[16px] font-bold tracking-[1.6px]">
                      希望業種
                    </label>
                    <button
                      type="button"
                      onClick={() => setIsIndustryModalOpen(true)}
                      className="w-full py-[11px] bg-white border border-[#999999] rounded-[32px] text-[16px] text-[#323232] font-bold tracking-[1.6px]"
                    >
                      業種を選択
                    </button>
                    {formData.industries.length > 0 && (
                      <div className="flex flex-wrap gap-2">
                        {formData.industries.map((industry) => (
                          <div
                            key={industry.id}
                            className="bg-[#d2f1da] px-6 py-[10px] rounded-[10px] flex items-center gap-2.5"
                          >
                            <span className="text-[#0f9058] text-[14px] font-medium tracking-[1.4px]">
                              {industry.name}
                            </span>
                            <button
                              type="button"
                              onClick={() => handleRemoveIndustry(industry.id)}
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

                  {/* Desired Job Type */}
                  <div className="flex flex-col gap-2">
                    <label className="text-[#323232] text-[16px] font-bold tracking-[1.6px]">
                      希望職種
                    </label>
                    <button
                      type="button"
                      onClick={() => setIsJobTypeModalOpen(true)}
                      className="w-full py-[11px] bg-white border border-[#999999] rounded-[32px] text-[16px] text-[#323232] font-bold tracking-[1.6px]"
                    >
                      職種を選択
                    </button>
                    {formData.jobTypes.length > 0 && (
                      <div className="flex flex-wrap gap-2">
                        {formData.jobTypes.map((jobType) => (
                          <div
                            key={jobType.id}
                            className="bg-[#d2f1da] px-6 py-[10px] rounded-[10px] flex items-center gap-2.5"
                          >
                            <span className="text-[#0f9058] text-[14px] font-medium tracking-[1.4px]">
                              {jobType.name}
                            </span>
                            <button
                              type="button"
                              onClick={() => handleRemoveJobType(jobType.id)}
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

                  {/* Desired Work Location */}
                  <div className="flex flex-col gap-2">
                    <label className="text-[#323232] text-[16px] font-bold tracking-[1.6px]">
                      希望勤務地
                    </label>
                    <button
                      type="button"
                      onClick={() => setIsWorkLocationModalOpen(true)}
                      className="w-full px-10 py-[11px] bg-white border border-[#999999] rounded-[32px] text-[16px] text-[#323232] font-bold tracking-[1.6px]"
                    >
                      勤務地を選択
                    </button>
                    {formData.workLocations.length > 0 && (
                      <div className="flex flex-wrap gap-2">
                        {formData.workLocations.map((location, index) => (
                          <div
                            key={`mobile-${location.id || location.name}-${index}`}
                            className="bg-[#d2f1da] px-6 py-[10px] rounded-[10px] flex items-center gap-2.5"
                          >
                            <span className="text-[#0f9058] text-[14px] font-medium tracking-[1.4px]">
                              {location.name}
                            </span>
                            <button
                              type="button"
                              onClick={() =>
                                handleRemoveWorkLocation(location.id)
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

                  {/* Interested Work Style */}
                  <div className="flex flex-col gap-2">
                    <label className="text-[#323232] text-[16px] font-bold tracking-[1.6px]">
                      興味のある働き方
                    </label>
                    <button
                      type="button"
                      onClick={() => setIsWorkStyleModalOpen(true)}
                      className="w-full py-[11px] bg-white border border-[#999999] rounded-[32px] text-[16px] text-[#323232] font-bold tracking-[1.6px]"
                    >
                      働き方を選択
                    </button>
                    {formData.workStyles.length > 0 && (
                      <div className="flex flex-wrap gap-2">
                        {formData.workStyles.map((style) => (
                          <div
                            key={style.id}
                            className="bg-[#d2f1da] px-6 py-[10px] rounded-[10px] flex items-center gap-2.5"
                          >
                            <span className="text-[#0f9058] text-[14px] font-medium tracking-[1.4px]">
                              {style.name}
                            </span>
                            <button
                              type="button"
                              onClick={() => handleRemoveWorkStyle(style.id)}
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

                {/* Submit Button */}
                <Button
                  type="submit"
                  disabled={!isFormValid() || isSubmitting}
                  variant="green-gradient"
                  size="figma-default"
                  className="w-full text-[16px] tracking-[1.6px] disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  {isSubmitting ? '送信中...' : '次へ'}
                </Button>
              </div>
            </main>
          </div>
        </form>

      </div>
    </>
  );
}
