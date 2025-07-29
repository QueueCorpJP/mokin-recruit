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
import Link from 'next/link';

export default function CandidateSearchPage() {
  const [jobTypeModalOpen, setJobTypeModalOpen] = useState(false);
  const [locationModalOpen, setLocationModalOpen] = useState(false);
  const [selectedJobTypes, setSelectedJobTypes] = useState<string[]>([]);
  const [selectedLocations, setSelectedLocations] = useState<string[]>([]);
  const [industryModalOpen, setIndustryModalOpen] = useState(false);
  const [selectedIndustries, setSelectedIndustries] = useState<string[]>([]);
  const [starred, setStarred] = useState(false);

  // 12個分のダミーデータ
  const [jobCards, setJobCards] = useState(
    Array.from({ length: 12 }).map((_, i) => ({
      id: i,
      imageUrl: '/company.jpg',
      imageAlt: 'company',
      title: `求人タイトル${i + 1}`,
      tags: ['タグA', 'タグB', 'タグC'],
      companyName: '企業名テキスト',
      location: '勤務地テキスト',
      salary: '1,000万〜1,200万',
      starred: false,
    }))
  );

  // スター切り替え
  const handleStarClick = (idx: number) => {
    setJobCards(cards =>
      cards.map((card, i) =>
        i === idx ? { ...card, starred: !card.starred } : card
      )
    );
  };

  return (
    <>
      <Navigation variant='candidate' />
      <main>
        <section className='w-full px-4 py-6 md:px-[80px] md:py-[40px] bg-[linear-gradient(0deg,_#17856F_0%,_#229A4E_100%)] flex items-center justify-center'>
          <div className='max-w-[1280px] w-full h-full flex flex-col relative'>
            <div className='flex flex-row items-center justify-between w-full'>
              <div className='flex items-center'>
                <SearchIcon size={32} className='text-white' />
                <span className='ml-4 text-white text-[20px] md:text-2xl font-bold'>
                  求人を探す
                </span>
              </div>
              <Link href='/candidate/search/setting'>
                <button
                  className='box-border flex items-center justify-center rounded-[32px] border-2 border-white bg-transparent text-white font-bold text-[16px] tracking-[0.1em] whitespace-nowrap transition-colors duration-150 hover:bg-white/10'
                  style={{ width: 206, padding: '14px 40px', lineHeight: 2 }}
                >
                  求人検索に戻る
                </button>
              </Link>
            </div>
          </div>
        </section>
        <section className='w-full bg-[#F9F9F9] py-4 md:pt-10 px-6 pb-20'>
          <div className='max-w-[1280px] mx-auto'>
            {/* ページネーションデザイン（矢印アイコン8px） */}
            <div className='flex flex-row items-center justify-end gap-2 w-full'>
              <PaginationArrow direction='left' className='w-[8px] h-[8px]' />
              <span className='font-bold text-[12px] leading-[1.6] tracking-[0.1em] text-[#323232]'>
                1〜10件 / 1,000件
              </span>
              <PaginationArrow direction='right' className='w-[8px] h-[8px]' />
            </div>
            {/* JobPostCardを12個mapで表示 */}
            <div className='grid grid-cols-1 gap-8 mt-10'>
              {jobCards.map((card, idx) => (
                <JobPostCard
                  key={card.id}
                  imageUrl={card.imageUrl}
                  imageAlt={card.imageAlt}
                  title={card.title}
                  tags={card.tags}
                  companyName={card.companyName}
                  location={card.location}
                  salary={card.salary}
                  starred={card.starred}
                  onStarClick={() => handleStarClick(idx)}
                />
              ))}
            </div>
            {/* ページネーションデザイン（会社/求人ページ準拠、デザインのみ） */}
            <div className='flex justify-center items-center gap-2 mt-10'>
              <button
                className='w-14 h-14 flex items-center justify-center rounded-full border text-[16px] font-bold mx-2 border-[#DCDCDC] text-[#DCDCDC] cursor-not-allowed bg-transparent'
                disabled
              >
                <PaginationArrow direction='left' className='w-3 h-4' />
              </button>
              <button className='w-14 h-14 flex items-center justify-center rounded-full border text-[16px] font-bold mx-2 bg-[#0F9058] text-white border-[#0F9058]'>
                1
              </button>
              <button className='w-14 h-14 flex items-center justify-center rounded-full border text-[16px] font-bold mx-2 border-[#0F9058] text-[#0F9058] bg-transparent hover:bg-[#F3FBF7]'>
                2
              </button>
              <button className='w-14 h-14 flex items-center justify-center rounded-full border text-[16px] font-bold mx-2 border-[#0F9058] text-[#0F9058] bg-transparent hover:bg-[#F3FBF7]'>
                3
              </button>
              <button className='w-14 h-14 flex items-center justify-center rounded-full border text-[16px] font-bold mx-2 border-[#0F9058] text-[#0F9058] bg-transparent hover:bg-[#F3FBF7]'>
                4
              </button>
              <button className='w-14 h-14 flex items-center justify-center rounded-full border text-[16px] font-bold mx-2 border-[#0F9058] text-[#0F9058] bg-transparent hover:bg-[#F3FBF7]'>
                5
              </button>
              <button className='w-14 h-14 flex items-center justify-center rounded-full border text-[16px] font-bold mx-2 border-[#0F9058] text-[#0F9058] hover:bg-[#F3FBF7] bg-transparent'>
                <PaginationArrow direction='right' className='w-3 h-4' />
              </button>
            </div>
          </div>
        </section>
        <Footer />
      </main>
    </>
  );
}
