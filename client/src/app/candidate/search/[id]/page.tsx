'use client';

import { Navigation } from '@/components/ui/navigation';
import { SearchIcon } from 'lucide-react';
import { Star } from 'lucide-react';
import { BaseInput } from '@/components/ui/base-input';
import { useState } from 'react';
import { JobTypeModal } from '@/app/company/company/job/JobTypeModal';
import { LocationModal } from '@/app/company/company/job/LocationModal';
import { Modal } from '@/components/ui/mo-dal';
import { X } from 'lucide-react';
import { SelectInput } from '@/components/ui/select-input';
import { IndustryModal } from '@/app/company/company/job/IndustryModal';
import { Button } from '@/components/ui/button';
import { PaginationArrow } from '@/components/svg/PaginationArrow';

export default function CandidateSearchPage() {
  const [jobTypeModalOpen, setJobTypeModalOpen] = useState(false);
  const [locationModalOpen, setLocationModalOpen] = useState(false);
  const [selectedJobTypes, setSelectedJobTypes] = useState<string[]>([]);
  const [selectedLocations, setSelectedLocations] = useState<string[]>([]);
  const [industryModalOpen, setIndustryModalOpen] = useState(false);
  const [selectedIndustries, setSelectedIndustries] = useState<string[]>([]);

  return (
    <>
      <Navigation variant='candidate' />
      <main>
        <section className='w-full px-[80px] py-[40px] bg-[linear-gradient(0deg,_#17856F_0%,_#229A4E_100%)] flex items-center justify-center'>
          <div className='max-w-[1280px] w-full h-full flex flex-col relative'>
            <div className='flex justify-between items-start'>
              <div className='flex items-center'>
                <SearchIcon size={32} className='text-white' />
                <span className='ml-4 text-white text-2xl font-bold'>
                  求人を探す
                </span>
              </div>
              <button
                className='w-[150px] h-[94px] border-2 border-white rounded-[10px] bg-transparent p-[14px] hover:bg-white/30 transition-colors duration-150 absolute right-0 top-0'
                style={{ minWidth: 150, minHeight: 94 }}
              >
                <div className='flex flex-col items-center justify-center h-full gap-[10px]'>
                  <Star size={24} fill='white' stroke='white' />
                  <span className='text-white text-[16px] font-bold'>
                    お気に入り求人
                  </span>
                </div>
              </button>
            </div>
            <div className='flex-1 flex items-center justify-center mt-10'>
              <div className='w-[742px] bg-white rounded-lg shadow p-[40px]'>
                <div className='max-w-[662px] w-full mx-auto'>
                  <BaseInput placeholder='キーワード検索' className='mb-4' />
                  <div className='flex flex-row gap-[24px] items-start justify-start w-full mt-6'>
                    {/* 職種ボタン＋ラベル */}
                    <div className='flex flex-col items-start'>
                      <button
                        type='button'
                        onClick={() => setJobTypeModalOpen(true)}
                        className='flex flex-row gap-2.5 h-[50px] items-center justify-center min-w-40 px-10 py-0 rounded-[32px] border border-[#999999] w-[205px]'
                      >
                        <span className="font-['Noto_Sans_JP'] font-bold text-[16px] leading-[2] tracking-[1.6px] text-[#323232]">
                          職種を選択
                        </span>
                      </button>
                      {selectedJobTypes.length > 0 && (
                        <div className='flex flex-col items-start mt-2'>
                          <div className='flex flex-col gap-2 w-full'>
                            {selectedJobTypes.map(item => (
                              <div
                                key={item}
                                className='bg-[#d2f1da] flex flex-row gap-2.5 h-10 items-center justify-start px-[11px] py-[4px] rounded-[10px] w-fit'
                              >
                                <span className="font-['Noto_Sans_JP'] font-medium text-[14px] leading-[1.6] tracking-[1.4px] text-[#0f9058]">
                                  {item}
                                </span>
                                <button
                                  className='ml-2 p-1 rounded hover:bg-[#b6e5c5] transition-colors'
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
                          </div>
                        </div>
                      )}
                    </div>
                    {/* 勤務地ボタン＋ラベル */}
                    <div className='flex flex-col items-start'>
                      <button
                        type='button'
                        onClick={() => setLocationModalOpen(true)}
                        className='flex flex-row gap-2.5 h-[50px] items-center justify-center min-w-40 px-10 py-0 rounded-[32px] border border-[#999999] w-[205px]'
                      >
                        <span className="font-['Noto_Sans_JP'] font-bold text-[16px] leading-[2] tracking-[1.6px] text-[#323232]">
                          勤務地を選択
                        </span>
                      </button>
                      {selectedLocations.length > 0 && (
                        <div className='flex flex-col items-start mt-2'>
                          <div className='flex flex-row flex-wrap gap-2 max-w-[205px] w-full'>
                            {selectedLocations.map(item => (
                              <div
                                key={item}
                                className='bg-[#d2f1da] flex flex-row gap-2.5 h-10 items-center justify-start px-[11px] py-[4px] rounded-[10px] w-fit'
                              >
                                <span className="font-['Noto_Sans_JP'] font-medium text-[14px] leading-[1.6] tracking-[1.4px] text-[#0f9058]">
                                  {item}
                                </span>
                                <button
                                  className='ml-2 p-1 rounded hover:bg-[#b6e5c5] transition-colors'
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
                          </div>
                        </div>
                      )}
                    </div>
                    {/* セレクトコンポーネント（年収ラベル、右端、幅205px） */}
                    <div style={{ width: 205 }}>
                      <SelectInput
                        options={[]}
                        placeholder='年収'
                        style={{
                          width: '100%',
                          padding: '8px 16px 8px 11px',
                          color: '#323232',
                        }}
                      />
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
                  </div>
                  {/* 幅100%、高さ32pxのdiv（中央に線を追加） */}
                  <div
                    className='mt-6'
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
                    <div
                      style={{
                        position: 'absolute',
                        top: '50%',
                        left: '50%',
                        width: '184px',
                        height: '32px',
                        background: '#fff',
                        transform: 'translate(-50%, -50%)',
                        zIndex: 3,
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
                        style={{ transform: 'rotate(180deg)' }}
                      >
                        <path
                          d='M6.07178 8.90462L0.234161 1.71483C-0.339509 1.00828 0.206262 0 1.16238 0H12.8376C13.7937 0 14.3395 1.00828 13.7658 1.71483L7.92822 8.90462C7.46411 9.47624 6.53589 9.47624 6.07178 8.90462Z'
                          fill='#0F9058'
                        />
                      </svg>
                    </div>
                  </div>
                  {/* 新しいコンテンツ用のdiv */}
                  <div className='mt-6 rounded flex flex-row gap-8 justify-center'>
                    {/* 業種を選択ボタン＋ラベル */}
                    <div
                      style={{ width: 319 }}
                      className='flex flex-col items-start'
                    >
                      <button
                        type='button'
                        onClick={() => setIndustryModalOpen(true)}
                        className='flex flex-row gap-2.5 h-[50px] items-center justify-center px-10 py-0 rounded-[32px] border border-[#999999] w-full bg-white shadow-sm'
                      >
                        <span className="font-['Noto_Sans_JP'] font-bold text-[16px] leading-[2] tracking-[1.6px] text-[#323232]">
                          業種を選択
                        </span>
                      </button>
                      {selectedIndustries.length > 0 && (
                        <div className='flex flex-col items-start mt-2'>
                          <div className='flex flex-col gap-2 w-full'>
                            {selectedIndustries.map(item => (
                              <div
                                key={item}
                                className='bg-[#d2f1da] flex flex-row gap-2.5 h-10 items-center justify-start px-[11px] py-[4px] rounded-[10px] w-fit'
                              >
                                <span className="font-['Noto_Sans_JP'] font-medium text-[14px] leading-[1.6] tracking-[1.4px] text-[#0f9058]">
                                  {item}
                                </span>
                                <button
                                  className='ml-2 p-1 rounded hover:bg-[#b6e5c5] transition-colors'
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
                          </div>
                        </div>
                      )}
                    </div>
                    {/* アピールポイントセレクト（デザインのみ） */}
                    <div style={{ width: 319 }}>
                      <SelectInput
                        options={[]}
                        placeholder='アピールポイント'
                        style={{
                          width: '100%',
                          padding: '8px 16px 8px 11px',
                          color: '#323232',
                          background: '#fff',
                          border: '1px solid #999999',
                          borderRadius: '5px', // 年収セレクトと同じ
                        }}
                      />
                    </div>
                  </div>
                  {/* 業種モーダル */}
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
                        setSelectedIndustries={setSelectedIndustries}
                      />
                    </Modal>
                  )}
                  {/* 新しいフィルター用div（仮） */}
                  <div className='mt-6 flex flex-row gap-8 justify-center'>
                    <Button
                      variant='blue-gradient'
                      size='figma-default'
                      className='w-[160px] h-[50px] text-[18px]'
                      type='button'
                    >
                      検索
                    </Button>
                  </div>
                </div>
              </div>
            </div>
            {/* ここにコンテンツを追加できます */}
          </div>
        </section>
        <section className='w-full bg-[#F9F9F9] py-12'>
          <div className='max-w-[1280px] mx-auto'>
            {/* ページネーションデザイン（矢印アイコン8px） */}
            <div className='flex flex-row items-center justify-end gap-2 w-full'>
              <PaginationArrow direction='left' className='w-[8px] h-[8px]' />
              <span className='font-bold text-[12px] leading-[1.6] tracking-[0.1em] text-[#323232]'>
                1〜10件 / 1,000件
              </span>
              <PaginationArrow direction='right' className='w-[8px] h-[8px]' />
            </div>
            <div
              style={{
                width: '100%',
                height: '366px',
                boxShadow: '0px 0px 20px rgba(0,0,0,0.05)',
              }}
              className='bg-white mt-10'
            >
              {/* TODO: ここに新しいコンテンツを追加 */}
              <div className='flex flex-row justify-center items-center w-full h-full gap-8'>
                <img
                  src='/company.jpg'
                  alt='company'
                  width={477}
                  height={318}
                  style={{ width: 477, height: 318, objectFit: 'cover' }}
                />
                <div
                  style={{ width: 731, height: 318, background: 'transparent' }}
                >
                  {/* TODO: ここに新しい731x318pxのコンテンツを追加 */}
                </div>
              </div>
            </div>
          </div>
        </section>
      </main>
    </>
  );
}