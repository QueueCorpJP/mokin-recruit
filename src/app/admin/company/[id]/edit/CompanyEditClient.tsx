'use client';

import React, { useState } from 'react';
import { useRouter } from 'next/navigation';
import { IndustryModal } from '@/app/company/job/IndustryModal';
// import { industryCategories } from '@/app/company/job/types';
import type { CompanyEditData } from './page';
import CompanyEditCompleteModal from '@/components/admin/CompanyEditCompleteModal';
import { updateCompanyData } from './actions';
import { AdminButton } from '@/components/admin/ui/AdminButton';
import { ActionButton } from '@/components/admin/ui/ActionButton';

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

// 企業フェーズのオプション
const companyPhaseOptions = [
  'スタートアップ',
  'アーリーステージ',
  'グロースステージ',
  'レイターステージ',
  '上場企業',
  '大手企業',
];

interface CompanyEditClientProps {
  company: CompanyEditData;
}

export default function CompanyEditClient({ company }: CompanyEditClientProps) {
  const router = useRouter();

  // 業種選択モーダルの状態
  const [industryModalOpen, setIndustryModalOpen] = useState(false);
  // 保存完了モーダルの状態
  const [saveCompleteModalOpen, setSaveCompleteModalOpen] = useState(false);
  // 保存中の状態
  const [isSaving, setIsSaving] = useState(false);
  // 保存エラー
  const [saveError, setSaveError] = useState<string | null>(null);

  const [formData, setFormData] = useState<CompanyFormData>({
    companyId: company.id,
    plan: company.plan || '',
    companyName: company.company_name,
    urls:
      company.company_urls && company.company_urls.length > 0
        ? company.company_urls.map((url: any) => ({
            title: url.title || '',
            url: url.url || '',
          }))
        : [{ title: '', url: '' }],
    iconImage: null,
    representativePosition:
      company.representative_position ||
      company.company_users[0]?.position_title ||
      '',
    representativeName: company.representative_name || '',
    establishedYear: company.established_year || '',
    capital: company.capital_amount || '',
    capitalUnit: company.capital_unit || '万円',
    employeeCount: company.employees_count || '',
    industries:
      company.industries && company.industries.length > 0
        ? company.industries
        : company.industry
          ? [company.industry]
          : [],
    businessContent: company.business_content || company.company_overview || '',
    prefecture: company.prefecture || '',
    address: company.address || company.headquarters_address || '',
    companyPhase: company.company_phase || '',
    images: [],
    attractions:
      company.company_attractions && company.company_attractions.length > 0
        ? company.company_attractions.map((attraction: any) => ({
            title: attraction.title || '',
            description: attraction.description || '',
          }))
        : [{ title: '', description: '' }],
  });

  // URL管理
  const addUrl = () => {
    setFormData(prev => ({
      ...prev,
      urls: [...prev.urls, { title: '', url: '' }],
    }));
  };

  const removeUrl = (index: number) => {
    if (formData.urls.length > 1) {
      setFormData(prev => ({
        ...prev,
        urls: prev.urls.filter((_, i) => i !== index),
      }));
    }
  };

  const updateUrl = (index: number, field: 'title' | 'url', value: string) => {
    setFormData(prev => ({
      ...prev,
      urls: prev.urls.map((url, i) =>
        i === index ? { ...url, [field]: value } : url
      ),
    }));
  };

  // 業種の追加・削除
  const _addIndustry = (industry: string) => {
    if (!formData.industries.includes(industry)) {
      setFormData(prev => ({
        ...prev,
        industries: [...prev.industries, industry],
      }));
    }
  };

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

  // 画像アップロード処理
  const _handleImageUpload = (file: File, type: 'icon' | 'images') => {
    if (type === 'icon') {
      setFormData(prev => ({ ...prev, iconImage: file }));
    } else {
      setFormData(prev => ({
        ...prev,
        images: [...prev.images, file].slice(0, 3), // 最大3枚まで
      }));
    }
  };

  const handleSubmit = async () => {
    setIsSaving(true);
    setSaveError(null);

    try {
      const result = await updateCompanyData(company.id, formData);

      if (result.success) {
        console.log('Company updated successfully:', result.company);
        // 保存完了モーダルを表示
        setSaveCompleteModalOpen(true);
      } else {
        setSaveError(result.error || '保存に失敗しました');
        console.error('Company update failed:', result.error);
      }
    } catch (error) {
      console.error('Save error:', error);
      setSaveError('保存中にエラーが発生しました');
    } finally {
      setIsSaving(false);
    }
  };

  const handleCancel = () => {
    router.push('/admin/company');
  };

  const handleSaveCompleteClose = () => {
    setSaveCompleteModalOpen(false);
    // モーダルを閉じるのみ - ページ遷移はモーダルのボタンで行う
  };

  return (
    <div className='max-w-4xl mx-auto space-y-4 p-6'>
      {/* 企業ID */}
      <div className='flex items-center gap-6 py-3'>
        <label className="block font-['Noto_Sans_JP'] text-[16px] font-bold text-[#323232] leading-[1.6] tracking-[1.6px] w-40">
          企業ID
        </label>
        <div className="font-['Noto_Sans_JP'] text-[16px] font-medium text-[#323232] leading-[1.6] tracking-[1.6px]">
          {company.id}
        </div>
      </div>

      <hr className='border-gray-300' />

      {/* プラン */}
      <div className='flex items-center gap-6 py-3'>
        <label className="block font-['Noto_Sans_JP'] text-[16px] font-bold text-[#323232] leading-[1.6] tracking-[1.6px] w-40">
          プラン
        </label>
        <select
          value={formData.plan}
          onChange={e =>
            setFormData(prev => ({ ...prev, plan: e.target.value }))
          }
          className="flex-1 px-[11px] py-[11px] bg-white border border-[#999999] rounded-[5px] text-[16px] text-[#323232] font-medium tracking-[1.6px] font-['Noto_Sans_JP'] focus:outline-none focus:border-[#0F9058]"
        >
          <option value=''>プランを選択してください</option>
          {planOptions.map(plan => (
            <option key={plan.value} value={plan.value}>
              {plan.label}
            </option>
          ))}
        </select>
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
                placeholder='タイトルを入力'
                className="flex-1 text-[16px] text-[#323232] font-medium tracking-[1.6px] font-['Noto_Sans_JP'] outline-none placeholder:text-[#999999] rounded-[5px] px-[11px] py-[11px] bg-white border border-[#999999]"
              />

              {/* URL入力 */}
              <input
                type='text'
                value={url.url}
                onChange={e => updateUrl(index, 'url', e.target.value)}
                placeholder='https://example.com'
                className="flex-1 text-[16px] text-[#323232] font-medium tracking-[1.6px] font-['Noto_Sans_JP'] outline-none placeholder:text-[#999999] rounded-[5px] px-[11px] py-[11px] bg-white border border-[#999999]"
              />
            </div>
          ))}
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
        <div className='w-32 h-32 bg-gray-600 rounded-full flex items-center justify-center cursor-pointer'>
          <div className='text-center'>
            <div className='text-sm font-bold text-white'>画像を</div>
            <div className='text-sm font-bold text-white'>変更</div>
          </div>
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
            placeholder='山田太郎'
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
            placeholder='2010'
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
          <div className='flex items-center px-[11px] py-[11px] bg-white border border-[#999999] rounded-[5px]'>
            <label htmlFor='capital-unit' className='sr-only'>
              資本金単位
            </label>
            <select
              id='capital-unit'
              value={formData.capitalUnit}
              onChange={e =>
                setFormData(prev => ({ ...prev, capitalUnit: e.target.value }))
              }
              className="text-[16px] text-[#323232] font-medium tracking-[1.6px] font-['Noto_Sans_JP'] bg-transparent border-none outline-none focus:outline-none"
            >
              <option value='万円'>万円</option>
              <option value='円'>円</option>
              <option value='千円'>千円</option>
              <option value='億円'>億円</option>
            </select>
            <span className='ml-2'>▼</span>
          </div>
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
            placeholder='150'
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
              onClick={() => setIndustryModalOpen(true)}
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
        <div className='border p-1'>
          <textarea
            value={formData.businessContent}
            onChange={e =>
              setFormData(prev => ({
                ...prev,
                businessContent: e.target.value,
              }))
            }
            placeholder='当社では、革新的なソリューションを提供する企業として、お客様のニーズに合わせたサービスを展開しています。&#10;具体的には、Webアプリケーション開発、コンサルティング、システムインテグレーションなどのサービスを提供しております。'
            rows={4}
            className="flex-1 px-[11px] py-[11px] bg-white border border-[#999999] rounded-[5px] text-[16px] text-[#323232] font-medium tracking-[1.6px] font-['Noto_Sans_JP'] resize-none focus:outline-none focus:border-[#0F9058] placeholder:text-[#999999]"
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
          <div className='flex items-center'>
            <label htmlFor='prefecture-select' className='sr-only'>
              都道府県選択
            </label>
            <select
              id='prefecture-select'
              value={formData.prefecture}
              onChange={e =>
                setFormData(prev => ({ ...prev, prefecture: e.target.value }))
              }
              className="px-[11px] py-[11px] bg-white border border-[#999999] rounded-[5px] text-[16px] text-[#323232] font-medium tracking-[1.6px] font-['Noto_Sans_JP'] focus:outline-none focus:border-[#0F9058]"
            >
              <option value=''>都道府県を選択してください</option>
              {prefectureOptions.map(prefecture => (
                <option key={prefecture} value={prefecture}>
                  {prefecture}
                </option>
              ))}
            </select>
          </div>
          <input
            type='text'
            value={formData.address}
            onChange={e =>
              setFormData(prev => ({ ...prev, address: e.target.value }))
            }
            placeholder='千代田区丸の内1-1-1 サンプルビル5F'
            className="w-full px-[11px] py-[11px] bg-white border border-[#999999] rounded-[5px] text-[16px] text-[#323232] font-medium tracking-[1.6px] font-['Noto_Sans_JP'] focus:outline-none focus:border-[#0F9058] placeholder:text-[#999999]"
          />
        </div>
      </div>

      <hr className='border-gray-300' />

      {/* 企業フェーズ */}
      <div className='flex items-center gap-6 py-3'>
        <label
          htmlFor='company-phase'
          className="block font-['Noto_Sans_JP'] text-[16px] font-bold text-[#323232] leading-[1.6] tracking-[1.6px] w-40"
        >
          企業フェーズ
        </label>
        <select
          id='company-phase'
          value={formData.companyPhase}
          onChange={e =>
            setFormData(prev => ({ ...prev, companyPhase: e.target.value }))
          }
          className="px-[11px] py-[11px] bg-white border border-[#999999] rounded-[5px] text-[16px] text-[#323232] font-medium tracking-[1.6px] font-['Noto_Sans_JP'] focus:outline-none focus:border-[#0F9058]"
        >
          <option value=''>企業フェーズを選択してください</option>
          {companyPhaseOptions.map(phase => (
            <option key={phase} value={phase}>
              {phase}
            </option>
          ))}
        </select>
      </div>

      <hr className='border-gray-300' />

      {/* イメージ画像 */}
      <div className='flex items-start gap-6 py-3'>
        <label className="block font-['Noto_Sans_JP'] text-[16px] font-bold text-[#323232] leading-[1.6] tracking-[1.6px] w-40 mt-2">
          イメージ画像
        </label>
        <div className='flex gap-4'>
          {[0, 1, 2].map(index => (
            <div
              key={index}
              className='w-48 h-32 bg-gray-400 flex items-center justify-center cursor-pointer'
            >
              <div className='text-center'>
                <div className='text-sm font-bold text-white'>
                  {formData.images[index] ? '画像を' : '画像を'}
                </div>
                <div className='text-sm font-bold text-white'>
                  {formData.images[index] ? '変更' : '追加'}
                </div>
              </div>
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
                placeholder='ワークライフバランスが充実'
                className="w-full px-[11px] py-[11px] bg-white border border-[#999999] rounded-[5px] text-[16px] text-[#323232] font-medium tracking-[1.6px] font-['Noto_Sans_JP'] focus:outline-none focus:border-[#0F9058] placeholder:text-[#999999]"
              />
              <div className='border p-1'>
                <textarea
                  value={attraction.description}
                  onChange={e =>
                    updateAttraction(index, 'description', e.target.value)
                  }
                  placeholder='当社では、社員一人ひとりのワークライフバランスを大切に考えています。フレックスタイム制度やリモートワーク制度を導入しており、家庭や個人の時間を大切にしながら働ける環境を整えています。また、年間休日は125日以上と業界トップクラスの水準を確保しています。'
                  rows={5}
                  className="w-full px-[11px] py-[11px] bg-white border border-[#999999] rounded-[5px] text-[16px] text-[#323232] font-medium tracking-[1.6px] font-['Noto_Sans_JP'] resize-none focus:outline-none focus:border-[#0F9058] placeholder:text-[#999999]"
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
        <AdminButton
          onClick={handleCancel}
          text='キャンセル'
          variant='green-outline'
        />
        <AdminButton
          onClick={handleSubmit}
          text={isSaving ? '保存中...' : '更新する'}
          variant='green-gradient'
          disabled={isSaving}
        />
      </div>

      {/* エラーメッセージ */}
      {saveError && (
        <div className='mt-4 p-4 bg-red-100 border border-red-400 text-red-700 rounded'>
          {saveError}
        </div>
      )}

      {/* 業種選択モーダル */}
      {industryModalOpen && (
        <IndustryModal
          selectedIndustries={formData.industries}
          onIndustriesChange={selectedIndustries => {
            setFormData(prev => ({ ...prev, industries: selectedIndustries }));
          }}
          onClose={() => setIndustryModalOpen(false)}
        />
      )}

      {/* 企業情報編集完了モーダル */}
      <CompanyEditCompleteModal
        isOpen={saveCompleteModalOpen}
        onClose={handleSaveCompleteClose}
        companyName={formData.companyName}
        companyId={company.id}
      />
    </div>
  );
}
