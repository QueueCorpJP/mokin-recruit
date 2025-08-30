'use client';

import { useMediaQuery } from '@/hooks/useMediaQuery';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { profileSchema, type ProfileFormData } from '@/lib/schema/profile';
import {
  generateYearOptions,
  generateMonthOptions,
  generateDayOptions,
} from '@/constants/profile';
import { updateCandidateProfile, type ActionState } from './actions';
import { useRef, useEffect } from 'react';
import { useActionState } from 'react';
import ProfileEditDesktop from './ProfileEditDesktop';
import ProfileEditMobile from './ProfileEditMobile';
import { useRouter } from 'next/navigation';

const initialState: ActionState = { success: false, message: '', errors: undefined };

function ProfileEditClientWrapper({ profile }: { profile: ProfileFormData }) {
  const isDesktop = useMediaQuery('(min-width: 1024px)');
  const formRef = useRef<HTMLFormElement>(null);
  const [state, formAction] = useActionState(
    updateCandidateProfile,
    initialState
  );
  const router = useRouter();
  const {
    register,
    formState: { errors },
    watch,
    setValue,
  } = useForm<ProfileFormData>({
    resolver: zodResolver(profileSchema),
    mode: 'onChange',
    reValidateMode: 'onChange',
    defaultValues: profile,
  });
  const selectedGender = watch('gender');
  const selectedYear = watch('birthYear');
  const selectedMonth = watch('birthMonth');
  const yearOptions = generateYearOptions();
  const monthOptions = generateMonthOptions();
  const dayOptions = generateDayOptions(selectedYear, selectedMonth);
  const isSubmitting = false;
  const handleCancel = () => {
    window.history.back();
  };

  useEffect(() => {
    // デバッグ用: formActionの型・値を出力
    console.log('formAction:', formAction);
    // 保存成功時にprofileページへ遷移
    if (state.success) {
      router.push('/candidate/account/profile');
    }
  }, [formAction, state.success, router]);

  const formProps = {
    ref: formRef,
    action: formAction,
  };

  const commonProps = {
    profile,
    watch,
    errors,
    register,
    setValue,
    isSubmitting,
    handleCancel,
    yearOptions,
    monthOptions,
    dayOptions,
    selectedGender,
    selectedYear,
    selectedMonth,
  };

  return (
    <>
      {state.message && (
        <div
          style={{ color: state.success ? 'green' : 'red', marginBottom: 16 }}
        >
          {state.message}
        </div>
      )}
      <form {...formProps}>
        {isDesktop ? (
          <ProfileEditDesktop {...commonProps} />
        ) : (
          <ProfileEditMobile {...commonProps} />
        )}
        {/* デバッグ用: 保存ボタンtype出力 */}
        <script
          dangerouslySetInnerHTML={{
            __html: `console.log('保存ボタンtype: submit');`,
          }}
        />
      </form>
    </>
  );
}

export default ProfileEditClientWrapper;
