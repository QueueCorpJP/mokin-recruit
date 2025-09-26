import { Metadata } from 'next';
import { HeroSection } from '@/app/candidate/components/HeroSection';
import { ScoutServiceSection } from '@/app/candidate/components/ScoutServiceSection';
import { FlowSection } from '@/app/candidate/components/FlowSection';
import { JobSearchSection } from '@/app/candidate/components/JobSearchSection';
import { FAQSection } from '@/app/candidate/components/FAQSection';
import { CTASection } from '@/app/candidate/components/CTASection';
import { ColumnSection } from '@/app/candidate/components/ColumnSection';

export const metadata: Metadata = {
  title: '転職・キャリアアップ支援 | CuePoint',
  description:
    '理想の転職を実現。CuePointの候補者向けキャリア支援サービスで、あなたの可能性を最大化',
  keywords: ['転職', 'キャリアアップ', '求人', '候補者向け', 'キャリア支援'],
};

export default function CandidateLandingPage() {
  return (
    <div className='w-full'>
      <div className='w-full'>
        <HeroSection />
        <ScoutServiceSection />
        <div className='md:hidden block'>
          <FlowSection />
        </div>
        <JobSearchSection />
        <FAQSection />
        <CTASection />
        <ColumnSection />
      </div>
    </div>
  );
}
