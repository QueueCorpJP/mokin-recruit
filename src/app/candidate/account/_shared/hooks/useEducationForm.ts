import { useState, useMemo, useEffect } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { useRouter } from 'next/navigation';
import { educationSchema, EducationFormData } from '../schemas/educationSchema';
import {
  getEducationData,
  updateEducationData,
} from '../../education/edit/actions';
import { useModal } from './useModal';

export function useEducationForm(initialData?: Partial<EducationFormData>) {
  const router = useRouter();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const industryModal = useModal(false);
  const jobTypeModal = useModal(false);

  // useForm初期化
  const {
    register,
    handleSubmit,
    formState: { errors, isValid },
    watch,
    setValue,
    reset,
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

  // 初期データ取得
  useEffect(() => {
    const initialize = async () => {
      try {
        const data = await getEducationData();
        if (data) {
          // actions 側のキー名からフォーム側へ合わせる
          const mapped: Partial<EducationFormData> = {
            finalEducation: (data as any).finalEducation || '',
            schoolName: (data as any).schoolName || '',
            department: (data as any).department || '',
            graduationYear: (data as any).graduationYear || '',
            graduationMonth: (data as any).graduationMonth || '',
            industries: (data as any).industries || [],
            jobTypes: (data as any).jobTypes || [],
          };
          reset({
            finalEducation: mapped.finalEducation || '',
            schoolName: mapped.schoolName || '',
            department: mapped.department || '',
            graduationYear: mapped.graduationYear || '',
            graduationMonth: mapped.graduationMonth || '',
            industries: mapped.industries || [],
            jobTypes: mapped.jobTypes || [],
          });
        }
      } finally {
        setIsLoading(false);
      }
    };

    initialize();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

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
      const formData = new FormData();
      formData.append('finalEducation', data.finalEducation || '');
      formData.append('schoolName', data.schoolName || '');
      formData.append('department', data.department || '');
      formData.append('graduationYear', data.graduationYear || '');
      formData.append('graduationMonth', data.graduationMonth || '');
      formData.append('industries', JSON.stringify(data.industries || []));
      formData.append('jobTypes', JSON.stringify(data.jobTypes || []));

      const result = await updateEducationData(formData);
      if (result.success) {
        router.push('/candidate/account/education');
      } else {
        setIsSubmitting(false);
      }
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
    industryModal.close();
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
    jobTypeModal.close();
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
    isLoading,
    handleCancel,
    yearOptions,
    monthOptions,
    selectedIndustries,
    selectedJobTypes,
    isIndustryModalOpen: industryModal.isOpen,
    setIsIndustryModalOpen: (open: boolean) =>
      open ? industryModal.open() : industryModal.close(),
    isJobTypeModalOpen: jobTypeModal.isOpen,
    setIsJobTypeModalOpen: (open: boolean) =>
      open ? jobTypeModal.open() : jobTypeModal.close(),
    handleIndustryConfirm,
    handleJobTypeConfirm,
    removeIndustry,
    updateIndustryExperience,
    removeJobType,
    updateJobTypeExperience,
    onSubmit,
  };
}
