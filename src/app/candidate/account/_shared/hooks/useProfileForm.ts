import { useMemo, useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { useRouter } from 'next/navigation';
import { profileSchema, ProfileFormData } from '../schemas/profileSchema';
import { updateCandidateProfile } from '../../profile/edit/actions';
import {
  generateDayOptions,
  generateMonthOptions,
  generateYearOptions,
} from '@/constants/profile';

// CandidateData型（ProfileEditFormから移植）
export interface CandidateData {
  last_name?: string;
  first_name?: string;
  last_name_kana?: string;
  first_name_kana?: string;
  gender?: string;
  prefecture?: string;
  birth_date?: string;
  phone_number?: string;
  current_income?: string;
}

/**
 * プロフィール編集フォーム用の共通カスタムフック
 * - useFormの初期化、バリデーション、初期値セット、onSubmit、キャンセル、状態管理をまとめる
 * @param candidateData 初期データ
 */
// UI用に氏名系フィールドも許容するフォーム型（サーバー送信には含めない）
type ProfileFormUiFields = ProfileFormData & {
  lastName?: string;
  firstName?: string;
  lastNameKana?: string;
  firstNameKana?: string;
};

export function useProfileForm(candidateData: CandidateData) {
  const router = useRouter();
  const [isSubmitting, setIsSubmitting] = useState(false);

  // 生年月日の初期値を計算
  const getInitialBirthDate = () => {
    if (!candidateData.birth_date) {
      return { year: '', month: '', day: '' };
    }
    const date = new Date(candidateData.birth_date);
    return {
      year: date.getFullYear().toString(),
      month: (date.getMonth() + 1).toString(),
      day: date.getDate().toString(),
    };
  };
  const initialBirthDate = getInitialBirthDate();

  // 性別・生年月日の選択状態管理
  const [selectedYearState, setSelectedYearState] = useState(
    initialBirthDate.year
  );
  const [selectedMonthState, setSelectedMonthState] = useState(
    initialBirthDate.month
  );
  const [selectedGenderState, setSelectedGenderState] = useState(
    candidateData.gender || ''
  );

  // useForm初期化
  const {
    register,
    handleSubmit,
    formState: { errors },
    setValue,
    watch,
    reset,
  } = useForm<ProfileFormUiFields>({
    resolver: zodResolver(profileSchema),
    defaultValues: {
      gender: candidateData.gender || '',
      prefecture: candidateData.prefecture || '',
      birthYear: initialBirthDate.year,
      birthMonth: initialBirthDate.month,
      birthDay: initialBirthDate.day,
      phoneNumber: candidateData.phone_number || '',
      currentIncome: candidateData.current_income || '',
      // 表示専用（読み取り）
      lastName: (candidateData as any).last_name || '',
      firstName: (candidateData as any).first_name || '',
      lastNameKana: (candidateData as any).last_name_kana || '',
      firstNameKana: (candidateData as any).first_name_kana || '',
    },
  });

  // RHF とローカル state の同期用 setter を提供
  const setSelectedGender = (value: string) => {
    setSelectedGenderState(value);
    setValue('gender', value, { shouldValidate: true, shouldDirty: true });
  };
  const setSelectedYear = (value: string) => {
    setSelectedYearState(value);
    setValue('birthYear', value, { shouldValidate: true, shouldDirty: true });
  };
  const setSelectedMonth = (value: string) => {
    setSelectedMonthState(value);
    setValue('birthMonth', value, { shouldValidate: true, shouldDirty: true });
  };

  // 年月日の選択肢（既存PC/SP実装で参照されているため後方互換で提供）
  const yearOptions = useMemo(() => generateYearOptions(), []);
  const monthOptions = useMemo(() => generateMonthOptions(), []);
  const dayOptions = useMemo(
    () =>
      generateDayOptions(watch('birthYear') || '', watch('birthMonth') || ''),
    [watch('birthYear'), watch('birthMonth')]
  );

  // フォーム送信ハンドラ
  const handleSubmitForm = async (formData: ProfileFormUiFields) => {
    setIsSubmitting(true);
    try {
      const initialState = { success: false, message: '', errors: {} };
      // FormData に詰め替え（サーバーアクションの共通ユーティリティ前提）
      const fd = new FormData();
      fd.append('gender', formData.gender || '');
      fd.append('prefecture', formData.prefecture || '');
      fd.append('birthYear', formData.birthYear || '');
      fd.append('birthMonth', formData.birthMonth || '');
      fd.append('birthDay', formData.birthDay || '');
      fd.append('phoneNumber', formData.phoneNumber || '');
      fd.append('currentIncome', formData.currentIncome || '');

      const result = await updateCandidateProfile(initialState, fd);
      if (result.success) {
        router.push('/candidate/account/profile');
      } else {
        setIsSubmitting(false);
      }
    } catch (error) {
      setIsSubmitting(false);
    }
  };

  // キャンセルボタン押下時
  const handleCancel = () => {
    router.back();
  };

  // 必要な値・関数をまとめて返す
  return {
    register,
    handleSubmit,
    errors,
    setValue,
    watch,
    selectedYear: selectedYearState,
    setSelectedYear,
    selectedMonth: selectedMonthState,
    setSelectedMonth,
    selectedGender: selectedGenderState,
    setSelectedGender,
    yearOptions,
    monthOptions,
    dayOptions,
    isSubmitting,
    handleSubmitForm,
    handleCancel,
  };
}
