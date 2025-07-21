import React from 'react';
import { ImageUpload } from '@/components/ui/ImageUpload';
import { SelectInput } from '@/components/ui/select-input';
import { Checkbox } from '@/components/ui/checkbox';
import { 
  CompanyGroup, 
  salaryOptions, 
  employmentTypeOptions, 
  smokeOptions, 
  appealPointOptions, 
  appealPointCategories,
  resumeRequiredOptions 
} from './types';
import { Radio } from '@/components/ui/radio';

interface FormFieldsProps {
  // Form state
  group: string;
  setGroup: (value: string) => void;
  companyGroups: CompanyGroup[];
  title: string;
  setTitle: (value: string) => void;
  images: File[];
  setImages: (images: File[]) => void;
  jobTypes: string[];
  setJobTypes: (types: string[]) => void;
  industries: string[];
  setIndustries: (industries: string[]) => void;
  jobDescription: string;
  setJobDescription: (value: string) => void;
  positionSummary: string;
  setPositionSummary: (value: string) => void;
  skills: string;
  setSkills: (value: string) => void;
  otherRequirements: string;
  setOtherRequirements: (value: string) => void;
  salaryMin: string;
  setSalaryMin: (value: string) => void;
  salaryMax: string;
  setSalaryMax: (value: string) => void;
  salaryNote: string;
  setSalaryNote: (value: string) => void;
  locations: string[];
  setLocations: (locations: string[]) => void;
  locationNote: string;
  setLocationNote: (value: string) => void;
  selectionProcess: string;
  setSelectionProcess: (value: string) => void;
  employmentType: string;
  setEmploymentType: (value: string) => void;
  employmentTypeNote: string;
  setEmploymentTypeNote: (value: string) => void;
  workingHours: string;
  setWorkingHours: (value: string) => void;
  overtime: string;
  setOvertime: (value: string) => void;
  holidays: string;
  setHolidays: (value: string) => void;
  appealPoints: string[];
  setAppealPoints: (points: string[]) => void;
  smoke: string;
  setSmoke: (value: string) => void;
  smokeNote: string;
  setSmokeNote: (value: string) => void;
  resumeRequired: string[];
  setResumeRequired: (required: string[]) => void;
  memo: string;
  setMemo: (value: string) => void;
  
  // Modal handlers
  setLocationModalOpen: (open: boolean) => void;
  setJobTypeModalOpen: (open: boolean) => void;
  setIndustryModalOpen: (open: boolean) => void;
  
  // Error state
  errors: Record<string, string>;
  showErrors: boolean;
}

export const FormFields: React.FC<FormFieldsProps> = ({
  group,
  setGroup,
  companyGroups,
  title,
  setTitle,
  images,
  setImages,
  jobTypes,
  setJobTypes,
  industries,
  setIndustries,
  jobDescription,
  setJobDescription,
  positionSummary,
  setPositionSummary,
  skills,
  setSkills,
  otherRequirements,
  setOtherRequirements,
  salaryMin,
  setSalaryMin,
  salaryMax,
  setSalaryMax,
  salaryNote,
  setSalaryNote,
  locations,
  setLocations,
  locationNote,
  setLocationNote,
  selectionProcess,
  setSelectionProcess,
  employmentType,
  setEmploymentType,
  employmentTypeNote,
  setEmploymentTypeNote,
  workingHours,
  setWorkingHours,
  overtime,
  setOvertime,
  holidays,
  setHolidays,
  appealPoints,
  setAppealPoints,
  smoke,
  setSmoke,
  smokeNote,
  setSmokeNote,
  resumeRequired,
  setResumeRequired,
  memo,
  setMemo,
  setLocationModalOpen,
  setJobTypeModalOpen,
  setIndustryModalOpen,
  errors,
  showErrors
}) => {
  // Helper functions
  const removeJobType = (val: string) => setJobTypes(jobTypes.filter(v => v !== val));
  const removeIndustry = (val: string) => setIndustries(industries.filter(v => v !== val));
  const removeLocation = (val: string) => setLocations(locations.filter(v => v !== val));
  
  const toggleAppealPoint = (val: string) => {
    if (appealPoints.includes(val)) {
      setAppealPoints(appealPoints.filter(v => v !== val));
    } else if (appealPoints.length < 6) {
      setAppealPoints([...appealPoints, val]);
    }
  };
  
  const toggleResumeRequired = (val: string) => {
    if (resumeRequired.includes(val)) {
      setResumeRequired(resumeRequired.filter(v => v !== val));
    } else {
      setResumeRequired([...resumeRequired, val]);
    }
  };

  return (
    <>
      {/* グループ */}
      <div className="flex flex-row gap-8 items-stretch justify-start w-full mb-2" data-field="group">
        <div className="bg-[#f9f9f9] flex flex-col gap-1 items-start justify-center px-6 rounded-[5px] w-[200px]">
          <div className="font-['Noto_Sans_JP'] font-bold text-[16px] leading-[2] tracking-[1.6px] text-[#323232]">
            グループ
          </div>
        </div>
        <div className="flex-1 flex flex-col gap-2.5 items-start justify-start px-0 py-6">
          <div className="flex flex-col gap-8 items-start justify-center w-[400px]">
            <div className="relative w-full">
              <select
                className={`w-full bg-white border border-[#999999] rounded-[5px] px-[11px] py-[11px] font-['Noto_Sans_JP'] font-bold text-[16px] leading-[2] tracking-[1.6px] text-[#323232] appearance-none ${showErrors && errors.group ? 'border-red-500 bg-red-50' : ''}`}
                value={group}
                onChange={e => setGroup(e.target.value)}
              >
                <option value="">未選択</option>
                {companyGroups.map(group => (
                  <option key={group.id} value={group.id}>{group.group_name}</option>
                ))}
              </select>
              <div className="absolute right-4 top-1/2 transform -translate-y-1/2 pointer-events-none">
                <svg className="w-3.5 h-[9.333px]" fill="none" viewBox="0 0 14 10">
                  <path
                    d="M6.07178 8.90462L0.234161 1.71483C-0.339509 1.00828 0.206262 0 1.16238 0H12.8376C13.7937 0 14.3395 1.00828 13.7658 1.71483L7.92822 8.90462C7.46411 9.47624 6.53589 9.47624 6.07178 8.90462Z"
                    fill="#0F9058"
                  />
                </svg>
              </div>
            </div>
            {showErrors && errors.group && <span className="text-red-500 text-sm">{errors.group}</span>}
          </div>
        </div>
      </div>
      
      {/* 求人タイトル */}
      <div className="flex flex-row gap-8 items-stretch justify-start w-full mb-2" data-field="title">
        <div className="bg-[#f9f9f9] flex flex-col gap-1 items-start justify-center px-6 rounded-[5px] w-[200px]">
          <div className="font-['Noto_Sans_JP'] font-bold text-[16px] leading-[2] tracking-[1.6px] text-[#323232]">
            求人タイトル
          </div>
        </div>
        <div className="flex-1 flex flex-col gap-2.5 items-start justify-start px-0 py-6">
          <div className="flex flex-col gap-2 items-start justify-start w-full">
            <input 
              className={`w-full bg-white border border-[#999999] rounded-[5px] px-[11px] py-[11px] font-['Noto_Sans_JP'] font-medium text-[16px] leading-[2] tracking-[1.6px] text-[#323232] placeholder:text-[#999999] ${showErrors && errors.title ? 'border-red-500 bg-red-50' : ''}`}
              placeholder="求人タイトルを入力" 
              value={title} 
              onChange={e => setTitle(e.target.value)} 
            />
            {showErrors && errors.title && <span className="text-red-500 text-sm">{errors.title}</span>}
          </div>
        </div>
      </div>

      {/* 写真 */}
      <div className="flex flex-row gap-8 items-stretch justify-start w-full mb-2">
        <div className="bg-[#f9f9f9] flex flex-col gap-1 items-start justify-center px-6 rounded-[5px] w-[200px]">
          <div className="font-['Noto_Sans_JP'] font-bold text-[16px] leading-[2] tracking-[1.6px] text-[#323232]">
          イメージ画像
          </div>
        </div>
        <div className="flex-1 flex flex-col gap-2.5 items-start justify-start px-0 py-6">
          <div className="flex flex-col gap-2 items-start justify-start w-full">
            <ImageUpload
              images={images}
              onChange={setImages}
              maxImages={5}
            />
          </div>
        </div>
      </div>

      {/* 職種 */}
      <div className="flex flex-row gap-8 items-stretch justify-start w-full mb-2" data-field="jobTypes">
        <div className="bg-[#f9f9f9] flex flex-col gap-1 items-start justify-center px-6 rounded-[5px] w-[200px]">
          <div className="font-['Noto_Sans_JP'] font-bold text-[16px] leading-[2] tracking-[1.6px] text-[#323232]">
            職種
          </div>
        </div>
        <div className="flex-1 flex flex-col gap-2.5 items-start justify-start px-0 py-6">
          <div className="flex flex-col gap-2 items-start justify-start w-full">
            <div className="flex flex-row gap-6 items-center justify-start w-full">
              <button
                type="button"
                onClick={() => setJobTypeModalOpen(true)}
                className={`flex flex-row gap-2.5 h-[50px] items-center justify-center min-w-40 px-10 py-0 rounded-[32px] border border-[#999999] ${showErrors && errors.jobTypes ? 'border-red-500 bg-red-50' : ''}`}
              >
                <span className="font-['Noto_Sans_JP'] font-bold text-[16px] leading-[2] tracking-[1.6px] text-[#323232]">
                  職種を選択
                </span>
              </button>
            </div>
            <div className="flex flex-wrap gap-2 items-center justify-start w-full">
              {jobTypes.map(type => (
                <div
                  key={type}
                  className="bg-[#d2f1da] flex flex-row gap-2.5 h-10 items-center justify-center px-6 py-0 rounded-[10px] cursor-pointer"
                  onClick={() => removeJobType(type)}
                >
                  <span className="font-['Noto_Sans_JP'] font-medium text-[14px] leading-[1.6] tracking-[1.4px] text-[#0f9058]">
                    {type}
                  </span>
                  <svg className="w-3 h-3" fill="none" viewBox="0 0 12 12">
                    <path
                      d="M0.207031 0.207031C0.482709 -0.0685565 0.929424 -0.0685933 1.20508 0.207031L6.00098 5.00195L10.7949 0.208984C11.0706 -0.0666642 11.5173 -0.0666642 11.793 0.208984C12.0685 0.48464 12.0686 0.931412 11.793 1.20703L6.99902 6L11.793 10.7939L11.8184 10.8203C12.0684 11.0974 12.0599 11.5251 11.793 11.792C11.5259 12.0589 11.0984 12.0667 10.8213 11.8164L10.7949 11.792L6.00098 6.99805L1.20508 11.7939L1.17871 11.8193C0.9016 12.0693 0.473949 12.0608 0.207031 11.7939C-0.0598942 11.527 -0.0683679 11.0994 0.181641 10.8223L0.207031 10.7959L5.00195 6L0.207031 1.20508C-0.0686416 0.929435 -0.0686416 0.482674 0.207031 0.207031Z"
                      fill="#0F9058"
                    />
                  </svg>
                </div>
              ))}
            </div>
            {showErrors && errors.jobTypes && <span className="text-red-500 text-sm">{errors.jobTypes}</span>}
          </div>
        </div>
      </div>

      {/* 業種 */}
      <div className="flex flex-row gap-8 items-stretch justify-start w-full mb-2" data-field="industries">
        <div className="bg-[#f9f9f9] flex flex-col gap-1 items-start justify-center px-6 rounded-[5px] w-[200px]">
          <div className="font-['Noto_Sans_JP'] font-bold text-[16px] leading-[2] tracking-[1.6px] text-[#323232]">
            業種
          </div>
        </div>
        <div className="flex-1 flex flex-col gap-2.5 items-start justify-start px-0 py-6">
          <div className="flex flex-col gap-2 items-start justify-start w-full">
            <div className="flex flex-row gap-6 items-center justify-start w-full">
              <button
                type="button"
                onClick={() => setIndustryModalOpen(true)}
                className={`flex flex-row gap-2.5 h-[50px] items-center justify-center min-w-40 px-10 py-0 rounded-[32px] border border-[#999999] ${showErrors && errors.industries ? 'border-red-500 bg-red-50' : ''}`}
              >
                <span className="font-['Noto_Sans_JP'] font-bold text-[16px] leading-[2] tracking-[1.6px] text-[#323232]">
                  業種を選択
                </span>
              </button>
            </div>
            <div className="flex flex-wrap gap-2 items-center justify-start w-full">
              {industries.map(industry => (
                <div
                  key={industry}
                  className="bg-[#d2f1da] flex flex-row gap-2.5 h-10 items-center justify-center px-6 py-0 rounded-[10px] cursor-pointer"
                  onClick={() => removeIndustry(industry)}
                >
                  <span className="font-['Noto_Sans_JP'] font-medium text-[14px] leading-[1.6] tracking-[1.4px] text-[#0f9058]">
                    {industry}
                  </span>
                  <svg className="w-3 h-3" fill="none" viewBox="0 0 12 12">
                    <path
                      d="M0.207031 0.207031C0.482709 -0.0685565 0.929424 -0.0685933 1.20508 0.207031L6.00098 5.00195L10.7949 0.208984C11.0706 -0.0666642 11.5173 -0.0666642 11.793 0.208984C12.0685 0.48464 12.0686 0.931412 11.793 1.20703L6.99902 6L11.793 10.7939L11.8184 10.8203C12.0684 11.0974 12.0599 11.5251 11.793 11.792C11.5259 12.0589 11.0984 12.0667 10.8213 11.8164L10.7949 11.792L6.00098 6.99805L1.20508 11.7939L1.17871 11.8193C0.9016 12.0693 0.473949 12.0608 0.207031 11.7939C-0.0598942 11.527 -0.0683679 11.0994 0.181641 10.8223L0.207031 10.7959L5.00195 6L0.207031 1.20508C-0.0686416 0.929435 -0.0686416 0.482674 0.207031 0.207031Z"
                      fill="#0F9058"
                    />
                  </svg>
                </div>
              ))}
            </div>
            {showErrors && errors.industries && <span className="text-red-500 text-sm">{errors.industries}</span>}
          </div>
        </div>
      </div>

      {/* ポジション概要（業務内容＋魅力） */}
      <div className="flex flex-row gap-8 items-stretch justify-start w-full mb-2" data-field="jobDescription">
        <div className="bg-[#f9f9f9] flex flex-col gap-1 items-start justify-center px-6 rounded-[5px] w-[200px]">
          <div className="font-['Noto_Sans_JP'] font-bold text-[16px] leading-[2] tracking-[1.6px] text-[#323232]">
            ポジション概要
          </div>
        </div>
        <div className="flex-1 flex flex-col gap-8 items-start justify-start px-0 py-6">
          {/* 業務内容 */}
          <div className="w-full">
            <label className="font-['Noto_Sans_JP'] font-bold text-[16px] text-[#323232] mb-2 block">業務内容</label>
            <textarea
              className="w-full bg-white border border-[#999999] rounded-[5px] px-[11px] py-[11px] font-['Noto_Sans_JP'] font-medium text-[16px] leading-[2] tracking-[1.6px] text-[#323232] placeholder:text-[#999999] resize-none h-[147px]"
              placeholder="具体的な業務内容・期待する役割/成果・募集背景などを入力してください。"
              value={jobDescription}
              onChange={e => setJobDescription(e.target.value)}
            />
            {showErrors && errors.jobDescription && <span className="text-red-500 text-sm">{errors.jobDescription}</span>}
          </div>
          {/* 当ポジションの魅力 */}
          <div className="w-full">
            <label className="font-['Noto_Sans_JP'] font-bold text-[16px] text-[#323232] mb-2 block">当ポジションの魅力</label>
            <textarea
              className="w-full bg-white border border-[#999999] rounded-[5px] px-[11px] py-[11px] font-['Noto_Sans_JP'] font-medium text-[16px] leading-[2] tracking-[1.6px] text-[#323232] placeholder:text-[#999999] resize-none h-[147px]"
              placeholder="当ポジションの魅力を入力してください。"
              value={positionSummary}
              onChange={e => setPositionSummary(e.target.value)}
            />
          </div>
        </div>
      </div>

      {/* 求める人物像 */}
      <div className="flex flex-row gap-8 items-stretch justify-start w-full mb-2">
        <div className="bg-[#f9f9f9] flex flex-col gap-1 items-start justify-center px-6 rounded-[5px] w-[200px]">
          <div className="font-['Noto_Sans_JP'] font-bold text-[16px] leading-[2] tracking-[1.6px] text-[#323232]">
            求める人物像
          </div>
        </div>
        <div className="flex-1 flex flex-col gap-8 items-start justify-start px-0 py-6">
          {/* スキル・経験 */}
          <div className="w-full">
            <label className="font-['Noto_Sans_JP'] font-bold text-[16px] text-[#323232] mb-2 block">スキル・経験</label>
            <textarea
              className="w-full bg-white border border-[#999999] rounded-[5px] px-[11px] py-[11px] font-['Noto_Sans_JP'] font-medium text-[16px] leading-[2] tracking-[1.6px] text-[#323232] placeholder:text-[#999999] resize-none h-[147px]"
              placeholder="必要または歓迎するスキル・経験について入力してください。"
              value={skills}
              onChange={e => setSkills(e.target.value)}
            />
          </div>
          {/* その他・求める人物像など */}
          <div className="w-full">
            <label className="font-['Noto_Sans_JP'] font-bold text-[16px] text-[#323232] mb-2 block">その他・求める人物像など</label>
            <textarea
              className="w-full bg-white border border-[#999999] rounded-[5px] px-[11px] py-[11px] font-['Noto_Sans_JP'] font-medium text-[16px] leading-[2] tracking-[1.6px] text-[#323232] placeholder:text-[#999999] resize-none h-[147px]"
              placeholder="スキル以外に求める人物像や価値観などを入力してください。"
              value={otherRequirements}
              onChange={e => setOtherRequirements(e.target.value)}
            />
          </div>
        </div>
      </div>

      {/* 条件・待遇 */}
      <div className="flex flex-row gap-8 items-stretch justify-start w-full mb-2">
        <div className="bg-[#f9f9f9] flex flex-col gap-1 items-start justify-center px-6 rounded-[5px] w-[200px]">
          <div className="font-['Noto_Sans_JP'] font-bold text-[16px] leading-[2] tracking-[1.6px] text-[#323232]">
            条件・待遇
          </div>
        </div>
        <div className="flex-1 flex flex-col gap-8 items-start justify-start px-0 py-6">
          {/* 想定年収 */}
          <div className="w-full">
            <label className="font-['Noto_Sans_JP'] font-bold text-[16px] text-[#323232] mb-2 block">想定年収</label>
            <div className="flex gap-4 items-center">
              <SelectInput
                options={salaryOptions}
                value={salaryMin}
                placeholder="未選択"
                onChange={(value) => setSalaryMin(value)}
                style={{ width: '180px', color: '#323232' }}
              />
              <span className="font-['Noto_Sans_JP'] font-medium text-[16px] leading-[2] tracking-[1.6px] text-[#323232]">〜</span>
              <SelectInput
                options={salaryOptions}
                value={salaryMax}
                placeholder="未選択"
                onChange={(value) => setSalaryMax(value)}
                style={{ width: '180px', color: '#323232' }}
              />
            </div>
          </div>
          {/* 年収補足 */}
          <div className="w-full">
            <label className="font-['Noto_Sans_JP'] font-bold text-[16px] text-[#323232] mb-2 block">年収補足</label>
            <textarea
              className="w-full bg-white border border-[#999999] rounded-[5px] px-[11px] py-[5px] font-['Noto_Sans_JP'] font-medium text-[16px] leading-normal tracking-[1.6px] text-[#323232] placeholder:text-[#999999] resize-none h-[40px]"
              placeholder="ストックオプションなどについてはこちらに入力してください。"
              value={salaryNote}
              onChange={e => setSalaryNote(e.target.value)}
            />
          </div>
          {/* 勤務地 */}
          <div className="w-full" data-field="locations">
            <label className="font-['Noto_Sans_JP'] font-bold text-[16px] text-[#323232] mb-2 block">勤務地</label>
            <div className="flex flex-col gap-2 items-start justify-start w-full">
              <div className="flex flex-row gap-6 items-center justify-start w-full">
                <button
                  type="button"
                  onClick={() => setLocationModalOpen(true)}
                  className={`flex flex-row gap-2.5 h-[50px] items-center justify-center min-w-40 px-10 py-0 rounded-[32px] border border-[#999999] w-[400px] ${showErrors && errors.locations ? 'border-red-500 bg-red-50' : ''}`}
                >
                  <span className="font-['Noto_Sans_JP'] font-bold text-[16px] leading-[2] tracking-[1.6px] text-[#323232]">
                    勤務地を選択
                  </span>
                </button>
              </div>
              <div className="flex flex-wrap gap-2 items-center justify-start w-full">
                {locations.map(loc => (
                  <div
                    key={loc}
                    className="bg-[#d2f1da] flex flex-row gap-2.5 h-10 items-center justify-center px-6 py-0 rounded-[10px] cursor-pointer"
                    onClick={() => removeLocation(loc)}
                  >
                    <span className="font-['Noto_Sans_JP'] font-medium text-[14px] leading-[1.6] tracking-[1.4px] text-[#0f9058]">
                      {loc}
                    </span>
                    <svg className="w-3 h-3" fill="none" viewBox="0 0 12 12">
                      <path
                        d="M0.207031 0.207031C0.482709 -0.0685565 0.929424 -0.0685933 1.20508 0.207031L6.00098 5.00195L10.7949 0.208984C11.0706 -0.0666642 11.5173 -0.0666642 11.793 0.208984C12.0685 0.48464 12.0686 0.931412 11.793 1.20703L6.99902 6L11.793 10.7939L11.8184 10.8203C12.0684 11.0974 12.0599 11.5251 11.793 11.792C11.5259 12.0589 11.0984 12.0667 10.8213 11.8164L10.7949 11.792L6.00098 6.99805L1.20508 11.7939L1.17871 11.8193C0.9016 12.0693 0.473949 12.0608 0.207031 11.7939C-0.0598942 11.527 -0.0683679 11.0994 0.181641 10.8223L0.207031 10.7959L5.00195 6L0.207031 1.20508C-0.0686416 0.929435 -0.0686416 0.482674 0.207031 0.207031Z"
                        fill="#0F9058"
                      />
                    </svg>
                  </div>
                ))}
              </div>
              {showErrors && errors.locations && <span className="text-red-500 text-sm">{errors.locations}</span>}
            </div>
          </div>
          {/* 勤務地補足 */}
          <div className="w-full">
            <label className="font-['Noto_Sans_JP'] font-bold text-[16px] text-[#323232] mb-2 block">勤務地補足</label>
            <textarea
              className="w-full bg-white border border-[#999999] rounded-[5px] px-[11px] py-[5px] font-['Noto_Sans_JP'] font-medium text-[16px] leading-normal tracking-[1.6px] text-[#323232] placeholder:text-[#999999] resize-none h-[40px]"
              placeholder="転勤有無・リモート可否・手当の有無など、勤務地に関する補足情報を入力してください。"
              value={locationNote}
              onChange={e => setLocationNote(e.target.value)}
            />
          </div>
          {/* 雇用形態 */}
          <div className="w-full" data-field="employmentType">
            <label className="font-['Noto_Sans_JP'] font-bold text-[16px] text-[#323232] mb-2 block">雇用形態</label>
            <div className="flex flex-col gap-2 items-start justify-center w-[400px]">
              <div className="relative w-full">
                <select 
                  className={`w-full bg-white border border-[#999999] rounded-[5px] px-[11px] py-[11px] font-['Noto_Sans_JP'] font-bold text-[16px] leading-[2] tracking-[1.6px] text-[#323232] appearance-none ${showErrors && errors.employmentType ? 'border-red-500 bg-red-50' : ''}`}
                  value={employmentType} 
                  onChange={e => setEmploymentType(e.target.value)}
                >
                  <option value="">正社員</option>
                  {employmentTypeOptions.map(option => (
                    <option key={option.value} value={option.value}>{option.label}</option>
                  ))}
                </select>
                <div className="absolute right-4 top-1/2 transform -translate-y-1/2 pointer-events-none">
                  <svg className="w-3.5 h-[9.333px]" fill="none" viewBox="0 0 14 10">
                    <path
                      d="M6.07178 8.90462L0.234161 1.71483C-0.339509 1.00828 0.206262 0 1.16238 0H12.8376C13.7937 0 14.3395 1.00828 13.7658 1.71483L7.92822 8.90462C7.46411 9.47624 6.53589 9.47624 6.07178 8.90462Z"
                      fill="#0F9058"
                    />
                  </svg>
                </div>
              </div>
              {showErrors && errors.employmentType && <span className="text-red-500 text-sm">{errors.employmentType}</span>}
            </div>
          </div>
          {/* 雇用形態補足 */}
          <div className="w-full">
            <label className="font-['Noto_Sans_JP'] font-bold text-[16px] text-[#323232] mb-2 block">雇用形態補足</label>
            <textarea
              className="w-full bg-white border border-[#999999] rounded-[5px] px-[11px] py-[11px] font-['Noto_Sans_JP'] font-medium text-[16px] leading-[2] tracking-[1.6px] text-[#323232] placeholder:text-[#999999] resize-none h-[78px]"
              placeholder="契約期間：期間の定めなし&#13;&#10;試用期間：あり（３か月）"
              value={employmentTypeNote}
              onChange={e => setEmploymentTypeNote(e.target.value)}
            />
          </div>
          {/* 就業時間 */}
          <div className="w-full">
            <label className="font-['Noto_Sans_JP'] font-bold text-[16px] text-[#323232] mb-2 block">就業時間</label>
            <textarea
              className="w-full bg-white border border-[#999999] rounded-[5px] px-[11px] py-[11px] font-['Noto_Sans_JP'] font-medium text-[16px] leading-[2] tracking-[1.6px] text-[#323232] placeholder:text-[#999999] resize-none h-[147px]"
              placeholder="9:00～18:00（所定労働時間8時間）&#13;&#10;休憩：60分&#13;&#10;フレックス制：有"
              value={workingHours}
              onChange={e => setWorkingHours(e.target.value)}
            />
          </div>
          {/* 所定外労働の有無 */}
          <div className="w-full">
            <label className="font-['Noto_Sans_JP'] font-bold text-[16px] text-[#323232] mb-2 block">所定外労働の有無</label>
            <div className="flex gap-4 items-center">
              <label className="flex items-center gap-2 cursor-pointer">
                <Radio
                  name="overtime"
                  value="あり"
                  checked={overtime === 'あり'}
                  onChange={e => setOvertime(e.target.value)}
                />
              
                <span className="font-['Noto_Sans_JP'] font-medium text-[16px] leading-[2] tracking-[1.6px] text-[#323232]">あり</span>
              </label>
              <label className="flex items-center gap-2 cursor-pointer">
                <Radio
                  name="overtime"
                  value="なし"
                  checked={overtime === 'なし'}
                  onChange={e => setOvertime(e.target.value)}
                />
               
                <span className="font-['Noto_Sans_JP'] font-medium text-[16px] leading-[2] tracking-[1.6px] text-[#323232]">なし</span>
              </label>
            </div>
          </div>
          {/* 備考 */}
          <div className="w-full">
            <label className="font-['Noto_Sans_JP'] font-bold text-[16px] text-[#323232] mb-2 block">備考</label>
            <textarea
              className="w-full bg-white border border-[#999999] rounded-[5px] px-[11px] py-[11px] font-['Noto_Sans_JP'] font-medium text-[16px] leading-[2] tracking-[1.6px] text-[#323232] placeholder:text-[#999999] resize-none h-[78px]"
              placeholder="月平均20時間程度／固定残業代45時間分を含む"
              value={memo}
              onChange={e => setMemo(e.target.value)}
            />
          </div>
          {/* 休日・休暇 */}
          <div className="w-full">
            <label className="font-['Noto_Sans_JP'] font-bold text-[16px] text-[#323232] mb-2 block">休日・休暇</label>
            <textarea
              className="w-full bg-white border border-[#999999] rounded-[5px] px-[11px] py-[11px] font-['Noto_Sans_JP'] font-medium text-[16px] leading-[2] tracking-[1.6px] text-[#323232] placeholder:text-[#999999] resize-none h-[147px]"
              placeholder="完全週休2日制（土・日）、祝日&#13;&#10;年間休日：120日&#13;&#10;有給休暇：初年度10日&#13;&#10;その他休暇：年末年始休暇"
              value={holidays}
              onChange={e => setHolidays(e.target.value)}
            />
          </div>
        </div>
      </div>



      {/* 選考フロー */}
      <div className="flex flex-row gap-8 items-stretch justify-start w-full mb-2">
        <div className="bg-[#f9f9f9] flex flex-col gap-1 items-start justify-center px-6 rounded-[5px] w-[200px]">
          <div className="font-['Noto_Sans_JP'] font-bold text-[16px] leading-[2] tracking-[1.6px] text-[#323232]">
            選考情報
          </div>
        </div>
        <div className="flex-1 flex flex-col gap-2.5 items-start justify-start px-0 py-6">
          <div className="flex flex-col gap-2 items-start justify-start w-full">
            <textarea 
              className="w-full bg-white border border-[#999999] rounded-[5px] px-[11px] py-[11px] h-[148px] font-['Noto_Sans_JP'] font-medium text-[16px] leading-[2] tracking-[1.6px] text-[#323232] placeholder:text-[#999999] resize-none"
              placeholder="選考フローや面接回数などの情報を入力してください。" 
              value={selectionProcess} 
              onChange={e => setSelectionProcess(e.target.value)} 
            />
          </div>
        </div>
      </div>

      {/* アピールポイント */}
      <div className="flex flex-row gap-8 items-stretch justify-start w-full mb-2">
        <div className="bg-[#f9f9f9] flex flex-col gap-1 items-start justify-center px-6 rounded-[5px] w-[200px]">
          <div className="font-['Noto_Sans_JP'] font-bold text-[16px] leading-[2] tracking-[1.6px] text-[#323232]">
            アピールポイント
          </div>
          <div className="font-['Noto_Sans_JP'] font-medium text-[14px] leading-[1.6] tracking-[1.4px] text-[#0f9058]">
            最大6つまで選択可能
          </div>
        </div>
        <div className="flex-1 flex flex-col gap-2.5 items-start justify-start px-0 py-6">
          <div className="flex flex-col gap-6 items-start justify-start w-full">
            {appealPointCategories.map(category => (
              <div key={category.name} className="w-full">
                <div className="font-['Noto_Sans_JP'] font-bold text-[16px] leading-[2] tracking-[1.6px] text-[#323232] mb-2">
                  {category.name}
                </div>
                <div className="flex flex-wrap gap-4 items-start justify-start">
                  {category.points.map(point => (
                    <Checkbox
                      key={point}
                      label={point}
                      checked={appealPoints.includes(point)}
                      onChange={() => toggleAppealPoint(point)}
                    />
                  ))}
                </div>
              </div>
            ))}
            
            {/* 選択されたアピールポイントの表示 */}
            {appealPoints.length > 0 && (
              <div className="flex flex-wrap gap-2 items-center justify-start w-full">
                {appealPoints.map(point => (
                  <div
                    key={point}
                    className="bg-[#d2f1da] flex flex-row gap-2.5 h-10 items-center justify-center px-6 py-0 rounded-[10px] cursor-pointer"
                    onClick={() => toggleAppealPoint(point)}
                  >
                    <span className="font-['Noto_Sans_JP'] font-[500] text-[14px] leading-[1.6] tracking-[1.4px] text-[#0f9058]">
                      {point}
                    </span>
                    <svg className="w-3 h-3" fill="none" viewBox="0 0 12 12">
                      <path
                        d="M0.207031 0.207031C0.482709 -0.0685565 0.929424 -0.0685933 1.20508 0.207031L6.00098 5.00195L10.7949 0.208984C11.0706 -0.0666642 11.5173 -0.0666642 11.793 0.208984C12.0685 0.48464 12.0686 0.931412 11.793 1.20703L6.99902 6L11.793 10.7939L11.8184 10.8203C12.0684 11.0974 12.0599 11.5251 11.793 11.792C11.5259 12.0589 11.0984 12.0667 10.8213 11.8164L10.7949 11.792L6.00098 6.99805L1.20508 11.7939L1.17871 11.8193C0.9016 12.0693 0.473949 12.0608 0.207031 11.7939C-0.0598942 11.527 -0.0683679 11.0994 0.181641 10.8223L0.207031 10.7959L5.00195 6L0.207031 1.20508C-0.0686416 0.929435 -0.0686416 0.482674 0.207031 0.207031Z"
                        fill="#0F9058"
                      />
                    </svg>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      </div>

      {/* 受動喫煙防止措置 */}
      <div className="flex flex-row gap-8 items-stretch justify-start w-full mb-2">
        <div className="bg-[#f9f9f9] flex flex-col gap-1 items-start justify-center px-6 rounded-[5px] w-[200px]">
          <div className="font-['Noto_Sans_JP'] font-bold text-[16px] leading-[2] tracking-[1.6px] text-[#323232]">
            受動喫煙防止措置
          </div>
        </div>
        <div className="flex-1 flex flex-col gap-2.5 items-start justify-start px-0 py-6">
          <div className="flex flex-col gap-2 items-start justify-start w-full">
            <div className="flex flex-wrap gap-4 items-center justify-start w-full">
              {smokeOptions.map(option => (
                <label key={option.value} className="flex items-center gap-2 cursor-pointer">
                  
                  <Radio
                    name="smoke"
                    value={option.value}
                    checked={smoke === option.value}
                    onChange={e => setSmoke(e.target.value)}
                  />
                 
                  <span className="font-['Noto_Sans_JP'] font-medium text-[16px] leading-[2] tracking-[1.6px] text-[#323232]">
                    {option.label}
                  </span>
                </label>
              ))}
            </div>
            <div className="font-['Noto_Sans_JP'] font-medium text-[14px] leading-[1.6] tracking-[1.4px] text-[#999999] w-full">
              就業場所が屋外である、就業場所によって対策内容が異なる、対策内容を断言できないなどの場合は、「その他」を選択し、面談・面接時に候補者にお伝えください。
            </div>
          </div>
        </div>
      </div>

      {/* 応募時のレジュメ提出 */}
      <div className="flex flex-row gap-8 items-stretch justify-start w-full mb-2">
        <div className="bg-[#f9f9f9] flex flex-col gap-1 items-start justify-center px-6 rounded-[5px] w-[200px]">
          <div className="font-['Noto_Sans_JP'] font-bold text-[16px] leading-[2] tracking-[1.6px] text-[#323232]">
            応募時のレジュメ提出
          </div>
        </div>
        <div className="flex-1 flex flex-col gap-2.5 items-start justify-start px-0 py-6">
          <div className="flex flex-col gap-4 items-start justify-start w-full">
            <div className="grid grid-cols-1 gap-4 w-full">
              {resumeRequiredOptions.map(item => (
                <Checkbox
                  key={item}
                  label={item}
                  checked={resumeRequired.includes(item)}
                  onChange={() => toggleResumeRequired(item)}
                />
              ))}
            </div>
            <div className="font-['Noto_Sans_JP'] font-medium text-[14px] leading-[1.6] tracking-[1.4px] text-[#999999] w-full">
              ※ 応募後に別途提出を依頼することも可能です。
            </div>
            <div className="flex flex-wrap gap-2 items-center justify-start w-full">
              {resumeRequired.map(item => (
                <div
                  key={item}
                  className="bg-[#d2f1da] flex flex-row gap-2.5 h-10 items-center justify-center px-6 py-0 rounded-[10px] cursor-pointer"
                  onClick={() => toggleResumeRequired(item)}
                >
                  <span className="font-['Noto_Sans_JP'] font-medium text-[14px] leading-[1.6] tracking-[1.4px] text-[#0f9058]">
                    {item}
                  </span>
                  <svg className="w-3 h-3" fill="none" viewBox="0 0 12 12">
                    <path
                      d="M0.207031 0.207031C0.482709 -0.0685565 0.929424 -0.0685933 1.20508 0.207031L6.00098 5.00195L10.7949 0.208984C11.0706 -0.0666642 11.5173 -0.0666642 11.793 0.208984C12.0685 0.48464 12.0686 0.931412 11.793 1.20703L6.99902 6L11.793 10.7939L11.8184 10.8203C12.0684 11.0974 12.0599 11.5251 11.793 11.792C11.5259 12.0589 11.0984 12.0667 10.8213 11.8164L10.7949 11.792L6.00098 6.99805L1.20508 11.7939L1.17871 11.8193C0.9016 12.0693 0.473949 12.0608 0.207031 11.7939C-0.0598942 11.527 -0.0683679 11.0994 0.181641 10.8223L0.207031 10.7959L5.00195 6L0.207031 1.20508C-0.0686416 0.929435 -0.0686416 0.482674 0.207031 0.207031Z"
                      fill="#0F9058"
                    />
                  </svg>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* 社内メモ */}
      <div className="flex flex-row gap-8 items-stretch justify-start w-full mb-2">
        <div className="bg-[#f9f9f9] flex flex-col gap-1 items-start justify-center px-6 rounded-[5px] w-[200px]">
          <div className="font-['Noto_Sans_JP'] font-bold text-[16px] leading-[2] tracking-[1.6px] text-[#323232]">
            社内メモ
          </div>
        </div>
        <div className="flex-1 flex flex-col gap-2.5 items-start justify-start px-0 py-6">
          <div className="flex flex-col gap-2 items-start justify-start w-full">
            <textarea 
              className="w-full bg-white border border-[#999999] rounded-[5px] px-[11px] py-[11px] h-[78px] font-['Noto_Sans_JP'] font-medium text-[16px] leading-[2] tracking-[1.6px] text-[#323232] placeholder:text-[#999999] resize-none"
              placeholder="この求人に関して、社内で共有しておきたい事項などがあれば、こちらを活用してください。" 
              value={memo} 
              onChange={e => setMemo(e.target.value)} 
            />
          </div>
          <div className="flex flex-col gap-2 items-start justify-start w-full">
            <div className="font-['Noto_Sans_JP'] font-medium text-[14px] leading-[1.6] tracking-[1.4px] text-[#999999] w-full">
              ※ 社内メモは候補者に共有されません。
            </div>
          </div>
        </div>
      </div>
    </>
  );
}; 