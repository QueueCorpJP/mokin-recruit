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
import { JobPostCard } from '@/components/ui/JobPostCard';
import { TagDisplay } from '@/components/ui/TagDisplay';
import { Tag } from '@/components/ui/Tag';
import { MapPinIcon, CurrencyYenIcon } from '@heroicons/react/24/solid';
import { Footer } from '@/components/ui/footer';

export default function CandidateSearchPage() {
  const [jobTypeModalOpen, setJobTypeModalOpen] = useState(false);
  const [locationModalOpen, setLocationModalOpen] = useState(false);
  const [selectedJobTypes, setSelectedJobTypes] = useState<string[]>([]);
  const [selectedLocations, setSelectedLocations] = useState<string[]>([]);
  const [industryModalOpen, setIndustryModalOpen] = useState(false);
  const [selectedIndustries, setSelectedIndustries] = useState<string[]>([]);
  const [starred, setStarred] = useState(false);

  return (
    <>
      <Navigation variant='candidate' />
      <main>
        <section className='w-full px-4 py-6 md:px-[80px] md:py-[40px] bg-[linear-gradient(0deg,_#17856F_0%,_#229A4E_100%)] flex items-center justify-center'>
          <div className='max-w-[1280px] w-full h-full flex flex-col relative'>
            <div className='flex flex-row items-center justify-between md:justify-start md:items-start md:flex-col md:flex md:relative'>
              <div className='flex items-center'>
                <SearchIcon size={32} className='text-white' />
                <span className='ml-4 text-white text-[20px] md:text-2xl font-bold'>
                  求人を探す
                </span>
              </div>
              {/* モバイルではstatic配置、md以上でabsolute配置 */}
              <button
                className='w-[150px] h-[94px] border-2 border-white rounded-[10px] bg-transparent p-[14px] hover:bg-white/30 transition-colors duration-150 md:mt-0 md:absolute md:right-0 md:top-0'
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
              <div className='w-full md:w-[742px] bg-white rounded-lg shadow p-6 md:p-[40px]'>
                <div className='max-w-[662px] w-full mx-auto flex flex-col gap-6'>
                  <BaseInput placeholder='キーワード検索' />
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
                    {/* セレクトコンポーネント（年収） */}
                    <div className='w-full md:w-[205px]'>
                      <SelectInput
                        options={[]}
                        placeholder='年収'
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
                  {/* 新しいコンテンツ用のdiv（業種・アピールポイント） */}
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
                    {/* アピールポイントセレクト */}
                    <div className='w-full md:w-[319px]'>
                      <SelectInput
                        options={[]}
                        placeholder='アピールポイント'
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
                  {/* 職種モーダル */}
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
                  {/* 勤務地モーダル */}
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
                  {/* 新しいフィルター用div（仮） */}
                  <div className='flex flex-row gap-6 justify-center'>
                    <Button
                      variant='blue-gradient'
                      size='figma-default'
                      className='w-full md:w-[160px] h-[50px] text-[18px]'
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
        <section className='w-full bg-[#F9F9F9] py-4 md:py-12 px-6'>
          <div className='max-w-[1280px] mx-auto'>
            {/* ページネーションデザイン（矢印アイコン8px） */}
            <div className='flex flex-row items-center justify-end gap-2 w-full'>
              <PaginationArrow direction='left' className='w-[8px] h-[8px]' />
              <span className='font-bold text-[12px] leading-[1.6] tracking-[0.1em] text-[#323232]'>
                1〜10件 / 1,000件
              </span>
              <PaginationArrow direction='right' className='w-[8px] h-[8px]' />
            </div>
            <JobPostCard
              imageUrl='/company.jpg'
              imageAlt='company'
              className='mt-10'
            >
              <div className='flex flex-col items-start relative'>
                {/* 右上のスターアイコン */}
                <button
                  type='button'
                  className='absolute top-0 right-0 z-10 p-2'
                  onClick={() => setStarred(s => !s)}
                  aria-label='お気に入り'
                >
                  <svg
                    width='32'
                    height='32'
                    viewBox='0 0 32 32'
                    fill='none'
                    xmlns='http://www.w3.org/2000/svg'
                  >
                    <path
                      d='M17.7409 1.4809C17.4197 0.809848 16.741 0.382812 15.9956 0.382812C15.2503 0.382812 14.5776 0.809848 14.2504 1.4809L10.3538 9.55188L1.65173 10.8452C0.924534 10.955 0.318538 11.4674 0.0943199 12.169C-0.129899 12.8706 0.0519 13.6453 0.573056 14.1639L6.88753 20.4535L5.39678 29.3419C5.27558 30.074 5.57858 30.8182 6.17852 31.2514C6.77845 31.6845 7.57231 31.7394 8.22678 31.3917L16.0017 27.2128L23.7766 31.3917C24.4311 31.7394 25.225 31.6906 25.8249 31.2514C26.4248 30.8121 26.7278 30.074 26.6066 29.3419L25.1098 20.4535L31.4243 14.1639C31.9455 13.6453 32.1333 12.8706 31.903 12.169C31.6728 11.4674 31.0728 10.955 30.3456 10.8452L21.6375 9.55188L17.7409 1.4809Z'
                      fill={starred ? '#FFDA5F' : '#DCDCDC'}
                    />
                  </svg>
                </button>
                <div className='flex flex-row gap-2 items-start flex-wrap w-[277px]'>
                  <Tag className='py-0.5 px-2 md:py-0 md:px-0'>タグA</Tag>
                  <Tag className='py-0.5 px-2 md:py-0 md:px-0'>タグB</Tag>
                  <Tag className='py-0.5 px-2 md:py-0 md:px-0'>タグC</Tag>
                </div>
                <div
                  className='mt-4 md:mt-2 text-[18px] font-bold'
                  style={{ color: '#0f9058', lineHeight: '1.6' }}
                >
                  求人テキスト
                </div>
                <div className='flex flex-row items-center mt-4 hidden md:flex'>
                  <svg
                    width='20'
                    height='20'
                    viewBox='0 0 16 16'
                    fill='none'
                    xmlns='http://www.w3.org/2000/svg'
                  >
                    <path
                      d='M8.74534 15.6405C10.3582 13.629 14.0366 8.7539 14.0366 6.01557C14.0366 2.69447 11.3328 0 8.00023 0C4.66765 0 1.96387 2.69447 1.96387 6.01557C1.96387 8.7539 5.64228 13.629 7.25512 15.6405C7.64182 16.1198 8.35864 16.1198 8.74534 15.6405ZM8.00023 4.01038C8.53388 4.01038 9.04567 4.22164 9.42302 4.59768C9.80036 4.97373 10.0124 5.48376 10.0124 6.01557C10.0124 6.54738 9.80036 7.0574 9.42302 7.43345C9.04567 7.8095 8.53388 8.02076 8.00023 8.02076C7.46658 8.02076 6.95479 7.8095 6.57745 7.43345C6.2001 7.0574 5.98811 6.54738 5.98811 6.01557C5.98811 5.48376 6.2001 4.97373 6.57745 4.59768C6.95479 4.22164 7.46658 4.01038 8.00023 4.01038Z'
                      fill='#0F9058'
                    />
                  </svg>
                  <span
                    className='ml-1 text-[16px]'
                    style={{ color: '#323232' }}
                  >
                    勤務地テキスト
                  </span>
                </div>
                <div className='flex flex-row items-center mt-2 hidden md:flex'>
                  <svg
                    width='20'
                    height='20'
                    viewBox='0 0 16 16'
                    fill='none'
                    xmlns='http://www.w3.org/2000/svg'
                  >
                    <path
                      d='M4.39424 0.510485C4.04567 -0.0180946 3.34143 -0.157382 2.81502 0.192623C2.28862 0.542628 2.15346 1.24978 2.50203 1.77836L5.87386 6.85701H4.01722C3.38767 6.85701 2.87905 7.36773 2.87905 7.99988C2.87905 8.63203 3.38767 9.14276 4.01722 9.14276H6.86265V10.2856H4.01722C3.38767 10.2856 2.87905 10.7964 2.87905 11.4285C2.87905 12.0607 3.38767 12.5714 4.01722 12.5714H6.86265V14.8571C6.86265 15.4893 7.37127 16 8.00082 16C8.63037 16 9.13899 15.4893 9.13899 14.8571V12.5714H11.9844C12.614 12.5714 13.1226 12.0607 13.1226 11.4285C13.1226 10.7964 12.614 10.2856 11.9844 10.2856H9.13899V9.14276H11.9844C12.614 9.14276 13.1226 8.63203 13.1226 7.99988C13.1226 7.36773 12.614 6.85701 11.9844 6.85701H10.1278L13.4996 1.77836C13.8482 1.25335 13.7059 0.542628 13.1831 0.192623C12.6602 -0.157382 11.9524 -0.0145231 11.6038 0.510485L8.00082 5.93914L4.39424 0.510485Z'
                      fill='#0F9058'
                    />
                  </svg>
                  <span
                    className='ml-1 text-[16px]'
                    style={{ color: '#323232', lineHeight: '2' }}
                  >
                    1,000万〜1,200万
                  </span>
                </div>
                <div
                  className='pt-4 border-t-2 w-full bg-white static md:absolute md:left-0 md:bottom-0'
                  style={{ borderColor: 'transparent' }}
                >
                  <div className='flex flex-row items-center'>
                    <div
                      style={{
                        width: 32,
                        height: 32,
                        borderRadius: '50%',
                        background: '#0f9058',
                      }}
                    />
                    <span
                      className='ml-2 text-[14px] md:text-[16px] font-bold'
                      style={{ color: '#323232', lineHeight: '2' }}
                    >
                      企業名テキスト
                    </span>
                  </div>
                </div>
              </div>
              {/* TODO: ここに新しい731x318pxのコンテンツを追加 */}
            </JobPostCard>
          </div>
        </section>
        <Footer />
      </main>
    </>
  );
}
