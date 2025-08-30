'use client';

import React, { useState } from 'react';
import { CandidateDetailData } from '../page';
import { useRouter } from 'next/navigation';
import { AdminButton } from '@/components/admin/ui/AdminButton';
import { 
  GENDER_OPTIONS, 
  INCOME_RANGES, 
  PREFECTURES, 
  generateYearOptions, 
  generateMonthOptions, 
  generateDayOptions 
} from '@/constants/profile';
import { UpdateCandidateData, EducationData, WorkExperienceData, JobTypeExperienceData, SkillsData } from './actions';
import IndustrySelectModal from '@/components/career-status/IndustrySelectModal';
import JobTypeSelectModal from '@/components/career-status/JobTypeSelectModal';
import { CompanyNameInput } from '@/components/ui/CompanyNameInput';
import {
  JOB_CHANGE_TIMING_OPTIONS,
  CURRENT_ACTIVITY_STATUS_OPTIONS,
  PROGRESS_STATUS_OPTIONS,
  DECLINE_REASON_OPTIONS,
} from '@/constants/career-status';

type SelectionEntry = {
  id: string;
  isPrivate: boolean;
  industries: string[];
  companyName: string;
  department: string;
  progressStatus: string;
  declineReason?: string;
};

interface Props {
  candidate: CandidateDetailData;
}

export default function CandidateEditClient({ candidate }: Props) {
  const router = useRouter();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [memo, setMemo] = useState('');
  const [modalState, setModalState] = useState<{
    isOpen: boolean;
    targetType: 'industry' | 'jobtype' | null;
    targetIndex: number | null;
  }>({ isOpen: false, targetType: null, targetIndex: null });
  const [selectedIndustriesMap, setSelectedIndustriesMap] = useState<{
    [key: number]: string[];
  }>({});
  const [selectionEntries, setSelectionEntries] = useState<SelectionEntry[]>([
    {
      id: '1',
      isPrivate: false,
      industries: [],
      companyName: '',
      department: '',
      progressStatus: '',
      declineReason: '',
    },
  ]);

  // Initialize form data with candidate data
  const [formData, setFormData] = useState<UpdateCandidateData>({
    email: candidate.email || '',
    last_name: candidate.last_name || '',
    first_name: candidate.first_name || '',
    last_name_kana: candidate.last_name_kana || '',
    first_name_kana: candidate.first_name_kana || '',
    gender: candidate.gender || 'unspecified',
    birth_date: candidate.birth_date || '',
    prefecture: candidate.prefecture || '',
    phone_number: candidate.phone_number || '',
    current_income: candidate.current_income || '',
    has_career_change: candidate.has_career_change || '',
    job_change_timing: candidate.job_change_timing || '',
    current_activity_status: candidate.current_activity_status || '',
    recent_job_company_name: candidate.recent_job_company_name || '',
    recent_job_department_position: candidate.recent_job_department_position || '',
    recent_job_start_year: candidate.recent_job_start_year || '',
    recent_job_start_month: candidate.recent_job_start_month || '',
    recent_job_end_year: candidate.recent_job_end_year || '',
    recent_job_end_month: candidate.recent_job_end_month || '',
    recent_job_is_currently_working: candidate.recent_job_is_currently_working || false,
    recent_job_description: candidate.recent_job_description || '',
    job_summary: candidate.job_summary || '',
    self_pr: candidate.self_pr || '',
    recent_job_industries: candidate.work_experience?.map(exp => 
      typeof exp.industry_name === 'object' 
        ? (exp.industry_name.name || exp.industry_name.id || JSON.stringify(exp.industry_name))
        : exp.industry_name
    ).filter(Boolean) || [],
    recent_job_types: candidate.job_type_experience?.map(exp => 
      typeof exp.job_type_name === 'object' 
        ? (exp.job_type_name.name || exp.job_type_name.id || JSON.stringify(exp.job_type_name))
        : exp.job_type_name
    ).filter(Boolean) || [],
  });

  // Education data
  const [education, setEducation] = useState<EducationData>({
    final_education: candidate.education[0]?.final_education || '',
    school_name: candidate.education[0]?.school_name || '',
    department: candidate.education[0]?.department || '',
    graduation_year: candidate.education[0]?.graduation_year || null,
    graduation_month: candidate.education[0]?.graduation_month || null,
  });


  // Skills data
  const [skills, setSkills] = useState<SkillsData>({
    english_level: candidate.skills[0]?.english_level || '',
    other_languages: candidate.skills[0]?.other_languages || null,
    skills_list: candidate.skills[0]?.skills_list ? candidate.skills[0].skills_list.map(skill =>
      typeof skill === 'object' 
        ? (skill.name || skill.id || JSON.stringify(skill))
        : skill
    ) : [],
    qualifications: candidate.skills[0]?.qualifications || '',
  });

  const handleInputChange = (field: keyof UpdateCandidateData, value: any) => {
    setFormData(prev => ({ ...prev, [field]: value }));
  };

  const handleEducationChange = (field: keyof EducationData, value: any) => {
    setEducation(prev => ({ ...prev, [field]: value }));
  };

  const handleSkillsChange = (field: keyof SkillsData, value: any) => {
    setSkills(prev => ({ ...prev, [field]: value }));
  };


  const handleIndustryConfirm = (selectedIndustries: string[]) => {
    handleInputChange('recent_job_industries', selectedIndustries);
    setModalState({ isOpen: false, targetType: null, targetIndex: null });
  };

  const handleJobTypeConfirm = (selectedJobTypes: string[]) => {
    handleInputChange('recent_job_types', selectedJobTypes);
    setModalState({ isOpen: false, targetType: null, targetIndex: null });
  };

  const handleSubmit = async () => {
    if (isSubmitting) return;
    
    setIsSubmitting(true);
    
    try {
      // Prepare data for confirmation page
      const confirmData = {
        updateData: formData,
        education,
        workExperience: formData.recent_job_industries.map(industry => ({ 
          industry_name: industry, 
          experience_years: 0 
        })),
        jobTypeExperience: formData.recent_job_types.map(jobType => ({ 
          job_type_name: jobType, 
          experience_years: 0 
        })),
        skills
      };

      // Navigate to confirmation page with data
      const params = new URLSearchParams();
      params.set('data', JSON.stringify(confirmData));
      router.push(`/admin/candidate/${candidate.id}/edit/confirm?${params.toString()}`);
      
    } catch (error) {
      console.error('Error preparing candidate data:', error);
      alert('データの準備に失敗しました');
    } finally {
      setIsSubmitting(false);
    }
  };

  // Parse birth date for form display
  const birthDate = formData.birth_date ? new Date(formData.birth_date) : null;
  const birthYear = birthDate ? birthDate.getFullYear().toString() : '';
  const birthMonth = birthDate ? (birthDate.getMonth() + 1).toString() : '';
  const birthDay = birthDate ? birthDate.getDate().toString() : '';

  // Selection entries helper functions
  const updateEntry = (index: number, field: keyof SelectionEntry, value: any) => {
    setSelectionEntries(prev => prev.map((entry, i) => 
      i === index ? { ...entry, [field]: value } : entry
    ));
  };

  const addEntry = () => {
    const newEntry: SelectionEntry = {
      id: `${selectionEntries.length + 1}`,
      isPrivate: false,
      industries: [],
      companyName: '',
      department: '',
      progressStatus: '',
      declineReason: '',
    };
    setSelectionEntries(prev => [...prev, newEntry]);
  };

  const removeEntry = (index: number) => {
    setSelectionEntries(prev => prev.filter((_, i) => i !== index));
    setSelectedIndustriesMap(prev => {
      const newMap = { ...prev };
      delete newMap[index];
      return newMap;
    });
  };

  const handleIndustrySelect = (industries: string[]) => {
    if (modalState.targetIndex !== null) {
      setSelectedIndustriesMap(prev => ({
        ...prev,
        [modalState.targetIndex!]: industries,
      }));
      updateEntry(modalState.targetIndex, 'industries', industries);
    }
    setModalState({ isOpen: false, targetType: null, targetIndex: null });
  };

  return (
    <>
      <div className="min-h-screen">
        <div className="p-8">
          {/* 候補者分析 */}
          <section className="mb-12">
            <h2 className="text-xl font-bold text-gray-800 mb-4 pb-2 border-b-2 border-gray-300">
              候補者分析
            </h2>
            <div className="bg-white relative rounded-[4px] w-full">
              <div className="content-stretch flex flex-col items-start justify-start overflow-clip relative w-full">
                {/* ヘッダー行 */}
                <div className="bg-[rgba(255,255,255,0)] content-stretch flex items-start justify-start overflow-clip relative shrink-0 w-full">
                <div className="basis-0 bg-[rgba(0,0,0,0.06)] content-stretch flex flex-col grow items-start justify-start min-h-px min-w-px relative self-stretch shrink-0">
                  <div aria-hidden="true" className="absolute border-[#b9b9b9] border-[1px_0px_0px_1px] border-solid inset-0 pointer-events-none" />
                  <div className="box-border content-stretch flex items-start justify-start overflow-clip px-3 py-2.5 relative shrink-0 w-full">
                    <div className="basis-0 font-semibold grow leading-[0] min-h-px min-w-px not-italic relative shrink-0 text-[12px] text-black">
                      <p className="leading-[1.3]">&nbsp;</p>
                    </div>
                  </div>
                </div>
                <div className="basis-0 bg-[rgba(0,0,0,0.06)] content-stretch flex flex-col grow items-start justify-start min-h-px min-w-px relative self-stretch shrink-0">
                  <div aria-hidden="true" className="absolute border-[#b9b9b9] border-[1px_0px_0px_1px] border-solid inset-0 pointer-events-none" />
                  <div className="box-border content-stretch flex items-start justify-start overflow-clip px-3 py-2.5 relative shrink-0 w-full">
                    <div className="basis-0 font-semibold grow leading-[0] min-h-px min-w-px not-italic relative shrink-0 text-[12px] text-black">
                      <p className="leading-[1.3]">スカウト受信数</p>
                    </div>
                  </div>
                </div>
                <div className="basis-0 bg-[rgba(0,0,0,0.06)] content-stretch flex flex-col grow items-start justify-start min-h-px min-w-px relative self-stretch shrink-0">
                  <div aria-hidden="true" className="absolute border-[#b9b9b9] border-[1px_0px_0px_1px] border-solid inset-0 pointer-events-none" />
                  <div className="box-border content-stretch flex items-start justify-start overflow-clip px-3 py-2.5 relative shrink-0 w-full">
                    <div className="basis-0 font-semibold grow leading-[0] min-h-px min-w-px not-italic relative shrink-0 text-[12px] text-black">
                      <p className="leading-[1.3]">開封数（開封率）</p>
                    </div>
                  </div>
                </div>
                <div className="basis-0 bg-[rgba(0,0,0,0.06)] content-stretch flex flex-col grow items-start justify-start min-h-px min-w-px relative self-stretch shrink-0">
                  <div aria-hidden="true" className="absolute border-[#b9b9b9] border-[1px_0px_0px_1px] border-solid inset-0 pointer-events-none" />
                  <div className="box-border content-stretch flex items-start justify-start overflow-clip px-3 py-2.5 relative shrink-0 w-full">
                    <div className="basis-0 font-semibold grow leading-[0] min-h-px min-w-px not-italic relative shrink-0 text-[12px] text-black">
                      <p className="leading-[1.3]">返信数（返信率）</p>
                    </div>
                  </div>
                </div>
                <div className="basis-0 bg-[rgba(0,0,0,0.06)] content-stretch flex flex-col grow items-start justify-start min-h-px min-w-px relative self-stretch shrink-0">
                  <div aria-hidden="true" className="absolute border-[#b9b9b9] border-[1px_0px_0px_1px] border-solid inset-0 pointer-events-none" />
                  <div className="box-border content-stretch flex items-start justify-start overflow-clip px-3 py-2.5 relative shrink-0 w-full">
                    <div className="basis-0 font-semibold grow leading-[0] min-h-px min-w-px not-italic relative shrink-0 text-[12px] text-black">
                      <p className="leading-[1.3]">応募数（応募率）</p>
                    </div>
                  </div>
                </div>
              </div>

              {/* 過去7日合計行 */}
              <div className="bg-[rgba(255,255,255,0)] content-stretch flex items-start justify-start overflow-clip relative shrink-0 w-full">
                <div className="basis-0 bg-[rgba(255,255,255,0)] content-stretch flex flex-col grow items-start justify-start min-h-px min-w-px relative self-stretch shrink-0">
                  <div aria-hidden="true" className="absolute border-[#b9b9b9] border-[1px_0px_0px_1px] border-solid inset-0 pointer-events-none" />
                  <div className="box-border content-stretch flex items-start justify-start overflow-clip px-3 py-2.5 relative shrink-0 w-full">
                    <div className="basis-0 font-normal grow leading-[0] min-h-px min-w-px not-italic relative shrink-0 text-[12px] text-black">
                      <p className="leading-[1.3]">過去7日合計</p>
                    </div>
                  </div>
                </div>
                <div className="basis-0 bg-[rgba(255,255,255,0)] content-stretch flex flex-col grow items-start justify-start min-h-px min-w-px relative self-stretch shrink-0">
                  <div aria-hidden="true" className="absolute border-[#b9b9b9] border-[1px_0px_0px_1px] border-solid inset-0 pointer-events-none" />
                  <div className="box-border content-stretch flex items-start justify-start overflow-clip px-3 py-2.5 relative shrink-0 w-full">
                    <div className="basis-0 font-normal grow leading-[0] min-h-px min-w-px not-italic relative shrink-0 text-[12px] text-black">
                      <p className="leading-[1.3]">{candidate.scout_stats.scout_received_7days}</p>
                    </div>
                  </div>
                </div>
                <div className="basis-0 bg-[rgba(255,255,255,0)] content-stretch flex flex-col grow items-start justify-start min-h-px min-w-px relative self-stretch shrink-0">
                  <div aria-hidden="true" className="absolute border-[#b9b9b9] border-[1px_0px_0px_1px] border-solid inset-0 pointer-events-none" />
                  <div className="box-border content-stretch flex items-start justify-start overflow-clip px-3 py-2.5 relative shrink-0 w-full">
                    <div className="basis-0 font-normal grow leading-[0] min-h-px min-w-px not-italic relative shrink-0 text-[12px] text-black">
                      <p className="leading-[1.3]">
                        {candidate.scout_stats.scout_opened_7days}
                        {candidate.scout_stats.scout_received_7days > 0 ? ` (${Math.round(candidate.scout_stats.scout_opened_7days / candidate.scout_stats.scout_received_7days * 100)}%)` : ''}
                      </p>
                    </div>
                  </div>
                </div>
                <div className="basis-0 bg-[rgba(255,255,255,0)] content-stretch flex flex-col grow items-start justify-start min-h-px min-w-px relative self-stretch shrink-0">
                  <div aria-hidden="true" className="absolute border-[#b9b9b9] border-[1px_0px_0px_1px] border-solid inset-0 pointer-events-none" />
                  <div className="box-border content-stretch flex items-start justify-start overflow-clip px-3 py-2.5 relative shrink-0 w-full">
                    <div className="basis-0 font-normal grow leading-[0] min-h-px min-w-px not-italic relative shrink-0 text-[12px] text-black">
                      <p className="leading-[1.3]">
                        {candidate.scout_stats.scout_replied_7days}
                        {candidate.scout_stats.scout_received_7days > 0 ? ` (${Math.round(candidate.scout_stats.scout_replied_7days / candidate.scout_stats.scout_received_7days * 100)}%)` : ''}
                      </p>
                    </div>
                  </div>
                </div>
                <div className="basis-0 bg-[rgba(255,255,255,0)] content-stretch flex flex-col grow items-start justify-start min-h-px min-w-px relative self-stretch shrink-0">
                  <div aria-hidden="true" className="absolute border-[#b9b9b9] border-[1px_0px_0px_1px] border-solid inset-0 pointer-events-none" />
                  <div className="box-border content-stretch flex items-start justify-start overflow-clip px-3 py-2.5 relative shrink-0 w-full">
                    <div className="font-normal leading-[0] not-italic relative shrink-0 text-[12px] text-black text-nowrap">
                      <p className="leading-[1.3] whitespace-pre">
                        {candidate.scout_stats.applications_7days}
                        {candidate.scout_stats.scout_received_7days > 0 ? ` (${Math.round(candidate.scout_stats.applications_7days / candidate.scout_stats.scout_received_7days * 100)}%)` : ''}
                      </p>
                    </div>
                  </div>
                </div>
              </div>

              {/* 過去30日間合計行 */}
              <div className="bg-[rgba(255,255,255,0)] content-stretch flex items-start justify-start overflow-clip relative shrink-0 w-full">
                <div className="basis-0 bg-[rgba(255,255,255,0)] content-stretch flex flex-col grow items-start justify-start min-h-px min-w-px relative self-stretch shrink-0">
                  <div aria-hidden="true" className="absolute border-[#b9b9b9] border-[1px_0px_0px_1px] border-solid inset-0 pointer-events-none" />
                  <div className="box-border content-stretch flex items-start justify-start overflow-clip px-3 py-2.5 relative shrink-0 w-full">
                    <div className="basis-0 font-normal grow leading-[0] min-h-px min-w-px not-italic relative shrink-0 text-[12px] text-black">
                      <p className="leading-[1.3]">過去30日間合計</p>
                    </div>
                  </div>
                </div>
                <div className="basis-0 bg-[rgba(255,255,255,0)] content-stretch flex flex-col grow items-start justify-start min-h-px min-w-px relative self-stretch shrink-0">
                  <div aria-hidden="true" className="absolute border-[#b9b9b9] border-[1px_0px_0px_1px] border-solid inset-0 pointer-events-none" />
                  <div className="box-border content-stretch flex items-start justify-start overflow-clip px-3 py-2.5 relative shrink-0 w-full">
                    <div className="basis-0 font-normal grow leading-[0] min-h-px min-w-px not-italic relative shrink-0 text-[12px] text-black">
                      <p className="leading-[1.3]">{candidate.scout_stats.scout_received_30days}</p>
                    </div>
                  </div>
                </div>
                <div className="basis-0 bg-[rgba(255,255,255,0)] content-stretch flex flex-col grow items-start justify-start min-h-px min-w-px relative self-stretch shrink-0">
                  <div aria-hidden="true" className="absolute border-[#b9b9b9] border-[1px_0px_0px_1px] border-solid inset-0 pointer-events-none" />
                  <div className="box-border content-stretch flex items-start justify-start overflow-clip px-3 py-2.5 relative shrink-0 w-full">
                    <div className="basis-0 font-normal grow leading-[0] min-h-px min-w-px not-italic relative shrink-0 text-[12px] text-black">
                      <p className="leading-[1.3]">
                        {candidate.scout_stats.scout_opened_30days}
                        {candidate.scout_stats.scout_received_30days > 0 ? ` (${Math.round(candidate.scout_stats.scout_opened_30days / candidate.scout_stats.scout_received_30days * 100)}%)` : ''}
                      </p>
                    </div>
                  </div>
                </div>
                <div className="basis-0 bg-[rgba(255,255,255,0)] content-stretch flex flex-col grow items-start justify-start min-h-px min-w-px relative self-stretch shrink-0">
                  <div aria-hidden="true" className="absolute border-[#b9b9b9] border-[1px_0px_0px_1px] border-solid inset-0 pointer-events-none" />
                  <div className="box-border content-stretch flex items-start justify-start overflow-clip px-3 py-2.5 relative shrink-0 w-full">
                    <div className="basis-0 font-normal grow leading-[0] min-h-px min-w-px not-italic relative shrink-0 text-[12px] text-black">
                      <p className="leading-[1.3]">
                        {candidate.scout_stats.scout_replied_30days}
                        {candidate.scout_stats.scout_received_30days > 0 ? ` (${Math.round(candidate.scout_stats.scout_replied_30days / candidate.scout_stats.scout_received_30days * 100)}%)` : ''}
                      </p>
                    </div>
                  </div>
                </div>
                <div className="basis-0 bg-[rgba(255,255,255,0)] content-stretch flex flex-col grow items-start justify-start min-h-px min-w-px relative self-stretch shrink-0">
                  <div aria-hidden="true" className="absolute border-[#b9b9b9] border-[1px_0px_0px_1px] border-solid inset-0 pointer-events-none" />
                  <div className="box-border content-stretch flex items-start justify-start overflow-clip px-3 py-2.5 relative shrink-0 w-full">
                    <div className="font-normal leading-[0] not-italic relative shrink-0 text-[12px] text-black text-nowrap">
                      <p className="leading-[1.3] whitespace-pre">
                        {candidate.scout_stats.applications_30days}
                        {candidate.scout_stats.scout_received_30days > 0 ? ` (${Math.round(candidate.scout_stats.applications_30days / candidate.scout_stats.scout_received_30days * 100)}%)` : ''}
                      </p>
                    </div>
                  </div>
                </div>
              </div>

              {/* 累計行 */}
              <div className="bg-[rgba(255,255,255,0)] content-stretch flex items-start justify-start overflow-clip relative shrink-0 w-full">
                <div className="basis-0 bg-[rgba(255,255,255,0)] content-stretch flex flex-col grow items-start justify-start min-h-px min-w-px relative self-stretch shrink-0">
                  <div aria-hidden="true" className="absolute border-[#b9b9b9] border-[1px_0px_0px_1px] border-solid inset-0 pointer-events-none" />
                  <div className="box-border content-stretch flex items-start justify-start overflow-clip px-3 py-2.5 relative shrink-0 w-full">
                    <div className="basis-0 font-normal grow leading-[0] min-h-px min-w-px not-italic relative shrink-0 text-[12px] text-black">
                      <p className="leading-[1.3]">累計</p>
                    </div>
                  </div>
                </div>
                <div className="basis-0 bg-[rgba(255,255,255,0)] content-stretch flex flex-col grow items-start justify-start min-h-px min-w-px relative self-stretch shrink-0">
                  <div aria-hidden="true" className="absolute border-[#b9b9b9] border-[1px_0px_0px_1px] border-solid inset-0 pointer-events-none" />
                  <div className="box-border content-stretch flex items-start justify-start overflow-clip px-3 py-2.5 relative shrink-0 w-full">
                    <div className="basis-0 font-normal grow leading-[0] min-h-px min-w-px not-italic relative shrink-0 text-[12px] text-black">
                      <p className="leading-[1.3]">{candidate.scout_stats.scout_received_total}</p>
                    </div>
                  </div>
                </div>
                <div className="basis-0 bg-[rgba(255,255,255,0)] content-stretch flex flex-col grow items-start justify-start min-h-px min-w-px relative self-stretch shrink-0">
                  <div aria-hidden="true" className="absolute border-[#b9b9b9] border-[1px_0px_0px_1px] border-solid inset-0 pointer-events-none" />
                  <div className="box-border content-stretch flex items-start justify-start overflow-clip px-3 py-2.5 relative shrink-0 w-full">
                    <div className="basis-0 font-normal grow leading-[0] min-h-px min-w-px not-italic relative shrink-0 text-[12px] text-black">
                      <p className="leading-[1.3]">
                        {candidate.scout_stats.scout_opened_total}
                        {candidate.scout_stats.scout_received_total > 0 ? ` (${Math.round(candidate.scout_stats.scout_opened_total / candidate.scout_stats.scout_received_total * 100)}%)` : ''}
                      </p>
                    </div>
                  </div>
                </div>
                <div className="basis-0 bg-[rgba(255,255,255,0)] content-stretch flex flex-col grow items-start justify-start min-h-px min-w-px relative self-stretch shrink-0">
                  <div aria-hidden="true" className="absolute border-[#b9b9b9] border-[1px_0px_0px_1px] border-solid inset-0 pointer-events-none" />
                  <div className="box-border content-stretch flex items-start justify-start overflow-clip px-3 py-2.5 relative shrink-0 w-full">
                    <div className="basis-0 font-normal grow leading-[0] min-h-px min-w-px not-italic relative shrink-0 text-[12px] text-black">
                      <p className="leading-[1.3]">
                        {candidate.scout_stats.scout_replied_total}
                        {candidate.scout_stats.scout_received_total > 0 ? ` (${Math.round(candidate.scout_stats.scout_replied_total / candidate.scout_stats.scout_received_total * 100)}%)` : ''}
                      </p>
                    </div>
                  </div>
                </div>
                <div className="basis-0 bg-[rgba(255,255,255,0)] content-stretch flex flex-col grow items-start justify-start min-h-px min-w-px relative self-stretch shrink-0">
                  <div aria-hidden="true" className="absolute border-[#b9b9b9] border-[1px_0px_0px_1px] border-solid inset-0 pointer-events-none" />
                  <div className="box-border content-stretch flex items-start justify-start overflow-clip px-3 py-2.5 relative shrink-0 w-full">
                    <div className="font-normal leading-[0] not-italic relative shrink-0 text-[12px] text-black text-nowrap">
                      <p className="leading-[1.3] whitespace-pre">
                        {candidate.scout_stats.applications_total}
                        {candidate.scout_stats.scout_received_total > 0 ? ` (${Math.round(candidate.scout_stats.applications_total / candidate.scout_stats.scout_received_total * 100)}%)` : ''}
                      </p>
                    </div>
                  </div>
                </div>
              </div>
            </div>
            <div aria-hidden="true" className="absolute border border-[#b9b9b9] border-solid inset-0 pointer-events-none rounded-[4px]" />
          </div>
        </section>

        {/* 運営メモ */}
        <section className="mb-12">
          <h3 className="text-lg font-semibold text-gray-800 mb-4">運営メモ</h3>
          <textarea
            value={memo}
            onChange={(e) => setMemo(e.target.value)}
            className="w-full h-32 p-4 border border-gray-300 rounded-lg resize-none"
            placeholder="自由にメモを記入できます。同一グループ内の方が閲覧可能です。"
          />
        </section>

        <form onSubmit={(e) => e.preventDefault()}>
          {/* メールアドレス */}
          <section className="mb-12">
            <h3 className="text-xl font-bold text-gray-800 mb-4 pb-2 border-b-2 border-gray-300">
              メールアドレス
            </h3>
            <div className="flex items-center gap-8">
              <label className="text-sm font-medium text-gray-700 w-32 text-right shrink-0">
                メールアドレス
              </label>
              <input
                type="email"
                value={formData.email}
                onChange={(e) => handleInputChange('email', e.target.value)}
                className="w-[400px] px-[11px] py-[11px] border border-[#999999] rounded-[5px] text-[16px] text-[#323232] font-medium tracking-[1.6px]"
              />
            </div>
          </section>

          {/* 基本情報 */}
          <section className="mb-12">
            <h3 className="text-xl font-bold text-gray-800 mb-4 pb-2 border-b-2 border-gray-300">
              基本情報
            </h3>
            {/* Name Fields */}
            <div className="flex items-center gap-8 mb-6">
              <label className="text-sm font-medium text-gray-700 w-32 text-right shrink-0">
                氏名
              </label>
              <div className="w-[400px] flex gap-4">
                <input
                  type="text"
                  placeholder="姓"
                  autoComplete="off"
                  value={formData.last_name}
                  onChange={(e) => handleInputChange('last_name', e.target.value)}
                  className="flex-1 px-[11px] py-[11px] border border-[#999999] rounded-[5px] text-[16px] text-[#323232] font-bold tracking-[1.6px] placeholder:text-[#999999]"
                />
                <input
                  type="text"
                  placeholder="名"
                  autoComplete="off"
                  value={formData.first_name}
                  onChange={(e) => handleInputChange('first_name', e.target.value)}
                  className="flex-1 px-[11px] py-[11px] border border-[#999999] rounded-[5px] text-[16px] text-[#323232] font-bold tracking-[1.6px] placeholder:text-[#999999]"
                />
              </div>
            </div>

            {/* Furigana Fields */}
            <div className="flex items-center gap-8 mb-6">
              <label className="text-sm font-medium text-gray-700 w-32 text-right shrink-0">
                フリガナ
              </label>
              <div className="w-[400px] flex gap-4">
                <input
                  type="text"
                  placeholder="セイ"
                  autoComplete="off"
                  value={formData.last_name_kana}
                  onChange={(e) => handleInputChange('last_name_kana', e.target.value)}
                  className="flex-1 px-[11px] py-[11px] border border-[#999999] rounded-[5px] text-[16px] text-[#323232] font-bold tracking-[1.6px] placeholder:text-[#999999]"
                />
                <input
                  type="text"
                  placeholder="メイ"
                  autoComplete="off"
                  value={formData.first_name_kana}
                  onChange={(e) => handleInputChange('first_name_kana', e.target.value)}
                  className="flex-1 px-[11px] py-[11px] border border-[#999999] rounded-[5px] text-[16px] text-[#323232] font-bold tracking-[1.6px] placeholder:text-[#999999]"
                />
              </div>
            </div>

            {/* Gender */}
            <div className="flex items-center gap-8 mb-6">
              <label className="text-sm font-medium text-gray-700 w-32 text-right shrink-0">
                性別
              </label>
              <div className="w-[400px] flex gap-2">
                {GENDER_OPTIONS.map((option) => (
                  <button
                    key={option.value}
                    type="button"
                    onClick={() => handleInputChange('gender', option.value)}
                    className={`flex-1 px-[11px] py-[11px] border rounded-[5px] text-[16px] font-bold tracking-[1.6px] transition-colors ${
                      formData.gender === option.value
                        ? 'bg-[#0f9058] border-[#0f9058] text-white'
                        : 'bg-white border-[#999999] text-[#999999] hover:border-[#0f9058]'
                    }`}
                  >
                    {option.label}
                  </button>
                ))}
              </div>
            </div>

            {/* Current Address */}
            <div className="flex items-center gap-8 mb-6">
              <label className="text-sm font-medium text-gray-700 w-32 text-right shrink-0">
                現在の住まい
              </label>
              <div className="w-[400px]">
                <div className="relative">
                  <select
                    value={formData.prefecture}
                    onChange={(e) => handleInputChange('prefecture', e.target.value)}
                    className="w-full px-[11px] py-[11px] pr-10 border border-[#999999] rounded-[5px] text-[16px] text-[#323232] font-bold tracking-[1.6px] appearance-none cursor-pointer"
                  >
                    {PREFECTURES.map((prefecture) => (
                      <option
                        key={prefecture}
                        value={prefecture}
                      >
                        {prefecture}
                      </option>
                    ))}
                  </select>
                  <div className="absolute right-[16px] top-1/2 -translate-y-1/2 pointer-events-none">
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
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

            {/* Birth Date */}
            <div className="flex items-center gap-8 mb-6">
              <label className="text-sm font-medium text-gray-700 w-32 text-right shrink-0">
                生年月日
              </label>
              <div className="w-[400px] flex gap-4 items-center">
                <div className="relative flex-1">
                  <select
                    value={birthYear}
                    onChange={(e) => {
                      const newDate = `${e.target.value}-${birthMonth.padStart(2, '0')}-${birthDay.padStart(2, '0')}`;
                      handleInputChange('birth_date', e.target.value && birthMonth && birthDay ? newDate : '');
                    }}
                    className="w-full py-3 pl-3 border border-[#999999] rounded-[5px] text-[16px] text-[#323232] font-bold tracking-[1.6px] appearance-none cursor-pointer"
                  >
                    <option value="">年</option>
                    {generateYearOptions().map(year => (
                      <option key={year} value={year}>{year}</option>
                    ))}
                  </select>
                  <div className="absolute right-[10px] top-1/2 -translate-y-1/2 pointer-events-none">
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
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
                <span className="text-[#323232] text-[16px] font-bold tracking-[1.6px]">
                  年
                </span>
                <div className="relative flex-1">
                  <select
                    value={birthMonth}
                    onChange={(e) => {
                      const newDate = `${birthYear}-${e.target.value.padStart(2, '0')}-${birthDay.padStart(2, '0')}`;
                      handleInputChange('birth_date', birthYear && e.target.value && birthDay ? newDate : '');
                    }}
                    className="w-full py-3 pl-3 border border-[#999999] rounded-[5px] text-[16px] text-[#323232] font-bold tracking-[1.6px] appearance-none cursor-pointer"
                  >
                    <option value="">月</option>
                    {generateMonthOptions().map(month => (
                      <option key={month} value={month}>{month}</option>
                    ))}
                  </select>
                  <div className="absolute right-[10px] top-1/2 -translate-y-1/2 pointer-events-none">
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
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
                <span className="text-[#323232] text-[16px] font-bold tracking-[1.6px]">
                  月
                </span>
                <div className="relative flex-1">
                  <select
                    value={birthDay}
                    onChange={(e) => {
                      const newDate = `${birthYear}-${birthMonth.padStart(2, '0')}-${e.target.value.padStart(2, '0')}`;
                      handleInputChange('birth_date', birthYear && birthMonth && e.target.value ? newDate : '');
                    }}
                    className="w-full py-3 pl-3 border border-[#999999] rounded-[5px] text-[16px] text-[#323232] font-bold tracking-[1.6px] appearance-none cursor-pointer"
                  >
                    <option value="">日</option>
                    {generateDayOptions().map(day => (
                      <option key={day} value={day}>{day}</option>
                    ))}
                  </select>
                  <div className="absolute right-[10px] top-1/2 -translate-y-1/2 pointer-events-none">
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
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
                <span className="text-[#323232] text-[16px] font-bold tracking-[1.6px]">
                  日
                </span>
              </div>
            </div>

            {/* Phone Number */}
            <div className="flex items-center gap-8 mb-6">
              <label className="text-sm font-medium text-gray-700 w-32 text-right shrink-0">
                連絡先電話番号
              </label>
              <input
                type="tel"
                placeholder="08011112222"
                autoComplete="off"
                value={formData.phone_number}
                onChange={(e) => handleInputChange('phone_number', e.target.value)}
                className="w-[400px] px-[11px] py-[11px] border border-[#999999] rounded-[5px] text-[16px] text-[#323232] font-medium tracking-[1.6px] placeholder:text-[#999999]"
              />
            </div>

            {/* Current Income */}
            <div className="flex items-center gap-8 mb-6">
              <label className="text-sm font-medium text-gray-700 w-32 text-right shrink-0">
                現在の年収
              </label>
              <div className="w-[400px]">
                <div className="relative">
                  <select
                    value={formData.current_income}
                    onChange={(e) => handleInputChange('current_income', e.target.value)}
                    className="w-full px-[11px] py-[11px] pr-10 border border-[#999999] rounded-[5px] text-[16px] text-[#323232] font-bold tracking-[1.6px] appearance-none cursor-pointer"
                  >
                    {INCOME_RANGES.map((income) => (
                      <option key={income.value} value={income.value}>
                        {income.label}
                      </option>
                    ))}
                  </select>
                  <div className="absolute right-[16px] top-1/2 -translate-y-1/2 pointer-events-none">
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
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
          </section>

          {/* 転職活動状況 */}
          <section className="mb-12">
            <h3 className="text-xl font-bold text-gray-800 mb-4 pb-2 border-b-2 border-gray-300">
              転職活動状況
            </h3>
            
            <div>
              <h4 className="text-lg font-semibold text-gray-800 mb-4 pb-1 border-b-2 border-gray-200">
                転職経験
              </h4>
              {/* 転職経験 */}
              <div className="flex items-center gap-8 mb-6">
                <label className="text-sm font-medium text-gray-700 w-32 text-right shrink-0">
                  転職経験
                </label>
                <div className="w-[400px] flex gap-2">
                  <button
                    type="button"
                    onClick={() => handleInputChange('has_career_change', 'yes')}
                    className={`flex-1 px-[11px] py-[11px] border rounded-[5px] text-[16px] font-bold tracking-[1.6px] transition-colors ${
                      formData.has_career_change === 'yes'
                        ? 'bg-[#0f9058] border-[#0f9058] text-white'
                        : 'bg-white border-[#999999] text-[#999999] hover:border-[#0f9058]'
                    }`}
                  >
                    あり
                  </button>
                  <button
                    type="button"
                    onClick={() => handleInputChange('has_career_change', 'no')}
                    className={`flex-1 px-[11px] py-[11px] border rounded-[5px] text-[16px] font-bold tracking-[1.6px] transition-colors ${
                      formData.has_career_change === 'no'
                        ? 'bg-[#0f9058] border-[#0f9058] text-white'
                        : 'bg-white border-[#999999] text-[#999999] hover:border-[#0f9058]'
                    }`}
                  >
                    なし
                  </button>
                </div>
              </div>
            </div>

            <div>
              <h4 className="text-lg font-semibold text-gray-800 mb-4 pb-1 border-b-2 border-gray-200">
                転職活動状況
              </h4>
              {/* 転職希望時期 */}
              <div className="flex items-center gap-8 mb-6">
                <label className="text-sm font-medium text-gray-700 w-32 text-right shrink-0">
                  転職希望時期
                </label>
                <div className="w-[400px]">
                  <div className="relative">
                    <select
                      value={formData.job_change_timing}
                      onChange={(e) => handleInputChange('job_change_timing', e.target.value)}
                      className="w-full px-[11px] py-[11px] pr-10 border border-[#999999] rounded-[5px] text-[16px] text-[#323232] font-bold tracking-[1.6px] appearance-none cursor-pointer"
                    >
                      <option value="">未選択</option>
                      {JOB_CHANGE_TIMING_OPTIONS.map((option) => (
                        <option key={option.value} value={option.value}>
                          {option.label}
                        </option>
                      ))}
                    </select>
                    <div className="absolute right-[16px] top-1/2 -translate-y-1/2 pointer-events-none">
                      <svg
                        xmlns="http://www.w3.org/2000/svg"
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

              {/* 現在の活動状況 */}
              <div className="flex items-center gap-8 mb-6">
                <label className="text-sm font-medium text-gray-700 w-32 text-right shrink-0">
                  現在の活動状況
                </label>
                <div className="w-[400px]">
                  <div className="relative">
                    <select
                      value={formData.current_activity_status}
                      onChange={(e) => handleInputChange('current_activity_status', e.target.value)}
                      className="w-full px-[11px] py-[11px] pr-10 border border-[#999999] rounded-[5px] text-[16px] text-[#323232] font-bold tracking-[1.6px] appearance-none cursor-pointer"
                    >
                      <option value="">未選択</option>
                      {CURRENT_ACTIVITY_STATUS_OPTIONS.map((option) => (
                        <option key={option.value} value={option.value}>
                          {option.label}
                        </option>
                      ))}
                    </select>
                    <div className="absolute right-[16px] top-1/2 -translate-y-1/2 pointer-events-none">
                      <svg
                        xmlns="http://www.w3.org/2000/svg"
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
            </div>

            {/* Divider */}
            <div className="flex flex-row w-full h-[29px] items-center justify-center gap-6">
              <div className="flex-1 h-px relative">
                <div className="absolute inset-[-1px_-0.3%]">
                  <svg width="100%" height="1" viewBox="0 0 100 1" preserveAspectRatio="none">
                    <line x1="0" y1="0" x2="100" y2="0" stroke="#dcdcdc" strokeWidth="1" />
                  </svg>
                </div>
              </div>
              <span className="text-[#323232] text-[18px] font-bold tracking-[1.8px] text-nowrap">
                選考状況
              </span>
              <div className="flex-1 h-px relative">
                <div className="absolute inset-[-1px_-0.3%]">
                  <svg width="100%" height="1" viewBox="0 0 100 1" preserveAspectRatio="none">
                    <line x1="0" y1="0" x2="100" y2="0" stroke="#dcdcdc" strokeWidth="1" />
                </svg>
                </div>
              </div>
            </div>
            
            {/* Selection Status Entries */}
            {formData.current_activity_status !== 'not_started' && formData.current_activity_status !== 'researching' && formData.current_activity_status !== '' && (
                <div className="flex flex-col gap-2 items-center w-[536px]">
                  {selectionEntries.map((entry, index) => (
                    <div
                      key={entry.id}
                      className="bg-[#f9f9f9] rounded-[10px] p-10 w-full flex flex-col gap-6 items-end relative"
                    >
                      {index > 0 && (
                        <div
                          className="absolute top-6 right-6 w-4 h-4 cursor-pointer"
                          onClick={() => removeEntry(index)}
                        >
                          <svg xmlns="http://www.w3.org/2000/svg" width="17" height="16" viewBox="0 0 17 16" fill="none">
                            <path d="M14.8927 0.276093C15.2603 -0.0914467 15.8562 -0.09139 16.2238 0.276093C16.5914 0.64366 16.5914 1.23958 16.2238 1.60715L9.83123 7.99875L16.2248 14.3923L16.258 14.4275C16.5917 14.7968 16.5805 15.3672 16.2248 15.7234C15.8688 16.0793 15.2984 16.091 14.9289 15.7575L14.8937 15.7234L8.50017 9.3298L2.10662 15.7243L2.07146 15.7575C1.70198 16.0914 1.13164 16.0804 0.775562 15.7243C0.419562 15.3682 0.408556 14.7979 0.742359 14.4284L0.775562 14.3933L7.16912 7.99875L0.775562 1.60617C0.408165 1.23862 0.408127 0.642643 0.775562 0.275116C1.14308 -0.092404 1.73904 -0.0923087 2.10662 0.275116L8.50017 6.66769L14.8927 0.276093Z" fill="#999999" />
                          </svg>
                        </div>
                      )}

                      {/* Public Range Checkbox */}
                      <div className="flex flex-row gap-4 items-start w-full">
                        <label className="text-[#323232] text-[16px] font-bold tracking-[1.6px] pt-1 min-w-[130px] text-right">
                          公開範囲
                        </label>
                        <div className="flex flex-row gap-2 items-start w-[400px]">
                          <div
                            className="w-5 h-5 mt-1 cursor-pointer"
                            onClick={() => updateEntry(index, 'isPrivate', !entry.isPrivate)}
                          >
                            <svg width="20" height="20" viewBox="0 0 20 20" fill="none" xmlns="http://www.w3.org/2000/svg">
                              <path d="M2.85714 0C1.28125 0 0 1.28125 0 2.85714V17.1429C0 18.7188 1.28125 20 2.85714 20H17.1429C18.7188 20 20 18.7188 20 17.1429V2.85714C20 1.28125 18.7188 0 17.1429 0H2.85714ZM15.0446 7.90179L9.33036 13.6161C8.91071 14.0357 8.23214 14.0357 7.81696 13.6161L4.95982 10.7589C4.54018 10.3393 4.54018 9.66071 4.95982 9.24554C5.37946 8.83036 6.05804 8.82589 6.47321 9.24554L8.57143 11.3438L13.5268 6.38393C13.9464 5.96429 14.625 5.96429 15.0402 6.38393C15.4554 6.80357 15.4598 7.48214 15.0402 7.89732L15.0446 7.90179Z" fill={entry.isPrivate ? '#0F9058' : '#DCDCDC'} />
                            </svg>
                          </div>
                          <div className="flex flex-col gap-1 flex-1">
                            <span className="text-[#323232] text-[16px] font-bold tracking-[1.6px]">
                              企業名を非公開（業種・進捗のみ公開）
                            </span>
                            <p className="text-[#999999] text-[14px] font-medium tracking-[1.4px] leading-[1.6]">
                              企業に選考状況を伝えることで、<br />
                              スカウトの質やあなたへの興味度が高まりやすくなります。<br />
                              ※選考中の企業には自動で非公開になります。
                            </p>
                          </div>
                        </div>
                      </div>

                      {/* Industry Selection */}
                      <div className="flex flex-row gap-4 items-start w-full">
                        <label className="text-[#323232] text-[16px] font-bold tracking-[1.6px] pt-[11px] min-w-[130px] text-right">
                          業種
                        </label>
                        <div className="flex flex-col gap-2 w-[400px]">
                          <button
                            type="button"
                            onClick={() => setModalState({ isOpen: true, targetType: 'industry', targetIndex: index })}
                            className="px-10 h-[50px] border border-[#999999] rounded-[32px] text-[#323232] text-[16px] font-bold tracking-[1.6px] bg-white w-fit"
                          >
                            業種を選択
                          </button>
                          <div className="flex flex-wrap gap-2">
                            {selectedIndustriesMap[index]?.map((industry) => (
                              <div key={industry} className="bg-[#d2f1da] px-6 py-2 rounded-[10px] flex items-center gap-2">
                                <span className="text-[#0f9058] text-[14px] font-bold tracking-[1.4px]">
                                  {industry}
                                </span>
                                <button
                                  type="button"
                                  onClick={() => {
                                    setSelectedIndustriesMap((prev) => ({
                                      ...prev,
                                      [index]: prev[index]?.filter((j) => j !== industry) || [],
                                    }));
                                    const newIndustries = selectedIndustriesMap[index]?.filter((j) => j !== industry) || [];
                                    updateEntry(index, 'industries', newIndustries);
                                  }}
                                >
                                  <svg width="12" height="12" viewBox="0 0 12 12" fill="none">
                                    <path d="M1 1L11 11M1 11L11 1" stroke="#0F9058" strokeWidth="1.5" strokeLinecap="round" />
                                  </svg>
                                </button>
                              </div>
                            ))}
                          </div>
                        </div>
                      </div>

                      {/* Company Name */}
                      <div className="flex flex-row gap-4 items-start w-full">
                        <label className="text-[#323232] text-[16px] font-bold tracking-[1.6px] pt-[11px] min-w-[130px] text-right">
                          企業名
                        </label>
                        <CompanyNameInput
                          value={entry.companyName}
                          onChange={(value) => updateEntry(index, 'companyName', value)}
                          placeholder="企業名を入力"
                          className="w-[400px] px-[11px] py-[11px] bg-white border border-[#999999] rounded-[5px] text-[16px] text-[#323232] font-medium tracking-[1.6px] placeholder:text-[#999999]"
                        />
                      </div>

                      {/* Department */}
                      <div className="flex flex-row gap-4 items-start w-full">
                        <label className="text-[#323232] text-[16px] font-bold tracking-[1.6px] pt-[11px] min-w-[130px] text-right">
                          部署名・役職名
                        </label>
                        <input
                          type="text"
                          placeholder="部署名・役職名を入力"
                          value={entry.department || ''}
                          onChange={(e) => updateEntry(index, 'department', e.target.value)}
                          className="w-[400px] px-[11px] py-[11px] bg-white border border-[#999999] rounded-[5px] text-[16px] text-[#323232] font-medium tracking-[1.6px] placeholder:text-[#999999]"
                        />
                      </div>

                      {/* Progress Status */}
                      <div className="flex flex-row gap-4 items-start w-full">
                        <label className="text-[#323232] text-[16px] font-bold tracking-[1.6px] pt-[11px] min-w-[130px] text-right">
                          進捗状況
                        </label>
                        <div className="w-[400px]">
                          <div className="relative">
                            <select
                              value={entry.progressStatus}
                              onChange={(e) => updateEntry(index, 'progressStatus', e.target.value)}
                              className="w-full px-[11px] py-[11px] pr-10 bg-white border border-[#999999] rounded-[5px] text-[16px] text-[#323232] font-bold tracking-[1.6px] appearance-none cursor-pointer"
                            >
                              <option value="">未選択</option>
                              {PROGRESS_STATUS_OPTIONS.map((option) => (
                                <option key={option.value} value={option.value}>
                                  {option.label}
                                </option>
                              ))}
                            </select>
                            <div className="absolute right-4 top-1/2 -translate-y-1/2 pointer-events-none">
                              <svg xmlns="http://www.w3.org/2000/svg" width="14" height="10" viewBox="0 0 14 10" fill="none">
                                <path d="M6.07178 8.90462L0.234161 1.71483C-0.339509 1.00828 0.206262 0 1.16238 0H12.8376C13.7937 0 14.3395 1.00828 13.7658 1.71483L7.92822 8.90462C7.46411 9.47624 6.53589 9.47624 6.07178 8.90462Z" fill="#0F9058" />
                              </svg>
                            </div>
                          </div>
                        </div>
                      </div>

                      {/* Decline Reason */}
                      {entry.progressStatus === 'declined' && (
                        <div className="flex flex-row gap-4 items-start w-full">
                          <label className="text-[#323232] text-[16px] font-bold tracking-[1.6px] pt-[11px] min-w-[130px] text-right">
                            辞退理由
                          </label>
                          <div className="w-[400px]">
                            <div className="relative">
                              <select
                                value={entry.declineReason || ''}
                                onChange={(e) => updateEntry(index, 'declineReason', e.target.value)}
                                className="w-full px-[11px] py-[11px] pr-10 bg-white border border-[#999999] rounded-[5px] text-[16px] text-[#323232] font-bold tracking-[1.6px] appearance-none cursor-pointer"
                              >
                                <option value="">未選択</option>
                                {DECLINE_REASON_OPTIONS.map((option) => (
                                  <option key={option.value} value={option.value}>
                                    {option.label}
                                  </option>
                                ))}
                              </select>
                              <div className="absolute right-4 top-1/2 -translate-y-1/2 pointer-events-none">
                                <svg xmlns="http://www.w3.org/2000/svg" width="14" height="10" viewBox="0 0 14 10" fill="none">
                                  <path d="M6.07178 8.90462L0.234161 1.71483C-0.339509 1.00828 0.206262 0 1.16238 0H12.8376C13.7937 0 14.3395 1.00828 13.7658 1.71483L7.92822 8.90462C7.46411 9.47624 6.53589 9.47624 6.07178 8.90462Z" fill="#0F9058" />
                                </svg>
                              </div>
                            </div>
                          </div>
                        </div>
                      )}
                    </div>
                  ))}

                  <button
                    type="button"
                    onClick={addEntry}
                    className="bg-white border border-[#0f9058] rounded-[32px] px-6 py-2.5 flex items-center gap-2"
                  >
                    <svg width="16" height="16" viewBox="0 0 16 16" fill="none">
                      <path d="M8 1.5V14.5M1.5 8H14.5" stroke="#0f9058" strokeWidth="2" strokeLinecap="round" />
                    </svg>
                    <span className="text-[#0f9058] text-[14px] font-bold tracking-[1.4px]">
                      企業を追加
                    </span>
                  </button>
                </div>
              )}
            
          </section>

          {/* 職務経歴 */}
          <section className="mb-12">
            <h3 className="text-xl font-bold text-gray-800 mb-4 pb-2 border-b-2 border-gray-300">
              職務経歴
            </h3>
            {/* 会社名 */}
            <div className="flex items-center gap-8 mb-6">
              <label className="text-sm font-medium text-gray-700 w-32 text-right shrink-0">
                会社名
              </label>
              <input
                type="text"
                value={formData.recent_job_company_name}
                onChange={(e) => handleInputChange('recent_job_company_name', e.target.value)}
                className="w-[400px] px-[11px] py-[11px] border border-[#999999] rounded-[5px] text-[16px] text-[#323232] font-medium tracking-[1.6px]"
              />
            </div>

            {/* 部署・役職 */}
            <div className="flex items-center gap-8 mb-6">
              <label className="text-sm font-medium text-gray-700 w-32 text-right shrink-0">
                部署・役職
              </label>
              <input
                type="text"
                value={formData.recent_job_department_position}
                onChange={(e) => handleInputChange('recent_job_department_position', e.target.value)}
                className="w-[400px] px-[11px] py-[11px] border border-[#999999] rounded-[5px] text-[16px] text-[#323232] font-medium tracking-[1.6px]"
              />
            </div>

            {/* 在籍期間 */}
            <div className="flex items-start gap-8 mb-6">
              <label className="text-sm font-medium text-gray-700 w-32 text-right shrink-0 pt-2">
                在籍期間
              </label>
              <div className="w-[400px] space-y-4">
                <div className="flex gap-4 items-center">
                  <select
                    value={formData.recent_job_start_year}
                    onChange={(e) => handleInputChange('recent_job_start_year', e.target.value)}
                    className="px-[11px] py-[11px] border border-[#999999] rounded-[5px] text-[16px] text-[#323232] font-bold tracking-[1.6px]"
                  >
                    <option value="">年</option>
                    {generateYearOptions(1970).map(year => (
                      <option key={year} value={year}>{year}</option>
                    ))}
                  </select>
                  <span className="text-[#323232] text-[16px] font-bold tracking-[1.6px]">年</span>
                  <select
                    value={formData.recent_job_start_month}
                    onChange={(e) => handleInputChange('recent_job_start_month', e.target.value)}
                    className="px-[11px] py-[11px] border border-[#999999] rounded-[5px] text-[16px] text-[#323232] font-bold tracking-[1.6px]"
                  >
                    <option value="">月</option>
                    {generateMonthOptions().map(month => (
                      <option key={month} value={month}>{month}</option>
                    ))}
                  </select>
                  <span className="text-[#323232] text-[16px] font-bold tracking-[1.6px]">月〜</span>
                </div>

                <div className="flex items-center gap-4">
                  <label className="flex items-center gap-2">
                    <input
                      type="checkbox"
                      checked={formData.recent_job_is_currently_working}
                      onChange={(e) => handleInputChange('recent_job_is_currently_working', e.target.checked)}
                    />
                    <span className="text-[#323232] text-[16px] font-bold tracking-[1.6px]">現在も在籍中</span>
                  </label>
                </div>

                {!formData.recent_job_is_currently_working && (
                  <div className="flex gap-4 items-center">
                    <select
                      value={formData.recent_job_end_year}
                      onChange={(e) => handleInputChange('recent_job_end_year', e.target.value)}
                      className="px-[11px] py-[11px] border border-[#999999] rounded-[5px] text-[16px] text-[#323232] font-bold tracking-[1.6px]"
                    >
                      <option value="">年</option>
                      {generateYearOptions(1970).map(year => (
                        <option key={year} value={year}>{year}</option>
                      ))}
                    </select>
                    <span className="text-[#323232] text-[16px] font-bold tracking-[1.6px]">年</span>
                    <select
                      value={formData.recent_job_end_month}
                      onChange={(e) => handleInputChange('recent_job_end_month', e.target.value)}
                      className="px-[11px] py-[11px] border border-[#999999] rounded-[5px] text-[16px] text-[#323232] font-bold tracking-[1.6px]"
                    >
                      <option value="">月</option>
                      {generateMonthOptions().map(month => (
                        <option key={month} value={month}>{month}</option>
                      ))}
                    </select>
                    <span className="text-[#323232] text-[16px] font-bold tracking-[1.6px]">月まで</span>
                  </div>
                )}
              </div>
            </div>

            {/* 職務内容 */}
            <div className="flex items-start gap-8 mb-6">
              <label className="text-sm font-medium text-gray-700 w-32 text-right shrink-0 pt-2">
                職務内容
              </label>
              <textarea
                value={formData.recent_job_description}
                onChange={(e) => handleInputChange('recent_job_description', e.target.value)}
                rows={4}
                className="w-[400px] px-[11px] py-[11px] border border-[#999999] rounded-[5px] text-[16px] text-[#323232] font-medium tracking-[1.6px] placeholder:text-[#999999] resize-none"
                placeholder="職務内容を入力してください"
              />
            </div>
          </section>

          {/* 学歴・経験業種/職種 */}
          <section className="mb-12">
            <h3 className="text-xl font-bold text-gray-800 mb-4 pb-2 border-b-2 border-gray-300">
              学歴・経験業種/職種
            </h3>
            {/* Education Form Fields */}
            <div className="space-y-8">
              {/* Final Education */}
              <div className="flex items-center gap-8 mb-6">
                <label className="text-sm font-medium text-gray-700 w-32 text-right shrink-0">
                  最終学歴
                </label>
                <div className="w-[400px]">
                  <div className="relative">
                    <select
                      value={education.final_education}
                      onChange={(e) => handleEducationChange('final_education', e.target.value)}
                      className="w-full px-[11px] py-[11px] pr-10 border border-[#999999] rounded-[5px] text-[16px] text-[#323232] font-bold tracking-[1.6px] appearance-none cursor-pointer"
                    >
                      <option value="">未選択</option>
                      <option value="中学校卒業">中学校卒業</option>
                      <option value="高等学校卒業">高等学校卒業</option>
                      <option value="高等専門学校卒業">高等専門学校卒業</option>
                      <option value="短期大学卒業">短期大学卒業</option>
                      <option value="専門学校卒業">専門学校卒業</option>
                      <option value="大学卒業（学士）">大学卒業（学士）</option>
                      <option value="大学院修士課程修了（修士）">大学院修士課程修了（修士）</option>
                      <option value="大学院博士課程修了（博士）">大学院博士課程修了（博士）</option>
                      <option value="海外大学卒業（学士）">海外大学卒業（学士）</option>
                      <option value="海外大学院修了（修士・博士含む）">海外大学院修了（修士・博士含む）</option>
                      <option value="その他">その他</option>
                    </select>
                    <div className="absolute right-4 top-1/2 -translate-y-1/2 pointer-events-none">
                      <svg
                        xmlns="http://www.w3.org/2000/svg"
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

              {/* School Name */}
              <div className="flex items-center gap-8 mb-6">
                <label className="text-sm font-medium text-gray-700 w-32 text-right shrink-0">
                  学校名
                </label>
                <div className="w-[400px]">
                  <input
                    type="text"
                    placeholder="学校名を入力"
                    value={education.school_name}
                    onChange={(e) => handleEducationChange('school_name', e.target.value)}
                    className="w-full px-[11px] py-[11px] border border-[#999999] rounded-[5px] text-[16px] text-[#323232] font-medium tracking-[1.6px] placeholder:text-[#999999]"
                  />
                </div>
              </div>

              {/* Department/Major */}
              <div className="flex items-center gap-8 mb-6">
                <label className="text-sm font-medium text-gray-700 w-32 text-right shrink-0">
                  学部学科専攻
                </label>
                <div className="w-[400px]">
                  <input
                    type="text"
                    placeholder="学部学科専攻を入力"
                    value={education.department}
                    onChange={(e) => handleEducationChange('department', e.target.value)}
                    className="w-full px-[11px] py-[11px] border border-[#999999] rounded-[5px] text-[16px] text-[#323232] font-medium tracking-[1.6px] placeholder:text-[#999999]"
                  />
                </div>
              </div>

              {/* Graduation Date */}
              <div className="flex items-center gap-8 mb-6">
                <label className="text-sm font-medium text-gray-700 w-32 text-right shrink-0">
                  卒業年月
                </label>
                <div className="w-[400px] flex gap-4 items-center">
                  <div className="relative flex-1">
                    <select
                      value={education.graduation_year || ''}
                      onChange={(e) => handleEducationChange('graduation_year', e.target.value ? parseInt(e.target.value) : null)}
                      className="w-full px-[11px] py-[11px] pl-[11px] border border-[#999999] rounded-[5px] text-[16px] text-[#323232] font-bold tracking-[1.6px] appearance-none cursor-pointer"
                    >
                      <option value="">未選択</option>
                      {generateYearOptions(1960).map(year => (
                        <option key={year} value={year}>{year}</option>
                      ))}
                    </select>
                    <div className="absolute right-2 top-1/2 -translate-y-1/2 pointer-events-none">
                      <svg
                        xmlns="http://www.w3.org/2000/svg"
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
                  <span className="text-[#323232] text-[16px] font-bold tracking-[1.6px]">年</span>
                  <div className="relative flex-1">
                    <select
                      value={education.graduation_month || ''}
                      onChange={(e) => handleEducationChange('graduation_month', e.target.value ? parseInt(e.target.value) : null)}
                      className="w-full px-[11px] py-[11px] pl-[11px] border border-[#999999] rounded-[5px] text-[16px] text-[#323232] font-bold tracking-[1.6px] appearance-none cursor-pointer"
                    >
                      <option value="">未選択</option>
                      {generateMonthOptions().map(month => (
                        <option key={month} value={month}>{month}</option>
                      ))}
                    </select>
                    <div className="absolute right-2 top-1/2 -translate-y-1/2 pointer-events-none">
                      <svg
                        xmlns="http://www.w3.org/2000/svg"
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
                  <span className="text-[#323232] text-[16px] font-bold tracking-[1.6px]">月</span>
                </div>
              </div>

              {/* Industry */}
              <div className="flex items-center gap-8 mb-6">
                <label className="text-[16px] font-bold text-[#323232] tracking-[1.6px] w-32 text-right shrink-0">
                  業種
                </label>
                <div className="flex-1">
                  <button
                    type="button"
                    onClick={() => setModalState({ isOpen: true, targetType: 'industry', targetIndex: -2 })}
                    className="px-10 py-[11px] bg-white border border-[#999999] rounded-[32px] text-[16px] text-[#323232] font-bold tracking-[1.6px] mb-4 w-fit"
                  >
                    業種を選択
                  </button>
                  <div className="flex flex-wrap gap-2">
                    {formData.recent_job_industries.map((industry, index) => (
                      <div
                        key={index}
                        className="bg-[#d2f1da] px-6 py-[10px] rounded-[10px] flex items-center gap-2.5"
                      >
                        <span className="text-[#0f9058] text-[14px] font-medium tracking-[1.4px]">
                          {industry}
                        </span>
                        <button
                          type="button"
                          onClick={() => {
                            const newIndustries = formData.recent_job_industries.filter((_, i) => i !== index);
                            handleInputChange('recent_job_industries', newIndustries);
                          }}
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
                </div>
              </div>

              {/* Job Type */}
              <div className="flex items-center gap-8">
                <label className="text-[16px] font-bold text-[#323232] tracking-[1.6px] w-32 text-right shrink-0">
                  職種
                </label>
                <div className="flex-1">
                  <button
                    type="button"
                    onClick={() => setModalState({ isOpen: true, targetType: 'jobtype', targetIndex: -2 })}
                    className="px-10 py-[11px] bg-white border border-[#999999] rounded-[32px] text-[16px] text-[#323232] font-bold tracking-[1.6px] mb-4 w-fit"
                  >
                    職種を選択
                  </button>
                  <div className="flex flex-wrap gap-2">
                    {formData.recent_job_types.map((jobType, index) => (
                      <div
                        key={index}
                        className="bg-[#d2f1da] px-6 py-[10px] rounded-[10px] flex items-center gap-2.5"
                      >
                        <span className="text-[#0f9058] text-[14px] font-medium tracking-[1.4px]">
                          {jobType}
                        </span>
                        <button
                          type="button"
                          onClick={() => {
                            const newJobTypes = formData.recent_job_types.filter((_, i) => i !== index);
                            handleInputChange('recent_job_types', newJobTypes);
                          }}
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
                </div>
              </div>
            </div>
          </section>

          {/* 資格・語学・スキル */}
          <section className="mb-12">
            <h3 className="text-xl font-bold text-gray-800 mb-4 pb-2 border-b-2 border-gray-300">
              資格・語学・スキル
            </h3>
            {/* English */}
            <div className="flex items-center gap-8 mb-6">
              <label className="text-sm font-medium text-gray-700 w-32 text-right shrink-0">
                英語
              </label>
              <div className="w-[400px]">
                <div className="relative">
                  <select
                    value={skills.english_level}
                    onChange={(e) => handleSkillsChange('english_level', e.target.value)}
                    className="w-full px-[11px] py-[11px] pr-10 border border-[#999999] rounded-[5px] text-[16px] text-[#323232] font-bold tracking-[1.6px] appearance-none cursor-pointer"
                  >
                    <option value="">レベルを選択</option>
                    <option value="native">ネイティブ</option>
                    <option value="business">ビジネスレベル</option>
                    <option value="conversation">日常会話</option>
                    <option value="basic">基礎会話</option>
                    <option value="none">なし</option>
                  </select>
                  <div className="absolute right-4 top-1/2 -translate-y-1/2 pointer-events-none">
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
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

            {/* Skills Input */}
            <div className="flex items-start gap-8 mb-6">
              <label className="text-sm font-medium text-gray-700 w-32 text-right shrink-0 pt-2">
                スキル
              </label>
              <div className="w-[400px]">
                <textarea
                  placeholder="業務で活かしたスキル・ツール・得意分野を入力してください"
                  className="w-full px-[11px] py-[11px] border border-[#999999] rounded-[5px] text-[16px] text-[#323232] font-medium tracking-[1.6px] placeholder:text-[#999999] min-h-[80px] resize-none"
                />
                <p className="text-[#999999] text-[14px] font-medium tracking-[1.4px] mt-2">
                  ※最低3つ以上のキーワードを選択/登録してください。
                </p>
                {skills.skills_list.length > 0 && (
                  <div className="flex flex-col gap-2 mt-2">
                    {skills.skills_list.map((skill, index) => (
                      <div
                        key={index}
                        className="bg-[#d2f1da] px-6 py-[10px] rounded-[10px] flex items-center gap-2.5 w-fit"
                      >
                        <span className="text-[#0f9058] text-[14px] font-medium tracking-[1.4px]">
                          {skill}
                        </span>
                        <button
                          type="button"
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

            {/* Qualifications */}
            <div className="flex items-start gap-8 mb-6">
              <label className="text-sm font-medium text-gray-700 w-32 text-right shrink-0 pt-2">
                保有資格
              </label>
              <div className="w-[400px]">
                <textarea
                  value={skills.qualifications}
                  onChange={(e) => handleSkillsChange('qualifications', e.target.value)}
                  placeholder="例）TOEIC850点、簿記2級、中小企業診断士など"
                  className="w-full px-[11px] py-[11px] border border-[#999999] rounded-[5px] text-[16px] text-[#323232] font-medium tracking-[1.6px] placeholder:text-[#999999] min-h-[147px] resize-none"
                />
                <p className="text-[#999999] text-[14px] font-medium tracking-[1.4px] mt-2">
                  ※履歴書・職務経歴書をアップロードした場合、記載内容に追記されます。
                </p>
              </div>
            </div>
          </section>

          {/* 職務要約・自己PR */}
          <section className="mb-12">
            <h3 className="text-xl font-bold text-gray-800 mb-4 pb-2 border-b-2 border-gray-300">
              職務要約・自己PR
            </h3>
            {/* 職務要約 */}
            <div className="flex items-start gap-8 mb-6">
              <label className="text-sm font-medium text-gray-700 w-32 text-right shrink-0 pt-2">
                職務要約
              </label>
              <textarea
                value={formData.job_summary}
                onChange={(e) => handleInputChange('job_summary', e.target.value)}
                rows={4}
                className="w-[400px] px-[11px] py-[11px] border border-[#999999] rounded-[5px] text-[16px] text-[#323232] font-medium tracking-[1.6px] placeholder:text-[#999999] resize-none"
                placeholder="職務要約を入力してください"
              />
            </div>

            {/* 自己PR・その他 */}
            <div className="flex items-start gap-8 mb-6">
              <label className="text-sm font-medium text-gray-700 w-32 text-right shrink-0 pt-2">
                自己PR・その他
              </label>
              <textarea
                value={formData.self_pr}
                onChange={(e) => handleInputChange('self_pr', e.target.value)}
                rows={4}
                className="w-[400px] px-[11px] py-[11px] border border-[#999999] rounded-[5px] text-[16px] text-[#323232] font-medium tracking-[1.6px] placeholder:text-[#999999] resize-none"
                placeholder="自己PRやその他の情報を入力してください"
              />
            </div>
          </section>

          {/* Submit Buttons */}
          <div className="flex justify-center gap-4 pt-8">
           
            <AdminButton 
              text={isSubmitting ? "準備中..." : "確認する"}
              variant="green-gradient"
              onClick={handleSubmit}
              disabled={isSubmitting}
            />
          </div>
        </form>
      </div>
    </div>

    {/* Modals */}
    {modalState.isOpen && modalState.targetType === 'industry' && modalState.targetIndex !== null && (
      <IndustrySelectModal
        isOpen={true}
        onClose={() => setModalState({ isOpen: false, targetType: null, targetIndex: null })}
        onConfirm={handleIndustrySelect}
        initialSelected={selectedIndustriesMap[modalState.targetIndex] || []}
      />
    )}

    {modalState.isOpen && modalState.targetType === 'jobtype' && (
      <JobTypeSelectModal
        isOpen={true}
        onClose={() => setModalState({ isOpen: false, targetType: null, targetIndex: null })}
        onConfirm={handleJobTypeConfirm}
        initialSelected={formData.recent_job_types}
      />
    )}

    {modalState.isOpen && modalState.targetType === 'industry' && modalState.targetIndex === null && (
      <IndustrySelectModal
        isOpen={true}
        onClose={() => setModalState({ isOpen: false, targetType: null, targetIndex: null })}
        onConfirm={handleIndustryConfirm}
        initialSelected={formData.recent_job_industries}
      />
    )}
  </>
  );
}