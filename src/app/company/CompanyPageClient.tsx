'use client';

import { useEffect } from 'react';
import { HeroSection } from '@/app/company/components/HeroSection';
import { ScoutServiceSection } from '@/app/company/components/ScoutServiceSection';
import { FlowSection } from '@/app/company/components/FlowSection';
import { FAQSection } from '@/app/company/components/FAQSection';
import { CTASection } from '@/app/company/components/CTASection';
import { ColumnSection } from '@/app/company/components/ColumnSection';

export default function CompanyPageClient() {
  // ページ読み込み時にカスタムボタンを設定
  useEffect(() => {
    if (typeof document === 'undefined') {
      return;
    }

    // 資料請求ボタンへのスムーズスクロール設定
    const handleScrollToContact = (e: Event) => {
      e.preventDefault();
      const element = document.getElementById('contact-form');
      if (element) {
        element.scrollIntoView({ behavior: 'smooth', block: 'start' });
      }
    };

    // 資料請求ボタンのリンクを探してイベントリスナーを設定
    const setupContactButton = () => {
      const links = document.querySelectorAll('a[href="#contact-form"]');
      links.forEach(link => {
        link.addEventListener('click', handleScrollToContact);
      });
    };

    // 初期設定とDOM変更の監視
    setupContactButton();
    const observer = new MutationObserver(setupContactButton);
    observer.observe(document.body, { childList: true, subtree: true });

    return () => {
      observer.disconnect();
      const links = document.querySelectorAll('a[href="#contact-form"]');
      links.forEach(link => {
        link.removeEventListener('click', handleScrollToContact);
      });
    };
  }, []);

  return (
    <div className="relative w-full">
      <div className="w-full">
        <HeroSection />
        <ScoutServiceSection />
        <FlowSection />
        <FAQSection />
        <CTASection />
        <ColumnSection />
      </div>
    </div>
  );
}