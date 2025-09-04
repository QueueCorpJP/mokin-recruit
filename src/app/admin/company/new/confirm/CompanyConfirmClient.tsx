'use client';

import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import CompanyRegistrationCompleteModal from '@/components/admin/CompanyRegistrationCompleteModal';
import { createCompanyData, CompanyFormData } from '../actions';

interface CompanyConfirmClientProps {
  companyData: CompanyFormData;
}

export default function CompanyConfirmClient({ companyData: initialCompanyData }: CompanyConfirmClientProps) {
  const router = useRouter();
  const [registrationCompleteModalOpen, setRegistrationCompleteModalOpen] = useState(false);
  const [companyData, setCompanyData] = useState<CompanyFormData>(initialCompanyData);
  const [isSaving, setIsSaving] = useState(false);
  const [saveError, setSaveError] = useState<string | null>(null);

  // セッションストレージからデータを取得
  useEffect(() => {
    if (typeof window !== 'undefined') {
      const storedData = sessionStorage.getItem('companyFormData');
      if (storedData) {
        try {
          const parsedData = JSON.parse(storedData);
          setCompanyData(parsedData);
        } catch (error) {
          console.error('Failed to parse company form data from sessionStorage:', error);
        }
      }
    }
  }, []);

  const handleSave = async () => {
    setIsSaving(true);
    setSaveError(null);

    try {
      const result = await createCompanyData(companyData);

      if (result.success) {
        // 保存成功後にセッションストレージをクリア
        if (typeof window !== 'undefined') {
          sessionStorage.removeItem('companyFormData');
        }
        // 保存完了後に完了モーダルを表示
        setRegistrationCompleteModalOpen(true);
      } else {
        setSaveError(result.error || '保存に失敗しました');
      }
    } catch (error) {
      console.error('Save error:', error);
      setSaveError('保存中にエラーが発生しました');
    } finally {
      setIsSaving(false);
    }
  };

  const handleBack = () => {
    router.back();
  };

  const handleRegistrationCompleteClose = () => {
    setRegistrationCompleteModalOpen(false);
  };

  return (
    <div className="max-w-4xl mx-auto space-y-6 p-6">
      
      {/* ページタイトル */}
      <div className="mb-8">
        <h1 className="text-2xl font-bold text-black mb-2">企業情報詳細</h1>
        <hr className="border-black border-t-2" />
      </div>

      {/* プラン情報 */}
      <div className="flex items-center gap-6 py-3">
        <label className="block text-base font-bold text-black w-40">プラン</label>
        <div className="text-base text-black">{companyData.plan}</div>
      </div>

      <hr className="border-gray-300" />

      {/* 企業情報セクション */}
      <div className="space-y-4">
        <h2 className="text-xl font-bold text-black mb-4">企業情報</h2>
        
        {/* 企業ID */}
        <div className="flex items-center gap-6 py-3">
          <label className="block text-base font-bold text-black w-40">企業ID</label>
          <div className="flex-1 px-3 py-3 bg-white border border-gray-300 text-base">
            {companyData.companyId}
          </div>
        </div>

        <hr className="border-gray-300" />

        {/* 企業名 */}
        <div className="flex items-center gap-6 py-3">
          <label className="block text-base font-bold text-black w-40">企業名</label>
          <div className="flex-1 px-3 py-3 bg-white border border-gray-300 text-base">
            {companyData.companyName}
          </div>
        </div>

        <hr className="border-gray-300" />

        {/* URL */}
        <div className="flex items-start gap-6 py-3">
          <label className="block text-base font-bold text-black w-40 mt-2">URL</label>
          <div className="flex-1 space-y-3">
            {companyData.urls && companyData.urls.length > 0 ? (
              companyData.urls.map((url, index) => (
                <div key={index} className="flex items-center gap-4">
                  <div className="text-base text-black">{url.title}</div>
                  <div className="text-base text-black">https://{url.url}</div>
                </div>
              ))
            ) : (
              <div className="flex items-center gap-4">
                <div className="text-base text-black">タイトルテキストが入ります</div>
                <div className="text-base text-black">https://---------</div>
              </div>
            )}
          </div>
        </div>

        <hr className="border-gray-300" />

        {/* アイコン画像 */}
        <div className="flex items-center gap-6 py-3">
          <label className="block text-base font-bold text-black w-40">アイコン画像</label>
          <div className="w-32 h-32 bg-gray-400 rounded-full flex items-center justify-center">
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
          <div className="flex-1 px-3 py-3 bg-white border border-gray-300 text-base">
            {companyData.representativeName}
          </div>
        </div>

        <hr className="border-gray-300" />

        {/* 設立 */}
        <div className="flex items-center gap-6 py-3">
          <label className="block text-base font-bold text-black w-40">設立</label>
          <div className="flex items-center gap-2">
            <div className="w-24 px-3 py-3 bg-white border border-gray-300 text-base text-center">
              {companyData.establishedYear}
            </div>
            <span className="text-base text-black">年</span>
          </div>
        </div>

        <hr className="border-gray-300" />

        {/* 資本金 */}
        <div className="flex items-center gap-6 py-3">
          <label className="block text-base font-bold text-black w-40">資本金</label>
          <div className="flex items-center gap-2">
            <div className="w-24 px-3 py-3 bg-white border border-gray-300 text-base text-center">
              {companyData.capital}
            </div>
            <span className="text-base text-black">{companyData.capitalUnit}</span>
          </div>
        </div>

        <hr className="border-gray-300" />

        {/* 従業員数 */}
        <div className="flex items-center gap-6 py-3">
          <label className="block text-base font-bold text-black w-40">従業員数</label>
          <div className="flex items-center gap-2">
            <div className="w-24 px-3 py-3 bg-white border border-gray-300 text-base text-center">
              {companyData.employeeCount}
            </div>
            <span className="text-base text-black">人</span>
          </div>
        </div>

        <hr className="border-gray-300" />

        {/* 業種 */}
        <div className="flex items-start gap-6 py-3">
          <label className="block text-base font-bold text-black w-40 mt-2">業種</label>
          <div className="flex-1 px-3 py-3 bg-white border border-gray-300 text-base">
            {companyData.industries.join(', ')}
          </div>
        </div>

        <hr className="border-gray-300" />

        {/* 事業内容 */}
        <div className="flex items-start gap-6 py-3">
          <label className="block text-base font-bold text-black w-40 mt-2">事業内容</label>
          <div className="flex-1 px-3 py-3 bg-white border border-gray-300 text-base whitespace-pre-wrap">
            {companyData.businessContent}
          </div>
        </div>

        <hr className="border-gray-300" />

        {/* 所在地 */}
        <div className="flex items-start gap-6 py-3">
          <label className="block text-base font-bold text-black w-40 mt-2">所在地</label>
          <div className="flex-1 px-3 py-3 bg-white border border-gray-300 text-base whitespace-pre-wrap">
            {companyData.prefecture}
            {'\n'}
            {companyData.address}
          </div>
        </div>

        <hr className="border-gray-300" />

        {/* 企業フェーズ */}
        <div className="flex items-center gap-6 py-3">
          <label className="block text-base font-bold text-black w-40">企業フェーズ</label>
          <div className="flex-1 px-3 py-3 bg-white border border-gray-300 text-base">
            {companyData.companyPhase}
          </div>
        </div>

        <hr className="border-gray-300" />

        {/* イメージ画像 */}
        <div className="flex items-start gap-6 py-3">
          <label className="block text-base font-bold text-black w-40 mt-2">イメージ画像</label>
          <div className="flex gap-4">
            {[0, 1, 2].map(index => (
              <div key={index} className="w-48 h-32 bg-gray-400 flex items-center justify-center">
                <div className="text-center">
                  <div className="text-sm font-bold text-white">画像を</div>
                  <div className="text-sm font-bold text-white">変更</div>
                </div>
              </div>
            ))}
          </div>
        </div>

        <hr className="border-gray-300" />

        {/* 企業の魅力 */}
        <div className="flex items-start gap-6 py-3">
          <label className="block text-base font-bold text-black w-40 mt-2">企業の魅力</label>
          <div className="flex-1 space-y-6">
            {companyData.attractions.map((attraction, index) => (
              <div key={index} className="space-y-4">
                <div className="text-xl font-bold text-black">
                  {attraction.title}
                </div>
                <div className="text-base text-black whitespace-pre-wrap">
                  {attraction.description}
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* エラーメッセージ */}
      {saveError && (
        <div className="flex justify-center pt-4">
          <div className="px-4 py-2 bg-red-100 border border-red-400 text-red-700 rounded">
            {saveError}
          </div>
        </div>
      )}

      {/* ボタン群 */}
      <div className="flex justify-center gap-6 pt-8">
        <button
          onClick={handleBack}
          disabled={isSaving}
          className="px-10 py-3 border border-black rounded-3xl text-base font-bold hover:bg-gray-50 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
        >
          戻る
        </button>
        <button
          onClick={handleSave}
          disabled={isSaving}
          className="px-10 py-3 bg-black text-white rounded-3xl text-base font-bold hover:bg-gray-800 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
        >
          {isSaving ? '保存中...' : '保存する'}
        </button>
      </div>

      {/* 企業アカウント登録完了モーダル */}
      <CompanyRegistrationCompleteModal
        isOpen={registrationCompleteModalOpen}
        onClose={handleRegistrationCompleteClose}
        companyName={companyData.companyName}
      />
    </div>
  );
}
