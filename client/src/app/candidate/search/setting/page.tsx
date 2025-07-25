'use client';

import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';

// アイコンコンポーネント
const MagnifyingGlassIcon = ({ className }: { className?: string }) => (
  <svg className={className} fill="none" stroke="currentColor" viewBox="0 0 24 24">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="m21 21-5.197-5.197m0 0A7.5 7.5 0 1 0 5.196 5.196a7.5 7.5 0 0 0 10.607 10.607Z" />
  </svg>
);

const StarIcon = ({ className }: { className?: string }) => (
  <svg className={className} fill="none" stroke="currentColor" viewBox="0 0 24 24">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11.48 3.499a.562.562 0 011.04 0l2.125 5.111a.563.563 0 00.475.345l5.518.442c.499.04.701.663.321.988l-4.204 3.602a.563.563 0 00-.182.557l1.285 5.385a.562.562 0 01-.84.61l-4.725-2.885a.563.563 0 00-.586 0L6.982 20.54a.562.562 0 01-.84-.61l1.285-5.386a.562.562 0 00-.182-.557l-4.204-3.602a.563.563 0 01.321-.988l5.518-.442a.563.563 0 00.475-.345L11.48 3.5Z" />
  </svg>
);

const ChevronDownIcon = ({ className }: { className?: string }) => (
  <svg className={className} fill="none" stroke="currentColor" viewBox="0 0 24 24">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="m19.5 8.25-7.5 7.5-7.5-7.5" />
  </svg>
);

const ChevronUpIcon = ({ className }: { className?: string }) => (
  <svg className={className} fill="none" stroke="currentColor" viewBox="0 0 24 24">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="m4.5 15.75 7.5-7.5 7.5 7.5" />
  </svg>
);

const ChevronLeftIcon = ({ className }: { className?: string }) => (
  <svg className={className} fill="none" stroke="currentColor" viewBox="0 0 24 24">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15.75 19.5 8.25 12l7.5-7.5" />
  </svg>
);

const ChevronRightIcon = ({ className }: { className?: string }) => (
  <svg className={className} fill="none" stroke="currentColor" viewBox="0 0 24 24">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="m8.25 4.5 7.5 7.5-7.5 7.5" />
  </svg>
);

const LocationIcon = ({ className }: { className?: string }) => (
  <svg className={className} fill="none" stroke="currentColor" viewBox="0 0 24 24">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 10.5a3 3 0 1 1-6 0 3 3 0 0 1 6 0Z" />
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19.5 10.5c0 7.142-7.5 11.25-7.5 11.25s-7.5-4.108-7.5-11.25a7.5 7.5 0 1 1 15 0Z" />
  </svg>
);

const YenIcon = ({ className }: { className?: string }) => (
  <svg className={className} fill="none" stroke="currentColor" viewBox="0 0 24 24">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 7.5 15 7.5M9 12l6 0m-7.5-4.5L12 2l4.5 5.5M3 16.5h18M3 20.5h18" />
  </svg>
);

const HeartIcon = ({ className }: { className?: string }) => (
  <svg className={className} fill="none" stroke="currentColor" viewBox="0 0 24 24">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 8.25c0-2.485-2.099-4.5-4.688-4.5-1.935 0-3.597 1.126-4.312 2.733-.715-1.607-2.377-2.733-4.313-2.733C5.1 3.75 3 5.765 3 8.25c0 7.22 9 12 9 12s9-4.78 9-12Z" />
  </svg>
);

export default function SearchSettingPage() {
  const [keyword, setKeyword] = useState('');
  const [jobType, setJobType] = useState('');
  const [location, setLocation] = useState('');
  const [salary, setSalary] = useState('');
  const [industry, setIndustry] = useState('');
  const [appealPoint, setAppealPoint] = useState('');
  const [showAdvanced, setShowAdvanced] = useState(false);

  const handleSearch = () => {
    // 検索処理を実装
    console.log({
      keyword,
      jobType,
      location,
      salary,
      industry,
      appealPoint,
    });
  };

  return (
    <div className="min-h-screen bg-gradient-to-r from-[#198D76] to-[#1CA74F]">
      {/* ヘッダー */}
      <div className="flex justify-between items-center px-6 py-4">
        <div className="flex items-center gap-3 text-white">
          <MagnifyingGlassIcon className="w-6 h-6" />
          <h1 className="text-xl font-bold">求人を探す</h1>
        </div>
        <Button
          variant="outline"
          className="text-white border-white hover:bg-white hover:text-[#198D76] flex items-center gap-2"
        >
          <StarIcon className="w-5 h-5" />
          お気に入り求人
        </Button>
      </div>

      {/* 検索フォーム */}
      <div className="flex justify-center px-6">
        <div className="bg-white rounded-xl shadow-lg p-8 w-full max-w-2xl">
          <div className="space-y-6">
            {/* キーワード検索 */}
            <div>
              <Input
                placeholder="キーワード検索"
                value={keyword}
                onChange={(e) => setKeyword(e.target.value)}
                className="h-12 text-base"
              />
            </div>

            {/* 第一行: 職種、勤務地、年収 */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <Button
                variant="outline"
                className="h-12 justify-between text-left bg-gray-50 hover:bg-gray-100"
                onClick={() => {/* 職種選択モーダルを開く */}}
              >
                <span className={jobType ? 'text-black' : 'text-gray-500'}>
                  {jobType || '職種を選択'}
                </span>
                <ChevronDownIcon className="w-4 h-4" />
              </Button>

              <Button
                variant="outline"
                className="h-12 justify-between text-left bg-gray-50 hover:bg-gray-100"
                onClick={() => {/* 勤務地選択モーダルを開く */}}
              >
                <span className={location ? 'text-black' : 'text-gray-500'}>
                  {location || '勤務地を選択'}
                </span>
                <ChevronDownIcon className="w-4 h-4" />
              </Button>

              <div className="relative">
                <select
                  value={salary}
                  onChange={(e) => setSalary(e.target.value)}
                  className="w-full h-12 px-3 border border-gray-200 rounded-md bg-gray-50 text-gray-700 appearance-none cursor-pointer hover:bg-gray-100 focus:outline-none focus:ring-2 focus:ring-blue-500"
                >
                  <option value="">年収</option>
                  <option value="300-400">300-400万円</option>
                  <option value="400-500">400-500万円</option>
                  <option value="500-600">500-600万円</option>
                  <option value="600-700">600-700万円</option>
                  <option value="700-800">700-800万円</option>
                  <option value="800-900">800-900万円</option>
                  <option value="900-1000">900-1000万円</option>
                  <option value="1000+">1000万円以上</option>
                </select>
                <ChevronDownIcon className="absolute right-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-400 pointer-events-none" />
              </div>
            </div>

            {/* 検索条件追加 */}
            <div className="flex justify-center">
              <Button
                variant="ghost"
                className="text-[#198D76] hover:text-[#12614E] flex items-center gap-2"
                onClick={() => setShowAdvanced(!showAdvanced)}
              >
                検索条件追加
                {showAdvanced ? (
                  <ChevronUpIcon className="w-4 h-4" />
                ) : (
                  <ChevronDownIcon className="w-4 h-4" />
                )}
              </Button>
            </div>

            {/* 追加条件（アコーディオン） */}
            {showAdvanced && (
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 pt-4 border-t border-gray-200">
                <Button
                  variant="outline"
                  className="h-12 justify-between text-left bg-gray-50 hover:bg-gray-100"
                  onClick={() => {/* 業種選択モーダルを開く */}}
                >
                  <span className={industry ? 'text-black' : 'text-gray-500'}>
                    {industry || '業種を選択'}
                  </span>
                  <ChevronDownIcon className="w-4 h-4" />
                </Button>

                <div className="relative">
                  <select
                    value={appealPoint}
                    onChange={(e) => setAppealPoint(e.target.value)}
                    className="w-full h-12 px-3 border border-gray-200 rounded-md bg-gray-50 text-gray-700 appearance-none cursor-pointer hover:bg-gray-100 focus:outline-none focus:ring-2 focus:ring-blue-500"
                  >
                    <option value="">アピールポイント</option>
                    <option value="remote">リモートワーク可</option>
                    <option value="flexible">フレックスタイム制</option>
                    <option value="education">教育制度充実</option>
                    <option value="welfare">福利厚生充実</option>
                    <option value="startup">スタートアップ</option>
                    <option value="stable">安定企業</option>
                    <option value="global">グローバル企業</option>
                  </select>
                  <ChevronDownIcon className="absolute right-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-400 pointer-events-none" />
                </div>
              </div>
            )}

            {/* 検索ボタン */}
            <div className="flex justify-center pt-4">
              <Button
                onClick={handleSearch}
                className="bg-[#4A90E2] hover:bg-[#357ABD] text-white px-12 py-3 rounded-full text-base font-medium min-w-[120px]"
              >
                検索
              </Button>
            </div>
          </div>
        </div>
      </div>

      {/* 求人一覧セクション */}
      <div className="max-w-4xl mx-auto px-6 py-8">
        <div className="bg-white rounded-xl shadow-lg">
          <div className="space-y-0">
            {/* 求人アイテム */}
            {Array.from({ length: 10 }).map((_, index) => (
              <div key={index} className="relative p-6 border-b border-gray-100 last:border-b-0 hover:bg-gray-50 transition-colors">
                <div className="flex space-x-6">
                  {/* 企業画像 */}
                  <div className="flex-shrink-0">
                    <img
                      src="/company.jpg"
                      alt="企業画像"
                      className="w-80 h-44 object-cover rounded-lg"
                    />
                  </div>

                  {/* 求人情報 */}
                  <div className="flex-1 space-y-4">
                    {/* 職種タグ */}
                    <div className="flex flex-wrap gap-2">
                      <span className="inline-block px-3 py-1 text-xs font-medium text-[#198D76] bg-[#E8F5F0] rounded-full">
                        職種テキスト
                      </span>
                      <span className="inline-block px-3 py-1 text-xs font-medium text-[#198D76] bg-[#E8F5F0] rounded-full">
                        職種テキスト
                      </span>
                      <span className="inline-block px-3 py-1 text-xs font-medium text-[#198D76] bg-[#E8F5F0] rounded-full">
                        職種テキスト
                      </span>
                    </div>

                    {/* 求人タイトル */}
                    <h3 className="text-xl font-bold text-gray-900 leading-relaxed">
                      求人タイトルテキストが入ります。求人タイトルテキストが入ります。求人タイトルテキストが入ります。求人タイトルテキストが入ります。求人タイ...
                    </h3>

                    {/* 勤務地 */}
                    <div className="flex items-center text-gray-600">
                      <LocationIcon className="w-4 h-4 mr-2 text-[#198D76]" />
                      <span className="text-sm">勤務地テキスト、勤務地テキスト</span>
                    </div>

                    {/* 年収 */}
                    <div className="flex items-center text-gray-900">
                      <YenIcon className="w-4 h-4 mr-2 text-[#198D76]" />
                      <span className="text-sm font-medium">1,000万〜1,200万</span>
                    </div>

                    {/* 企業名 */}
                    <div className="flex items-center mt-4">
                      <div className="w-8 h-8 bg-[#4A90E2] rounded-full flex items-center justify-center mr-3">
                        <span className="text-white text-xs font-bold">企</span>
                      </div>
                      <span className="text-sm font-medium text-gray-900">企業名テキスト</span>
                    </div>
                  </div>

                  {/* お気に入りボタン */}
                  <div className="absolute top-6 right-6">
                    <Button
                      variant="ghost"
                      size="sm"
                      className="text-gray-400 hover:text-red-500 p-2"
                    >
                      <HeartIcon className="w-6 h-6" />
                    </Button>
                  </div>
                </div>
              </div>
            ))}
          </div>

          {/* ページネーション */}
          <div className="flex justify-center items-center py-6 border-t border-gray-100">
            <div className="flex items-center space-x-2">
              <Button
                variant="outline"
                size="sm"
                className="text-gray-600 hover:text-[#198D76]"
                disabled
              >
                <ChevronLeftIcon className="w-4 h-4" />
                前へ
              </Button>

              {/* ページ番号 */}
              <div className="flex items-center space-x-1">
                {[1, 2, 3, 4, 5].map((page) => (
                  <Button
                    key={page}
                    variant={page === 1 ? "default" : "outline"}
                    size="sm"
                    className={page === 1 
                      ? "bg-[#198D76] text-white hover:bg-[#12614E]" 
                      : "text-gray-600 hover:text-[#198D76] hover:bg-gray-50"
                    }
                  >
                    {page}
                  </Button>
                ))}
                <span className="text-gray-400 px-2">...</span>
                <Button
                  variant="outline"
                  size="sm"
                  className="text-gray-600 hover:text-[#198D76] hover:bg-gray-50"
                >
                  20
                </Button>
              </div>

              <Button
                variant="outline"
                size="sm"
                className="text-gray-600 hover:text-[#198D76]"
              >
                次へ
                <ChevronRightIcon className="w-4 h-4" />
              </Button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
