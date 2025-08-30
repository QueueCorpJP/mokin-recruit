import { FVWrapper } from '@/components/ui/FVWrapper';

import { Metadata } from 'next';
import { Button } from '@/components/ui/button';
import { ColumnCard } from '@/components/ui/ColumnCard';
import { HeroSection } from '@/app/company/components/HeroSection';
import { ScoutServiceSection } from '@/app/company/components/ScoutServiceSection';
import { FlowSection } from '@/app/company/components/FlowSection';
import { FAQSection } from '@/app/company/components/FAQSection';
import { CTASection } from '@/app/company/components/CTASection';
import { ColumnSection } from '@/app/company/components/ColumnSection';

export const metadata: Metadata = {
  title: '転職・キャリアアップ支援 | CuePoint',
  description:
    '理想の転職を実現。CuePointの候補者向けキャリア支援サービスで、あなたの可能性を最大化',
  keywords: ['転職', 'キャリアアップ', '求人', '候補者向け', 'キャリア支援'],
};

export default function CandidateLandingPage() {

  const columnData = [
    {
      imageUrl: '/company.jpg',
      title: 'テキストが入ります。テキストが入ります。テキストが入ります。',
      categories: ['カテゴリ', 'カテゴリ'],
    },
    {
      imageUrl: '/company.jpg',
      title: 'テキストが入ります。テキストが入ります。テキストが入ります。',
      categories: ['カテゴリ', 'カテゴリ'],
    },
    {
      imageUrl: '/company.jpg',
      title: 'テキストが入ります。テキストが入ります。テキストが入ります。',
      categories: ['カテゴリ', 'カテゴリ'],
    },
    {
      imageUrl: '/company.jpg',
      title: 'テキストが入ります。テキストが入ります。テキストが入ります。',
      categories: ['カテゴリ', 'カテゴリ'],
    },
    {
      imageUrl: '/company.jpg',
      title: 'テキストが入ります。テキストが入ります。テキストが入ります。',
      categories: ['カテゴリ', 'カテゴリ'],
    },
    {
      imageUrl: '/company.jpg',
      title: 'テキストが入ります。テキストが入ります。テキストが入ります。',
      categories: ['カテゴリ', 'カテゴリ'],
    },
  ];

  return (
    <div className="relative w-full">
      <div className="w-full">
        <HeroSection />
        <ScoutServiceSection />
        <FlowSection />
        {/* <JobSearchSection /> */}
        <FAQSection />
        <CTASection />
        <ColumnSection />
      </div>
    </div>
  );
}
