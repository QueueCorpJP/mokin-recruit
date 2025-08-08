'use client';

import { useEffect, useState } from 'react';
import { FaqBox } from '@/components/ui/FaqBox';
import { Pagination } from '@/components/ui/Pagination';
import { SectionHeading } from '@/components/ui/SectionHeading';

export default function CandidateTaskPage() {
  // --- レスポンシブ対応: モバイル判定 ---
  const [isMobile, setIsMobile] = useState(false);
  // --- ページネーション用の状態 ---
  const [currentPage, setCurrentPage] = useState(1);
  useEffect(() => {
    const handleResize = () => {
      setIsMobile(window.innerWidth <= 600);
    };
    handleResize();
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  // --- ページ全体ラッパーのスタイル ---
  const pageWrapperStyle: React.CSSProperties = isMobile
    ? {
        paddingTop: '16px',
        paddingRight: '24px',
        paddingBottom: '80px',
        paddingLeft: '24px',
        minHeight: '60vh',
        boxSizing: 'border-box',
        width: '100%',
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        background: '#F9F9F9',
      }
    : {
        paddingTop: '40px',
        paddingRight: '80px',
        paddingBottom: '80px',
        paddingLeft: '80px',
        minHeight: '60vh',
        boxSizing: 'border-box',
        width: '100%',
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        background: '#F9F9F9',
      };

  // --- 中央コンテンツラッパーのスタイル ---
  const contentWrapperStyle: React.CSSProperties = {
    width: '100%',
    maxWidth: '1280px',
    margin: '0 auto',
  };

  // --- 2カラムレイアウトのスタイル ---
  const twoColumnFlexStyle: React.CSSProperties = {
    display: 'flex',
    flexDirection: isMobile ? 'column' : 'row',
    gap: '80px',
    width: '100%',
    justifyContent: 'center',
    alignItems: isMobile ? 'stretch' : 'flex-start',
  };
  // --- 左カラム（メイン） ---
  const mainColumnStyle: React.CSSProperties = {
    maxWidth: '880px',
    padding: isMobile ? '0' : '16px 24px',
    flex: 1,
    boxSizing: 'border-box',
    width: isMobile ? '100%' : undefined,
  };
  // --- 右カラム（サイド） ---
  const sideColumnStyle: React.CSSProperties = {
    maxWidth: isMobile ? 'none' : '320px',
    flex: isMobile ? undefined : '0 0 320px',
    boxSizing: 'border-box',
    width: isMobile ? '100%' : undefined,
  };

  // --- 見出しリスト用ラッパー ---
  const headingListStyle: React.CSSProperties = {
    display: 'flex',
    flexDirection: 'column',
    gap: '8px',
  };

  // --- QAリンクボックス用スタイル ---
  const qaLinkBoxStyle: React.CSSProperties = {
    background: '#fff',
    padding: '15px 24px',
    borderRadius: '8px',
    boxSizing: 'border-box',
    width: '100%',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'space-between',
    cursor: 'pointer',
  };
  const qaLinkTextStyle: React.CSSProperties = {
    fontSize: '16px',
    fontWeight: 700,
    color: '#0F9058',
    lineHeight: '200%',
    margin: 0,
    whiteSpace: 'nowrap',
    overflow: 'hidden',
    textOverflow: 'ellipsis',
    display: 'flex',
    alignItems: 'center',
    gap: '2px',
  };

  // --- やることリスト用ラッパー（縦並び・gap:8px） ---
  const todoListWrapperStyle: React.CSSProperties = {
    display: 'flex',
    flexDirection: 'column',
    gap: '8px',
  };

  // --- やることリストの各アイテム ---
  const todoItemStyle: React.CSSProperties = {
    background: '#FFFFFF',
    padding: '16px 24px',
    boxSizing: 'border-box',
    borderRadius: '8px',
    boxShadow: '0 0 20px rgba(0,0,0,0.05)',
  };
  const todoItemRowStyle: React.CSSProperties = {
    display: 'flex',
    alignItems: 'flex-start',
    gap: '16px',
  };
  const todoTextsWrapperStyle: React.CSSProperties = {
    display: 'flex',
    flexDirection: 'column',
    gap: '4px',
  };
  const todoBodyTextStyle: React.CSSProperties = {
    fontSize: '10px',
    lineHeight: '160%',
    color: '#999999',
    margin: 0,
  };

  return (
    <div style={pageWrapperStyle}>
      <main style={contentWrapperStyle}>
        {/* 2カラムレイアウト: PCは横並び, モバイルは縦並び */}
        <div style={twoColumnFlexStyle}>
          {/* 左カラム（メインコンテンツ） */}
          <div style={mainColumnStyle}>
            <div style={{ marginBottom: '8px' }}>
              <SectionHeading
                iconSrc='/images/list.svg'
                iconAlt='やることリストアイコン'
              >
                やることリスト
              </SectionHeading>
            </div>
            {/* やることリストを格納するラッパー */}
            <div style={todoListWrapperStyle}>
              {/* やることリストのアイテム例 */}
              <div style={todoItemStyle}>
                <div style={todoItemRowStyle}>
                  <img
                    src='/images/check.svg'
                    alt='完了チェック'
                    width={48}
                    height={48}
                    style={{ display: 'block' }}
                  />
                  <div style={todoTextsWrapperStyle}>
                    <span style={qaLinkTextStyle}>やることタイトル</span>
                    <p style={todoBodyTextStyle}>
                      やることの説明テキストが入ります。
                    </p>
                  </div>
                </div>
              </div>
              <div style={todoItemStyle}>
                <div style={todoItemRowStyle}>
                  <img
                    src='/images/check.svg'
                    alt='完了チェック'
                    width={48}
                    height={48}
                    style={{ display: 'block' }}
                  />
                  <div style={todoTextsWrapperStyle}>
                    <span style={qaLinkTextStyle}>やることタイトル</span>
                    <p style={todoBodyTextStyle}>ダミーテキストです。</p>
                  </div>
                </div>
              </div>
              <div style={todoItemStyle}>
                <div style={todoItemRowStyle}>
                  <img
                    src='/images/check.svg'
                    alt='完了チェック'
                    width={48}
                    height={48}
                    style={{ display: 'block' }}
                  />
                  <div style={todoTextsWrapperStyle}>
                    <span style={qaLinkTextStyle}>やることタイトル</span>
                    <p style={todoBodyTextStyle}>ダミーテキストです。</p>
                  </div>
                </div>
              </div>
              <div style={todoItemStyle}>
                <div style={todoItemRowStyle}>
                  <img
                    src='/images/check.svg'
                    alt='完了チェック'
                    width={48}
                    height={48}
                    style={{ display: 'block' }}
                  />
                  <div style={todoTextsWrapperStyle}>
                    <span style={qaLinkTextStyle}>やることタイトル</span>
                    <p style={todoBodyTextStyle}>ダミーテキストです。</p>
                  </div>
                </div>
              </div>
              <div style={todoItemStyle}>
                <div style={todoItemRowStyle}>
                  <img
                    src='/images/check.svg'
                    alt='完了チェック'
                    width={48}
                    height={48}
                    style={{ display: 'block' }}
                  />
                  <div style={todoTextsWrapperStyle}>
                    <span style={qaLinkTextStyle}>やることタイトル</span>
                    <p style={todoBodyTextStyle}>ダミーテキストです。</p>
                  </div>
                </div>
              </div>
              <div style={todoItemStyle}>
                <div style={todoItemRowStyle}>
                  <img
                    src='/images/check.svg'
                    alt='完了チェック'
                    width={48}
                    height={48}
                    style={{ display: 'block' }}
                  />
                  <div style={todoTextsWrapperStyle}>
                    <span style={qaLinkTextStyle}>やることタイトル</span>
                    <p style={todoBodyTextStyle}>ダミーテキストです。</p>
                  </div>
                </div>
              </div>
              <div style={todoItemStyle}>
                <div style={todoItemRowStyle}>
                  <img
                    src='/images/check.svg'
                    alt='完了チェック'
                    width={48}
                    height={48}
                    style={{ display: 'block' }}
                  />
                  <div style={todoTextsWrapperStyle}>
                    <span style={qaLinkTextStyle}>やることタイトル</span>
                    <p style={todoBodyTextStyle}>ダミーテキストです。</p>
                  </div>
                </div>
              </div>
              <div style={todoItemStyle}>
                <div style={todoItemRowStyle}>
                  <img
                    src='/images/check.svg'
                    alt='完了チェック'
                    width={48}
                    height={48}
                    style={{ display: 'block' }}
                  />
                  <div style={todoTextsWrapperStyle}>
                    <span style={qaLinkTextStyle}>やることタイトル</span>
                    <p style={todoBodyTextStyle}>ダミーテキストです。</p>
                  </div>
                </div>
              </div>
              <div style={todoItemStyle}>
                <div style={todoItemRowStyle}>
                  <img
                    src='/images/check.svg'
                    alt='完了チェック'
                    width={48}
                    height={48}
                    style={{ display: 'block' }}
                  />
                  <div style={todoTextsWrapperStyle}>
                    <span style={qaLinkTextStyle}>やることタイトル</span>
                    <p style={todoBodyTextStyle}>ダミーテキストです。</p>
                  </div>
                </div>
              </div>
              <div style={todoItemStyle}>
                <div style={todoItemRowStyle}>
                  <img
                    src='/images/check.svg'
                    alt='完了チェック'
                    width={48}
                    height={48}
                    style={{ display: 'block' }}
                  />
                  <div style={todoTextsWrapperStyle}>
                    <span style={qaLinkTextStyle}>やることタイトル</span>
                    <p style={todoBodyTextStyle}>ダミーテキストです。</p>
                  </div>
                </div>
              </div>
            </div>
            {/* ページネーション（暫定: 5ページ想定） */}
            <div style={{ marginTop: '40px' }}>
              <Pagination
                currentPage={currentPage}
                totalPages={5}
                onPageChange={setCurrentPage}
              />
            </div>
          </div>
          {/* 右カラム（サイドコンテンツ） */}
          <div style={sideColumnStyle}>
            {/* バナー画像を表示 */}
            <img
              src='/images/banner01.png'
              alt='バナー画像01'
              style={{
                width: '100%',
                height: 'auto',
                display: 'block',
                borderRadius: '8px',
                marginBottom: '80px',
              }}
            />
            {/* 見出しリスト（縦並び・gap8px） */}
            <div style={headingListStyle}>
              <SectionHeading
                iconSrc='/images/question.svg'
                iconAlt='よくある質問アイコン'
              >
                よくある質問
              </SectionHeading>
              {/* FAQボックス（共通コンポーネント化） */}
              <FaqBox
                title='退会したい場合はどうすればいいですか？退会手続きの流れを教えてください。'
                body='マイページの「アカウント設定」から「退会」ボタンを押し、画面の案内に従って手続きを進めてください。退会後はすべてのデータが削除されます。'
              />
              <FaqBox
                title='パスワードを忘れた場合はどうすればいいですか？'
                body='ログイン画面の「パスワードをお忘れですか？」リンクから再設定手続きを行ってください。'
              />
              <FaqBox
                title='登録したメールアドレスを変更したいです。'
                body='マイページの「アカウント設定」からメールアドレスの変更が可能です。'
              />
              <FaqBox
                title='求人への応募方法を教えてください。'
                body='求人詳細ページの「応募する」ボタンから応募手続きを進めてください。'
              />
              <FaqBox
                title='企業からのスカウトを受け取るにはどうすればいいですか？'
                body='プロフィールを充実させることで、企業からのスカウトを受けやすくなります。'
              />
              <FaqBox
                title='面接日程の調整はどのように行いますか？'
                body='メッセージ機能を使って企業担当者と直接日程調整が可能です。'
              />
              {/* QA一覧を見るリンクボックス */}
              <div style={qaLinkBoxStyle}>
                <span style={qaLinkTextStyle}>
                  <b>Q&amp;A</b>一覧を見る
                </span>
                <img
                  src='/images/arrow.svg'
                  alt='矢印アイコン'
                  width={8}
                  height={13}
                  style={{ display: 'block', marginLeft: '12px' }}
                />
              </div>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}
