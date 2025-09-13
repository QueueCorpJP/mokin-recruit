'use client';

import React, { useState } from 'react';
import { useRouter } from 'next/navigation';
import { BaseInput } from '@/components/ui/base-input';
import { SelectInput } from '@/components/ui/select-input';
import { Modal } from '@/components/ui/Modal';
import { JobTypeModal } from '@/app/company/job/JobTypeModal';
import { LocationModal } from '@/app/company/job/LocationModal';
import { IndustryModal } from '@/app/company/job/IndustryModal';
import { X } from 'lucide-react';

interface SearchFormProps {
  initialKeyword: string;
  initialLocations: string[];
  initialSalary: string;
  initialIndustries: string[];
  initialJobTypes: string[];
  initialAppealPoints: string;
}

export default function SearchForm({
  initialKeyword,
  initialLocations,
  initialSalary,
  initialIndustries,
  initialJobTypes,
  initialAppealPoints
}: SearchFormProps) {
  const router = useRouter();
  
  const [keyword, setKeyword] = useState(initialKeyword);
  const [selectedLocations, setSelectedLocations] = useState<string[]>(initialLocations);
  const [selectedSalary, setSelectedSalary] = useState(initialSalary);
  const [selectedIndustries, setSelectedIndustries] = useState<string[]>(initialIndustries);
  const [selectedJobTypes, setSelectedJobTypes] = useState<string[]>(initialJobTypes);
  const [selectedAppealPoint, setSelectedAppealPoint] = useState(initialAppealPoints);
  
  const [jobTypeModalOpen, setJobTypeModalOpen] = useState(false);
  const [locationModalOpen, setLocationModalOpen] = useState(false);
  const [industryModalOpen, setIndustryModalOpen] = useState(false);
  const [isSearchConditionActive, setIsSearchConditionActive] = useState(false);

  // 年収セレクト用
  const salaryOptions = [
    '問わない',
    '600万円以上',
    '700万円以上',
    '800万円以上',
    '900万円以上',
    '1000万円以上',
    '1100万円以上',
    '1200万円以上',
    '1300万円以上',
    '1400万円以上',
    '1500万円以上',
    '1600万円以上',
    '1700万円以上',
    '1800万円以上',
    '1900万円以上',
    '2000万円以上',
    '2100万円以上',
    '2200万円以上',
    '2300万円以上',
    '2400万円以上',
    '2500万円以上',
    '2600万円以上',
    '2700万円以上',
    '2800万円以上',
    '2900万円以上',
    '3000万円以上',
    '4000万円以上',
    '5000万円以上',
  ].map(v => ({ value: v, label: v }));

  // アピールポイントセレクト用
  const appealPointOptions = [
    'CxO候補',
    '新規事業立ち上げ',
    '経営戦略に関与',
    '裁量が大きい',
    'スピード感がある',
    'グローバル事業に関与',
    '成長フェーズ',
    '上場準備中',
    '社会課題に貢献',
    '少数精鋭',
    '代表と距離が近い',
    '20〜30代中心',
    'フラットな組織',
    '多様な人材が活躍',
    'フレックス制度',
    'リモートあり',
    '副業OK',
    '残業少なめ',
    '育児／介護と両立しやすい',
  ].map(v => ({ value: v, label: v }));

  const handleSearch = () => {
    const params = new URLSearchParams();
    
    if (keyword.trim()) params.set('keyword', keyword.trim());
    if (selectedLocations.length > 0) params.set('location', selectedLocations.join(','));
    if (selectedSalary && selectedSalary !== '問わない') params.set('salaryMin', selectedSalary.replace(/[^\d]/g, ''));
    if (selectedIndustries.length > 0) params.set('industries', selectedIndustries.join(','));
    if (selectedJobTypes.length > 0) params.set('jobTypes', selectedJobTypes.join(','));
    if (selectedAppealPoint) params.set('appealPoints', selectedAppealPoint);
    
    const queryString = params.toString();
    const newUrl = queryString ? `?${queryString}` : '';
    
    router.push(`/candidate/search/setting${newUrl}`);
  };

  return (
    <div className='max-w-[662px] w-full mx-auto flex flex-col gap-6'>
      <BaseInput 
        placeholder='キーワード検索' 
        value={keyword}
        onChange={(e) => setKeyword(e.target.value)}
      />

      <div className='flex flex-col md:flex-row gap-6 items-start justify-start w-full'>
        {/* 職種ボタン＋ラベル */}
        <div className='flex flex-col items-start w-full md:w-auto'>
          <button
            type='button'
            onClick={() => setJobTypeModalOpen(true)}
            className='flex flex-row gap-2.5 h-[50px] items-center justify-center min-w-40 px-10 py-0 rounded-[32px] border border-[#999999] w-full md:w-[205px]'
          >
            <span className="font-['Noto_Sans_JP'] font-bold text-[16px] leading-[2] tracking-[1.6px] text-[#323232] w-full text-center">
              職種を選択
            </span>
          </button>
          {selectedJobTypes.length > 0 && (
            <div className='flex flex-col items-start mt-2'>
              <div className='flex flex-col gap-2 w-full'>
                {selectedJobTypes.slice(0, 6).map(item => (
                  <div
                    key={item}
                    className='bg-[#d2f1da] flex flex-row items-center justify-start px-[11px] py-[4px] rounded-[5px] w-fit'
                  >
                    <span className="font-['Noto_Sans_JP'] font-medium text-[14px] leading-[1.6] tracking-[1.4px] text-[#0f9058]">
                      {item}
                    </span>
                    <button
                      className='ml-0.5 p-1 rounded hover:bg-[#b6e5c5] transition-colors'
                      onClick={() =>
                        setSelectedJobTypes(
                          selectedJobTypes.filter(j => j !== item)
                        )
                      }
                      aria-label='削除'
                    >
                      <X size={18} className='text-[#0f9058]' />
                    </button>
                  </div>
                ))}
                {selectedJobTypes.length > 6 && (
                  <div className='bg-[#d2f1da] flex flex-row items-center justify-start px-[11px] py-[4px] rounded-[5px] w-fit'>
                    <span className="font-['Noto_Sans_JP'] font-medium text-[14px] leading-[1.6] tracking-[1.4px] text-[#0f9058]">
                      +{selectedJobTypes.length - 6}件
                    </span>
                  </div>
                )}
              </div>
            </div>
          )}
        </div>
        {/* 勤務地ボタン＋ラベル */}
        <div className='flex flex-col items-start w-full md:w-auto'>
          <button
            type='button'
            onClick={() => setLocationModalOpen(true)}
            className='flex flex-row gap-2.5 h-[50px] items-center justify-center min-w-40 px-10 py-0 rounded-[32px] border border-[#999999] w-full md:w-[205px]'
          >
            <span className="font-['Noto_Sans_JP'] font-bold text-[16px] leading-[2] tracking-[1.6px] text-[#323232] w-full text-center">
              勤務地を選択
            </span>
          </button>
          {selectedLocations.length > 0 && (
            <div className='flex flex-col items-start mt-2'>
              <div className='flex flex-row flex-wrap gap-2 max-w-[205px] w-full'>
                {selectedLocations.slice(0, 6).map(item => (
                  <div
                    key={item}
                    className='bg-[#d2f1da] flex flex-row items-center justify-start px-[11px] py-[4px] rounded-[5px] w-fit'
                  >
                    <span className="font-['Noto_Sans_JP'] font-medium text-[14px] leading-[1.6] tracking-[1.4px] text-[#0f9058]">
                      {item}
                    </span>
                    <button
                      className='ml-0.5 p-1 rounded hover:bg-[#b6e5c5] transition-colors'
                      onClick={() =>
                        setSelectedLocations(
                          selectedLocations.filter(l => l !== item)
                        )
                      }
                      aria-label='削除'
                    >
                      <X size={18} className='text-[#0f9058]' />
                    </button>
                  </div>
                ))}
                {selectedLocations.length > 6 && (
                  <div className='bg-[#d2f1da] flex flex-row items-center justify-start px-[11px] py-[4px] rounded-[5px] w-fit'>
                    <span className="font-['Noto_Sans_JP'] font-medium text-[14px] leading-[1.6] tracking-[1.4px] text-[#0f9058]">
                      +{selectedLocations.length - 6}件
                    </span>
                  </div>
                )}
              </div>
            </div>
          )}
        </div>
        {/* セレクトコンポーネント（年収） */}
        <div className='w-full md:w-[205px]'>
          <SelectInput
            options={salaryOptions}
            value={selectedSalary}
            onChange={v => setSelectedSalary(v)}
            placeholder={
              selectedSalary
                ? `年収：${selectedSalary.length > 7 ? selectedSalary.slice(0, 7) + '...' : selectedSalary}`
                : '年収'
            }
            className='w-full'
            style={{
              padding: '8px 16px 8px 11px',
              color: '#323232',
            }}
          />
        </div>
      </div>
      {/* 幅100%、高さ32pxのdiv（中央に線を追加） */}
      <div
        className=''
        style={{
          width: '100%',
          height: '32px',
          position: 'relative',
        }}
      >
        {/* 線の上に白いdiv */}
        <div
          style={{
            position: 'absolute',
            top: '0',
            left: 0,
            width: '100%',
            height: '16px',
            background: '#FFF',
            zIndex: 2,
          }}
        />
        <div
          style={{
            position: 'absolute',
            top: '50%',
            left: 0,
            width: '100%',
            height: '2px',
            background: '#EFEFEF',
            transform: 'translateY(-50%)',
            zIndex: 1,
          }}
        />
        {/* 線を覆う中央の184x32pxのdiv */}
        <button
          onClick={() => setIsSearchConditionActive(!isSearchConditionActive)}
          style={{
            position: 'absolute',
            top: '50%',
            left: '50%',
            width: '184px',
            height: '32px',
            background: '#fff',
            transform: 'translate(-50%, -50%)',
            zIndex: 3,
            border: 'none',
            cursor: 'pointer',
          }}
          className='flex items-center justify-center gap-4'
        >
          <span className='text-[#0F9058] font-bold text-[16px] leading-[2] tracking-[1.6px] font-[Noto_Sans_JP]'>
            検索条件追加
          </span>
          <svg
            width='14'
            height='10'
            viewBox='0 0 14 10'
            fill='none'
            xmlns='http://www.w3.org/2000/svg'
            style={{ 
              transform: isSearchConditionActive ? 'rotate(0deg)' : 'rotate(180deg)',
              transition: 'transform 0.4s ease'
            }}
          >
            <path
              d='M6.07178 8.90462L0.234161 1.71483C-0.339509 1.00828 0.206262 0 1.16238 0H12.8376C13.7937 0 14.3395 1.00828 13.7658 1.71483L7.92822 8.90462C7.46411 9.47624 6.53589 9.47624 6.07178 8.90462Z'
              fill='#0F9058'
            />
          </svg>
        </button>
      </div>
      {/* 新しいコンテンツ用のdiv（業種・アピールポイント） */}
      {isSearchConditionActive && (
        <div className='rounded flex flex-col md:flex-row gap-6 justify-center'>
          {/* 業種を選択ボタン＋ラベル */}
          <div className='flex flex-col items-start w-full md:w-[319px]'>
            <button
              type='button'
              onClick={() => setIndustryModalOpen(true)}
              className='flex flex-row gap-2.5 h-[50px] items-center justify-center px-10 py-0 rounded-[32px] border border-[#999999] w-full bg-white shadow-sm'
            >
              <span className="font-['Noto_Sans_JP'] font-bold text-[16px] leading-[2] tracking-[1.6px] text-[#323232] w-full text-center">
                業種を選択
              </span>
            </button>
            {selectedIndustries.length > 0 && (
              <div className='flex flex-col items-start mt-2'>
                <div className='flex flex-col gap-2 w-full'>
                  {selectedIndustries.slice(0, 6).map(item => (
                    <div
                      key={item}
                      className='bg-[#d2f1da] flex flex-row items-center justify-start px-[11px] py-[4px] rounded-[5px] w-fit'
                    >
                      <span className="font-['Noto_Sans_JP'] font-medium text-[14px] leading-[1.6] tracking-[1.4px] text-[#0f9058]">
                        {item}
                      </span>
                      <button
                        className='ml-0.5 p-1 rounded hover:bg-[#b6e5c5] transition-colors'
                        onClick={() =>
                          setSelectedIndustries(
                            selectedIndustries.filter(j => j !== item)
                          )
                        }
                        aria-label='削除'
                      >
                        <X size={18} className='text-[#0f9058]' />
                      </button>
                    </div>
                  ))}
                  {selectedIndustries.length > 6 && (
                    <div className='bg-[#d2f1da] flex flex-row items-center justify-start px-[11px] py-[4px] rounded-[5px] w-fit'>
                      <span className="font-['Noto_Sans_JP'] font-medium text-[14px] leading-[1.6] tracking-[1.4px] text-[#0f9058]">
                        +{selectedIndustries.length - 6}件
                      </span>
                    </div>
                  )}
                </div>
              </div>
            )}
          </div>
          {/* アピールポイントセレクト */}
          <div className='w-full md:w-[319px]'>
            <SelectInput
              options={appealPointOptions}
              value={selectedAppealPoint}
              onChange={v => setSelectedAppealPoint(v)}
              placeholder={
                selectedAppealPoint
                  ? `アピールポイント：${selectedAppealPoint.length > 19 ? selectedAppealPoint.slice(0, 19) + '...' : selectedAppealPoint}`
                  : 'アピールポイント'
              }
              className='w-full'
              style={{
                padding: '8px 16px 8px 11px',
                color: '#323232',
                background: '#fff',
                border: '1px solid #999999',
                borderRadius: '5px',
              }}
            />
          </div>
        </div>
      )}
      
      {/* モーダル */}
      {industryModalOpen && (
        <Modal
          title='業種を選択'
          isOpen={industryModalOpen}
          onClose={() => setIndustryModalOpen(false)}
          primaryButtonText='決定'
          onPrimaryAction={() => setIndustryModalOpen(false)}
          width='800px'
          height='680px'
        >
          <IndustryModal
            selectedIndustries={selectedIndustries}
            onIndustriesChange={setSelectedIndustries}
            onClose={() => setIndustryModalOpen(false)}
          />
        </Modal>
      )}
      
      {jobTypeModalOpen && (
        <Modal
          title='職種を選択'
          isOpen={jobTypeModalOpen}
          onClose={() => setJobTypeModalOpen(false)}
          primaryButtonText='決定'
          onPrimaryAction={() => setJobTypeModalOpen(false)}
          width='800px'
          height='680px'
        >
          <JobTypeModal
            selectedJobTypes={selectedJobTypes}
            setSelectedJobTypes={setSelectedJobTypes}
          />
        </Modal>
      )}
      
      {locationModalOpen && (
        <Modal
          title='勤務地を選択'
          isOpen={locationModalOpen}
          onClose={() => setLocationModalOpen(false)}
          primaryButtonText='決定'
          onPrimaryAction={() => setLocationModalOpen(false)}
          width='800px'
          height='680px'
        >
          <LocationModal
            selectedLocations={selectedLocations}
            setSelectedLocations={setSelectedLocations}
          />
        </Modal>
      )}
      
      {/* 検索ボタン */}
      <div className='flex flex-row gap-6 justify-center'>
        <button
          type='button'
          onClick={handleSearch}
          style={{
            display: 'flex',
            minWidth: '160px',
            padding: '15px 40px',
            justifyContent: 'center',
            alignItems: 'center',
            gap: '10px',
            borderRadius: '32px',
            background: 'linear-gradient(263deg, #26AF94 0%, #3A93CB 100%)',
            boxShadow: '0 5px 10px 0 rgba(0, 0, 0, 0.15)',
            border: 'none',
            color: 'white',
            fontSize: '16px',
            fontWeight: 'bold',
            cursor: 'pointer',
          }}
          className='w-full md:w-[160px] transition-all duration-150 hover:shadow-[0_5px_10px_0_rgba(0,0,0,0.15)] hover:bg-[linear-gradient(263deg,#249881_0%,#27668D_100%)]'
          onMouseEnter={(e) => {
            e.currentTarget.style.background = 'linear-gradient(263deg, #249881 0%, #27668D 100%)';
            e.currentTarget.style.boxShadow = '0 5px 10px 0 rgba(0, 0, 0, 0.15)';
          }}
          onMouseLeave={(e) => {
            e.currentTarget.style.background = 'linear-gradient(263deg, #26AF94 0%, #3A93CB 100%)';
            e.currentTarget.style.boxShadow = '0 5px 10px 0 rgba(0, 0, 0, 0.15)';
          }}
        >
          検索
        </button>
      </div>
    </div>
  );
}