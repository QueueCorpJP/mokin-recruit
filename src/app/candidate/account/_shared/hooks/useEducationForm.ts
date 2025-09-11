import { useState, useMemo } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { useRouter } from 'next/navigation';
import { educationSchema, EducationFormData } from '../schemas/educationSchema';

export function useEducationForm(initialData?: Partial<EducationFormData>) {
  const router = useRouter();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isIndustryModalOpen, setIsIndustryModalOpen] = useState(false);
  const [isJobTypeModalOpen, setIsJobTypeModalOpen] = useState(false);

  // useForm初期化
  const {
    register,
    handleSubmit,
    formState: { errors, isValid },
    watch,
    setValue,
  } = useForm<EducationFormData>({
    resolver: zodResolver(educationSchema),
    mode: 'onChange',
    defaultValues: initialData || {
      finalEducation: '',
      schoolName: '',
      department: '',
      graduationYear: '',
      graduationMonth: '',
      industries: [],
      jobTypes: [],
    },
  });

  // 年の選択肢（1970年〜2025年）
  const yearOptions = useMemo(() => {
    const years = [];
    for (let year = 2025; year >= 1970; year--) {
      years.push(year.toString());
    }
    return years;
  }, []);
  // 月の選択肢（1〜12月）
  const monthOptions = Array.from({ length: 12 }, (_, i) => (i + 1).toString());

  // 選択中の業種・職種
  const selectedIndustries = watch('industries');
  const selectedJobTypes = watch('jobTypes');

  // フォーム送信ハンドラ
  const onSubmit = async (data: EducationFormData) => {
    setIsSubmitting(true);
    try {
      // TODO: API保存処理
      router.push('/account/education');
    } catch {
      setIsSubmitting(false);
    }
  };

  // キャンセル
  const handleCancel = () => {
    router.back();
  };

  // モーダル管理
  const handleIndustryConfirm = (industries: string[]) => {
    const industriesWithExperience = industries.map(industryId => {
      const existing = selectedIndustries.find(i => i.id === industryId);
      return {
        id: industryId,
        name: industryId, // TODO: industryデータから名前取得
        experienceYears: existing?.experienceYears || '',
      };
    });
    setValue('industries', industriesWithExperience, {
      shouldValidate: true,
      shouldDirty: true,
    });
    setIsIndustryModalOpen(false);
  };
  const handleJobTypeConfirm = (jobTypes: string[]) => {
    const jobTypesWithExperience = jobTypes.map(jobTypeId => {
      const existing = selectedJobTypes.find(jt => jt.id === jobTypeId);
      return {
        id: jobTypeId,
        name: jobTypeId, // TODO: jobTypeデータから名前取得
        experienceYears: existing?.experienceYears || '',
      };
    });
    setValue('jobTypes', jobTypesWithExperience, {
      shouldValidate: true,
      shouldDirty: true,
    });
    setIsJobTypeModalOpen(false);
  };

  // 業種・職種の削除・経験年数更新
  const removeIndustry = (industryId: string) => {
    const updated = selectedIndustries.filter(i => i.id !== industryId);
    setValue('industries', updated, {
      shouldValidate: true,
      shouldDirty: true,
    });
  };
  const updateIndustryExperience = (
    industryId: string,
    experienceYears: string
  ) => {
    const updated = selectedIndustries.map(industry =>
      industry.id === industryId ? { ...industry, experienceYears } : industry
    );
    setValue('industries', updated, {
      shouldValidate: true,
      shouldDirty: true,
    });
  };
  const removeJobType = (jobTypeId: string) => {
    const updated = selectedJobTypes.filter(jt => jt.id !== jobTypeId);
    setValue('jobTypes', updated, { shouldValidate: true, shouldDirty: true });
  };
  const updateJobTypeExperience = (
    jobTypeId: string,
    experienceYears: string
  ) => {
    const updated = selectedJobTypes.map(jobType =>
      jobType.id === jobTypeId ? { ...jobType, experienceYears } : jobType
    );
    setValue('jobTypes', updated, { shouldValidate: true, shouldDirty: true });
  };

  return {
    register,
    handleSubmit,
    errors,
    isValid,
    watch,
    setValue,
    isSubmitting,
    handleCancel,
    yearOptions,
    monthOptions,
    selectedIndustries,
    selectedJobTypes,
    isIndustryModalOpen,
    setIsIndustryModalOpen,
    isJobTypeModalOpen,
    setIsJobTypeModalOpen,
    handleIndustryConfirm,
    handleJobTypeConfirm,
    removeIndustry,
    updateIndustryExperience,
    removeJobType,
    updateJobTypeExperience,
    onSubmit,
  };
}
