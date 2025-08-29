'use client';

import { useState } from 'react';
import Link from 'next/link';
import { usePathname, useRouter } from 'next/navigation';
import { cn } from '@/lib/utils';
import { ChevronRightIcon } from 'lucide-react';
import { SectionHeading } from '@/components/ui/SectionHeading';

interface CompanyTaskSidebarProps {
  className?: string;
}

export function CompanyTaskSidebar({ className }: CompanyTaskSidebarProps) {
  const pathname = usePathname();
  const router = useRouter();

  // Figmaデザインに基づくスタイル定義
  // Upper block (Plan Information) styles
  const upperBlockStyle: React.CSSProperties = {
    background: 'white',
    padding: '24px',
    borderRadius: '10px',
    display: 'flex',
    flexDirection: 'column',
    gap: '24px',
    alignItems: 'center',
  };

  const planTitleStyle: React.CSSProperties = {
    fontFamily: "'Noto Sans JP', sans-serif",
    fontWeight: 700,
    fontSize: '18px',
    color: '#0F9058',
    textAlign: 'center',
    letterSpacing: '1.8px',
    lineHeight: '1.6',
  };

  const planInfoStyle: React.CSSProperties = {
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    gap: '4px',
    width: '100%',
  };

  const remainingTextStyle: React.CSSProperties = {
    fontFamily: "'Noto Sans JP', sans-serif",
    fontWeight: 400,
    fontSize: '16px',
    color: '#323232',
    letterSpacing: '1.6px',
    lineHeight: '2',
  };

  const remainingNumberStyle: React.CSSProperties = {
    fontFamily: "'Noto Sans JP', sans-serif",
    fontWeight: 700,
    fontSize: '32px',
    color: '#323232',
    letterSpacing: '3.2px',
    lineHeight: '1.6',
  };

  const nextUpdateStyle: React.CSSProperties = {
    fontFamily: "'Noto Sans JP', sans-serif",
    fontWeight: 500,
    fontSize: '14px',
    color: '#323232',
    letterSpacing: '1.4px',
    lineHeight: '1.6',
  };

  const planButtonStyle: React.CSSProperties = {
    background: 'white',
    border: '1px solid #0F9058',
    borderRadius: '32px',
    padding: '10px 24px',
    width: '100%',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    cursor: 'pointer',
    transition: 'all 0.2s ease',
  };

  const planButtonTextStyle: React.CSSProperties = {
    fontFamily: "'Noto Sans JP', sans-serif",
    fontWeight: 700,
    fontSize: '12px',
    color: '#0F9058',
    letterSpacing: '1.2px',
    lineHeight: '1.6',
    textAlign: 'center',
  };

  const faqLinkStyle: React.CSSProperties = {
    display: 'flex',
    alignItems: 'center',
    gap: '4px',
    cursor: 'pointer',
  };

  const faqTextStyle: React.CSSProperties = {
    fontFamily: "'Noto Sans JP', sans-serif",
    fontWeight: 700,
    fontSize: '14px',
    color: '#999999',
    letterSpacing: '1.4px',
    lineHeight: '1.6',
    textDecoration: 'underline',
  };

  // Lower block (Help Section) styles
  const lowerBlockStyle: React.CSSProperties = {
    background: 'white',
    padding: '24px',
    borderRadius: '10px',
    display: 'flex',
    flexDirection: 'column',
    gap: '24px',
    alignItems: 'center',
  };

  const sectionTitleStyle: React.CSSProperties = {
    fontFamily: "'Noto Sans JP', sans-serif",
    fontWeight: 700,
    fontSize: '16px',
    color: '#323232',
    textAlign: 'center',
    letterSpacing: '1.6px',
    lineHeight: '2',
    width: '100%',
  };

  const helpButtonStyle: React.CSSProperties = {
    background: 'white',
    border: '1px solid #0F9058',
    borderRadius: '32px',
    padding: '14px 40px',
    width: '100%',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    gap: '10px',
    cursor: 'pointer',
    transition: 'all 0.2s ease',
  };

  const helpButtonTextStyle: React.CSSProperties = {
    fontFamily: "'Noto Sans JP', sans-serif",
    fontWeight: 700,
    fontSize: '16px',
    color: '#0F9058',
    letterSpacing: '1.6px',
    lineHeight: '2',
  };

  const contactTextStyle: React.CSSProperties = {
    fontFamily: "'Noto Sans JP', sans-serif",
    fontWeight: 600,
    fontSize: '14px',
    color: '#323232',
    textAlign: 'center',
    letterSpacing: '1.4px',
    lineHeight: '1.6',
  };

  const contactLinkStyle: React.CSSProperties = {
    color: '#0F9058',
    textDecoration: 'underline',
    cursor: 'pointer',
  };

  const dividerStyle: React.CSSProperties = {
    width: '100%',
    height: '1px',
    background: 'linear-gradient(to right, transparent, #E5E5E5, transparent)',
  };

  const supportBannerStyle: React.CSSProperties = {
    background: 'linear-gradient(135deg, #FFE082 0%, #FFD54F 100%)',
    borderRadius: '10px',
    padding: '15px 24px',
    width: '100%',
    display: 'flex',
    alignItems: 'center',
    gap: '16px',
    cursor: 'pointer',
    position: 'relative',
    overflow: 'hidden',
    transition: 'all 0.2s ease',
  };

  const freeTagStyle: React.CSSProperties = {
    background: 'white',
    borderRadius: '37px',
    width: '56px',
    height: '56px',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    flexShrink: 0,
  };

  const freeTextStyle: React.CSSProperties = {
    fontFamily: "'Noto Sans JP', sans-serif",
    fontWeight: 700,
    fontSize: '18px',
    color: '#FF9D00',
    letterSpacing: '1.8px',
    lineHeight: '1.6',
  };

  const supportTextStyle: React.CSSProperties = {
    fontFamily: "'Noto Sans JP', sans-serif",
    fontWeight: 700,
    fontSize: '16px',
    color: '#323232',
    letterSpacing: '1.6px',
    lineHeight: '1.6',
  };

  const headingListStyle: React.CSSProperties = {
    display: 'flex',
    flexDirection: 'column',
    gap: '8px',
  };

  return (
    <div className={cn("w-full max-w-[320px]", className)}>
      {/* プラン情報セクション */}
      <div style={{ ...headingListStyle, marginBottom: '20px' }}>
        <SectionHeading
          iconSrc='/images/ticket.svg'
          iconAlt='スカウトチケットアイコン'
        >
          スカウトチケット
        </SectionHeading>
        
        {/* Upper Block - Plan Information (Figma design) */}
        <div style={upperBlockStyle}>
          <div style={{ width: '100%', textAlign: 'center' }}>
            <div style={planTitleStyle}>スタンダードプラン</div>
            <div style={planInfoStyle}>
              <div>
                <span style={remainingTextStyle}>残数：</span>
                <span style={remainingNumberStyle}>100</span>
              </div>
              <div style={nextUpdateStyle}>次回更新日：2024/12/31</div>
            </div>
          </div>
          
          <button 
            style={planButtonStyle}
            onMouseEnter={(e) => {
              e.currentTarget.style.backgroundColor = '#F0F9FF';
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.backgroundColor = 'white';
            }}
          >
            <div style={planButtonTextStyle}>
              チケットの追加購入／<br />プラン変更
            </div>
          </button>
          
          <div style={faqLinkStyle}>
            <img src="/images/question.svg" 
            className='font-[#999] w-4 h-4'
            style={{
                    display: 'block',
                    maxWidth: 'none',
                    filter: 'brightness(0) saturate(100%) invert(87%) sepia(0%) saturate(0%) hue-rotate(0deg) brightness(70%) contrast(95%)',
                  }}/>
            <span style={faqTextStyle}>プランごとの違いはこちら</span>
          </div>
        </div>
      </div>

      {/* ヘルプセクション */}
      <div style={headingListStyle}>
        <SectionHeading
          iconSrc='/images/operation.svg'
          iconAlt='ヘルプアイコン'
        >
          お困りですか？
        </SectionHeading>
        
        {/* Lower Block - Help Section (Figma design) */}
        <div style={lowerBlockStyle}>
          <div style={sectionTitleStyle}>サービスの使い方を知りたい</div>
          
          <div style={{ display: 'flex', flexDirection: 'column', gap: '8px', width: '100%' }}>
            <button 
              style={helpButtonStyle}
              onMouseEnter={(e) => {
                e.currentTarget.style.backgroundColor = '#F0F9FF';
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.backgroundColor = 'white';
              }}
              onClick={() => router.push('/company/guide')}
            >
             
             <img src="/images/book.svg" 
             style={
              {
                    display: 'block',
                    maxWidth: 'none',
                    width: '24px',
                    height: '24px',
                    filter: 'brightness(0) saturate(100%) invert(36%) sepia(75%) saturate(1045%) hue-rotate(114deg) brightness(91%) contrast(92%)',
                  }
             }
             />
              <span style={helpButtonTextStyle}>ご利用ガイド</span>
            </button>
            
            <button 
              style={helpButtonStyle}
              onMouseEnter={(e) => {
                e.currentTarget.style.backgroundColor = '#F0F9FF';
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.backgroundColor = 'white';
              }}
              onClick={() => router.push('/company/faq')}
            >
             <img src="/images/question.svg" 
             style={
              {
                    display: 'block',
                    maxWidth: 'none',
                    width: '24px',
                    height: '24px',
                    filter: 'brightness(0) saturate(100%) invert(36%) sepia(75%) saturate(1045%) hue-rotate(114deg) brightness(91%) contrast(92%)',
                  }
             }
             />

              <span style={helpButtonTextStyle}>よくある質問</span>
            </button>
          </div>
          
          <div style={contactTextStyle}>
            解決しない場合は、<br />
            お気軽に<span style={contactLinkStyle} onClick={() => router.push('/company/contact')}>お問い合わせ</span>ください。
          </div>
          
          <div style={dividerStyle} />
          
          <div style={sectionTitleStyle}>スカウトがうまくいかない</div>
          
          <div 
            style={supportBannerStyle}
            onMouseEnter={(e) => {
              e.currentTarget.style.transform = 'scale(1.02)';
              e.currentTarget.style.boxShadow = '0 4px 20px rgba(255, 193, 7, 0.3)';
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.transform = 'scale(1)';
              e.currentTarget.style.boxShadow = 'none';
            }}
            onClick={() => router.push('/company/support')}
          >
            <div style={freeTagStyle}>
              <span style={freeTextStyle}>無料</span>
            </div>
            <div style={supportTextStyle}>
              サポートに<br />
              相談してみる
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}