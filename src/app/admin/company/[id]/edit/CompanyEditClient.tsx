'use client';

import React, { useState } from 'react';
import { useRouter } from 'next/navigation';
import type { CompanyEditData } from './page';

// フォームデータの型定義
interface CompanyFormData {
  companyId: string;
  plan: string;
  companyName: string;
  companyUrl: string;
  website: string;
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

// 業種のオプション
const industryOptions = [
  'IT・インターネット',
  'コンサルティング', 
  '製造業',
  '金融・保険',
  '商社・流通',
  'メディア・広告',
  '不動産・建設',
  'サービス・レジャー',
  '医療・福祉',
  '教育',
  '官公庁・公社・団体',
];

// 都道府県のオプション
const prefectureOptions = [
  '北海道', '青森県', '岩手県', '宮城県', '秋田県', '山形県', '福島県',
  '茨城県', '栃木県', '群馬県', '埼玉県', '千葉県', '東京都', '神奈川県',
  '新潟県', '富山県', '石川県', '福井県', '山梨県', '長野県', '岐阜県',
  '静岡県', '愛知県', '三重県', '滋賀県', '京都府', '大阪府', '兵庫県',
  '奈良県', '和歌山県', '鳥取県', '島根県', '岡山県', '広島県', '山口県',
  '徳島県', '香川県', '愛媛県', '高知県', '福岡県', '佐賀県', '長崎県',
  '熊本県', '大分県', '宮崎県', '鹿児島県', '沖縄県'
];

// 企業フェーズのオプション
const companyPhaseOptions = [
  'シード',
  'アーリー',
  'ミドル',
  'レイターステージ',
  '上場企業',
  '大手企業',
];

interface CompanyEditClientProps {
  company: CompanyEditData;
}

export default function CompanyEditClient({ company }: CompanyEditClientProps) {
  const router = useRouter();
  
  const [formData, setFormData] = useState<CompanyFormData>({
    companyId: company.id,
    plan: company.contract_plan?.plan_name || '',
    companyName: company.company_name,
    companyUrl: '',
    website: '',
    iconImage: null,
    representativePosition: company.company_users[0]?.position_title || '',
    representativeName: company.representative_name || '',
    establishedYear: '',
    capital: '',
    capitalUnit: '万円',
    employeeCount: '',
    industries: company.industry ? [company.industry] : [],
    businessContent: company.company_overview || '',
    prefecture: '',
    address: company.headquarters_address || '',
    companyPhase: '',
    images: [],
    attractions: company.appeal_points ? 
      company.appeal_points.split('\n').map(point => ({ title: point, description: '' })) :
      [{ title: '', description: '' }, { title: '', description: '' }],
  });

  // 業種の追加・削除
  const addIndustry = (industry: string) => {
    if (!formData.industries.includes(industry)) {
      setFormData(prev => ({
        ...prev,
        industries: [...prev.industries, industry]
      }));
    }
  };

  const removeIndustry = (industry: string) => {
    setFormData(prev => ({
      ...prev,
      industries: prev.industries.filter(i => i !== industry)
    }));
  };

  // 企業の魅力の追加
  const addAttraction = () => {
    setFormData(prev => ({
      ...prev,
      attractions: [...prev.attractions, { title: '', description: '' }]
    }));
  };

  const updateAttraction = (index: number, field: 'title' | 'description', value: string) => {
    setFormData(prev => ({
      ...prev,
      attractions: prev.attractions.map((attraction, i) => 
        i === index ? { ...attraction, [field]: value } : attraction
      )
    }));
  };

  // 画像アップロード処理
  const handleImageUpload = (file: File, type: 'icon' | 'images') => {
    if (type === 'icon') {
      setFormData(prev => ({ ...prev, iconImage: file }));
    } else {
      setFormData(prev => ({ 
        ...prev, 
        images: [...prev.images, file].slice(0, 3) // 最大3枚まで
      }));
    }
  };

  const handleSubmit = () => {
    // TODO: フォームデータをセッションストレージまたはクエリパラメータで確認画面に渡す
    console.log('Form submitted:', formData);
    router.push('/admin/company/new/confirm');
  };

  const handleCancel = () => {
    router.push('/admin/company');
  };

  return (
    <div className="max-w-4xl mx-auto space-y-4 p-6">
      
      {/* 企業ID */}
      <div className="flex items-center gap-6 py-3">
        <label className="block text-base font-bold text-black w-40">企業ID</label>
        <div className="text-base text-black">{company.id}</div>
      </div>

      <hr className="border-gray-300" />

      {/* プラン */}
      <div className="flex items-center gap-6 py-3">
        <label className="block text-base font-bold text-black w-40">プラン</label>
        <div className="text-base text-black">{formData.plan || 'プラン情報なし'}</div>
      </div>

      <hr className="border-gray-300" />

      {/* 企業名 */}
      <div className="flex items-center gap-6 py-3">
        <label className="block text-base font-bold text-black w-40">企業名</label>
        <input
          type="text"
          value={formData.companyName}
          onChange={(e) => setFormData(prev => ({ ...prev, companyName: e.target.value }))}
          placeholder="株式企業Company"
          className="flex-1 px-3 py-3 border border-black text-base"
        />
      </div>

      <hr className="border-gray-300" />

      {/* URL */}
      <div className="flex items-start gap-6 py-3">
        <label className="block text-base font-bold text-black w-40 mt-2">URL</label>
        <div className="flex-1 space-y-3">
          <div className="flex gap-2">
            <input
              type="text"
              value={formData.companyUrl}
              onChange={(e) => setFormData(prev => ({ ...prev, companyUrl: e.target.value }))}
              placeholder="タイトルを入力"
              className="flex-1 px-3 py-3 border border-black text-base"
            />
            <div className="flex items-center px-3 py-3 border border-black bg-white text-base">
              https://
            </div>
          </div>
          <button className="w-6 h-6 bg-black rounded-full flex items-center justify-center">
            <span className="text-white text-sm">+</span>
          </button>
        </div>
      </div>

      <hr className="border-gray-300" />

      {/* アイコン画像 */}
      <div className="flex items-center gap-6 py-3">
        <label className="block text-base font-bold text-black w-40">アイコン画像</label>
        <div className="w-32 h-32 bg-gray-600 rounded-full flex items-center justify-center cursor-pointer">
          <div className="text-center">
            <div className="text-sm font-bold text-white">画像を</div>
            <div className="text-sm font-bold text-white">変更</div>
          </div>
        </div>
      </div>

      <hr className="border-gray-300" />

      {/* 代表者 */}
      <div className="flex items-center gap-6 py-3">
        <label className="block text-base font-bold text-black w-40">代表者</label>
        <div className="flex-1 flex gap-3">
          <input
            type="text"
            value={formData.representativePosition}
            onChange={(e) => setFormData(prev => ({ ...prev, representativePosition: e.target.value }))}
            placeholder="代表者役職名を入力"
            className="flex-1 px-3 py-3 border border-black text-base placeholder-gray-400"
          />
          <input
            type="text"
            value={formData.representativeName}
            onChange={(e) => setFormData(prev => ({ ...prev, representativeName: e.target.value }))}
            placeholder="代表者名を入力"
            className="flex-1 px-3 py-3 border border-black text-base placeholder-gray-400"
          />
        </div>
      </div>

      <hr className="border-gray-300" />

      {/* 設立 */}
      <div className="flex items-center gap-6 py-3">
        <label className="block text-base font-bold text-black w-40">設立</label>
        <div className="flex items-center gap-2">
          <input
            type="text"
            value={formData.establishedYear}
            onChange={(e) => setFormData(prev => ({ ...prev, establishedYear: e.target.value }))}
            placeholder="2020"
            className="w-24 px-3 py-3 border border-black text-base text-center"
          />
          <span className="text-base text-black">年</span>
        </div>
      </div>

      <hr className="border-gray-300" />

      {/* 資本金 */}
      <div className="flex items-center gap-6 py-3">
        <label className="block text-base font-bold text-black w-40">資本金</label>
        <div className="flex items-center gap-2">
          <input
            type="text"
            value={formData.capital}
            onChange={(e) => setFormData(prev => ({ ...prev, capital: e.target.value }))}
            placeholder="100"
            className="w-24 px-3 py-3 border border-black text-base text-center"
          />
          <div className="flex items-center px-3 py-3 border border-black">
            <label htmlFor="capital-unit" className="sr-only">資本金単位</label>
            <select
              id="capital-unit"
              value={formData.capitalUnit}
              onChange={(e) => setFormData(prev => ({ ...prev, capitalUnit: e.target.value }))}
              className="text-base bg-transparent border-none outline-none"
            >
              <option value="万円">万円</option>
              <option value="円">円</option>
              <option value="千円">千円</option>
              <option value="億円">億円</option>
            </select>
            <span className="ml-2">▼</span>
          </div>
        </div>
      </div>

      <hr className="border-gray-300" />

      {/* 従業員数 */}
      <div className="flex items-center gap-6 py-3">
        <label className="block text-base font-bold text-black w-40">従業員数</label>
        <div className="flex items-center gap-2">
          <input
            type="text"
            value={formData.employeeCount}
            onChange={(e) => setFormData(prev => ({ ...prev, employeeCount: e.target.value }))}
            placeholder="500"
            className="w-24 px-3 py-3 border border-black text-base text-center"
          />
          <span className="text-base text-black">人</span>
        </div>
      </div>

      <hr className="border-gray-300" />

      {/* 業種 */}
      <div className="flex items-start gap-6 py-3">
        <label className="block text-base font-bold text-black w-40 mt-2">業種</label>
        <div className="flex-1 space-y-3">
          <div className="flex flex-wrap gap-3">
            <button
              onClick={() => {
                // TODO: モーダルまたはドロップダウンで業種選択
                const selectedIndustry = prompt('業種を選択してください', 'コンサルティング');
                if (selectedIndustry && industryOptions.includes(selectedIndustry)) {
                  addIndustry(selectedIndustry);
                }
              }}
              className="px-8 py-3 border border-black rounded-lg flex items-center gap-2 hover:bg-gray-50 text-base"
            >
              <span className="text-base font-bold">+</span>
              <span className="text-base font-bold">業種を追加</span>
            </button>
            {formData.industries.map((industry, index) => (
              <div key={index} className="px-6 py-2 bg-gray-100 rounded-full flex items-center gap-2">
                <span className="text-base font-bold">{industry}</span>
                <button
                  onClick={() => removeIndustry(industry)}
                  className="text-base font-bold text-black hover:text-red-500"
                >
                  ×
                </button>
              </div>
            ))}
          </div>
        </div>
      </div>

      <hr className="border-gray-300" />

      {/* 事業内容 */}
      <div className="flex items-start gap-6 py-3">
        <label className="block text-base font-bold text-black w-40 mt-2">事業内容</label>
        <textarea
          value={formData.businessContent}
          onChange={(e) => setFormData(prev => ({ ...prev, businessContent: e.target.value }))}
          placeholder="テキストが入ります。&#10;テキストが入ります。&#10;テキストが入ります。"
          rows={4}
          className="flex-1 px-3 py-3 border border-black text-base resize-none"
        />
      </div>

      <hr className="border-gray-300" />

      {/* 所在地 */}
      <div className="flex items-start gap-6 py-3">
        <label className="block text-base font-bold text-black w-40 mt-2">所在地</label>
        <div className="flex-1 space-y-3">
          <div className="flex items-center">
            <label htmlFor="prefecture-select" className="sr-only">都道府県選択</label>
            <select
              id="prefecture-select"
              value={formData.prefecture}
              onChange={(e) => setFormData(prev => ({ ...prev, prefecture: e.target.value }))}
              className="px-3 py-3 border border-black text-base bg-white"
            >
              <option value="">都道府県を選択　▼</option>
              {prefectureOptions.map(prefecture => (
                <option key={prefecture} value={prefecture}>{prefecture}</option>
              ))}
            </select>
          </div>
          <input
            type="text"
            value={formData.address}
            onChange={(e) => setFormData(prev => ({ ...prev, address: e.target.value }))}
            placeholder="千代田区〜〜〜〜〜〜"
            className="w-full px-3 py-3 border border-black text-base"
          />
        </div>
      </div>

      <hr className="border-gray-300" />

      {/* 企業フェーズ */}
      <div className="flex items-center gap-6 py-3">
        <label htmlFor="company-phase" className="block text-base font-bold text-black w-40">企業フェーズ</label>
        <select
          id="company-phase"
          value={formData.companyPhase}
          onChange={(e) => setFormData(prev => ({ ...prev, companyPhase: e.target.value }))}
          className="px-3 py-3 border border-black text-base bg-white"
        >
          <option value="">企業フェーズを選択　▼</option>
          {companyPhaseOptions.map(phase => (
            <option key={phase} value={phase}>{phase}</option>
          ))}
        </select>
      </div>

      <hr className="border-gray-300" />

      {/* イメージ画像 */}
      <div className="flex items-start gap-6 py-3">
        <label className="block text-base font-bold text-black w-40 mt-2">イメージ画像</label>
        <div className="flex gap-4">
          {[0, 1, 2].map(index => (
            <div key={index} className="w-48 h-32 bg-gray-400 flex items-center justify-center cursor-pointer">
              <div className="text-center">
                <div className="text-sm font-bold text-white">
                  {formData.images[index] ? '画像を' : '画像を'}
                </div>
                <div className="text-sm font-bold text-white">
                  {formData.images[index] ? '変更' : '追加'}
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>

      <hr className="border-gray-300" />

      {/* 企業の魅力 */}
      <div className="py-3">
        <label className="block text-base font-bold text-black mb-4">企業の魅力</label>
        <div className="space-y-6">
          {formData.attractions.map((attraction, index) => (
            <div key={index} className="space-y-4">
              <input
                type="text"
                value={attraction.title}
                onChange={(e) => updateAttraction(index, 'title', e.target.value)}
                placeholder="企業の魅力テキストが入ります"
                className="w-full px-3 py-3 border border-black text-base"
              />
              <textarea
                value={attraction.description}
                onChange={(e) => updateAttraction(index, 'description', e.target.value)}
                placeholder="企業の魅力説明テキストが入ります。企業の魅力説明テキストが入ります。企業の魅力説明テキストが入ります。企業の魅力説明テキストが入ります。企業の魅力説明テキストが入ります。企業の魅力説明テキストが入ります。企業の魅力説明テキストが入ります。企業の魅力説明テキストが入ります。企業の魅力説明テキストが入ります。企業の魅力説明テキストが入ります。企業の魅力説明テキストが入ります。企業の魅力説明テキストが入ります。企業の魅力説明テキストが入ります。"
                rows={5}
                className="w-full px-3 py-3 border border-black text-base resize-none"
              />
            </div>
          ))}
          <button
            onClick={addAttraction}
            className="px-6 py-3 border border-green-600 rounded-3xl flex items-center gap-2 text-green-600 hover:bg-green-50 text-sm font-bold"
          >
            <span className="text-base font-bold">+</span>
            <span className="text-sm font-bold">企業の魅力を追加</span>
          </button>
        </div>
      </div>

      {/* ボタン群 */}
      <div className="flex justify-center gap-6 pt-8">
        <button
          onClick={handleCancel}
          className="px-10 py-3 border border-black rounded-3xl text-base font-bold hover:bg-gray-50 transition-colors"
        >
          キャンセル
        </button>
        <button
          onClick={handleSubmit}
          className="px-10 py-3 bg-black text-white rounded-3xl text-base font-bold hover:bg-gray-800 transition-colors"
        >
          更新する
        </button>
      </div>
    </div>
  );
}
