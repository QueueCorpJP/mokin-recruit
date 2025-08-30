import { Button } from '@/components/ui/button';
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
  generateDayOptions,
  generateMonthOptions,
  generateYearOptions,
} from '@/constants/profile';
import React from 'react';
import ProfileDescription from './ProfileDescription';
import ProfileActionButtons from './ProfileActionButtons';
import ProfileIcon from './ProfileIcon';
import { type ProfileFormData } from '@/lib/schema/profile';

interface ProfileEditDesktopProps {
  profile: ProfileFormData;
  watch: any;
  errors: any;
  register: any;
  setValue: any;
  isSubmitting: boolean;
  handleCancel: () => void;
  yearOptions: any;
  monthOptions: any;
  dayOptions: any;
  selectedGender: any;
  selectedYear: any;
  selectedMonth: any;
}

const ProfileEditDesktop: React.FC<ProfileEditDesktopProps> = ({
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
}) => (
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
            lastName={watch('lastName')}
            firstName={watch('firstName')}
          />
          <FuriganaField
            lastNameKana={watch('lastNameKana')}
            firstNameKana={watch('firstNameKana')}
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
            selectedDay={watch('birthDay')}
            yearOptions={yearOptions}
            monthOptions={monthOptions}
            dayOptions={dayOptions}
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
            phoneNumber={watch('phoneNumber')}
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
            selectedIncome={watch('currentIncome')}
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
      <ProfileActionButtons
        isSubmitting={isSubmitting}
        handleCancel={handleCancel}
      />
    </div>
  </main>
);

export default ProfileEditDesktop;
