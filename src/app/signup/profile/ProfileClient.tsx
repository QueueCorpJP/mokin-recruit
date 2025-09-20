'use client';

import {
  GENDER_OPTIONS,
  INCOME_RANGES,
  PREFECTURES,
  generateDayOptions,
  generateMonthOptions,
  generateYearOptions,
} from '@/constants/profile';
import { type ProfileFormData } from '@/lib/schema/profile';
import CryptoJS from 'crypto-js';
import { useRouter } from 'next/navigation';
import { useState, useEffect } from 'react';
import React from 'react';
import { saveProfileData } from './actions';
import { Button } from '@/components/ui/button';
import { SelectInput } from '@/components/ui/select-input';

function encryptData(data: object, secret: string): string {
  // AES encrypt the JSON stringified data.
  return CryptoJS.AES.encrypt(JSON.stringify(data), secret).toString();
}

export default function SignupProfilePage() {
  const router = useRouter();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [userId, setUserId] = useState('');
  const [validationErrors, setValidationErrors] = useState({
    lastNameKana: '',
    firstNameKana: '',
    phoneNumber: '',
  });
  const [formData, setFormData] = useState<ProfileFormData>({
    gender: '未回答',
    lastName: '',
    firstName: '',
    lastNameKana: '',
    firstNameKana: '',
    prefecture: '',
    birthYear: '',
    birthMonth: '',
    birthDay: '',
    phoneNumber: '',
    currentIncome: '',
  });

  const validateKatakana = (value: string): string => {
    if (!value) return '';
    const katakanaRegex = /^[ァ-ヶー\s]+$/;
    if (!katakanaRegex.test(value)) {
      return '全角カタカナで入力してください';
    }
    return '';
  };

  const validatePhoneNumber = (value: string): string => {
    if (!value) return '';

    // ハイフンが含まれているかチェック
    if (value.includes('-')) {
      return '「-」なしで入力してください';
    }

    // 数字のみかチェック
    const numbersOnlyRegex = /^[0-9]+$/;
    if (!numbersOnlyRegex.test(value)) {
      return '数字のみで入力してください';
    }

    // 桁数チェック（10桁または11桁）
    if (value.length !== 10 && value.length !== 11) {
      return '10桁または11桁で入力してください';
    }

    return '';
  };

  const handleKanaChange = (
    field: 'lastNameKana' | 'firstNameKana',
    value: string
  ) => {
    setFormData(prev => ({ ...prev, [field]: value }));
    const error = validateKatakana(value);
    setValidationErrors(prev => ({ ...prev, [field]: error }));
  };

  const handlePhoneNumberChange = (value: string) => {
    setFormData(prev => ({ ...prev, phoneNumber: value }));
    const error = validatePhoneNumber(value);
    setValidationErrors(prev => ({ ...prev, phoneNumber: error }));
  };

  useEffect(() => {
    if (typeof window !== 'undefined') {
      const getCookieValue = (name: string) => {
        const value = `; ${document.cookie}`;
        const parts = value.split(`; ${name}=`);
        if (parts.length === 2) return parts.pop()?.split(';').shift();
        return null;
      };

      const userIdFromCookie = getCookieValue('signup_user_id');
      console.log('Cookie signup_user_id:', userIdFromCookie);

      if (userIdFromCookie) {
        setUserId(userIdFromCookie);
        // Also save to localStorage to ensure synchronization
        localStorage.setItem('signup_user_id', userIdFromCookie);
        console.log(
          'User ID synchronized from cookie to localStorage:',
          userIdFromCookie
        );
      } else {
        // Try to get from localStorage if cookie not found
        const userIdFromLocalStorage = localStorage.getItem('signup_user_id');
        if (userIdFromLocalStorage) {
          setUserId(userIdFromLocalStorage);
          console.log('User ID from localStorage:', userIdFromLocalStorage);
        }
      }
    }

    return () => {};
  }, []);

  const currentYear = new Date().getFullYear();
  const minimumBirthYear = currentYear - 18;
  const yearOptions = ['未選択', ...generateYearOptions()];
  const monthOptions = ['未選択', ...generateMonthOptions()];
  const dayOptions = [
    '未選択',
    ...generateDayOptions(formData.birthYear, formData.birthMonth),
  ];

  const handleFormSubmit = async () => {
    console.log('Form submitted with data:', formData);
    console.log('User ID:', userId);

    // フリガナのバリデーション
    const lastNameKanaError = validateKatakana(formData.lastNameKana);
    const firstNameKanaError = validateKatakana(formData.firstNameKana);
    const phoneNumberError = validatePhoneNumber(formData.phoneNumber);

    if (lastNameKanaError || firstNameKanaError || phoneNumberError) {
      setValidationErrors({
        lastNameKana: lastNameKanaError,
        firstNameKana: firstNameKanaError,
        phoneNumber: phoneNumberError,
      });

      if (lastNameKanaError || firstNameKanaError) {
        alert('フリガナは全角カタカナで入力してください');
      } else if (phoneNumberError) {
        alert(phoneNumberError);
      }
      return;
    }

    const year = parseInt(formData.birthYear);
    const month = parseInt(formData.birthMonth);
    const day = parseInt(formData.birthDay);
    const date = new Date(year, month - 1, day);

    if (
      date.getFullYear() !== year ||
      date.getMonth() !== month - 1 ||
      date.getDate() !== day
    ) {
      alert('有効な生年月日を選択してください');
      return;
    }

    if (
      !formData.lastName ||
      !formData.firstName ||
      !formData.lastNameKana ||
      !formData.firstNameKana ||
      !formData.gender ||
      !formData.prefecture ||
      !formData.birthYear ||
      !formData.birthMonth ||
      !formData.birthDay ||
      !formData.phoneNumber ||
      !formData.currentIncome
    ) {
      // Define the encryption key; in practice, do NOT hardcode!
      const ENC_KEY =
        process.env.NEXT_PUBLIC_PROFILE_ENC_KEY || 'default_encryption_key';
      alert('すべての項目を入力してください');
      return;
    }

    setIsSubmitting(true);

    try {
      if (userId) {
        const result = await saveProfileData({ ...formData, userId });
        console.log('Save result:', result);

        if (result.success) {
          localStorage.setItem(
            'signupProfile',
            encryptData(
              formData,
              process.env.NEXT_PUBLIC_ENCRYPTION_KEY || 'default-key'
            )
          );
          router.push('/signup/career-status');
        } else {
          console.error('Profile save error:', result.error);
          setIsSubmitting(false);
        }
      } else {
        console.log('No userId, saving to localStorage only');
        localStorage.setItem(
          'signupProfile',
          encryptData(
            formData,
            process.env.NEXT_PUBLIC_ENCRYPTION_KEY || 'default-key'
          )
        );
        router.push('/signup/career-status');
      }
    } catch (error) {
      console.error('Profile submit error:', error);
      setIsSubmitting(false);
    }
  };

  const isFormValid =
    formData.lastName &&
    formData.firstName &&
    formData.lastNameKana &&
    formData.firstNameKana &&
    formData.gender &&
    formData.prefecture &&
    formData.birthYear &&
    formData.birthMonth &&
    formData.birthDay &&
    formData.phoneNumber &&
    formData.currentIncome &&
    !validationErrors.lastNameKana &&
    !validationErrors.firstNameKana &&
    !validationErrors.phoneNumber;

  return (
    <div className='min-h-screen flex flex-col'>
      <div>
        <form
          onSubmit={e => {
            e.preventDefault();
            handleFormSubmit();
          }}
        >
          {/* PC Version */}
          <div className='hidden lg:block'>
            <main
              className='flex relative py-20 flex-col items-center justify-start min-h-[calc(100vh+1700px)]'
              style={{
                backgroundImage: "url('/background-pc.svg')",
                backgroundPosition: 'center top',
                backgroundRepeat: 'no-repeat',
                backgroundSize: 'cover',
              }}
            >
              <div className='bg-white rounded-[40px] shadow-[0px_0px_20px_0px_rgba(0,0,0,0.05)] p-20 w-[1000px] flex flex-col gap-10 items-center'>
                <div className='flex flex-col gap-6 items-center w-full'>
                  <h1 className='text-[#0f9058] text-[32px] font-bold tracking-[3.2px] text-center'>
                    会員情報
                  </h1>
                </div>

                <div className='flex flex-row w-full h-[45px]'>
                  <div className='flex-1 flex flex-row gap-2 items-center justify-center py-2 px-6 border-b-2 border-[#0f9058]'>
                    <div className='w-6 h-6 flex items-center justify-center'>
                      <svg
                        width='24'
                        height='25'
                        viewBox='0 0 24 25'
                        fill='none'
                        xmlns='http://www.w3.org/2000/svg'
                      >
                        <path
                          d='M11.9997 12.5C13.6162 12.5 15.1666 11.8679 16.3097 10.7426C17.4527 9.61742 18.0949 8.0913 18.0949 6.5C18.0949 4.9087 17.4527 3.38258 16.3097 2.25736C15.1666 1.13214 13.6162 0.5 11.9997 0.5C10.3831 0.5 8.83277 1.13214 7.68969 2.25736C6.54661 3.38258 5.90444 4.9087 5.90444 6.5C5.90444 8.0913 6.54661 9.61742 7.68969 10.7426C8.83277 11.8679 10.3831 12.5 11.9997 12.5ZM9.82348 14.75C5.13301 14.75 1.33301 18.4906 1.33301 23.1078C1.33301 23.8766 1.96634 24.5 2.74729 24.5H21.2521C22.033 24.5 22.6663 23.8766 22.6663 23.1078C22.6663 18.4906 18.8663 14.75 14.1759 14.75H9.82348Z'
                          fill='#0F9058'
                        />
                      </svg>
                    </div>
                    <span className='text-[#0f9058] text-[18px] font-bold tracking-[1.8px]'>
                      基本情報
                    </span>
                  </div>
                  <div className='flex-1 flex flex-row gap-2 items-center justify-center py-2 px-6 border-b-2 border-[#dcdcdc]'>
                    <div className='w-6 h-6 flex items-center justify-center'>
                      <svg
                        width='25'
                        height='25'
                        viewBox='0 0 25 25'
                        fill='none'
                        xmlns='http://www.w3.org/2000/svg'
                      >
                        <path
                          d='M12.5 2.75011C12.5 2.15334 12.734 1.58102 13.1505 1.15904C13.567 0.737064 14.132 0.5 14.7211 0.5C15.3101 0.5 15.8751 0.737064 16.2916 1.15904C16.7082 1.58102 16.9422 2.15334 16.9422 2.75011C16.9422 3.34688 16.7082 3.9192 16.2916 4.34118C15.8751 4.76315 15.3101 5.00022 14.7211 5.00022C14.132 5.00022 13.567 4.76315 13.1505 4.34118C12.734 3.9192 12.5 3.34688 12.5 2.75011ZM10.9498 9.84264C10.9035 9.86139 10.8619 9.88015 10.8156 9.8989L10.4454 10.063C9.68655 10.4052 9.1035 11.0568 8.83975 11.8537L8.71944 12.2193C8.46031 13.0069 7.62276 13.4288 6.84537 13.1662C6.06798 12.9037 5.65152 12.0553 5.91065 11.2677L6.03096 10.9021C6.55848 9.30355 7.72456 8.00037 9.24232 7.31596L9.61251 7.15189C10.575 6.72062 11.6161 6.4956 12.6712 6.4956C14.735 6.4956 16.5951 7.75192 17.3864 9.67857L18.099 11.4083L19.0893 11.9099C19.8204 12.2803 20.1165 13.1803 19.751 13.921C19.3854 14.6616 18.497 14.9616 17.7659 14.5913L16.5257 13.9678C16.0491 13.7241 15.6743 13.3209 15.4707 12.8194L15.0265 11.7412L14.1334 14.8116L16.4239 17.343C16.6738 17.6196 16.8496 17.9524 16.9422 18.3181L18.0065 22.6355C18.2054 23.4371 17.7242 24.2527 16.9283 24.4543C16.1324 24.6559 15.3319 24.1683 15.1329 23.3621L14.1149 19.2322L10.8434 15.6179C10.1585 14.8632 9.90403 13.8085 10.1632 12.8194L10.9452 9.84264H10.9498ZM8.27521 19.1572L9.43204 16.232C9.52922 16.3727 9.64027 16.5039 9.75596 16.6352L11.6393 18.7165L10.9683 20.4135C10.8573 20.6947 10.6907 20.9526 10.4778 21.1682L7.62276 24.0605C7.04435 24.6465 6.105 24.6465 5.52658 24.0605C4.94817 23.4746 4.94817 22.5229 5.52658 21.937L8.27521 19.1572Z'
                          fill='#DCDCDC'
                        />
                      </svg>
                    </div>
                    <span className='text-[#dcdcdc] text-[18px] font-bold tracking-[1.8px]'>
                      転職活動状況
                    </span>
                  </div>
                  <div className='flex-1 flex flex-row gap-2 items-center justify-center py-2 px-6 border-b-2 border-[#dcdcdc]'>
                    <div className='w-6 h-6 flex items-center justify-center'>
                      <svg
                        width='25'
                        height='25'
                        viewBox='0 0 25 25'
                        fill='none'
                        xmlns='http://www.w3.org/2000/svg'
                      >
                        <path
                          d='M5.83355 0.5C4.6067 0.5 3.61133 1.50781 3.61133 2.75V22.25C3.61133 23.4922 4.6067 24.5 5.83355 24.5H10.278V20.75C10.278 19.5078 11.2734 18.5 12.5002 18.5C13.7271 18.5 14.7224 19.5078 14.7224 20.75V24.5H19.1669C20.3937 24.5 21.3891 23.4922 21.3891 22.25V2.75C21.3891 1.50781 20.3937 0.5 19.1669 0.5H5.83355ZM6.57429 11.75C6.57429 11.3375 6.90762 11 7.31503 11H8.79651C9.20392 11 9.53725 11.3375 9.53725 11.75V13.25C9.53725 13.6625 9.20392 14 8.79651 14H7.31503C6.90762 14 6.57429 13.6625 6.57429 13.25V11.75ZM11.7595 11H13.241C13.6484 11 13.9817 11.3375 13.9817 11.75V13.25C13.9817 13.6625 13.6484 14 13.241 14H11.7595C11.3521 14 11.0187 13.6625 11.0187 13.25V11.75C11.0187 11.3375 11.3521 11 11.7595 11ZM15.4632 11.75C15.4632 11.3375 15.7965 11 16.2039 11H17.6854C18.0928 11 18.4261 11.3375 18.4261 11.75V13.25C18.4261 13.6625 18.0928 14 17.6854 14H16.2039C15.7965 14 15.4632 13.6625 15.4632 13.25V11.75ZM7.31503 5H8.79651C9.20392 5 9.53725 5.3375 9.53725 5.75V7.25C9.53725 7.6625 9.20392 8 8.79651 8H7.31503C6.90762 8 6.57429 7.6625 6.57429 7.25V5.75C6.57429 5.3375 6.90762 5 7.31503 5ZM11.0187 5.75C11.0187 5.3375 11.3521 5 11.7595 5H13.241C13.6484 5 13.9817 5.3375 13.9817 5.75V7.25C13.9817 7.6625 13.6484 8 13.241 8H11.7595C11.3521 8 11.0187 7.6625 11.0187 7.25V5.75ZM16.2039 5H17.6854C18.0928 5 18.4261 5.3375 18.4261 5.75V7.25C18.4261 7.6625 18.0928 8 17.6854 8H16.2039C15.7965 8 15.4632 7.6625 15.4632 7.25V5.75C15.4632 5.3375 15.7965 5 16.2039 5Z'
                          fill='#DCDCDC'
                        />
                      </svg>
                    </div>
                    <span className='text-[#dcdcdc] text-[18px] font-bold tracking-[1.8px]'>
                      直近の在籍企業
                    </span>
                  </div>
                </div>

                <div className='text-[#323232] text-[16px] leading-8 tracking-[1.6px] text-center font-bold'>
                  <p>あなたの基本情報を教えてください。</p>
                  <p>※氏名はスカウトに返信した場合のみ企業に開示されます</p>
                  <p>※電話番号は企業には公開されません</p>
                </div>

                <div className='flex flex-col gap-6 w-fit items-end mx-auto'>
                  {/* Name Fields */}
                  <div className='flex flex-row gap-4 items-start w-full justify-end'>
                    <div className='pt-[11px]'>
                      <label className='text-[#323232] text-[16px] font-bold tracking-[1.6px]'>
                        氏名
                      </label>
                    </div>
                    <div className='flex flex-col gap-2 w-[400px]'>
                      <div className='flex flex-wrap gap-2'>
                        <div className='flex-1 min-w-[120px]'>
                          <input
                            type='text'
                            placeholder='姓'
                            autoComplete='off'
                            value={formData.lastName}
                            onChange={e =>
                              setFormData(prev => ({
                                ...prev,
                                lastName: e.target.value,
                              }))
                            }
                            className='w-full px-[11px] py-[11px] bg-white border border-[#999999] rounded-[5px] text-[16px] text-[#323232] font-bold tracking-[1.6px] placeholder:text-[#999999]'
                          />
                        </div>
                        <div className='flex-1 min-w-[120px]'>
                          <input
                            type='text'
                            placeholder='名'
                            autoComplete='off'
                            value={formData.firstName}
                            onChange={e =>
                              setFormData(prev => ({
                                ...prev,
                                firstName: e.target.value,
                              }))
                            }
                            className='w-full px-[11px] py-[11px] bg-white border border-[#999999] rounded-[5px] text-[16px] text-[#323232] font-bold tracking-[1.6px] placeholder:text-[#999999]'
                          />
                        </div>
                      </div>
                      <p className='text-[#999999] text-[14px] font-medium tracking-[1.4px]'>
                        ※登録後の変更は不可となっております。
                      </p>
                    </div>
                  </div>

                  {/* Furigana Fields */}
                  <div className='flex flex-row gap-4 items-start w-full justify-end'>
                    <div className='pt-[11px]'>
                      <label className='text-[#323232] text-[16px] font-bold tracking-[1.6px]'>
                        フリガナ
                      </label>
                    </div>
                    <div className='flex flex-col gap-2 w-[400px]'>
                      <div className='flex flex-wrap gap-2'>
                        <div className='flex-1 min-w-[120px]'>
                          <input
                            type='text'
                            placeholder='セイ'
                            autoComplete='off'
                            value={formData.lastNameKana}
                            onChange={e =>
                              handleKanaChange('lastNameKana', e.target.value)
                            }
                            className={`w-full px-[11px] py-[11px] bg-white border rounded-[5px] text-[16px] text-[#323232] font-bold tracking-[1.6px] placeholder:text-[#999999] ${
                              validationErrors.lastNameKana
                                ? 'border-red-500'
                                : 'border-[#999999]'
                            }`}
                          />
                          {validationErrors.lastNameKana && (
                            <p className='text-red-600 text-xs mt-1'>
                              {validationErrors.lastNameKana}
                            </p>
                          )}
                        </div>
                        <div className='flex-1 min-w-[120px]'>
                          <input
                            type='text'
                            placeholder='メイ'
                            autoComplete='off'
                            value={formData.firstNameKana}
                            onChange={e =>
                              handleKanaChange('firstNameKana', e.target.value)
                            }
                            className={`w-full px-[11px] py-[11px] bg-white border rounded-[5px] text-[16px] text-[#323232] font-bold tracking-[1.6px] placeholder:text-[#999999] ${
                              validationErrors.firstNameKana
                                ? 'border-red-500'
                                : 'border-[#999999]'
                            }`}
                          />
                          {validationErrors.firstNameKana && (
                            <p className='text-red-600 text-xs mt-1'>
                              {validationErrors.firstNameKana}
                            </p>
                          )}
                        </div>
                      </div>
                      <p className='text-[#999999] text-[14px] font-medium tracking-[1.4px]'>
                        ※登録後の変更は不可となっております。
                      </p>
                    </div>
                  </div>

                  {/* Gender */}
                  <div className='flex flex-row gap-4 items-start w-full justify-end'>
                    <div className='pt-[11px]'>
                      <label className='text-[#323232] text-[16px] font-bold tracking-[1.6px]'>
                        性別
                      </label>
                    </div>
                    <div className='flex flex-col gap-2 w-[400px]'>
                      <div className='flex flex-row gap-2'>
                        {GENDER_OPTIONS.map(option => (
                          <button
                            key={option.value}
                            type='button'
                            onClick={() =>
                              setFormData(prev => ({
                                ...prev,
                                gender: option.value as
                                  | '男性'
                                  | '女性'
                                  | '未回答',
                              }))
                            }
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
                  </div>

                  {/* Current Address */}
                  <div className='flex flex-row gap-4 items-start w-full justify-end'>
                    <div className='pt-[11px]'>
                      <label className='text-[#323232] text-[16px] font-bold tracking-[1.6px]'>
                        現在の住まい
                      </label>
                    </div>
                    <div className='w-[400px]'>
                      <SelectInput
                        options={PREFECTURES.map(prefecture => ({
                          value: prefecture,
                          label: prefecture,
                        }))}
                        value={formData.prefecture}
                        onChange={value =>
                          setFormData(prev => ({
                            ...prev,
                            prefecture: value,
                          }))
                        }
                        placeholder='都道府県を選択'
                        radius={5}
                        className='w-full'
                      />
                    </div>
                  </div>

                  {/* Birth Date */}
                  <div className='flex flex-row gap-4 items-start w-full justify-end'>
                    <div className='pt-[11px]'>
                      <label className='text-[#323232] text-[16px] font-bold tracking-[1.6px]'>
                        生年月日
                      </label>
                    </div>
                    <div className='w-[400px]'>
                      <div className='flex flex-col gap-2'>
                        <div className='flex flex-nowrap gap-2 items-center'>
                          <div className='min-w-[100px] flex-1'>
                            <SelectInput
                              options={[
                                { value: '', label: '未選択' },
                                ...yearOptions
                                  .filter(year => year !== '未選択')
                                  .map(year => ({
                                    value: year,
                                    label: year,
                                  })),
                              ]}
                              value={formData.birthYear}
                              onChange={value =>
                                setFormData(prev => ({
                                  ...prev,
                                  birthYear: value,
                                }))
                              }
                              placeholder='未選択'
                              radius={5}
                              className='w-full'
                            />
                          </div>
                          <span className='text-[#323232] text-[16px] font-bold tracking-[1.6px] flex-shrink-0'>
                            年
                          </span>
                          <div className='min-w-[80px] flex-1'>
                            <SelectInput
                              options={[
                                { value: '', label: '未選択' },
                                ...monthOptions
                                  .filter(month => month !== '未選択')
                                  .map(month => ({
                                    value: month,
                                    label: month,
                                  })),
                              ]}
                              value={formData.birthMonth}
                              onChange={value =>
                                setFormData(prev => ({
                                  ...prev,
                                  birthMonth: value,
                                }))
                              }
                              placeholder='未選択'
                              radius={5}
                              className='w-full'
                            />
                          </div>
                          <span className='text-[#323232] text-[16px] font-bold tracking-[1.6px] flex-shrink-0'>
                            月
                          </span>
                          <div className='min-w-[80px] flex-1'>
                            <SelectInput
                              options={[
                                { value: '', label: '未選択' },
                                ...dayOptions
                                  .filter(day => day !== '未選択')
                                  .map(day => ({
                                    value: day,
                                    label: day,
                                  })),
                              ]}
                              value={formData.birthDay}
                              onChange={value =>
                                setFormData(prev => ({
                                  ...prev,
                                  birthDay: value,
                                }))
                              }
                              placeholder='未選択'
                              radius={5}
                              className='w-full'
                            />
                          </div>
                          <span className='text-[#323232] text-[16px] font-bold tracking-[1.6px] flex-shrink-0'>
                            日
                          </span>
                        </div>
                      </div>
                    </div>
                  </div>

                  {/* Phone Number */}
                  <div className='flex flex-row gap-4 items-start w-full justify-end'>
                    <div className='pt-[11px]'>
                      <label className='text-[#323232] text-[16px] font-bold tracking-[1.6px]'>
                        連絡先電話番号
                      </label>
                    </div>
                    <div className='flex flex-col gap-2 w-[400px]'>
                      <input
                        type='tel'
                        placeholder='08011112222'
                        autoComplete='off'
                        value={formData.phoneNumber}
                        onChange={e => handlePhoneNumberChange(e.target.value)}
                        className={`w-full px-[11px] py-[11px] bg-white border rounded-[5px] text-[16px] text-[#323232] font-medium tracking-[1.6px] placeholder:text-[#999999] ${
                          validationErrors.phoneNumber
                            ? 'border-red-500'
                            : 'border-[#999999]'
                        }`}
                      />
                      {validationErrors.phoneNumber && (
                        <p className='text-red-600 text-xs mt-1'>
                          {validationErrors.phoneNumber}
                        </p>
                      )}
                      <p className='text-[#999999] text-[14px] font-medium tracking-[1.4px]'>
                        ※「-」なしでご入力ください。
                      </p>
                    </div>
                  </div>

                  {/* Current Income */}
                  <div className='flex flex-row gap-4 items-start w-full justify-end'>
                    <div className='pt-[11px]'>
                      <label className='text-[#323232] text-[16px] font-bold tracking-[1.6px]'>
                        現在の年収
                      </label>
                    </div>
                    <div className='w-[400px]'>
                      <SelectInput
                        options={INCOME_RANGES.map(income => ({
                          value: income.value,
                          label: income.label,
                        }))}
                        value={formData.currentIncome}
                        onChange={value =>
                          setFormData(prev => ({
                            ...prev,
                            currentIncome: value,
                          }))
                        }
                        placeholder='年収を選択'
                        radius={5}
                        className='w-full'
                      />
                    </div>
                  </div>
                </div>

                <Button
                  type='submit'
                  disabled={isSubmitting || !isFormValid}
                  variant='green-gradient'
                  size='figma-default'
                  className='min-w-[160px] text-[16px] tracking-[1.6px] disabled:opacity-50 disabled:cursor-not-allowed'
                >
                  {isSubmitting ? '送信中...' : '次へ'}
                </Button>
              </div>
            </main>
          </div>

          {/* SP (Mobile) Version */}
          <div className='lg:hidden'>
            <main
              className='flex relative pt-6 pb-20 flex-col items-center px-5'
              style={{
                backgroundImage: "url('/background-sp.svg')",
                backgroundPosition: 'center top',
                backgroundRepeat: 'no-repeat',
                backgroundSize: 'cover',
              }}
            >
              <div className='bg-white rounded-3xl shadow-[0px_0px_20px_0px_rgba(0,0,0,0.05)] px-6 py-10 w-full flex flex-col gap-10 items-center'>
                <div className='flex flex-row gap-4 items-center w-full pb-4 border-b border-[#efefef]'>
                  <div className='relative w-[72px] h-[72px]'>
                    <svg width='72' height='72' viewBox='0 0 72 72' fill='none'>
                      <circle
                        cx='36'
                        cy='36'
                        r='28.8'
                        stroke='#e0e0e0'
                        strokeWidth='7.2'
                        fill='none'
                        strokeLinecap='round'
                        transform='rotate(-90 36 36)'
                      />
                      <circle
                        cx='36'
                        cy='36'
                        r='28.8'
                        stroke='#0f9058'
                        strokeWidth='7.2'
                        fill='none'
                        strokeLinecap='round'
                        strokeDasharray='60.32 120.64'
                        transform='rotate(-90 36 36)'
                      />
                    </svg>
                    <div className='absolute inset-0 flex items-center justify-center'>
                      <div className='text-center'>
                        <span className='text-[#0f9058] text-[24px] font-medium tracking-[2.4px]'>
                          1
                        </span>
                        <span className='text-[#999999] text-[17px] font-medium tracking-[1.7px]'>
                          /3
                        </span>
                      </div>
                    </div>
                  </div>
                  <div className='flex flex-col'>
                    <p className='text-[#999999] text-[16px] font-bold tracking-[1.6px]'>
                      会員情報
                    </p>
                    <p className='text-[#0f9058] text-[20px] font-bold tracking-[2px]'>
                      基本情報
                    </p>
                  </div>
                </div>

                <div className='text-[#323232] text-[16px] leading-8 tracking-[1.6px] text-center font-bold'>
                  <p>あなたの基本情報を教えてください。</p>
                  <p>※氏名はスカウトに返信した場合のみ</p>
                  <p>企業に開示されます</p>
                  <p>※電話番号は企業には公開されません</p>
                </div>

                <div className='flex flex-col gap-6 w-full'>
                  {/* Name Fields */}
                  <div className='flex flex-col gap-2'>
                    <label className='text-[#323232] text-[16px] font-bold tracking-[1.6px]'>
                      氏名
                    </label>
                    <div className='flex flex-col gap-2'>
                      <div className='flex flex-wrap gap-2'>
                        <div className='flex-1 min-w-[120px]'>
                          <input
                            type='text'
                            placeholder='姓'
                            autoComplete='off'
                            value={formData.lastName}
                            onChange={e =>
                              setFormData(prev => ({
                                ...prev,
                                lastName: e.target.value,
                              }))
                            }
                            className='w-full px-[11px] py-[11px] bg-white border border-[#999999] rounded-[5px] text-[16px] text-[#323232] font-bold tracking-[1.6px] placeholder:text-[#999999]'
                          />
                        </div>
                        <div className='flex-1 min-w-[120px]'>
                          <input
                            type='text'
                            placeholder='名'
                            autoComplete='off'
                            value={formData.firstName}
                            onChange={e =>
                              setFormData(prev => ({
                                ...prev,
                                firstName: e.target.value,
                              }))
                            }
                            className='w-full px-[11px] py-[11px] bg-white border border-[#999999] rounded-[5px] text-[16px] text-[#323232] font-bold tracking-[1.6px] placeholder:text-[#999999]'
                          />
                        </div>
                      </div>
                      <p className='text-[#999999] text-[14px] font-medium tracking-[1.4px]'>
                        ※登録後の変更は不可となっております。
                      </p>
                    </div>
                  </div>

                  {/* Furigana Fields */}
                  <div className='flex flex-col gap-2'>
                    <label className='text-[#323232] text-[16px] font-bold tracking-[1.6px]'>
                      フリガナ
                    </label>
                    <div className='flex flex-col gap-2'>
                      <div className='flex flex-wrap gap-2'>
                        <div className='flex-1 min-w-[120px]'>
                          <input
                            type='text'
                            placeholder='セイ'
                            autoComplete='off'
                            value={formData.lastNameKana}
                            onChange={e =>
                              handleKanaChange('lastNameKana', e.target.value)
                            }
                            className={`w-full px-[11px] py-[11px] bg-white border rounded-[5px] text-[16px] text-[#323232] font-bold tracking-[1.6px] placeholder:text-[#999999] ${
                              validationErrors.lastNameKana
                                ? 'border-red-500'
                                : 'border-[#999999]'
                            }`}
                          />
                          {validationErrors.lastNameKana && (
                            <p className='text-red-600 text-xs mt-1'>
                              {validationErrors.lastNameKana}
                            </p>
                          )}
                        </div>
                        <div className='flex-1 min-w-[120px]'>
                          <input
                            type='text'
                            placeholder='メイ'
                            autoComplete='off'
                            value={formData.firstNameKana}
                            onChange={e =>
                              handleKanaChange('firstNameKana', e.target.value)
                            }
                            className={`w-full px-[11px] py-[11px] bg-white border rounded-[5px] text-[16px] text-[#323232] font-bold tracking-[1.6px] placeholder:text-[#999999] ${
                              validationErrors.firstNameKana
                                ? 'border-red-500'
                                : 'border-[#999999]'
                            }`}
                          />
                          {validationErrors.firstNameKana && (
                            <p className='text-red-600 text-xs mt-1'>
                              {validationErrors.firstNameKana}
                            </p>
                          )}
                        </div>
                      </div>
                      <p className='text-[#999999] text-[14px] font-medium tracking-[1.4px]'>
                        ※登録後の変更は不可となっております。
                      </p>
                    </div>
                  </div>

                  {/* Gender */}
                  <div className='flex flex-col gap-2'>
                    <label className='text-[#323232] text-[16px] font-bold tracking-[1.6px]'>
                      性別
                    </label>
                    <div className='flex flex-col gap-2'>
                      <div className='flex flex-row gap-2'>
                        {GENDER_OPTIONS.map(option => (
                          <button
                            key={option.value}
                            type='button'
                            onClick={() =>
                              setFormData(prev => ({
                                ...prev,
                                gender: option.value as
                                  | '男性'
                                  | '女性'
                                  | '未回答',
                              }))
                            }
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
                  </div>

                  {/* Current Address */}
                  <div className='flex flex-col gap-2'>
                    <label className='text-[#323232] text-[16px] font-bold tracking-[1.6px]'>
                      現在の住まい
                    </label>
                    <SelectInput
                      options={PREFECTURES.map(prefecture => ({
                        value: prefecture,
                        label: prefecture,
                      }))}
                      value={formData.prefecture}
                      onChange={value =>
                        setFormData(prev => ({
                          ...prev,
                          prefecture: value,
                        }))
                      }
                      placeholder='都道府県を選択'
                      radius={5}
                      className='w-full'
                    />
                  </div>

                  {/* Birth Date */}
                  <div className='flex flex-col gap-2'>
                    <label className='text-[#323232] text-[16px] font-bold tracking-[1.6px]'>
                      生年月日
                    </label>
                    <div className='flex flex-col gap-2'>
                      <div className='flex gap-2 items-center'>
                        <div className='flex-1'>
                          <SelectInput
                            options={[
                              { value: '', label: '未選択' },
                              ...yearOptions
                                .filter(year => year !== '未選択')
                                .map(year => ({
                                  value: year,
                                  label: year,
                                })),
                            ]}
                            value={formData.birthYear}
                            onChange={value =>
                              setFormData(prev => ({
                                ...prev,
                                birthYear: value,
                              }))
                            }
                            placeholder='未選択'
                            radius={5}
                            className='w-full'
                          />
                        </div>
                        <span className='text-[#323232] text-[16px] font-bold tracking-[1.6px]'>
                          年
                        </span>
                      </div>
                      <div className='flex gap-2'>
                        <div className='flex gap-2 items-center flex-1'>
                          <div className='flex-1'>
                            <SelectInput
                              options={[
                                { value: '', label: '未選択' },
                                ...monthOptions
                                  .filter(month => month !== '未選択')
                                  .map(month => ({
                                    value: month,
                                    label: month,
                                  })),
                              ]}
                              value={formData.birthMonth}
                              onChange={value =>
                                setFormData(prev => ({
                                  ...prev,
                                  birthMonth: value,
                                }))
                              }
                              placeholder='未選択'
                              radius={5}
                              className='w-full'
                            />
                          </div>
                          <span className='text-[#323232] text-[16px] font-bold tracking-[1.6px]'>
                            月
                          </span>
                        </div>
                        <div className='flex gap-2 items-center flex-1'>
                          <div className='flex-1'>
                            <SelectInput
                              options={[
                                { value: '', label: '未選択' },
                                ...dayOptions
                                  .filter(day => day !== '未選択')
                                  .map(day => ({
                                    value: day,
                                    label: day,
                                  })),
                              ]}
                              value={formData.birthDay}
                              onChange={value =>
                                setFormData(prev => ({
                                  ...prev,
                                  birthDay: value,
                                }))
                              }
                              placeholder='未選択'
                              radius={5}
                              className='w-full'
                            />
                          </div>
                          <span className='text-[#323232] text-[16px] font-bold tracking-[1.6px]'>
                            日
                          </span>
                        </div>
                      </div>
                    </div>
                  </div>

                  {/* Phone Number */}
                  <div className='flex flex-col gap-2'>
                    <label className='text-[#323232] text-[16px] font-bold tracking-[1.6px]'>
                      連絡先電話番号
                    </label>
                    <input
                      type='tel'
                      placeholder='08011112222'
                      autoComplete='off'
                      value={formData.phoneNumber}
                      onChange={e => handlePhoneNumberChange(e.target.value)}
                      className={`w-full px-[11px] py-[11px] bg-white border rounded-[5px] text-[16px] text-[#323232] font-medium tracking-[1.6px] placeholder:text-[#999999] ${
                        validationErrors.phoneNumber
                          ? 'border-red-500'
                          : 'border-[#999999]'
                      }`}
                    />
                    {validationErrors.phoneNumber && (
                      <p className='text-red-600 text-xs mt-1'>
                        {validationErrors.phoneNumber}
                      </p>
                    )}
                    <p className='text-[#999999] text-[14px] font-medium tracking-[1.4px]'>
                      ※「-」なしでご入力ください。
                    </p>
                  </div>

                  {/* Current Income */}
                  <div className='flex flex-col gap-2'>
                    <label className='text-[#323232] text-[16px] font-bold tracking-[1.6px]'>
                      現在の年収
                    </label>
                    <SelectInput
                      options={INCOME_RANGES.map(income => ({
                        value: income.value,
                        label: income.label,
                      }))}
                      value={formData.currentIncome}
                      onChange={value =>
                        setFormData(prev => ({
                          ...prev,
                          currentIncome: value,
                        }))
                      }
                      placeholder='年収を選択'
                      radius={5}
                      className='w-full'
                    />
                  </div>
                </div>

                <Button
                  type='submit'
                  disabled={isSubmitting || !isFormValid}
                  variant='green-gradient'
                  size='figma-default'
                  className='w-full text-[16px] tracking-[1.6px] disabled:opacity-50 disabled:cursor-not-allowed'
                >
                  {isSubmitting ? '送信中...' : '次へ'}
                </Button>
              </div>
            </main>
          </div>
        </form>
      </div>
    </div>
  );
}
