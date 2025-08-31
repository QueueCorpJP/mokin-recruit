'use client';

import { usePathname, useRouter } from 'next/navigation';
import { cn } from '@/lib/utils';
import { SectionHeading } from '@/components/ui/SectionHeading';

interface CompanyTaskSidebarProps {
  className?: string;
  showTodoAndNews?: boolean;
}

export function CompanyTaskSidebar({ className, showTodoAndNews = false }: CompanyTaskSidebarProps) {
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

      {/* 対応リストセクション - mypageでのみ表示 */}
      {showTodoAndNews && (
      <div style={{ ...headingListStyle, marginBottom: '20px' }}>
        <SectionHeading
          iconSrc='/images/list.svg'
          iconAlt='対応リストアイコン'
        >
          対応リスト
        </SectionHeading>
        
        <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
          {/* 対応リストカード */}
          <div style={{
            background: 'white',
            padding: '16px 24px',
            borderRadius: '8px',
            boxShadow: '0px 0px 20px 0px rgba(0,0,0,0.05)',
            display: 'flex',
            flexDirection: 'column',
            gap: '8px',
          }}>
            {/* グラデーションタグ */}
            <div style={{
              background: 'linear-gradient(to left, #86c36a, #65bdac)',
              borderRadius: '8px',
              padding: '0 20px',
              height: '32px',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              maxWidth: '100%',
            }}>
              <span style={{
                fontFamily: "'Noto Sans JP', sans-serif",
                fontSize: '14px',
                fontWeight: 700,
                color: 'white',
                letterSpacing: '1.4px',
                lineHeight: '1.6',
                overflow: 'hidden',
                textOverflow: 'ellipsis',
                whiteSpace: 'nowrap',
              }}>
                グループ名テキストグループ名テキスト
              </span>
            </div>
            
            {/* メインテキスト */}
            <div style={{ display: 'flex', flexDirection: 'column', gap: '4px' }}>
              <div style={{
                fontFamily: "'Noto Sans JP', sans-serif",
                fontSize: '16px',
                fontWeight: 700,
                color: '#323232',
                letterSpacing: '1.6px',
                lineHeight: '2',
                wordWrap: 'break-word',
                overflowWrap: 'break-word',
              }}>
                まずは求人を登録しましょう。
              </div>
              <div style={{
                fontFamily: "'Noto Sans JP', sans-serif",
                fontSize: '10px',
                fontWeight: 500,
                color: '#999999',
                letterSpacing: '1px',
                lineHeight: '1.6',
                wordWrap: 'break-word',
                overflowWrap: 'break-word',
              }}>
                求人を登録すると、スカウト送信が可能になります。
              </div>
            </div>
          </div>
          
          {/* もっと見るボタン */}
          <button style={{
            background: 'linear-gradient(135deg, #0F9058, #65bdac)',
            border: 'none',
            borderRadius: '10px',
            padding: '15px 24px',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
            cursor: 'pointer',
            boxShadow: '0px 0px 20px 0px rgba(0,0,0,0.05)',
            width: 'full',
          }}>
            <span style={{
              fontFamily: "'Noto Sans JP', sans-serif",
              fontSize: '16px',
              fontWeight: 700,
              color: 'white',
              letterSpacing: '1.6px',
              lineHeight: '2',
              wordWrap: 'break-word',
              overflowWrap: 'break-word',
              textAlign: 'center',
            }}>
              すべての対応リストを見る
            </span>
            <svg width="12" height="12" viewBox="0 0 256 448" fill="none">
              <path d="M17.9 193.2L193.2 17.9C205.8 5.3 226.2 5.3 238.8 17.9L238.9 18C251.5 30.6 251.5 51 238.9 63.6L99.5 203L238.9 342.4C251.5 355 251.5 375.4 238.9 388L238.8 388.1C226.2 400.7 205.8 400.7 193.2 388.1L17.9 212.8C5.3 200.2 5.3 179.8 17.9 167.2L17.9 193.2Z" fill="white" transform="scale(-1,1) translate(-256,0)"/>
            </svg>
          </button>
        </div>
      </div>

      )}

      {/* お知らせセクション - mypageでのみ表示 */}
      {showTodoAndNews && (
      <div style={{ ...headingListStyle, marginBottom: '20px' }}>
        <SectionHeading
          iconSrc='/images/new.svg'
          iconAlt='お知らせアイコン'
        >
          お知らせ
        </SectionHeading>
        
        <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
          {/* お知らせカード */}
          <div style={{
            background: 'white',
            padding: '16px 24px',
            borderRadius: '8px',
            boxShadow: '0px 0px 20px 0px rgba(0,0,0,0.05)',
            display: 'flex',
            flexDirection: 'column',
            gap: '4px',
          }}>
            {/* 日付 */}
            <div style={{
              fontFamily: "'Noto Sans JP', sans-serif",
              fontSize: '10px',
              fontWeight: 500,
              color: '#999999',
              letterSpacing: '1px',
              lineHeight: '1.6',
            }}>
              2025/4/19
            </div>
            
            {/* タイトル */}
            <div style={{
              fontFamily: "'Noto Sans JP', sans-serif",
              fontSize: '16px',
              fontWeight: 700,
              color: '#323232',
              letterSpacing: '1.6px',
              lineHeight: '2',
              height: '63px',
              overflow: 'hidden',
              display: '-webkit-box',
              WebkitLineClamp: 3,
              WebkitBoxOrient: 'vertical',
              wordWrap: 'break-word',
              overflowWrap: 'break-word',
            }}>
              お知らせ情報のタイトルが入ります。お知らせ情報のタイトルが入ります。お知らせ情報のタイトルが入ります。お知らせ情報のタイトルが入ります。
            </div>
          </div>
          
          {/* もっと見るボタン */}
          <button style={{
            background: 'white',
            border: 'none',
            borderRadius: '10px',
            padding: '15px 24px',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
            cursor: 'pointer',
            boxShadow: '0px 0px 20px 0px rgba(0,0,0,0.05)',
            width: "full",
          }}>
            <span style={{
              fontFamily: "'Noto Sans JP', sans-serif",
              fontSize: '16px',
              fontWeight: 700,
              color: '#0F9058',
              letterSpacing: '1.6px',
              lineHeight: '2',
              wordWrap: 'break-word',
              overflowWrap: 'break-word',
              textAlign: 'center',
            }}>
              お知らせ一覧を見る
            </span>
            <svg width="12" height="12" viewBox="0 0 256 448" fill="none">
              <path d="M17.9 193.2L193.2 17.9C205.8 5.3 226.2 5.3 238.8 17.9L238.9 18C251.5 30.6 251.5 51 238.9 63.6L99.5 203L238.9 342.4C251.5 355 251.5 375.4 238.9 388L238.8 388.1C226.2 400.7 205.8 400.7 193.2 388.1L17.9 212.8C5.3 200.2 5.3 179.8 17.9 167.2L17.9 193.2Z" fill="#0F9058" transform="scale(-1,1) translate(-256,0)"/>
            </svg>
          </button>
        </div>
      </div>
      )}

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
            // style={supportBannerStyle}
           
            onClick={() => router.push('/company/support')}
          >
           <img src="/images/consult.svg" />
          </div>
        </div>
      </div>
    </div>
  );
}