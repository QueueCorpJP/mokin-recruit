'use client';

import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import CryptoJS from 'crypto-js';
import IndustrySelectModal from '@/components/career-status/IndustrySelectModal';
import { AdminButton } from '@/components/admin/ui/AdminButton';
import { ActionButton } from '@/components/admin/ui/ActionButton';
import { SelectInput } from '@/components/ui/select-input';

// フォームデータの型定義
interface CompanyFormData {
  companyId: string;
  plan: string;
  companyName: string;
  urls: Array<{
    title: string;
    url: string;
  }>;
  iconImage: File | null;
  representativePosition: string;
  representativeName: string;
  establishedYear: string;
  capital: string;
  capitalUnit: string;
  employeeCount: string;
  industries: string[];
  businessContent: string;
  prefecture: string;
  address: string;
  companyPhase: string;
  images: File[];
  attractions: Array<{
    title: string;
    description: string;
  }>;
}

// 業種選択は既存のIndustryModalを使用するため、このオプションは削除

// プランのオプション
const planOptions = [
  { value: 'プラン加入なし', label: 'プラン加入なし' },
  { value: 'スタンダード', label: 'スタンダード' },
  { value: 'ストラテジック', label: 'ストラテジック' },
];

// 都道府県のオプション
const prefectureOptions = [
  '北海道',
  '青森県',
  '岩手県',
  '宮城県',
  '秋田県',
  '山形県',
  '福島県',
  '茨城県',
  '栃木県',
  '群馬県',
  '埼玉県',
  '千葉県',
  '東京都',
  '神奈川県',
  '新潟県',
  '富山県',
  '石川県',
  '福井県',
  '山梨県',
  '長野県',
  '岐阜県',
  '静岡県',
  '愛知県',
  '三重県',
  '滋賀県',
  '京都府',
  '大阪府',
  '兵庫県',
  '奈良県',
  '和歌山県',
  '鳥取県',
  '島根県',
  '岡山県',
  '広島県',
  '山口県',
  '徳島県',
  '香川県',
  '愛媛県',
  '高知県',
  '福岡県',
  '佐賀県',
  '長崎県',
  '熊本県',
  '大分県',
  '宮崎県',
  '鹿児島県',
  '沖縄県',
];

// 企業フェーズのオプション（database.mdの制約に合わせて修正）
const companyPhaseOptions = [
  'スタートアップ（創業初期・社員数50名規模）',
  'スタートアップ（成長中・シリーズB以降）',
  'メガベンチャー（急成長・未上場）',
  '上場ベンチャー（マザーズ等上場済）',
  '中堅企業（~1000名規模）',
  '上場企業（プライム・スタンダード等）',
  '大企業（グローバル展開・数千名規模）',
];

export default function CompanyNewClient() {
  const router = useRouter();

  // 企業IDの自動生成
  const generateCompanyId = () => {
    const timestamp = Date.now().toString(36);
    const random = Math.random().toString(36).substring(2, 8);
    return `COMP-${timestamp}-${random}`.toUpperCase();
  };

  const [formData, setFormData] = useState<CompanyFormData>({
    companyId: '',
    plan: '',
    companyName: '',
    urls: [{ title: '', url: '' }],
    iconImage: null,
    representativePosition: '',
    representativeName: '',
    establishedYear: '',
    capital: '',
    capitalUnit: '万円',
    employeeCount: '',
    industries: [],
    businessContent: '',
    prefecture: '',
    address: '',
    companyPhase: '',
    images: [],
    attractions: [
      { title: '', description: '' },
      { title: '', description: '' },
    ],
  });

  // クライアント側でのみ企業IDを生成
  useEffect(() => {
    if (formData.companyId === '') {
      setFormData(prev => ({ ...prev, companyId: generateCompanyId() }));
    }
  }, [formData.companyId]);

  // 業種選択モーダルの状態管理
  const [isIndustryModalOpen, setIsIndustryModalOpen] = useState(false);

  // 業種選択ハンドラー
  const handleIndustryConfirm = (industries: string[]) => {
    setFormData(prev => ({ ...prev, industries }));
    setIsIndustryModalOpen(false);
  };

  // 業種の削除（選択された業種から個別に削除）
  const removeIndustry = (industry: string) => {
    setFormData(prev => ({
      ...prev,
      industries: prev.industries.filter(i => i !== industry),
    }));
  };

  // 企業の魅力の追加
  const addAttraction = () => {
    setFormData(prev => ({
      ...prev,
      attractions: [...prev.attractions, { title: '', description: '' }],
    }));
  };

  const updateAttraction = (
    index: number,
    field: 'title' | 'description',
    value: string
  ) => {
    setFormData(prev => ({
      ...prev,
      attractions: prev.attractions.map((attraction, i) =>
        i === index ? { ...attraction, [field]: value } : attraction
      ),
    }));
  };

  // URLの追加
  const addUrl = () => {
    setFormData(prev => ({
      ...prev,
      urls: [...prev.urls, { title: '', url: '' }],
    }));
  };

  // URLの削除
  const removeUrl = (index: number) => {
    if (formData.urls.length > 1) {
      setFormData(prev => ({
        ...prev,
        urls: prev.urls.filter((_, i) => i !== index),
      }));
    }
  };

  // URLの更新
  const updateUrl = (index: number, field: 'title' | 'url', value: string) => {
    setFormData(prev => ({
      ...prev,
      urls: prev.urls.map((url, i) =>
        i === index ? { ...url, [field]: value } : url
      ),
    }));
  };

  // 画像アップロード処理
  const handleImageUpload = (
    file: File,
    type: 'icon' | 'images',
    index?: number
  ) => {
    if (type === 'icon') {
      setFormData(prev => ({ ...prev, iconImage: file }));
    } else if (type === 'images' && index !== undefined) {
      const newImages = [...formData.images];
      newImages[index] = file;
      setFormData(prev => ({ ...prev, images: newImages }));
    }
  };

  // ファイル選択ハンドラー
  const handleFileSelect = (
    event: React.ChangeEvent<HTMLInputElement>,
    type: 'icon' | 'images',
    index?: number
  ) => {
    const file = event.target.files?.[0];
    if (file) {
      handleImageUpload(file, type, index);
    }
  };

  // フォームデータ暗号化用関数
  function encryptData(data: any, key: string): string {
    const stringData = typeof data === 'string' ? data : JSON.stringify(data);
    return CryptoJS.AES.encrypt(stringData, key).toString();
  }

  const handleSubmit = () => {
    // フォームデータをセッションストレージに保存して確認画面に渡す
    if (typeof window !== 'undefined') {
      // In production, use a secure key based on authenticated user/session
      const encryptionKey = 'company-form-secret-key';
      const encryptedData = encryptData(formData, encryptionKey);
      sessionStorage.setItem('companyFormData', encryptedData);
    }
    router.push('/admin/company/new/confirm');
  };

  return (
    <div className='max-w-4xl mx-auto space-y-4 p-6'>
      {/* 企業ID */}
      <div className='flex items-center gap-6 py-3'>
        <label className="block font-['Noto_Sans_JP'] text-[16px] font-bold text-[#323232] leading-[1.6] tracking-[1.6px] w-40">
          企業ID
        </label>
        <div className="font-['Noto_Sans_JP'] text-[16px] font-medium text-[#323232] leading-[1.6] tracking-[1.6px] font-mono">
          {formData.companyId}
        </div>
      </div>

      <hr className='border-gray-300' />

      {/* プラン */}
      <div className='flex items-center gap-6 py-3'>
        <label className="block font-['Noto_Sans_JP'] text-[16px] font-bold text-[#323232] leading-[1.6] tracking-[1.6px] w-40">
          プラン
        </label>
        <SelectInput
          options={[
            { value: '', label: 'プランを選択してください' },
            ...planOptions,
          ]}
          value={formData.plan}
          onChange={value => setFormData(prev => ({ ...prev, plan: value }))}
          placeholder='プランを選択してください'
          radius={5}
        />
      </div>

      <hr className='border-gray-300' />

      {/* 企業名 */}
      <div className='flex items-center gap-6 py-3'>
        <label className="block font-['Noto_Sans_JP'] text-[16px] font-bold text-[#323232] leading-[1.6] tracking-[1.6px] w-40">
          企業名
        </label>
        <input
          type='text'
          value={formData.companyName}
          onChange={e =>
            setFormData(prev => ({ ...prev, companyName: e.target.value }))
          }
          placeholder='株式会社サンプル企業'
          className="flex-1 px-[11px] py-[11px] bg-white border border-[#999999] rounded-[5px] text-[16px] text-[#323232] font-medium tracking-[1.6px] font-['Noto_Sans_JP'] focus:outline-none focus:border-[#0F9058] placeholder:text-[#999999]"
        />
      </div>

      <hr className='border-gray-300' />

      {/* URL */}
      <div className='flex items-start gap-6 py-3'>
        <label className="block font-['Noto_Sans_JP'] text-[16px] font-bold text-[#323232] leading-[1.6] tracking-[1.6px] w-40 mt-2">
          URL
        </label>
        <div className='flex-1 space-y-3'>
          {formData.urls.map((url, index) => (
            <div key={index} className='flex items-center gap-3'>
              {/* 削除ボタン（2行目以降のみ表示） */}
              {formData.urls.length > 1 && (
                <ActionButton
                  onClick={() => removeUrl(index)}
                  text='×'
                  variant='delete'
                  size='small'
                />
              )}
              {/* タイトル入力 */}
              <input
                type='text'
                value={url.title}
                onChange={e => updateUrl(index, 'title', e.target.value)}
                placeholder='コーポレートサイト'
                className="flex-1 py-[11px] rounded-[5px] text-[16px] text-[#323232] font-medium tracking-[1.6px] font-['Noto_Sans_JP'] placeholder:text-[#999999]"
              />

              {/* URL入力 */}
              <input
                type='text'
                value={url.url}
                onChange={e => updateUrl(index, 'url', e.target.value)}
                placeholder='https://example.com'
                className="flex-1 py-[11px]  rounded-[5px] text-[16px] text-[#323232] font-medium tracking-[1.6px] font-['Noto_Sans_JP'] placeholder:text-[#999999]"
              />
            </div>
          ))}

          {/* 追加ボタン */}
          <AdminButton
            onClick={addUrl}
            text='+'
            variant='green-gradient'
            size='figma-small'
          />
        </div>
      </div>

      <hr className='border-gray-300' />

      {/* アイコン画像 */}
      <div className='flex items-center gap-6 py-3'>
        <label className="block font-['Noto_Sans_JP'] text-[16px] font-bold text-[#323232] leading-[1.6] tracking-[1.6px] w-40">
          アイコン画像
        </label>
        <div className='relative'>
          <div
            className='w-32 h-32 bg-gray-600 rounded-full flex items-center justify-center cursor-pointer hover:bg-gray-500 transition-colors'
            onClick={() => document.getElementById('icon-file-input')?.click()}
          >
            {formData.iconImage ? (
              // eslint-disable-next-line @next/next/no-img-element
              <img
                src={URL.createObjectURL(formData.iconImage)}
                alt='アイコン画像'
                className='w-32 h-32 rounded-full object-cover'
              />
            ) : (
              <div className='text-center'>
                <div className='text-sm font-bold text-white'>画像を</div>
                <div className='text-sm font-bold text-white'>追加</div>
              </div>
            )}
          </div>
          <input
            id='icon-file-input'
            type='file'
            accept='image/*'
            onChange={e => handleFileSelect(e, 'icon')}
            className='hidden'
            aria-label='アイコン画像ファイル選択'
          />
        </div>
      </div>

      <hr className='border-gray-300' />

      {/* 代表者 */}
      <div className='flex items-center gap-6 py-3'>
        <label className="block font-['Noto_Sans_JP'] text-[16px] font-bold text-[#323232] leading-[1.6] tracking-[1.6px] w-40">
          代表者
        </label>
        <div className='flex-1 flex gap-3'>
          <input
            type='text'
            value={formData.representativePosition}
            onChange={e =>
              setFormData(prev => ({
                ...prev,
                representativePosition: e.target.value,
              }))
            }
            placeholder='代表取締役社長'
            className="flex-1 px-[11px] py-[11px] bg-white border border-[#999999] rounded-[5px] text-[16px] text-[#323232] font-medium tracking-[1.6px] font-['Noto_Sans_JP'] focus:outline-none focus:border-[#0F9058] placeholder:text-[#999999]"
          />
          <input
            type='text'
            value={formData.representativeName}
            onChange={e =>
              setFormData(prev => ({
                ...prev,
                representativeName: e.target.value,
              }))
            }
            placeholder='田中太郎'
            className="flex-1 px-[11px] py-[11px] bg-white border border-[#999999] rounded-[5px] text-[16px] text-[#323232] font-medium tracking-[1.6px] font-['Noto_Sans_JP'] focus:outline-none focus:border-[#0F9058] placeholder:text-[#999999]"
          />
        </div>
      </div>

      <hr className='border-gray-300' />

      {/* 設立 */}
      <div className='flex items-center gap-6 py-3'>
        <label className="block font-['Noto_Sans_JP'] text-[16px] font-bold text-[#323232] leading-[1.6] tracking-[1.6px] w-40">
          設立
        </label>
        <div className='flex items-center gap-2'>
          <input
            type='text'
            value={formData.establishedYear}
            onChange={e =>
              setFormData(prev => ({
                ...prev,
                establishedYear: e.target.value,
              }))
            }
            placeholder='2024'
            className="w-24 px-[11px] py-[11px] bg-white border border-[#999999] rounded-[5px] text-[16px] text-[#323232] font-medium tracking-[1.6px] font-['Noto_Sans_JP'] text-center focus:outline-none focus:border-[#0F9058]"
          />
          <span className="font-['Noto_Sans_JP'] text-[16px] font-medium text-[#323232] leading-[1.6] tracking-[1.6px]">
            年
          </span>
        </div>
      </div>

      <hr className='border-gray-300' />

      {/* 資本金 */}
      <div className='flex items-center gap-6 py-3'>
        <label className="block font-['Noto_Sans_JP'] text-[16px] font-bold text-[#323232] leading-[1.6] tracking-[1.6px] w-40">
          資本金
        </label>
        <div className='flex items-center gap-2'>
          <input
            type='text'
            value={formData.capital}
            onChange={e =>
              setFormData(prev => ({ ...prev, capital: e.target.value }))
            }
            placeholder='500'
            className="w-24 px-[11px] py-[11px] bg-white border border-[#999999] rounded-[5px] text-[16px] text-[#323232] font-medium tracking-[1.6px] font-['Noto_Sans_JP'] text-center focus:outline-none focus:border-[#0F9058]"
          />
          <SelectInput
            options={[
              { value: '万円', label: '万円' },
              { value: '円', label: '円' },
              { value: '千円', label: '千円' },
              { value: '億円', label: '億円' },
            ]}
            value={formData.capitalUnit}
            onChange={value =>
              setFormData(prev => ({ ...prev, capitalUnit: value }))
            }
            className='w-24'
          />
        </div>
      </div>

      <hr className='border-gray-300' />

      {/* 従業員数 */}
      <div className='flex items-center gap-6 py-3'>
        <label className="block font-['Noto_Sans_JP'] text-[16px] font-bold text-[#323232] leading-[1.6] tracking-[1.6px] w-40">
          従業員数
        </label>
        <div className='flex items-center gap-2'>
          <input
            type='text'
            value={formData.employeeCount}
            onChange={e =>
              setFormData(prev => ({ ...prev, employeeCount: e.target.value }))
            }
            placeholder='100'
            className="w-24 px-[11px] py-[11px] bg-white border border-[#999999] rounded-[5px] text-[16px] text-[#323232] font-medium tracking-[1.6px] font-['Noto_Sans_JP'] text-center focus:outline-none focus:border-[#0F9058]"
          />
          <span className="font-['Noto_Sans_JP'] text-[16px] font-medium text-[#323232] leading-[1.6] tracking-[1.6px]">
            人
          </span>
        </div>
      </div>

      <hr className='border-gray-300' />

      {/* 業種 */}
      <div className='flex items-start gap-6 py-3'>
        <label className="block font-['Noto_Sans_JP'] text-[16px] font-bold text-[#323232] leading-[1.6] tracking-[1.6px] w-40 mt-2">
          業種
        </label>
        <div className='flex-1 space-y-3'>
          <div className='flex flex-wrap gap-3'>
            <AdminButton
              onClick={() => setIsIndustryModalOpen(true)}
              text='+ 業種を追加'
              variant='green-outline'
            />
            {formData.industries.map((industry, index) => (
              <div
                key={index}
                className='px-6 py-2 bg-gray-100 rounded-full flex items-center gap-2'
              >
                <span className="font-['Noto_Sans_JP'] text-[16px] font-bold text-[#323232] leading-[1.6] tracking-[1.6px]">
                  {industry}
                </span>
                <ActionButton
                  onClick={() => removeIndustry(industry)}
                  text='×'
                  variant='delete'
                  size='small'
                />
              </div>
            ))}
          </div>
        </div>
      </div>

      <hr className='border-gray-300' />

      {/* 事業内容 */}
      <div className='flex items-start gap-6 py-3'>
        <label className="block font-['Noto_Sans_JP'] text-[16px] font-bold text-[#323232] leading-[1.6] tracking-[1.6px] w-40 mt-2">
          事業内容
        </label>
        <div className='flex-1 p-1 border border-[#999999] rounded-[5px]'>
          <textarea
            value={formData.businessContent}
            onChange={e =>
              setFormData(prev => ({
                ...prev,
                businessContent: e.target.value,
              }))
            }
            placeholder='当社はテクノロジーを活用したソリューションを提供する会社です。&#10;主な事業内容として、ソフトウェア開発、システムインテグレーション、&#10;コンサルティングサービスを行っています。'
            rows={4}
            className="w-full px-[11px] py-[11px] bg-white border-none rounded-[5px] text-[16px] text-[#323232] font-medium tracking-[1.6px] font-['Noto_Sans_JP'] resize-none focus:outline-none placeholder:text-[#999999]"
          />
        </div>
      </div>

      <hr className='border-gray-300' />

      {/* 所在地 */}
      <div className='flex items-start gap-6 py-3'>
        <label className="block font-['Noto_Sans_JP'] text-[16px] font-bold text-[#323232] leading-[1.6] tracking-[1.6px] w-40 mt-2">
          所在地
        </label>
        <div className='flex-1 space-y-3'>
          <SelectInput
            options={[
              { value: '', label: '都道府県を選択' },
              ...prefectureOptions.map(prefecture => ({
                value: prefecture,
                label: prefecture,
              })),
            ]}
            value={formData.prefecture}
            onChange={value =>
              setFormData(prev => ({ ...prev, prefecture: value }))
            }
            placeholder='都道府県を選択'
            radius={5}
          />
          <input
            type='text'
            value={formData.address}
            onChange={e =>
              setFormData(prev => ({ ...prev, address: e.target.value }))
            }
            placeholder='東京都千代田区丸の内1-1-1'
            className="w-full px-[11px] py-[11px] bg-white border border-[#999999] rounded-[5px] text-[16px] text-[#323232] font-medium tracking-[1.6px] font-['Noto_Sans_JP'] focus:outline-none focus:border-[#0F9058] placeholder:text-[#999999]"
          />
        </div>
      </div>

      <hr className='border-gray-300' />

      {/* 企業フェーズ */}
      <div className='flex items-center gap-6 py-3'>
        <label className="block font-['Noto_Sans_JP'] text-[16px] font-bold text-[#323232] leading-[1.6] tracking-[1.6px] w-40">
          企業フェーズ
        </label>
        <SelectInput
          options={[
            { value: '', label: '企業フェーズを選択' },
            ...companyPhaseOptions.map(phase => ({
              value: phase,
              label: phase,
            })),
          ]}
          value={formData.companyPhase}
          onChange={value =>
            setFormData(prev => ({ ...prev, companyPhase: value }))
          }
          placeholder='企業フェーズを選択'
          radius={5}
        />
      </div>

      <hr className='border-gray-300' />

      {/* イメージ画像 */}
      <div className='flex items-start gap-6 py-3'>
        <label className="block font-['Noto_Sans_JP'] text-[16px] font-bold text-[#323232] leading-[1.6] tracking-[1.6px] w-40 mt-2">
          イメージ画像
        </label>
        <div className='flex gap-4'>
          {[0, 1, 2].map(index => (
            <div key={index} className='relative'>
              <div
                className='w-48 h-32 bg-gray-400 flex items-center justify-center cursor-pointer hover:bg-gray-300 transition-colors'
                onClick={() =>
                  document.getElementById(`image-file-input-${index}`)?.click()
                }
              >
                {formData.images[index] ? (
                  // eslint-disable-next-line @next/next/no-img-element
                  <img
                    src={URL.createObjectURL(formData.images[index])}
                    alt={`イメージ画像 ${index + 1}`}
                    className='w-48 h-32 object-cover'
                  />
                ) : (
                  <div className='text-center'>
                    <div className='text-sm font-bold text-white'>画像を</div>
                    <div className='text-sm font-bold text-white'>追加</div>
                  </div>
                )}
              </div>
              <input
                id={`image-file-input-${index}`}
                type='file'
                accept='image/*'
                onChange={e => handleFileSelect(e, 'images', index)}
                className='hidden'
                aria-label={`イメージ画像${index + 1}ファイル選択`}
              />
            </div>
          ))}
        </div>
      </div>

      <hr className='border-gray-300' />

      {/* 企業の魅力 */}
      <div className='py-3'>
        <label className="block font-['Noto_Sans_JP'] text-[16px] font-bold text-[#323232] leading-[1.6] tracking-[1.6px] mb-4">
          企業の魅力
        </label>
        <div className='space-y-6'>
          {formData.attractions.map((attraction, index) => (
            <div key={index} className='space-y-4'>
              <input
                type='text'
                value={attraction.title}
                onChange={e => updateAttraction(index, 'title', e.target.value)}
                placeholder='スタートアップ企業'
                className="w-full px-[11px] py-[11px] bg-white border border-[#999999] rounded-[5px] text-[16px] text-[#323232] font-medium tracking-[1.6px] font-['Noto_Sans_JP'] focus:outline-none focus:border-[#0F9058] placeholder:text-[#999999]"
              />
              <div className='w-full p-1 border border-[#999999] rounded-[5px]'>
                <textarea
                  value={attraction.description}
                  onChange={e =>
                    updateAttraction(index, 'description', e.target.value)
                  }
                  placeholder='私たちはベンチャー企業として、革新的なテクノロジーと柔軟な働き方で成長を続けています。&#10;代表との距離が近く、裁量を持って働ける環境で、自分のアイデアを形にできます。&#10;福利厚生も充実しており、ワークライフバランスを大切にしています。'
                  rows={5}
                  className="w-full px-[11px] py-[11px] bg-white border-none rounded-[5px] text-[16px] text-[#323232] font-medium tracking-[1.6px] font-['Noto_Sans_JP'] resize-none focus:outline-none placeholder:text-[#999999]"
                />
              </div>
            </div>
          ))}
          <AdminButton
            onClick={addAttraction}
            text='+ 企業の魅力を追加'
            variant='green-outline'
          />
        </div>
      </div>

      {/* ボタン群 */}
      <div className='flex justify-center gap-6 pt-8'>
        <AdminButton text='キャンセル' variant='green-outline' />
        <AdminButton
          onClick={handleSubmit}
          text='確認する'
          variant='green-gradient'
        />
      </div>

      {/* 業種選択モーダル */}
      <IndustrySelectModal
        isOpen={isIndustryModalOpen}
        onClose={() => setIsIndustryModalOpen(false)}
        onConfirm={handleIndustryConfirm}
        initialSelected={formData.industries}
        maxSelections={5}
      />
    </div>
  );
}
