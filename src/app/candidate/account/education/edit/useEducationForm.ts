import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { useState, useMemo } from 'react';
import { educationSchema } from './schemas/education';
import { EducationFormData } from './types/education';

/**
 * 学歴・経験業種/職種編集フォームのロジック・状態管理をまとめたカスタムフック
 * @returns フォーム状態・ハンドラ群
 */
export function useEducationForm() {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isIndustryModalOpen, setIsIndustryModalOpen] = useState(false);
  const [isJobTypeModalOpen, setIsJobTypeModalOpen] = useState(false);

  const {
    register,
    handleSubmit,
    formState: { errors },
    watch,
    setValue,
  } = useForm<EducationFormData>({
    resolver: zodResolver(educationSchema),
    mode: 'onChange',
    defaultValues: {
      finalEducation: '',
      schoolName: '',
      department: '',
      graduationYear: '',
      graduationMonth: '',
      industries: [],
      jobTypes: [],
    },
  });

  const selectedIndustries = watch('industries');
  const selectedJobTypes = watch('jobTypes');

  // 年の選択肢（1970-2025）
  const yearOptions = useMemo(() => {
    const years = [];
    for (let year = 2025; year >= 1970; year--) {
      years.push(year.toString());
    }
    return years;
  }, []);
  // 月の選択肢（1-12）
  const monthOptions = useMemo(
    () => Array.from({ length: 12 }, (_, i) => (i + 1).toString()),
    []
  );

  /** 業種モーダルで選択確定時のハンドラ */
  function handleIndustryConfirm(industries: string[]) {
    const industriesWithExperience = industries.map(industryId => {
      const existing = selectedIndustries.find(i => i.id === industryId);
      return {
        id: industryId,
        name: industryId, // TODO: 本来は業種名を取得
        experienceYears: existing?.experienceYears || '',
      };
    });
    setValue('industries', industriesWithExperience, {
      shouldValidate: true,
      shouldDirty: true,
    });
    setIsIndustryModalOpen(false);
  }

  /** 業種の削除ハンドラ */
  function removeIndustry(industryId: string) {
    const updated = selectedIndustries.filter(i => i.id !== industryId);
    setValue('industries', updated, {
      shouldValidate: true,
      shouldDirty: true,
    });
  }

  /** 業種の経験年数変更ハンドラ */
  function updateIndustryExperience(
    industryId: string,
    experienceYears: string
  ) {
    const updated = selectedIndustries.map(industry =>
      industry.id === industryId ? { ...industry, experienceYears } : industry
    );
    setValue('industries', updated, {
      shouldValidate: true,
      shouldDirty: true,
    });
  }

  /** 職種モーダルで選択確定時のハンドラ */
  function handleJobTypeConfirm(jobTypes: string[]) {
    const jobTypesWithExperience = jobTypes.map(jobTypeId => {
      const existing = selectedJobTypes.find(jt => jt.id === jobTypeId);
      return {
        id: jobTypeId,
        name: jobTypeId, // TODO: 本来は職種名を取得
        experienceYears: existing?.experienceYears || '',
      };
    });
    setValue('jobTypes', jobTypesWithExperience, {
      shouldValidate: true,
      shouldDirty: true,
    });
    setIsJobTypeModalOpen(false);
  }

  /** 職種の削除ハンドラ */
  function removeJobType(jobTypeId: string) {
    const updated = selectedJobTypes.filter(jt => jt.id !== jobTypeId);
    setValue('jobTypes', updated, {
      shouldValidate: true,
      shouldDirty: true,
    });
  }

  /** 職種の経験年数変更ハンドラ */
  function updateJobTypeExperience(jobTypeId: string, experienceYears: string) {
    const updated = selectedJobTypes.map(jobType =>
      jobType.id === jobTypeId ? { ...jobType, experienceYears } : jobType
    );
    setValue('jobTypes', updated, {
      shouldValidate: true,
      shouldDirty: true,
    });
  }

  return {
    register,
    handleSubmit,
    errors,
    watch,
    setValue,
    isSubmitting,
    setIsSubmitting,
    isIndustryModalOpen,
    setIsIndustryModalOpen,
    isJobTypeModalOpen,
    setIsJobTypeModalOpen,
    selectedIndustries,
    selectedJobTypes,
    yearOptions,
    monthOptions,
    handleIndustryConfirm,
    removeIndustry,
    updateIndustryExperience,
    handleJobTypeConfirm,
    removeJobType,
    updateJobTypeExperience,
  };
}
