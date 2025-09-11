//
import NameField from './fields/NameField';
import FuriganaField from './fields/FuriganaField';
import GenderSelector from './fields/GenderSelector';
import PrefectureSelect from './fields/PrefectureSelect';
import BirthDateSelector from './fields/BirthDateSelector';
import PhoneNumberInput from './fields/PhoneNumberInput';
import IncomeSelect from './fields/IncomeSelect';
import {
  GENDER_OPTIONS,
  PREFECTURES,
  INCOME_RANGES,
} from '@/constants/profile';
import React from 'react';
import ProfileDescription from './ProfileDescription';
import ActionButtons from '../../_shared/ui/ActionButtons';
import ProfileIcon from './ProfileIcon';
import { type ProfileFormData } from '@/lib/schema/profile';
import { useProfileForm } from '../../_shared/hooks/useProfileForm';

interface ProfileEditDesktopProps {
  profile: ProfileFormData;
}

const ProfileEditDesktop: React.FC<ProfileEditDesktopProps> = ({ profile }) => {
  const {
    register,
    watch,
    errors,
    setValue,
    isSubmitting,
    handleCancel,
    yearOptions,
    monthOptions,
    dayOptions,
    selectedGender,
    selectedYear,
    selectedMonth,
  } = useProfileForm(profile);

  const yearOptionObjects = yearOptions.map((y: string) => ({
    value: y,
    label: y,
  }));
  const monthOptionObjects = monthOptions.map((m: string) => ({
    value: m,
    label: m,
  }));
  const dayOptionObjects = dayOptions.map((d: string) => ({
    value: d,
    label: d,
  }));

  return (
    <main className='flex flex-col'>
      {/* Hero Section with Gradient */}
      <div className='bg-gradient-to-b from-[#229a4e] to-[#17856f] px-20 py-10'>
        {/* Breadcrumb */}
        <div className='flex items-center gap-2 mb-4'>
          <span className='text-white text-[14px] font-bold tracking-[1.4px]'>
            プロフィール確認・編集
          </span>
          <svg width='8' height='14' viewBox='0 0 8 14' fill='none'>
            <path d='M1 1L7 7L1 13' stroke='#FFFFFF' strokeWidth='2' />
          </svg>
          <span className='text-white text-[14px] font-bold tracking-[1.4px]'>
            基本情報
          </span>
        </div>
        {/* Title */}
        <div className='flex items-center gap-2 lg:gap-4'>
          <div className='w-6 h-6 lg:w-8 lg:h-8'>
            <ProfileIcon />
          </div>
          <h1 className='text-white text-[20px] lg:text-[24px] font-bold tracking-[2px] lg:tracking-[2.4px]'>
            基本情報
          </h1>
        </div>
      </div>
      {/* Form Content */}
      <div className='bg-[#f9f9f9] px-20 py-10 flex flex-col items-center gap-10 min-h-[730px]'>
        <div className='bg-white rounded-[40px] shadow-[0px_0px_20px_0px_rgba(0,0,0,0.05)] p-10 w-[728px]'>
          {/* Description */}
          <ProfileDescription />
          {/* Form Fields */}
          <div className='flex flex-col gap-2'>
            <NameField
              lastName={profile.lastName}
              firstName={profile.firstName}
            />
            <FuriganaField
              lastNameKana={profile.lastNameKana}
              firstNameKana={profile.firstNameKana}
            />
            <GenderSelector
              selectedGender={selectedGender}
              options={GENDER_OPTIONS as any}
              onSelect={value =>
                setValue('gender', value, {
                  shouldValidate: true,
                  shouldDirty: true,
                })
              }
              register={register}
              errors={errors}
            />
            <PrefectureSelect
              selectedPrefecture={watch('prefecture')}
              options={PREFECTURES as any}
              onChange={value =>
                setValue('prefecture', value, {
                  shouldValidate: true,
                  shouldDirty: true,
                })
              }
              register={register}
              errors={errors}
            />
            <BirthDateSelector
              selectedYear={selectedYear}
              selectedMonth={selectedMonth}
              selectedDay={watch('birthDay') || ''}
              yearOptions={yearOptionObjects}
              monthOptions={monthOptionObjects}
              dayOptions={dayOptionObjects}
              onChange={(field, value) =>
                setValue(field, value, {
                  shouldValidate: true,
                  shouldDirty: true,
                })
              }
              register={register}
              errors={errors}
            />
            <PhoneNumberInput
              phoneNumber={watch('phoneNumber') || ''}
              onChange={value =>
                setValue('phoneNumber', value, {
                  shouldValidate: true,
                  shouldDirty: true,
                })
              }
              register={register}
              errors={errors}
            />
            <IncomeSelect
              selectedIncome={watch('currentIncome') || ''}
              options={INCOME_RANGES as any}
              onChange={value =>
                setValue('currentIncome', value, {
                  shouldValidate: true,
                  shouldDirty: true,
                })
              }
              register={register}
              errors={errors}
            />
          </div>
        </div>
        {/* Action Buttons - Outside the white card */}
        <ActionButtons
          isSubmitting={isSubmitting}
          handleCancel={handleCancel}
          isMobile={false}
        />
      </div>
    </main>
  );
};

export default ProfileEditDesktop;
