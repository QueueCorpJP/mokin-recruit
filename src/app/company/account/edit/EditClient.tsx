'use client';

import React, { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import Image from 'next/image';
import { Button } from '@/components/ui/button';
import { SelectInput } from '@/components/ui/select-input';
import { ImageUpload } from '@/components/ui/ImageUpload';
import IndustrySelectModal from '@/components/career-status/IndustrySelectModal';
import { prefectures as PREFS } from '@/constants/prefectures';
import type { Industry } from '@/constants/industry-data';
import { getCompanyAccountForEdit, saveCompanyAccountEdit, uploadCompanyAccountIconAction, uploadCompanyAccountImagesAction } from './actions';

// Icons
const RightArrowIcon = () => (
  <svg
    width='8'
    height='8'
    viewBox='0 0 8 8'
    fill='none'
    xmlns='http://www.w3.org/2000/svg'
  >
    <path
      d='M1 7L4 4L1 1'
      stroke='white'
      strokeWidth='1.5'
      strokeLinecap='round'
      strokeLinejoin='round'
    />
  </svg>
);

const AccountIcon = () => (
  <svg
    width='32'
    height='32'
    viewBox='0 0 32 32'
    fill='none'
    xmlns='http://www.w3.org/2000/svg'
  >
    <path
      d='M7.11116 0C5.47535 0 4.14819 1.34375 4.14819 3V29C4.14819 30.6562 5.47535 32 7.11116 32H13.0371V27C13.0371 25.3438 14.3642 24 16 24C17.6358 24 18.963 25.3438 18.963 27V32H24.8889C26.5247 32 27.8519 30.6562 27.8519 29V3C27.8519 1.34375 26.5247 0 24.8889 0H7.11116ZM8.09881 15C8.09881 14.45 8.54326 14 9.08647 14H11.0618C11.605 14 12.0494 14.45 12.0494 15V17C12.0494 17.55 11.605 18 11.0618 18H9.08647C8.54326 18 8.09881 17.55 8.09881 17V15ZM15.0124 14H16.9877C17.5309 14 17.9754 14.45 17.9754 15V17C17.9754 17.55 17.5309 18 16.9877 18H15.0124C14.4692 18 14.0247 17.55 14.0247 17V15C14.0247 14.45 14.4692 14 15.0124 14ZM19.9507 15C19.9507 14.45 20.3951 14 20.9383 14H22.9136C23.4568 14 23.9013 14.45 23.9013 15V17C23.9013 17.55 23.4568 18 22.9136 18H20.9383C20.3951 18 19.9507 17.55 19.9507 17V15ZM9.08647 6H11.0618C11.605 6 12.0494 6.45 12.0494 7V9C12.0494 9.55 11.605 10 11.0618 10H9.08647C8.54326 10 8.09881 9.55 8.09881 9V7C8.09881 6.45 8.54326 6 9.08647 6ZM14.0247 7C14.0247 6.45 14.4692 6 15.0124 6H16.9877C17.5309 6 17.9754 6.45 17.9754 7V9C17.9754 9.55 17.5309 10 16.9877 10H15.0124C14.4692 10 14.0247 9.55 14.0247 9V7ZM20.9383 6H22.9136C23.4568 6 23.9013 6.45 23.9013 7V9C23.9013 9.55 23.4568 10 22.9136 10H20.9383C20.3951 10 19.9507 9.55 19.9507 9V7C19.9507 6.45 20.3951 6 20.9383 6Z'
      fill='white'
    />
  </svg>
);

const PlusIcon = () => (
  <svg
    width='16'
    height='16'
    viewBox='0 0 16 16'
    fill='none'
    xmlns='http://www.w3.org/2000/svg'
  >
    <path
      d='M9.23077 1.23077C9.23077 0.55 8.68077 0 8 0C7.31923 0 6.76923 0.55 6.76923 1.23077V6.76923H1.23077C0.55 6.76923 0 7.31923 0 8C0 8.68077 0.55 9.23077 1.23077 9.23077H6.76923V14.7692C6.76923 15.45 7.31923 16 8 16C8.68077 16 9.23077 15.45 9.23077 14.7692V9.23077H14.7692C15.45 9.23077 16 8.68077 16 8C16 7.31923 15.45 6.76923 14.7692 6.76923H9.23077V1.23077Z'
      fill='#0F9058'
    />
  </svg>
);

const CloseIcon = () => (
  <svg
    width='16'
    height='16'
    viewBox='0 0 16 16'
    fill='none'
    xmlns='http://www.w3.org/2000/svg'
  >
    <path
      d='M14.3916 0.276367C14.7591 -0.091205 15.3551 -0.091205 15.7227 0.276367C16.09 0.64395 16.0901 1.23989 15.7227 1.60742L9.33105 7.99805L15.7246 14.3926L15.7578 14.4277C16.0915 14.7971 16.0804 15.3675 15.7246 15.7236C15.3686 16.0797 14.7982 16.0907 14.4287 15.7568L14.3936 15.7236L8 9.33008L1.60645 15.7246L1.57129 15.7588C1.20184 16.0924 0.631342 16.0806 0.275391 15.7246C-0.0803775 15.3685 -0.0915183 14.7981 0.242188 14.4287L0.275391 14.3936L6.66895 7.99805L0.277344 1.60645C-0.0901912 1.23888 -0.0901912 0.642957 0.277344 0.275391C0.644887 -0.0920783 1.2409 -0.0921432 1.6084 0.275391L8 6.66699L14.3916 0.276367Z'
      fill='#999999'
    />
  </svg>
);

// 都道府県リスト（短縮表記でUI互換）
const prefectures = [...PREFS.map(p => p.shortJa), '海外'];

// 企業フェーズリスト
const companyPhases = [
  'スタートアップ（創業初期・社員数50名規模）',
  'スタートアップ（成長中・シリーズB以降）',
  'メガベンチャー（急成長・未上場）',
  '上場ベンチャー（マザーズ等上場済）',
  '中堅企業（~1000名規模）',
  '上場企業（プライム・スタンダード等）',
  '大企業（グローバル展開・数千名規模）',
];

interface EditFormState {
  companyName: string;
  urls: Array<{ title: string; url: string }>;
  iconImage: File | null;
  currentIconUrl: string | null;
  representative: { position: string; name: string };
  establishedYear: string;
  capital: { amount: string; unit: string };
  employees: string;
  industries: Industry[];
  businessContent: string;
  location: { prefecture: string; address: string };
  companyPhase: string;
  images: File[];
  currentImageUrls: string[]; // 既存のイメージ画像URL（モック）
  attractions: Array<{ title: string; content: string }>;
}

export default function EditClient() {
  const router = useRouter();
  const [formData, setFormData] = useState<EditFormState>({
    companyName: 'テキストが入ります。',
    urls: [{ title: '', url: '' }],
    iconImage: null,
    currentIconUrl: null,
    representative: { position: '', name: '' },
    establishedYear: '',
    capital: { amount: '', unit: '万円' },
    employees: '',
    industries: [],
    businessContent: '',
    location: { prefecture: '', address: '' },
    companyPhase: '',
    images: [],
    currentImageUrls: [],
    attractions: [{ title: '', content: '' }],
  });
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [uploading, setUploading] = useState(false);

  const [errors, setErrors] = useState<Record<string, string>>({});
  const [isIndustryModalOpen, setIsIndustryModalOpen] = useState(false);

  // 初期ロード
  useEffect(() => {
    (async () => {
      setLoading(true);
      try {
        const result = await getCompanyAccountForEdit();
        if (result.success) {
          setFormData(prev => ({
            ...prev,
            companyName: result.data.companyName || 'テキストが入ります。',
            representative: {
              position: prev.representative.position,
              name: result.data.representativeName || '',
            },
            industries: result.data.industries || [],
            businessContent: result.data.companyOverview || '',
            location: result.data.location || { prefecture: '', address: '' },
          }));
        }
      } finally {
        setLoading(false);
      }
    })();
  }, []);

  // モック画像削除ハンドラー
  const handleDeleteMockImage = (index: number) => {
    const newUrls = formData.currentImageUrls.filter((_, i) => i !== index);
    setFormData({ ...formData, currentImageUrls: newUrls });
  };

  // URL追加
  const addUrl = () => {
    if (formData.urls.length < 3) {
      setFormData({
        ...formData,
        urls: [...formData.urls, { title: '', url: '' }],
      });
    }
  };

  // URL削除
  const removeUrl = (index: number) => {
    const newUrls = formData.urls.filter((_, i) => i !== index);
    setFormData({ ...formData, urls: newUrls });
  };

  // 企業の魅力追加
  const addAttraction = () => {
    if (formData.attractions.length < 5) {
      setFormData({
        ...formData,
        attractions: [...formData.attractions, { title: '', content: '' }],
      });
    }
  };

  // 企業の魅力削除
  const removeAttraction = (index: number) => {
    const newAttractions = formData.attractions.filter((_, i) => i !== index);
    setFormData({ ...formData, attractions: newAttractions });
  };

  // 業種選択確定
  const handleIndustryConfirm = (selectedIndustries: Industry[]) => {
    setFormData({
      ...formData,
      industries: selectedIndustries,
    });
  };

  // 業種削除
  const removeIndustry = (industryId: string) => {
    setFormData({
      ...formData,
      industries: formData.industries.filter(i => i.id !== industryId),
    });
  };

  // バリデーション
  const validate = (): boolean => {
    const newErrors: Record<string, string> = {};

    if (
      !formData.representative.position?.trim() ||
      !formData.representative.name?.trim()
    ) {
      newErrors['representative'] = '代表者の役職名と氏名を入力してください。';
    }

    if (formData.industries.length === 0) {
      newErrors['industries'] = '業種を1つ以上選択してください。';
    }

    if (!formData.businessContent.trim()) {
      newErrors['businessContent'] = '事業内容を入力してください。';
    }

    if (!formData.location.prefecture || !formData.location.address.trim()) {
      newErrors['location'] = '所在地を入力してください。';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  // 保存処理
  const handleSave = async () => {
    if (!validate()) return;
    setSaving(true);
    try {
      const res = await saveCompanyAccountEdit({
        representativeName: formData.representative.name,
        industries: formData.industries,
        businessContent: formData.businessContent,
        location: formData.location,
      });
      if ('success' in res && res.success) {
        router.push('/company/account');
      } else {
        setErrors(prev => ({
          ...prev,
          submit: res.error || '保存に失敗しました',
        }));
      }
    } finally {
      setSaving(false);
    }
  };

  return (
    <>
      {/* ヘッダー */}
      <div
        className='bg-gradient-to-t from-[#17856f] to-[#229a4e] px-20 py-10'
        style={{
          background: 'linear-gradient(to top, #17856f, #229a4e)',
        }}
      >
        <div className='w-full max-w-[1200px] mx-auto'>
          <div className='flex items-center gap-2 mb-4'>
            <Link
              href='/company/account'
              className='text-white text-[14px] font-bold tracking-[1.4px]'
              style={{ fontFamily: 'Noto Sans JP, sans-serif' }}
            >
              企業アカウント情報
            </Link>
            <RightArrowIcon />
            <span
              className='text-white text-[14px] font-bold tracking-[1.4px]'
              style={{ fontFamily: 'Noto Sans JP, sans-serif' }}
            >
              企業アカウント情報編集
            </span>
          </div>
          <div className='flex items-center gap-4'>
            <AccountIcon />
            <h1
              className='text-white text-[24px] font-bold tracking-[2.4px]'
              style={{ fontFamily: 'Noto Sans JP, sans-serif' }}
            >
              企業アカウント情報編集
            </h1>
          </div>
        </div>
      </div>

      {/* メインコンテンツ */}
      <div className='bg-[#f9f9f9] px-20 pt-10 pb-20'>
        <div className='w-full max-w-[1200px] mx-auto'>
          {loading ? (
            <div className='bg-white rounded-[10px] p-10 text-[#323232]'>
              読み込み中...
            </div>
          ) : (
            <>
              {/* 編集フォーム */}
              <div className='bg-white rounded-[10px] p-10'>
                <div className='flex flex-col gap-2'>
                  {/* 企業名（編集不可） */}
                  <div className='flex gap-6'>
                    <div className='w-[200px] bg-[#f9f9f9] rounded-[5px] px-6 shrink-0 min-h-[80px] flex items-center'>
                      <div
                        className='text-[16px] font-bold text-[#323232] tracking-[1.6px]'
                        style={{ fontFamily: 'Noto Sans JP, sans-serif' }}
                      >
                        企業名
                      </div>
                    </div>
                    <div className='flex items-center py-6'>
                      <div
                        className='text-[16px] font-medium text-[#323232] tracking-[1.6px] leading-[2]'
                        style={{ fontFamily: 'Noto Sans JP, sans-serif' }}
                      >
                        {formData.companyName}
                      </div>
                    </div>
                  </div>

                  {/* URL */}
                  <div className='flex gap-6'>
                    <div className='w-[200px] bg-[#f9f9f9] rounded-[5px] px-6 shrink-0 min-h-[80px] flex items-center'>
                      <div
                        className='text-[16px] font-bold text-[#323232] tracking-[1.6px]'
                        style={{ fontFamily: 'Noto Sans JP, sans-serif' }}
                      >
                        URL
                      </div>
                    </div>
                    <div className='flex-1 py-6'>
                      <div className='flex flex-col gap-4'>
                        {formData.urls.map((url, index) => (
                          <div key={index} className='flex items-center gap-2'>
                            <input
                              type='text'
                              placeholder='URLタイトルを入力'
                              className='flex-1 px-4 py-2 border border-[#999] rounded-[5px] max-w-100'
                              value={url.title || ''}
                              onChange={e => {
                                const newUrls = [...formData['urls']];
                                const current = newUrls[index] ?? {
                                  title: '',
                                  url: '',
                                };
                                newUrls[index] = {
                                  ...current,
                                  title: e.target.value,
                                };
                                setFormData({ ...formData, urls: newUrls });
                              }}
                            />
                            <input
                              type='text'
                              placeholder='https://'
                              className='flex-1 px-4 py-2 border border-[#999] rounded-[5px] max-w-100'
                              value={url.url || ''}
                              onChange={e => {
                                const newUrls = [...formData['urls']];
                                const current = newUrls[index] ?? {
                                  title: '',
                                  url: '',
                                };
                                newUrls[index] = {
                                  ...current,
                                  url: e.target.value,
                                };
                                setFormData({ ...formData, urls: newUrls });
                              }}
                            />
                            <button
                              type='button'
                              onClick={() => removeUrl(index)}
                            >
                              <CloseIcon />
                            </button>
                          </div>
                        ))}
                        {formData.urls.length < 3 && (
                          <Button
                            type='button'
                            variant='green-outline'
                            size='figma-default'
                            onClick={addUrl}
                            className='w-fit border-[#0f9058] text-[#0f9058]'
                          >
                            <PlusIcon />
                            <span className='ml-2'>URLを追加</span>
                          </Button>
                        )}
                      </div>
                    </div>
                  </div>

                  {/* アイコン画像 */}
                  <div className='flex gap-6'>
                    <div className='w-[200px] bg-[#f9f9f9] rounded-[5px] px-6 shrink-0 min-h-[80px] flex items-center'>
                      <div
                        className='text-[16px] font-bold text-[#323232] tracking-[1.6px]'
                        style={{ fontFamily: 'Noto Sans JP, sans-serif' }}
                      >
                        アイコン画像
                      </div>
                    </div>
                    <div className='flex items-start py-6'>
                      <div className='flex flex-col items-center gap-1'>
                        <div className='w-[120px] h-[120px] rounded-full overflow-hidden relative group cursor-pointer'>
                          {/* 画像表示 */}
                          {(formData.iconImage || formData.currentIconUrl) && (
                            <Image
                              src={
                                formData.iconImage
                                  ? URL.createObjectURL(formData.iconImage)
                                  : formData.currentIconUrl || ''
                              }
                              alt='アイコン'
                              fill
                              className='object-cover'
                            />
                          )}
                          {/* 「画像を変更」オーバーレイ */}
                          <label
                            htmlFor='icon-upload'
                            className='absolute inset-0 bg-[#32323240] flex items-center justify-center opacity-100 group-hover:opacity-100 transition-opacity cursor-pointer'
                          >
                            <span
                              className='text-white text-[14px] font-bold tracking-[1.4px] drop-shadow'
                              style={{ fontFamily: 'Noto Sans JP, sans-serif' }}
                            >
                              画像を変更
                            </span>
                          </label>
                        </div>
                        <input
                          type='file'
                          accept='image/*'
                          className='hidden'
                          id='icon-upload'
                          onChange={async e => {
                            const file = e.target.files?.[0];
                            if (!file) return;
                            setUploading(true);
                            try {
                              const fd = new FormData();
                              fd.append('icon', file);
                              const res = await uploadCompanyAccountIconAction(fd);
                              if ('success' in res && res.success) {
                                setFormData({ ...formData, iconImage: file, currentIconUrl: res.url });
                              } else {
                                setErrors(prev => ({ ...prev, submit: res.error || 'アイコンのアップロードに失敗しました' }));
                              }
                            } finally {
                              setUploading(false);
                            }
                          }}
                        />
                        {/* 画像を削除リンク */}
                        {(formData.iconImage || formData.currentIconUrl) && (
                          <button
                            type='button'
                            onClick={() =>
                              setFormData({
                                ...formData,
                                iconImage: null,
                                currentIconUrl: null,
                              })
                            }
                            className='text-[#ff5b5b] text-[10px] font-bold underline tracking-[1px] cursor-pointer'
                            style={{ fontFamily: 'Noto Sans JP, sans-serif' }}
                          >
                            画像を削除
                          </button>
                        )}
                      </div>
                    </div>
                  </div>

                  {/* 代表者 */}
                  <div className='flex gap-6'>
                    <div className='w-[200px] bg-[#f9f9f9] rounded-[5px] px-6 shrink-0 min-h-[80px] flex items-center'>
                      <div
                        className='text-[16px] font-bold text-[#323232] tracking-[1.6px]'
                        style={{ fontFamily: 'Noto Sans JP, sans-serif' }}
                      >
                        代表者
                      </div>
                    </div>
                    <div className='flex-1 py-6'>
                      <div className='flex items-center gap-2'>
                        <input
                          type='text'
                          placeholder='代表者役職名を入力'
                          className='px-4 py-2 border border-[#999] rounded-[5px] w-100'
                          value={formData.representative.position}
                          onChange={e =>
                            setFormData({
                              ...formData,
                              representative: {
                                ...formData['representative'],
                                position: e.target.value,
                              },
                            })
                          }
                        />
                        <input
                          type='text'
                          placeholder='代表者名を入力'
                          className='px-4 py-2 border border-[#999] rounded-[5px] w-100'
                          value={formData.representative.name}
                          onChange={e =>
                            setFormData({
                              ...formData,
                              representative: {
                                ...formData['representative'],
                                name: e.target.value,
                              },
                            })
                          }
                        />
                      </div>
                      {errors['representative'] && (
                        <p className='text-red-500 text-sm mt-1'>
                          {errors['representative']}
                        </p>
                      )}
                    </div>
                  </div>

                  {/* 設立年 */}
                  <div className='flex gap-6'>
                    <div className='w-[200px] bg-[#f9f9f9] rounded-[5px] px-6 shrink-0 min-h-[80px] flex items-center'>
                      <div
                        className='text-[16px] font-bold text-[#323232] tracking-[1.6px]'
                        style={{ fontFamily: 'Noto Sans JP, sans-serif' }}
                      >
                        設立年
                      </div>
                    </div>
                    <div className='flex items-center py-6 gap-2'>
                      <input
                        type='text'
                        placeholder='2020'
                        className='w-[376px] px-4 py-2 border border-[#999] rounded-[5px] '
                        value={formData.establishedYear}
                        onChange={e => {
                          const value = e.target.value.replace(/[^0-9]/g, '');
                          setFormData({ ...formData, establishedYear: value });
                        }}
                      />
                      <span
                        className='text-[16px] font-bold text-[#323232] tracking-[1.6px]'
                        style={{ fontFamily: 'Noto Sans JP, sans-serif' }}
                      >
                        年
                      </span>
                    </div>
                  </div>

                  {/* 資本金 */}
                  <div className='flex gap-6'>
                    <div className='w-[200px] bg-[#f9f9f9] rounded-[5px] px-6 shrink-0 min-h-[80px] flex items-center'>
                      <div
                        className='text-[16px] font-bold text-[#323232] tracking-[1.6px]'
                        style={{ fontFamily: 'Noto Sans JP, sans-serif' }}
                      >
                        資本金
                      </div>
                    </div>
                    <div className='flex items-center py-6 gap-2'>
                      <input
                        type='text'
                        placeholder='100'
                        className='w-[196px] px-4 py-2 border border-[#999] rounded-[5px]'
                        value={formData.capital.amount}
                        onChange={e => {
                          const value = e.target.value.replace(/[^0-9]/g, '');
                          setFormData({
                            ...formData,
                            capital: { ...formData.capital, amount: value },
                          });
                        }}
                      />
                      <SelectInput
                        options={[
                          { value: '万円', label: '万円' },
                          { value: '億円', label: '億円' },
                        ]}
                        value={formData.capital.unit}
                        className='w-[190px]'
                        onChange={value =>
                          setFormData({
                            ...formData,
                            capital: { ...formData.capital, unit: value },
                          })
                        }
                        placeholder='単位'
                      />
                    </div>
                  </div>

                  {/* 従業員数 */}
                  <div className='flex gap-6'>
                    <div className='w-[200px] bg-[#f9f9f9] rounded-[5px] px-6 shrink-0 min-h-[80px] flex items-center'>
                      <div
                        className='text-[16px] font-bold text-[#323232] tracking-[1.6px]'
                        style={{ fontFamily: 'Noto Sans JP, sans-serif' }}
                      >
                        従業員数
                      </div>
                    </div>
                    <div className='flex items-center py-6 gap-2'>
                      <input
                        type='text'
                        placeholder='100'
                        className='w-[376px] px-4 py-2 border border-[#999] rounded-[5px]'
                        value={formData.employees}
                        onChange={e => {
                          const value = e.target.value.replace(/[^0-9]/g, '');
                          setFormData({ ...formData, employees: value });
                        }}
                      />
                      <span
                        className='text-[16px] font-bold text-[#323232] tracking-[1.6px]'
                        style={{ fontFamily: 'Noto Sans JP, sans-serif' }}
                      >
                        人
                      </span>
                    </div>
                  </div>

                  {/* 業種 */}
                  <div className='flex gap-6'>
                    <div className='w-[200px] bg-[#f9f9f9] rounded-[5px] px-6 shrink-0 min-h-[80px] flex items-center'>
                      <div
                        className='text-[16px] font-bold text-[#323232] tracking-[1.6px]'
                        style={{ fontFamily: 'Noto Sans JP, sans-serif' }}
                      >
                        業種
                      </div>
                    </div>
                    <div className='flex-1 py-6'>
                      <div className='flex flex-col gap-2'>
                        <button
                          type='button'
                          onClick={() => setIsIndustryModalOpen(true)}
                          className='w-[160px] h-[50px] flex items-center justify-center bg-white border border-[#999999] rounded-[32px] text-[16px] text-[#323232] font-bold tracking-[1.6px] hover:bg-gray-100 transition-colors'
                          style={{ fontFamily: 'Noto Sans JP, sans-serif' }}
                        >
                          業種を選択
                        </button>
                        <div className='flex flex-wrap gap-2'>
                          {formData.industries.map(industry => (
                            <div
                              key={industry.id}
                              className='inline-flex items-center'
                            >
                              <span className='bg-[#d2f1da] text-[#0f9058] text-[14px] font-bold tracking-[1.4px] h-[40px] flex items-center px-6 rounded-l-[10px]'>
                                {industry.name}
                              </span>
                              <button
                                type='button'
                                onClick={() => removeIndustry(industry.id)}
                                className='bg-[#d2f1da] flex items-center justify-center w-10 h-[40px] rounded-r-[10px]'
                              >
                                <svg
                                  width='13'
                                  height='12'
                                  viewBox='0 0 13 12'
                                  fill='none'
                                  xmlns='http://www.w3.org/2000/svg'
                                >
                                  <path
                                    d='M0.707031 0.206055C0.98267 -0.0694486 1.42952 -0.0695749 1.70508 0.206055L6.50098 5.00293L11.2969 0.206055C11.5725 -0.0692376 12.0194 -0.0695109 12.2949 0.206055C12.5705 0.481731 12.5705 0.929373 12.2949 1.20508L7.49902 6.00195L12.291 10.7949L12.3154 10.8213C12.5657 11.0984 12.5579 11.5259 12.291 11.793C12.0241 12.06 11.5964 12.0685 11.3193 11.8184L11.293 11.793L6.50098 7L1.70898 11.7939L1.68262 11.8193C1.40561 12.0697 0.977947 12.0609 0.710938 11.7939C0.443995 11.5269 0.4354 11.0994 0.685547 10.8223L0.710938 10.7959L5.50293 6.00098L0.707031 1.2041C0.431408 0.928409 0.431408 0.481747 0.707031 0.206055Z'
                                    fill='#0F9058'
                                  />
                                </svg>
                              </button>
                            </div>
                          ))}
                        </div>
                      </div>
                      {errors['industries'] && (
                        <p className='text-red-500 text-sm mt-1'>
                          {errors['industries']}
                        </p>
                      )}
                    </div>
                  </div>

                  {/* 事業内容 */}
                  <div className='flex gap-6'>
                    <div className='w-[200px] bg-[#f9f9f9] rounded-[5px] px-6 shrink-0 min-h-[80px] flex items-center'>
                      <div
                        className='text-[16px] font-bold text-[#323232] tracking-[1.6px]'
                        style={{ fontFamily: 'Noto Sans JP, sans-serif' }}
                      >
                        事業内容
                      </div>
                    </div>
                    <div className='flex-1 py-6'>
                      <textarea
                        placeholder='事業内容を入力'
                        className='w-full px-4 py-2 border border-[#999] rounded-[5px] resize-none h-[120px]'
                        value={formData.businessContent}
                        onChange={e =>
                          setFormData({
                            ...formData,
                            businessContent: e.target.value,
                          })
                        }
                      />
                      {errors['businessContent'] && (
                        <p className='text-red-500 text-sm mt-1'>
                          {errors['businessContent']}
                        </p>
                      )}
                    </div>
                  </div>

                  {/* 所在地 */}
                  <div className='flex gap-6'>
                    <div className='w-[200px] bg-[#f9f9f9] rounded-[5px] px-6 shrink-0 min-h-[80px] flex items-center'>
                      <div
                        className='text-[16px] font-bold text-[#323232] tracking-[1.6px]'
                        style={{ fontFamily: 'Noto Sans JP, sans-serif' }}
                      >
                        所在地
                      </div>
                    </div>
                    <div className='flex-1 py-6'>
                      <div className='flex flex-col gap-2'>
                        <SelectInput
                          options={prefectures.map(p => ({
                            value: p,
                            label: p,
                          }))}
                          value={formData.location.prefecture}
                          className='max-w-100'
                          onChange={value =>
                            setFormData({
                              ...formData,
                              location: {
                                ...formData.location,
                                prefecture: value,
                              },
                            })
                          }
                          placeholder='都道府県を選択'
                        />
                        <input
                          type='text'
                          placeholder='所在地を入力'
                          className='w-full px-4 py-2 border border-[#999] rounded-[5px]'
                          value={formData.location.address}
                          onChange={e =>
                            setFormData({
                              ...formData,
                              location: {
                                ...formData.location,
                                address: e.target.value,
                              },
                            })
                          }
                        />
                      </div>
                      {errors['location'] && (
                        <p className='text-red-500 text-sm mt-1'>
                          {errors['location']}
                        </p>
                      )}
                    </div>
                  </div>

                  {/* 企業フェーズ */}
                  <div className='flex gap-6'>
                    <div className='w-[200px] bg-[#f9f9f9] rounded-[5px] px-6 shrink-0 min-h-[80px] flex items-center'>
                      <div
                        className='text-[16px] font-bold text-[#323232] tracking-[1.6px]'
                        style={{ fontFamily: 'Noto Sans JP, sans-serif' }}
                      >
                        企業フェーズ
                      </div>
                    </div>
                    <div className='flex-1 py-6'>
                      <SelectInput
                        options={companyPhases.map(p => ({
                          value: p,
                          label: p,
                        }))}
                        value={formData.companyPhase}
                        className='max-w-100'
                        onChange={value =>
                          setFormData({ ...formData, companyPhase: value })
                        }
                        placeholder='未選択'
                      />
                    </div>
                  </div>

                  {/* イメージ画像 */}
                  <div className='flex gap-6'>
                    <div className='w-[200px] bg-[#f9f9f9] rounded-[5px] px-6 shrink-0 min-h-[80px] flex items-center'>
                      <div
                        className='text-[16px] font-bold text-[#323232] tracking-[1.6px]'
                        style={{ fontFamily: 'Noto Sans JP, sans-serif' }}
                      >
                        イメージ画像
                      </div>
                    </div>
                    <div className='flex-1 py-6'>
                      <div className='flex flex-wrap gap-4'>
                        {/* 既存画像の表示 */}
                        {formData.currentImageUrls.map((url, index) => (
                          <div
                            key={index}
                            className='relative border rounded overflow-visible bg-gray-100 flex items-center justify-center group cursor-pointer'
                            style={{ width: '200px', height: '133px' }}
                          >
                            <input
                              type='file'
                              accept='image/*'
                              className='hidden'
                              id={`image-change-${index}`}
                              onChange={e => {
                                const file = e.target.files?.[0];
                                if (file) {
                                  // 既存画像を削除して、新しい画像を追加
                                  const newUrls =
                                    formData.currentImageUrls.filter(
                                      (_, i) => i !== index
                                    );
                                  const newImages = [...formData.images, file];
                                  setFormData({
                                    ...formData,
                                    currentImageUrls: newUrls,
                                    images: newImages,
                                  });
                                }
                              }}
                            />
                            <label
                              htmlFor={`image-change-${index}`}
                              className='absolute inset-0'
                            >
                              <Image
                                src={url}
                                alt={`イメージ画像${index + 1}`}
                                fill
                                className='object-cover rounded'
                              />
                              {/* ホバー時のオーバーレイ */}
                              <div className='absolute inset-0 bg-[#32323280] opacity-0 group-hover:opacity-100 transition-opacity rounded flex items-center justify-center cursor-pointer'>
                                <span
                                  className='text-white text-[14px] font-bold tracking-[1.4px]'
                                  style={{
                                    fontFamily: 'Noto Sans JP, sans-serif',
                                  }}
                                >
                                  画像を変更
                                </span>
                              </div>
                            </label>
                            <button
                              type='button'
                              className='flex w-6 h-6 justify-center items-center gap-2.5 aspect-square absolute -right-2 -top-2 rounded-2xl bg-[#0F9058] text-white hover:bg-opacity-80 z-10'
                              onClick={e => {
                                e.stopPropagation();
                                handleDeleteMockImage(index);
                              }}
                              aria-label='画像を削除'
                            >
                              ×
                            </button>
                          </div>
                        ))}
                        {/* 新規アップロード画像 */}
                        {formData.images.map((file, index) => {
                          const url = URL.createObjectURL(file);
                          return (
                            <div
                              key={`new-${index}`}
                              className='relative border rounded overflow-visible bg-gray-100 flex items-center justify-center'
                              style={{ width: '200px', height: '133px' }}
                            >
                              <Image
                                src={url}
                                alt={`新規画像${index + 1}`}
                                fill
                                className='object-cover rounded'
                              />
                              <button
                                type='button'
                                className='flex w-6 h-6 justify-center items-center gap-2.5 aspect-square absolute -right-2 -top-2 rounded-2xl bg-[#0F9058] text-white hover:bg-opacity-80 z-10'
                                onClick={() => {
                                  const newImages = formData.images.filter(
                                    (_, i) => i !== index
                                  );
                                  setFormData({
                                    ...formData,
                                    images: newImages,
                                  });
                                }}
                                aria-label='画像を削除'
                              >
                                ×
                              </button>
                            </div>
                          );
                        })}
                        {/* 画像追加ボタン（合計3枚まで） */}
                        {formData.currentImageUrls.length +
                          formData.images.length <
                          3 && (
                          <ImageUpload
                            images={[]}
                            onChange={async newFiles => {
                              const totalCount = formData.currentImageUrls.length + formData.images.length;
                              const availableSlots = 3 - totalCount;
                              const filesToAdd = newFiles.slice(0, availableSlots);
                              if (filesToAdd.length === 0) return;
                              setUploading(true);
                              try {
                                const fd = new FormData();
                                for (const f of filesToAdd) fd.append('images', f);
                                const res = await uploadCompanyAccountImagesAction(fd);
                                if ('success' in res && res.success) {
                                  setFormData({
                                    ...formData,
                                    images: [...formData.images, ...filesToAdd],
                                    currentImageUrls: [
                                      ...formData.currentImageUrls,
                                      ...res.files.map(f => f.url),
                                    ],
                                  });
                                } else {
                                  setErrors(prev => ({ ...prev, submit: res.error || '画像のアップロードに失敗しました' }));
                                }
                              } finally {
                                setUploading(false);
                              }
                            }}
                            maxImages={1}
                          />
                        )}
                      </div>
                    </div>
                  </div>

                  {/* 企業の魅力 */}
                  <div className='flex gap-6'>
                    <div className='w-[200px] bg-[#f9f9f9] rounded-[5px] px-6 shrink-0 min-h-[80px] flex items-center'>
                      <div
                        className='text-[16px] font-bold text-[#323232] tracking-[1.6px]'
                        style={{ fontFamily: 'Noto Sans JP, sans-serif' }}
                      >
                        企業の魅力
                      </div>
                    </div>
                    <div className='flex-1 py-6'>
                      <div className='flex flex-col gap-6'>
                        {formData.attractions.map((attraction, index) => (
                          <div key={index} className='flex flex-col gap-2'>
                            <input
                              type='text'
                              placeholder='見出しテキストを入力'
                              className='w-full px-4 py-2 border border-[#999] rounded-[5px]'
                              value={attraction.title}
                              onChange={e => {
                                const newAttractions = [
                                  ...formData['attractions'],
                                ];
                                const current = newAttractions[index] ?? {
                                  title: '',
                                  content: '',
                                };
                                newAttractions[index] = {
                                  ...current,
                                  title: e.target.value,
                                };
                                setFormData({
                                  ...formData,
                                  attractions: newAttractions,
                                });
                              }}
                            />
                            <textarea
                              placeholder='事業内容や社風、現状について自由にご記入ください。'
                              className='w-full px-4 py-2 border border-[#999] rounded-[5px] resize-none h-[120px]'
                              value={attraction.content}
                              onChange={e => {
                                const newAttractions = [
                                  ...formData['attractions'],
                                ];
                                const current = newAttractions[index] ?? {
                                  title: '',
                                  content: '',
                                };
                                newAttractions[index] = {
                                  ...current,
                                  content: e.target.value,
                                };
                                setFormData({
                                  ...formData,
                                  attractions: newAttractions,
                                });
                              }}
                            />
                            {formData.attractions.length > 1 && (
                              <button
                                type='button'
                                onClick={() => removeAttraction(index)}
                                className='text-red-500 text-sm hover:underline self-end'
                              >
                                削除
                              </button>
                            )}
                          </div>
                        ))}
                        {formData.attractions.length < 5 && (
                          <Button
                            type='button'
                            variant='green-outline'
                            size='figma-default'
                            className='border-[#0f9058] text-[#0f9058] min-w-[120px] px-6 py-2.5 transition-colors w-fit'
                            onClick={addAttraction}
                          >
                            <PlusIcon />
                            <span className='ml-2'>企業の魅力を追加</span>
                          </Button>
                        )}
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </>
          )}

          {/* ボタンエリア */}
          <div className='flex justify-center gap-4 mt-10'>
            <Button
              variant='green-outline'
              size='figma-default'
              onClick={() => router.push('/company/account')}
              className='min-w-[160px] px-10 border-[#0f9058] text-[#0f9058]'
            >
              キャンセル
            </Button>
            <Button
              variant='green-gradient'
              size='figma-default'
              onClick={handleSave}
              className='min-w-[160px] px-10'
              disabled={
                !formData.representative.position ||
                !formData.representative.name ||
                formData.industries.length === 0 ||
                !formData.businessContent ||
                !formData.location.prefecture ||
                !formData.location.address ||
                saving || uploading ||
                loading
              }
            >
              {saving ? '保存中...' : uploading ? 'アップロード中...' : '保存する'}
            </Button>
          </div>
        </div>
      </div>

      {/* 業種選択モーダル - IndustrySelectModalコンポーネント使用 */}
      <IndustrySelectModal
        isOpen={isIndustryModalOpen}
        onClose={() => setIsIndustryModalOpen(false)}
        onConfirm={(names: string[]) => {
          // names は業種名の配列。定義済みIndustryへ変換
          const mapToIndustry = (name: string): Industry => ({
            id: name,
            name,
          });
          handleIndustryConfirm(names.map(mapToIndustry));
        }}
        initialSelected={formData.industries.map(i => i.name)}
        maxSelections={3}
      />
    </>
  );
}
