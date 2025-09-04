'use client';

import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { IndustryModal } from '@/app/company/job/IndustryModal';
import { industryCategories } from '@/app/company/job/types';

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

// プランのオプション
const planOptions = [
  { value: 'basic', label: 'ベーシック' },
  { value: 'standard', label: 'スタンダード' },
];

// 都道府県のオプション
const prefectureOptions = [
  '北海道', '青森県', '岩手県', '宮城県', '秋田県', '山形県', '福島県',
  '茨城県', '栃木県', '群馬県', '埼玉県', '千葉県', '東京都', '神奈川県',
  '新潟県', '富山県', '石川県', '福井県', '山梨県', '長野県', '岐阜県',
  '静岡県', '愛知県', '三重県', '滋賀県', '京都府', '大阪府', '兵庫県',
  '奈良県', '和歌山県', '鳥取県', '島根県', '岡山県', '広島県', '山口県',
  '徳島県', '香川県', '愛媛県', '高知県', '福岡県', '佐賀県', '長崎県',
  '熊本県', '大分県', '宮崎県', '鹿児島県', '沖縄県',
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
    urls: [
      { title: '', url: '' }
    ],
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
      { title: '', description: '' }
    ],
  });

  // クライアント側でのみ企業IDを生成
  useEffect(() => {
    if (formData.companyId === '') {
      setFormData(prev => ({ ...prev, companyId: generateCompanyId() }));
    }
  }, []);

  // 業種選択モーダルの状態管理
  const [isIndustryModalOpen, setIsIndustryModalOpen] = useState(false);

  // 業種選択ハンドラー
  const handleIndustryChange = (industries: string[]) => {
    setFormData(prev => ({ ...prev, industries }));
  };

  // 業種の削除（選択された業種から個別に削除）
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

  // URLの追加
  const addUrl = () => {
    setFormData(prev => ({
      ...prev,
      urls: [...prev.urls, { title: '', url: '' }]
    }));
  };

  // URLの削除
  const removeUrl = (index: number) => {
    if (formData.urls.length > 1) {
      setFormData(prev => ({
        ...prev,
        urls: prev.urls.filter((_, i) => i !== index)
      }));
    }
  };

  // URLの更新
  const updateUrl = (index: number, field: 'title' | 'url', value: string) => {
    setFormData(prev => ({
      ...prev,
      urls: prev.urls.map((url, i) =>
        i === index ? { ...url, [field]: value } : url
      )
    }));
  };

  // 画像アップロード処理
  const handleImageUpload = (file: File, type: 'icon' | 'images', index?: number) => {
    if (type === 'icon') {
      setFormData(prev => ({ ...prev, iconImage: file }));
    } else if (type === 'images' && index !== undefined) {
      const newImages = [...formData.images];
      newImages[index] = file;
      setFormData(prev => ({ ...prev, images: newImages }));
    }
  };

  // ファイル選択ハンドラー
  const handleFileSelect = (event: React.ChangeEvent<HTMLInputElement>, type: 'icon' | 'images', index?: number) => {
    const file = event.target.files?.[0];
    if (file) {
      handleImageUpload(file, type, index);
    }
  };

  const handleSubmit = () => {
    // TODO: フォームデータをセッションストレージまたはクエリパラメータで確認画面に渡す
    console.log('Form submitted:', formData);
    router.push('/admin/company/new/confirm');
  };

  return (
    <div className="max-w-4xl mx-auto space-y-4 p-6">
      
      {/* 企業ID */}
      <div className="flex items-center gap-6 py-3">
        <label className="block text-base font-bold text-black w-40">企業ID</label>
        <div className="text-base text-black font-mono">{formData.companyId}</div>
      </div>

      <hr className="border-gray-300" />

      {/* プラン */}
      <div className="flex items-center gap-6 py-3">
        <label htmlFor="plan-select" className="block text-base font-bold text-black w-40">プラン</label>
        <select
          id="plan-select"
          value={formData.plan}
          onChange={(e) => setFormData(prev => ({ ...prev, plan: e.target.value }))}
          className="px-3 py-3 border border-black text-base bg-white"
        >
          <option value="">プランを選択してください ▼</option>
          {planOptions.map(plan => (
            <option key={plan.value} value={plan.value}>{plan.label}</option>
          ))}
        </select>
      </div>

      <hr className="border-gray-300" />

      {/* 企業名 */}
      <div className="flex items-center gap-6 py-3">
        <label className="block text-base font-bold text-black w-40">企業名</label>
        <input
          type="text"
          value={formData.companyName}
          onChange={(e) => setFormData(prev => ({ ...prev, companyName: e.target.value }))}
          placeholder="株式会社サンプル企業"
          className="flex-1 px-3 py-3 border border-black text-base"
        />
      </div>

      <hr className="border-gray-300" />

      {/* URL */}
      <div className="flex items-start gap-6 py-3">
        <label className="block text-base font-bold text-black w-40 mt-2">URL</label>
        <div className="flex-1 space-y-3">
          {formData.urls.map((url, index) => (
            <div key={index} className="flex items-center gap-3">
              {/* 削除ボタン（2行目以降のみ表示） */}
              {formData.urls.length > 1 && (
                <button
                  onClick={() => removeUrl(index)}
                  className="text-2xl font-bold text-black hover:text-gray-600 px-2"
                >
                  ×
                </button>
              )}
              {/* タイトル入力 */}
              <div className="flex items-center px-3.5 py-3 bg-white border border-black w-60">
                <input
                  type="text"
                  value={url.title}
                  onChange={(e) => updateUrl(index, 'title', e.target.value)}
                  placeholder="コーポレートサイト"
                  className="flex-1 text-base font-bold outline-none placeholder:text-[#BABABA]"
                  style={{ fontFamily: 'Inter, sans-serif' }}
                />
              </div>

              {/* URL入力 */}
              <div className="flex items-center px-3.5 py-3 bg-white border border-black flex-1">
                <input
                  type="text"
                  value={url.url}
                  onChange={(e) => updateUrl(index, 'url', e.target.value)}
                  placeholder="https://example.com"
                  className="flex-1 text-base font-bold outline-none placeholder:text-[#BABABA]"
                  style={{ fontFamily: 'Inter, sans-serif' }}
                />
              </div>
            </div>
          ))}

          {/* 追加ボタン */}
          <button
            onClick={addUrl}
            className="w-6 h-6 bg-black rounded-full flex items-center justify-center hover:bg-gray-800 transition-colors"
          >
            <span className="text-white text-sm font-bold">+</span>
          </button>
        </div>
      </div>

      <hr className="border-gray-300" />

      {/* アイコン画像 */}
      <div className="flex items-center gap-6 py-3">
        <label className="block text-base font-bold text-black w-40">アイコン画像</label>
        <div className="relative">
          <div
            className="w-32 h-32 bg-gray-600 rounded-full flex items-center justify-center cursor-pointer hover:bg-gray-500 transition-colors"
            onClick={() => document.getElementById('icon-file-input')?.click()}
          >
            {formData.iconImage ? (
              <img
                src={URL.createObjectURL(formData.iconImage)}
                alt="アイコン画像"
                className="w-32 h-32 rounded-full object-cover"
              />
            ) : (
              <div className="text-center">
                <div className="text-sm font-bold text-white">画像を</div>
                <div className="text-sm font-bold text-white">追加</div>
              </div>
            )}
          </div>
          <input
            id="icon-file-input"
            type="file"
            accept="image/*"
            onChange={(e) => handleFileSelect(e, 'icon')}
            className="hidden"
          />
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
            placeholder="代表取締役社長"
            className="flex-1 px-3 py-3 border border-black text-base placeholder-gray-400"
          />
          <input
            type="text"
            value={formData.representativeName}
            onChange={(e) => setFormData(prev => ({ ...prev, representativeName: e.target.value }))}
            placeholder="田中太郎"
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
            placeholder="2024"
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
            placeholder="500"
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
            placeholder="100"
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
              onClick={() => setIsIndustryModalOpen(true)}
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
          placeholder="当社はテクノロジーを活用したソリューションを提供する会社です。&#10;主な事業内容として、ソフトウェア開発、システムインテグレーション、&#10;コンサルティングサービスを行っています。"
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
            placeholder="東京都千代田区丸の内1-1-1"
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
            <div key={index} className="relative">
              <div
                className="w-48 h-32 bg-gray-400 flex items-center justify-center cursor-pointer hover:bg-gray-300 transition-colors"
                onClick={() => document.getElementById(`image-file-input-${index}`)?.click()}
              >
                {formData.images[index] ? (
                  <img
                    src={URL.createObjectURL(formData.images[index])}
                    alt={`イメージ画像 ${index + 1}`}
                    className="w-48 h-32 object-cover"
                  />
                ) : (
                  <div className="text-center">
                    <div className="text-sm font-bold text-white">画像を</div>
                    <div className="text-sm font-bold text-white">追加</div>
                  </div>
                )}
              </div>
              <input
                id={`image-file-input-${index}`}
                type="file"
                accept="image/*"
                onChange={(e) => handleFileSelect(e, 'images', index)}
                className="hidden"
              />
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
                placeholder="スタートアップ企業"
                className="w-full px-3 py-3 border border-black text-base"
              />
              <textarea
                value={attraction.description}
                onChange={(e) => updateAttraction(index, 'description', e.target.value)}
                placeholder="私たちはベンチャー企業として、革新的なテクノロジーと柔軟な働き方で成長を続けています。&#10;代表との距離が近く、裁量を持って働ける環境で、自分のアイデアを形にできます。&#10;福利厚生も充実しており、ワークライフバランスを大切にしています。"
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
          className="px-10 py-3 border border-black rounded-3xl text-base font-bold hover:bg-gray-50 transition-colors"
        >
          キャンセル
        </button>
        <button
          onClick={handleSubmit}
          className="px-10 py-3 bg-black text-white rounded-3xl text-base font-bold hover:bg-gray-800 transition-colors"
        >
          確認する
        </button>
      </div>

      {/* 業種選択モーダル */}
      {isIndustryModalOpen && (
        <div
          className="fixed inset-0 flex items-center justify-center z-50"
          style={{ backgroundColor: 'rgba(0, 0, 0, 0.4)' }}
        >
          <div className="bg-white p-6 rounded-lg max-w-4xl max-h-[80vh] overflow-y-auto">
            <div className="flex justify-between items-center mb-4">
              <h2 className="text-xl font-bold">業種を選択</h2>
              <button
                onClick={() => setIsIndustryModalOpen(false)}
                className="text-2xl font-bold text-gray-500 hover:text-gray-700"
              >
                ×
              </button>
            </div>
            <IndustryModal
              selectedIndustries={formData.industries}
              onIndustriesChange={(industries) => {
                handleIndustryChange(industries);
                setIsIndustryModalOpen(false);
              }}
            />
          </div>
        </div>
      )}
    </div>
  );
}
