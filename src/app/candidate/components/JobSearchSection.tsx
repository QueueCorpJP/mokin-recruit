'use client';

import { Button } from '@/components/ui/button';
import { useState } from 'react';
import { useRouter } from 'next/navigation';

export function JobSearchSection() {
  const router = useRouter();
  const [selectedJobType, setSelectedJobType] = useState('');
  const [selectedIndustry, setSelectedIndustry] = useState('');
  const [selectedSalary, setSelectedSalary] = useState('');

  const handleSearch = () => {
    const searchParams = new URLSearchParams();
    
    if (selectedJobType) {
      searchParams.set('jobTypes', selectedJobType);
    }
    if (selectedIndustry) {
      searchParams.set('industries', selectedIndustry);
    }
    if (selectedSalary) {
      searchParams.set('salaryMin', selectedSalary);
    }

    const queryString = searchParams.toString();
    const url = queryString ? `/candidate/search/setting?${queryString}` : '/candidate/search/setting';
    
    router.push(url);
  };
  return (
    <section className='relative py-20 flex flex-col items-center overflow-hidden px-[24px] md:px-0'>
      {/* 背景グラデーションレイヤー */}
      <div
        className='absolute inset-0 w-full h-full z-0 pointer-events-none'
        style={{
          background: 'linear-gradient(0deg, #198D76 0%, #1CA74F 100%)',
        }}
        aria-hidden='true'
      />
      {/* 背景画像レイヤー（opacity:0.1） */}
      <div
        className='absolute inset-0 w-full h-full z-0 pointer-events-none'
        style={{
          backgroundImage: 'url(/company.jpg)',
          backgroundSize: 'cover',
          backgroundPosition: 'center',
          backgroundRepeat: 'no-repeat',
          opacity: 0.1,
        }}
        aria-hidden='true'
      />
      {/* 既存の内容をz-10で上に重ねる */}
      <div className='relative z-10 w-full max-w-[1200px] flex flex-col items-center'>
        {/* 見出し */}
        <h2
          className='text-center font-bold text-[24px] md:text-[32px] leading-[1.6] tracking-wider text-white font-[family-name:var(--font-noto-sans-jp)]'
          style={{ letterSpacing: '0.1em' }}
        >
          求人を探す
        </h2>
        {/* ドット装飾 */}
        <div className='flex flex-row gap-7 mt-4'>
          <span className='w-[8px] h-[8px] md:h-[12px] md:w-[12px] rounded-full bg-white'></span>
          <span className='w-[8px] h-[8px] md:h-[12px] md:w-[12px] rounded-full bg-white'></span>
          <span className='w-[8px] h-[8px] md:h-[12px] md:w-[12px] rounded-full bg-white'></span>
        </div>
        {/* 白背景角丸ボックス */}
        <div className='bg-white rounded-[10px] shadow-[0_0_20px_0_rgba(0,0,0,0.05)] md:p-[40px] md:px-[40px] p-[24px] w-full md:w-auto md:px-0 flex flex-col items-center gap-10 mt-16'>
          {/* Figma準拠：職種・勤務地セレクト2行分＋年収 */}
          <div className='w-full flex flex-col gap-[16px]'>
            {/* 1行目：職種 */}
            <div className='flex flex-col md:flex-row items-left md:items-center gap-[16px] '>
              <label className='text-[#323232] font-bold text-[16px] leading-[2em] tracking-[0.1em] font-[family-name:var(--font-noto-sans-jp)] text-left select-none'>
                職種
              </label>
              <div className='relative md:w-[400px] w-auto'>
                <select 
                  value={selectedJobType}
                  onChange={(e) => setSelectedJobType(e.target.value)}
                  className='appearance-none w-full rounded-[5px] border border-[#E0E0E0] px-[11px] py-[11px] text-[#323232] font-medium text-[16px] leading-[2em] tracking-[0.1em] font-[family-name:var(--font-noto-sans-jp)] focus:outline-none focus:ring-2 focus:ring-[#198D76] focus:border-[#198D76]'>
                  <option value=''>選択してください</option>
                  <option value='engineer'>エンジニア</option>
                  <option value='designer'>デザイナー</option>
                  <option value='sales'>営業</option>
                </select>
                <svg
                  className='pointer-events-none absolute right-3 top-1/2 -translate-y-1/2 w-3 h-3'
                  viewBox='0 0 24 16'
                  fill='none'
                  xmlns='http://www.w3.org/2000/svg'
                >
                  <path
                    d='M12 15Q12 16 13 15.5L22 2Q23 1 22 0H2Q1 1 2 2L11 15.5Q12 16 12 15Z'
                    fill='#0F9058'
                  />
                </svg>
              </div>
            </div>
            {/* 2行目：勤務地 */}
            <div className='flex md:flex-row flex-col md:items-center items-left gap-[16px]'>
              <label className='text-[#323232] font-bold text-[16px] leading-[2em] tracking-[0.1em] font-[family-name:var(--font-noto-sans-jp)] text-left  select-none'>
                業種
              </label>
              <div className='relative md:w-[400px] w-auto'>
                <select 
                  value={selectedIndustry}
                  onChange={(e) => setSelectedIndustry(e.target.value)}
                  className='appearance-none w-full rounded-[5px] border border-[#E0E0E0] px-[11px] py-[11px] text-[#323232] font-medium text-[16px] leading-[2em] tracking-[0.1em] font-[family-name:var(--font-noto-sans-jp)] focus:outline-none focus:ring-2 focus:ring-[#198D76] focus:border-[#198D76]'>
                  <option value=''>選択してください</option>
                  <option value='IT・通信'>IT・通信</option>
                  <option value='金融・保険'>金融・保険</option>
                  <option value='メーカー'>メーカー</option>
                  <option value='商社・流通・小売'>商社・流通・小売</option>
                  <option value='サービス'>サービス</option>
                </select>
                <svg
                  className='pointer-events-none absolute right-3 top-1/2 -translate-y-1/2 w-3 h-3'
                  viewBox='0 0 24 16'
                  fill='none'
                  xmlns='http://www.w3.org/2000/svg'
                >
                  <path
                    d='M12 15Q12 16 13 15.5L22 2Q23 1 22 0H2Q1 1 2 2L11 15.5Q12 16 12 15Z'
                    fill='#0F9058'
                  />
                </svg>
              </div>
            </div>
            {/* 3行目：年収 */}
            <div className='flex md:flex-row flex-col md:items-center items-left gap-[16px]'>
              <label className='text-[#323232] font-bold text-[16px] leading-[2em] tracking-[0.1em] font-[family-name:var(--font-noto-sans-jp)] text-left select-none'>
                年収
              </label>
              <div className='relative md:w-[400px] w-auto'>
                <select 
                  value={selectedSalary}
                  onChange={(e) => setSelectedSalary(e.target.value)}
                  className='appearance-none w-full rounded-[5px] border border-[#E0E0E0] px-[11px] py-[11px] text-[#323232] font-medium text-[16px] leading-[2em] tracking-[0.1em] font-[family-name:var(--font-noto-sans-jp)] focus:outline-none focus:ring-2 focus:ring-[#198D76] focus:border-[#198D76]'>
                  <option value=''>選択してください</option>
                  <option value='300'>300万円以上</option>
                  <option value='500'>500万円以上</option>
                  <option value='700'>700万円以上</option>
                  <option value='800'>800万円以上</option>
                  <option value='1000'>1000万円以上</option>
                </select>
                <svg
                  className='pointer-events-none absolute right-3 top-1/2 -translate-y-1/2 w-3 h-3'
                  viewBox='0 0 24 16'
                  fill='none'
                  xmlns='http://www.w3.org/2000/svg'
                >
                  <path
                    d='M12 15Q12 16 13 15.5L22 2Q23 1 22 0H2Q1 1 2 2L11 15.5Q12 16 12 15Z'
                    fill='#0F9058'
                  />
                </svg>
              </div>
            </div>
          </div>
          {/* 求人を探すボタン */}
          <div className='md:w-full w-[100%] flex justify-center mt-0'>
            <Button 
              variant='green-gradient' 
              size='figma-default' 
              className='md:w-auto w-[100%]'
              onClick={handleSearch}
            >
              求人を探す
            </Button>
          </div>
        </div>
      </div>
    </section>
  );
}