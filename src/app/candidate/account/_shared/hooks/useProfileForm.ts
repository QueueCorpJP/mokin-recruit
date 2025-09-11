import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { useRouter } from 'next/navigation';
import { profileSchema, ProfileFormData } from '../schemas/profileSchema';
import { updateCandidateProfile } from '../../profile/edit/actions';

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
  const [selectedYear, setSelectedYear] = useState(initialBirthDate.year);
  const [selectedMonth, setSelectedMonth] = useState(initialBirthDate.month);
  const [selectedGender, setSelectedGender] = useState(
    candidateData.gender || ''
  );

  // useForm初期化
  const {
    register,
    handleSubmit,
    formState: { errors },
    setValue,
    watch,
  } = useForm<ProfileFormData>({
    resolver: zodResolver(profileSchema),
    defaultValues: {
      gender: candidateData.gender || '',
      prefecture: candidateData.prefecture || '',
      birthYear: initialBirthDate.year,
      birthMonth: initialBirthDate.month,
      birthDay: initialBirthDate.day,
      phoneNumber: candidateData.phone_number || '',
      currentIncome: candidateData.current_income || '',
    },
  });

  // フォーム送信ハンドラ
  const handleSubmitForm = async (formData: ProfileFormData) => {
    setIsSubmitting(true);
    try {
      const initialState = { success: false, message: '', errors: undefined };
      const result = await updateCandidateProfile(initialState, formData);
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
    selectedYear,
    setSelectedYear,
    selectedMonth,
    setSelectedMonth,
    selectedGender,
    setSelectedGender,
    isSubmitting,
    handleSubmitForm,
    handleCancel,
  };
}
