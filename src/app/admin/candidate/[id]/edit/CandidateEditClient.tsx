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
import { UpdateCandidateData, EducationData, SkillsData, checkEmailDuplication } from './actions';
import IndustrySelectModal from '@/components/career-status/IndustrySelectModal';
import JobTypeSelectModal from '@/components/career-status/JobTypeSelectModal';
import WorkLocationSelectModal from '@/components/career-status/WorkLocationSelectModal';
import WorkStyleSelectModal from '@/components/career-status/WorkStyleSelectModal';
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
  // Job history fields
  startYear?: string;
  startMonth?: string;
  endYear?: string;
  endMonth?: string;
  isCurrentlyWorking?: boolean;
  jobDescription?: string;
  jobTypes?: string[];
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
    targetType: 'industry' | 'jobtype' | 'location' | 'workstyle' | null;
    targetIndex: number | null;
  }>({ isOpen: false, targetType: null, targetIndex: null });
  const [selectedIndustriesMap, setSelectedIndustriesMap] = useState<{
    [key: number]: string[];
  }>({});
  
  // Initialize selectionEntries with existing job history data
  const [selectionEntries, setSelectionEntries] = useState<SelectionEntry[]>([
    {
      id: '1',
      isPrivate: false,
      industries: candidate.work_experience?.map(exp => 
        typeof exp.industry_name === 'object' 
          ? (exp.industry_name.name || exp.industry_name.id || JSON.stringify(exp.industry_name))
          : exp.industry_name
      ).filter(Boolean) || [],
      companyName: candidate.recent_job_company_name || '',
      department: candidate.recent_job_department_position || '',
      progressStatus: '',
      declineReason: '',
      // Job history specific fields
      startYear: candidate.recent_job_start_year || '',
      startMonth: candidate.recent_job_start_month || '',
      endYear: candidate.recent_job_end_year || '',
      endMonth: candidate.recent_job_end_month || '',
      isCurrentlyWorking: candidate.recent_job_is_currently_working || false,
      jobDescription: candidate.recent_job_description || '',
      jobTypes: candidate.job_type_experience?.map(exp => 
        typeof exp.job_type_name === 'object' 
          ? (exp.job_type_name.name || exp.job_type_name.id || JSON.stringify(exp.job_type_name))
          : exp.job_type_name
      ).filter(Boolean) || [],
    },
  ]);

  // Initialize form data with candidate data
  const [formData, setFormData] = useState<UpdateCandidateData>({
    email: candidate.email || '',
    password: '', 
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
    desired_industries: candidate.desired_industries?.map(industry => 
      typeof industry === 'object' 
        ? (industry.name || industry.id || JSON.stringify(industry))
        : industry
    ) || [],
    desired_job_types: candidate.desired_job_types?.map(jobType => 
      typeof jobType === 'object' 
        ? (jobType.name || jobType.id || JSON.stringify(jobType))
        : jobType
    ) || [],
    desired_locations: candidate.desired_locations?.map(location => 
      typeof location === 'object' 
        ? (location.name || location.id || JSON.stringify(location))
        : location
    ) || [],
    desired_work_styles: candidate.interested_work_styles?.map(style => 
      typeof style === 'object' 
        ? (style.name || style.id || JSON.stringify(style))
        : style
    ) || [],
    desired_salary: candidate.desired_salary || '',
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
    other_languages: candidate.skills[0]?.other_languages || [{ language: '', level: '' }],
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

  // Handle language management
  const handleAddLanguage = () => {
    const currentLanguages = skills.other_languages || [];
    if (currentLanguages.length < 5) {
      setSkills(prev => ({ ...prev, other_languages: [...currentLanguages, { language: '', level: '' }] }));
    }
  };

  const handleRemoveLanguage = (index: number) => {
    const currentLanguages = skills.other_languages || [];
    const newLanguages = currentLanguages.filter((_, i) => i !== index);
    setSkills(prev => ({ ...prev, other_languages: newLanguages }));
  };

  const handleLanguageChange = (index: number, field: string, value: string) => {
    const currentLanguages = skills.other_languages || [];
    const newLanguages = [...currentLanguages];
    newLanguages[index] = { ...newLanguages[index], [field]: value };
    setSkills(prev => ({ ...prev, other_languages: newLanguages }));
  };

  // Skill input and management
  const [skillInput, setSkillInput] = useState('');

  const addSkillTag = () => {
    if (skillInput.trim() && !skills.skills_list.includes(skillInput.trim())) {
      setSkills(prev => ({ ...prev, skills_list: [...prev.skills_list, skillInput.trim()] }));
      setSkillInput('');
    }
  };

  const removeSkillTag = (skillToRemove: string) => {
    setSkills(prev => ({ 
      ...prev, 
      skills_list: prev.skills_list.filter(skill => skill !== skillToRemove) 
    }));
  };

  // Handle skill input with Enter key
  const handleSkillInputKeyDown = (e: React.KeyboardEvent<HTMLTextAreaElement>) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      if (skillInput.trim()) {
        addSkillTag();
      }
    }
  };

  // Selection entry helper functions
  const updateSelectionEntry = (index: number, field: string, value: any) => {
    setSelectionEntries(prev => 
      prev.map((entry, i) => 
        i === index ? { ...entry, [field]: value } : entry
      )
    );
  };

  const addSelectionEntry = () => {
    setSelectionEntries(prev => [
      ...prev,
      {
        id: Date.now().toString(),
        isPrivate: false,
        industries: [],
        companyName: '',
        department: '',
        progressStatus: '',
        declineReason: '',
        startYear: '',
        startMonth: '',
        endYear: '',
        endMonth: '',
        isCurrentlyWorking: false,
        jobDescription: '',
        jobTypes: [],
      },
    ]);
  };

  const removeSelectionEntry = (index: number) => {
    if (selectionEntries.length > 1) {
      setSelectionEntries(prev => prev.filter((_, i) => i !== index));
    }
  };

  const openIndustryModal = (targetIndex: number) => {
    setModalState({ isOpen: true, targetType: 'industry', targetIndex });
  };

  const openJobTypeModal = (targetIndex: number) => {
    setModalState({ isOpen: true, targetType: 'jobtype', targetIndex });
  };

  const getModalInitialData = (modalType: 'industry' | 'jobtype' | 'location' | 'workstyle', targetIndex: number) => {
    if (modalType === 'industry') {
      if (targetIndex === -1 || targetIndex === -2) {
        return formData.recent_job_industries;
      } else if (targetIndex === -3) {
        return formData.desired_industries || [];
      } else if (targetIndex >= 1000 && targetIndex < 2000) {
        const entryIndex = targetIndex - 1000;
        return selectionEntries[entryIndex]?.industries || [];
      } else if (targetIndex >= 0 && targetIndex < selectionEntries.length) {
        return selectedIndustriesMap[targetIndex] || [];
      }
    } else if (modalType === 'jobtype') {
      if (targetIndex === -1 || targetIndex === -2) {
        return formData.recent_job_types;
      } else if (targetIndex === -3) {
        return formData.desired_job_types || [];
      } else if (targetIndex >= 2000) {
        const entryIndex = targetIndex - 2000;
        return selectionEntries[entryIndex]?.jobTypes || [];
      }
    } else if (modalType === 'location') {
      if (targetIndex === -3) {
        return (formData.desired_locations || []).map(location => ({
          id: location.toLowerCase().replace(/[^a-z0-9]/g, ''),
          name: location
        }));
      }
    } else if (modalType === 'workstyle') {
      if (targetIndex === -4) {
        return (formData.desired_work_styles || []).map(style => ({
          id: style.toLowerCase().replace(/[^a-z0-9]/g, ''),
          name: style
        }));
      }
    }
    return [];
  };

  const closeModal = () => {
    setModalState({ isOpen: false, targetType: null, targetIndex: null });
  };

  const handleIndustryConfirm = (selectedIndustries: string[]) => {
    const { targetIndex } = modalState;
    
    if (targetIndex !== null) {
      if (targetIndex === -1 || targetIndex === -2) {
        handleInputChange('recent_job_industries', selectedIndustries);
      } else if (targetIndex === -3) {
        handleInputChange('desired_industries', selectedIndustries);
      } else if (targetIndex >= 1000 && targetIndex < 2000) {
        const entryIndex = targetIndex - 1000;
        updateSelectionEntry(entryIndex, 'industries', selectedIndustries);
      } else {
        const newMap = { ...selectedIndustriesMap };
        newMap[targetIndex] = selectedIndustries;
        setSelectedIndustriesMap(newMap);
      }
    }
    setModalState({ isOpen: false, targetType: null, targetIndex: null });
  };

  const handleJobTypeConfirm = (selectedJobTypes: string[]) => {
    const { targetIndex } = modalState;
    
    if (targetIndex !== null) {
      if (targetIndex === -1 || targetIndex === -2) {
        handleInputChange('recent_job_types', selectedJobTypes);
      } else if (targetIndex === -3) {
        handleInputChange('desired_job_types', selectedJobTypes);
      } else if (targetIndex >= 2000) {
        const entryIndex = targetIndex - 2000;
        updateSelectionEntry(entryIndex, 'jobTypes', selectedJobTypes);
      }
    }
    setModalState({ isOpen: false, targetType: null, targetIndex: null });
  };

  const handleLocationConfirm = (selectedLocations: { id: string; name: string }[]) => {
    const { targetIndex } = modalState;
    
    if (targetIndex !== null) {
      if (targetIndex === -3) {
        const locationNames = selectedLocations.map(loc => loc.name);
        handleInputChange('desired_locations', locationNames);
      }
    }
    setModalState({ isOpen: false, targetType: null, targetIndex: null });
  };

  const handleWorkStyleConfirm = (selectedWorkStyles: { id: string; name: string }[]) => {
    const { targetIndex } = modalState;
    
    if (targetIndex !== null) {
      if (targetIndex === -4) {
        const workStyleNames = selectedWorkStyles.map(style => style.name);
        handleInputChange('desired_work_styles', workStyleNames);
      }
    }
    setModalState({ isOpen: false, targetType: null, targetIndex: null });
  };

  // Validation function
  const validateForm = async () => {
    const errors: string[] = [];
    
    // Email validation
    if (!formData.email) {
      errors.push('メールアドレスを入力してください。');
    } else {
      const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
      if (!emailRegex.test(formData.email)) {
        errors.push('メールアドレスの形式が正しくありません。');
      } else {
        try {
          const result = await checkEmailDuplication(formData.email, candidate.id);
          if (result.isDuplicate) {
            errors.push('このメールアドレスはすでに登録されています。');
          }
        } catch (error) {
          console.error('Email duplication check failed:', error);
        }
      }
    }

    if (!formData.last_name) {
      errors.push('姓を入力してください');
    }
    if (!formData.first_name) {
      errors.push('名を入力してください');
    }
    if (!formData.last_name_kana) {
      errors.push('セイを入力してください');
    }
    if (!formData.first_name_kana) {
      errors.push('メイを入力してください');
    }

    // Phone validation
    if (formData.phone_number) {
      const phone = formData.phone_number;
      if (phone.includes('-')) {
        errors.push('「-」なしで入力してください');
      } else if (!/^[0-9]+$/.test(phone)) {
        errors.push('数字のみで入力してください');
      } else if (phone.length !== 10 && phone.length !== 11) {
        errors.push('10桁または11桁で入力してください');
      }
    }

    return { isValid: errors.length === 0, errors };
  };

  const handleSubmit = async () => {
    if (isSubmitting) return;
    
    const validation = await validateForm();
    if (!validation.isValid) {
      alert(validation.errors.join('\n'));
      return;
    }
    
    setIsSubmitting(true);
    
    try {
      const confirmData = {
        updateData: formData,
        education,
        skills,
        selectionEntries,
        memo,
        workExperience: candidate.work_experience || [],
        jobTypeExperience: candidate.job_type_experience || [],
        expectations: {
          desired_income: formData.desired_salary || null,
          desired_industries: formData.desired_industries || null,
          desired_job_types: formData.desired_job_types || null,
          desired_work_locations: formData.desired_locations || null,
          desired_work_styles: formData.desired_work_styles || null,
        },
        jobHistoryEntries: selectionEntries
      };

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

  // Parse birth date components
  const birthYear = formData.birth_date ? formData.birth_date.split('-')[0] : '';
  const birthMonth = formData.birth_date ? formData.birth_date.split('-')[1] : '';
  const birthDay = formData.birth_date ? formData.birth_date.split('-')[2] : '';

  return (
    <>
      <div className="min-h-screen">
        {/* スカウト統計表示部分は省略 */}
        
        <div className="p-8">
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
      {modalState.isOpen && modalState.targetType === 'industry' && (
        <IndustrySelectModal
          isOpen={true}
          onClose={closeModal}
          onConfirm={handleIndustryConfirm}
          initialSelected={getModalInitialData('industry', modalState.targetIndex || 0)}
        />
      )}

      {modalState.isOpen && modalState.targetType === 'jobtype' && (
        <JobTypeSelectModal
          isOpen={true}
          onClose={closeModal}
          onConfirm={handleJobTypeConfirm}
          initialSelected={getModalInitialData('jobtype', modalState.targetIndex || 0)}
        />
      )}

      {modalState.isOpen && modalState.targetType === 'location' && (
        <WorkLocationSelectModal
          isOpen={true}
          onClose={closeModal}
          onConfirm={handleLocationConfirm}
          initialSelected={getModalInitialData('location', modalState.targetIndex || 0)}
        />
      )}

      {modalState.isOpen && modalState.targetType === 'workstyle' && (
        <WorkStyleSelectModal
          isOpen={true}
          onClose={closeModal}
          onConfirm={handleWorkStyleConfirm}
          initialSelected={getModalInitialData('workstyle', modalState.targetIndex || 0)}
        />
      )}
    </>
  );
}