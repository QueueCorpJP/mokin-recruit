'use client';

import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { SelectInput } from '@/components/ui/select-input';
import { Modal } from '@/components/ui/mo-dal';
import { JobTypeModal } from '@/app/company/job/JobTypeModal';
import { IndustryModal } from '@/app/company/job/IndustryModal';

export function JobSearchSection() {
  const [selectedJobTypes, setSelectedJobTypes] = useState<string[]>([]);
  const [selectedIndustries, setSelectedIndustries] = useState<string[]>([]);
  const [selectedSalary, setSelectedSalary] = useState('');
  const [jobTypeModalOpen, setJobTypeModalOpen] = useState(false);
  const [industryModalOpen, setIndustryModalOpen] = useState(false);

  const salaryOptions = [
    { value: '', label: '選択してください' },
    { value: '500-600', label: '500~600万' },
    { value: '600-800', label: '600~800万' },
    { value: '800-1000', label: '800~1,000万' },
    { value: '1000-1200', label: '1,000~1,200万' },
    { value: '1200-1500', label: '1,200~1,500万' },
    { value: '1500-2000', label: '1,500~2,000万' },
    { value: '2000-3000', label: '2,000~3,000万' },
    { value: '3000-5000', label: '3,000~5,000万' },
    { value: '5000+', label: '5,000万~' },
  ];
  return (
    <section className='relative py-20 flex flex-col items-center overflow-hidden px-[24px] md:px-0 z-40'>
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
        <div className='bg-white rounded-[10px] shadow-[0_0_20px_0_rgba(0,0,0,0.05)] md:p-[40px] md:px-[40px] p-[24px] w-full md:w-auto md:px-0 flex flex-col items-center gap-10 mt-16 relative z-50'>
          {/* Figma準拠：職種・勤務地セレクト2行分＋年収 */}
          <div className='w-full flex flex-col gap-[16px]'>
            {/* 1行目：職種 */}
            <div className='flex flex-col md:flex-row items-left md:items-center gap-[16px] '>
              <label className='text-[#323232] font-bold text-[16px] leading-[2em] tracking-[0.1em] font-[family-name:var(--font-noto-sans-jp)] text-left select-none'>
                職種
              </label>
              <div className='relative md:w-[400px] w-auto z-50'>
                <SelectInput
                  options={[]}
                  value=''
                  onChange={() => {}}
                  placeholder={
                    selectedJobTypes.length > 0
                      ? `${selectedJobTypes.length}件選択中`
                      : '選択してください'
                  }
                  className='w-full'
                  style={{
                    padding: '11px',
                    color: '#323232',
                    fontWeight: 'medium',
                    fontSize: '16px',
                    lineHeight: '2em',
                    letterSpacing: '0.1em',
                    border: '1px solid #E0E0E0',
                    borderRadius: '5px',
                    position: 'relative',
                    zIndex: 9999,
                  }}
                  onClick={() => setJobTypeModalOpen(true)}
                  readOnly
                />
              </div>
            </div>
            {/* 2行目：業種 */}
            <div className='flex md:flex-row flex-col md:items-center items-left gap-[16px]'>
              <label className='text-[#323232] font-bold text-[16px] leading-[2em] tracking-[0.1em] font-[family-name:var(--font-noto-sans-jp)] text-left  select-none'>
                業種
              </label>
              <div className='relative md:w-[400px] w-auto z-50'>
                <SelectInput
                  options={[]}
                  value=''
                  onChange={() => {}}
                  placeholder={
                    selectedIndustries.length > 0
                      ? `${selectedIndustries.length}件選択中`
                      : '選択してください'
                  }
                  className='w-full'
                  style={{
                    padding: '11px',
                    color: '#323232',
                    fontWeight: 'medium',
                    fontSize: '16px',
                    lineHeight: '2em',
                    letterSpacing: '0.1em',
                    border: '1px solid #E0E0E0',
                    borderRadius: '5px',
                    position: 'relative',
                    zIndex: 9999,
                  }}
                  onClick={() => setIndustryModalOpen(true)}
                  readOnly
                />
              </div>
            </div>
            {/* 3行目：年収 */}
            <div className='flex md:flex-row flex-col md:items-center items-left gap-[16px]'>
              <label className='text-[#323232] font-bold text-[16px] leading-[2em] tracking-[0.1em] font-[family-name:var(--font-noto-sans-jp)] text-left select-none'>
                年収
              </label>
              <div className='relative md:w-[400px] w-auto z-50'>
                <SelectInput
                  options={salaryOptions}
                  value={selectedSalary}
                  onChange={setSelectedSalary}
                  placeholder='選択してください'
                  className='w-full'
                  style={{
                    padding: '11px',
                    color: '#323232',
                    fontWeight: 'medium',
                    fontSize: '16px',
                    lineHeight: '2em',
                    letterSpacing: '0.1em',
                    border: '1px solid #E0E0E0',
                    borderRadius: '5px',
                    position: 'relative',
                    zIndex: 9999,
                  }}
                />
              </div>
            </div>
          </div>
          {/* 求人を探すボタン */}
          <div className='md:w-full w-[100%] flex justify-center mt-0'>
            <Button variant='green-gradient' size='figma-default' className='md:w-auto w-[100%]'>
              求人を探す
            </Button>
          </div>
        </div>
      </div>
      
      {/* モーダル */}
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
    </section>
  );
}